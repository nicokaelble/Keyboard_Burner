//constants for elements used
const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const authorDisplayElement = document.getElementById('authorDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const countdownElement = document.getElementById('countdownSound')

// the time the test started
var startTime
// the timer startig value passed by the setting page (for example '60' [s])
var timerStartValue = parseInt(timerElement.innerText, 10)

//intervall for timer (60....59...58...     ....0 --> test finished)
var intervallTimer

//intervall for countdown (3...2...1...GO)
var intervallCountdown;

//start value for countdown (3...2...1...)
var count = 3

//character counter for measuring typing speed
var characterCount = 0

//Variable for currently displayed quote length (set by renderNewQuote())
var currentQuoteLength = 0

//Variable for counting how often the backspace or delet key was used during the typing test
var backspaceCounter = 0;

//event listener that calles a function after dom is loaded
document.addEventListener("DOMContentLoaded", function(){
  timerStartValue = parseInt(timerElement.innerText, 10)
  count = 3;
  characterCount = 0;
  currentQuoteLength = 0;
  backspaceCounter = 0;
  //after everything is set render new quote
  renderNewQuote();
});


// the following functions handle the start of a typing test if start button is clicked
// 1. disable textinput, disable start button and start countdown (3...2...1...GO)
// 2. count down from 3 
// 3. enable typing
// 4. start timer

// 1. Disable textinput, disable start button and start countdown (3...2...1...GO)
function btnStartTest_Click() {
  //disable typing and clear input fielde
  quoteInputElement.value = "";
  quoteInputElement.readOnly = true;

  //disable start button while test is running
  document.getElementById('btnStartTest').disabled = true;

  //start Countdown
  countdownElement.volume = 0.2;
  countdownElement.play();
  intervallCountdown = setInterval(countdown, 1000);
}

// 2. Count down from 3 (3...2...1...GO)
function countdown() {
  if (count < 1) {
    clearInterval(intervallCountdown);
    timerElement.innerText = "GO"
    enableTyping()

  } else {
    timerElement.innerText = "" + count;
    count += -1;
  }
}

// 3. Enable typing
function enableTyping() {
  //add event listener that counts how often backspace or delete was used
  document.addEventListener("keydown", KeyCheck);

  //enable typing
  quoteInputElement.readOnly = false;
  quoteInputElement.value = "";
  quoteInputElement.focus();

  //timestamp of the start of the typing test because intervall isn't exact
  startTime = new Date()

  //start timer updatetes the timer value every sec
  intervallTimer = setInterval(timer, 1000)
}

function timer() {
  timerTime = getTimerTime()
  if (timerTime == -1) {
    //timer over handle test end
    clearInterval(intervallTimer)
    testFinishedHandler()
  } else {
    timerElement.innerText = timerTime;
  }
}

function getTimerTime() {
  //Timer current value = Timer start value - timepassed
  timepassedInSec = (new Date() - startTime) / 1000;
  return Math.floor(timerStartValue - timepassedInSec);
}

//handle test finished


function testFinishedHandler() {

  //add correct# entered characters (span class="correct") and add to character count
  characterCount += getCorrectCharacters()

  //speed = characters per second * 60 = characters per minute
  var speed = (characterCount / timerStartValue) * 60

  // //accuracy = 100 - (use of backspaces / correctCharacters)*100 [%]
  accuracy = (100 - ((backspaceCounter / characterCount) * 100)).toFixed(2);

  // alert("Test finished!!!" + "\ntotalChorrectCharacters:" + characterCount + "\ncorrectCharacters: " + getCorrectCharacters() + "\nincorrectCharacters: "
  //   + getIncorrectCharacters() + "\nbackspaceCount: " + backspaceCounter + "\nTestduration: " + timerStartValue + "\nSpeed: " + speed + " characters/min" +
  //   "accuracy: " + accuracy)
  document.getElementById('speed').value = speed;
  document.getElementById('correctCharacters').value = characterCount;
  document.getElementById('backspaceCount').value = backspaceCounter;
  document.getElementById('testDuration').value = timerStartValue;
  document.getElementById('accuracy').value = accuracy;


  document.getElementById('testResult').submit();
  // setTimeout(function () {
    
  // }, 5000)


}

function btnTest_Click() {
  //Test correc/incorrect count:
  alert("correct: " + getCorrectCharacters() + "\nincorrect: " + getIncorrectCharacters());
}

function getCorrectCharacters() {
  //the quote displayed when timer runs out ("unfinished quote")
  const unfinishedQuoteArray = quoteDisplayElement.querySelectorAll('span')
  var correctCharacters = 0;
  //counting all correct characters
  unfinishedQuoteArray.forEach((characterSpan, index) => {
    if (characterSpan.classList.contains('correct')) {
      correctCharacters++;
    }
  })
  return correctCharacters;
}

function getIncorrectCharacters() {
  //the quote displayed when timer runs out ("unfinished quote")
  const unfinishedQuoteArray = quoteDisplayElement.querySelectorAll('span')
  var incorrectCharacters = 0;
  //counting all correct characters
  unfinishedQuoteArray.forEach((characterSpan, index) => {
    if (characterSpan.classList.contains('incorrect')) {
      incorrectCharacters++;
    }
  })
  return incorrectCharacters;
}

//eventhandler on quoteInputElement that counts how often the backspace or delete key was used
function KeyCheck(event) {
  const key = event.key; // const {key} = event; ES6+
  if (key === "Backspace" || key === "Delete") {
    backspaceCounter++;
  }
}

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  let correct = true
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }
  })

  if (correct) {
    // add the length of the entered quote to character count
    characterCount = characterCount + currentQuoteLength;
    console.log("Character count after quote correct: " + characterCount);
    renderNewQuote()
  }
})

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content + "#" + data.author)
}


async function renderNewQuote() {
  quoteDisplayElement.innerText = ""
  const quoteString = await getRandomQuote();
  //quoteString format <the quote>#<the autor>
  var quoteList = quoteString.split("#")


  quote = quoteList[0];
  author = quoteList[1];
  currentQuoteLength = quote.length;

  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })
  authorDisplayElement.innerText = "~ " + author;
  quoteInputElement.value = null;
}







