# Triplex Magisterium - Interfejs Epistemicznej Transmutacji

## O Projekcie

Triplex Magisterium to narzędzie do generowania zaawansowanych promptów dla modeli AI, oparte na koncepcjach alchemicznych i epistemologicznych. Aplikacja pozwala na tworzenie złożonych, wielowarstwowych promptów z różnymi parametrami dostosowanymi do konkretnych typów analizy.

Strona projektu: [https://sanefungus.github.io/Triplex-Magisterium/](https://sanefungus.github.io/Triplex-Magisterium/)

## Nowa Struktura Modularna

Projekt został zreorganizowany w strukturę modularną, co umożliwia łatwiejsze rozszerzanie funkcjonalności i niezależną pracę nad poszczególnymi elementami. Główne komponenty zostały podzielone na mniejsze, autonomiczne moduły, które komunikują się ze sobą przez centralny system zdarzeń.

### Struktura Katalogów

```
Triplex-Magisterium/
├── index.html                  # Główny plik HTML
├── assets/
│   └── css/
│       └── styles.css          # Style CSS
├── core/
│   └── app.js                  # Centralny punkt aplikacji
├── generators/                 # Generatory promptów
│   ├── generators.js           # Rejestr wszystkich generatorów
│   ├── separatio.js            # Generator Separatio
│   ├── coagulatio.js           # Generator Coagulatio
│   └── coniunctio.js           # Generator Coniunctio
└── plugins/                    # Opcjonalne pluginy
    ├── plugins.js              # Rejestr pluginów
    └── examples/
        └── style-selector.js   # Przykładowy plugin
```

## Architektura Aplikacji

### Główne Komponenty

1. **Centralna Aplikacja** (core/app.js)
   - Zarządza stanem aplikacji
   - Koordynuje komunikację między modułami
   - Obsługuje system zdarzeń (event bus)
   - Renderuje interfejs użytkownika

2. **Generatory Promptów** (generators/)
   - Każdy generator jest samodzielnym modułem
   - Definiuje parametry i UI potrzebne dla danego generatora
   - Implementuje logikę generowania promptu
   - Automatycznie rejestruje się w systemie

3. **Pluginy** (plugins/)
   - Rozszerzają funkcjonalność bez modyfikowania głównego kodu
   - Mogą dodawać nowe sekcje do promptu
   - Mogą dodawać własne elementy interfejsu
   - Reagują na zdarzenia z głównej aplikacji

### Przepływ Danych

Aplikacja wykorzystuje centralny system zdarzeń do komunikacji między modułami:

1. Użytkownik wprowadza problem i ustawia parametry
2. Po kliknięciu "Podgląd" lub "Transmutuj":
   - Aplikacja pobiera aktywny generator
   - Generator tworzy bazowy prompt na podstawie parametrów
   - Aplikacja emituje zdarzenie `prompt:generating`
   - Pluginy mogą dodawać dodatkowe sekcje do promptu
   - Aplikacja łączy wszystkie elementy w gotowy prompt

## Rozszerzanie Aplikacji

### Dodawanie Nowego Generatora Promptów

1. Utwórz nowy plik w katalogu `generators/`, np. `newGenerator.js`:

```javascript
export class NewGenerator {
    constructor() {
        this.id = 'newGenerator';           // Unikalny identyfikator
        this.name = 'Nazwa Generatora';     // Wyświetlana nazwa
        this.description = 'Opis generatora'; // Krótki opis
        this.icon = 'fas fa-icon-name';     // Ikona z Font Awesome
    }
    
    initialize(app) {
        this.app = app;  // Dostęp do głównej aplikacji
    }
    
    getDefaultParameters() {
        // Wartości domyślne parametrów
        return {
            param1: 5,
            param2: ['wartość1', 'wartość2']
        };
    }
    
    renderParameters() {
        // Zwróć HTML dla panelu parametrów
        return `
            <div class="parameter">
                <label for="param1-id">Nazwa parametru:</label>
                <input type="range" id="param1-id" data-param="param1" min="1" max="10" value="5">
                <span class="parameter-value">5/10</span>
            </div>
            <div class="parameter">
                <label>Inny parametr:</label>
                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" data-param="param2" data-value="wartość1" checked> Opcja 1
                    </label>
                    <label>
                        <input type="checkbox" data-param="param2" data-value="wartość2" checked> Opcja 2
                    </label>
                </div>
            </div>
        `;
    }
    
    generatePrompt(problem, parameters) {
        // Implementacja generowania promptu
        const { param1, param2 } = parameters;
        
        let prompt = `Przystępując do epistemicznej transmutacji zagadnienia: "${problem}", `;
        prompt += `uruchom [Nazwa Procesu] - [krótki opis procesu].\n\n`;
        prompt += `Twoje zadanie obejmuje:\n\n`;
        // Dodaj sekcje promptu
        
        return prompt;
    }
}
```

2. Dodaj referencję do nowego generatora w pliku `generators/generators.js`:

```javascript
import { NewGenerator } from './newGenerator.js';

// Dodaj do istniejącego rejestru
export const generators = {
    separatio: new SeparatioGenerator(),
    coagulatio: new CoagulatioGenerator(),
    coniunctio: new ConiunctioGenerator(),
    newGenerator: new NewGenerator() // Nowa linia
};
```

### Dodawanie Nowego Pluginu

1. Utwórz nowy plik w katalogu `plugins/examples/`, np. `newPlugin.js`:

```javascript
export class NewPlugin {
    constructor() {
        this.id = 'newPlugin';
        this.name = 'Nazwa Pluginu';
        this.description = 'Opis funkcji pluginu';
    }
    
    initialize(app) {
        this.app = app;
        
        // Nasłuchiwanie zdarzeń
        app.on('app:initialized', () => this.registerUI());
        app.on('prompt:generating', (additionalContent) => {
            additionalContent.newPluginSection = this.generateContent();
        });
    }
    
    getDefaultState() {
        return {
            // Stan początkowy pluginu
            option1: 'wartość',
            option2: true
        };
    }
    
    // Obsługa zdarzeń i generowanie treści
    generateContent() {
        // Generowanie treści do promptu
        return "Treść dodawana przez plugin";
    }
    
    // Opcjonalnie - rejestracja elementów UI
    registerUI() {
        // Nasłuchiwanie zdarzenia renderowania parametrów
        this.app.on('ui:parameters-rendered', (container) => {
            // Tworzenie i dodawanie elementów UI
            const section = document.createElement('div');
            section.className = 'plugin-section';
            section.innerHTML = `
                <h3>Nazwa Sekcji</h3>
                <!-- Elementy UI pluginu -->
            `;
            container.appendChild(section);
        });
    }
}
```

2. Dodaj referencję do pluginu w pliku `plugins/plugins.js`:

```javascript
import { NewPlugin } from './examples/newPlugin.js';

// Dodaj do istniejącego rejestru
export const plugins = {
    // Odkomentuj jeśli istnieje
    // styleSelector: new StyleSelectorPlugin(),
    newPlugin: new NewPlugin()
};
```

## System Zdarzeń (Event Bus)

Aplikacja wykorzystuje prosty system zdarzeń do komunikacji między modułami. Główne zdarzenia:

- `app:initialized` - aplikacja została zainicjalizowana
- `generator:changed` - zmieniono aktywny generator
- `state:changed` - zmieniono stan aplikacji
- `prompt:generating` - trwa generowanie promptu
- `ui:parameters-rendered` - wyrenderowano panele parametrów

Przykłady nasłuchiwania zdarzeń:

```javascript
// Nasłuchiwanie zdarzenia
app.on('zdarzenie:nazwa', (data) => {
    // Obsługa zdarzenia
});

// Emitowanie zdarzenia
app.emit('zdarzenie:nazwa', { wartość: 123 });
```

## Zarządzanie Stanem

Aplikacja używa centralnego systemu zarządzania stanem. Dostęp do stanu:

```javascript
// Pobieranie wartości ze stanu
const wartość = app.getState('ścieżka.do.wartości');

// Ustawianie wartości w stanie
app.setState('ścieżka.do.wartości', nowaWartość);
```

Pluginy mogą przechowywać swój stan w dedykowanej przestrzeni: `pluginData.[pluginId]`.

## Rozwój i Utrzymanie

### Konfiguracja Lokalna

Aby przetestować aplikację lokalnie, można użyć prostego serwera HTTP:

```bash
# Używając Python
python -m http.server

# Lub innego narzędzia jak live-server
npx live-server
```

### Wdrażanie Zmian

1. Sklonuj repozytorium: `git clone https://github.com/YOUR_USERNAME/REPO_NAME.git`
2. Utwórz nową gałąź: `git checkout -b nazwa-funkcji`
3. Wprowadź zmiany
4. Zatwierdź zmiany: `git commit -am "Opis zmian"`
5. Wypchnij zmiany: `git push origin nazwa-funkcji`
6. Utwórz Pull Request na GitHub

## Zalety Modularnej Architektury

1. **Separacja obaw** - każdy moduł ma jasno określoną odpowiedzialność
2. **Łatwość rozszerzania** - dodawanie nowych generatorów lub pluginów bez modyfikacji istniejącego kodu
3. **Utrzymywalność** - zmiana w jednym module nie wpływa na inne
4. **Przejrzystość** - jasna struktura ułatwia zrozumienie projektu
5. **Współpraca** - możliwość równoległej pracy nad różnymi modułami
6. **Testowanie** - łatwiejsze testowanie izolowanych komponentów

---


## Technologie

- Vanilla JavaScript (ES Modules)
- HTML5
- CSS3
- Font Awesome (ikony)

## Licencja

[MIT License]

## Kontakt

[Informacje kontaktowe]

---

*Ostatnia aktualizacja: 11.05.2025*

