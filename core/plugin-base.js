/**
 * Plugin - Klasa bazowa dla wszystkich pluginów w Simplex Atanor
 *
 * Rozszerza BaseComponent, dodając funkcjonalności specyficzne dla pluginów,
 * takie jak renderowanie własnego interfejsu i generowanie dodatkowej treści.
 */
import { BaseComponent } from "./base-component.js"

export class Plugin extends BaseComponent {
  /**
   * Konstruktor klasy bazowej pluginu
   * @param {Object} config - Konfiguracja pluginu
   */
  constructor(config = {}) {
    super(config)

    if (this.constructor === Plugin) {
      throw new Error(
        "Plugin jest klasą abstrakcyjną i nie może być instancjonowana bezpośrednio"
      )
    }

    // Domyślna sekcja dla pluginu (używana przy generowaniu treści)
    this.section = config.section || this.name
  }

  /**
   * Inicjalizacja pluginu z referencją do aplikacji
   * @param {Object} app - Referencja do głównej aplikacji
   * @override
   */
  initialize(app) {
    super.initialize(app)

    // Domyślne nasłuchiwanie zdarzenia generowania promptu
    this._listen("prompt:generating", (additionalContent) => {
      const pluginState = this.app.getState(`pluginData.${this.id}`)

      // Sprawdź, czy plugin jest włączony (jeśli stan zawiera taką właściwość)
      const isEnabled =
        pluginState && pluginState.hasOwnProperty("enabled")
          ? pluginState.enabled
          : true

      if (isEnabled) {
        const content = this.generateContent()
        if (content && content.trim()) {
          additionalContent[this.section] = content
        }
      }
    })

    // Domyślne nasłuchiwanie zdarzenia renderowania parametrów
    this._listen("ui:parameters-rendered", (container) => {
      this._onParametersRendered(container)
    })
  }

  /**
   * Obsługa zdarzenia renderowania parametrów
   * @param {HTMLElement} container - Kontener, do którego można dodać UI pluginu
   * @private
   */
  _onParametersRendered(container) {
    // Sprawdź, czy już istnieje sekcja dla tego pluginu
    const existingSection = document.getElementById(`plugin-section-${this.id}`)
    if (!existingSection) {
      // Utwórz dedykowaną sekcję dla pluginu
      const pluginContainer = this._createPluginContainer()

      // Renderuj interfejs użytkownika pluginu
      this.renderUI(pluginContainer)

      // Dodaj kontener do głównego kontenera parametrów
      container.appendChild(pluginContainer)
    }
  }

  /**
   * Tworzy kontener dla interfejsu pluginu
   * @return {HTMLElement} Element kontenera
   * @private
   */
  _createPluginContainer() {
    const section = document.createElement("div")
    section.className = "plugin-section"
    section.id = `plugin-section-${this.id}`

    // Dodaj nagłówek sekcji
    const header = document.createElement("h3")
    header.textContent = this.name
    section.appendChild(header)

    // Dodaj opis (jeśli istnieje)
    if (this.description) {
      const description = document.createElement("p")
      description.className = "plugin-description"
      description.textContent = this.description
      section.appendChild(description)
    }

    return section
  }

  /**
   * Renderuje interfejs użytkownika pluginu
   * @param {HTMLElement} container - Element kontenera na UI
   * @override
   */
  renderUI(container) {
    // Domyślna implementacja - dodanie przełącznika włączania/wyłączania
    const pluginState = this.app.getState(`pluginData.${this.id}`)

    // Sprawdź, czy plugin obsługuje włączanie/wyłączanie
    if (pluginState && pluginState.hasOwnProperty("enabled")) {
      this._renderEnableToggle(container, pluginState.enabled)
    }
  }

  /**
   * Renderuje przełącznik włączania/wyłączania pluginu
   * @param {HTMLElement} container - Element kontenera na UI
   * @param {boolean} isEnabled - Czy plugin jest włączony
   * @private
   */
  _renderEnableToggle(container, isEnabled) {
    const toggleContainer = document.createElement("div")
    toggleContainer.className = "parameter"

    // Utwórz przełącznik
    toggleContainer.innerHTML = `
            <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 24px; margin-right: 10px;">
                <input type="checkbox" id="plugin-enabled-${this.id}" ${
      isEnabled ? "checked" : ""
    }>
                <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; border-radius: 24px; transition: .4s;">
                    <span style="position: absolute; content: ''; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; border-radius: 50%; transition: .4s; ${
                      isEnabled
                        ? "transform: translateX(26px); background-color: #d4af37;"
                        : ""
                    }"></span>
                </span>
            </label>
            <label for="plugin-enabled-${
              this.id
            }" class="switch-label">Włącz plugin</label>
        `

    // Dodaj nasłuchiwanie zmian
    container.appendChild(toggleContainer)

    // Dodaj obsługę zdarzeń po dodaniu do DOM
    setTimeout(() => {
      const checkbox = document.getElementById(`plugin-enabled-${this.id}`)
      if (checkbox) {
        checkbox.addEventListener("change", () => {
          const isEnabled = checkbox.checked
          this.app.setState(`pluginData.${this.id}.enabled`, isEnabled)

          // Aktualizuj wygląd suwaka
          const sliderSpan = checkbox.nextElementSibling.querySelector("span")
          if (sliderSpan) {
            if (isEnabled) {
              sliderSpan.style.transform = "translateX(26px)"
              sliderSpan.style.backgroundColor = "#d4af37"
            } else {
              sliderSpan.style.transform = "translateX(0)"
              sliderSpan.style.backgroundColor = "white"
            }
          }

          // Wywołaj metodę aktualizacji UI pluginu
          this._onToggleStateChanged(isEnabled)
        })
      }
    }, 0)
  }

  /**
   * Obsługa zmiany stanu włączenia pluginu
   * @param {boolean} isEnabled - Czy plugin jest włączony
   * @protected
   */
  _onToggleStateChanged(isEnabled) {
    // Metoda do nadpisania przez klasy pochodne
  }

  /**
   * Odświeża interfejs użytkownika pluginu
   */
  refreshUI() {
    const section = document.getElementById(`plugin-section-${this.id}`)
    if (section) {
      // Wyczyść zawartość sekcji (zachowując nagłówek)
      const header = section.querySelector("h3")
      const description = section.querySelector(".plugin-description")

      section.innerHTML = ""

      if (header) {
        section.appendChild(header)
      }

      if (description) {
        section.appendChild(description)
      }

      // Ponownie renderuj UI
      this.renderUI(section)
    }
  }
}
