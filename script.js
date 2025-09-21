let lastGenerated={problems:[],questionsPerSheet:20};
let flashProblems=[];

// --- UTILITIES ---
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function getRandomProblem(selectedOps,start,end){
  const op=selectedOps[Math.floor(Math.random()*selectedOps.length)];
  const a=randInt(start,end);
  const b=randInt(start,end);
  let q="",ans=0;
  switch(op){
    case"add":q=`${a} + ${b} =`;ans=a+b;break;
    case"sub":q=`${a+b} - ${a} =`;ans=b;break;
    case"mul":q=`${a} × ${b} =`;ans=a*b;break;
    case"div":q=`${a*b} ÷ ${a} =`;ans=b;break;
    case"exp":q=`${a} ^ 2 =`;ans=a**2;break;
  }
  return {q:q,a:ans};
}

// --- WORKSHEETS ---
function generateWorksheets(){
  const ops=[...document.querySelectorAll('#worksheetForm input[type=checkbox]:checked')].map(c=>c.value);
  const start=parseInt(document.getElementById("startNum").value);
  const end=parseInt(document.getElementById("endNum").value);
  const questionsPerSheet=parseInt(document.getElementById("questionsPerPage").value);
  const questionSheets=parseInt(document.getElementById("questionSheets").value);

  const output=document.getElementById("worksheetOutput");
  output.innerHTML="";
  lastGenerated.problems=[];
  lastGenerated.questionsPerSheet=questionsPerSheet;

  for(let s=0;s<questionSheets;s++){
    const sheetDiv=document.createElement("div");
    sheetDiv.className="worksheet";
    sheetDiv.innerHTML=`<h2>Numble Worksheet - Sheet ${s+1}</h2>`;
    const grid=document.createElement("div"); grid.className="problem-grid";

    for(let i=0;i<questionsPerSheet;i++){
      const prob=getRandomProblem(ops,start,end);
      lastGenerated.problems.push(prob);
      const div=document.createElement("div"); div.className="problem";
      div.textContent=prob.q;
      grid.appendChild(div);
    }

    sheetDiv.appendChild(grid);
    output.appendChild(sheetDiv);
  }
}

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
      const div=document.createElement("div"); div.className="problem";
      div.textContent=prob.q;
      grid.appendChild(div);
    });
    pageDiv.appendChild(grid);
    content.push(pageDiv.outerHTML);
  }
  printContent(content.join(""));
}

function printAnswers(){
  const sheets=parseInt(document.getElementById("answerSheets")?.value||1);
  const qps=lastGenerated.questionsPerSheet;
  const content=[];
  for(let s=0;s<sheets;s++){
    const pageDiv=document.createElement("div");
    pageDiv.className="worksheet";
    pageDiv.innerHTML=`<h2>Numble Answer Sheet - Sheet ${s+1}</h2>`;
    const grid=document.createElement("div"); grid.className="problem-grid";
    lastGenerated.problems.slice(s*qps,(s+1)*qps).forEach(prob=>{
      const div=document.createElement("div"); div.className="problem";
      div.textContent=prob.q+" "+prob.a;
      grid.appendChild(div);
    });
    pageDiv.appendChild(grid);
    content.push(pageDiv.outerHTML);
  }
  printContent(content.join(""));
}

function printBoth(){
  printQuestions();
  setTimeout(()=>printAnswers(),500);
}

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

  flashProblems=[];
  for(let i=0;i<20;i++) flashProblems.push(getRandomProblem(ops,start,end));

  const out=document.getElementById("flashOutput");
  out.innerHTML="";

  const grid=document.createElement("div"); grid.className="problem-grid";
  flashProblems.forEach(prob=>{
    const div=document.createElement("div"); div.className="problem";
    if(mode==="answersheet") div.textContent=prob.q + (includeAnswers ? " " + prob.a : " ____");
    else div.textContent=prob.q;
    grid.appendChild(div);
  });
  out.appendChild(grid);

  const btnQ=document.createElement("button"); btnQ.textContent="Print Flashcards"; btnQ.onclick=()=>printFlashcards(false); out.appendChild(btnQ);
  const btnA=document.createElement("button"); btnA.textContent="Print Answer Key"; btnA.onclick=()=>printFlashcards(true); out.appendChild(btnA);
}

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
