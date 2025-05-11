/**
 * Rejestr pluginów dla Simplex Atanor
 *
 * Ten plik służy jako centralny punkt rejestracji wszystkich dostępnych pluginów.
 * Dzięki modularnej architekturze, dodawanie nowych pluginów wymaga jedynie ich
 * zaimportowania i dodania do obiektu plugins.
 */

// Import pluginów zrefaktoryzowanych używających nowej klasy bazowej
import { PresentationFormatPlugin } from "./presentation-format-refactored.js"

/**
 * Rejestr wszystkich pluginów dostępnych w aplikacji
 * Każdy klucz odpowiada identyfikatorowi pluginu
 */
export const plugins = {
  presentationFormat: new PresentationFormatPlugin(),
}

/**
 * Metoda umożliwiająca programatyczne rejestrowanie pluginów
 * Przydatna dla zewnętrznych modułów i rozszerzeń
 *
 * @param {string} id - Unikalny identyfikator pluginu
 * @param {Plugin} plugin - Instancja pluginu do zarejestrowania
 * @return {Plugin} Zarejestrowany plugin
 */
export function registerPlugin(id, plugin) {
  if (plugins[id]) {
    console.warn(`Plugin o ID ${id} już istnieje i zostanie nadpisany.`)
  }
  plugins[id] = plugin
  return plugin
}
