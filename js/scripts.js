// Seletores
const startQuizBtn = document.getElementById('startQuizBtn');
const formContainer = document.getElementById('form-container');
const quizContainer = document.getElementById('quiz-container');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const resultContainer = document.getElementById('result-container');
const totalScore = document.getElementById('total-score');
const categoryScores = document.getElementById('category-scores');
const restartQuizBtn = document.getElementById('restartQuizBtn');

// Variáveis globais
let questions = JSON.parse(localStorage.getItem('questions')) || [];
let currentQuestionIndex = 0;
let score = {};
let shuffledQuestions = [];

// Adicionar pergunta
document.getElementById('addQuestionBtn').addEventListener('click', () => {
  const question = document.getElementById('question').value;
  const options = [
    document.getElementById('option1').value,
    document.getElementById('option2').value,
    document.getElementById('option3').value,
    document.getElementById('option4').value,
  ];
  const correctOption = parseInt(document.getElementById('correctOption').value) - 1;
  const category = document.getElementById('category').value;

  if (question && options.every(opt => opt) && !isNaN(correctOption) && category) {
    questions.push({ question, options, correctOption, category });
    localStorage.setItem('questions', JSON.stringify(questions));
    alert('Pergunta adicionada com sucesso!');
    clearForm();
  } else {
    alert('Preencha todos os campos corretamente.');
  }
});

// Limpar perguntas
document.getElementById('clearQuestionsBtn').addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar todas as perguntas?')) {
    questions = [];
    localStorage.removeItem('questions');
    alert('Todas as perguntas foram removidas.');
  }
});

// Iniciar Quiz
startQuizBtn.addEventListener('click', () => {
  if (questions.length === 0) {
    alert('Adicione pelo menos uma pergunta antes de iniciar o quiz.');
    return;
  }

  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = {};
  formContainer.style.display = 'none';
  resultContainer.style.display = 'none';
  quizContainer.style.display = 'block';
  nextQuestionBtn.click();
});

// Mostrar pergunta
function showQuestion(question) {
  quizQuestion.textContent = question.question;
  quizOptions.innerHTML = '';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(index, question));
    quizOptions.appendChild(button);
  });
}

// Manipular resposta
function handleAnswer(selectedOption, question) {
  const isCorrect = selectedOption === question.correctOption;
  const category = question.category;

  score[category] = score[category] || { correct: 0, total: 0 };
  score[category].total++;
  if (isCorrect) score[category].correct++;

  nextQuestionBtn.click();
}

// Próxima pergunta
nextQuestionBtn.addEventListener('click', () => {
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    currentQuestionIndex++;
  } else {
    showResults();
  }
});

// Mostrar resultados
function showResults() {
  quizContainer.style.display = 'none';
  resultContainer.style.display = 'block';

  const totalCorrect = Object.values(score).reduce((sum, cat) => sum + cat.correct, 0);
  const totalQuestions = shuffledQuestions.length;

  totalScore.textContent = `Pontuação Total: ${totalCorrect} / ${totalQuestions} (${((totalCorrect / totalQuestions) * 100).toFixed(2)}%)`;

  categoryScores.innerHTML = '';
  for (const [category, { correct, total }] of Object.entries(score)) {
    const percentage = ((correct / total) * 100).toFixed(2);
    const categoryResult = document.createElement('div');
    categoryResult.textContent = `${category}: ${correct} / ${total} (${percentage}%)`;
    categoryScores.appendChild(categoryResult);
  }
}

// Reiniciar quiz
restartQuizBtn.addEventListener('click', () => {
  formContainer.style.display = 'block';
  resultContainer.style.display = 'none';
  quizContainer.style.display = 'none';
});

// Limpar formulário
function clearForm() {
  document.getElementById('question').value = '';
  document.getElementById('option1').value = '';
  document.getElementById('option2').value = '';
  document.getElementById('option3').value = '';
  document.getElementById('option4').value = '';
  document.getElementById('correctOption').value = '';
  document.getElementById('category').value = '';
}
