let score = 0;
let level = 1;
let lives = 3;
let highScore = 0;
let countries = [];
let currentCountry = null;
let choices = [];

document.addEventListener('DOMContentLoaded', function () {
    const guessFlagBtn = document.getElementById('guessFlagBtn');
    const guessContinentBtn = document.getElementById('guessContinentBtn');
    const flagGameSection = document.getElementById('flagGame');
    const continentGameSection = document.getElementById('continentGame');
    const selectGameSection = document.querySelector('.selectGame');

    guessFlagBtn.addEventListener('click', function (event) {
        event.preventDefault();
        selectGameSection.classList.add('hidden');
        flagGameSection.classList.remove('hidden');
        console.log("Flag game started");
    });

    guessContinentBtn.addEventListener('click', function (event) {
        event.preventDefault();
        selectGameSection.classList.add('hidden');
        continentGameSection.classList.remove('hidden');
        console.log("Continent game started");
    });

    document.getElementById('quitFlagBtn').addEventListener('click', function () {
        endGame();
    });

    fetchFlags();
    initializeGame();
});

function fetchFlags() {
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            countries = data;
            loadNewFlag();
        })
        .catch(error => console.error("Error fetching flags:", error));
}

function loadNewFlag() {
    if (countries.length > 0) {
        currentCountry = countries[Math.floor(Math.random() * countries.length)];
        document.getElementById('flag').src = currentCountry.flags.svg;
        document.getElementById('result').innerHTML = '';
        generateChoices();
        displayChoices();
    }
}

function generateChoices() {
    choices = [];
    const correctChoice = currentCountry.name.common;
    choices.push(correctChoice);

    while (choices.length < 4) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const countryName = randomCountry.name.common;
        if (!choices.includes(countryName)) {
            choices.push(countryName);
        }
    }

    choices = shuffleArray(choices);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayChoices() {
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    choices.forEach((choice, index) => {
        const choiceBtn = document.createElement('button');
        choiceBtn.classList.add('choice-btn');
        choiceBtn.innerText = choice;
        choiceBtn.addEventListener('click', function () {
            checkAnswer(choice);
        });
        choicesContainer.appendChild(choiceBtn);
    });
}

function checkAnswer(answer) {
    if (answer.toLowerCase() === currentCountry.name.common.toLowerCase()) {
        score++;
        level++;
        document.getElementById('result').innerText = "Correct!";
        
        if (score > highScore) {
            highScore = score;
        }
        
        updateGameState();
        loadNewFlag();
    } else {
        lives--;
        document.getElementById('result').innerText = "Incorrect!";
        if (lives <= 0) {
            gameOver();
        } else {
            updateGameState();
        }
    }
}

function updateGameState() {
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('level').innerText = `Level: ${level}`;
    document.getElementById('chancesLeft').innerText = `Lives: ${lives}`;

    if (score > highScore) {
        highScore = score;
    }

    document.getElementById('highestFlag').innerText = `High Score: ${highScore}`;
    saveGameState(score, level, lives, highScore);
}

function gameOver() {
    alert("Game Over! You have no lives left.");
    score = 0;
    level = 1;
    lives = 3;
    updateGameState();
    loadNewFlag();
}

function initializeGame() {
    if (window.gameState) {
        score = window.gameState.score || 0;
        level = window.gameState.level || 1;
        lives = window.gameState.lives || 3;
        highScore = window.gameState.highScore || 0;

        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById('level').innerText = `Level: ${level}`;
        document.getElementById('chancesLeft').innerText = `Lives: ${lives}`;
        document.getElementById('highestFlag').innerText = `High Score: ${highScore}`;
    } else {
        score = 0;
        level = 1;
        lives = 3;
        document.getElementById('highestFlag').innerText = `High Score: ${highScore}`;
    }
}
