import type { Translations } from "./i18n";
import type { ApiError, DraftRequest, DraftResponse, InteractionSummary } from "./types";

// NEXT_PUBLIC_ es un prefijo especial de Next.js: cualquier variable de entorno que
// empiece asi queda incluida en el codigo que se manda al NAVEGADOR (las que no tienen
// ese prefijo solo existen del lado del servidor). Como esta URL no es secreta -
// cualquiera puede verla igual con las herramientas de desarrollador del navegador - es
// seguro exponerla asi. La API key de OpenAI, en cambio, JAMAS lleva este prefijo:
// vive solo en el backend (ver application.properties del backend).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/**
 * Manda el brief al backend y espera el borrador + la revision.
 * Lanza un Error con un mensaje legible si el backend responde un error - lo capturamos
 * en el componente que llama a esta funcion para mostrarlo en la UI.
 *
 * `t` es el diccionario del idioma activo (ver lib/i18n.ts), solo para el mensaje de
 * fallback cuando el backend no manda un `message` propio. OJO: el `message` que SI
 * manda el backend (validaciones de Bean Validation, "Preset desconocido: ...", etc.)
 * esta hardcodeado en espanol del lado del backend - traducir esos mensajes de error
 * tambien requeriria i18n en el backend (Spring MessageSource), que quedo fuera del
 * alcance de este cambio.
 */
export async function fetchDraft(
  request: DraftRequest,
  t: Translations
): Promise<DraftResponse> {
  const response = await fetch(`${API_BASE_URL}/api/draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody: ApiError | null = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? t.errors.serverStatus(response.status));
  }

  return response.json();
}

/** Trae las ultimas interacciones guardadas (bonus de storage). */
export async function fetchHistory(): Promise<InteractionSummary[]> {
  const response = await fetch(`${API_BASE_URL}/api/history`);

  if (!response.ok) {
    throw new Error("No se pudo cargar el historial");
  }

  return response.json();
}
