/**
 * Rejestr generatorów promptów dla Simplex Atanor
 *
 * Ten plik służy jako centralny punkt rejestracji wszystkich dostępnych generatorów.
 * Dzięki modularnej architekturze, dodawanie nowych generatorów wymaga jedynie ich
 * zaimportowania i dodania do obiektu generators.
 */

// Import generatorów zrefaktoryzowanych używających nowej klasy bazowej
import { SeparatioGenerator } from "./separatio-refactored.js"
// Import istniejących generatorów (wciąż do refaktoryzacji)
import { CoagulatioGenerator } from "./coagulatio.js"
import { ConiunctioGenerator } from "./coniunctio.js"
// Import nowego generatora
import { SublimationGenerator } from "./sublimatio.js"

/**
 * Rejestr wszystkich generatorów dostępnych w aplikacji
 * Każdy klucz odpowiada identyfikatorowi generatora
 */
export const generators = {
  separatio: new SeparatioGenerator(),
  coagulatio: new CoagulatioGenerator(),
  coniunctio: new ConiunctioGenerator(),
  sublimatio: new SublimationGenerator(),
}

/**
 * Metoda umożliwiająca programatyczne rejestrowanie generatorów
 * Przydatna dla zewnętrznych modułów i rozszerzeń
 *
 * @param {string} id - Unikalny identyfikator generatora
 * @param {Generator} generator - Instancja generatora do zarejestrowania
 * @return {Generator} Zarejestrowany generator
 */
export function registerGenerator(id, generator) {
  if (generators[id]) {
    console.warn(`Generator o ID ${id} już istnieje i zostanie nadpisany.`)
  }
  generators[id] = generator
  return generator
}
