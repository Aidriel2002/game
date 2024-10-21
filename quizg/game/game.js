(function () {
    let continentScore = 0;
    let answeredCountries = new Set();
    let isAnswering = false;
    let currentCountryIndex = 0;
    let countries = [];
    let incorrectAttempts = 0; 
    const maxAttempts = 3; 
    let questionNumb = 1; 

 
    async function fetchCountries() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            countries = await response.json();
            loadContinentGame();  
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    }

    function loadContinentGame() {
        if (countries.length === 0) {
            console.error("Countries data is not loaded.");
            return;
        }

        if (currentCountryIndex >= countries.length) {
            currentCountryIndex = 0;
        }

        const country = countries[currentCountryIndex];

    
        const flagElement = document.getElementById('continentFlag');
        if (flagElement) {
            flagElement.src = country.flags.png;
        }

        const continentNameElement = document.getElementById('continentName');
        if (continentNameElement) {
            continentNameElement.innerText = country.name.common;
        }

        document.getElementById('continentScore').innerText = `Score: ${continentScore}`;
       
        document.getElementById('questionNumb').innerText = `Level: ${questionNumb}`;
        
        document.getElementById('chancesLife').innerText = `Life: ${maxAttempts - incorrectAttempts}`;

        const correctContinent = country.continents[0];

        const options = [correctContinent];
        while (options.length < 4) {
            const randomCountry = countries[Math.floor(Math.random() * countries.length)];
            const randomContinent = randomCountry.continents[0];
            if (!options.includes(randomContinent)) {
                options.push(randomContinent);
            }
        }


        options.sort(() => Math.random() - 0.5);


        const choicesHTML = options.map((continent, index) => 
            `<button class="continent-choice" data-continent="${continent}">${String.fromCharCode(65 + index)}. ${continent}</button>`
        ).join('');

        const continentChoices = document.getElementById('continentChoices');
        continentChoices.innerHTML = choicesHTML;


        const continentButtons = document.querySelectorAll('.continent-choice');
        continentButtons.forEach(button => {
            button.disabled = false; 
            button.addEventListener('click', () => checkContinentAnswer(button.dataset.continent, correctContinent));
        });
    }

    function checkContinentAnswer(selectedContinent, correctContinent) {
        if (isAnswering) return;
        isAnswering = true;

        const resultElement = document.getElementById('continentResult');

        if (selectedContinent === correctContinent) {
            if (!answeredCountries.has(currentCountryIndex)) {
                continentScore++;
                answeredCountries.add(currentCountryIndex);
                resultElement.innerText = 'Correct!';
            } else {
                resultElement.innerText = 'You have already answered this question correctly!';
            }


            questionNumb++;
            currentCountryIndex++;
            setTimeout(() => {
                loadContinentGame();
                isAnswering = false;
            }, 2000);
            const user = firebase.auth().currentUser; 
            if (user) {
                saveScore(user.uid, incorrectAttempts, questionNumb, continentScore); 
            }
        } else {
            incorrectAttempts++; 
            resultElement.innerText = `Incorrect! Try again.`; 

            if (incorrectAttempts >= maxAttempts) {
                resultElement.innerText = `Game Over! You have exceeded the maximum attempts.`;
                disableButtons();
              
                setTimeout(resetContinentGame, 2000);
            } else {
             
                document.getElementById('chancesLife').innerText = `Chances left: ${maxAttempts - incorrectAttempts}`;
                isAnswering = false;
            }
        }
    }

    function disableButtons() {
        const continentButtons = document.querySelectorAll('.continent-choice');
        continentButtons.forEach(button => {
            button.disabled = true; 
        });
    }

    function resetContinentGame() {
        continentScore = 0;
        answeredCountries.clear();
        currentCountryIndex = 0;
        incorrectAttempts = 0; 
        questionNumb = 1;
        document.getElementById('continentResult').innerText = '';
        loadContinentGame(); 
        enableButtons(); 
    }

    function enableButtons() {
        const continentButtons = document.querySelectorAll('.continent-choice');
        continentButtons.forEach(button => {
            button.disabled = false;
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('guessContinentBtn').addEventListener('click', (event) => {
            event.preventDefault();
            document.querySelector('.selectGame').classList.add('hidden');
            document.getElementById('flagGame').classList.add('hidden');
            document.getElementById('continentGame').classList.remove('hidden');
            resetContinentGame();
        });
    });

    fetchCountries();
})();
