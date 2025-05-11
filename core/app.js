import { generators } from "../generators/generators.js"
import { plugins } from "../plugins/plugins.js"

class SimplexAtanorApp {
  constructor() {
    this.state = {
      problem: "",
      activeGenerator: "separatio",
      parameters: {},
      pluginData: {},
    }

    this.eventListeners = {}
    this.initialize()
  }

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

  initializeGenerators() {
    // Inicjalizacja podstawowych parametrów dla generatorów
    Object.values(generators).forEach((generator) => {
      if (!this.state.parameters[generator.id]) {
        this.state.parameters[generator.id] = generator.getDefaultParameters()
      }

      generator.initialize(this)
    })

    // Domyślnie aktywny pierwszy generator
    if (Object.keys(generators).length > 0) {
      this.state.activeGenerator = Object.keys(generators)[0]
    }
  }

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

  setupUI() {
    // Konfiguracja elementów UI
    this.renderGeneratorCards()
    this.renderParameterPanels()
    this.setupEventListeners()
  }

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

  renderParameterPanels() {
    const container = document.getElementById("parameters-container")

    // Czyszczenie kontenerów parametrów
    const existingGroups = container.querySelectorAll(".parameter-group")
    existingGroups.forEach((group) => group.remove())

    // Renderowanie paneli parametrów dla generatorów
    Object.values(generators).forEach((generator) => {
      const paramGroup = document.createElement("div")
      paramGroup.className = `parameter-group ${
        generator.id === this.state.activeGenerator ? "active" : ""
      }`
      paramGroup.setAttribute("data-generator", generator.id)

      // Renderowanie parametrów
      const parameters = generator.renderParameters(this)
      paramGroup.innerHTML = parameters

      // Dodawanie obsługi zdarzeń dla kontrolek parametrów
      this.setupParameterControls(paramGroup, generator.id)

      container.appendChild(paramGroup)
    })

    // Umożliwienie pluginom dodawania własnych paneli
    this.emit("ui:parameters-rendered", container)
  }

  setupParameterControls(containerElem, generatorId) {
    // Konfiguracja kontrolek dla suwaka
    containerElem.querySelectorAll('input[type="range"]').forEach((input) => {
      const valueDisplay = input.nextElementSibling
      const paramName = input.getAttribute("data-param")

      input.value = this.state.parameters[generatorId][paramName]
      valueDisplay.textContent = `${input.value}/10`

      input.addEventListener("input", () => {
        this.state.parameters[generatorId][paramName] = parseInt(input.value)
        valueDisplay.textContent = `${input.value}/10`
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
          })
        }
      })

    // Podobna implementacja dla innych typów kontrolek...
  }

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
  }

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

  // System zdarzeń
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)

    // Zwracamy funkcję do usunięcia listenera
    return () => this.off(event, callback)
  }

  off(event, callback) {
    if (!this.eventListeners[event]) return
    this.eventListeners[event] = this.eventListeners[event].filter(
      (cb) => cb !== callback
    )
  }

  emit(event, data) {
    if (!this.eventListeners[event]) return
    this.eventListeners[event].forEach((callback) => callback(data))
  }

  // Metody dostępu do stanu
  getState(path = null) {
    if (!path) return this.state

    return path
      .split(".")
      .reduce(
        (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
        this.state
      )
  }

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

  // Generowanie promptu
  generatePrompt() {
    const activeGenerator = generators[this.state.activeGenerator]
    if (!activeGenerator) return ""

    // Bazowy prompt od generatora
    let prompt = activeGenerator.generatePrompt(
      this.state.problem,
      this.state.parameters[this.state.activeGenerator]
    )

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
    const recursionLevel = this.getState("parameters.recursionLevel") || 3
    if (recursionLevel > 1) {
      prompt += this.generateRecursionSection(recursionLevel)
    }

    return prompt
  }

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

  showPromptPreview() {
    const prompt = this.generatePrompt()
    document.getElementById("prompt-preview").textContent = prompt
    document.getElementById("preview-modal").style.display = "block"
  }

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
