export class CoagulatioGenerator {
  constructor() {
    this.id = "coagulatio"
    this.name = "Coagulatio"
    this.description =
      "Citrinias/Rubedo - Pragmatyczna translacja wglądów w konkretne działania i implementacje"
    this.icon = "fas fa-hammer"
  }

  initialize(app) {
    this.app = app
  }

  getDefaultParameters() {
    return {
      temporalScope: "krotkoterminowy",
      systemLevel: "interpersonalny",
    }
  }

  renderParameters() {
    return `
          <div class="parameter">
              <label for="coagulatio-scope">Zakres temporalny:</label>
              <div class="option-group">
                  <label>
                      <input type="radio" name="temporal-scope" data-param="temporalScope" data-value="krotkoterminowy" checked> Krótkoterminowy
                  </label>
                  <label>
                      <input type="radio" name="temporal-scope" data-param="temporalScope" data-value="srednioterminowy"> Średnioterminowy
                  </label>
                  <label>
                      <input type="radio" name="temporal-scope" data-param="temporalScope" data-value="dlugoterminowy"> Długoterminowy
                  </label>
              </div>
          </div>
          <div class="parameter">
              <label for="coagulatio-level">Poziom systemowy:</label>
              <select id="coagulatio-level" data-param="systemLevel">
                  <option value="indywidualny">Indywidualny</option>
                  <option value="interpersonalny" selected>Interpersonalny</option>
                  <option value="organizacyjny">Organizacyjny</option>
                  <option value="spoleczny">Społeczny</option>
              </select>
          </div>
      `
  }

  generatePrompt(problem, parameters) {
    const { temporalScope, systemLevel } = parameters

    let temporalName
    switch (temporalScope) {
      case "krotkoterminowy":
        temporalName = "krótkoterminowym (Opus Minor)"
        break
      case "srednioterminowy":
        temporalName = "średnioterminowym (Opus Medium)"
        break
      case "dlugoterminowy":
        temporalName = "długoterminowym (Opus Magnum)"
        break
      default:
        temporalName = "krótkoterminowym (Opus Minor)"
    }

    let prompt = `Przystępując do epistemicznej transmutacji zagadnienia: "${problem}", `
    prompt += `uruchom Praxis Hermetica - narzędzie transformacji lotnych esencji w materialne manifestacje.\n\n`
    prompt += `Twoje zadanie obejmuje:\n\n`
    prompt += `1. FIXATIO: Określ praktyczne manifestacje w wymiarze temporalnym ${temporalName}.\n\n`
    prompt += `2. MULTIPLICATIO: Zidentyfikuj potencjalne punkty dźwigni na poziomie systemowym "${systemLevel}", gdzie minimalna interwencja może prowadzić do maksymalnej amplifikacji efektu.\n\n`
    prompt += `3. FERMENTATIO: Określ warunki, w których zidentyfikowane praktyki mogą podlegać organicznemu rozwojowi i transformacji.\n\n`
    prompt += `4. PROJECTIO: Przeprowadź myślowy eksperyment implementacji, uwzględniając potencjalne transmutacje niezamierzone, systemowe sprzężenia zwrotne i prognostyczne scenariusze ewolucji praktyk.\n\n`
    prompt += `5. RUBEDO: Określ wskaźniki osiągnięcia "czerwienienia" - stanu, w którym praktyka osiąga dojrzałość i autonomiczną żywotność.\n\n`

    return prompt
  }
}
