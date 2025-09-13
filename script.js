// Quiz data for different topics
const quizData = {
    science: [
        { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
        { question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
        { question: "What is the largest organ in the human body?", options: ["Liver", "Heart", "Skin", "Lungs"], correct: 2 },
        { question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
        { question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2 },
        { question: "Which scientist proposed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Niels Bohr"], correct: 1 },
        { question: "What is the smallest unit of life?", options: ["Atom", "Cell", "Molecule", "Organelle"], correct: 1 },
        { question: "Which subatomic particle has a negative charge?", options: ["Proton", "Neutron", "Electron", "Photon"], correct: 2 },
        { question: "What is the main gas found in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 2 },
        { question: "Which vitamin is produced when your skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correct: 3 }
    ],
    // ... add history, geography, technology etc.
};

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const reviewBtn = document.getElementById('reviewBtn');
const timer = document.getElementById('timer');
const questionNumber = document.getElementById('questionNumber');
const question = document.getElementById('question');
const options = document.getElementById('options');
const progress = document.getElementById('progress');
const scoreValue = document.getElementById('scoreValue');
const scoreText = document.getElementById('scoreText');
const scoreCircle = document.getElementById('scoreCircle');
const topicButtons = document.querySelectorAll('.topic-btn');

// Quiz state
let currentTopic = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let timeLeft = 300;
let timerInterval;

// Event Listeners
startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', showPreviousQuestion);
nextBtn.addEventListener('click', showNextQuestion);
restartBtn.addEventListener('click', restartQuiz);
reviewBtn.addEventListener('click', reviewAnswers);

topicButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentTopic = button.getAttribute('data-topic');
        topicButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});

// Functions
function startQuiz() {
    if (!currentTopic) {
        alert('Please select a topic first!');
        return;
    }
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');

    currentQuestions = [...quizData[currentTopic]];
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuestions.length).fill(null);

    startTimer();
    showQuestion();
}

function showQuestion() {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    question.textContent = currentQuestion.question;
    progress.style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;

    options.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.setAttribute('data-index', index);

        if (userAnswers[currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }

        optionElement.addEventListener('click', () => selectOption(index));
        options.appendChild(optionElement);
    });

    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.textContent = currentQuestionIndex === currentQuestions.length - 1 ? 'Finish Quiz' : 'Next Question';
}

function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    const allOptions = options.querySelectorAll('.option');
    allOptions.forEach(option => option.classList.remove('selected'));
    allOptions[optionIndex].classList.add('selected');
}

function showNextQuestion() {
    if (userAnswers[currentQuestionIndex] === null) {
        alert('Please select an answer before proceeding.');
        return;
    }
    if (currentQuestionIndex === currentQuestions.length - 1) {
        finishQuiz();
        return;
    }
    currentQuestionIndex++;
    showQuestion();
}

function showPreviousQuestion() {
    currentQuestionIndex--;
    showQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 300;
    updateTimer();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 60) {
        timer.style.backgroundColor = '#dc3545';
        timer.style.color = '#fff';
    } else if (timeLeft <= 120) {
        timer.style.backgroundColor = '#ffc107';
        timer.style.color = '#212529';
    } else {
        timer.style.backgroundColor = '';
        timer.style.color = '';
    }
}

function finishQuiz() {
    clearInterval(timerInterval);
    score = 0;
    currentQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) score++;
    });

    scoreValue.textContent = score;
    const percentage = (score / currentQuestions.length) * 100;
    scoreCircle.style.setProperty('--percent', `${percentage}%`);

    if (percentage >= 90) scoreText.textContent = "Outstanding! You're a genius!";
    else if (percentage >= 70) scoreText.textContent = "Great job! You really know your stuff!";
    else if (percentage >= 50) scoreText.textContent = "Good effort! Keep learning!";
    else scoreText.textContent = "Keep studying and try again!";

    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
}

function restartQuiz() {
    resultsScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    currentTopic = '';
    topicButtons.forEach(btn => btn.classList.remove('selected'));
}

function reviewAnswers() {
    alert('Review feature would show correct answers and your responses.');
}
