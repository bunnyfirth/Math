// Helper: generate random number
function randNum(max = 12) {
  return Math.floor(Math.random() * max) + 1;
}

// --- WORKSHEETS ---
function generateWorksheet() {
  const container = document.getElementById("worksheet");
  container.innerHTML = ""; // clear old
  let list = document.createElement("ol");

  const operation = document.getElementById("operation").value;

  for (let i = 0; i < 10; i++) {
    let a = randNum();
    let b = randNum();
    let problem;

    switch (operation) {
      case "add": problem = `${a} + ${b} = ____`; break;
      case "sub": problem = `${a + b} - ${a} = ____`; break; // ensures non-negative
      case "mul": problem = `${a} × ${b} = ____`; break;
      case "div": problem = `${a * b} ÷ ${a} = ____`; break; // ensures clean division
      case "exp": problem = `${a} ^ 2 = ____`; break; // exponent is squared for simplicity
    }

    let item = document.createElement("li");
    item.textContent = problem;
    list.appendChild(item);
  }

  container.appendChild(list);
}

// --- FLASHCARDS ---
let currentA, currentB, currentOp;

function newCard() {
  currentOp = document.getElementById("flashOperation").value;
  currentA = randNum();
  currentB = randNum();

  let question, answer;

  switch (currentOp) {
    case "add":
      question = `${currentA} + ${currentB} = ?`;
      answer = currentA + currentB;
      break;
    case "sub":
      question = `${currentA + currentB} - ${currentA} = ?`;
      answer = currentB;
      break;
    case "mul":
      question = `${currentA} × ${currentB} = ?`;
      answer = currentA * currentB;
      break;
    case "div":
      question = `${currentA * currentB} ÷ ${currentA} = ?`;
      answer = currentB;
      break;
    case "exp":
      question = `${currentA} ^ 2 = ?`;
      answer = currentA ** 2;
      break;
  }

  document.getElementById("question").textContent = question;
  document.getElementById("answer").style.display = "none";
  document.getElementById("answer").textContent = answer;
}

function showAnswer() {
  document.getElementById("answer").style.display = "block";
}
