let lastGenerated = { problems: [], mode: "" };
let flashProblems = [];
let flashIndex = 0;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOperations(selectedOps, start, end) {
  const a = randInt(start, end);
  const b = randInt(start, end);
  const problems = [];

  selectedOps.forEach(op => {
    switch (op) {
      case "add": problems.push({q: `${a} + ${b} =`, a: a+b}); break;
      case "sub": problems.push({q: `${a+b} - ${a} =`, a: b}); break;
      case "mul": problems.push({q: `${a} × ${b} =`, a: a*b}); break;
      case "div": problems.push({q: `${a*b} ÷ ${a} =`, a: b}); break;
      case "exp": problems.push({q: `${a} ^ 2 =`, a: a**2}); break;
    }
  });
  return problems;
}

// --- WORKSHEETS ---
function generateWorksheets() {
  const ops = [...document.querySelectorAll('#worksheetForm input[type=checkbox]:checked')].map(c => c.value);
  const start = parseInt(document.getElementById("startNum").value);
  const end = parseInt(document.getElementById("endNum").value);
  const questionsPerSheet = parseInt(document.getElementById("questionsPerPage").value);
  const questionSheets = parseInt(document.getElementById("questionSheets").value);
  const answerSheets = parseInt(document.getElementById("answerSheets").value);

  const output = document.getElementById("worksheetOutput");
  output.innerHTML = "";
  lastGenerated.problems = [];

  for (let s = 0; s < Math.max(questionSheets, answerSheets); s++) {
    const sheetDiv = document.createElement("div");
    sheetDiv.className = "worksheet";

    if (s < questionSheets) sheetDiv.innerHTML = `<h2>Numble Worksheet - Sheet ${s+1}</h2>`;
    else sheetDiv.innerHTML = `<h2>Numble Answer Key - Sheet ${s+1}</h2>`;

    const grid = document.createElement("div");
    grid.className = "problem-grid";

    for (let i = 0; i < questionsPerSheet; i++) {
      const prob = getOperations(ops, start, end)[0];
      if (s < questionSheets) {
        const div = document.createElement("div");
        div.className = "problem";
        div.textContent = prob.q;
        grid.appendChild(div);
      }
      lastGenerated.problems.push(prob); // store all problems for answer key
    }

    sheetDiv.appendChild(grid);
    output.appendChild(sheetDiv);
  }

  lastGenerated.mode = "worksheet";
}

// --- PRINT FUNCTIONS ---
function printQuestions() {
  const sheets = parseInt(document.getElementById("questionSheets").value);
  const questionsPerSheet = parseInt(document.getElementById("questionsPerPage").value);
  const content = [];

  for (let s = 0; s < sheets; s++) {
    const pageDiv = document.createElement("div");
    pageDiv.className = "worksheet";
    pageDiv.innerHTML = `<h2>Numble Worksheet - Sheet ${s+1}</h2>`;
    const grid = document.createElement("div");
    grid.className = "problem-grid";

    lastGenerated.problems.slice(s*questionsPerSheet, (s+1)*questionsPerSheet).forEach(prob => {
      const div = document.createElement("div");
      div.className = "problem";
      div.textContent = prob.q;
      grid.appendChild(div);
    });

    pageDiv.appendChild(grid);
    content.push(pageDiv.outerHTML);
  }

  printContent(content.join(""));
}

function printAnswers() {
  const sheets = parseInt(document.getElementById("answerSheets").value);
  const questionsPerSheet = parseInt(document.getElementById("questionsPerPage").value);
  const content = [];

  for (let s = 0; s < sheets; s++) {
    const pageDiv = document.createElement("div");
    pageDiv.className = "worksheet";
    pageDiv.innerHTML = `<h2>Numble Answer Key - Sheet ${s+1}</h2>`;
    const grid = document.createElement("div");
    grid.className = "problem-grid";

    lastGenerated.problems.slice(s*questionsPerSheet, (s+1)*questionsPerSheet).forEach(prob => {
      const div = document.createElement("div");
      div.className = "problem";
      div.textContent = prob.q + " " + prob.a;
      grid.appendChild(div);
    });

    pageDiv.appendChild(grid);
    content.push(pageDiv.outerHTML);
  }

  printContent(content.join(""));
}

function printContent(content) {
  const w = window.open("", "_blank");
  w.document.write("<html><head><title>Print</title><link rel='stylesheet' href='style.css'></head><body>");
  w.document.write(content);
  w.document.write("</body></html>");
  w.document.close();
  w.print();
}

// --- FLASHCARDS ---
function startFlashcards() {
  const ops = [...document.querySelectorAll('#flashForm input[type=checkbox]:checked')].map(c => c.value);
  const start = parseInt(document.getElementById("flashStart").value);
  const end = parseInt(document.getElementById("flashEnd").value);
  const mode = document.getElementById("flashMode").value;

  flashProblems = [];
  for (let i = 0; i < 20; i++) flashProblems.push(getOperations(ops, start, end)[0]);
  flashIndex = 0;
  lastGenerated.problems = flashProblems;
  lastGenerated.mode = mode;

  const out = document.getElementById("flashOutput");
  out.innerHTML = "";

  if (mode === "digital") showFlashcard();
  else {
    const grid = document.createElement("div");
    grid.className = "problem-grid";
    flashProblems.forEach(prob => {
      const div = document.createElement("div");
      div.className = "problem";
      div.textContent = mode === "answersheet" ? prob.q + " ____" : prob.q;
      grid.appendChild(div);
    });
    out.appendChild(grid);

    // Print buttons
    const btnQ = document.createElement("button");
    btnQ.textContent = "Print Flashcards";
    btnQ.onclick = () => printQuestions();
    out.appendChild(btnQ);

    const btnA = document.createElement("button");
    btnA.textContent = "Print Answer Key";
    btnA.onclick = () => printAnswers();
    out.appendChild(btnA);
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
  if (flashIndex < flashProblems.length) showFlashcard();
  else document.getElementById("flashOutput").innerHTML = "<p>All done!</p>";
}
