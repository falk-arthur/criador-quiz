let questions = JSON.parse(localStorage.getItem('quizQuestions')) || [];
let currentQuestionIndex = 0;
let selectedOption = null;
let userAnswers = [];
let editingIndex = null; // Controla se estamos editando uma pergunta

// Elementos do DOM
const addQuestionBtn = document.getElementById('addQuestionBtn');
const clearQuestionsBtn = document.getElementById('clearQuestionsBtn');
const startQuizBtn = document.getElementById('startQuizBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const restartQuizBtn = document.getElementById('restartQuizBtn');
const formContainer = document.getElementById('form-container');
const questionsPreview = document.getElementById('questionsPreview');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const quizCategory = document.getElementById('quiz-category');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const totalScore = document.getElementById('totalScore');
const categoryScores = document.getElementById('categoryScores');
const questionsReview = document.getElementById('questionsReview');

// Inicializa a aplicação
function initializeApp() {
    updateQuestionsList();
    formContainer.style.display = 'block';
    questionsPreview.parentElement.style.display = 'block';
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    startQuizBtn.style.display = 'block';
    editingIndex = null;
}

// Atualiza a lista de perguntas adicionadas
function updateQuestionsList() {
    questionsPreview.innerHTML = '';
    questions.forEach((q, index) => {
        questionsPreview.innerHTML += `
            <div class="question-item">
                <strong>Pergunta ${index + 1}</strong>: ${q.question}
                <button onclick="editQuestion(${index})">Editar</button>
                <button onclick="deleteQuestion(${index})">Excluir</button>
            </div>`;
    });
}

// Salva as perguntas no localStorage
function saveQuestions() {
    localStorage.setItem('quizQuestions', JSON.stringify(questions));
}

// Adiciona ou edita uma pergunta
addQuestionBtn.addEventListener('click', () => {
    const question = document.getElementById('question').value;
    const options = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById('option4').value,
        document.getElementById('option5').value,
    ];
    const correctOption = parseInt(document.getElementById('correctOption').value) - 1;
    const category = document.getElementById('category').value;

    if (question && options.every(opt => opt) && category) {
        if (editingIndex !== null) {
            questions[editingIndex] = { question, options, correctOption, category };
            editingIndex = null;
        } else {
            questions.push({ question, options, correctOption, category });
        }
        saveQuestions();
        updateQuestionsList();
        clearForm();
    }
});

function editQuestion(index) {
    const q = questions[index];
    document.getElementById('question').value = q.question;
    document.getElementById('option1').value = q.options[0];
    document.getElementById('option2').value = q.options[1];
    document.getElementById('option3').value = q.options[2];
    document.getElementById('option4').value = q.options[3];
    document.getElementById('option5').value = q.options[4];
    document.getElementById('correctOption').value = q.correctOption + 1;
    document.getElementById('category').value = q.category;
    editingIndex = index;
}

function deleteQuestion(index) {
    questions.splice(index, 1);
    saveQuestions();
    updateQuestionsList();
}

clearQuestionsBtn.addEventListener('click', () => {
    questions = [];
    localStorage.removeItem('quizQuestions');
    updateQuestionsList();
});

startQuizBtn.addEventListener('click', () => {
    formContainer.style.display = 'none';
    questionsPreview.parentElement.style.display = 'none';
    startQuizBtn.style.display = 'none';
    quizContainer.style.display = 'block';
    questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    showQuestion();
});

function showQuestion() {
    const q = questions[currentQuestionIndex];
    quizCategory.textContent = `Categoria: ${q.category}`;
    quizQuestion.textContent = q.question;
    quizOptions.innerHTML = q.options.map((opt, i) =>
        `<div class="quiz-option" onclick="selectOption(${i})">${String.fromCharCode(65 + i)}: ${opt}</div>`
    ).join('');
    selectedOption = null;
}

function selectOption(index) {
    selectedOption = index;
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, i) => {
        opt.style.backgroundColor = i === index ? '#a3e4a3' : '#e9ecef';
    });
}

nextQuestionBtn.addEventListener('click', () => {
    if (selectedOption === null) {
        alert('Por favor, selecione uma opção!');
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedOption === currentQuestion.correctOption;
    userAnswers.push({ ...currentQuestion, userAnswer: selectedOption, correct });

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    const totalCorrect = userAnswers.filter(a => a.correct).length;
    totalScore.innerHTML = `Total: ${totalCorrect} / ${questions.length} - ${((totalCorrect / questions.length) * 100).toFixed(2)}%`;

    const categories = [...new Set(questions.map(q => q.category))];
    categoryScores.innerHTML = categories.map(cat => {
        const catQuestions = userAnswers.filter(q => q.category === cat);
        const catCorrect = catQuestions.filter(q => q.correct).length;
        return `<p>${cat}: ${catCorrect} / ${catQuestions.length} - ${(catCorrect / catQuestions.length * 100).toFixed(2)}%</p>`;
    }).join('');

    questionsReview.innerHTML = userAnswers.map((q, i) => `
        <div class="question-review">
            <p><strong>${i + 1}. ${q.question}</strong></p>
            <p>Selecionado: ${String.fromCharCode(65 + q.userAnswer)} - ${q.options[q.userAnswer]}</p>
            <p>Correto: ${String.fromCharCode(65 + q.correctOption)} - ${q.options[q.correctOption]}</p>
        </div>
    `).join('');
}

restartQuizBtn.addEventListener('click', () => {
    userAnswers = [];
    initializeApp();
});

function clearForm() {
    document.querySelectorAll('#form-container input').forEach(input => input.value = '');
}

initializeApp();
