// Import przykładowego pluginu
// import { StyleSelectorPlugin } from './examples/style-selector.js';

// Rejestr pluginów (początkowo pusty)
export const plugins = {
  // styleSelector: new StyleSelectorPlugin()
}

// Metoda do rejestracji nowych pluginów
export function registerPlugin(id, plugin) {
  if (plugins[id]) {
    console.warn(`Plugin o ID ${id} już istnieje i zostanie nadpisany.`)
  }
  plugins[id] = plugin
  return plugin
}
