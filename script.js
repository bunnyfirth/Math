let lastGenerated = { problems: [], questionsPerSheet: 20 };
let flashProblems = [];
let flashIndex = 0;

// --- UTILITIES ---
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function getOperations(selectedOps,start,end){
  const a=randInt(start,end),b=randInt(start,end),probs=[];
  selectedOps.forEach(op=>{
    switch(op){
      case"add":probs.push({q:`${a} + ${b} =`,a:a+b});break;
      case"sub":probs.push({q:`${a+b} - ${a} =`,a:b});break;
      case"mul":probs.push({q:`${a} × ${b} =`,a:a*b});break;
      case"div":probs.push({q:`${a*b} ÷ ${a} =`,a:b});break;
      case"exp":probs.push({q:`${a} ^ 2 =`,a:a**2});break;
    }
  });
  return probs;
}

// --- WORKSHEETS ---
function generateWorksheets(){
  const ops=[...document.querySelectorAll('#worksheetForm input[type=checkbox]:checked')].map(c=>c.value);
  const start=parseInt(document.getElementById("startNum").value);
  const end=parseInt(document.getElementById("endNum").value);
  const questionsPerSheet=parseInt(document.getElementById("questionsPerPage").value);
  const questionSheets=parseInt(document.getElementById("questionSheets").value);
  const answerSheets=parseInt(document.getElementById("answerSheets").value);

  const output=document.getElementById("worksheetOutput");
  output.innerHTML="";
  lastGenerated.problems=[];
  lastGenerated.questionsPerSheet=questionsPerSheet;

  for(let s=0;s<questionSheets;s++){
    const sheetDiv=document.createElement("div");
    sheetDiv.className="worksheet";
    sheetDiv.innerHTML=`<h2>Numble Worksheet - Sheet ${s+1}</h2>`;
    const grid=document.createElement("div");
    grid.className="problem-grid";
    for(let i=0;i<questionsPerSheet;i++){
      const prob=getOperations(ops,start,end)[0];
      lastGenerated.problems.push(prob);
      const div=document.createElement("div");
      div.className="problem";
      div.textContent=prob.q;
      grid.appendChild(div);
    }
    sheetDiv.appendChild(grid);
    output.appendChild(sheetDiv);
  }
}

// Print only questions
function printQuestions(){
  const sheets=parseInt(document.getElementById("questionSheets").value);
  const qps=lastGenerated.questionsPerSheet;
  const content=[];
  for(let s=0;s<sheets;s++){
    const pageDiv=document.createElement("div");
    pageDiv.className="worksheet";
    pageDiv.innerHTML=`<h2>Numble Worksheet - Sheet ${s+1}</h2>`;
    const grid=document.createElement("div"); grid.className="problem-grid";
    lastGenerated.problems.slice(s*qps,(s+1)*qps).forEach(prob=>{
      const div=document.createElement("div");
      div.className="problem";
      div.textContent=prob.q;
      grid.appendChild(div);
    });
    pageDiv.appendChild(grid);
    content.push(pageDiv.outerHTML);
  }
  printContent(content.join(""));
}

// Print only answers
function printAnswers(){
  const sheets=parseInt(document.getElementById("answerSheets").value);
  const qps=lastGenerated.questionsPerSheet;
  const content=[];
  for(let s=0;s<sheets;s++){
    const pageDiv=document.createElement("div");
    pageDiv.className="worksheet";
    pageDiv.innerHTML=`<h2>Numble Answer Sheet - Sheet ${s+1}</h2>`;
    const grid=document.createElement("div"); grid.className="problem-grid";
    lastGenerated.problems.slice(s*qps,(s+1)*qps).forEach(prob=>{
      const div=document.createElement("div");
      div.className="problem";
      div.textContent=prob.q+" "+prob.a;
      grid.appendChild(div);
    });
    pageDiv.appendChild(grid);
    content.push(pageDiv.outerHTML);
  }
  printContent(content.join(""));
}

// Helper for printing content only
function printContent(html){
  const w=window.open("","_blank");
  w.document.write("<html><head><title>Print</title><link rel='stylesheet' href='style.css'></head><body>");
  w.document.write(html);
  w.document.write("</body></html>");
  w.document.close(); w.focus(); w.print();
}

// --- FLASHCARDS ---
function startFlashcards(){
  const ops=[...document.querySelectorAll('#flashForm input[type=checkbox]:checked')].map(c=>c.value);
  const start=parseInt(document.getElementById("flashStart").value);
  const end=parseInt(document.getElementById("flashEnd").value);
  const mode=document.getElementById("flashMode").value;
  const includeAnswers=document.getElementById("includeAnswers").checked;

  flashProblems=[]; flashIndex=0;
  for(let i=0;i<20;i++) flashProblems.push(getOperations(ops,start,end)[0]);
  lastGenerated.problems=flashProblems; lastGenerated.mode=mode;

  const out=document.getElementById("flashOutput");
  out.innerHTML="";

  if(mode==="digital") showFlashcard();
  else{
    const grid=document.createElement("div"); grid.className="problem-grid";
    flashProblems.forEach(prob=>{
      const div=document.createElement("div");
      div.className="problem";
      if(mode==="answersheet") div.textContent=prob.q + (includeAnswers ? " " + prob.a : " ____");
      else div.textContent=prob.q;
      grid.appendChild(div);
    });
    out.appendChild(grid);

    // Print buttons
    const btnQ=document.createElement("button"); btnQ.textContent="Print Flashcards"; btnQ.onclick=()=>printFlashcards(false); out.appendChild(btnQ);
    const btnA=document.createElement("button"); btnA.textContent="Print Answer Key"; btnA.onclick=()=>printFlashcards(true); out.appendChild(btnA);
  }
}

function showFlashcard(){
  const prob=flashProblems[flashIndex];
  const out=document.getElementById("flashOutput");
  out.innerHTML=`<h3>${prob.q}</h3>
  <button onclick="out.innerHTML+='<p><b>Answer:</b> ${prob.a}</p>'">Show Answer</button>
  <button onclick="nextFlashcard()">Next</button>`;
}

function nextFlashcard(){ flashIndex++; if(flashIndex<flashProblems.length) showFlashcard(); else document.getElementById("flashOutput").innerHTML="<p>All done!</p>"; }

function printFlashcards(showAnswers){
  const content=[];
  const grid=document.createElement("div"); grid.className="problem-grid";
  flashProblems.forEach(prob=>{
    const div=document.createElement("div"); div.className="problem";
    div.textContent=prob.q + (showAnswers ? " "+prob.a : " ____");
    grid.appendChild(div);
  });
  const pageDiv=document.createElement("div"); pageDiv.className="worksheet";
  pageDiv.innerHTML=`<h2>Numble Flashcards</h2>`; pageDiv.appendChild(grid);
  content.push(pageDiv.outerHTML);
  printContent(content.join(""));
}
