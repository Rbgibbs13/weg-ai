const gameBtnEl = document.querySelector("#game-button");
const storyBtnEl = document.querySelector("#story-button");
const quizBtnEl = document.querySelector("#quiz-button");

const startGame = async() => {
    const data = {
        method: 'GET',
    };
    const game = await fetch('http://localhost:3001/game');
}

gameBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
});