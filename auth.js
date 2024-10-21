
const firebaseConfig = {
    apiKey: "AIzaSyAlP2XJUlq7Nd8PsCCY6rXeqRDXI03Zetw",
    authDomain: "gameflag-e1f04.firebaseapp.com",
    projectId: "gameflag-e1f04",
    storageBucket: "gameflag-e1f04.appspot.com",
    messagingSenderId: "981349233347",
    appId: "1:981349233347:web:118c5980fea32bf7d62876"
  };

firebase.initializeApp(firebaseConfig);
document.getElementById('signupBtn').addEventListener('click', function() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        const signupMessage = document.getElementById('signupMessage');
        signupMessage.innerText = "Passwords do not match.";
        signupMessage.classList.add('active');
        return; 
    }
firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
        const signupMessage = document.getElementById('signupMessage');
        document.getElementById('signupMessage').innerText = "Account successfully created! ";
        signupMessage.classList.add('active', 'success'); 
        setTimeout(() => {
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            signupMessage.classList.remove('active', 'success'); 
        }, 2000); 
    }).catch((error) => {
        const signupMessage = document.getElementById('signupMessage');
        signupMessage.innerText = getCustomErrorMessage(error.code);
        signupMessage.classList.add('active');
    });
});
document.getElementById('loginBtn').addEventListener('click', function() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {window.location.href = 'game/game.html';
        }).catch((error) => {
            document.getElementById('loginMessage').innerText = getCustomErrorMessage(error.code);
            loginMessage.classList.add('active');
        });
});
function getCustomErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered. Please use a different one.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Your password must be at least 6 characters long.',
        'auth/user-not-found': 'No account found with this email. Please sign up.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
    };
    return errorMessages[errorCode] || 'Invalid Username or Password';
}




