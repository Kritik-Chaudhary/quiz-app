// Quiz data
const quizData = [
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Saturn", "Neptune"],
        correct: 1,
        explanation: "Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined."
    },
    {
        question: "Who painted the famous artwork 'The Starry Night'?",
        options: ["Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh", "Claude Monet"],
        correct: 2,
        explanation: "Vincent van Gogh painted 'The Starry Night' in 1889 while he was a patient at a mental asylum."
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2,
        explanation: "Au comes from the Latin word 'aurum', meaning gold."
    },
    {
        question: "Which ocean is the largest by surface area?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3,
        explanation: "The Pacific Ocean covers about 63 million square miles, making it the largest ocean."
    },
    {
        question: "What year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct: 1,
        explanation: "World War II ended in 1945 with the surrender of Japan in September."
    },
    {
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Mercury", "Mars", "Earth"],
        correct: 1,
        explanation: "Mercury is the closest planet to the Sun, with an average distance of 36 million miles."
    },
    {
        question: "Who wrote the novel 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"],
        correct: 0,
        explanation: "Harper Lee wrote 'To Kill a Mockingbird', published in 1960."
    },
    {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
        correct: 2,
        explanation: "Vatican City is the smallest country in the world, with an area of just 0.17 square miles."
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Osmium", "Oxygen", "Oganesson", "Olivine"],
        correct: 1,
        explanation: "Oxygen has the chemical symbol 'O' and is essential for life on Earth."
    },
    {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Brisbane", "Canberra"],
        correct: 3,
        explanation: "Canberra is the capital of Australia, located in the Australian Capital Territory."
    },
    {
        question: "Which mountain range contains Mount Everest?",
        options: ["Andes", "Rocky Mountains", "Himalayas", "Alps"],
        correct: 2,
        explanation: "Mount Everest is located in the Himalayas on the border between Nepal and Tibet."
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Graphite", "Diamond", "Quartz", "Topaz"],
        correct: 1,
        explanation: "Diamond is the hardest natural substance on Earth, rating 10 on the Mohs scale."
    },
    {
        question: "Which scientist developed the theory of evolution?",
        options: ["Isaac Newton", "Albert Einstein", "Charles Darwin", "Gregor Mendel"],
        correct: 2,
        explanation: "Charles Darwin developed the theory of evolution by natural selection."
    },
    {
        question: "What is the currency of Japan?",
        options: ["Won", "Yuan", "Yen", "Ringgit"],
        correct: 2,
        explanation: "The Japanese currency is the Yen (¥)."
    },
    {
        question: "Which gas makes up approximately 78% of Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
        correct: 2,
        explanation: "Nitrogen makes up about 78% of Earth's atmosphere, while oxygen makes up about 21%."
    }
];

// Quiz state variables
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let timeLeft = 30;
let timer;
let quizStarted = false;

// DOM elements
const startScreen = document.getElementById('startScreen');
const quizContent = document.getElementById('quizContent');
const resultsScreen = document.getElementById('resultsScreen');
const progressBar = document.getElementById('progressBar');
const questionCounter = document.getElementById('questionCounter');
const timerDisplay = document.getElementById('timer');
const questionText = document.getElementById('questionText');
const answersContainer = document.getElementById('answersContainer');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const finalScore = document.getElementById('finalScore');
const scoreText = document.getElementById('scoreText');
const performanceMessage = document.getElementById('performanceMessage');
const totalQuestionsDisplay = document.getElementById('totalQuestions');

// Initialize quiz
function initQuiz() {
    totalQuestionsDisplay.textContent = quizData.length;
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    timeLeft = 30;
    quizStarted = false;
    
    // Reset UI
    startScreen.style.display = 'block';
    quizContent.style.display = 'none';
    resultsScreen.classList.remove('show');
    progressBar.style.width = '0%';
    
    // Clear any existing timer
    if (timer) {
        clearInterval(timer);
    }
}

// Start quiz
function startQuiz() {
    quizStarted = true;
    startScreen.style.display = 'none';
    quizContent.style.display = 'block';
    
    showQuestion();
    startTimer();
}

// Display current question
function showQuestion() {
    const question = quizData[currentQuestion];
    const questionContainer = document.getElementById('questionContainer');
    
    // Update question counter
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    
    // Update progress bar
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Update question text
    questionText.textContent = question.question;
    
    // Clear previous answers
    answersContainer.innerHTML = '';
    
    // Create answer options
    question.options.forEach((option, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.textContent = option;
        answerDiv.onclick = () => selectAnswer(index);
        answersContainer.appendChild(answerDiv);
    });
    
    // Reset feedback
    feedback.classList.remove('show', 'correct', 'incorrect');
    feedback.textContent = '';
    
    // Update navigation buttons
    nextBtn.disabled = true;
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'View Results' : 'Next Question';
    
    // Add active class with animation
    questionContainer.classList.remove('active');
    setTimeout(() => {
        questionContainer.classList.add('active');
    }, 50);
    
    // Reset timer
    resetTimer();
}

// Handle answer selection
function selectAnswer(selectedIndex) {
    const question = quizData[currentQuestion];
    const answerOptions = document.querySelectorAll('.answer-option');
    
    // Disable all options
    answerOptions.forEach(option => {
        option.classList.add('disabled');
        option.onclick = null;
    });
    
    // Store user answer
    userAnswers[currentQuestion] = selectedIndex;
    
    // Show correct/incorrect styling
    answerOptions.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    // Update score
    if (selectedIndex === question.correct) {
        score++;
        showFeedback(true, question.explanation);
    } else {
        showFeedback(false, question.explanation);
    }
    
    // Enable next button
    nextBtn.disabled = false;
    
    // Stop timer
    clearInterval(timer);
}

// Show feedback
function showFeedback(isCorrect, explanation) {
    feedback.textContent = explanation;
    feedback.classList.add('show');
    
    if (isCorrect) {
        feedback.classList.add('correct');
        feedback.classList.remove('incorrect');
    } else {
        feedback.classList.add('incorrect');
        feedback.classList.remove('correct');
    }
}

// Timer functions
function startTimer() {
    timeLeft = 30;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `${timeLeft}s`;
    
    // Change color based on time remaining
    if (timeLeft <= 10) {
        timerDisplay.style.background = '#dc3545';
        timerDisplay.classList.add('pulse');
    } else {
        timerDisplay.style.background = '#ff6b6b';
        timerDisplay.classList.remove('pulse');
    }
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    updateTimerDisplay();
    startTimer();
}

function handleTimeUp() {
    const answerOptions = document.querySelectorAll('.answer-option');
    
    // Show correct answer
    answerOptions.forEach((option, index) => {
        option.classList.add('disabled');
        option.onclick = null;
        
        if (index === quizData[currentQuestion].correct) {
            option.classList.add('correct');
        }
    });
    
    // Store as incorrect answer
    userAnswers[currentQuestion] = -1; // -1 indicates no answer/timeout
    
    // Show feedback for timeout
    showFeedback(false, `Time's up! ${quizData[currentQuestion].explanation}`);
    
    // Enable next button
    nextBtn.disabled = false;
}

// Navigation functions
function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
}



// Show results
function showResults() {
    clearInterval(timer);
    quizContent.style.display = 'none';
    resultsScreen.classList.add('show');
    
    // Calculate percentage
    const percentage = Math.round((score / quizData.length) * 100);
    
    // Update score display
    finalScore.textContent = `${score}/${quizData.length}`;
    scoreText.textContent = `You scored ${score} out of ${quizData.length} questions correctly (${percentage}%)`;
    
    // Show performance message
    let performanceClass = '';
    let performanceText = '';
    
    if (percentage >= 90) {
        performanceClass = 'performance-excellent';
        performanceText = '🎉 Excellent! You have outstanding knowledge!';
    } else if (percentage >= 70) {
        performanceClass = 'performance-good';
        performanceText = '👍 Good job! You have solid knowledge!';
    } else if (percentage >= 50) {
        performanceClass = 'performance-average';
        performanceText = '👌 Not bad! Keep learning to improve!';
    } else {
        performanceClass = 'performance-poor';
        performanceText = '📚 Keep studying! You can do better next time!';
    }
    
    performanceMessage.className = `performance-message ${performanceClass}`;
    performanceMessage.textContent = performanceText;
    
    // Add fade-in animation
    resultsScreen.classList.add('fade-in');
}

// Restart quiz
function restartQuiz() {
    resultsScreen.classList.remove('show', 'fade-in');
    initQuiz();
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', initQuiz);
