/**
 * Format Prezentacji Plugin dla Simplex Atanor
 *
 * Plugin umożliwia wybór formy, w jakiej treści wynikowe mają być prezentowane,
 * pozwalając na translację informacji między różnymi gatunkami i stylami wypowiedzi.
 */
export class PresentationFormatPlugin {
  constructor() {
    this.id = "presentationFormat"
    this.name = "Format Prezentacji"
    this.description = "Dostosuj formę prezentacji treści wynikowych"

    // Predefiniowane formaty prezentacji
    this.formats = [
      {
        id: "default",
        name: "Format oryginalny",
        description: "Treść bez modyfikacji formy",
      },
      {
        id: "essay",
        name: "Esej akademicki",
        description: "Formalny tekst z tezą, argumentacją i wnioskami",
      },
      {
        id: "student",
        name: "Dla studentów",
        description: "Przystępna treść edukacyjna dla studentów",
      },
      {
        id: "poem",
        name: "Wiersz",
        description:
          "Forma poetycka podkreślająca aspekty emocjonalne i estetyczne",
      },
      {
        id: "workshop",
        name: "Instrukcja warsztatowa",
        description: "Krok po kroku dla warsztatu artystycznego",
      },
      {
        id: "critique",
        name: "Analiza krytyczna",
        description: "Pogłębiona analiza z perspektywy krytycznej",
      },
      {
        id: "manifesto",
        name: "Manifest artystyczny",
        description: "Wyrazisty tekst deklaratywny",
      },
      {
        id: "curatorial",
        name: "Tekst kuratorski",
        description: "Jak do wystawy lub ekspozycji",
      },
      {
        id: "custom",
        name: "Format własny",
        description: "Zdefiniuj własną formę prezentacji",
      },
    ]
  }

  /**
   * Inicjalizacja pluginu
   * @param {Object} app - Referencja do głównej aplikacji
   */
  initialize(app) {
    this.app = app

    // Ustawienie domyślnego stanu pluginu
    const defaultState = this.getDefaultState()
    if (!app.getState(`pluginData.${this.id}`)) {
      app.setState(`pluginData.${this.id}`, defaultState)
    }

    // Nasłuchiwanie zdarzeń aplikacji
    // Zdarzenie app:initialized jest emitowane po inicjalizacji aplikacji
    app.on("app:initialized", () => {
      // Dodaj niewielkie opóźnienie, aby upewnić się, że DOM jest w pełni załadowany
      setTimeout(() => this.injectUI(), 100)
    })

    // Zdarzenie prompt:generating jest emitowane podczas generowania promptu
    app.on("prompt:generating", (additionalContent) => {
      const formatData = this.app.getState(`pluginData.${this.id}`)
      if (formatData.enabled && formatData.selectedFormat !== "default") {
        additionalContent.presentationFormat = this.generateContent()
      }
    })
  }

  /**
   * Zwraca domyślny stan pluginu
   * @return {Object} - Domyślny stan pluginu
   */
  getDefaultState() {
    return {
      enabled: true,
      selectedFormat: "default",
      customFormat: "",
      formatDescription: "",
    }
  }

  /**
   * Wstrzykuje sekcję UI pluginu do DOM
   * Metoda tworzy nową sekcję i dodaje ją do struktury strony
   */
  injectUI() {
    // Najpierw sprawdź, czy sekcja już istnieje
    if (document.getElementById("presentation-format-section")) {
      return
    }

    // Znajdź kontener główny i sekcję przycisków akcji
    const container = document.querySelector(".container")
    const actionSection = document.querySelector(".action-buttons")

    if (!container || !actionSection) {
      console.error(
        "PresentationFormatPlugin: Nie znaleziono wymaganych elementów DOM"
      )
      return
    }

    // Tworzenie nowej sekcji
    const section = document.createElement("section")
    section.className = "format-prezentacji"
    section.id = "presentation-format-section"

    // Stylizacja sekcji zgodnie z estetyką projektu
    section.style.backgroundColor = "rgba(22, 36, 71, 0.8)"
    section.style.border = "1px solid #d4af37"
    section.style.borderRadius = "5px"
    section.style.padding = "20px"
    section.style.marginBottom = "20px"

    // Pobierz aktualny stan pluginu
    const formatData =
      this.app.getState(`pluginData.${this.id}`) || this.getDefaultState()

    // Przygotowanie opcji formatu
    let formatOptionsHtml = this.formats
      .map(
        (format) =>
          `<option value="${format.id}" ${
            formatData.selectedFormat === format.id ? "selected" : ""
          }>${format.name}</option>`
      )
      .join("")

    // Przygotowanie pól dla formatu własnego
    let customFormatInput = ""
    if (formatData.selectedFormat === "custom") {
      customFormatInput = `
              <div class="parameter">
                  <label for="custom-format" style="display: block; margin-bottom: 5px; color: #d4af37;">Własna forma prezentacji:</label>
                  <input type="text" id="custom-format" 
                         style="width: 100%; padding: 8px; background-color: #1e2b45; border: 1px solid #5b5b5b; border-radius: 3px; color: #e2e2e2;"
                         placeholder="Np. List motywacyjny, przemówienie, itd." 
                         value="${formatData.customFormat}">
              </div>
              <div class="parameter">
                  <label for="format-description" style="display: block; margin-bottom: 5px; color: #d4af37;">Opis formy (opcjonalnie):</label>
                  <textarea id="format-description" 
                            style="width: 100%; min-height: 80px; background-color: #0f0f1a; border: 1px solid #5b5b5b; border-radius: 3px; padding: 10px; color: #e2e2e2; font-size: 1rem; resize: vertical;"
                            placeholder="Opisz specyficzne cechy tej formy prezentacji...">${formatData.formatDescription}</textarea>
              </div>
          `
    }

    // Ustawienie zawartości HTML sekcji
    section.innerHTML = `
          <h2 style="font-family: 'Times New Roman', serif; color: #d4af37; text-align: center; margin-bottom: 15px;">FORMAT PREZENTACJI</h2>
          <p style="text-align: center; color: #9a7d0a; font-style: italic; margin-bottom: 30px;">Dostosuj sposób wyrażenia treści wynikowych</p>
          
          <div class="parameter" style="margin-bottom: 15px;">
              <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 24px; margin-right: 10px;">
                  <input type="checkbox" id="format-enabled" ${
                    formatData.enabled ? "checked" : ""
                  } style="opacity: 0; width: 0; height: 0;">
                  <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; border-radius: 24px; transition: .4s;">
                      <span style="position: absolute; content: ''; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; border-radius: 50%; transition: .4s; ${
                        formatData.enabled
                          ? "transform: translateX(26px); background-color: #d4af37;"
                          : ""
                      }"></span>
                  </span>
              </label>
              <label for="format-enabled" class="switch-label" style="color: #e2e2e2; cursor: pointer; vertical-align: middle;">Włącz modyfikację formy prezentacji</label>
          </div>
          
          <div class="parameter" style="margin-bottom: 15px;">
              <label for="format-selector" style="display: block; margin-bottom: 5px; color: #d4af37;">Wybierz format:</label>
              <select id="format-selector" 
                     style="width: 100%; padding: 8px; background-color: #1e2b45; border: 1px solid #5b5b5b; border-radius: 3px; color: #e2e2e2;"
                     ${!formatData.enabled ? "disabled" : ""}>
                  ${formatOptionsHtml}
              </select>
          </div>
          
          ${customFormatInput}
          
          <div class="format-preview parameter" style="margin-top: 15px; background-color: rgba(15, 24, 48, 0.6); padding: 15px; border-radius: 3px;">
              <div class="format-description">
                  <p style="color: #9a7d0a; font-style: italic;">${this.getFormatDescription(
                    formatData.selectedFormat
                  )}</p>
              </div>
          </div>
      `

    // Dodaj sekcję przed sekcją przycisków akcji
    container.insertBefore(section, actionSection)
    console.log("PresentationFormatPlugin: Dodano sekcję Format Prezentacji")

    // Dodaj obsługę zdarzeń dla elementów UI
    this.setupEventListeners(section, formatData)
  }

  /**
   * Konfiguruje nasłuchiwanie zdarzeń dla elementów UI
   * @param {HTMLElement} section - Element sekcji pluginu
   * @param {Object} formatData - Aktualne dane formatu
   */
  setupEventListeners(section, formatData) {
    // Przełącznik włączania/wyłączania
    const enabledCheckbox = section.querySelector("#format-enabled")
    const formatSelector = section.querySelector("#format-selector")

    if (enabledCheckbox) {
      enabledCheckbox.addEventListener("change", () => {
        const isEnabled = enabledCheckbox.checked
        this.app.setState(`pluginData.${this.id}.enabled`, isEnabled)

        if (formatSelector) {
          formatSelector.disabled = !isEnabled
        }

        // Aktualizacja wizualna suwaka
        const sliderSpan =
          enabledCheckbox.nextElementSibling.querySelector("span")
        if (sliderSpan) {
          if (isEnabled) {
            sliderSpan.style.transform = "translateX(26px)"
            sliderSpan.style.backgroundColor = "#d4af37"
          } else {
            sliderSpan.style.transform = "translateX(0)"
            sliderSpan.style.backgroundColor = "white"
          }
        }
      })
    }

    // Wybór formatu
    if (formatSelector) {
      formatSelector.addEventListener("change", () => {
        const selectedFormat = formatSelector.value
        this.app.setState(
          `pluginData.${this.id}.selectedFormat`,
          selectedFormat
        )

        // Odśwież UI, aby pokazać/ukryć pola dla formatu własnego
        this.refreshUI()
      })
    }

    // Obsługa pól formatu własnego
    if (formatData.selectedFormat === "custom") {
      const customFormatInput = section.querySelector("#custom-format")
      const formatDescriptionInput = section.querySelector(
        "#format-description"
      )

      if (customFormatInput) {
        customFormatInput.addEventListener("input", () => {
          this.app.setState(
            `pluginData.${this.id}.customFormat`,
            customFormatInput.value
          )
        })
      }

      if (formatDescriptionInput) {
        formatDescriptionInput.addEventListener("input", () => {
          this.app.setState(
            `pluginData.${this.id}.formatDescription`,
            formatDescriptionInput.value
          )
        })
      }
    }
  }

  /**
   * Odświeża interfejs pluginu
   * Usuwa starą sekcję i tworzy nową z aktualnymi danymi
   */
  refreshUI() {
    // Usuń istniejącą sekcję
    const section = document.getElementById("presentation-format-section")
    if (section && section.parentNode) {
      section.parentNode.removeChild(section)
    }

    // Stwórz nową sekcję z aktualnymi danymi
    this.injectUI()
  }

  /**
   * Zwraca opis wybranego formatu
   * @param {string} formatId - Identyfikator formatu
   * @return {string} - Opis formatu
   */
  getFormatDescription(formatId) {
    const format = this.formats.find((f) => f.id === formatId)
    if (format) {
      return format.description
    }
    return "Wybierz format prezentacji treści"
  }

  /**
   * Generuje treść promptu na podstawie wybranego formatu
   * @return {string} - Treść do dodania do promptu
   */
  generateContent() {
    const formatData = this.app.getState(`pluginData.${this.id}`)

    if (!formatData.enabled) {
      return ""
    }

    const formatId = formatData.selectedFormat

    if (formatId === "default") {
      return ""
    }

    let formatName = ""
    let formatDescription = ""

    if (formatId === "custom") {
      formatName = formatData.customFormat || "Format niestandardowy"
      formatDescription = formatData.formatDescription
    } else {
      const format = this.formats.find((f) => f.id === formatId)
      if (format) {
        formatName = format.name
        formatDescription = format.description
      }
    }

    // Wygeneruj treść dla promptu
    let content = `
## Format Prezentacji

Przedstaw wynikową treść w formie: **${formatName}**`

    if (formatDescription) {
      content += `\n\nCharakterystyka formy: ${formatDescription}`
    }

    return content
  }
}
