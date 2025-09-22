// ===================== Learn Tabs =====================
function openTopic(evt, topicName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) tablinks[i].className = tablinks[i].className.replace(" active", "");
    document.getElementById(topicName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openMiniTab(evt, miniName, topTab) {
    const miniTabContent = document.getElementById(topTab).getElementsByClassName("mini-tabcontent");
    for (let i = 0; i < miniTabContent.length; i++) miniTabContent[i].style.display = "none";
    const miniTabLinks = document.getElementById(topTab).getElementsByClassName("minitablinks");
    for (let i = 0; i < miniTabLinks.length; i++) miniTabLinks[i].className = miniTabLinks[i].className.replace(" active", "");
    document.getElementById(miniName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", function () {
    const defaultTab = document.getElementById("defaultTopTab");
    if(defaultTab) defaultTab.click();
});

// ===================== Calculator =====================
let calcSteps = [];
let calcIndex = 0;

function startCalc() {
    const input = document.getElementById("calcInput").value;
    try {
        const evalResult = math.evaluate(input);
        calcSteps = [`Original: ${input}`, `Solution: ${evalResult}`]; 
        calcIndex = 0;
        document.getElementById("calcStep").textContent = calcSteps[calcIndex];
    } catch (err) {
        alert("Invalid input!");
    }
}

function nextCalcStep() {
    calcIndex++;
    if(calcIndex < calcSteps.length){
        document.getElementById("calcStep").textContent = calcSteps[calcIndex];
    } else {
        document.getElementById("calcStep").textContent = "Solved!";
    }
}

// ===================== Utilities =====================
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function downloadContent(filename, content) {
    const blob = new Blob([content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// ===================== Worksheets =====================
function generateWorksheet() {
    const worksheetDiv = document.getElementById("worksheetArea");
    worksheetDiv.innerHTML = `<div class="print-header">
        <span># Numble Worksheet</span>
        <span>Date: _______ Name: _______</span>
    </div>`;
    
    const numQuestions = parseInt(document.getElementById("numQuestions")?.value) || 20;
    const operations = ["+", "-", "×", "÷"];
    const minNum = parseInt(document.getElementById("minNum")?.value) || 1;
    const maxNum = parseInt(document.getElementById("maxNum")?.value) || 12;

    for (let i = 1; i <= numQuestions; i++) {
        const op = operations[randInt(0, operations.length - 1)];
        let a = randInt(minNum, maxNum);
        let b = randInt(minNum, maxNum);
        if(op === "÷") { b = randInt(1, maxNum); a = b * randInt(1, maxNum); }
        let q = `${a} ${op} ${b}`;
        let p = document.createElement("p");
        p.textContent = `${i}. ${q} = ________`;
        worksheetDiv.appendChild(p);
    }
}

function downloadWorksheet() {
    const content = document.getElementById("worksheetArea").innerHTML;
    downloadContent("Numble_Worksheet.html", content);
}

function downloadBoth() {
    const content = document.getElementById("worksheetArea").innerHTML; 
    downloadContent("Numble_Worksheet_With_Answers.html", content);
}

// ===================== Flashcards =====================
function generateFlashcards() {
    const flashcardDiv = document.getElementById("flashcardArea");
    flashcardDiv.innerHTML = `<div class="print-header">
        <span>FLASHCARDS 1-10 ADDITION</span>
    </div>`;
    
    const numCards = parseInt(document.getElementById("numFlashcards")?.value) || 10;
    const minNum = parseInt(document.getElementById("minNum")?.value) || 1;
    const maxNum = parseInt(document.getElementById("maxNum")?.value) || 10;

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.border = "1";

    const headerRow = document.createElement("tr");
    const th1 = document.createElement("th"); th1.textContent="QUESTION"; headerRow.appendChild(th1);
    const th2 = document.createElement("th"); th2.textContent="ANSWER"; headerRow.appendChild(th2);
    table.appendChild(headerRow);

    for(let i=1;i<=numCards;i++){
        const a = randInt(minNum,maxNum);
        const b = randInt(minNum,maxNum);
        const q = `${a} + ${b}`;
        const tr = document.createElement("tr");
        const tdQ = document.createElement("td"); tdQ.textContent=q; tr.appendChild(tdQ);
        const tdA = document.createElement("td"); tdA.textContent=a+b; tr.appendChild(tdA);
        table.appendChild(tr);
    }

    flashcardDiv.appendChild(table);
}

function downloadFlashcards() {
    const content = document.getElementById("flashcardArea").innerHTML;
    downloadContent("Numble_Flashcards.html", content);
}
