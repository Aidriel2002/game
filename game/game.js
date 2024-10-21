let continentScore = 0;
let continentLevel = 1;
let continentLives = 3;
let continentHighScore = 0;
let continents = [];
let currentContinent = null;
let continentChoices = [];

function initializeContinentGame() {
    continentScore = 0;
    continentLevel = 1;
    continentLives = 3;
    updateContinentGameState();
}

document.addEventListener('DOMContentLoaded', function () {
    const guessContinentBtn = document.getElementById('guessContinentBtn');
    const continentGameSection = document.getElementById('continentGame');
    const selectGameSection = document.querySelector('.selectGame');

    guessContinentBtn.addEventListener('click', function (event) {
        event.preventDefault();
        selectGameSection.classList.add('hidden');
        continentGameSection.classList.remove('hidden');
        console.log("Continent game started");
        
        initializeContinentGame(); 
        fetchContinents(); 
    });
});


function fetchContinents() {
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            continents = data; 
            console.log("Fetched continents:", continents); 
            loadNewContinent(); 
        })
        .catch(error => console.error("Error fetching continents:", error));
}

function loadNewContinent() {
    if (continents.length > 0) {
        currentContinent = continents[Math.floor(Math.random() * continents.length)];
        

        if (currentContinent && currentContinent.flags && currentContinent.flags.svg) {
            const continentFlagElement = document.getElementById('continentFlag');
            continentFlagElement.src = currentContinent.flags.svg; 
            console.error("Current continent does not have a valid flag:", currentContinent);
        }

        const continentResultElement = document.getElementById('continentResult');
        if (continentResultElement) {
            continentResultElement.innerHTML = ''; 
        }

        generateContinentChoices();
        displayContinentChoices();
    } else {
        console.error("No continents available.");
    }
}


function generateContinentChoices() {
    continentChoices = []; 
    const correctChoice = currentContinent.name.common;
    continentChoices.push(correctChoice);

    while (continentChoices.length < 4) {
        const randomCountry = continents[Math.floor(Math.random() * continents.length)];
        const countryName = randomCountry.name.common;
        if (!continentChoices.includes(countryName)) {
            continentChoices.push(countryName);
        }
    }

    continentChoices = shuffleArray(continentChoices);
    console.log("Choices generated:", continentChoices);
}


function displayContinentChoices() {
    const choicesContainer = document.getElementById('continentChoices');
    choicesContainer.innerHTML = ''; 

    continentChoices.forEach((choice) => {
        const choiceBtn = document.createElement('button');
        choiceBtn.classList.add('choice-btn');
        choiceBtn.innerText = choice;
        choiceBtn.addEventListener('click', function () {
            checkContinentAnswer(choice); 
        });
        choicesContainer.appendChild(choiceBtn);
    });
}

function checkContinentAnswer(answer) {
    console.log("Answer received:", answer); 

    if (typeof answer !== 'string') {
        console.error("Expected a string, but got:", answer);
        return;
    }

    if (answer.toLowerCase() === currentContinent.name.common.toLowerCase()) {

        continentScore++;
        continentLevel++;
        document.getElementById('continentResult').innerText = "Correct!"; 

        if (continentScore > continentHighScore) {
            continentHighScore = continentScore;
        }

        updateContinentGameState();
        loadNewContinent();
    } else {
 
        continentLives--;

        document.getElementById('continentResult').innerText = "Incorrect!";
        
        if (continentLives <= 0) {
 
            continentGameOver();
        } else {
            updateContinentGameState();
        }
    }
}


function updateContinentGameState() {
    const scoreElem = document.getElementById('continentScore');
    const levelElem = document.getElementById('continentLevel');
    const livesElem = document.getElementById('chancesLife');
    const highScoreElem = document.getElementById('continentHighScore'); 

    if (scoreElem) scoreElem.innerText = `Score: ${continentScore}`;
    if (levelElem) levelElem.innerText = `Level: ${continentLevel}`;
    if (livesElem) livesElem.innerText = `Lives: ${continentLives}`; 
    if (highScoreElem) highScoreElem.innerText = `High Score: ${continentHighScore}`; 


    saveContinentGameState(continentScore, continentLevel, continentLives, continentHighScore);
}

function continentGameOver() {
    alert("Game Over! You have no lives left.");
    
    continentScore = 0;
    continentLevel = 1;
    continentLives = 3; 
    updateContinentGameState(); 

    loadNewContinent(); 
}

