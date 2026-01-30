let learnedItems = new Set();
let currentTab = 'words';
let testState = {
    isActive: false,
    mode: null, // 'quiz', 'audio', 'memory'
    questions: [],
    currentIndex: 0,
    score: 0,
    memoryCards: [],
    flippedCards: [],
    matchedPairs: 0
};

function setLearnedItems(newSet) {
    learnedItems = newSet;
}

function setCurrentTab(newTab) {
    currentTab = newTab;
}

function setTestState(newState) {
    Object.assign(testState, newState);
}
