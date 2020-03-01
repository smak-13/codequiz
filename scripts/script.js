console.log( "mainscript- testing");

//set local elements/vairables
var contentArea = $("#content");
var timerCount = $("#timerCount");
var responseArea = $("#responseArea");

const numQuestions = questions.length;
const startTime = numQuestions * 15;
const wrongResponse = 15;
var timeLeft = startTime;

//used to randomize the questions
var remainingQuestions = [];

var countdown;

function init(){
    resetGame();
}

function resetGame(){
     contentArea.empty();
     timerCount.text(timeLeft);

//Instruction Screen
     let newP = $("<p>");
    newP.text("Welcome to the code quiz, you have "+startTime+" seconds to answer "+numQuestions+" questions. Your final score is based on your remaining time left. For each incorrect answer you will lose 15 seconds off the timer. Click the button below to get started. Good luck!");   
    contentArea.append(newP);

    //
    let startButton = $("<button>")
    .text("Get Started!")
    .attr("id","getStarted")
    .on("click",function(){
        //reset the question array and randomize it
        remainingQuestions = randomizeArr(questions);       
        startGame();
        
    });;    

    contentArea.append($('<div>').addClass("center").append(startButton));
}

function startGame(){
    countdown = setInterval(function(){
        timeLeft--;
        updateTimerText();

    },1000);
    loadNextQuestion();
}

function updateTimerText(){
    
    timerCount.text(timeLeft);

    if(timeLeft === 0){
        clearInterval(countdown);
        endGame();
    }else if(timeLeft < 6){
        timerCount.addClass("timeLow");
    }
}
//randomizes the given array leaving the inital array untouched
function randomizeArr(arr){
    
    let oldArr = arr.slice(0);
    let newArr = [];

    for(var i = 0; i < arr.length; i++){            
        newArr.push(oldArr.splice(Math.floor(Math.random()*oldArr.length),1)[0]);        
    }
    return newArr;
}

function loadNextQuestion(){
    //see if we have any questions left
    if(remainingQuestions.length > 0){
        contentArea.empty();           
       
        let currentQuestion = remainingQuestions.pop();  
        let questionTitleLabel = $("<label>").text(currentQuestion.title);
        let questionChoicesList = $("<div>");        

    //randomize the order of the buttons (no cheating!)
    randomizeArr(currentQuestion.choices).forEach(element => {
            
            let questionChoice = $("<button>")
            .text(element)
            .addClass("responseBtn")
            .on("click", function(){checkChoice(element,currentQuestion.answer)});
            questionChoicesList.append(questionChoice);
            
        });
        
        contentArea.append(questionTitleLabel).append(questionChoicesList);
      
    }else{ //otherwise end the game
        clearInterval(countdown);
        updateTimerText();
        endGame();
    }
}

function checkChoice(response, answer){
    
    if(response === answer){
        responseArea.html("<hr>Correct!");
        
    }else{
        responseArea.html("<hr>Wrong!");
        timeLeft -= wrongResponse; //remove points for wrong answer
        //prevents skipping past 0 timer.

        if(timeLeft <= 0){
            timeLeft = 0;
            updateTimerText();            
        }
    }
    fadeResponseArea();
    loadNextQuestion();
}
//removes the answer response area after a delay
async function fadeResponseArea(){
    setTimeout(function(){
        responseArea.empty();
    },1000)
}

function endGame(){
    contentArea.empty();
 
    let score = timeLeft >= 0?timeLeft:0;

    //constuct our html
    let newP = $("<p>").html("Game Over!<br>Your final score is: "+ score + "<br>Please enter your name");
    let nameInput = $("<input>").attr("type","text");
    let submitBtn = $("<button>")
    .text("submit")
    .attr("id","submitName")
    .on("click", function(){
        setHighScores(nameInput.val(), score)
    });   
    
    contentArea.append(newP)
                .append(nameInput)
                .append(submitBtn); 
       
}
//adds new score to the list
function setHighScores(name, score){
    let currentScores = JSON.parse(localStorage.getItem("highScores"));
    
    if(currentScores === null || currentScores == ""){
        currentScores = [];
    }
    
    currentScores.push({
        playerName: name,
        playerScore: score
    });
    localStorage.setItem("highScores",JSON.stringify(currentScores));
    open("/Users/sophornmak/Desktop/bootcamp/github/quizcode/highscore.html", "_parent"); 
}
init();

