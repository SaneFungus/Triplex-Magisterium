document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const formaCards = document.querySelectorAll(".forma-card")
  const paramGroups = document.querySelectorAll(".parameter-group")
  const parametryToggle = document.getElementById("parametry-toggle")
  const parametrySection = document.querySelector(".parametry-esencjalne")
  const currentFormaDisplay = document.getElementById("current-forma")
  const previewButton = document.getElementById("preview-button")
  const transmuteButton = document.getElementById("transmute-button")
  const previewModal = document.getElementById("preview-modal")
  const closeButton = document.querySelector(".close-button")
  const promptPreview = document.getElementById("prompt-preview")
  const copyPromptButton = document.getElementById("copy-prompt")
  const problemInput = document.getElementById("problem-input")
  const recursionCircles = document.querySelectorAll(".recursion-circle")
  const rangeInputs = document.querySelectorAll('input[type="range"]')

  // Add tooltips to fire checkboxes
  const fireDescriptions = {
    ontologiczna: "Pytanie o naturę bytu, istotę, status ontologiczny",
    epistemologiczna: "Pytanie o fundamenty poznania, granice wiedzy",
    aksjologiczna: "Pytanie o wartości, hierarchie i wymiar etyczny",
    pragmatyczna: "Pytanie o konsekwencje, użyteczność, praktykę",
    systemowa: "Pytanie o relacje, wzorce, emergencje, systemy",
    historyczna: "Pytanie o genezę, ewolucję, rozwój w czasie",
    apofatyczna: "Pytanie o to, czym zjawisko nie jest (via negativa)",
  }

  document
    .querySelectorAll('.checkbox-group label input[name="fire"]')
    .forEach((input) => {
      const label = input.parentElement
      const fireType = input.value
      label.setAttribute("data-tooltip", fireDescriptions[fireType])
    })

  // Initialize range input values
  rangeInputs.forEach((input) => {
    const valueDisplay = input.nextElementSibling
    valueDisplay.textContent = `${input.value}/10`

    input.addEventListener("input", function () {
      valueDisplay.textContent = `${this.value}/10`
    })
  })

  // Toggle parameters section
  parametryToggle.addEventListener("click", function () {
    parametrySection.classList.toggle("collapsed")
  })

  // Change active forma card
  formaCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Update active card
      formaCards.forEach((c) => c.classList.remove("active"))
      this.classList.add("active")

      // Update parameter groups
      const forma = this.getAttribute("data-forma")
      paramGroups.forEach((group) => {
        group.classList.remove("active")
        if (group.getAttribute("data-forma") === forma) {
          group.classList.add("active")
        }
      })

      // Update status display
      let formaName, formaType, formaPhase
      switch (forma) {
        case "separatio":
          formaName = "Separatio"
          formaType = "Analityczna"
          formaPhase = "Nigredo"
          break
        case "coagulatio":
          formaName = "Coagulatio"
          formaType = "Pragmatyczna"
          formaPhase = "Albedo"
          break
        case "coniunctio":
          formaName = "Coniunctio"
          formaType = "Dialektyczna"
          formaPhase = "Rubedo"
          break
      }
      currentFormaDisplay.textContent = `Magisterium: ${formaName} (${formaPhase})`
    })
  })

  // Recursion level selector
  recursionCircles.forEach((circle) => {
    circle.addEventListener("click", function () {
      recursionCircles.forEach((c) => c.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Generate prompt based on selected forma and parameters
  function generatePrompt() {
    const activeForma = document
      .querySelector(".forma-card.active")
      .getAttribute("data-forma")
    const problemText =
      problemInput.value.trim() ||
      "zagadnienie, które wymaga alchemicznej transmutacji"
    const recursionLevel = document
      .querySelector(".recursion-circle.active")
      .getAttribute("data-level")

    let prompt = ""

    // Common intro
    prompt += `Przystępując do epistemicznej transmutacji zagadnienia: "${problemText}", `

    // Forma-specific content
    switch (activeForma) {
      case "separatio":
        const fireCheckboxes = document.querySelectorAll(
          '.parameter-group[data-forma="separatio"] input[name="fire"]:checked'
        )
        const fires = Array.from(fireCheckboxes).map(
          (checkbox) => checkbox.value
        )
        const depthLevel = document.getElementById("separatio-depth").value

        prompt += `uruchom Primordialis Alembicus - narzędzie separacji esencji od przypadłości.\n\n`
        prompt += `Twoje zadanie obejmuje:\n\n`
        prompt += `1. MATERIA PRIMA: Zidentyfikuj substrat epistemiczny (fundamentalne elementy zagadnienia, ich naturę i wzajemne relacje).\n\n`
        prompt += `2. CALCINATIO: Aplikuj następujące ognie analityczne do badanej materii:\n`

        if (fires.length > 0) {
          fires.forEach((fire) => {
            if (fire === "ontologiczna") {
              prompt += `   * Ogień ontologiczny (pytanie o naturę bytu)\n`
            } else if (fire === "epistemologiczna") {
              prompt += `   * Ogień epistemologiczny (pytanie o fundamenty poznania)\n`
            } else if (fire === "aksjologiczna") {
              prompt += `   * Ogień aksjologiczny (pytanie o wartości i hierarchie)\n`
            } else if (fire === "pragmatyczna") {
              prompt += `   * Ogień pragmatyczny (pytanie o konsekwencje i użyteczność)\n`
            } else if (fire === "systemowa") {
              prompt += `   * Ogień systemowy (pytanie o relacje i emergencje)\n`
            } else if (fire === "historyczna") {
              prompt += `   * Ogień historyczny (pytanie o genezę i ewolucję)\n`
            } else if (fire === "apofatyczna") {
              prompt += `   * Ogień apofatyczny (pytanie o to, czym zjawisko nie jest)\n`
            }
          })
        }

        prompt += `\n3. SEPARATIO: Przeprowadź proceduralną destylację z głębią analityczną ${depthLevel}/10, uwzględniając:\n`
        prompt += `   * Oddzielenie elementów esencjalnych od przypadkowych\n`
        prompt += `   * Rozpoznanie elementów lotnych (zmiennych) od utrwalonych (stałych)\n`
        prompt += `   * Identyfikację proporcji elementarnych w badanym fenomenie\n\n`
        prompt += `4. SOLUTIO: Rozpuść uzyskane esencje w rozpuszczalniku kontekstualnym, obserwując ich zachowanie w różnych środowiskach konceptualnych.\n\n`
        prompt += `5. QUINTESSENTIA: Wyodrębnij quintessencję - esencję piątego rzędu transcendującą cztery żywioły.\n\n`
        break

      case "coagulatio":
        const temporalScope = document.querySelector(
          'input[name="temporal-scope"]:checked'
        ).value
        const systemLevel = document.getElementById("coagulatio-level").value

        let temporalName
        switch (temporalScope) {
          case "krotkoterminowy":
            temporalName = "krótkoterminowym (Opus Minor)"
            break
          case "srednioterminowy":
            temporalName = "średnioterminowym (Opus Medium)"
            break
          case "dlugoterminowy":
            temporalName = "długoterminowym (Opus Magnum)"
            break
        }

        prompt += `uruchom Praxis Hermetica - narzędzie transformacji lotnych esencji w materialne manifestacje.\n\n`
        prompt += `Twoje zadanie obejmuje:\n\n`
        prompt += `1. FIXATIO: Określ praktyczne manifestacje w wymiarze temporalnym ${temporalName}.\n\n`
        prompt += `2. MULTIPLICATIO: Zidentyfikuj potencjalne punkty dźwigni na poziomie systemowym "${systemLevel}", gdzie minimalna interwencja może prowadzić do maksymalnej amplifikacji efektu.\n\n`
        prompt += `3. FERMENTATIO: Określ warunki, w których zidentyfikowane praktyki mogą podlegać organicznemu rozwojowi i transformacji.\n\n`
        prompt += `4. PROJECTIO: Przeprowadź myślowy eksperyment implementacji, uwzględniając potencjalne transmutacje niezamierzone, systemowe sprzężenia zwrotne i prognostyczne scenariusze ewolucji praktyk.\n\n`
        prompt += `5. RUBEDO: Określ wskaźniki osiągnięcia "czerwienienia" - stanu, w którym praktyka osiąga dojrzałość i autonomiczną żywotność.\n\n`
        break

      case "coniunctio":
        const tensionLevel = document.getElementById("coniunctio-tension").value
        const synthesisTypes = document.querySelectorAll(
          '.parameter-group[data-forma="coniunctio"] input[name="synthesis"]:checked'
        )
        const syntheses = Array.from(synthesisTypes).map(
          (checkbox) => checkbox.value
        )

        prompt += `uruchom Caput Mortuum Resurrecto - narzędzie reaktywacji odrzuconych elementów.\n\n`
        prompt += `Twoje zadanie obejmuje:\n\n`
        prompt += `1. MORTIFICATIO RECENSIO: Przeprowadź inwentaryzację tego, co zostało odrzucone, zmarginalizowane lub pominięte w standardowych analizach zagadnienia.\n\n`
        prompt += `2. PUTREFACTIO CREATIVA: Pozwól, by odrzucone elementy uległy twórczemu rozkładowi, z napięciem dialektycznym ustawionym na poziom ${tensionLevel}/10.\n\n`
        prompt += `3. INVERSIO HIERARCHIAE: Przeprowadź eksperyment odwrócenia hierarchii wartości i rozważ, jakie nowe struktury poznawcze mogłyby wyłonić się z takiego odwrócenia.\n\n`
        prompt += `4. CONIUNCTIO: Poszukaj możliwości połączenia przeciwieństw z wykorzystaniem`

        if (syntheses.length > 0) {
          prompt += ` następujących typów syntezy:\n`
          syntheses.forEach((type) => {
            prompt += `   * Synteza ${type}\n`
          })
        } else {
          prompt += ` dialektycznej syntezy przeciwieństw.\n`
        }

        prompt += `\n5. LAPIS PHILOSOPHORUM: Zidentyfikuj potencjalne "kamienie filozoficzne" - elementy odrzucone, które mogą okazać się kluczowe dla głębszego zrozumienia zagadnienia.\n\n`
        break
    }

    // Meta-poziom rekursji
    if (recursionLevel > 1) {
      prompt += `\nSPIRITUS RECTOR: Przeprowadź metarefleksję ${recursionLevel}-go rzędu nad całością procesu poznawczego, uwzględniając:\n`
      prompt += `* SPECULUM EPISTEMICUM: Granice zastosowanych procedur i ukryte założenia epistemologiczne\n`
      prompt += `* CIRCULATIO: Cykliczną naturę procesu poznawczego\n`
      prompt += `* SUBLIMATIO: Potencjał wzniesienia procesu na wyższy poziom\n`
      prompt += `* ROTATIO: Zmianę pozycji obserwatora i jej wpływ na proces\n`
      prompt += `* MULTIPLICATIO METHODORUM: Możliwe alternatywne podejścia do analizowanego zagadnienia\n\n`
    }

    return prompt
  }

  // KLUCZOWA ZMIANA - udostępnij funkcję generatePrompt globalnie
  window.generatePrompt = generatePrompt

  // Preview button
  previewButton.addEventListener("click", function () {
    const prompt = generatePrompt()
    promptPreview.textContent = prompt
    previewModal.style.display = "block"
  })

  // Transmute button
  transmuteButton.addEventListener("click", function () {
    const prompt = generatePrompt()
    // W rzeczywistej aplikacji, ten prompt zostałby wysłany do API AI
    promptPreview.textContent = prompt
    previewModal.style.display = "block"
  })

  // Close modal
  closeButton.addEventListener("click", function () {
    previewModal.style.display = "none"
  })

  // Click outside modal to close
  window.addEventListener("click", function (event) {
    if (event.target === previewModal) {
      previewModal.style.display = "none"
    }
  })

  // Copy prompt to clipboard
  copyPromptButton.addEventListener("click", function () {
    navigator.clipboard.writeText(promptPreview.textContent).then(function () {
      copyPromptButton.textContent = "Skopiowano!"
      setTimeout(() => {
        copyPromptButton.textContent = "Kopiuj do schowka"
      }, 2000)
    })
  })

  // Inicjalizacja obsługi panelu "Wymiar Epistemiczny"
  const wymiarToggle = document.getElementById("wymiar-toggle")
  const wymiarSection = document.querySelector(".epistemiczny-wymiar")

  if (wymiarToggle && wymiarSection) {
    wymiarToggle.addEventListener("click", function () {
      wymiarSection.classList.toggle("collapsed")
      console.log(
        "Panel wymiarów został " +
          (wymiarSection.classList.contains("collapsed")
            ? "zwinięty"
            : "rozwinięty")
      )
    })
  }
})
