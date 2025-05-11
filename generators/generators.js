import { SeparatioGenerator } from "./separatio.js"
import { CoagulatioGenerator } from "./coagulatio.js"
import { ConiunctioGenerator } from "./coniunctio.js"

// Rejestr wszystkich generatorów
export const generators = {
  separatio: new SeparatioGenerator(),
  coagulatio: new CoagulatioGenerator(),
  coniunctio: new ConiunctioGenerator(),
}

// Metoda do rejestracji nowych generatorów
export function registerGenerator(id, generator) {
  if (generators[id]) {
    console.warn(`Generator o ID ${id} już istnieje i zostanie nadpisany.`)
  }
  generators[id] = generator
  return generator
}
