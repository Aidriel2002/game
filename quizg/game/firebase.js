let db;

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
            loadScore(user.uid).then(({ score: dbScore, questionNumber: dbQuestionNumber, incorrectAnswers: dbIncorrectAnswers,dbhighestFlag }) => {
                score = dbScore;
                questionNumber = dbQuestionNumber;
                incorrectAnswers = dbIncorrectAnswers;
                highestFlag = dbScore;
    
                document.getElementById('score').innerText = `Score: ${score}`;
                document.getElementById('questionNumber').innerText = `Level: ${questionNumber}`;
                document.getElementById('chancesLeft').innerText = `Life: ${incorrectAnswers}`;
                document.getElementById('highestFlag').innerText = `High Score: ${highestFlag}`
                loadCountry();
            }).catch(error => {
                console.error('Error loading score:', error);
            });
        } else {
            console.log('User not logged in. Please log in to continue.');
        }
    });
    
    
});
function loadScore(userId) {
    const userRef = db.collection('users').doc(userId);
    return userRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            return {
                score: data.score,
                questionNumber: data.questionNumber,
                incorrectAnswers: data.incorrectAnswers,
                highestFlag: data.highestFlag
            };
        } else {
            return userRef.set({
                score: 0,
                questionNumber: 1,
                incorrectAnswers: 0
            }).then(() => {
                return { score: 0, questionNumber: 1, incorrectAnswers: 0 };
            });
        }
    }).catch((error) => {
        console.error('Error loading score:', error);
        return { score: 0, questionNumber: 1, incorrectAnswers: 0 };
    });
}


function saveScore(userId, score, questionNumber, incorrectAnswers,highestFlag) {
    const userScoreRef = firebase.firestore().collection('users').doc(userId);
    userScoreRef.set({
        score: score,
        questionNumber: questionNumber,
        incorrectAnswers: incorrectAnswers,
        highestFlag: highestFlag
    })
    .then(() => {
        console.log('Score and game state saved successfully.');
    })
    .catch((error) => {
        console.error('Error saving score:', error);
    });
}
