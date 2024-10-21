let db;
let userDoc;

document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "AIzaSyAlP2XJUlq7Nd8PsCCY6rXeqRDXI03Zetw",
        authDomain: "gameflag-e1f04.firebaseapp.com",
        projectId: "gameflag-e1f04",
        storageBucket: "gameflag-e1f04.appspot.com",
        messagingSenderId: "981349233347",
        appId: "1:981349233347:web:118c5980fea32bf7d62876"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    db = firebase.firestore();

    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const closeButton = document.querySelector('.close-button');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        logoutModal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        logoutModal.style.display = 'none';
    });

    cancelLogout.addEventListener('click', function() {
        logoutModal.style.display = 'none';
    });

    confirmLogout.addEventListener('click', function() {
        firebase.auth().signOut().then(() => {
            window.location.href = '../index.html';
        }).catch((error) => {
            console.error('Logout error:', error.message);
        });

        logoutModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === logoutModal) {
            logoutModal.style.display = 'none';
        }
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userDoc = db.collection('users').doc(user.uid);
            userDoc.get().then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    loadGameState(data);
                    loadContinentGameState(data);
                } else {
                    initializeGameState();
                    initializeContinentGameState();
                }
            });
        } else {
            window.location.href = '../index.html';
        }
    });
});

function saveGameState(score, level, lives, highScore) {
    userDoc.get().then((doc) => {
        const data = doc.data();
        const currentHighScore = data?.highScore || 0;
        const newHighScore = Math.max(highScore, currentHighScore);

        if (userDoc) {
            userDoc.set({
                score: score,
                level: level,
                lives: lives,
                highScore: newHighScore
            }, { merge: true });
        }
    });
}

function saveContinentGameState(score, level, lives, highScore) {
    userDoc.get().then((doc) => {
        const data = doc.data();
        const currentContinentHighScore = data?.continentHighScore || 0;
        const newContinentHighScore = Math.max(highScore, currentContinentHighScore);

        if (userDoc) {
            userDoc.set({
                continentScore: score,
                continentLevel: level,
                continentLives: lives,
                continentHighScore: newContinentHighScore
            }, { merge: true });
        }
    });
}

function initializeGameState() {
    saveGameState(0, 1, 3, 0);
}

function initializeContinentGameState() {
    saveContinentGameState(0, 1, 3, 0);
}

function loadGameState(data) {
    const score = data.score || 0;
    const level = data.level || 1;
    const lives = data.lives || 3;
    const highScore = data.highScore || 0;

    const scoreElem = document.getElementById('score');
    const levelElem = document.getElementById('level');
    const livesElem = document.getElementById('chancesLeft');
    const highScoreElem = document.getElementById('highestFlag');

    if (scoreElem) scoreElem.innerText = `Score: ${score}`;
    if (levelElem) levelElem.innerText = `Level: ${level}`;
    if (livesElem) livesElem.innerText = `Lives: ${lives}`;
    if (highScoreElem) highScoreElem.innerText = `High Score: ${highScore}`;

    window.gameState = {
        score: score,
        level: level,
        lives: lives,
        highScore: highScore
    };
}

function loadContinentGameState(data) {
    const continentScoreElem = document.getElementById('continentScore');
    const continentLevelElem = document.getElementById('continentLevel');
    const continentLivesElem = document.getElementById('chancesLife');
    const continentHighScoreElem = document.getElementById('continentHighScore');

    if (continentScoreElem) continentScoreElem.innerText = `Score: ${data.continentScore}`;
    if (continentLevelElem) continentLevelElem.innerText = `Level: ${data.continentLevel}`;
    if (continentLivesElem) continentLivesElem.innerText = `Lives: ${data.continentLives}`;
    if (continentHighScoreElem) continentHighScoreElem.innerText = `High Score: ${data.continentHighScore}`;

    window.continentGameState = {
        score: data.continentScore,
        level: data.continentLevel,
        lives: data.continentLives,
        highScore: data.continentHighScore
    };
}
