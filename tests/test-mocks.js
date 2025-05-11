/**
 * test-mocks.js - Udoskonalone makiety obiektów do testów jednostkowych
 *
 * Ten plik zawiera zestaw makiet (mock objects) niezbędnych do testowania
 * komponentów Simplex Atanor bez konieczności rzeczywistego renderowania w DOM.
 * Zapewnia symulowane środowisko, które naśladuje zachowanie przeglądarki.
 */

/**
 * Makieta elementu DOM z pełną obsługą atrybutów i dzieci
 * Symuluje podstawowe funkcjonalności elementów HTML
 */
export class MockElement {
  constructor(tagName = "div") {
    this.tagName = tagName
    this._className = ""
    this._id = ""
    this._attributes = {} // Wewnętrzny obiekt przechowujący atrybuty
    this.children = []
    this._innerHTML = ""
    this.style = {}
    this.eventListeners = {}

    // Definicja właściwości z getterami i setterami
    Object.defineProperties(this, {
      id: {
        get: () => this._id,
        set: (value) => {
          this._id = value
          this._attributes["id"] = value
        },
      },
      className: {
        get: () => this._className,
        set: (value) => {
          this._className = value
        },
      },
      innerHTML: {
        get: () => this._innerHTML,
        set: (value) => {
          this._innerHTML = value
        },
      },
    })
  }

  /**
   * Ustawia atrybut elementu
   * @param {string} name - Nazwa atrybutu
   * @param {string} value - Wartość atrybutu
   */
  setAttribute(name, value) {
    this._attributes[name] = value
  }

  /**
   * Pobiera wartość atrybutu
   * @param {string} name - Nazwa atrybutu
   * @return {string|null} Wartość atrybutu lub null
   */
  getAttribute(name) {
    return this._attributes[name] !== undefined ? this._attributes[name] : null
  }

  /**
   * Dodaje element dziecko
   * @param {MockElement} child - Element do dodania
   * @return {MockElement} Dodany element
   */
  appendChild(child) {
    this.children.push(child)
    return child
  }

  /**
   * Symuluje classList z metodami add, remove, toggle i contains
   */
  get classList() {
    const self = this
    return {
      _classes: self._className.split(/\s+/).filter(Boolean),

      add(...classNames) {
        classNames.forEach((name) => {
          if (!this._classes.includes(name)) {
            this._classes.push(name)
          }
        })
        self._className = this._classes.join(" ")
      },

      remove(...classNames) {
        this._classes = this._classes.filter(
          (name) => !classNames.includes(name)
        )
        self._className = this._classes.join(" ")
      },

      toggle(className, force) {
        const hasClass = this._classes.includes(className)
        const shouldAdd = force === undefined ? !hasClass : force

        if (shouldAdd) {
          this.add(className)
        } else if (hasClass) {
          this.remove(className)
        }

        return shouldAdd
      },

      contains(className) {
        return this._classes.includes(className)
      },

      toString() {
        return self._className
      },
    }
  }

  /**
   * Wyszukuje elementy zgodne z selektorem (uproszczona implementacja)
   * @param {string} selector - Selektor CSS
   * @return {Array<MockElement>} Lista pasujących elementów
   */
  querySelectorAll(selector) {
    // W testach najczęściej będziemy zwracać pustą tablicę lub
    // specyficzne elementy które przygotujemy ręcznie
    return []
  }

  /**
   * Dodaje nasłuchiwacz zdarzenia
   * @param {string} event - Nazwa zdarzenia
   * @param {Function} callback - Funkcja obsługi zdarzenia
   */
  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }

  /**
   * Symuluje wywołanie zdarzenia
   * @param {string} event - Nazwa zdarzenia
   * @param {Object} data - Dane zdarzenia
   */
  dispatchEvent(event, data = {}) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => callback(data))
    }
  }
}

/**
 * Makieta aplikacji Simplex Atanor
 * Symuluje interfejs i funkcjonalności głównej aplikacji
 */
export class MockSimplexApp {
  constructor() {
    // Inicjalizacja stanu aplikacji z domyślnymi wartościami
    this.state = {
      activeGenerator: "separatio",
      problem: "Problem testowy",
      parameters: {
        recursionLevel: 3,
      },
      pluginData: {},
    }

    // Rejestr nasłuchiwaczy zdarzeń
    this.eventListeners = {}
  }

  /**
   * Symulacja inicjalizacji aplikacji
   */
  initialize() {
    // Pusta implementacja do testów
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

    // Nawiguj do odpowiedniego miejsca w strukturze stanu
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {}
      }
      current = current[parts[i]]
    }

    // Ustaw wartość i emituj zdarzenie zmiany
    const lastPart = parts[parts.length - 1]
    const oldValue = current[lastPart]
    current[lastPart] = value

    this.emit("state:changed", { path, oldValue, newValue: value })
    return true
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
}

/**
 * Tworzy kompletne środowisko testowe dla generatorów Simplex Atanor
 * @param {Generator} generator - Testowany generator
 * @return {Object} Środowisko testowe zawierające aplikację, generator i narzędzia pomocnicze
 */
export function createTestEnvironment(generator) {
  // Utworzenie instancji aplikacji
  const app = new MockSimplexApp()

  // Dodanie domyślnych parametrów generatora do stanu aplikacji
  const defaultParams = generator.getDefaultParameters()
  app.state.parameters[generator.id] = defaultParams

  // Inicjalizacja generatora z makietą aplikacji
  generator.initialize(app)

  /**
   * Funkcja tworząca element DOM dla testów
   * @param {string} [tagName='div'] - Nazwa tagu HTML
   * @return {MockElement} Makieta elementu DOM
   */
  const createElement = (tagName = "div") => {
    return new MockElement(tagName)
  }

  /**
   * Funkcja symulująca document.getElementById
   * @param {string} id - ID elementu do znalezienia
   * @return {MockElement|null} Znaleziony element lub null
   */
  const getElementById = (id) => {
    const element = new MockElement("div")
    element.id = id
    return element
  }

  /**
   * Funkcja symulująca document.querySelectorAll
   * @param {string} selector - Selektor CSS
   * @return {Array<MockElement>} Lista znalezionych elementów
   */
  const querySelectorAll = (selector) => {
    return []
  }

  // Ekspozycja narzędzi pomocniczych dla testów
  return {
    app,
    generator,
    createElement,
    getElementById,
    querySelectorAll,

    // Metoda do symulacji zdarzenia DOM
    simulateEvent: (element, eventName, eventData = {}) => {
      if (element && typeof element.dispatchEvent === "function") {
        element.dispatchEvent(eventName, eventData)
      }
    },
  }
}

/**
 * Funkcja pomocnicza do testowania klasy bazowej BaseComponent
 * @param {BaseComponent} component - Testowany komponent
 * @return {Object} Środowisko testowe
 */
export function createComponentTestEnvironment(component) {
  return createTestEnvironment(component)
}
