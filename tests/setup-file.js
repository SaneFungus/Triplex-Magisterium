/**
 * Plik konfiguracyjny dla środowiska testowego
 * 
 * Ten plik zawiera globalne ustawienia przed uruchomieniem testów.
 * Dodaje globalne makiety, symuluje środowisko przeglądarki itp.
 */

// Makiety dla API przeglądarki
global.document = {
  getElementById: jest.fn().mockImplementation(() => ({
    addEventListener: jest.fn(),
    classList: {
      toggle: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn().mockReturnValue(false)
    },
    querySelectorAll: jest.fn().mockReturnValue([]),
    setAttribute: jest.fn(),
    appendChild: jest.fn()
  })),
  createElement: jest.fn().mockImplementation((tag) => ({
    tagName: tag,
    className: '',
    innerHTML: '',
    style: {},
    children: [],
    addEventListener: jest.fn(),
    appendChild: jest.fn(),
    querySelectorAll: jest.fn().mockReturnValue([]),
    getAttribute: jest.fn(),
    setAttribute: jest.fn()
  })),
  querySelectorAll: jest.fn().mockReturnValue([])
};

global.window = {
  addEventListener: jest.fn(),
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
  },
  location: {
    href: 'http://localhost/'
  }
};

global.navigator = {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined)
  }
};

// Globalne makiety potrzebne do testów
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn()
};

// Dodatkowe ustawienia globalne
global.setTimeout = jest.fn().mockImplementation((cb) => cb());
