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

//Variable for currently displayed quote length (set by renderNewText())
var currentTextLength = 0

//Variable for counting typing mistakes
var mistakesCounter = 0;

//the current timer time
var timerTime = timerStartValue;

//the length of the input quote bevor it changend on new input
var latestInputLenght = 0;

//event listener that calles a function after dom is loaded
document.addEventListener("DOMContentLoaded", function () {
  timerStartValue = parseInt(timerElement.innerText, 10)
  count = 3;
  characterCount = 0;
  currentTextLength = 0;
  mistakesCounter = 0;
  //after everything is set render new quote
  renderNewText();
});


// the following functions handle the start of a typing test if start button is clicked
// 1. disable textinput, hide start button and start countdown 
// 2. count down (3...2...1...GO)
// 3. enable typing
// 4. start timer

// 1. Disable textinput, hide start button and start countdown (3...2...1...GO)
function btnStart_Click() {
  renderNewText();

  count = 3;
  characterCount = 0;
  currentTextLength = 0;
  mistakesCounter = 0;

  //disable typing and clear input fielde
  quoteInputElement.value = "";
  quoteInputElement.readOnly = true;

  document.getElementById('btnStart').disabled = true;

  //start Countdown
  intervallCountdown = setInterval(countdown, 1000);


   //start Countdown audio (a bit delayed to match timer countdown better)
   setTimeout(function(){
    countdownElement.volume = 0.2;
    countdownElement.play();
   },200)
 
}

// 2. Count down from 3 (3...2...1...)
function countdown() {
  if (count < 1) {
    clearInterval(intervallCountdown);
    timerElement.innerText = timerStartValue - 1;
    enableTyping()

  } else {
    timerElement.innerText = "" + count;
    count += -1;
  }
}

// 3. Enable typing
function enableTyping() {

  //enable typing
  quoteInputElement.readOnly = false;
  quoteInputElement.value = "";
  quoteInputElement.focus();

  //timestamp of the start of the typing test because intervall isn't exact
  startTime = new Date()

  //start timer updatetes the timer value every sec
  intervallTimer = setInterval(startTimer, 1000)

  //hide start button while test is running
  document.getElementById('btnStart').hidden = true;

  //show pause and reset button
  document.getElementById('btnPause').removeAttribute("hidden");
  document.getElementById('btnReset').removeAttribute("hidden");
}
// 4. start timer
function startTimer() {
  timerTime = getTimerTime()
  // console.log(timerTime)
  if (timerTime < 0) {
    //timer over handle test end
    clearInterval(intervallTimer)
    testFinishedHandler()
  } else {
    timerElement.innerText = timerTime;
  }
}

//function that retruns the timer time (exactly by comparing dates)
function getTimerTime() {
  //Timer current value = Timer start value - timepassed
  timepassedInSec = (new Date() - startTime) / 1000;
  return Math.floor(timerStartValue - timepassedInSec);
}

//handle test finished
function testFinishedHandler() {

  //hide pause and reset button ()
  document.getElementById('btnStart').style.display = "block";

  //show pause and reset button
  document.getElementById('btnPause').hidden = true;
  document.getElementById('btnReset').hidden = true;
  //show start button

  //add correct# entered characters (span class="correct") and add to character count
  characterCount += getCorrectCharacters()

  //speed = characters per second * 60 = characters per minute
  speed = (characterCount / timerStartValue) * 60
  speed = Math.round(speed);

  //accuracy in [%] --> make sure not to dived by 0
  if (characterCount == 0) {
    accuracy = characterCount.toFixed(2); // 0,00 %
  }
  else {
    accuracy = (100 - ((mistakesCounter / characterCount) * 100)).toFixed(2);
  }

  //fill hiden input elements with test result values
  document.getElementById('speed').value = speed;
  document.getElementById('correctCharacters').value = characterCount;
  document.getElementById('mistakes').value = mistakesCounter;
  document.getElementById('testDuration').value = timerStartValue;
  document.getElementById('accuracy').value = accuracy;

  document.getElementById('testResult').submit();

}

//function that counts correct characters in input field
function getCorrectCharacters() {
  //the unfinished quote displayed when timer runs out ("unfinished quote")
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

//function that counts incorrect characters in input field
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

//handle input event on quote inupu field
quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  //check if mistake were made if something was entered
  if (arrayValue.length > 0) {
    currentInputLength = arrayValue.length

    //check for mistake --> mistake if last entered charcter isn't the same as the character at the matching index of quote
    latestInputCharacter = arrayValue[currentInputLength - 1]
    matchingQuoteCharacter = arrayQuote[currentInputLength - 1].innerHTML;

    //if mistake --> increase mistake counter
    //probelem: if there were more than 1 mistake in a row and you click backspace it counts too... even if no new character was added
    //--> only check for mistake if new character is added (outer if condition)
    if (latestInputLenght < currentInputLength) {
      //Character was added
      if (latestInputCharacter != matchingQuoteCharacter) {
        //typing mistake was made
        mistakesCounter++;
        //console.log("mistakes:" + mistakesCounter)
      }
    }
    latestInputLenght = currentInputLength;
  }

  //mark correct (green) and incorrect (red) characters by adding and removing style classes 
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
  //handle quote is correctly entered
  if (correct) {
    // add the length of the entered quote to character count
    characterCount = characterCount + currentTextLength;
    // console.log("Character count after quote correct: " + characterCount);
    renderNewText()
  }
})



//handle pause button click
function btnPause_Click() {

  //disable typing
  quoteInputElement.readOnly = true;
  clearInterval(intervallTimer);

  //hide pause button and show continue button
  document.getElementById('btnPause').hidden = true;
  document.getElementById('btnContinue').removeAttribute("hidden");
}

//handle reset button click
function btnReset_Click() {
  
  //stop timer countdown
  clearInterval(intervallTimer);

  //reset count variables
  console.log("reset")
  count = 3;
  characterCount = 0;
  currentTextLength = 0;
  mistakesCounter = 0;
  timerElement.innerText = timerStartValue;

  //show start button
  document.getElementById('btnStart').removeAttribute("hidden");
  document.getElementById('btnStart').disabled = false;
  

  //hide pause and reset button
  document.getElementById('btnPause').hidden = true;
  document.getElementById('btnReset').hidden = true;
  document.getElementById('btnContinue').hidden = true;
}

//handle continue button click
function btnContinue_Click() {
  //enable typing
  quoteInputElement.readOnly = false;
  quoteInputElement.focus();

  //timestamp of the start of the typing test because intervall isn't exact
  startTime = new Date()

  //start timer again
  intervallTimer = setInterval(startTimer, 1000)

  //show pause button and hide continue button
  document.getElementById('btnContinue').hidden = true;
  document.getElementById('btnPause').removeAttribute("hidden");
}

// using jQuery to catch the event that is fired when modal is closing
$('#modalDialog').on('hidden.bs.modal', function () {
  console.log("Modal closed")
  //refresh page without POST request
  window.top.location = window.top.location
})