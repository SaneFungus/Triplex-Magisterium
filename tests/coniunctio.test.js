/**
 * Testy jednostkowe dla zrefaktoryzowanego generatora Coniunctio
 *
 * Ten plik zawiera testy sprawdzające poprawność implementacji
 * generatora Coniunctio po refaktoryzacji do nowej architektury.
 */

import { ConiunctioGenerator } from "../generators/coniunctio-refactored.js"
import { Generator } from "../core/generator-base.js"
import { createTestEnvironment } from "./test-mocks.js"

describe("ConiunctioGenerator", () => {
  let generator
  let testEnv

  beforeEach(() => {
    generator = new ConiunctioGenerator()
    testEnv = createTestEnvironment(generator)
  })

  // Testy dziedziczenia i inicjalizacji
  test("powinien dziedziczyć po klasie Generator", () => {
    expect(generator instanceof Generator).toBe(true)
  })

  test("powinien mieć poprawne właściwości podstawowe", () => {
    expect(generator.id).toBe("coniunctio")
    expect(generator.name).toBe("Coniunctio")
    expect(generator.description).toContain("Dialektyczna integracja")
    expect(generator.icon).toBe("fas fa-yin-yang")
  })

  // Test domyślnych parametrów
  test("powinien zwracać poprawne parametry domyślne", () => {
    const defaultParams = generator.getDefaultParameters()
    expect(defaultParams).toHaveProperty("tension", 6)
    expect(defaultParams).toHaveProperty("syntheses")
    expect(Array.isArray(defaultParams.syntheses)).toBe(true)
    expect(defaultParams.syntheses).toContain("heglowska")
    expect(defaultParams.syntheses).toContain("kontrapunktowa")
  })

  // Test metody renderParameters
  test("powinien poprawnie renderować parametry", () => {
    const parametersHTML = generator.renderParameters()
    expect(parametersHTML).toContain('input type="range"')
    expect(parametersHTML).toContain('data-param="tension"')
    expect(parametersHTML).toContain('input type="checkbox"')
    expect(parametersHTML).toContain('data-param="syntheses"')
    expect(parametersHTML).toContain('data-value="heglowska"')
    expect(parametersHTML).toContain('data-value="nietzscheanska"')
    expect(parametersHTML).toContain('data-value="kontrapunktowa"')
  })

  // Test generowania promptu
  test("powinien poprawnie generować prompt dla domyślnych parametrów", () => {
    const problem = "Testowy problem"
    const parameters = generator.getDefaultParameters()

    const prompt = generator.generatePrompt(problem, parameters)

    expect(prompt).toContain(
      'Przystępując do epistemicznej transmutacji zagadnienia: "Testowy problem"'
    )
    expect(prompt).toContain("Caput Mortuum Resurrecto")
    expect(prompt).toContain(
      "napięciem dialektycznym ustawionym na poziom 6/10"
    )
    expect(prompt).toContain("* Synteza heglowska")
    expect(prompt).toContain("* Synteza kontrapunktowa")
    expect(prompt).toContain("LAPIS PHILOSOPHORUM")
  })

  test("powinien poprawnie generować prompt z pustą listą syntez", () => {
    const problem = "Testowy problem"
    const parameters = {
      ...generator.getDefaultParameters(),
      syntheses: [],
    }

    const prompt = generator.generatePrompt(problem, parameters)

    expect(prompt).toContain(
      'Przystępując do epistemicznej transmutacji zagadnienia: "Testowy problem"'
    )
    expect(prompt).toContain(
      "możliwości połączenia przeciwieństw z wykorzystaniem dialektycznej syntezy przeciwieństw"
    )
    expect(prompt).not.toContain("* Synteza")
  })

  // Test metody z klasy bazowej
  test("metoda generateContent powinna wywołać generatePrompt", () => {
    const problem = "Problem testowy"
    const parameters = generator.getDefaultParameters()

    // Mockowanie metody generatePrompt
    const originalMethod = generator.generatePrompt
    let wasCalled = false

    generator.generatePrompt = (p, params) => {
      wasCalled = true
      expect(p).toBe(problem)
      expect(params).toBe(parameters)
      return originalMethod.call(generator, p, params)
    }

    generator.generateContent(problem, parameters)
    expect(wasCalled).toBe(true)

    // Przywrócenie oryginalnej metody
    generator.generatePrompt = originalMethod
  })

  // Test renderowania UI
  test("powinien poprawnie renderować UI", () => {
    const container = testEnv.createElement()

    generator.renderUI(container)

    expect(container.children.length).toBe(1)
    expect(container.children[0].className).toContain("parameter-group")
    expect(container.children[0].getAttribute("data-generator")).toBe(
      "coniunctio"
    )
  })

  // Test obsługi zdarzeń
  test("powinien reagować na zdarzenie zmiany aktywnego generatora", () => {
    const container = testEnv.createElement()
    generator.renderUI(container)

    // Mockowanie metody DOM getElementById
    const originalGetElementById = document.getElementById
    document.getElementById = (id) => {
      if (id === `${generator.id}-parameters`) {
        return container.children[0]
      }
      return null
    }

    // Symulacja zdarzenia zmiany generatora (na inny niż testowany)
    testEnv.app.emit("generator:changed", "separatio")
    expect(container.children[0].className).not.toContain("active")

    // Symulacja zdarzenia zmiany generatora (na testowany)
    testEnv.app.emit("generator:changed", generator.id)
    expect(container.children[0].className).toContain("active")

    // Przywrócenie oryginalnej metody
    document.getElementById = originalGetElementById
  })
})
