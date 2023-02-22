var seconds = document.querySelector("#time");
var answerText = "";
var time = 60;
var timeLimit;
var choicesEl = document.querySelector("#choices");
var startBTN = document.querySelector("#start-quiz");
var questionDiv = document.querySelector("#questionBlock");
var answerDiv = document.querySelector("#answerResult");
var endGameDiv = document.querySelector("#endGameBlock");
// var optionButtons = [
//   document.querySelector("#quizOption1"),
//   document.querySelector("#quizOption2"),
//   document.querySelector("#quizOption3"),
//   document.querySelector("#quizOption4"),
// ];
var playerInitials = document.querySelector("#playerInitials");
var questionNum = 0;
playerInitials.value = "";

if (localStorage.getItem("localHighScores")) {
  scoresArray = JSON.parse(localStorage.getItem("localHighScores"));
} else {
  scoresArray = [];
}


function startQuiz() {
  //hide start screen
  var titleScreen = document.querySelector("#titleScreen")
  titleScreen.setAttribute("class", "hide")
  //unhide questions
  questionDiv.removeAttribute("class")
  //start timer
  timeLimit = setInterval(countDown, 1000)
  //show time
  seconds.textContent = time
  //get question
  changeQuestion()
}

function countDown() {
  time--
  seconds.textContent = time
  if (time <= 0) {
    showEndGame()
  }
}


function changeQuestion() {
  var questionInfo = questions[questionNum];
  var questionTitle = document.querySelector("#questionPrompt");
  questionTitle.textContent = questionInfo.title;
  choicesEl.innerHTML = "";

// Else it writes the information into the next question...
  for (var i = 0; i < questionInfo.choices.length; i++) {
  var choice = questionInfo.choices[i];
  var button = document.createElement("button");
  button.setAttribute("class", "choice");
  button.setAttribute("value", choice);
  button.textContent = i + 1 + ". " + choice;
  choicesEl.appendChild(button);
  }
}


// checks user input and compares it with the answer on file
function checkAnswer(event) {
  //user clicks
  var button = event.target;
  if (!button.matches(".choice")) {
    return
  }
  //check if it's right or wrong
  if (button.value !== questions[questionNum].answer) {
    time -= 10
    if (time < 0) {
      time = 0
    }
    seconds.textContent = time
    answerDiv.textContent = "Wrong!"
  }
  else {
    answerDiv.textContent = "Correct!"
  }
  //give feedback
 answerDiv.removeAttribute("class")
  setTimeout(function(){
    answerDiv.setAttribute("class", "hide")
  },1000)
  //move to next question
  questionNum ++
  //check time or out of questions
  if (time<=0 || questionNum === questions.length) {
    showEndGame()
  }
  else {
    changeQuestion()
  }
  //get the next question
}


function showEndGame() {
  // Rewrites the remaining time if the final question is incorrect 
  document.querySelector(".navbar-text").textContent = "Time: " + time;

  // Writes the final score to showScore section
  if (time != 0) {
    document.querySelector("#showScore").textContent = time;
  } else {
    document.querySelector("#showScore").textContent = "0";
  }
  clearInterval(timeLimit);
  questionDiv.style = "display: none;";
  answerDiv.style = "display: none;";
  endGameDiv.style = "display: block;";
}


function submitAndSaveScore(event) {
  event.preventDefault();
  if (playerInitials.value.trim() == "") {
    if (alertBoxDiv.style != "display:flex;") {
      alertBoxDiv.style = "display:flex;";

      setTimeout(function () {
        alertBoxDiv.style = "display: none;";
      }, 1000);
    }
    return;
  } else {
    var newHighScore = {
      initials: playerInitials.value.toUpperCase().trim(),
      score: time,
    };
    scoresArray.push(newHighScore);
    scoresArray.sort(function (a, b) {
      return b.score - a.score;
    });
    localStorage.setItem("localHighScores", JSON.stringify(scoresArray));
    window.location.href = "./highscores.html";
  }
}
document.addEventListener("click", checkAnswer);
document.querySelector("#submitButton").onclick = submitAndSaveScore;
startBTN.onclick = startQuiz;
