let currentQuestionIndex = 0;
let score = 0;
let questions = [];

const questionText = document.getElementById("question");
const optionButtons = document.querySelectorAll(".option-btn");
const nextButton = document.getElementById("next-button");
const scoreDisplay = document.getElementById("score");

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=11&difficulty=easy');
        const data = await response.json();
        questions = data.results;
        loadQuestion();
    } catch {
        questionText.textContent = "Error loading questions!";
    }
}

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = decodeHTML(currentQuestion.question);
    let options;

    if (currentQuestion.type === "boolean") {
      
        options = ["True", "False"];
    } else {
    
        options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        options.sort(() => Math.random() - 0.5); 
    }
    

    optionButtons.forEach((btn, index) => {
        if (options[index]) {
            btn.textContent = decodeHTML(options[index]);
            btn.style.display = "inline-block";
            btn.disabled = false;
            btn.onclick = () => checkAnswer(options[index], currentQuestion.correct_answer);
        } else {
            btn.style.display = "none";
        }
    });

 
}

function checkAnswer(selected, correct) {
    if (selected === correct) score++;

    optionButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === decodeHTML(correct)) btn.style.backgroundColor = "green";
        else if (btn.textContent === selected) btn.style.backgroundColor = "red";
    });

    scoreDisplay.textContent = `Score: ${score}`;
    nextButton.style.display = "inline-block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        resetState();
        loadQuestion();
    } else {
        questionText.innerHTML = `Quiz Completed! <br> Final Score: ${score}/${questions.length}`;
        optionButtons.forEach(btn => btn.style.display = "none");
        nextButton.style.display = "none";
    }
}

function resetState() {
    optionButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = "";
    });
    nextButton.style.display = "none";
}


function decodeHTML(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent;
}

window.onload = fetchQuestions;


