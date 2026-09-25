package com.revaisor.cleardraft.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.revaisor.cleardraft.dto.DraftRequest;
import com.revaisor.cleardraft.dto.DraftResponse;
import com.revaisor.cleardraft.dto.ReviewResult;
import com.revaisor.cleardraft.model.Interaction;
import com.revaisor.cleardraft.model.Preset;
import com.revaisor.cleardraft.model.PresetPrompts;
import com.revaisor.cleardraft.repository.InteractionRepository;
import org.springframework.stereotype.Service;

/**
 * El orquestador de todo el flujo. @Service marca esta clase como "logica de negocio"
 * (una capa intermedia entre el Controller, que solo sabe de HTTP, y las cosas externas
 * como OpenAiClient o la base de datos).
 *
 * Esta clase es la respuesta completa a "¿como implementaste la IA?": arma el prompt 1,
 * llama al modelo, arma el prompt 2 CON la salida del paso anterior, llama al modelo de
 * nuevo, guarda el resultado, y devuelve todo junto. Nada mas.
 */
@Service
public class DraftService {

    private final OpenAiClient openAiClient;
    private final InteractionRepository interactionRepository;
    private final ObjectMapper objectMapper;

    // Inyeccion por constructor: Spring ve que DraftService necesita estas 3 cosas y
    // se las pasa solo (las 3 estan anotadas @Component/@Service/@Repository en algun
    // lado, asi que Spring ya sabe como crearlas). Es la forma recomendada de inyectar
    // dependencias en Spring moderno - nunca @Autowired en un campo.
    public DraftService(
            OpenAiClient openAiClient,
            InteractionRepository interactionRepository,
            ObjectMapper objectMapper
    ) {
        this.openAiClient = openAiClient;
        this.interactionRepository = interactionRepository;
        this.objectMapper = objectMapper;
    }

    public DraftResponse generateDraft(DraftRequest request) {
        Preset preset = Preset.fromId(request.preset());

        // --- Paso 1: generar el borrador ---
        String generatorPrompt = preset.buildGeneratorPrompt(request.brief(), request.tone());
        String draft = openAiClient.complete(generatorPrompt, false);

        // --- Paso 2: revisar el borrador ---
        // OJO: el prompt del revisor recibe `draft` (lo que acabamos de generar), NUNCA
        // el brief original. Es la decision de diseno central de todo el proyecto.
        String reviewerPrompt = PresetPrompts.buildReviewerPrompt(draft);
        String reviewJson = openAiClient.complete(reviewerPrompt, true);
        ReviewResult review = parseReview(reviewJson);

        // --- Paso 3: guardar la interaccion (bonus de storage) ---
        interactionRepository.save(new Interaction(
                preset.getId(), request.brief(), draft, review.riskLevel(), reviewJson
        ));

        return new DraftResponse(draft, review);
    }

    /**
     * Convierte el string JSON que devolvio el modelo en un objeto ReviewResult.
     * Le pedimos response_format=json_object en OpenAiClient.complete(), pero un LLM
     * nunca es 100% garantizado - si algun dia el modelo devuelve algo que no parsea,
     * preferimos fallar con un error claro (AiProviderException) en vez de que el
     * usuario reciba un 500 generico sin explicacion.
     */
    private ReviewResult parseReview(String reviewJson) {
        try {
            return objectMapper.readValue(reviewJson, ReviewResult.class);
        } catch (JsonProcessingException e) {
            throw new AiProviderException(
                    "El modelo no devolvio un JSON de revision valido: " + e.getMessage(), e
            );
        }
    }
}
