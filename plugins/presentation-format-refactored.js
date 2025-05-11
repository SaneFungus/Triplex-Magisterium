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

  // Wygeneruj rozbudowaną treść dla promptu
  let content = `## Transformatio Formae

Dokonaj transmutacji epistemicznej wyniku twoich rozważań poprzez zastosowanie Metamorphosis Expressionis - narzędzia translacji międzygatunkowej pozwalającego na rekontekstualizację treści poznawczych.

1. FORMA EXPRESSIVA: **${formatName}**

2. DECANTATIO STILISTICA: Przeprowadź procedurę destylacji stylistycznej, która zachowa esencję merytoryczną, jednocześnie transformując strukturę formalną wypowiedzi. Zastosuj następujące operacje:
   * Ekstrakcja tropów i figur charakterystycznych dla docelowej formy wypowiedzi
   * Adaptacja struktury argumentacyjnej do wymogów genologicznych
   * Rekalibracja rejestru językowego przy zachowaniu precyzji epistemicznej
   * Transpozycja elementów dyskursywnych na elementy właściwe dla docelowego gatunku

3. ESSENTIA CONSERVATIO: Zachowaj nienaruszony substrat epistemiczny pierwotnej analizy przy jednoczesnej modyfikacji formy. Unikaj redukcji złożoności merytorycznej mimo zmiany konwencji ekspresyjnej.`

  // Dodaj szczegółowe instrukcje w zależności od wybranego formatu
  switch (formatData.selectedFormat) {
    case "essay":
      content += `

4. STRUCTURA SPECIFICA: Zorganizuj treść według schematu:
   * Wprowadzenie z wyraźnie zarysowaną tezą
   * Korpus argumentacyjny z hierarchizacją dowodów
   * Konkluzja syntetyzująca przedstawione perspektywy
   * Bibliografia konceptualna (odniesienia do kluczowych koncepcji i tradycji)

5. MODUS OPERANDI: Zastosuj tryb dyskursywny właściwy dla tradycji akademickiej, z naciskiem na:
   * Precyzję terminologiczną
   * Logiczną strukturę wywodu
   * Adekwatne odwołania do istniejących tradycji i paradygmatów
   * Wielopoziomową argumentację z antycypacją kontrargumentów`
      break;
    case "poem":
      content += `

4. ALCHEMIA POETICA: Przeprowadź proces sublimacji pojęciowej, transmutując:
   * Abstrakcje teoretyczne w obrazy zmysłowe
   * Struktury argumentacyjne w rytmiczne następstwa strof
   * Terminy techniczne w metafory i symbole
   * Wywód linearny w kompozycję polisemiczną

5. QUINTESSENTIA IMAGINATIVA: Zachowaj istotę intelektualną tematu przy jednoczesnym uwolnieniu potencjału:
   * Wieloznaczności semantycznej
   * Konotacyjnego bogactwa języka
   * Emotywnego rezonansu
   * Sensualnej konkretności obrazowania`
      break;
    case "manifesto":
      content += `

4. PROCLAMATIO VIGOROSA: Wprowadź następujące transmutacje:
   * Przekształcenie wywodu analitycznego w sekwencję deklaratywnych tez
   * Wzmocnienie modalności poprzez użycie trybu imperatywnego
   * Intensyfikacja kontrastu między afirmowanymi a odrzucanymi elementami
   * Rytmizacja tekstu dla wzmocnienia efektu retorycznego

5. IGNIS TRANSFORMATIVUS: Nasycenie tekstu elementami:
   * Profetycznej wizyjności
   * Radykalnego zerwania z paradygmatami
   * Dyskursywnej bezkompromisowości
   * Rewolucyjnej temporalności (przyszłość jako czas narracji)`
      break;
    case "student":
      content += `

4. CLARIFICATIO CONCEPTUUM: Zastosuj procedury:
   * Dekompozycji złożonych terminów na komponenty zrozumiałe intuicyjnie
   * Wprowadzenia przykładów ilustrujących abstrakcyjne koncepcje
   * Progresywnego budowania złożoności (od elementarnego do zaawansowanego)
   * Eksplicytnego objaśniania przejść między poziomami analizy

5. STRUCTURA DIDACTICA: Zorganizuj treść jako:
   * Sekwencję celów poznawczych
   * Gradację trudności konceptualnej
   * System wzajemnie powiązanych modułów wiedzy
   * Dialektykę pytań i odpowiedzi`
      break;
    case "workshop":
      content += `

4. PRAXIS ORIENTATIO: Dokonaj transformacji:
   * Teorii w sekwencję działań
   * Pojęć w narzędzia
   * Abstrakcji w materialne konkretyzacje
   * Kontemplacji w interwencję

5. INSTRUCTIO PROCEDURALIS: Przeformułuj treść jako:
   * Chronologiczny ciąg jasno zdefiniowanych kroków
   * Zestaw technik z określonymi parametrami wykonania
   * Strukturę iteratywną z punktami decyzyjnymi
   * System mierzalnych rezultatów i kryteriów oceny`
      break;
    case "critique":
      content += `

4. DIALECTICA NEGATIVA: Uruchom procedury:
   * Systematycznej dekonstrukcji założeń
   * Identyfikacji wewnętrznych sprzeczności
   * Kontekstualizacji historycznej i ideologicznej
   * Analizy implikowanych, lecz niewyrażonych konsekwencji

5. HIERARCHIZATIO PERSPECTIVAE: Wprowadź meta-poziom analizy poprzez:
   * Eksplicytne odniesienie do przyjętego kryterium wartościowania
   * Zestawienie z alternatywnymi systemami oceny
   * Rekonstrukcję genealogii krytykowanych elementów
   * Propozycję alternatywnych trajektorii rozwoju`
      break;
    case "curatorial":
      content += `

4. CONTEXTUS EXPOSITIONIS: Stwórz ramę konceptualną poprzez:
   * Usytuowanie treści w szerszej narracji kulturowej
   * Wydobycie dialogu z tradycją i współczesnością
   * Identyfikację momentów przełomowych i punktów węzłowych
   * Uwypuklenie napięć i rezonansów między elementami

5. DISPOSITIO SPATIALIA: Przeprowadź organizację treści jako:
   * Konceptualną topografię do eksploracji
   * Kompozycję z przemyślanymi sekwencjami i juxtapozycjami
   * System wizualnych i pojęciowych dominant
   * Strukturę umożliwiającą wielorakie ścieżki interpretacyjne`
      break;
  }

  // Dodaj opis formatu własnego, jeśli został wybrany
  if (formatData.selectedFormat === "custom" && formatDescription) {
    content += `

4. SPECIFICATIO PARTICULARIS: Zastosuj następującą charakterystykę formy:
   ${formatDescription.split(".").map(sentence => `* ${sentence.trim()}`).filter(item => item.length > 2).join("\n   ")}

5. TRANSMUTATIO COMPLETA: Dokonaj pełnej transformacji stylistyczno-gatunkowej przy zachowaniu integralności epistemicznej oryginalnego przekazu.`
  }

  return content
}
}
