function startGame(mode) {
    testState.mode = mode;
    testState.score = 0;
    testState.isActive = true;

    if (mode === 'quiz' || mode === 'audio') {
        startQuizMode();
    } else if (mode === 'memory') {
        startMemoryMode();
    }
    
    renderLearningContent();
}

function startQuizMode() {
    const learnedWords = dictionary.filter(w => learnedItems.has(w.id));
    const source = learnedWords.length >= 3 ? learnedWords : dictionary;
    
    const shuffled = [...source].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    
    testState.questions = selected.map(word => {
        const otherWords = dictionary.filter(w => w.id !== word.id);
        const wrong = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [word, ...wrong].sort(() => 0.5 - Math.random());
        return {
            correct: word,
            options: options
        };
    });
    
    testState.currentIndex = 0;
}

function startMemoryMode() {
    const source = dictionary;
    // Select 6 words for 12 cards
    const shuffled = [...source].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    let cards = [];
    shuffled.forEach(item => {
        cards.push({ id: item.id, content: item.word, type: 'word', pairId: item.id, uniqueId: Math.random() });
        cards.push({ id: item.id, content: item.trans, type: 'trans', pairId: item.id, uniqueId: Math.random() });
    });
    
    testState.memoryCards = cards.sort(() => 0.5 - Math.random());
    testState.flippedCards = [];
    testState.matchedPairs = 0;
}

function renderGameContent(container) {
    if (testState.mode === 'quiz') {
        renderQuiz(container);
    } else if (testState.mode === 'audio') {
        renderAudioQuiz(container);
    } else if (testState.mode === 'memory') {
        renderMemoryGame(container);
    }
}

function renderQuiz(container) {
    const q = testState.questions[testState.currentIndex];
    
    const card = document.createElement('div');
    card.className = 'test-card';
    
    card.innerHTML = `
        <div class="test-header">
            <span class="test-progress-text">Вопрос ${testState.currentIndex + 1} / ${testState.questions.length}</span>
            <span class="test-score-badge">Счет: ${testState.score}</span>
        </div>
        
        <div class="test-question-box">
            <div class="test-label">Как переводится:</div>
            <div class="test-word">${q.correct.word}</div>
        </div>

        <div class="test-options-grid">
            ${q.options.map((opt, idx) => `
                <button class="test-option-btn" id="opt-${idx}" onclick="checkTestAnswer('${opt.id}', 'opt-${idx}')">
                    ${opt.trans}
                </button>
            `).join('')}
        </div>
    `;
    container.appendChild(card);
}

function renderAudioQuiz(container) {
    const q = testState.questions[testState.currentIndex];
    
    const card = document.createElement('div');
    card.className = 'test-card';
    
    // Auto play audio (small delay for render)
    setTimeout(() => speakText(q.correct.tts || q.correct.word), 100);

    card.innerHTML = `
        <div class="test-header">
            <span class="test-progress-text">Вопрос ${testState.currentIndex + 1} / ${testState.questions.length}</span>
            <span class="test-score-badge">Счет: ${testState.score}</span>
        </div>
        
        <div class="test-question-box">
            <div class="test-label">Нажми, чтобы послушать:</div>
            <button class="audio-play-btn" onclick="speakText('${q.correct.tts || q.correct.word}')">
                🔊
            </button>
        </div>

        <div class="test-options-grid">
            ${q.options.map((opt, idx) => `
                <button class="test-option-btn" id="opt-${idx}" onclick="checkTestAnswer('${opt.id}', 'opt-${idx}')">
                    ${opt.trans}
                </button>
            `).join('')}
        </div>
    `;
    container.appendChild(card);
}

function renderMemoryGame(container) {
    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    
    testState.memoryCards.forEach((card, index) => {
        const isFlipped = testState.flippedCards.some(c => c.uniqueId === card.uniqueId) || 
                          (card.matched); // We need to store matched state on card object or in a set
        
        // Let's use a simpler approach: modify the card object in memoryCards directly when matched
        const isMatched = card.matched;

        const cardEl = document.createElement('div');
        cardEl.className = `memory-card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`;
        cardEl.onclick = () => handleMemoryClick(index);
        
        cardEl.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front">?</div>
                <div class="memory-card-back">${card.content}</div>
            </div>
        `;
        grid.appendChild(cardEl);
    });
    
    const header = document.createElement('div');
    header.className = 'test-header';
    header.style.marginBottom = '20px';
    header.innerHTML = `<span class="test-score-badge">Найдено пар: ${testState.matchedPairs} / 6</span>`;
    
    container.appendChild(header);
    container.appendChild(grid);
}

function handleMemoryClick(index) {
    const card = testState.memoryCards[index];
    
    // Ignore if already matched or flipped or if 2 cards already flipped
    if (card.matched || testState.flippedCards.some(c => c.uniqueId === card.uniqueId) || testState.flippedCards.length >= 2) {
        return;
    }
    
    testState.flippedCards.push(card);
    renderLearningContent(); // Re-render to show flip
    
    if (testState.flippedCards.length === 2) {
        const [c1, c2] = testState.flippedCards;
        
        if (c1.pairId === c2.pairId) {
            // Match!
            c1.matched = true;
            c2.matched = true;
            testState.matchedPairs++;
            testState.flippedCards = [];
            speakText("Молодец"); // Simple feedback
            
            if (testState.matchedPairs === 6) {
                setTimeout(finishTest, 1000);
            } else {
                renderLearningContent();
            }
        } else {
            // No match
            setTimeout(() => {
                testState.flippedCards = [];
                renderLearningContent();
            }, 1000);
        }
    }
}

function checkTestAnswer(selectedId, btnId) {
    const allBtns = document.querySelectorAll('.test-option-btn');
    if ([...allBtns].some(b => b.disabled)) return;
    
    allBtns.forEach(b => b.disabled = true);

    const q = testState.questions[testState.currentIndex];
    const isCorrect = selectedId === q.correct.id;
    const selectedBtn = document.getElementById(btnId);

    if (isCorrect) {
        testState.score++;
        selectedBtn.classList.add('correct');
        speakText("Правильно");
    } else {
        selectedBtn.classList.add('wrong');
        speakText("Неправильно");
        q.options.forEach((opt, idx) => {
            if (opt.id === q.correct.id) {
                document.getElementById(`opt-${idx}`).classList.add('correct');
            }
        });
    }

    setTimeout(() => {
        testState.currentIndex++;
        if (testState.currentIndex >= testState.questions.length) {
            finishTest();
        } else {
            renderLearningContent();
        }
    }, 1500);
}

function finishTest() {
    testState.isActive = false;
    const container = document.getElementById('learning-content');
    
    let message = '';
    let emoji = '';
    
    // Different messages for Memory game
    if (testState.mode === 'memory') {
         message = 'Отличная память! Все пары найдены!';
         emoji = '🧠';
    } else {
        if (testState.score === 5) {
            message = 'Великолепно! Ты настоящий знаток!';
            emoji = '🏆';
        } else if (testState.score >= 3) {
            message = 'Хороший результат! Но есть куда расти.';
            emoji = '👍';
        } else {
            message = 'Не расстраивайся! Повтори слова и попробуй снова.';
            emoji = '📚';
        }
    }

    container.innerHTML = `
        <div class="story-card" style="text-align:center; max-width: 600px; margin: 0 auto;">
            <div style="font-size: 4rem; margin-bottom: 20px;">${emoji}</div>
            <h3 class="story-title">Игра завершена!</h3>
            ${testState.mode !== 'memory' ? `<div class="test-final-score">${testState.score} из 5</div>` : ''}
            <p class="story-content" style="margin-bottom: 30px;">
                ${message}
            </p>
            <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
                <button class="tour-btn" onclick="startGame('${testState.mode}')" style="position:static;">Играть еще</button>
                <button class="tab-btn" onclick="testState.isActive=false; renderLearningContent()" style="display:inline-block; border-color:var(--t2-white); color:var(--t2-white);">В меню игр</button>
            </div>
        </div>
    `;
}