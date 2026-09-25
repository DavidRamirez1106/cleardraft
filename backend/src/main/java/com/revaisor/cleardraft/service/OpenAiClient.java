package com.revaisor.cleardraft.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;

/**
 * Este componente es TODO lo que hace falta para "integrar generative AI" - el resto
 * del proyecto es plomeria alrededor de esta unica llamada HTTP.
 *
 * @Component: le dice a Spring "administra una instancia de esta clase y pasasela a
 * quien la necesite" (esto se llama inyeccion de dependencias - lo veras usado en
 * DraftService, que recibe un OpenAiClient en su constructor sin que nadie haga
 * "new OpenAiClient(...)" a mano en ningun lado).
 */
@Component
public class OpenAiClient {

    private final RestClient restClient;
    private final String model;

    /**
     * @Value("${openai.api.key}") lee el valor de la propiedad "openai.api.key" desde
     * application.properties - y esa propiedad, a su vez, esta configurada para leer la
     * variable de entorno OPENAI_API_KEY (ver application.properties). Asi es como la
     * clave nunca queda escrita en el codigo fuente ni en el repositorio de Git.
     */
    public OpenAiClient(
            @Value("${openai.api.key}") String apiKey,
            @Value("${openai.api.base-url}") String baseUrl,
            @Value("${openai.api.model}") String model
    ) {
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * Manda UN mensaje al modelo y devuelve el texto de su respuesta como String.
     *
     * @param prompt   la instruccion completa que le mandamos al modelo
     * @param jsonMode true para pedirle al modelo que su salida sea JSON valido
     *                 (lo usamos en el prompt del revisor, que necesitamos parsear)
     */
    public String complete(String prompt, boolean jsonMode) {
        ChatRequest request = new ChatRequest(
                model,
                List.of(new ChatMessage("user", prompt)),
                jsonMode ? new ResponseFormat("json_object") : null
        );

        ChatResponse response;
        try {
            response = restClient.post()
                    .uri("/chat/completions")
                    .body(request)
                    .retrieve()
                    .body(ChatResponse.class);
        } catch (RestClientException e) {
            // Si OpenAI responde 4xx/5xx (rate limit, clave invalida, etc.), RestClient
            // lanza una excepcion. La envolvemos en la nuestra para que el resto de la
            // app no dependa de los detalles de esta libreria HTTP en particular.
            throw new AiProviderException("Error llamando a la API de IA: " + e.getMessage(), e);
        }

        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            throw new AiProviderException("La API de IA no devolvio ninguna respuesta");
        }

        return response.choices().get(0).message().content();
    }

    // ---------------------------------------------------------------------------
    // Formas minimas del JSON de la API de OpenAI - solo mapeamos los campos que
    // realmente usamos, no la respuesta completa (que trae mucho mas: uso de tokens,
    // ids, etc.). Son records privados porque son un detalle de implementacion de
    // ESTA clase, nadie fuera de aqui deberia depender de ellos directamente.
    // ---------------------------------------------------------------------------

    private record ChatMessage(String role, String content) {
    }

    private record ResponseFormat(String type) {
    }

    @JsonInclude(JsonInclude.Include.NON_NULL) // omite response_format del JSON si es null,
    private record ChatRequest(                 // en vez de mandar "response_format": null
            String model,
            List<ChatMessage> messages,
            @JsonProperty("response_format") ResponseFormat responseFormat
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ChatResponse(List<Choice> choices) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Choice(ChatMessage message) {
    }
}
