/**
 * PresentationFormatPlugin - Plugin formatu prezentacji
 *
 * Umożliwia wybór formy, w jakiej treści wynikowe mają być prezentowane,
 * pozwalając na translację informacji między różnymi gatunkami i stylami wypowiedzi.
 * Wykorzystuje nową klasę bazową Plugin.
 */
import { Plugin } from "../core/plugin-base.js"

export class PresentationFormatPlugin extends Plugin {
  /**
   * Konstruktor pluginu Format Prezentacji
   */
  constructor() {
    super({
      id: "presentationFormat",
      name: "Format Prezentacji",
      description: "Dostosuj formę prezentacji treści wynikowych",
      section: "Format Prezentacji",
    })

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
   * Zwraca domyślny stan pluginu
   * @return {Object} Domyślny stan pluginu
   * @override
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
   * Renderuje interfejs użytkownika pluginu
   * @param {HTMLElement} container - Element kontenera na UI
   * @override
   */
  renderUI(container) {
    // Wywołanie metody z klasy bazowej (dodaje przełącznik włączania/wyłączania)
    super.renderUI(container)

    // Pobierz aktualny stan pluginu
    const formatData = this.app.getState(`pluginData.${this.id}`)

    // Przygotowanie opcji formatu
    let formatOptionsHtml = this.formats
      .map(
        (format) =>
          `<option value="${format.id}" ${
            formatData.selectedFormat === format.id ? "selected" : ""
          }>${format.name}</option>`
      )
      .join("")

    // Utworzenie selektora formatu
    const formatSelector = document.createElement("div")
    formatSelector.className = "parameter"
    formatSelector.innerHTML = `
            <label for="format-selector">Wybierz format:</label>
            <select id="format-selector" data-plugin="${this.id}" ${
      !formatData.enabled ? "disabled" : ""
    }>
                ${formatOptionsHtml}
            </select>
        `
    container.appendChild(formatSelector)

    // Dodaj pola dla formatu własnego, jeśli jest wybrany
    if (formatData.selectedFormat === "custom") {
      this._renderCustomFormatFields(container, formatData)
    }

    // Dodaj podgląd formatu
    const formatPreview = document.createElement("div")
    formatPreview.className = "parameter format-preview"
    formatPreview.style.marginTop = "15px"
    formatPreview.style.backgroundColor = "rgba(15, 24, 48, 0.6)"
    formatPreview.style.padding = "15px"
    formatPreview.style.borderRadius = "3px"

    formatPreview.innerHTML = `
            <div class="format-description">
                <p style="color: #9a7d0a; font-style: italic;">${this._getFormatDescription(
                  formatData.selectedFormat
                )}</p>
            </div>
        `
    container.appendChild(formatPreview)

    // Dodaj obsługę zdarzeń po dodaniu do DOM
    setTimeout(() => {
      const selector = document.getElementById("format-selector")
      if (selector) {
        selector.addEventListener("change", () => {
          const selectedFormat = selector.value
          this.app.setState(
            `pluginData.${this.id}.selectedFormat`,
            selectedFormat
          )

          // Odśwież UI, aby pokazać/ukryć pola dla formatu własnego
          this.refreshUI()
        })
      }
    }, 0)
  }

  /**
   * Renderuje pola dla formatu własnego
   * @param {HTMLElement} container - Element kontenera na UI
   * @param {Object} formatData - Aktualny stan pluginu
   * @private
   */
  _renderCustomFormatFields(container, formatData) {
    const customFormatContainer = document.createElement("div")
    customFormatContainer.className = "parameter"
    customFormatContainer.innerHTML = `
            <label for="custom-format">Własna forma prezentacji:</label>
            <input type="text" id="custom-format" 
                   style="width: 100%; padding: 8px; background-color: #1e2b45; border: 1px solid #5b5b5b; border-radius: 3px; color: #e2e2e2;"
                   placeholder="Np. List motywacyjny, przemówienie, itd." 
                   value="${formatData.customFormat}">
        `
    container.appendChild(customFormatContainer)

    const formatDescriptionContainer = document.createElement("div")
    formatDescriptionContainer.className = "parameter"
    formatDescriptionContainer.innerHTML = `
            <label for="format-description">Opis formy (opcjonalnie):</label>
            <textarea id="format-description" 
                      style="width: 100%; min-height: 80px; background-color: #0f0f1a; border: 1px solid #5b5b5b; border-radius: 3px; padding: 10px; color: #e2e2e2; font-size: 1rem; resize: vertical;"
                      placeholder="Opisz specyficzne cechy tej formy prezentacji...">${formatData.formatDescription}</textarea>
        `
    container.appendChild(formatDescriptionContainer)

    // Dodaj obsługę zdarzeń po dodaniu do DOM
    setTimeout(() => {
      const customFormatInput = document.getElementById("custom-format")
      const formatDescriptionInput =
        document.getElementById("format-description")

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
    }, 0)
  }

  /**
   * Obsługa zmiany stanu włączenia pluginu
   * @param {boolean} isEnabled - Czy plugin jest włączony
   * @override
   */
  _onToggleStateChanged(isEnabled) {
    // Aktualizuj stan selektora formatu
    const selector = document.getElementById("format-selector")
    if (selector) {
      selector.disabled = !isEnabled
    }
  }

  /**
   * Zwraca opis wybranego formatu
   * @param {string} formatId - Identyfikator formatu
   * @return {string} Opis formatu
   * @private
   */
  _getFormatDescription(formatId) {
    if (formatId === "custom") {
      const formatData = this.app.getState(`pluginData.${this.id}`)
      const customDesc = formatData.formatDescription
      return customDesc || "Niestandardowy format prezentacji"
    }

    const format = this.formats.find((f) => f.id === formatId)
    if (format) {
      return format.description
    }
    return "Wybierz format prezentacji treści"
  }

  /**
 /**
 * Generuje treść do dodania do promptu
 * @return {string} Treść do dodania do promptu
 * @override
 */
  generateContent() {
    const formatData = this.app.getState(`pluginData.${this.id}`)

    if (!formatData.enabled || formatData.selectedFormat === "default") {
      return ""
    }

    let formatName = ""
    let formatDescription = ""

    if (formatData.selectedFormat === "custom") {
      formatName = formatData.customFormat || "Format niestandardowy"
      formatDescription = formatData.formatDescription
    } else {
      const format = this.formats.find(
        (f) => f.id === formatData.selectedFormat
      )
      if (format) {
        formatName = format.name
        formatDescription = format.description
      }
    }

    // Przygotuj treść do dodania do promptu, która będzie bezpośrednio instruować model
    let content = `

## INSTRUKCJA KOŃCOWA - FORMA WYPOWIEDZI

UWAGA: Twoją odpowiedzią ma być WYŁĄCZNIE ${formatName.toUpperCase()}, bez jakiegokolwiek wstępu, metakomentarza czy wyjaśnień. Nie wymieniaj kroków swojego procesu rozumowania. Nie streszczaj ani nie analizuj wcześniejszych instrukcji.

Wykorzystaj całą wiedzę merytoryczną, którą wypracowałeś w odpowiedzi na wcześniejsze instrukcje, ale przekształć ją kompletnie w formę ${formatName.toLowerCase()}.`

    // Dodaj szczegółowe instrukcje formatowania w zależności od wybranego formatu
    switch (formatData.selectedFormat) {
      case "essay":
        content += `

Stwórz kompletny akademicki esej z tytułem, wstępem, tezą, rozwinięciem argumentacji, konkluzją i bibliografią. Twój esej musi zawierać:
- Jasno sformułowaną tezę
- Formalny, akademicki język
- Logicznie ustrukturyzowaną argumentację
- Syntetyczne wnioski
- Odniesienia do literatury przedmiotu`
        break
      case "poem":
        content += `

Stwórz oryginalny wiersz, który:
- Wykorzystuje metafory i symbole do wyrażenia istoty tematu
- Ma przemyślaną strukturę stroficzną
- Stosuje środki poetyckie (rytm, aliterację itp.)
- Operuje obrazowaniem zmysłowym i konkretnym
- Przekazuje głębię emocjonalną i intelektualną tematu`
        break
      case "manifesto":
        content += `

Stwórz manifest artystyczny, który:
- Ma formę wyrazistych, zdecydowanych deklaracji
- Używa trybu imperatywnego i deklaratywnego
- Zawiera radykalne sformułowania i prowokacyjne tezy
- Jest podzielony na ponumerowane punkty lub sekcje
- Kończy się wezwaniem do działania lub zmiany paradygmatu`
        break
      case "student":
        content += `

Stwórz przystępny tekst edukacyjny, który:
- Wyjaśnia koncepcje prostym, zrozumiałym językiem
- Zawiera praktyczne przykłady i analogie
- Jest podzielony na wyraźne sekcje z nagłówkami
- Wprowadza stopniowo coraz bardziej złożone koncepcje
- Kończy się podsumowaniem kluczowych punktów do zapamiętania`
        break
      case "workshop":
        content += `

Stwórz kompletną instrukcję warsztatową, która:
- Zawiera listę potrzebnych materiałów/narzędzi
- Przedstawia krok po kroku procedurę realizacji
- Używa precyzyjnych, zwięzłych instrukcji
- Zawiera wskazówki dotyczące potencjalnych trudności
- Opisuje oczekiwane rezultaty na każdym etapie`
        break
      case "critique":
        content += `

Stwórz analityczną krytykę, która:
- Zawiera ocenę mocnych i słabych stron
- Identyfikuje ukryte założenia i sprzeczności
- Sytuuje temat w szerszym kontekście historycznym
- Oferuje konstruktywne propozycje alternatywnych podejść
- Używa precyzyjnych kryteriów oceny`
        break
      case "curatorial":
        content += `

Stwórz tekst kuratorski, który:
- Wprowadza kluczowe koncepcje jako elementy ekspozycji
- Buduje narrację łączącą poszczególne elementy
- Kontekstualizuje temat w szerszym polu kulturowym
- Sugeruje wielorakie interpretacje i odczytania
- Kreuje przestrzeń konceptualną do eksploracji przez odbiorców`
        break
    }

    // Dodaj opis formatu własnego, jeśli został wybrany
    if (formatData.selectedFormat === "custom" && formatDescription) {
      content += `

Uwzględnij następujące cechy tego formatu:
${formatDescription
  .split(".")
  .map((sentence) => {
    const trimmed = sentence.trim()
    return trimmed ? `- ${trimmed}` : ""
  })
  .filter((item) => item.length > 2)
  .join("\n")}
`
    }

    // Dodaj wyraźne podkreślenie instrukcji końcowych
    content += `

PAMIĘTAJ: Twoja odpowiedź ma zawierać WYŁĄCZNIE ${formatName.toUpperCase()} bez jakichkolwiek dodatkowych komentarzy, wyjaśnień czy metaanaliz. Nie używaj zwrotów typu "Oto esej..." czy "Poniżej przedstawiam...". Po prostu zacznij bezpośrednio od treści w wymaganym formacie.`

    return content
  }
}
