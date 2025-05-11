import { Generator } from "../core/generator-base.js"

export class ConiunctioGenerator extends Generator {
  constructor() {
    super({
      id: "coniunctio",
      name: "Coniunctio",
      description: "Dialektyczna integracja przeciwieństw i synteza odrzuconych elementów",
      icon: "fas fa-yin-yang"
    })
  }

  getDefaultParameters() {
    return {
      tension: 6,
      syntheses: ["heglowska", "kontrapunktowa"],
    }
  }

  renderParameters() {
    return `
          <div class="parameter">
              <label for="coniunctio-tension">Napięcie dialektyczne:</label>
              <input type="range" id="coniunctio-tension" data-param="tension" min="1" max="10" value="6">
              <span class="parameter-value">6/10</span>
          </div>
          <div class="parameter">
              <label>Typy syntezy:</label>
              <div class="checkbox-group">
                  <label>
                      <input type="checkbox" data-param="syntheses" data-value="heglowska" checked> Heglowska
                  </label>
                  <label>
                      <input type="checkbox" data-param="syntheses" data-value="nietzscheanska"> Nietzscheańska
                  </label>
                  <label>
                      <input type="checkbox" data-param="syntheses" data-value="kontrapunktowa" checked> Kontrapunktowa
                  </label>
              </div>
          </div>
      `
  }

  generatePrompt(problem, parameters) {
    const { tension, syntheses } = parameters

    let prompt = `Przystępując do epistemicznej transmutacji zagadnienia: "${problem}", `
    prompt += `uruchom Caput Mortuum Resurrecto - narzędzie reaktywacji odrzuconych elementów.\n\n`
    prompt += `Twoje zadanie obejmuje:\n\n`
    prompt += `1. MORTIFICATIO RECENSIO: Przeprowadź inwentaryzację tego, co zostało odrzucone, zmarginalizowane lub pominięte w standardowych analizach zagadnienia.\n\n`
    prompt += `2. PUTREFACTIO CREATIVA: Pozwól, by odrzucone elementy uległy twórczemu rozkładowi, z napięciem dialektycznym ustawionym na poziom ${tension}/10.\n\n`
    prompt += `3. INVERSIO HIERARCHIAE: Przeprowadź eksperyment odwrócenia hierarchii wartości i rozważ, jakie nowe struktury poznawcze mogłyby wyłonić się z takiego odwrócenia.\n\n`
    prompt += `4. CONIUNCTIO: Poszukaj możliwości połączenia przeciwieństw z wykorzystaniem`

    if (syntheses && syntheses.length > 0) {
      prompt += ` następujących typów syntezy:\n`
      syntheses.forEach((type) => {
        prompt += `   * Synteza ${type}\n`
      })
    } else {
      prompt += ` dialektycznej syntezy przeciwieństw.\n`
    }

    prompt += `\n5. LAPIS PHILOSOPHORUM: Zidentyfikuj potencjalne "kamienie filozoficzne" - elementy odrzucone, które mogą okazać się kluczowe dla głębszego zrozumienia zagadnienia.\n\n`

    return prompt
  }
}