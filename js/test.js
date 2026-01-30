function startTest() {
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
    testState.score = 0;
    testState.isActive = true;
    renderLearningContent();
}

function renderTestQuestion(container) {
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
    } else {
        selectedBtn.classList.add('wrong');
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
    
    if (testState.score === 5) {
        message = 'Великолепно! Ты настоящий знаток башкирского языка!';
        emoji = '🏆';
    } else if (testState.score >= 3) {
        message = 'Хороший результат! Но есть куда расти.';
        emoji = '👍';
    } else {
        message = 'Не расстраивайся! Повтори слова и попробуй снова.';
        emoji = '📚';
    }

    container.innerHTML = `
        <div class="story-card" style="text-align:center; max-width: 600px; margin: 0 auto;">
            <div style="font-size: 4rem; margin-bottom: 20px;">${emoji}</div>
            <h3 class="story-title">Тест завершен!</h3>
            <div class="test-final-score">${testState.score} из 5</div>
            <p class="story-content" style="margin-bottom: 30px;">
                ${message}
            </p>
            <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
                <button class="tour-btn" onclick="startTest()" style="position:static;">Пройти еще раз</button>
                <button class="tab-btn" onclick="switchTab('words')" style="display:inline-block; border-color:var(--t2-white); color:var(--t2-white);">Учить слова</button>
            </div>
        </div>
    `;
}
