/**
 * Simplex Atanor - Główna klasa aplikacji
 *
 * Odpowiada za zarządzanie stanem aplikacji, obsługę zdarzeń i komunikację między komponentami.
 * Stanowi centralny punkt aplikacji, integrujący generatory promptów i pluginy.
 */
import { generators } from "../generators/generators.js"
import { plugins } from "../plugins/plugins.js"

class SimplexAtanorApp {
  /**
   * Konstruktor aplikacji
   * Inicjalizuje stan aplikacji i system zdarzeń
   */
  constructor() {
    // Inicjalizacja stanu aplikacji
    this.state = {
      problem: "",
      activeGenerator: "separatio",
      parameters: {
        recursionLevel: 3, // Domyślna wartość dla poziomu rekursji
      },
      pluginData: {},
    }

    // Inicjalizacja systemu zdarzeń
    this.eventListeners = {}

    // Uruchomienie inicjalizacji aplikacji
    this.initialize()
  }

  /**
   * Inicjalizuje aplikację, jej komponenty i interfejs użytkownika
   */
  initialize() {
    // Inicjalizacja generatorów
    this.initializeGenerators()

    // Inicjalizacja pluginów
    this.initializePlugins()

    // Inicjalizacja UI
    this.setupUI()

    // Emisja zdarzenia inicjalizacji
    this.emit("app:initialized")
  }

  /**
   * Inicjalizuje generatory promptów
   * Dla każdego generatora ustawia domyślne parametry i inicjalizuje go
   */
  initializeGenerators() {
    // Inicjalizacja podstawowych parametrów dla generatorów
    Object.values(generators).forEach((generator) => {
      if (!this.state.parameters[generator.id]) {
        // Wykorzystanie nowej metody getDefaultState() lub kompatybilności wstecznej
        this.state.parameters[generator.id] = generator.getDefaultState
          ? generator.getDefaultState()
          : generator.getDefaultParameters()
      }

      generator.initialize(this)
    })

    // Domyślnie aktywny pierwszy generator
    if (Object.keys(generators).length > 0) {
      this.state.activeGenerator = Object.keys(generators)[0]
    }
  }

  /**
   * Inicjalizuje pluginy
   * Dla każdego pluginu ustawia domyślny stan i inicjalizuje go
   */
  initializePlugins() {
    // Inicjalizacja pluginów
    Object.values(plugins).forEach((plugin) => {
      // Każdy plugin dostaje swój obszar w stanie aplikacji
      if (!this.state.pluginData[plugin.id]) {
        this.state.pluginData[plugin.id] = plugin.getDefaultState()
      }

      plugin.initialize(this)
    })
  }

  /**
   * Konfiguruje interfejs użytkownika
   * Renderuje karty generatorów, panele parametrów i ustawia nasłuchiwanie zdarzeń
   */
  setupUI() {
    // Konfiguracja elementów UI
    this.renderGeneratorCards()
    this.renderParameterPanels()
    this.setupEventListeners()
  }

  /**
   * Renderuje karty dla wszystkich generatorów
   */
  renderGeneratorCards() {
    const container = document.getElementById("forma-container")
    container.innerHTML = ""

    Object.values(generators).forEach((generator) => {
      const card = document.createElement("div")
      card.className = `forma-card ${
        generator.id === this.state.activeGenerator ? "active" : ""
      }`
      card.setAttribute("data-generator", generator.id)

      card.innerHTML = `
                <div class="card-symbol"><i class="${generator.icon}"></i></div>
                <h3>${generator.name}</h3>
                <p>${generator.description}</p>
            `

      card.addEventListener("click", () =>
        this.setActiveGenerator(generator.id)
      )
      container.appendChild(card)
    })
  }

  /**
   * Renderuje panele parametrów dla wszystkich generatorów
   * Wykorzystuje nową metodę renderUI z klasy bazowej Generator
   */
  renderParameterPanels() {
    const container = document.getElementById("parameters-container")

    // Czyszczenie kontenerów parametrów
    const existingGroups = container.querySelectorAll(".parameter-group")
    existingGroups.forEach((group) => group.remove())

    // Usunięcie istniejących sekcji pluginów
    const existingPluginSections = container.querySelectorAll(".plugin-section")
    existingPluginSections.forEach((section) => section.remove())

    // Renderowanie paneli parametrów dla generatorów
    Object.values(generators).forEach((generator) => {
      // Sprawdź, czy generator używa nowej klasy bazowej (ma metodę renderUI)
      if (typeof generator.renderUI === "function") {
        // Wykorzystanie nowej metody renderUI z klasy bazowej Generator
        generator.renderUI(container)
      } else {
        // Kompatybilność wsteczna dla starszych generatorów
        this._renderLegacyGeneratorParameters(generator, container)
      }
    })

    // Umożliwienie pluginom dodawania własnych paneli
    this.emit("ui:parameters-rendered", container)
  }

  /**
   * Renderuje parametry dla generatorów używających starego interfejsu
   * Metoda kompatybilności wstecznej
   *
   * @param {Object} generator - Generator do renderowania
   * @param {HTMLElement} container - Kontener, do którego dodać parametry
   * @private
   */
  _renderLegacyGeneratorParameters(generator, container) {
    const paramGroup = document.createElement("div")
    paramGroup.className = `parameter-group ${
      generator.id === this.state.activeGenerator ? "active" : ""
    }`
    paramGroup.setAttribute("data-generator", generator.id)
    paramGroup.id = `${generator.id}-parameters`

    // Renderowanie parametrów
    const parameters = generator.renderParameters(this)
    paramGroup.innerHTML = parameters

    // Dodawanie obsługi zdarzeń dla kontrolek parametrów
    this._setupLegacyParameterControls(paramGroup, generator.id)

    container.appendChild(paramGroup)
  }

  /**
   * Konfiguruje kontrolki parametrów dla starszych generatorów
   * Metoda kompatybilności wstecznej
   *
   * @param {HTMLElement} containerElem - Kontener z kontrolkami
   * @param {string} generatorId - ID generatora
   * @private
   */
  _setupLegacyParameterControls(containerElem, generatorId) {
    // Konfiguracja kontrolek dla suwaka
    containerElem.querySelectorAll('input[type="range"]').forEach((input) => {
      const valueDisplay = input.nextElementSibling
      const paramName = input.getAttribute("data-param")

      input.value = this.state.parameters[generatorId][paramName]
      valueDisplay.textContent = `${input.value}/10`

      input.addEventListener("input", () => {
        this.state.parameters[generatorId][paramName] = parseInt(input.value)
        valueDisplay.textContent = `${input.value}/10`

        // Emisja zdarzenia zmiany stanu
        this.emit("state:changed", {
          path: `parameters.${generatorId}.${paramName}`,
          oldValue: this.state.parameters[generatorId][paramName],
          newValue: parseInt(input.value),
        })
      })
    })

    // Konfiguracja kontrolek dla checkboxów
    containerElem
      .querySelectorAll('input[type="checkbox"]')
      .forEach((input) => {
        const paramName = input.getAttribute("data-param")
        const paramValue = input.getAttribute("data-value")

        if (Array.isArray(this.state.parameters[generatorId][paramName])) {
          input.checked =
            this.state.parameters[generatorId][paramName].includes(paramValue)

          input.addEventListener("change", () => {
            if (input.checked) {
              if (
                !this.state.parameters[generatorId][paramName].includes(
                  paramValue
                )
              ) {
                this.state.parameters[generatorId][paramName].push(paramValue)
              }
            } else {
              this.state.parameters[generatorId][paramName] =
                this.state.parameters[generatorId][paramName].filter(
                  (val) => val !== paramValue
                )
            }

            // Emisja zdarzenia zmiany stanu
            this.emit("state:changed", {
              path: `parameters.${generatorId}.${paramName}`,
              oldValue: this.state.parameters[generatorId][paramName],
              newValue: this.state.parameters[generatorId][paramName],
            })
          })
        }
      })

    // Konfiguracja kontrolek dla przycisków radio
    containerElem.querySelectorAll('input[type="radio"]').forEach((input) => {
      const paramName = input.getAttribute("data-param")
      const paramValue = input.getAttribute("data-value")

      // Ustawienie początkowego stanu
      if (this.state.parameters[generatorId][paramName] === paramValue) {
        input.checked = true
      }

      input.addEventListener("change", () => {
        if (input.checked) {
          const oldValue = this.state.parameters[generatorId][paramName]
          this.state.parameters[generatorId][paramName] = paramValue

          // Emisja zdarzenia zmiany stanu
          this.emit("state:changed", {
            path: `parameters.${generatorId}.${paramName}`,
            oldValue: oldValue,
            newValue: paramValue,
          })
        }
      })
    })

    // Konfiguracja kontrolek dla select
    containerElem.querySelectorAll("select").forEach((select) => {
      const paramName = select.getAttribute("data-param")

      // Ustawienie początkowego stanu
      select.value = this.state.parameters[generatorId][paramName]

      select.addEventListener("change", () => {
        const oldValue = this.state.parameters[generatorId][paramName]
        this.state.parameters[generatorId][paramName] = select.value

        // Emisja zdarzenia zmiany stanu
        this.emit("state:changed", {
          path: `parameters.${generatorId}.${paramName}`,
          oldValue: oldValue,
          newValue: select.value,
        })
      })
    })
  }

  /**
   * Konfiguruje nasłuchiwanie zdarzeń UI
   */
  setupEventListeners() {
    // Obsługa przycisków
    document
      .getElementById("preview-button")
      .addEventListener("click", () => this.showPromptPreview())
    document
      .getElementById("transmute-button")
      .addEventListener("click", () => this.generateFinalPrompt())
    document.getElementById("problem-input").addEventListener("input", (e) => {
      this.state.problem = e.target.value
    })

    // Przełącznik parametrów
    document
      .getElementById("parametry-toggle")
      .addEventListener("click", () => {
        document
          .querySelector(".parametry-esencjalne")
          .classList.toggle("collapsed")
      })

    // Obsługa modalu
    document.querySelector(".close-button").addEventListener("click", () => {
      document.getElementById("preview-modal").style.display = "none"
    })

    // Kopiowanie do schowka
    document.getElementById("copy-prompt").addEventListener("click", () => {
      const promptText = document.getElementById("prompt-preview").textContent
      navigator.clipboard.writeText(promptText).then(() => {
        const button = document.getElementById("copy-prompt")
        button.textContent = "Skopiowano!"
        setTimeout(() => {
          button.textContent = "Kopiuj do schowka"
        }, 2000)
      })
    })

    // Obsługa przycisków rekursji metapoznawczej
    document.querySelectorAll(".recursion-circle").forEach((circle) => {
      const level = parseInt(circle.getAttribute("data-level"))

      // Ustawienie początkowego stanu
      if (level === this.state.parameters.recursionLevel) {
        circle.classList.add("active")
      }

      circle.addEventListener("click", () => {
        // Usunięcie klasy "active" ze wszystkich kółek
        document.querySelectorAll(".recursion-circle").forEach((c) => {
          c.classList.remove("active")
        })

        // Dodanie klasy "active" do klikniętego kółka
        circle.classList.add("active")

        // Aktualizacja stanu aplikacji
        const oldValue = this.state.parameters.recursionLevel
        this.setState("parameters.recursionLevel", level)

        // Emisja zdarzenia zmiany stanu
        this.emit("state:changed", {
          path: "parameters.recursionLevel",
          oldValue: oldValue,
          newValue: level,
        })
      })
    })
  }

  /**
   * Ustawia aktywny generator
   * @param {string} generatorId - ID generatora do aktywacji
   */
  setActiveGenerator(generatorId) {
    this.state.activeGenerator = generatorId

    // Aktualizacja UI
    document.querySelectorAll(".forma-card").forEach((card) => {
      card.classList.toggle(
        "active",
        card.getAttribute("data-generator") === generatorId
      )
    })

    document.querySelectorAll(".parameter-group").forEach((group) => {
      group.classList.toggle(
        "active",
        group.getAttribute("data-generator") === generatorId
      )
    })

    // Aktualizacja wskaźnika statusu
    const generator = generators[generatorId]
    document.getElementById(
      "current-forma"
    ).textContent = `Magisterium: ${generator.name}`

    this.emit("generator:changed", generatorId)
  }

  /**
   * Rejestruje nasłuchiwacz zdarzenia
   * @param {string} event - Nazwa zdarzenia
   * @param {Function} callback - Funkcja wywołania zwrotnego
   * @return {Function} Funkcja do usunięcia nasłuchiwacza
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)

    // Zwracamy funkcję do usunięcia listenera
    return () => this.off(event, callback)
  }

  /**
   * Usuwa nasłuchiwacz zdarzenia
   * @param {string} event - Nazwa zdarzenia
   * @param {Function} callback - Funkcja wywołania zwrotnego do usunięcia
   */
  off(event, callback) {
    if (!this.eventListeners[event]) return
    this.eventListeners[event] = this.eventListeners[event].filter(
      (cb) => cb !== callback
    )
  }

  /**
   * Emituje zdarzenie do wszystkich zarejestrowanych nasłuchiwaczy
   * @param {string} event - Nazwa zdarzenia
   * @param {*} data - Dane przekazywane wraz ze zdarzeniem
   */
  emit(event, data) {
    if (!this.eventListeners[event]) return
    this.eventListeners[event].forEach((callback) => callback(data))
  }

  /**
   * Pobiera wartość ze stanu aplikacji na podstawie ścieżki
   * @param {string} [path=null] - Ścieżka do wartości, kropką rozdzielone klucze
   * @return {*} Wartość ze stanu aplikacji
   */
  getState(path = null) {
    if (!path) return this.state

    return path
      .split(".")
      .reduce(
        (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
        this.state
      )
  }

  /**
   * Ustawia wartość w stanie aplikacji na podstawie ścieżki
   * @param {string} path - Ścieżka do wartości, kropką rozdzielone klucze
   * @param {*} value - Nowa wartość
   * @return {boolean} Czy operacja się powiodła
   */
  setState(path, value) {
    const parts = path.split(".")
    let current = this.state

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {}
      }
      current = current[parts[i]]
    }

    const lastPart = parts[parts.length - 1]
    const oldValue = current[lastPart]
    current[lastPart] = value

    this.emit("state:changed", { path, oldValue, newValue: value })
    return true
  }

  /**
   * Generuje prompt na podstawie aktywnego generatora i pluginów
   * @return {string} Wygenerowany prompt
   */
  generatePrompt() {
    const activeGenerator = generators[this.state.activeGenerator]
    if (!activeGenerator) return ""

    // Bazowy prompt od generatora
    let prompt

    // Sprawdź, czy generator używa nowej klasy bazowej (ma metodę generateContent)
    if (typeof activeGenerator.generateContent === "function") {
      prompt = activeGenerator.generateContent(
        this.state.problem,
        this.state.parameters[this.state.activeGenerator]
      )
    } else {
      // Kompatybilność wsteczna dla starszych generatorów
      prompt = activeGenerator.generatePrompt(
        this.state.problem,
        this.state.parameters[this.state.activeGenerator]
      )
    }

    // Zbieranie dodatkowych treści od pluginów
    const additionalContent = {}

    // Emitowanie zdarzenia dla pluginów do uzupełnienia treści
    this.emit("prompt:generating", additionalContent)

    // Łączenie treści od pluginów
    for (const [section, content] of Object.entries(additionalContent)) {
      if (content && content.trim()) {
        prompt += `\n\n${section.toUpperCase()}:\n${content}`
      }
    }

    // Dodawanie sekcji rekursji jeśli potrzebne
    const recursionLevel = this.getState("parameters.recursionLevel")
    if (recursionLevel > 1) {
      prompt += this.generateRecursionSection(recursionLevel)
    }

    return prompt
  }

  /**
   * Generuje sekcję rekursji metapoznawczej
   * @param {number} level - Poziom rekursji
   * @return {string} Fragment promptu z rekursją
   */
  generateRecursionSection(level) {
    return `
\nSPIRITUS RECTOR: Przeprowadź metarefleksję ${level}-go rzędu nad całością procesu poznawczego, uwzględniając:
* SPECULUM EPISTEMICUM: Granice zastosowanych procedur i ukryte założenia epistemologiczne
* CIRCULATIO: Cykliczną naturę procesu poznawczego
* SUBLIMATIO: Potencjał wzniesienia procesu na wyższy poziom
* ROTATIO: Zmianę pozycji obserwatora i jej wpływ na proces
* MULTIPLICATIO METHODORUM: Możliwe alternatywne podejścia do analizowanego zagadnienia
`
  }

  /**
   * Wyświetla podgląd wygenerowanego promptu
   */
  showPromptPreview() {
    const prompt = this.generatePrompt()
    document.getElementById("prompt-preview").textContent = prompt
    document.getElementById("preview-modal").style.display = "block"
  }

  /**
   * Generuje finalny prompt i wyświetla go
   */
  generateFinalPrompt() {
    // Implementacja analogiczna do showPromptPreview
    this.showPromptPreview()
  }
}

// Inicjalizacja aplikacji po załadowaniu DOM
document.addEventListener("DOMContentLoaded", () => {
  window.simplexApp = new SimplexAtanorApp()
})

export { SimplexAtanorApp }
