"use client";
// Context de React para el idioma de la interfaz. Con solo `page.tsx` como consumidor
// directo del estado (los demas componentes reciben `t` ya resuelto por props, ver el
// comentario en page.tsx) casi alcanzaba con un solo useState ahi mismo - pero el
// toggle vive en el header (dentro de Home) y layout.tsx necesita sincronizar
// <html lang="...">, asi que un Context evita tener que pasar props a traves de layout.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { TRANSLATIONS, type Translations } from "./i18n";
import type { Language } from "./types";

const STORAGE_KEY = "cleardraft:language";

interface LanguageContextValue {
  language: Language;
  t: Translations;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Arrancamos siempre en "es" - coincide con el <html lang="es"> que layout.tsx manda
  // desde el servidor, asi el primer render del cliente coincide con el HTML que ya
  // llego del servidor (si arrancaramos leyendo localStorage de una, React tiraria un
  // warning de "hydration mismatch" apenas el valor guardado fuera "en"). Recien en el
  // useEffect de abajo (que solo corre en el navegador) leemos la preferencia guardada -
  // mismo patron que ya usa esta app para cargar el historial (ver page.tsx).
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "es" || saved === "en") {
        // Mismo caso que el useEffect de carga de historial en page.tsx: leer una
        // preferencia guardada (aca, localStorage; alla, el backend) solo se puede
        // saber DESPUES del primer render (en el navegador), asi que sincronizar el
        // estado con lo leido tiene que pasar en un efecto. La regla asume el patron
        // "Suspense/use()", que no aplica bien a localStorage.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguageState(saved);
      }
    } catch {
      // localStorage puede fallar (modo privado, cookies de terceros bloqueadas, etc.) -
      // si pasa, nos quedamos con "es" y listo, no es un error critico para la app.
    }
  }, []);

  // Mantiene <html lang="..."> sincronizado con el idioma elegido - importa para
  // accesibilidad (lectores de pantalla) y para que el navegador ofrezca traducir la
  // pagina al idioma correcto si el usuario lo pide.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(next: Language) {
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Si no se puede guardar, el toggle sigue funcionando para esta sesion - solo no
      // se recuerda la proxima vez que el usuario entre.
    }
  }

  return (
    <LanguageContext.Provider value={{ language, t: TRANSLATIONS[language], setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage() debe usarse dentro de un <LanguageProvider>");
  }
  return ctx;
}
