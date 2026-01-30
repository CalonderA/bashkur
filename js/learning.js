
function switchTab(tabName) {
    setCurrentTab(tabName);
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => btn.classList.remove('active'));

    if (tabName === 'words') {
        tabs[0].classList.add('active');
    } else if (tabName === 'alphabet') {
        tabs[1].classList.add('active');
    } else if (tabName === 'about') {
        tabs[2].classList.add('active');
    } else if (tabName === 'test') {
        tabs[3].classList.add('active');
    }

    renderLearningContent();
}

function markLearned(id) {
    if (!learnedItems.has(id)) {
        learnedItems.add(id);
        updateProgress();
        const el = document.getElementById(`card-${id}`);
        if (el) el.classList.add('learned');
    }
}

function updateProgress() {
    const total = dictionary.length + alphabet.length;
    const learned = learnedItems.size;
    const percent = Math.round((learned / total) * 100);

    const bar = document.getElementById('progress-bar');
    const countEl = document.getElementById('progress-count');
    const totalEl = document.getElementById('total-count');

    if (bar) bar.style.width = `${percent}%`;
    if (countEl) countEl.innerText = learned;
    if (totalEl) totalEl.innerText = total;
}

function renderLearningContent() {
    const container = document.getElementById('learning-content');
    if (!container) return;
    container.innerHTML = '';

    if (currentTab === 'words') {
        const grid = document.createElement('div');
        grid.className = 'dictionary-grid';
        
        dictionary.forEach(item => {
            const card = document.createElement('div');
            card.className = `word-card ${learnedItems.has(item.id) ? 'learned' : ''}`;
            card.id = `card-${item.id}`;
            card.onclick = () => {
                speakText(item.word);
                markLearned(item.id);
            };
            
            card.innerHTML = `
                <span class="bashkir-word">${item.word}</span>
                <span class="translation">${item.trans}</span>
                <div style="color:#666; font-size:0.9rem; margin-top:5px;">[${item.phonetic}]</div>
                <div class="play-icon">🔊</div>
            `;
            grid.appendChild(card);
        });
        container.appendChild(grid);

    } else if (currentTab === 'alphabet') {
        const grid = document.createElement('div');
        grid.className = 'alphabet-grid';

        alphabet.forEach(item => {
            const card = document.createElement('div');
            card.className = `letter-card ${learnedItems.has(item.id) ? 'learned' : ''}`;
            card.id = `card-${item.id}`;
            card.onclick = () => {
                speakText(item.tts);
                markLearned(item.id);
            };

            card.innerHTML = `
                <span class="letter-symbol">${item.letter}</span>
                <span class="letter-sound">${item.sound}</span>
            `;
            grid.appendChild(card);
        });
        container.appendChild(grid);

    } else if (currentTab === 'about') {
        const story = document.createElement('div');
        story.className = 'story-card';
        story.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 5rem;">🏔️</span>
            </div>
            <h3 class="story-title">Кто такие башкиры?</h3>
            <div class="story-content">
                <p>Башкиры (башҡорттар) — тюркский народ, коренное население Башкортостана. Их история неразрывно связана с Уральскими горами, бескрайними степями и быстрыми реками.</p>
                <p><strong>Дух свободы:</strong> Издавна башкиры были воинами и скотоводами. Лошадь для башкира — это не просто животное, а верный друг. Знаменитая "Дикая дивизия" и герои 1812 года прославили башкирских всадников на весь мир.</p>
                <p><strong>Гостеприимство:</strong> "Ҡунаҡ" (гость) — святое слово. Гостя всегда усаживают на лучшее место, угощают чаем с мёдом, чак-чаком и бешбармаком. Отказать гостю — значит нарушить закон предков.</p>
                <p><strong>Природа и мёд:</strong> Башкирский мёд известен во всем мире. Бортничество (добыча мёда диких пчел) — древнейшее ремесло, сохранившееся до наших дней только здесь, в заповеднике Шульган-Таш.</p>
                <p>Изучая башкирский язык, вы прикасаетесь к этой богатой культуре, где каждое слово наполнено мудростью веков и шумом уральских ветров.</p>
            </div>
        `;
        container.appendChild(story);

    } else if (currentTab === 'test') {
        if (!testState.isActive) {
            const wrapper = document.createElement('div');
            wrapper.className = 'game-center-wrapper';
            
            const learnedCount = learnedItems.size;
            const minWords = 3;

            if (learnedCount < minWords) {
                wrapper.innerHTML = `
                    <div class="locked-card">
                        <div class="locked-icon">🔒</div>
                        <h3 class="locked-title">Игровой центр закрыт</h3>
                        <p class="locked-text">
                            Сначала выучите слова! Нажмите на карточки в разделе "Слова" или "Алфавит", чтобы выучить их.
                            <br><br>
                            Выучено: <strong style="color:var(--bashkir-green)">${learnedCount}</strong> из ${minWords} необходимых.
                        </p>
                        <button class="action-btn" onclick="switchTab('words')">Перейти к словам</button>
                    </div>
                `;
            } else {
                wrapper.innerHTML = `
                    <div class="game-menu-header">
                        <h2>Игровой Центр</h2>
                        <p>Выбери режим тренировки</p>
                    </div>
                    <div class="game-modes-grid">
                        <div class="game-card" onclick="startGame('quiz')">
                            <div class="game-icon">📝</div>
                            <h3>Викторина</h3>
                            <p>Классический тест: выбери правильный перевод из 4 вариантов.</p>
                        </div>
                        <div class="game-card" onclick="startGame('audio')">
                            <div class="game-icon">🎧</div>
                            <h3>Аудио-тренер</h3>
                            <p>Послушай слово и найди его значение. Тренируй восприятие!</p>
                        </div>
                        <div class="game-card" onclick="startGame('memory')">
                            <div class="game-icon">🧩</div>
                            <h3>Найди пару</h3>
                            <p>Мини-игра: найди и соедини карточки со словами. Развивай память!</p>
                        </div>
                    </div>
                `;
            }
            container.appendChild(wrapper);
        } else {
            renderGameContent(container);
        }
    }

    updateProgress();
}
