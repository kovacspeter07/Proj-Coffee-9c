// kvíz
const questions = [
  {
    question:
      "Milyen állat vezetett az etióp legenda szerint a kávé felfedezéséhez?",
    answers: [
      { text: "juh", correct: false },
      { text: "kecske", correct: true },
      { text: "tehén", correct: false },
    ]
  },
  {
    question: "Hányadik században mehettek az emberek először kávéházakba?",
    answers: [
      { text: "15. század", correct: true },
      { text: "16. század", correct: false },
      { text: "17. század", correct: false },
    ]
  },
  {
    question:
      "Melyik nem tartozik a meghatározóbb kávéfajok közé a kereskedelemben?",
    answers: [
      { text: "robusta", correct: false },
      { text: "arabica", correct: false },
      { text: "liberica", correct: true },
    ]
  },
  {
    question: "Hol nem elterjedt a Robusta bab termelése?",
    answers: [
      { text: "Európa", correct: true },
      { text: "Afrika", correct: false },
      { text: "Ázsia", correct: false },
    ]
  },
  {
    question: "Mi a különbség az Arabica és a Robusta kávébabok között?",
    answers: [
      { text: "az Arabica laposabb és kisebb", correct: false },
      { text: "a Robusta koffeintartalma magasabb", correct: false },
      { text: "a Robusta kerekebb", correct: true },
    ]
  },
  {
    question: "Mely vitamint tartalmazza a kávé?",
    answers: [
      { text: "B<sup>4</sup>", correct: false },
      { text: "B<sup>5</sup>", correct: true },
      { text: "C", correct: false },
    ]
  },
  {
    question: "Mely nem tartozik a kávé kockázatai közé?",
    answers: [
      { text: "szívbetegség", correct: true },
      { text: "szorongás", correct: false },
      { text: "mentális problémák kialakulása", correct: false },
    ]
  },
];
const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Következő";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButton.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButton.firstChild) {
    answerButton.removeChild(answerButton.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButton.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function showScore() {
  resetState();
  questionElement.innerHTML = `Az elért pontszámod ${score}.`;
  nextButton.innerHTML = "Próbáld újra!";
  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

startQuiz();
