/**
 * Generator - Klasa bazowa dla wszystkich generatorów promptów w Simplex Atanor
 *
 * Rozszerza BaseComponent, dodając funkcjonalności specyficzne dla generatorów,
 * takie jak renderowanie parametrów i generowanie promptów.
 */
import { BaseComponent } from "./base-component.js"

export class Generator extends BaseComponent {
  /**
   * Konstruktor klasy bazowej generatora
   * @param {Object} config - Konfiguracja generatora
   */
  constructor(config = {}) {
    super(config)

    if (this.constructor === Generator) {
      throw new Error(
        "Generator jest klasą abstrakcyjną i nie może być instancjonowana bezpośrednio"
      )
    }
  }

  /**
   * Renderuje interfejs użytkownika generatora
   * @param {HTMLElement} container - Element kontenera na UI
   * @override
   */
  renderUI(container) {
    const paramHTML = this.renderParameters()

    // Utwórz grupę parametrów
    const paramGroup = document.createElement("div")
    paramGroup.className = `parameter-group ${
      this.id === this.app.getState("activeGenerator") ? "active" : ""
    }`
    paramGroup.setAttribute("data-generator", this.id)
    paramGroup.id = `${this.id}-parameters`

    // Ustaw zawartość HTML
    paramGroup.innerHTML = paramHTML

    // Dodaj obsługę zdarzeń dla kontrolek parametrów
    this._setupParameterControls(paramGroup)

    // Dodaj grupę do kontenera
    container.appendChild(paramGroup)
  }

  /**
   * Renderuje kontrolki parametrów dla generatora
   * @return {string} HTML kontrolek parametrów
   */
  renderParameters() {
    throw new Error(
      "Metoda renderParameters() musi być zaimplementowana przez klasę pochodną"
    )
  }

  /**
   * Zwraca domyślne parametry generatora
   * @return {Object} Obiekt z domyślnymi parametrami
   * @override
   */
  getDefaultState() {
    return this.getDefaultParameters()
  }

  /**
   * Zwraca domyślne parametry generatora
   * @return {Object} Obiekt z domyślnymi parametrami
   */
  getDefaultParameters() {
    return {}
  }

  /**
   * Generuje prompt na podstawie problemu i parametrów
   * @param {string} problem - Problem do przetworzenia
   * @param {Object} parameters - Parametry do użycia
   * @return {string} Wygenerowany prompt
   * @override
   */
  generateContent(problem, parameters) {
    return this.generatePrompt(problem, parameters)
  }

  /**
   * Generuje prompt na podstawie problemu i parametrów (metoda kompatybilności wstecznej)
   * @param {string} problem - Problem do przetworzenia
   * @param {Object} parameters - Parametry do użycia
   * @return {string} Wygenerowany prompt
   */
  generatePrompt(problem, parameters) {
    throw new Error(
      "Metoda generatePrompt() musi być zaimplementowana przez klasę pochodną"
    )
  }

  /**
   * Konfiguruje kontrolki parametrów dla generatora
   * @param {HTMLElement} containerElem - Kontener z kontrolkami parametrów
   * @private
   */
  _setupParameterControls(containerElem) {
    // Konfiguracja kontrolek dla suwaka
    containerElem.querySelectorAll('input[type="range"]').forEach((input) => {
      const valueDisplay = input.nextElementSibling
      const paramName = input.getAttribute("data-param")

      // Ustaw początkową wartość z obecnego stanu
      input.value = this.app.getState(`parameters.${this.id}.${paramName}`)
      if (valueDisplay) {
        valueDisplay.textContent = `${input.value}/10`
      }

      // Dodaj nasłuchiwanie zmian
      input.addEventListener("input", () => {
        // Aktualizuj stan aplikacji
        this.app.setState(
          `parameters.${this.id}.${paramName}`,
          parseInt(input.value)
        )

        // Aktualizuj wyświetlanie wartości
        if (valueDisplay) {
          valueDisplay.textContent = `${input.value}/10`
        }
      })
    })

    // Konfiguracja kontrolek dla checkboxów
    containerElem
      .querySelectorAll('input[type="checkbox"]')
      .forEach((input) => {
        const paramName = input.getAttribute("data-param")
        const paramValue = input.getAttribute("data-value")

        const parameterState = this.app.getState(
          `parameters.${this.id}.${paramName}`
        )

        if (Array.isArray(parameterState)) {
          // Ustaw początkowy stan
          input.checked = parameterState.includes(paramValue)

          // Dodaj nasłuchiwanie zmian
          input.addEventListener("change", () => {
            let newValues = [...parameterState]

            if (input.checked) {
              // Dodaj wartość, jeśli nie istnieje
              if (!newValues.includes(paramValue)) {
                newValues.push(paramValue)
              }
            } else {
              // Usuń wartość, jeśli istnieje
              newValues = newValues.filter((val) => val !== paramValue)
            }

            // Aktualizuj stan aplikacji
            this.app.setState(`parameters.${this.id}.${paramName}`, newValues)
          })
        }
      })

    // Konfiguracja kontrolek dla przycisków radio
    containerElem.querySelectorAll('input[type="radio"]').forEach((input) => {
      const paramName = input.getAttribute("data-param")
      const paramValue = input.getAttribute("data-value")

      // Ustaw początkowy stan
      input.checked =
        this.app.getState(`parameters.${this.id}.${paramName}`) === paramValue

      // Dodaj nasłuchiwanie zmian
      input.addEventListener("change", () => {
        if (input.checked) {
          this.app.setState(`parameters.${this.id}.${paramName}`, paramValue)
        }
      })
    })

    // Konfiguracja kontrolek dla select
    containerElem.querySelectorAll("select").forEach((select) => {
      const paramName = select.getAttribute("data-param")

      // Ustaw początkowy stan
      select.value = this.app.getState(`parameters.${this.id}.${paramName}`)

      // Dodaj nasłuchiwanie zmian
      select.addEventListener("change", () => {
        this.app.setState(`parameters.${this.id}.${paramName}`, select.value)
      })
    })
  }

  /**
   * Skonfiguruj nasłuchiwanie zdarzeń specyficznych dla generatora
   * @protected
   * @override
   */
  _setupEventListeners() {
    // Nasłuchuj zdarzenia zmiany aktywnego generatora
    this._listen("generator:changed", (generatorId) => {
      this._onGeneratorChanged(generatorId)
    })
  }

  /**
   * Obsługa zmiany aktywnego generatora
   * @param {string} generatorId - ID nowego aktywnego generatora
   * @private
   */
  _onGeneratorChanged(generatorId) {
    // Zaktualizuj stan UI jeśli to konieczne
    const paramGroup = document.getElementById(`${this.id}-parameters`)
    if (paramGroup) {
      paramGroup.classList.toggle("active", generatorId === this.id)
    }
  }
}
