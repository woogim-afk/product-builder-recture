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
  var pool = Array.from({ length: 45 }, function(_, i) { return i + 1; });
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
  }
  var main = pool.slice(0, 6).sort(function(a, b) { return a - b; });
  var bonus = pool[6];
  return { main: main, bonus: bonus };
}

/* ===== 메인 공 DOM 생성 ===== */
function makeBall(n, isBonus, delayMs) {
  var el = document.createElement('div');
  el.className = 'ball ' + (isBonus ? 'bonus-ball' : colorClass(n));
  el.textContent = n;
  el.style.animationDelay = delayMs + 'ms';
  return el;
}

/* ===== 작은 공 DOM 생성 (multi-draw용) ===== */
function makeSmBall(n, isBonus, delayMs) {
  var el = document.createElement('div');
  el.className = 'ball sm-ball ' + (isBonus ? 'bonus-ball' : colorClass(n));
  el.textContent = n;
  el.style.animationDelay = delayMs + 'ms';
  return el;
}

/* ===== 내역용 미니 공 DOM 생성 ===== */
function makeMini(n, isBonus) {
  var el = document.createElement('div');
  el.className = 'mini-ball ' + (isBonus ? 'bonus-ball' : colorClass(n));
  el.textContent = n;
  return el;
}

/* ===== 추첨 내역 항목 생성 ===== */
function makeHistoryItem(main, bonus, label) {
  var item = document.createElement('li');
  item.className = 'history-item';

  if (label) {
    var badge = document.createElement('span');
    badge.className = 'multi-badge';
    badge.textContent = label;
    item.appendChild(badge);
  }

  main.forEach(function(n) { item.appendChild(makeMini(n, false)); });

  var sep = document.createElement('span');
  sep.className = 'mini-sep';
  sep.textContent = '+';
  item.appendChild(sep);

  item.appendChild(makeMini(bonus, true));
  return item;
}

/* ===== 단일 추첨 공 영역 렌더링 ===== */
function renderBalls(main, bonus) {
  var wrap = document.getElementById('ballsWrap');
  wrap.innerHTML = '';

  var row = document.createElement('div');
  row.className = 'balls-row-single';

  main.forEach(function(n, i) {
    row.appendChild(makeBall(n, false, i * 120));
  });

  var sep = document.createElement('div');
  sep.className = 'separator';
  sep.textContent = '+';
  row.appendChild(sep);

  row.appendChild(makeBall(bonus, true, main.length * 120 + 80));
  wrap.appendChild(row);
}

/* ===== 5개 동시 추첨 영역 렌더링 ===== */
function renderMultiBalls(results) {
  var wrap = document.getElementById('ballsWrap');
  wrap.innerHTML = '';

  results.forEach(function(result, idx) {
    var row = document.createElement('div');
    row.className = 'balls-row';
    row.style.animationDelay = (idx * 80) + 'ms';

    var label = document.createElement('span');
    label.className = 'row-label';
    label.textContent = (idx + 1) + '번';
    row.appendChild(label);

    result.main.forEach(function(n, i) {
      row.appendChild(makeSmBall(n, false, idx * 60 + i * 50));
    });

    var sep = document.createElement('span');
    sep.className = 'sm-sep';
    sep.textContent = '+';
    row.appendChild(sep);

    row.appendChild(makeSmBall(result.bonus, true, idx * 60 + result.main.length * 50 + 30));
    wrap.appendChild(row);
  });
}

/* ===== 버튼 잠금 / 해제 ===== */
function setButtonLocked(locked) {
  document.getElementById('drawBtn').disabled = locked;
  document.getElementById('drawMultiBtn').disabled = locked;
}

/* ===== 추첨 카운트 ===== */
var drawCount = 0;

/* ===== 단일 추첨 ===== */
function draw() {
  setButtonLocked(true);

  var result = pickNumbers();
  renderBalls(result.main, result.bonus);

  drawCount++;
  document.getElementById('countBadge').textContent = drawCount + '회';

  var emptyMsg = document.getElementById('emptyMsg');
  if (emptyMsg) emptyMsg.remove();

  document.getElementById('historyList').prepend(makeHistoryItem(result.main, result.bonus, null));

  var unlockDelay = (result.main.length + 1) * 120 + 400;
  setTimeout(function() { setButtonLocked(false); }, unlockDelay);
}

/* ===== 5개 동시 추첨 ===== */
function drawMulti() {
  setButtonLocked(true);

  var results = [];
  for (var i = 0; i < 5; i++) {
    results.push(pickNumbers());
  }

  renderMultiBalls(results);

  var historyList = document.getElementById('historyList');
  var emptyMsg = document.getElementById('emptyMsg');
  if (emptyMsg) emptyMsg.remove();

  for (var k = results.length - 1; k >= 0; k--) {
    historyList.prepend(makeHistoryItem(results[k].main, results[k].bonus, (k + 1) + '번'));
  }

  drawCount += 5;
  document.getElementById('countBadge').textContent = drawCount + '회';

  setTimeout(function() { setButtonLocked(false); }, 700);
}

/* ===== 다크/라이트 모드 토글 ===== */
var isDark = true;

function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
}
