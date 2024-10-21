const quitModal = document.getElementById('quitModal');
const closeModalButton = document.getElementById('closeModal');
const confirmQuitButton = document.getElementById('confirmQuit');
const cancelQuitButton = document.getElementById('cancelQuit');

let currentGame;

document.getElementById('quitContinentBtn').addEventListener('click', function() {
    currentGame = 'continent';
    quitModal.classList.remove('hidden');
});

document.getElementById('quitFlagBtn').addEventListener('click', function() {
    currentGame = 'flag';
    quitModal.classList.remove('hidden');
});


closeModalButton.addEventListener('click', function() {
    quitModal.classList.add('hidden');
});

cancelQuitButton.addEventListener('click', function() {
    quitModal.classList.add('hidden');
});


confirmQuitButton.addEventListener('click', function() {
    if (currentGame === 'continent') {
        document.getElementById('continentGame').classList.add('hidden');
    } else if (currentGame === 'flag') {
        document.getElementById('flagGame').classList.add('hidden');
    }
    document.querySelector('.selectGame').classList.remove('hidden');
    quitModal.classList.add('hidden');
});

const hoverSound = document.getElementById('hoverSound');
const buttons = document.querySelectorAll('.container a');

buttons.forEach(button => {
    button.addEventListener('mouseover', () => {

        clearTimeout(button.hoverTimeout);
        
        button.hoverTimeout = setTimeout(() => {
            hoverSound.currentTime = 0; 
            hoverSound.play().catch(error => {
                console.error('Audio play failed:', error);
            });
        }, 50); 
    });

    button.addEventListener('mouseleave', () => {
        clearTimeout(button.hoverTimeout);
    });
});

