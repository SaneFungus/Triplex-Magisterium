/**
 * QUATERNIO TRANSMUTATIONIS
 * System Operacyjny Epistemicznych Transmutacji
 * Implementacja JavaScript dla integracji z Triplex Magisterium
 */

class QuaternioTransmutationis {
  constructor() {
    // Stan systemu
    this.state = {
      activeDimension: "circulus", // Domyślny wymiar
      liminalSpace: "none", // Brak przestrzeni liminalnej
      operationMode: "sequentialis", // Domyślny tryb operacyjny
      sequenceIndex: 0, // Indeks w sekwencji
      transformationHistory: [], // Historia transmutacji
      verificationStatus: "pending", // Status weryfikacji
    }

    // Sekwencje dla różnych trybów operacyjnych
    this.sequences = {
      sequentialis: ["circulus", "dissolutio", "implementatio", "recursio"],
      dialecticus: {
        circulus: ["circulus", "dissolutio", "circulus", "dissolutio"],
        dissolutio: [
          "dissolutio",
          "implementatio",
          "dissolutio",
          "implementatio",
        ],
        implementatio: [
          "implementatio",
          "recursio",
          "implementatio",
          "recursio",
        ],
        recursio: ["recursio", "circulus", "recursio", "circulus"],
      },
      chaoticus: this._generateChaoticSequence(),
    }

    // Mapowanie między wymiarami a przestrzeniami liminalnymi
    this.liminalMappings = {
      memoria: ["circulus", "dissolutio"],
      incarnatio: ["circulus", "implementatio"],
      symbolum: ["circulus", "recursio"],
      critica: ["dissolutio", "implementatio"],
      genealogia: ["dissolutio", "recursio"],
      systema: ["implementatio", "recursio"],
    }

    // Inicjalizacja systemu
    this._initialize()
  }

  /**
   * Inicjalizacja systemu Quaternio
   * @private
   */
  _initialize() {
    // Elementy DOM
    this.elements = {
      dimensionCards: document.querySelectorAll(".wymiar-card"),
      liminalSelector: document.getElementById("liminal-space"),
      modeRadios: document.querySelectorAll('input[name="operation-mode"]'),
      statusIndicator: document.getElementById("quaternio-status"),
    }

    // Dodanie nasłuchiwaczy zdarzeń
    this._attachEventListeners()

    // Inicjalizacja pierwszego wymiaru
    if (this.elements.dimensionCards.length > 0) {
      this.elements.dimensionCards[0].classList.add("active")
      this._updateLiminalSpaces("circulus")
    }

    console.log("Quaternio Transmutationis zainicjalizowany.")
  }

  /**
   * Dołączanie nasłuchiwaczy zdarzeń do elementów interfejsu
   * @private
   */
  _attachEventListeners() {
    // Nasłuchiwanie kliknięć w karty wymiarów
    this.elements.dimensionCards.forEach((card) => {
      card.addEventListener("click", () => {
        this.elements.dimensionCards.forEach((c) =>
          c.classList.remove("active")
        )
        card.classList.add("active")

        const dimension = card.getAttribute("data-wymiar")
        this.state.activeDimension = dimension
        this._updateLiminalSpaces(dimension)
        this._updateStatus()
      })
    })

    // Nasłuchiwanie zmian w selektorze przestrzeni liminalnych
    if (this.elements.liminalSelector) {
      this.elements.liminalSelector.addEventListener("change", () => {
        this.state.liminalSpace = this.elements.liminalSelector.value
        this._updateStatus()
      })
    }

    // Nasłuchiwanie zmian trybu operacyjnego
    this.elements.modeRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          this.state.operationMode = radio.value
          this.state.sequenceIndex = 0
          this._updateStatus()
        }
      })
    })
  }

  /**
   * Aktualizacja dostępnych przestrzeni liminalnych na podstawie aktywnego wymiaru
   * @param {string} activeDimension - Aktywny wymiar epistemiczny
   * @private
   */
  _updateLiminalSpaces(activeDimension) {
    if (!this.elements.liminalSelector) return

    const options = this.elements.liminalSelector.querySelectorAll("option")
    options.forEach((option) => {
      if (option.value === "none") return

      const liminalSpace = option.value
      const isRelevant = this._isLiminalSpaceRelevant(
        liminalSpace,
        activeDimension
      )

      option.disabled = !isRelevant
      if (!isRelevant && option.selected) {
        this.elements.liminalSelector.value = "none"
        this.state.liminalSpace = "none"
      }
    })
  }

  /**
   * Sprawdzanie czy przestrzeń liminalna jest istotna dla wybranego wymiaru
   * @param {string} space - Przestrzeń liminalna
   * @param {string} dimension - Wymiar epistemiczny
   * @returns {boolean} - Czy przestrzeń jest istotna
   * @private
   */
  _isLiminalSpaceRelevant(space, dimension) {
    return (
      this.liminalMappings[space] &&
      this.liminalMappings[space].includes(dimension)
    )
  }

  /**
   * Generowanie pseudo-losowej sekwencji dla trybu chaotycznego
   * @returns {Array} - Sekwencja wymiarów
   * @private
   */
  _generateChaoticSequence() {
    const dimensions = ["circulus", "dissolutio", "implementatio", "recursio"]
    const sequence = []

    // Generowanie 16-elementowej sekwencji
    for (let i = 0; i < 16; i++) {
      // Wprowadzenie elementu nieliniowości przez wybór na podstawie indeksu
      const baseIndex = i % 4
      const offset = Math.floor(Math.sin(i * 1.618) * 2.5) // Użycie złotego podziału dla większej "organiczności"
      const index = (baseIndex + offset + 4) % 4
      sequence.push(dimensions[index])
    }

    return sequence
  }

  /**
   * Przejście do następnego wymiaru w sekwencji
   * @public
   */
  advanceSequence() {
    if (this.state.operationMode === "sequentialis") {
      this.state.sequenceIndex =
        (this.state.sequenceIndex + 1) % this.sequences.sequentialis.length
      this.state.activeDimension =
        this.sequences.sequentialis[this.state.sequenceIndex]
    } else if (this.state.operationMode === "dialecticus") {
      this.state.sequenceIndex =
        (this.state.sequenceIndex + 1) %
        this.sequences.dialecticus[this.state.activeDimension].length
      this.state.activeDimension =
        this.sequences.dialecticus[this.state.activeDimension][
          this.state.sequenceIndex
        ]
    } else if (this.state.operationMode === "chaoticus") {
      this.state.sequenceIndex =
        (this.state.sequenceIndex + 1) % this.sequences.chaoticus.length
      this.state.activeDimension =
        this.sequences.chaoticus[this.state.sequenceIndex]
    }

    // Aktualizacja interfejsu
    this._updateInterfaceForDimension()
    this._updateStatus()

    return this.state.activeDimension
  }

  /**
   * Aktualizacja interfejsu na podstawie aktualnego wymiaru
   * @private
   */
  _updateInterfaceForDimension() {
    // Aktualizacja aktywnej karty wymiaru
    this.elements.dimensionCards.forEach((card) => {
      const dimension = card.getAttribute("data-wymiar")
      if (dimension === this.state.activeDimension) {
        card.classList.add("active")
      } else {
        card.classList.remove("active")
      }
    })

    // Aktualizacja przestrzeni liminalnych
    this._updateLiminalSpaces(this.state.activeDimension)
  }

  /**
   * Aktualizacja wskaźnika statusu
   * @private
   */
  _updateStatus() {
    if (!this.elements.statusIndicator) return

    let statusText = `Wymiar: ${this._getDimensionLabel(
      this.state.activeDimension
    )}`

    if (this.state.liminalSpace !== "none") {
      statusText += ` | Przestrzeń: ${this._getLiminalSpaceLabel(
        this.state.liminalSpace
      )}`
    }

    statusText += ` | Tryb: ${this._getOperationModeLabel(
      this.state.operationMode
    )}`

    if (this.state.operationMode !== "centralis") {
      statusText += ` | Krok: ${this.state.sequenceIndex + 1}`
    }

    this.elements.statusIndicator.textContent = statusText
  }

  /**
   * Pobranie etykiety dla wymiaru epistemicznego
   * @param {string} dimension - Identyfikator wymiaru
   * @returns {string} - Etykieta wymiaru
   * @private
   */
  _getDimensionLabel(dimension) {
    const labels = {
      circulus: "Circulus Symbolicus",
      dissolutio: "Dissolutio Critica",
      implementatio: "Implementatio Systemica",
      recursio: "Recursio Divergens",
    }
    return labels[dimension] || dimension
  }

  /**
   * Pobranie etykiety dla przestrzeni liminalnej
   * @param {string} space - Identyfikator przestrzeni
   * @returns {string} - Etykieta przestrzeni
   * @private
   */
  _getLiminalSpaceLabel(space) {
    const labels = {
      none: "Brak",
      memoria: "Memoria Critica",
      incarnatio: "Incarnatio Symbolica",
      symbolum: "Symbolum Emergens",
      critica: "Critica Praxis",
      genealogia: "Genealogia Emergentis",
      systema: "Systema Autopoieticum",
    }
    return labels[space] || space
  }

  /**
   * Pobranie etykiety dla trybu operacyjnego
   * @param {string} mode - Identyfikator trybu
   * @returns {string} - Etykieta trybu
   * @private
   */
  _getOperationModeLabel(mode) {
    const labels = {
      sequentialis: "Modus Sequentialis",
      dialecticus: "Modus Dialecticus",
      centralis: "Modus Centralis",
      chaoticus: "Modus Chaoticus",
    }
    return labels[mode] || mode
  }

  /**
   * Generowanie rozszerzenia prompta Quaternio
   * @returns {string} - Rozszerzenie prompta
   * @public
   */
  generatePromptExtension() {
    let extension = "## QUATERNIO TRANSMUTATIONIS\n\n"

    // Dodanie informacji o wybranym wymiarze
    extension += `Aktywowano ${this._getDimensionLabel(
      this.state.activeDimension
    ).toUpperCase()} - `

    switch (this.state.activeDimension) {
      case "circulus":
        extension += "modalność syntetyczno-archetypową.\n"
        extension +=
          "Poszukuj uniwersalnych wzorców i symbolicznych korespondencji w analizowanym zagadnieniu.\n\n"
        break
      case "dissolutio":
        extension += "modalność dekonstrukcyjno-genealogiczną.\n"
        extension +=
          "Przeprowadź krytyczną dekonstrukcję założeń i śledź ich historyczne uwarunkowania.\n\n"
        break
      case "implementatio":
        extension += "modalność ekosystemowo-implementacyjną.\n"
        extension +=
          "Rozważ materialne ucieleśnienie koncepcji w sieci współzależnych relacji.\n\n"
        break
      case "recursio":
        extension += "modalność metakognitywno-dywergencyjną.\n"
        extension +=
          "Generuj nieoczekiwane połączenia, jednocześnie obserwując własne procesy poznawcze.\n\n"
        break
    }

    // Dodanie informacji o przestrzeni liminalnej
    if (this.state.liminalSpace !== "none") {
      extension += `Przestrzeń liminalna: ${this._getLiminalSpaceLabel(
        this.state.liminalSpace
      )} - `
      switch (this.state.liminalSpace) {
        case "memoria":
          extension +=
            "krytyczna analiza symboli w kontekście historycznym.\n\n"
          break
        case "incarnatio":
          extension += "materializacja archetypów w konkretnych formach.\n\n"
          break
        case "symbolum":
          extension +=
            "generowanie nowych symboli poprzez nieoczekiwane asocjacje.\n\n"
          break
        case "critica":
          extension +=
            "implementacja uwzględniająca krytyczną świadomość założeń.\n\n"
          break
        case "genealogia":
          extension += "odkrywanie alternatywnych ścieżek rozwoju.\n\n"
          break
        case "systema":
          extension += "tworzenie systemów zdolnych do samotransformacji.\n\n"
          break
      }
    }

    // Dodanie informacji o trybie operacyjnym
    extension += `Tryb operacyjny: ${this._getOperationModeLabel(
      this.state.operationMode
    )} - `
    switch (this.state.operationMode) {
      case "sequentialis":
        extension +=
          "systematyczne przechodzenie przez kolejne wymiary poznawcze.\n\n"
        break
      case "dialecticus":
        extension += "oscylacja między dwoma wybranymi wymiarami.\n\n"
        break
      case "centralis":
        extension +=
          "jeden wymiar jako centralny, pozostałe jako kontekstualne.\n\n"
        break
      case "chaoticus":
        extension += "algorytmiczne przełączanie między wymiarami.\n\n"
        break
    }

    // Dodanie informacji o integracji z Triplex Magisterium
    const activeMagisterium = document
      .querySelector(".forma-card.active")
      ?.getAttribute("data-forma")
    if (activeMagisterium) {
      extension += `Integracja z Magisterium: ${this._getMagisteriumLabel(
        activeMagisterium
      )}\n`
      extension += this._getIntegrationGuidelines(
        activeMagisterium,
        this.state.activeDimension
      )
    }

    // Dodanie sekwencji kroków dla trybów sekwencyjnych
    if (
      this.state.operationMode === "sequentialis" ||
      this.state.operationMode === "dialecticus" ||
      this.state.operationMode === "chaoticus"
    ) {
      extension += "\nSekwencja kroków transmutacji:\n"

      let sequence = []
      if (this.state.operationMode === "sequentialis") {
        sequence = this.sequences.sequentialis
      } else if (this.state.operationMode === "dialecticus") {
        sequence = this.sequences.dialecticus[this.state.activeDimension]
      } else if (this.state.operationMode === "chaoticus") {
        sequence = this.sequences.chaoticus
      }

      for (let i = 0; i < sequence.length; i++) {
        const step = sequence[i]
        const isCurrentStep = i === this.state.sequenceIndex

        extension += isCurrentStep
          ? `→ [${this._getDimensionLabel(step)}]`
          : `  ${this._getDimensionLabel(step)}`
        extension += i < sequence.length - 1 ? " ⟶ " : ""

        if ((i + 1) % 4 === 0 && i < sequence.length - 1) {
          extension += "\n  "
        }
      }
    }

    return extension
  }

  /**
   * Pobranie etykiety dla magisterium
   * @param {string} magisterium - Identyfikator magisterium
   * @returns {string} - Etykieta magisterium
   * @private
   */
  _getMagisteriumLabel(magisterium) {
    const labels = {
      separatio: "Separatio (Nigredo/Albedo)",
      coagulatio: "Coagulatio (Citrinitas)",
      coniunctio: "Coniunctio (Rubedo)",
    }
    return labels[magisterium] || magisterium
  }

  /**
   * Pobranie wytycznych integracji dla kombinacji magisterium i wymiaru
   * @param {string} magisterium - Identyfikator magisterium
   * @param {string} dimension - Identyfikator wymiaru
   * @returns {string} - Wytyczne integracji
   * @private
   */
  _getIntegrationGuidelines(magisterium, dimension) {
    let guidelines = ""

    if (magisterium === "separatio") {
      switch (dimension) {
        case "circulus":
          guidelines =
            "→ Poszukuj archetypowych wzorców w procesie analitycznej separacji elementów.\n→ Mapuj analizowane elementy na uniwersalne symbole i struktury.\n"
          break
        case "dissolutio":
          guidelines =
            "→ Przeprowadź genealogiczną analizę pochodzenia koncepcji poddawanych separacji.\n→ Dekonstruuj ukryte założenia w procesie identyfikacji esencji.\n"
          break
        case "implementatio":
          guidelines =
            "→ Traktuj separację jako proces zachodzący w szerszym ekosystemie poznawczym.\n→ Identyfikuj systemowe konsekwencje wyodrębnienia poszczególnych elementów.\n"
          break
        case "recursio":
          guidelines =
            "→ Generuj nieoczekiwane perspektywy na proces separacji poprzez metapoznawczą refleksję.\n→ Obserwuj własne procesy kategoryzacji i ich wpływ na wyniki separacji.\n"
          break
      }
    } else if (magisterium === "coagulatio") {
      switch (dimension) {
        case "circulus":
          guidelines =
            "→ Materializuj archetypy w konkretnych manifestacjach praktycznych.\n→ Poszukuj uniwersalnych wzorców dla procesów implementacyjnych.\n"
          break
        case "dissolutio":
          guidelines =
            "→ Krytycznie analizuj założenia leżące u podstaw planowanych implementacji.\n→ Śledź historyczne przykłady podobnych materializacji i ich konsekwencje.\n"
          break
        case "implementatio":
          guidelines =
            "→ Uwzględniaj całość sieci relacji i współzależności w procesie materializacji.\n→ Identyfikuj punkty dźwigni systemowej dla maksymalnej efektywności implementacji.\n"
          break
        case "recursio":
          guidelines =
            "→ Generuj alternatywne ścieżki implementacji poprzez nieoczekiwane asocjacje.\n→ Obserwuj metapoznawczo własne preferencje implementacyjne i ich ograniczenia.\n"
          break
      }
    } else if (magisterium === "coniunctio") {
      switch (dimension) {
        case "circulus":
          guidelines =
            "→ Poszukuj archetypowych wzorców integracji przeciwieństw.\n→ Syntezuj pozorne przeciwieństwa w uniwersalne struktury symboliczne.\n"
          break
        case "dissolutio":
          guidelines =
            "→ Dekonstruuj binarne opozycje przed próbą ich integracji.\n→ Analizuj historyczną ewolucję dychotomii poddawanych syntezie.\n"
          break
        case "implementatio":
          guidelines =
            "→ Rozważaj syntezę jako proces zachodzący w złożonym ekosystemie współzależności.\n→ Identyfikuj systemowe konsekwencje integracji pozornych przeciwieństw.\n"
          break
        case "recursio":
          guidelines =
            "→ Generuj nieoczekiwane możliwości syntez poprzez metakognitywną eksplorację.\n→ Obserwuj własne tendencje do tworzenia i rozwiązywania dychotomii.\n"
          break
      }
    }

    return guidelines
  }

  /**
   * Dodanie wpisu do historii transmutacji
   * @param {string} prompt - Prompt transmutacyjny
   * @param {string} result - Wynik transmutacji
   * @public
   */
  addToHistory(prompt, result) {
    this.state.transformationHistory.push({
      dimension: this.state.activeDimension,
      liminalSpace: this.state.liminalSpace,
      operationMode: this.state.operationMode,
      sequenceIndex: this.state.sequenceIndex,
      timestamp: new Date(),
      prompt: prompt,
      result: result,
    })

    console.log("Dodano wpis do historii transmutacji.")
  }

  /**
   * Weryfikacja spójności rezultatu transmutacji
   * @param {string} result - Wynik transmutacji
   * @returns {Object} - Wynik weryfikacji
   * @public
   */
  verifyCoherence(result) {
    // Implementacja mechanizmu weryfikacji spójności
    // W rzeczywistej implementacji wymagałoby to zaawansowanych
    // algorytmów analizy tekstu lub integracji z modelami językowymi

    // Przykładowa prosta weryfikacja
    const coherenceScore = Math.random() * 10 // 0-10
    const noveltyscore = Math.random() * 10 // 0-10
    const utilityScore = Math.random() * 10 // 0-10

    const status =
      (coherenceScore + noveltyscore + utilityScore) / 3 > 5
        ? "verified"
        : "requires_revision"
    this.state.verificationStatus = status

    return {
      status: status,
      scores: {
        coherence: coherenceScore.toFixed(2),
        novelty: noveltyscore.toFixed(2),
        utility: utilityScore.toFixed(2),
      },
      suggestions:
        status === "verified"
          ? []
          : [
              "Wzmocnij wewnętrzną spójność argumentacji",
              "Pogłęb eksplorację liminalnych przestrzeni między wymiarami",
              "Rozwiń praktyczne implikacje zaprezentowanych koncepcji",
            ],
    }
  }

  /**
   * Eksport aktualnego stanu systemu
   * @returns {Object} - Stan systemu
   * @public
   */
  exportState() {
    return {
      ...this.state,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Import stanu systemu
   * @param {Object} state - Stan systemu do zaimportowania
   * @public
   */
  importState(state) {
    // Walidacja importowanego stanu
    if (!state || !state.activeDimension) {
      console.error("Nieprawidłowy format importowanego stanu.")
      return false
    }

    // Aktualizacja stanu
    this.state = {
      ...this.state,
      ...state,
    }

    // Aktualizacja interfejsu
    this._updateInterfaceForDimension()
    this._updateStatus()

    console.log("Zaimportowano stan systemu.")
    return true
  }
}

/**
 * Inicjalizacja i integracja z istniejącym systemem
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("Quaternio: Inicjalizacja systemu")

  // Sprawdzenie czy główny skrypt Triplex Magisterium został załadowany
  if (typeof window.generatePrompt === "undefined") {
    console.error(
      "Quaternio: Błąd - funkcja generatePrompt nie została znaleziona. Ładowanie systemu Quaternio zostanie wstrzymane do kolejnego odświeżenia strony."
    )
    return
  }

  console.log("Quaternio: Funkcja generatePrompt znaleziona w obiekcie window.")

  // Inicjalizacja systemu Quaternio
  const quaternio = new QuaternioTransmutationis()
  window.quaternio = quaternio // Ekspozycja do globalnego obiektu dla dostępu z konsoli

  // Zapisanie oryginalnej funkcji generowania promptu
  const originalGeneratePrompt = window.generatePrompt
  console.log(
    "Quaternio: Zapisano referencję do oryginalnej funkcji generatePrompt"
  )

  // Nadpisanie funkcji generowania promptu
  window.generatePrompt = function () {
    console.log("Quaternio: Wywołano zmodyfikowaną funkcję generatePrompt")

    // Pobranie oryginalnego promptu z Triplex Magisterium
    const originalPrompt = originalGeneratePrompt()
    console.log("Quaternio: Oryginalny prompt został wygenerowany")

    // Rozszerzenie promptu o komponent Quaternio
    const quaternioExtension = quaternio.generatePromptExtension()
    console.log("Quaternio: Wygenerowano rozszerzenie promptu")

    // Zwrócenie połączonego promptu
    const combinedPrompt = originalPrompt + "\n\n" + quaternioExtension
    console.log("Quaternio: Połączono oryginał z rozszerzeniem")
    return combinedPrompt
  }

  console.log("Quaternio: Funkcja generatePrompt została pomyślnie nadpisana")

  // Obsługa przycisku "Następny Wymiar"
  const advanceButton = document.getElementById("advance-quaternio")
  if (advanceButton) {
    advanceButton.addEventListener("click", function () {
      const nextDimension = quaternio.advanceSequence()
      console.log("Quaternio: Przejście do następnego wymiaru:", nextDimension)
    })
  } else {
    console.error("Quaternio: Nie znaleziono przycisku 'Następny Wymiar'")
  }

  // Testowe wywołanie funkcji
  try {
    console.log("Quaternio: Test - wywołanie funkcji generatePrompt()")
    const testPrompt = window.generatePrompt()
    console.log(
      "Quaternio: Test udany - prompt zawiera rozszerzenie:",
      testPrompt.includes("QUATERNIO TRANSMUTATIONIS")
    )
  } catch (error) {
    console.error(
      "Quaternio: Test funkcji generatePrompt nie powiódł się:",
      error
    )
  }

  console.log("Quaternio: System zintegrowany z Triplex Magisterium")
})
