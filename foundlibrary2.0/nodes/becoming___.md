<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Becoming form</title>
<style>
  :root{
    --accent:#0b76ef;
    --muted:#666;
    --bg:#f8fafc;
    --card:#fff;
    --radius:12px;
  }
  body{
    font-family: Inter, Roboto, system-ui, -apple-system, "Segoe UI", Arial;
    margin:24px;
    background:var(--bg);
    color:#111;
  }
  .container{
    max-width:900px;
    margin:0 auto;
  }
  .selector-card{
    background:var(--card);
    border-radius:var(--radius);
    padding:18px;
    box-shadow:0 6px 18px rgba(12,18,26,0.06);
    margin-bottom:18px;
  }

  h1.title{
    font-size:2rem;
    margin:0 0 12px 0;
    font-weight:700;
  }

  .image-options{
    display:flex;
    gap:12px;
    flex-wrap:wrap;
  }

  .img-choice{
    width:120px;
    height:90px;
    border-radius:10px;
    overflow:hidden;
    cursor:pointer;
    border:2px solid transparent;
    box-shadow:0 4px 10px rgba(12,18,26,0.06);
    display:flex;
    align-items:center;
    justify-content:center;
    background:#eee;
    position:relative;
  }
  .img-choice img{
    width:100%;
    height:100%;
    object-fit:cover;
    display:block;
  }
  .img-choice .label{
    position:absolute;
    bottom:6px;
    left:6px;
    right:6px;
    background:rgba(0,0,0,0.45);
    color:#fff;
    font-size:12px;
    padding:4px 6px;
    border-radius:6px;
    text-align:center;
  }

  .img-choice.selected{
    border-color:var(--accent);
    box-shadow:0 8px 22px rgba(11,118,239,0.18);
    transform:translateY(-4px);
  }

  form.card{
    background:var(--card);
    border-radius:var(--radius);
    padding:18px;
    box-shadow:0 6px 18px rgba(12,18,26,0.06);
  }

  .question{
    margin-bottom:16px;
  }
  .question label{
    display:block;
    font-weight:600;
    margin-bottom:8px;
  }

  textarea.response{
    width:100%;
    min-height:170px; /* enough for ~150-300 words depending on line length */
    resize:vertical;
    border-radius:10px;
    padding:12px;
    border:1px solid #ddd;
    font-size:15px;
    line-height:1.45;
    box-sizing:border-box;
    background:linear-gradient(180deg,#fff, #fbfdff);
  }

  .controls{
    display:flex;
    gap:12px;
    margin-top:18px;
  }

  button.btn{
    padding:10px 14px;
    border-radius:10px;
    border:0;
    cursor:pointer;
    font-weight:600;
  }
  button.save{
    background:var(--accent);
    color:#fff;
  }
  button.print{
    background:#fff;
    color:var(--accent);
    border:1px solid var(--accent);
  }

  /* small print note */
  .note{
    margin-top:10px;
    color:var(--muted);
    font-size:13px;
  }

  @media (max-width:520px){
    .image-options{ gap:8px; }
    .img-choice{ width:90px; height:70px; }
    h1.title{ font-size:1.5rem; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="selector-card">
      <h1 class="title">Becoming <span id="chosen-name">_____</span></h1>

      <div>
        <div style="font-weight:600;margin-bottom:8px;">Choose an object:</div>
        <div class="image-options" id="imageOptions">
          <!-- Update image src and data-name as needed -->
          <div class="img-choice" data-name="duck">
            <img src="images/duck.jpg" alt="duck">
            <div class="label">duck</div>
          </div>
          <div class="img-choice" data-name="tree">
            <img src="images/tree.jpg" alt="tree">
            <div class="label">tree</div>
          </div>
          <div class="img-choice" data-name="boat">
            <img src="images/boat.jpg" alt="boat">
            <div class="label">boat</div>
          </div>
          <div class="img-choice" data-name="book">
            <img src="images/book.jpg" alt="book">
            <div class="label">book</div>
          </div>
          <div class="img-choice" data-name="lamp">
            <img src="images/lamp.jpg" alt="lamp">
            <div class="label">lamp</div>
          </div>
          <div class="img-choice" data-name="mountain">
            <img src="images/mountain.jpg" alt="mountain">
            <div class="label">mountain</div>
          </div>
        </div>
      </div>
    </div>

    <form id="mainForm" class="card" onsubmit="return false;">
      <div id="questionsContainer"></div>

      <div class="controls">
        <button class="btn save" id="saveBtn" type="button">Save (Download CSV)</button>
        <button class="btn print" id="printBtn" type="button">Print</button>
      </div>
      <div class="note">Responses are stored locally as a CSV download. To send to a server, replace the CSV download code with a POST request.</div>
    </form>
  </div>

<script>
  // Configurable questions
  const QUESTIONS = [
    "Describe a memory connected with this object.",
    "What emotions does this object evoke for you?",
    "How has this object influenced your life or thinking?",
    "If this object could speak, what would it say to you?",
    "How do you see yourself changing because of this object?",
    "Write a short scene where this object plays a central role."
  ];

  const questionsContainer = document.getElementById('questionsContainer');

  // Render questions
  QUESTIONS.forEach((q, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'question';
    wrapper.innerHTML = `
      <label for="q${idx+1}">${idx+1}. ${escapeHtml(q)}</label>
      <textarea id="q${idx+1}" class="response" maxlength="4000" placeholder="Write your response here..."></textarea>
    `;
    questionsContainer.appendChild(wrapper);
  });

  // Image selection handling
  const imageOptions = document.getElementById('imageOptions');
  const chosenNameSpan = document.getElementById('chosen-name');
  let selectedName = '';

  imageOptions.addEventListener('click', (e) => {
    const choice = e.target.closest('.img-choice');
    if (!choice) return;
    // clear previous
    document.querySelectorAll('.img-choice').forEach(el => el.classList.remove('selected'));
    choice.classList.add('selected');
    selectedName = choice.getAttribute('data-name') || '';
    chosenNameSpan.textContent = selectedName || '_____';
    // also update document title
    document.title = `Becoming ${selectedName}`;
  });

  // Save (download CSV)
  document.getElementById('saveBtn').addEventListener('click', () => {
    const rows = [];
    // add header
    const header = ['chosen_object'];
    for (let i=0;i<QUESTIONS.length;i++) header.push(`q${i+1}`);
    rows.push(header);

    const dataRow = [selectedName];
    for (let i=0;i<QUESTIONS.length;i++){
      const val = document.getElementById(`q${i+1}`).value.trim();
      dataRow.push(val);
    }
    rows.push(dataRow);

    const csv = toCsv(rows);
    const filename = `becoming_${selectedName || 'unknown'}_${timestampForFilename()}.csv`;
    downloadBlob(csv, filename, 'text/csv;charset=utf-8;');
  });

  // Print
  document.getElementById('printBtn').addEventListener('click
