/**
 * Testy jednostkowe dla zrefaktoryzowanego generatora Coagulatio
 *
 * Ten plik zawiera testy sprawdzające poprawność implementacji
 * generatora Coagulatio po refaktoryzacji do nowej architektury.
 */

import { CoagulatioGenerator } from "../generators/coagulatio-refactored.js"
import { Generator } from "../core/generator-base.js"
import { createTestEnvironment } from "./test-mocks.js"

describe("CoagulatioGenerator", () => {
  let generator
  let testEnv

  beforeEach(() => {
    generator = new CoagulatioGenerator()
    testEnv = createTestEnvironment(generator)
  })

  // Testy dziedziczenia i inicjalizacji
  test("powinien dziedziczyć po klasie Generator", () => {
    expect(generator instanceof Generator).toBe(true)
  })

  test("powinien mieć poprawne właściwości podstawowe", () => {
    expect(generator.id).toBe("coagulatio")
    expect(generator.name).toBe("Coagulatio")
    expect(generator.description).toContain("Pragmatyczna translacja")
    expect(generator.icon).toBe("fas fa-hammer")
  })

  // Test domyślnych parametrów
  test("powinien zwracać poprawne parametry domyślne", () => {
    const defaultParams = generator.getDefaultParameters()
    expect(defaultParams).toHaveProperty("temporalScope", "krotkoterminowy")
    expect(defaultParams).toHaveProperty("systemLevel", "interpersonalny")
  })

  // Test metody renderParameters
  test("powinien poprawnie renderować parametry", () => {
    const parametersHTML = generator.renderParameters()
    expect(parametersHTML).toContain('input type="radio"')
    expect(parametersHTML).toContain('data-param="temporalScope"')
    expect(parametersHTML).toContain('select id="coagulatio-level"')
    expect(parametersHTML).toContain('data-param="systemLevel"')
  })

  // Test generowania promptu
  test("powinien poprawnie generować prompt dla domyślnych parametrów", () => {
    const problem = "Testowy problem"
    const parameters = generator.getDefaultParameters()

    const prompt = generator.generatePrompt(problem, parameters)

    expect(prompt).toContain(
      'Przystępując do epistemicznej transmutacji zagadnienia: "Testowy problem"'
    )
    expect(prompt).toContain("Praxis Hermetica")
    expect(prompt).toContain(
      "wymiarze temporalnym krótkoterminowym (Opus Minor)"
    )
    expect(prompt).toContain('poziomie systemowym "interpersonalny"')
  })

  test("powinien poprawnie generować prompt dla niestandardowych parametrów", () => {
    const problem = "Niestandardowy problem"
    const parameters = {
      temporalScope: "dlugoterminowy",
      systemLevel: "spoleczny",
    }

    const prompt = generator.generatePrompt(problem, parameters)

    expect(prompt).toContain(
      'Przystępując do epistemicznej transmutacji zagadnienia: "Niestandardowy problem"'
    )
    expect(prompt).toContain(
      "wymiarze temporalnym długoterminowym (Opus Magnum)"
    )
    expect(prompt).toContain('poziomie systemowym "spoleczny"')
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
      "coagulatio"
    )
  })
})
