function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOperations(selectedOps, start, end) {
  const problems = [];
  const a = randInt(start, end);
  const b = randInt(start, end);

  selectedOps.forEach(op => {
    switch (op) {
      case "add": problems.push({q: `${a} + ${b} =`, a: a + b}); break;
      case "sub": problems.push({q: `${a + b} - ${a} =`, a: b}); break;
      case "mul": problems.push({q: `${a} × ${b} =`, a: a * b}); break;
      case "div": problems.push({q: `${a * b} ÷ ${a} =`, a: b}); break;
      case "exp": problems.push({q: `${a} ^ 2 =`, a: a ** 2}); break;
    }
  });
  return problems;
}

// --- WORKSHEETS ---
function generateWorksheets() {
  const ops = [...document.querySelectorAll('#worksheetForm input[type=checkbox]:checked')].map(c => c.value);
  const start = parseInt(document.getElementById("startNum").value);
  const end = parseInt(document.getElementById("endNum").value);
  const perPage = parseInt(document.getElementById("questionsPerPage").value);
  const pages = parseInt(document.getElementById("numPages").value);

  const output = document.getElementById("worksheetOutput");
  output.innerHTML = "";

  for (let p = 0; p < pages; p++) {
    const pageDiv = document.createElement("div");
    pageDiv.className = "worksheet";
    pageDiv.innerHTML = `<h2>Numble Worksheet - Page ${p+1}</h2>`;

    const grid = document.createElement("div");
    grid.className = "problem-grid";

    for (let i = 0; i < perPage; i++) {
      const prob = getOperations(ops, start, end)[0];
      const div = document.createElement("div");
      div.className = "problem";
      div.textContent = prob.q;
      grid.appendChild(div);
    }

    pageDiv.appendChild(grid);
    output.appendChild(pageDiv);
  }
}

// --- FLASHCARDS ---
let flashIndex = 0, flashProblems = [];

function startFlashcards() {
  const ops = [...document.querySelectorAll('#flashForm input[type=checkbox]:checked')].map(c => c.value);
  const start = parseInt(document.getElementById("flashStart").value);
  const end = parseInt(document.getElementById("flashEnd").value);
  const mode = document.getElementById("flashMode").value;

  flashProblems = [];
  for (let i = 0; i < 20; i++) {
    flashProblems.push(getOperations(ops, start, end)[0]);
  }
  flashIndex = 0;

  const out = document.getElementById("flashOutput");
  out.innerHTML = "";

  if (mode === "digital") {
    showFlashcard();
  } else if (mode === "printable") {
    const grid = document.createElement("div");
    grid.className = "problem-grid";
    flashProblems.forEach(prob => {
      const div = document.createElement("div");
      div.className = "problem";
      div.textContent = prob.q;
      grid.appendChild(div);
    });
    out.appendChild(grid);
  } else if (mode === "answersheet") {
    const grid = document.createElement("div");
    grid.className = "problem-grid";
    flashProblems.forEach(prob => {
      const div = document.createElement("div");
      div.className = "problem";
      div.textContent = prob.q + " ____";
      grid.appendChild(div);
    });
    out.appendChild(grid);
  }
}

function showFlashcard() {
  const prob = flashProblems[flashIndex];
  const out = document.getElementById("flashOutput");
  out.innerHTML = `
    <h3>${prob.q}</h3>
    <button onclick="document.getElementById('flashOutput').innerHTML+='<p><b>Answer:</b> ${prob.a}</p>'">Show Answer</button>
    <button onclick="nextFlashcard()">Next</button>
  `;
}

function nextFlashcard() {
  flashIndex++;
  if (flashIndex < flashProblems.length) {
    showFlashcard();
  } else {
    document.getElementById("flashOutput").innerHTML = "<p>All done!</p>";
  }
}
