// Import przykładowego pluginu
// Importuj istniejące pluginy
//import { StyleSelectorPlugin } from "./examples/style-selector.js"
// Dodaj nowy import
import { PresentationFormatPlugin } from "./presentation-format.js"

// Zaktualizuj rejestr pluginów
export const plugins = {
  // styleSelector: new StyleSelectorPlugin(),
  // Dodaj nowy plugin
  presentationFormat: new PresentationFormatPlugin(),
}

// Metoda do rejestracji nowych pluginów
export function registerPlugin(id, plugin) {
  if (plugins[id]) {
    console.warn(`Plugin o ID ${id} już istnieje i zostanie nadpisany.`)
  }
  plugins[id] = plugin
  return plugin
}
