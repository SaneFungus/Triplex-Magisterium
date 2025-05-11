# Simplex Atanor: Dokumentacja Architektury Komponentów

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Architektura bazowa](#architektura-bazowa)
   - [Hierarchia klas](#hierarchia-klas)
   - [Relacje między klasami](#relacje-między-klasami)
3. [Interfejsy programistyczne](#interfejsy-programistyczne)
   - [BaseComponent](#basecomponent)
   - [Generator](#generator)
   - [Plugin](#plugin)
4. [Cykl życia komponentów](#cykl-życia-komponentów)
5. [Integracja z systemem zdarzeń](#integracja-z-systemem-zdarzeń)
6. [Przykłady implementacji](#przykłady-implementacji)
   - [Implementacja generatora](#implementacja-generatora)
   - [Implementacja pluginu](#implementacja-pluginu)
7. [Migracja istniejących komponentów](#migracja-istniejących-komponentów)
8. [Najlepsze praktyki](#najlepsze-praktyki)
9. [Testowanie komponentów](#testowanie-komponentów)
   - [Środowisko testowe](#środowisko-testowe)
   - [Testy jednostkowe](#testy-jednostkowe)
   - [Makiety obiektów](#makiety-obiektów)

## Wprowadzenie

Nowa architektura komponentów w projekcie Simplex Atanor powstała w odpowiedzi na potrzebę ujednolicenia interfejsów programistycznych generatorów i pluginów, eliminacji powielającego się kodu oraz uproszczenia procesu tworzenia nowych komponentów.

Głównymi celami tej architektury są:

- Zapewnienie spójnego interfejsu dla różnych typów komponentów
- Zmniejszenie ilości kodu powtarzalnego
- Standaryzacja interakcji z UI i systemem zdarzeń
- Uproszczenie procesu dodawania nowych funkcjonalności
- Zapewnienie kompatybilności wstecznej

Dzięki zastosowaniu dziedziczenia klas i abstrakcyjnych interfejsów, nowa architektura oferuje lepszą modularność, czytelność i możliwości rozbudowy aplikacji.

## Architektura bazowa

### Hierarchia klas

Architektura opiera się na trójwarstwowej hierarchii klas:

```
BaseComponent (abstrakcyjna)
├── Generator (abstrakcyjna)
│   ├── SeparatioGenerator
│   ├── CoagulatioGenerator
│   ├── ConiunctioGenerator
│   └── SublimationGenerator
└── Plugin (abstrakcyjna)
    └── PresentationFormatPlugin
```

Wszystkie generatory promptów zostały już pomyślnie zrefaktoryzowane, aby dziedziczyły po klasie bazowej Generator. Każdy z nich zachowuje swoją unikalną funkcjonalność, jednocześnie korzystając z wspólnego interfejsu i funkcjonalności dostarczanych przez klasy bazowe.

### Relacje między klasami

1. **BaseComponent** - abstrakcyjna klasa bazowa definiująca wspólny interfejs dla wszystkich komponentów. Zapewnia podstawowe właściwości, metody zarządzania stanem i systemem zdarzeń.

2. **Generator** - klasa pośrednicząca dla generatorów promptów, rozszerzająca BaseComponent. Dodaje funkcjonalności specyficzne dla generatorów, takie jak renderowanie kontrolek parametrów i generowanie promptów.

3. **Plugin** - klasa pośrednicząca dla pluginów, rozszerzająca BaseComponent. Dodaje funkcjonalności specyficzne dla pluginów, takie jak integracja z UI, obsługa przełącznika włączania/wyłączania i generowanie dodatkowej treści do promptów.

## Interfejsy programistyczne

### BaseComponent

```javascript
class BaseComponent {
    constructor(config = {})
    initialize(app)
    getDefaultState()
    generateContent(problem, parameters)
    renderUI(container)
    _setupEventListeners()
    _listen(event, callback)
    _removeAllListeners()
    destroy()
}
```

#### Kluczowe właściwości:

- `id` - unikalny identyfikator komponentu
- `name` - nazwa wyświetlana komponentu
- `description` - opis komponentu
- `icon` - klasa ikony (głównie dla generatorów)
- `app` - referencja do głównej aplikacji

#### Kluczowe metody:

- **initialize(app)** - inicjalizacja komponentu z referencją do aplikacji
- **getDefaultState()** - zwraca domyślny stan komponentu
- **generateContent(problem, parameters)** - generuje treść (abstrakcyjna)
- **renderUI(container)** - renderuje interfejs użytkownika (abstrakcyjna)
- **destroy()** - czyści zasoby przed usunięciem komponentu

### Generator

```javascript
class Generator extends BaseComponent {
    constructor(config = {})
    renderUI(container)
    renderParameters()
    getDefaultParameters()
    generatePrompt(problem, parameters)
    _setupParameterControls(containerElem)
}
```

#### Dodatkowe metody:

- **renderParameters()** - renderuje kontrolki parametrów (abstrakcyjna)
- **getDefaultParameters()** - zwraca domyślne parametry generatora
- **generatePrompt(problem, parameters)** - generuje prompt (abstrakcyjna)
- **\_setupParameterControls(containerElem)** - konfiguruje kontrolki parametrów

### Plugin

```javascript
class Plugin extends BaseComponent {
    constructor(config = {})
    initialize(app)
    renderUI(container)
    _onParametersRendered(container)
    _createPluginContainer()
    _renderEnableToggle(container, isEnabled)
    _onToggleStateChanged(isEnabled)
    refreshUI()
}
```

#### Dodatkowe właściwości:

- `section` - nazwa sekcji w wynikowym prompcie

#### Dodatkowe metody:

- **\_onParametersRendered(container)** - obsługuje zdarzenie renderowania parametrów
- **\_createPluginContainer()** - tworzy kontener dla interfejsu pluginu
- **\_renderEnableToggle(container, isEnabled)** - renderuje przełącznik włączania/wyłączania
- **\_onToggleStateChanged(isEnabled)** - obsługuje zmianę stanu włączenia
- **refreshUI()** - odświeża interfejs użytkownika pluginu

## Cykl życia komponentów

1. **Konstrukcja** - utworzenie obiektu komponentu z konfiguracją
2. **Rejestracja** - dodanie komponentu do rejestru generatorów lub pluginów
3. **Inicjalizacja** - wywołanie `initialize(app)` podczas startu aplikacji
4. **Konfiguracja zdarzeń** - skonfigurowanie nasłuchiwania zdarzeń systemowych
5. **Renderowanie UI** - renderowanie interfejsu użytkownika
6. **Działanie** - reagowanie na zdarzenia i generowanie treści
7. **Zniszczenie** - opcjonalne wywołanie `destroy()` przed usunięciem komponentu

Diagram sekwencji inicjalizacji:

```
App                    Component
 |                        |
 |------ initialize ----->|
 |                        |
 |                        |--- getDefaultState()
 |                        |
 |                        |--- _setupEventListeners()
 |                        |
 |<----- return ----------|
 |                        |
 |------ renderUI ------->|
 |                        |
```

## Integracja z systemem zdarzeń

Komponenty komunikują się z aplikacją i między sobą poprzez system zdarzeń. Kluczowe zdarzenia:

1. **app:initialized** - emitowane po inicjalizacji aplikacji
2. **generator:changed** - emitowane gdy użytkownik zmienia aktywny generator
3. **prompt:generating** - emitowane podczas generowania promptu
4. **ui:parameters-rendered** - emitowane po wyrenderowaniu paneli parametrów
5. **state:changed** - emitowane przy zmianie stanu aplikacji

Klasa `BaseComponent` udostępnia metodę `_listen(event, callback)`, która automatycznie rejestruje nasłuchiwacze zdarzeń i umożliwia ich łatwe usuwanie przy zniszczeniu komponentu.

## Przykłady implementacji

### Implementacja generatora

```javascript
import { Generator } from "../core/generator-base.js"

export class SublimationGenerator extends Generator {
  constructor() {
    super({
      id: "sublimatio",
      name: "Sublimatio",
      description: "Citrinas/Rubedo - Transcendencja problemu...",
      icon: "fas fa-wind",
    })
  }

  getDefaultParameters() {
    return {
      intensity: 7,
      dimensions: ["transcendencja", "metafora", "analogia", "integracja"],
    }
  }

  renderParameters() {
    return `
            <div class="parameter">
                <label for="sublimatio-intensity">Intensywność procesu sublimacji:</label>
                <input type="range" id="sublimatio-intensity" data-param="intensity" min="1" max="10" value="7">
                <span class="parameter-value">7/10</span>
            </div>
            <!-- inne parametry -->
        `
  }

  generatePrompt(problem, parameters) {
    // Logika generowania promptu
    let prompt = `Przystępując do epistemicznej sublimacji zagadnienia: "${problem}"...`
    return prompt
  }
}
```

### Implementacja pluginu

```javascript
import { Plugin } from "../core/plugin-base.js"

export class CustomPlugin extends Plugin {
  constructor() {
    super({
      id: "customPlugin",
      name: "Niestandardowy Plugin",
      description: "Przykładowy plugin używający nowej architektury",
      section: "Sekcja Niestandardowa",
    })
  }

  getDefaultState() {
    return {
      enabled: true,
      option1: "wartość",
      option2: true,
    }
  }

  renderUI(container) {
    // Wywołanie metody klasy bazowej (dodaje przełącznik włączania/wyłączania)
    super.renderUI(container)

    // Dodaj własne elementy UI
    const optionContainer = document.createElement("div")
    optionContainer.className = "parameter"
    optionContainer.innerHTML = `
            <label for="custom-option">Opcja niestandardowa:</label>
            <input type="text" id="custom-option" value="${this.app.getState(
              `pluginData.${this.id}.option1`
            )}">
        `
    container.appendChild(optionContainer)

    // Dodaj obsługę zdarzeń
    setTimeout(() => {
      const input = document.getElementById("custom-option")
      if (input) {
        input.addEventListener("input", () => {
          this.app.setState(`pluginData.${this.id}.option1`, input.value)
        })
      }
    }, 0)
  }

  generateContent() {
    const pluginState = this.app.getState(`pluginData.${this.id}`)

    if (!pluginState.enabled) {
      return ""
    }

    return `Treść generowana przez niestandardowy plugin: ${pluginState.option1}`
  }
}
```

## Migracja istniejących komponentów

Proces migracji istniejących komponentów do nowej architektury został zakończony dla wszystkich generatorów. Migracja obejmowała następujące kroki:

1. **Analiza istniejącego kodu** - identyfikacja metod i właściwości do przeniesienia
2. **Dziedziczenie z odpowiedniej klasy bazowej** - Generator lub Plugin
3. **Refaktoryzacja konstruktora** - przeniesienie inicjalizacji do parametrów konstruktora klasy bazowej
4. **Dostosowanie metod** - dostosowanie istniejących metod do nowych interfejsów
5. **Testowanie** - weryfikacja, czy komponenty działają identycznie jak przed migracją

Zrefaktoryzowane komponenty zostały pomyślnie przetestowane i zintegrowane z aplikacją, zachowując pełną kompatybilność funkcjonalną.

## Najlepsze praktyki

### Definiowanie komponentów

1. **Nazewnictwo** - używaj konwencji PascalCase dla klas i camelCase dla metod
2. **Konfiguracja** - przekazuj wszystkie kluczowe parametry przez obiekt konfiguracyjny w konstruktorze
3. **Dziedziczenie** - zawsze dziedzicz z odpowiedniej klasy bazowej
4. **Enkapsulacja** - używaj metod prywatnych (z prefiksem `_`) dla wewnętrznej logiki

### Zarządzanie stanem

1. **Domyślny stan** - definiuj kompletny stan domyślny w metodzie `getDefaultState()`
2. **Dostęp do stanu** - zawsze używaj metod `app.getState()` i `app.setState()`
3. **Głęboki stan** - organizuj stan hierarchicznie dla lepszej czytelności
4. **Nazewnictwo** - używaj jasnych, opisowych nazw dla kluczy stanu

### Interakcja z UI

1. **Separacja logiki** - oddzielaj logikę biznesową od renderowania UI
2. **Nasłuchiwanie zdarzeń** - dodawaj nasłuchiwanie zdarzeń po renderowaniu elementów DOM
3. **Aktualizacja UI** - implementuj metody do odświeżania UI w odpowiedzi na zmiany stanu
4. **Dostępność** - projektuj UI z myślą o dostępności (prawidłowe etykiety, kontrast, itp.)

### Obsługa zdarzeń

1. **Rejestracja** - używaj metody `_listen()` do rejestrowania nasłuchiwaczy zdarzeń
2. **Czyszczenie** - upewnij się, że wszystkie nasłuchiwacze są usuwane w metodzie `destroy()`
3. **Konwencje nazewnictwa** - używaj formatu `kategoria:akcja` dla nazw zdarzeń
4. **Zasięg** - emituj tylko zdarzenia niezbędne do funkcjonowania aplikacji

## Testowanie komponentów

Architektura komponentów została uzupełniona o kompletny system testów jednostkowych, umożliwiający weryfikację poprawności implementacji.

### Środowisko testowe

Dla testowania komponentów utworzono dedykowane środowisko testowe, które symuluje rzeczywiste środowisko aplikacji bez potrzeby faktycznego renderowania w przeglądarce:

```javascript
export function createTestEnvironment(generator) {
  // Utworzenie instancji aplikacji
  const app = new MockSimplexApp();
  
  // Dodanie domyślnych parametrów generatora do stanu aplikacji
  const defaultParams = generator.getDefaultParameters();
  app.state.parameters[generator.id] = defaultParams;
  
  // Inicjalizacja generatora z makietą aplikacji
  generator.initialize(app);
  
  // Zwrócenie środowiska testowego
  return {
    app,
    generator,
    createElement: () => new MockElement(),
    getElementById: (id) => { /* ... */ },
    querySelectorAll: (selector) => { /* ... */ },
    simulateEvent: (element, eventName, eventData) => { /* ... */ }
  };
}
```

### Testy jednostkowe

Dla każdego generatora zdefiniowano komplet testów jednostkowych sprawdzających poprawność implementacji:

1. **Testy dziedziczenia** - sprawdzanie poprawnej hierarchii klas
2. **Testy właściwości** - weryfikacja poprawności podstawowych właściwości
3. **Testy parametrów** - sprawdzanie domyślnych parametrów
4. **Testy renderowania** - weryfikacja poprawności renderowania UI
5. **Testy logiki biznesowej** - sprawdzanie poprawności generowania promptów
6. **Testy zdarzeń** - testowanie reakcji na zdarzenia systemowe

### Makiety obiektów

Do testowania komponentów wykorzystywane są specjalne makiety (mock objects) symulujące rzeczywiste obiekty aplikacji:

1. **MockElement** - symulacja elementów DOM z metodami takimi jak appendChild, setAttribute, itd.
2. **MockSimplexApp** - symulacja głównej aplikacji z metodami getState, setState oraz systemem zdarzeń
3. **Dodatkowe narzędzia** - funkcje pomocnicze do symulacji zdarzeń i interakcji z UI

Dzięki tym makietom możliwe jest testowanie komponentów w izolowanym środowisku, co zwiększa niezawodność i powtarzalność testów.