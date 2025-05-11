/**
 * SublimationGenerator - Generator typu Sublimatio (Citrinas/Rubedo)
 *
 * Odpowiada za transcendencję problemu na wyższy poziom abstrakcji.
 * Wykorzystuje klasę bazową Generator.
 */
import { Generator } from "../core/generator-base.js"

export class SublimationGenerator extends Generator {
  /**
   * Konstruktor generatora Sublimatio
   */
  constructor() {
    super({
      id: "sublimatio",
      name: "Sublimatio",
      description:
        "Citrinas/Rubedo - Transcendencja problemu na wyższy poziom abstrakcji i transformacja",
      icon: "fas fa-wind",
    })
  }

  /**
   * Zwraca domyślne parametry generatora
   * @return {Object} Obiekt z domyślnymi parametrami
   * @override
   */
  getDefaultParameters() {
    return {
      intensity: 7,
      dimensions: ["transcendencja", "metafora", "analogia", "integracja"],
      temporalScope: "holistyczny",
      systemLevel: "systemowy",
    }
  }

  /**
   * Renderuje kontrolki parametrów dla generatora
   * @return {string} HTML kontrolek parametrów
   * @override
   */
  renderParameters() {
    return `
          <div class="parameter">
              <label for="sublimatio-intensity">Intensywność procesu sublimacji:</label>
              <input type="range" id="sublimatio-intensity" data-param="intensity" min="1" max="10" value="7">
              <span class="parameter-value">7/10</span>
          </div>
          
          <div class="parameter">
              <label>Wymiary sublimacji:</label>
              <div class="checkbox-group">
                  <label data-tooltip="Wznoszenie problemu na wyższy poziom abstrakcji">
                      <input type="checkbox" data-param="dimensions" data-value="transcendencja" checked> Transcendencja
                  </label>
                  <label data-tooltip="Wykorzystanie metafor do przeformułowania problemu">
                      <input type="checkbox" data-param="dimensions" data-value="metafora" checked> Metafora
                  </label>
                  <label data-tooltip="Wykorzystanie analogii z innych dziedzin">
                      <input type="checkbox" data-param="dimensions" data-value="analogia" checked> Analogia
                  </label>
                  <label data-tooltip="Integracja różnych perspektyw w nową całość">
                      <input type="checkbox" data-param="dimensions" data-value="integracja" checked> Integracja
                  </label>
                  <label data-tooltip="Dostrzeganie wzorców synchronicznych">
                      <input type="checkbox" data-param="dimensions" data-value="synchroniczność"> Synchroniczność
                  </label>
                  <label data-tooltip="Transformacja paradoksów w syntezę">
                      <input type="checkbox" data-param="dimensions" data-value="paradoks"> Paradoks
                  </label>
              </div>
          </div>
          
          <div class="parameter">
              <label>Zakres temporalny:</label>
              <div class="option-group">
                  <label>
                      <input type="radio" name="temporalScope" data-param="temporalScope" data-value="krótkoterminowy"> Krótkoterminowy
                  </label>
                  <label>
                      <input type="radio" name="temporalScope" data-param="temporalScope" data-value="długoterminowy"> Długoterminowy
                  </label>
                  <label>
                      <input type="radio" name="temporalScope" data-param="temporalScope" data-value="holistyczny" checked> Holistyczny
                  </label>
              </div>
          </div>
          
          <div class="parameter">
              <label for="system-level">Poziom systemowy:</label>
              <select id="system-level" data-param="systemLevel">
                  <option value="indywidualny">Indywidualny</option>
                  <option value="interpersonalny">Interpersonalny</option>
                  <option value="społeczny">Społeczny</option>
                  <option value="systemowy" selected>Systemowy</option>
                  <option value="kosmiczny">Kosmiczny</option>
              </select>
          </div>
      `
  }

  /**
   * Generuje prompt na podstawie problemu i parametrów
   * @param {string} problem - Problem do przetworzenia
   * @param {Object} parameters - Parametry do użycia
   * @return {string} Wygenerowany prompt
   * @override
   */
  generatePrompt(problem, parameters) {
    const { intensity, dimensions, temporalScope, systemLevel } = parameters

    let prompt = `Przystępując do epistemicznej sublimacji zagadnienia: "${problem}", `
    prompt += `uruchom procedurę Sublimatio - oczyszczanie i wznoszenie esencji na wyższy poziom.\n\n`
    prompt += `Twoje zadanie obejmuje:\n\n`
    prompt += `1. ASCENSIO: Wznieś esencję problemu na wyższy poziom abstrakcji z intensywnością ${intensity}/10, `
    prompt += `zachowując zakres temporalny: ${temporalScope}.\n\n`

    prompt += `2. TRANSMUTATIO: Poddaj problem transmutacji poprzez następujące wymiary sublimacji:\n`

    if (dimensions && dimensions.length > 0) {
      dimensions.forEach((dimension) => {
        if (dimension === "transcendencja") {
          prompt += `   * Transcendencja: wzniesienie problemu ponad jego obecne uwarunkowania\n`
        } else if (dimension === "metafora") {
          prompt += `   * Metafora: przeformułowanie problemu przy użyciu nośnych metafor\n`
        } else if (dimension === "analogia") {
          prompt += `   * Analogia: znalezienie analogicznych struktur w odległych dziedzinach\n`
        } else if (dimension === "integracja") {
          prompt += `   * Integracja: synteza różnorodnych perspektyw w nową całość\n`
        } else if (dimension === "synchroniczność") {
          prompt += `   * Synchroniczność: dostrzeżenie nieprzypadkowych zbieżności i wzorców\n`
        } else if (dimension === "paradoks") {
          prompt += `   * Paradoks: wykorzystanie paradoksów jako punktu wyjścia do transformacji\n`
        }
      })
    }

    prompt += `\n3. ELEVATIO: Przedstaw problem w kontekście poziomu systemowego: ${systemLevel}, ujawniając nowe wymiary rozumienia.\n\n`
    prompt += `4. ILLUMINATIO: Oświetl problem z nowej perspektywy, ujawniając ukryte wzorce i niewykorzystany potencjał rozwiązań.\n\n`
    prompt += `5. MULTIPLICATIO: Zaproponuj transformacyjne podejścia wykorzystujące nowy, wyższy poziom rozumienia problemu.\n\n`

    return prompt
  }
}
