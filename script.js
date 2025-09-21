let lastGenerated = { problems: [], questionsPerSheet: 20 };

// --- UTILITIES ---
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function getRandomProblem(selectedOps,start,end){
  const op = selectedOps[Math.floor(Math.random()*selectedOps.length)];
  const a = randInt(start,end);
  const b = randInt(start,end);
  let q="", ans=0;
  switch(op){
    case"add": q=`${a} + ${b} =`; ans=a+b; break;
    case"sub": q=`${a+b} - ${a} =`; ans=b; break;
    case"mul": q=`${a} × ${b} =`; ans=a*b; break;
    case"div": q=`${a*b} ÷ ${a} =`; ans=b; break;
    case"exp": q=`${a} ^ 2 =`; ans=a**2; break;
  }
  return {q, a};
}

// --- WORKSHEETS ---
function generateWorksheets(){
  const ops = [...document.querySelectorAll('#worksheetForm input[type=checkbox]:checked')].map(c=>c.value);
  const start = parseInt(document.getElementById("startNum").value);
  const end = parseInt(document.getElementById("endNum").value);
  const questionsPerSheet = parseInt(document.getElementById("questionsPerPage").value);
  const questionSheets = parseInt(document.getElementById("questionSheets").value);

  const output = document.getElementById("worksheetOutput");
  output.innerHTML = "";
  lastGenerated.problems = [];
  lastGenerated.questionsPerSheet = questionsPerSheet;

  const opNames = ops.map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(", ");

  for(let s=0; s<questionSheets; s++){
    const sheetDiv = document.createElement("div");
    sheetDiv.className="worksheet";
    sheetDiv.innerHTML = `<h2># Numble Worksheet ${start}-${end} ${opNames}</h2>`;
    const grid = document.createElement("div");
    grid.className="problem-grid";

    for(let i=0;i<questionsPerSheet;i++){
      const prob = getRandomProblem(ops,start,end);
      lastGenerated.problems.push(prob);
      const div = document.createElement("div"); div.className="problem"; div.textContent=prob.q;
      grid.appendChild(div);
    }
    sheetDiv.appendChild(grid);
    output.appendChild(sheetDiv);
  }
}

function printQuestions(){ printContent("#worksheetOutput"); }
function printAnswers(){ printContent("#worksheetOutput",true); }
function printBoth(){ printQuestions(); setTimeout(printAnswers,500); }

function printContent(selector,showAnswers=false){
  const el = document.querySelector(selector);
  const clone = el.cloneNode(true);
  if(showAnswers){
    clone.querySelectorAll(".problem").forEach((p,i)=>{
      p.textContent += " " + lastGenerated.problems[i].a;
    });
  }
  const w = window.open("","_blank");
  w.document.write("<html><head><title>Print</title><link rel='stylesheet' href='style.css'></head><body>");
  w.document.write(clone.outerHTML);
  w.document.write("</body></html>");
  w.document.close(); w.focus(); w.print();
}

// --- FLASHCARDS ---
let onlineCards = [];
let currentIndex = 0;

function generateFlashcards(){
  const ops = [...document.querySelectorAll('#flashForm input[type=checkbox]:checked')].map(c=>c.value);
  const start = parseInt(document.getElementById("flashStart").value);
  const end = parseInt(document.getElementById("flashEnd").value);
  const output = document.getElementById("flashOutput");
  output.innerHTML="";

  // Generate all combinations in range
  let cards = [];
  for(let op of ops){
    for(let i=start;i<=end;i++){
      for(let j=start;j<=end;j++){
        let prob;
        switch(op){
          case"add": prob={q:`${i} + ${j} =`,a:i+j}; break;
          case"sub": prob={q:`${i+j} - ${i} =`,a:j}; break;
          case"mul": prob={q:`${i} × ${j} =`,a:i*j}; break;
          case"div": prob={q:`${i*j} ÷ ${i} =`,a:j}; break;
          case"exp": prob={q:`${i} ^ 2 =`,a:i**2}; break;
        }
        cards.push(prob);
      }
    }
  }

  // Build printable table
  const header = document.createElement("div");
  header.innerHTML = `<h2># Numble</h2><h3>FLASHCARDS: ${start}-${end} ${ops.map(o=>o.toUpperCase()).join(", ")}</h3>`;
  output.appendChild(header);

  const table = document.createElement("table");
  table.className="flash-table";
  const trHead = document.createElement("tr");
  trHead.innerHTML="<th>QUESTION</th><th>ANSWER</th>";
  table.appendChild(trHead);

  cards.forEach(card=>{
    const tr = document.createElement("tr");
    tr.innerHTML=`<td>${card.q}</td><td>${card.a}</td>`;
    table.appendChild(tr);
  });

  output.appendChild(table);
  const btn = document.createElement("button");
  btn.textContent="Print Flashcards"; btn.onclick=()=>printContent("#flashOutput");
  output.appendChild(btn);
}

function generateOnlineFlashcards(){
  const ops = [...document.querySelectorAll('#flashForm input[type=checkbox]:checked')].map(c=>c.value);
  const start = parseInt(document.getElementById("flashStart").value);
  const end = parseInt(document.getElementById("flashEnd").value);
  const output = document.getElementById("flashOutput");
  output.innerHTML="";
  onlineCards = [];
  currentIndex = 0;

  for(let i=0;i<20;i++) onlineCards.push(getRandomProblem(ops,start,end));

  const header = document.createElement("div");
  header.innerHTML = `<h2># Numble</h2>`;
  output.appendChild(header);

  const cardDiv = document.createElement("div");
  cardDiv.id="onlineCard"; cardDiv.style.fontSize="1.5rem"; cardDiv.style.margin="20px";
  output.appendChild(cardDiv);

  const btnPrev = document.createElement("button"); btnPrev.textContent="Previous"; btnPrev.onclick=prevCard;
  const btnNext = document.createElement("button"); btnNext.textContent="Next"; btnNext.onclick=nextCard;
  output.appendChild(btnPrev); output.appendChild(btnNext);

  showOnlineCard();
}

function showOnlineCard(){
  document.getElementById("onlineCard").textContent = onlineCards[currentIndex].q;
}

function nextCard(){ if(currentIndex<onlineCards.length-1){currentIndex++; showOnlineCard();}}
function prevCard(){ if(currentIndex>0){currentIndex--; showOnlineCard();}}
