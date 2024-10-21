let countries = [];
let selectedCountries = [];
let score = 0;
let highestFlag = 0;
let questionNumber = 1; 
let incorrectAnswers = 0;
const maxIncorrectAnswers = 3;
let selectedLetters = {};
let letterInstances = [];
let currentCountryIndex = 0; 

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json();

        if (countries.length > 0) {
            loadCountry();
        } else {
            console.error('Fetched countries array is empty.');
        }
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}



function shuffleLetters(word) {
    const letters = word.split('');
    while (letters.length < 16) {
        letters.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
    }
    return letters.sort(() => Math.random() - 0.5);
}

function loadCountry() {
    if (!countries || countries.length === 0) {
        console.error('No countries available.');
        return;
    }

    const country = countries[currentCountryIndex];

    if (!country || !country.flags || !country.flags.png) {
        console.error('Country or its flag is missing:', country);
        return;
    }

    document.getElementById('flag').src = country.flags.png;

    const shuffledLetters = shuffleLetters(country.name.common.toLowerCase().replace(/\s+/g, '-'));
    letterInstances = shuffledLetters.map((letter, index) => ({
        letter,
        id: `letter-${currentCountryIndex}-${index}`
    }));

    document.getElementById('letters').innerHTML = letterInstances.map(instance => 
        `<div class="letter" id="${instance.id}">${instance.letter}</div>`).join('');

    const inputContainer = document.getElementById('inputs');
    inputContainer.innerHTML = '';
    country.name.common.toLowerCase().split('').forEach(() => {
        inputContainer.innerHTML += '<input type="text" class="letter-input" maxlength="1" />';
    });

    selectedLetters = {};
    document.getElementById('result').innerText = '';

    document.querySelector('.letter-input').focus();
    updateChancesLeft();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('letters').addEventListener('click', (event) => {
        if (event.target.classList.contains('letter')) {
            const letter = event.target.innerText;
            const letterId = event.target.id;

            selectedLetters[letterId] = (selectedLetters[letterId] || 0) + 1;

            const inputs = document.querySelectorAll('.letter-input');
            for (let input of inputs) {
                if (input.value === '') {
                    input.value = letter;
                    event.target.classList.add('disabled');
                    event.target.style.pointerEvents = 'none';
                    event.target.style.opacity = '0.5';
                    break;
                }
            }

            if (Array.from(inputs).every(input => input.value !== '')) {
                checkAnswer();
            }
        }
    });

    document.getElementById('inputs').addEventListener('input', () => {
        const inputs = document.querySelectorAll('.letter-input');
        if (Array.from(inputs).every(input => input.value !== '')) {
            checkAnswer();
        }
    });

    document.getElementById('inputs').addEventListener('click', (event) => {
        if (event.target.classList.contains('letter-input') && event.target.value !== '') {
            const letter = event.target.value;
            event.target.value = '';

            const letterDivs = Array.from(document.querySelectorAll('.letter'));
            letterDivs.forEach(div => {
                if (div.textContent === letter) {
                    const letterId = div.id;
                    if (selectedLetters[letterId]) {
                        selectedLetters[letterId]--;
                        if (selectedLetters[letterId] <= 0) {
                            delete selectedLetters[letterId];
                            div.classList.remove('disabled');
                            div.style.pointerEvents = 'auto';
                            div.style.opacity = '1';
                        }
                    }
                }
            });
        }
    });

    document.getElementById('guessFlagBtn').addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('.selectGame').classList.add('hidden');
        document.getElementById('continentGame').classList.add('hidden');
        document.getElementById('flagGame').classList.remove('hidden');
        fetchCountries();
    });
    
});

function checkAnswer() {
    const userInput = Array.from(document.querySelectorAll('.letter-input')).map(input => input.value.toLowerCase()).join('');
    const correctAnswer = countries[currentCountryIndex].name.common.toLowerCase().replace(/\s+/g, '-');

    if (userInput === correctAnswer) {
        score++;
        questionNumber++;
        document.getElementById('result').innerText = 'Correct!';
        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById('questionNumber').innerText = `Level: ${questionNumber}`;
        document.getElementById('highestFlag').innerText = `High Score: ${highestFlag}`;
    
        const user = firebase.auth().currentUser;
        if (user) {
            saveScore(user.uid, score, questionNumber, incorrectAnswers, highestFlag);
        }
    
        updateChancesLeft();
        currentCountryIndex++;
        if (currentCountryIndex < countries.length) {
            setTimeout(loadCountry, 500);
        } else {
            alert('You have completed the game!');
            resetGame();
        }
    } else {
        incorrectAnswers++;
        document.getElementById('result').innerText = 'Incorrect! Try again.';
    
        if (incorrectAnswers >= maxIncorrectAnswers) {
            alert('GAME OVER!!!!s');
            resetGame();
        } else {
            updateChancesLeft();
            const user = firebase.auth().currentUser;
            if (user) {
                saveScore(user.uid, score, questionNumber, incorrectAnswers,highestFlag);
            }
        }
    }
}

function resetInputs() {
    const inputs = document.querySelectorAll('.letter-input');
    inputs.forEach(input => {
        input.value = '';
    });

    const letterDivs = Array.from(document.querySelectorAll('.letter'));
    letterDivs.forEach(div => {
        div.classList.remove('disabled');
        div.style.pointerEvents = 'auto';
        div.style.opacity = '1';
    });
}

function updateChancesLeft() {
    const chancesLeft = maxIncorrectAnswers - incorrectAnswers;
    document.getElementById('chancesLeft').innerText = `Life: ${chancesLeft}`;
}

function resetGame() {
    if (incorrectAnswers >= maxIncorrectAnswers) {
        score = 0;
        questionNumber = 1;
        incorrectAnswers = 0;
        currentCountryIndex = 0; 

        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById('questionNumber').innerText = `Levsssel: ${questionNumber}`;

        const user = firebase.auth().currentUser;
        if (user) {
            saveScore(user.uid, score, questionNumber, incorrectAnswers); 
        }

        loadCountry();
    }
}
