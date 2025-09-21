// Generate worksheet with random multiplication problems
function generateWorksheet() {
  const container = document.getElementById("worksheet");
  container.innerHTML = ""; // clear previous

  let list = document.createElement("ol");

  for (let i = 0; i < 10; i++) {
    let a = Math.floor(Math.random() * 12) + 1;
    let b = Math.floor(Math.random() * 12) + 1;
    let item = document.createElement("li");
    item.textContent = `${a} × ${b} = ____`;
    list.appendChild(item);
  }

  container.appendChild(list);
}

// Flashcards
let currentA, currentB;

function newCard() {
  currentA = Math.floor(Math.random() * 12) + 1;
  currentB = Math.floor(Math.random() * 12) + 1;

  document.getElementById("question").textContent = `${currentA} × ${currentB} = ?`;
  document.getElementById("answer").style.display = "none";
  document.getElementById("answer").textContent = currentA * currentB;
}

function showAnswer() {
  document.getElementById("answer").style.display = "block";
}
