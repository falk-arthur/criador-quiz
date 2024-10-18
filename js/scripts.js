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
const questionsPreview = document.getElementById('questionsPreview'); // Contêiner para prévia das perguntas

// Variáveis globais
let questions = JSON.parse(localStorage.getItem('questions')) || [];
let currentQuestionIndex = 0;
let score = {};
let shuffledQuestions = [];
let userAnswers = []; // Armazenar respostas do usuário

// Adicionar pergunta
document.getElementById('addQuestionBtn').addEventListener('click', () => {
    const questionText = document.getElementById('question').value;
    const options = [
        document.getElementById('option1').value,
        document.getElementById('option2').value,
        document.getElementById('option3').value,
        document.getElementById('option4').value,
        document.getElementById('option5').value, // Captura a 5ª opção
    ];
    const correctOption = parseInt(document.getElementById('correctOption').value) - 1; // Ajusta para índice zero
    const category = document.getElementById('category').value;

    // Validação: Verificar se o número da alternativa correta está entre 1 e 5
    if (isNaN(correctOption) || correctOption < 0 || correctOption > 4) {
        alert('Por favor, insira um número válido entre 1 e 5 para a alternativa correta.');
        return;
    }

    if (questionText && options.every(opt => opt) && category) {
        questions.push({ question: questionText, options, correctOption, category });
        localStorage.setItem('questions', JSON.stringify(questions));
        alert('Pergunta adicionada com sucesso!');
        clearForm();
        updateQuestionsPreview(); // Atualiza a prévia após adicionar uma pergunta
    } else {
        alert('Preencha todos os campos corretamente.');
    }
});

// Atualiza a prévia das perguntas
function updateQuestionsPreview() {
    questionsPreview.innerHTML = ''; // Limpa a prévia
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.style.marginBottom = '10px';
        
        const questionText = document.createElement('p');
        questionText.textContent = `${q.question} (Categoria: ${q.category})`;
        questionDiv.appendChild(questionText);
        
        const optionsList = document.createElement('ul');
        q.options.forEach((opt, i) => {
            const li = document.createElement('li');
            li.textContent = `${i + 1}. ${opt}`;
            optionsList.appendChild(li);
        });
        questionDiv.appendChild(optionsList);
        
        // Botões de editar e excluir
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => editQuestion(index);
        questionDiv.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.onclick = () => deleteQuestion(index);
        questionDiv.appendChild(deleteBtn);
        
        questionsPreview.appendChild(questionDiv);
    });
}

// Editar pergunta
function editQuestion(index) {
    const q = questions[index];
    document.getElementById('question').value = q.question;
    document.getElementById('option1').value = q.options[0];
    document.getElementById('option2').value = q.options[1];
    document.getElementById('option3').value = q.options[2];
    document.getElementById('option4').value = q.options[3];
    document.getElementById('option5').value = q.options[4]; // Preenche a 5ª opção
    document.getElementById('correctOption').value = q.correctOption + 1; // Ajusta para 1-5
    document.getElementById('category').value = q.category;

    // Exclui a pergunta para que seja atualizada
    questions.splice(index, 1);
    localStorage.setItem('questions', JSON.stringify(questions));
    updateQuestionsPreview(); // Atualiza a prévia após a edição
}

// Excluir pergunta
function deleteQuestion(index) {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
        questions.splice(index, 1);
        localStorage.setItem('questions', JSON.stringify(questions));
        updateQuestionsPreview(); // Atualiza a prévia após a exclusão
    }
}

// Limpar perguntas
document.getElementById('clearQuestionsBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar todas as perguntas?')) {
        questions = [];
        localStorage.removeItem('questions');
        alert('Todas as perguntas foram removidas.');
        updateQuestionsPreview(); // Atualiza a prévia após limpar as perguntas
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
    userAnswers = [];
    formContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    nextQuestionBtn.click();
});

// Mostrar pergunta
function showQuestion(question) {
    quizCategory.textContent = `Categoria: ${question.category}`; // Exibe a categoria
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

    // Armazena a resposta do usuário
    userAnswers.push({
        question: question.question,
        options: question.options,
        selectedOption,
        correctOption: question.correctOption,
    });

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
    formContainer.style.display = 'none';
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    let totalCorrect = 0;
    Object.keys(score).forEach(category => {
        const { correct, total } = score[category];
        totalCorrect += correct;
        const p = document.createElement('p');
        p.textContent = `Categoria: ${category} - Correto: ${correct} de ${total}`;
        categoryScores.appendChild(p);
    });
    
    totalScore.textContent = `Total de Acertos: ${totalCorrect} de ${shuffledQuestions.length}`;
}

// Reiniciar quiz
restartQuizBtn.addEventListener('click', () => {
    resultContainer.style.display = 'none';
    formContainer.style.display = 'block';
    questions = JSON.parse(localStorage.getItem('questions')) || [];
    updateQuestionsPreview(); // Atualiza a prévia após reiniciar
});

// Limpar formulário
function clearForm() {
    document.getElementById('question').value = '';
    document.getElementById('option1').value = '';
    document.getElementById('option2').value = '';
    document.getElementById('option3').value = '';
    document.getElementById('option4').value = '';
    document.getElementById('option5').value = ''; // Limpa a 5ª opção
    document.getElementById('correctOption').value = '';
    document.getElementById('category').value = '';
}
