/**
 * BaseComponent - Abstrakcyjna klasa bazowa dla wszystkich komponentów Simplex Atanor
 *
 * Definiuje wspólny interfejs dla generatorów i pluginów, umożliwiając jednolity
 * sposób interakcji z aplikacją i systemem zdarzeń.
 */
export class BaseComponent {
  /**
   * Konstruktor klasy bazowej
   * @param {Object} config - Konfiguracja komponentu
   * @param {string} config.id - Unikalny identyfikator komponentu
   * @param {string} config.name - Nazwa wyświetlana komponentu
   * @param {string} config.description - Opis komponentu
   * @param {string} [config.icon] - Klasa ikony (opcjonalnie, głównie dla generatorów)
   */
  constructor(config = {}) {
    if (this.constructor === BaseComponent) {
      throw new Error(
        "BaseComponent jest klasą abstrakcyjną i nie może być instancjonowana bezpośrednio"
      )
    }

    // Podstawowe właściwości komponentu
    this.id = config.id || this._generateId()
    this.name = config.name || "Nienazwany komponent"
    this.description = config.description || ""
    this.icon = config.icon || "fas fa-puzzle-piece" // Domyślna ikona

    // Referencja do aplikacji (ustawiana podczas inicjalizacji)
    this.app = null

    // Rejestr nasłuchiwaczy zdarzeń przypisanych przez ten komponent
    this._eventListeners = []
  }

  /**
   * Inicjalizacja komponentu z referencją do aplikacji
   * @param {Object} app - Referencja do głównej aplikacji
   */
  initialize(app) {
    this.app = app
    this._setupEventListeners()
  }

  /**
   * Zwraca domyślny stan komponentu
   * @return {Object} Domyślny stan
   */
  getDefaultState() {
    return {}
  }

  /**
   * Generuje treść na podstawie problemu i parametrów
   * @param {string} [problem] - Problem do przetworzenia (opcjonalnie)
   * @param {Object} [parameters] - Parametry do użycia (opcjonalnie)
   * @return {string} Wygenerowana treść
   */
  generateContent(problem, parameters) {
    throw new Error(
      "Metoda generateContent() musi być zaimplementowana przez klasę pochodną"
    )
  }

  /**
   * Renderuje interfejs użytkownika komponentu
   * @param {HTMLElement} container - Element kontenera na UI
   */
  renderUI(container) {
    throw new Error(
      "Metoda renderUI() musi być zaimplementowana przez klasę pochodną"
    )
  }

  /**
   * Skonfiguruj nasłuchiwanie zdarzeń specyficznych dla komponentu
   * @protected
   */
  _setupEventListeners() {
    // Metoda do nadpisania przez klasy pochodne
  }

  /**
   * Zarejestruj nasłuchiwanie zdarzenia z automatycznym śledzeniem
   * @param {string} event - Nazwa zdarzenia
   * @param {Function} callback - Funkcja wywołania zwrotnego
   * @protected
   */
  _listen(event, callback) {
    if (!this.app) {
      throw new Error(
        "Komponent nie został zainicjalizowany z referencją do aplikacji"
      )
    }

    // Zapamiętaj referencję do funkcji nasłuchującej
    const unsubscribe = this.app.on(event, callback)
    this._eventListeners.push(unsubscribe)

    return unsubscribe
  }

  /**
   * Usuń wszystkie zarejestrowane nasłuchiwacze zdarzeń
   * @protected
   */
  _removeAllListeners() {
    this._eventListeners.forEach((unsubscribe) => unsubscribe())
    this._eventListeners = []
  }

  /**
   * Generuje unikalny identyfikator dla komponentu
   * @return {string} Wygenerowany identyfikator
   * @private
   */
  _generateId() {
    return "component_" + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Metoda wywoływana przed usunięciem komponentu
   * Służy do czyszczenia zasobów, np. nasłuchiwaczy zdarzeń
   */
  destroy() {
    this._removeAllListeners()
    this.app = null
  }
}
