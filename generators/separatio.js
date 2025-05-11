export class SeparatioGenerator {
  constructor() {
    this.id = "separatio"
    this.name = "Separatio"
    this.description =
      "Nigredo/Albedo - Analityczny rozkład na fundamentalne elementy i procesy destylacji"
    this.icon = "fas fa-mortar-pestle"
  }

  initialize(app) {
    // Opcjonalne połączenie z aplikacją po inicjalizacji
    this.app = app
  }

  getDefaultParameters() {
    return {
      depth: 7,
      fires: [
        "ontologiczna",
        "epistemologiczna",
        "aksjologiczna",
        "pragmatyczna",
        "systemowa",
        "historyczna",
        "apofatyczna",
      ],
    }
  }

  renderParameters() {
    return `
          <div class="parameter">
              <label for="separatio-depth">Głębia analizy:</label>
              <input type="range" id="separatio-depth" data-param="depth" min="1" max="10" value="7">
              <span class="parameter-value">7/10</span>
          </div>
          <div class="parameter">
              <label>Perspektywy epistemiczne (ognie analityczne):</label>
              <div class="checkbox-group">
                  <label data-tooltip="Pytanie o naturę bytu, istotę, status ontologiczny">
                      <input type="checkbox" data-param="fires" data-value="ontologiczna" checked> Ontologiczna
                  </label>
                  <label data-tooltip="Pytanie o fundamenty poznania, granice wiedzy">
                      <input type="checkbox" data-param="fires" data-value="epistemologiczna" checked> Epistemologiczna
                  </label>
                  <label data-tooltip="Pytanie o wartości, hierarchie i wymiar etyczny">
                      <input type="checkbox" data-param="fires" data-value="aksjologiczna" checked> Aksjologiczna
                  </label>
                  <label data-tooltip="Pytanie o konsekwencje, użyteczność, praktykę">
                      <input type="checkbox" data-param="fires" data-value="pragmatyczna" checked> Pragmatyczna
                  </label>
                  <label data-tooltip="Pytanie o relacje, wzorce, emergencje, systemy">
                      <input type="checkbox" data-param="fires" data-value="systemowa" checked> Systemowa
                  </label>
                  <label data-tooltip="Pytanie o genezę, ewolucję, rozwój w czasie">
                      <input type="checkbox" data-param="fires" data-value="historyczna" checked> Historyczna
                  </label>
                  <label data-tooltip="Pytanie o to, czym zjawisko nie jest (via negativa)">
                      <input type="checkbox" data-param="fires" data-value="apofatyczna" checked> Apofatyczna
                  </label>
              </div>
          </div>
      `
  }

  generatePrompt(problem, parameters) {
    const { depth, fires } = parameters

    let prompt = `Przystępując do epistemicznej transmutacji zagadnienia: "${problem}", `
    prompt += `uruchom Primordialis Alembicus - narzędzie separacji esencji od przypadłości.\n\n`
    prompt += `Twoje zadanie obejmuje:\n\n`
    prompt += `1. MATERIA PRIMA: Zidentyfikuj substrat epistemiczny (fundamentalne elementy zagadnienia, ich naturę i wzajemne relacje).\n\n`
    prompt += `2. CALCINATIO: Aplikuj następujące ognie analityczne do badanej materii:\n`

    if (fires && fires.length > 0) {
      fires.forEach((fire) => {
        if (fire === "ontologiczna") {
          prompt += `   * Ogień ontologiczny (pytanie o naturę bytu)\n`
        } else if (fire === "epistemologiczna") {
          prompt += `   * Ogień epistemologiczny (pytanie o fundamenty poznania)\n`
        } else if (fire === "aksjologiczna") {
          prompt += `   * Ogień aksjologiczny (pytanie o wartości i hierarchie)\n`
        } else if (fire === "pragmatyczna") {
          prompt += `   * Ogień pragmatyczny (pytanie o konsekwencje i użyteczność)\n`
        } else if (fire === "systemowa") {
          prompt += `   * Ogień systemowy (pytanie o relacje i emergencje)\n`
        } else if (fire === "historyczna") {
          prompt += `   * Ogień historyczny (pytanie o genezę i ewolucję)\n`
        } else if (fire === "apofatyczna") {
          prompt += `   * Ogień apofatyczny (pytanie o to, czym zjawisko nie jest)\n`
        }
      })
    }

    prompt += `\n3. SEPARATIO: Przeprowadź proceduralną destylację z głębią analityczną ${depth}/10, uwzględniając:\n`
    prompt += `   * Oddzielenie elementów esencjalnych od przypadkowych\n`
    prompt += `   * Rozpoznanie elementów lotnych (zmiennych) od utrwalonych (stałych)\n`
    prompt += `   * Identyfikację proporcji elementarnych w badanym fenomenie\n\n`
    prompt += `4. SOLUTIO: Rozpuść uzyskane esencje w rozpuszczalniku kontekstualnym, obserwując ich zachowanie w różnych środowiskach konceptualnych.\n\n`
    prompt += `5. QUINTESSENTIA: Wyodrębnij quintessencję - esencję piątego rzędu transcendującą cztery żywioły.\n\n`

    return prompt
  }
}
