/* ===== 번호 구간별 색상 클래스 ===== */
function colorClass(n) {
  if (n <= 10) return 'b1';
  if (n <= 20) return 'b2';
  if (n <= 30) return 'b3';
  if (n <= 40) return 'b4';
  return 'b5';
}

/* ===== 피셔-예이츠 셔플로 1~45 랜덤 추출 ===== */
function pickNumbers() {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const main = pool.slice(0, 6).sort((a, b) => a - b);
  const bonus = pool[6];
  return { main, bonus };
}

/* ===== 메인 공 DOM 생성 ===== */
function makeBall(n, isBonus, delayMs) {
  const el = document.createElement('div');
  el.className = 'ball ' + (isBonus ? 'bonus-ball' : colorClass(n));
  el.textContent = n;
  el.style.animationDelay = delayMs + 'ms';
  return el;
}

/* ===== 내역용 미니 공 DOM 생성 ===== */
function makeMini(n, isBonus) {
  const el = document.createElement('div');
  el.className = 'mini-ball ' + (isBonus ? 'bonus-ball' : colorClass(n));
  el.textContent = n;
  return el;
}

/* ===== 추첨 내역 항목 생성 ===== */
function makeHistoryItem(main, bonus) {
  const item = document.createElement('li');
  item.className = 'history-item';

  main.forEach(function(n) { item.appendChild(makeMini(n, false)); });

  const sep = document.createElement('span');
  sep.className = 'mini-sep';
  sep.textContent = '+';
  item.appendChild(sep);

  item.appendChild(makeMini(bonus, true));
  return item;
}

/* ===== 공 영역 렌더링 ===== */
function renderBalls(main, bonus) {
  const wrap = document.getElementById('ballsWrap');
  wrap.innerHTML = '';

  main.forEach(function(n, i) {
    wrap.appendChild(makeBall(n, false, i * 120));
  });

  const sep = document.createElement('div');
  sep.className = 'separator';
  sep.textContent = '+';
  wrap.appendChild(sep);

  wrap.appendChild(makeBall(bonus, true, main.length * 120 + 80));
}

/* ===== 추첨 버튼 잠금 / 해제 ===== */
function setButtonLocked(locked) {
  document.getElementById('drawBtn').disabled = locked;
}

/* ===== 추첨 카운트 ===== */
var drawCount = 0;

/* ===== 메인 추첨 함수 (버튼 onclick) ===== */
function draw() {
  setButtonLocked(true);

  var result = pickNumbers();
  renderBalls(result.main, result.bonus);

  drawCount++;
  document.getElementById('countBadge').textContent = drawCount + '회';

  var emptyMsg = document.getElementById('emptyMsg');
  if (emptyMsg) emptyMsg.remove();

  document.getElementById('historyList').prepend(makeHistoryItem(result.main, result.bonus));

  var unlockDelay = (result.main.length + 1) * 120 + 400;
  setTimeout(function() { setButtonLocked(false); }, unlockDelay);
}
