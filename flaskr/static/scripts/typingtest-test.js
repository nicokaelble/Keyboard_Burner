/**This file contains the main java script for the typingtest
 * Some Code snippets (highlighting function and timer) are used from:
 * https://github.com/WebDevSimplified/JS-Speed-Typing-Game*/


//constants for elements used
const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const textDisplayElement = document.getElementById('quoteDisplay')
const authorDisplayElement = document.getElementById('authorDisplay')
const textInputElement = document.getElementById('textInput')
const timerElement = document.getElementById('timer')
const countdownElement = document.getElementById('countdownSound')
const mistakeCountElement = document.getElementById('mistakeDisplay')
const correctDiplayElement = document.getElementById('correctDisplay')
const speedDisplayElement = document.getElementById('speedDisplayLine')
const speedDisplayValue = document.getElementById('speedDisplayValue')
const btnStart = document.getElementById('btnStart')
const btnPause = document.getElementById('btnPause')
const btnPlay = document.getElementById('btnReset')
const btnContinue = document.getElementById('btnContinue')
const btnReset = document.getElementById('btnReset')

//sources for funny quotes:
//https://www.keepinspiring.me/funny-quotes/
//https://www.coolfunnyquotes.com/
const funnyQuotes = [
    ["Before you judge a man, walk a mile in his shoes. After that who cares?... He's a mile away and you've got his shoes!", "Billy Connolly"],
    ["People say nothing is impossible, but I do nothing every day", "A.A. Milne"],
    ["If I were two-faced, would I be wearing this one?", "Abraham Lincoln"],
    ["The best thing about the future is that it comes one day at a time.", "Abraham Lincoln"],
    ["The only mystery in life is why the kamikaze pilots wore helmets.", "Al McGuire"],
    ["Light travels faster than sound. This is why some people appear bright until you hear them speak.", "Alan Dundes"],
    ["Nobody realizes that some people expend tremendous energy merely to be normal.", "Albert Camus"],
    ["Men marry women with the hope they will never change. Women marry men with the hope they will change. Invariably they are both disappointed.", "Albert Einstein"],
    ["The difference between stupidity and genius is that genius has its limits.", "Albert Einstein"],
    ["All the things I really like to do are either immoral, illegal or fattening.", "Alexander Woollcott"],
    ["War is God's way of teaching Americans geography.", "Ambrose Bierce"],
    ["It would be nice to spend billions on schools and roads, but right now that money is desperately needed for political ads.", "Andy Borowitz"],
    ["A government that robs Peter to pay Paul can always depend on the support of Paul.", "Shaw Quotes"],
    ["It's just a job. Grass grows, birds fly, waves pound the sand. I beat people up.", "Muhammad Ali"],
    ["God did not intend religion to be an exercise club.", "Naguib Mahfouz"],
    ["Man has his will, but woman has her way.", "Oliver Wendell Holmes Sr."],
    ["Gravitation can not be held responsible for people falling in love.", "Albert Einstein"],
    ["A good speech should be like a woman's skirt: long enough to cover the subject and short enough to create interest.", "Winston Churchill"],
    ["I am so clever that sometimes I don't understand a single word of what I am saying.", " Oscar Wilde"],
    ["I'm such a good lover because I practice a lot on my own.", "Woody Allen"],
    ["There are two types of people: 1. Those who can extrapolate from incomplete data.", "A cup from etsy"]
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
    // ["",""],
]

//global varibales used:
var timerStartValue = parseInt(timerElement.innerText, 10) //set by settings or 60s per default
var timerTime // the current timer time
var currentTextLength // the length of the text that is currently displayed
var startTime // timestamp when the test started

var correctCharacterCounter = 0 // counts the correct Characters entered

var mistakesCounter = 0 // counts the mistakes made
var latestInputLenght = 0 // variable for the textlength in the input field
var latestInputCharacter //the last character that was entered
var intervallCountdown // intervall for the countdown
var intervallMeasureSpeed // intervall to measure typing speed
var count = 3 // start value for the countdown (3...2...1...)

//render new Quote when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    latesInputLenght = 0;
    renderNewText();
});

//render a new text in dependence of the test type
async function renderNewText() {
    /**
     * Test type:
     * value="1"       > selected funny quotes
     * value="2"       > Random words (not implemented yet)
     * value="3"       > Random characters
     * value="4"       > Random quotes
     */
    testType = document.getElementById('testType').innerHTML;

    textDisplayElement.innerHTML = "";

    //render funny quote
    if (testType == '1') {
        funnyQuote = getFunnyQuote()
        funnyQuoteString = funnyQuote[0];
        currentTextLength = funnyQuoteString.length;
        console.log("rendering funny quote:\nCurrentTextLength: " + currentTextLength + "\ncurrentCorrectCharacters: " + correctCharacterCounter)
        funnyQuoteString.split('').forEach(character => {
            const characterSpan = document.createElement('span')
            characterSpan.innerText = character
            textDisplayElement.appendChild(characterSpan)
        })
        authorDisplayElement.innerHTML = "~ " + funnyQuote[1];
        textInputElement.value = null;
    }
    //render random character
    if (testType == '3') {
        authorDisplayElement.innerText = "~ R. Andom";
        const randomString = generateRandomCharacters(65);
        currentTextLength = randomString.length;
        console.log("renderNewText() --> type 3 (random characters)\nCurrentTextLength: " + currentTextLength + "\ncurrentCorrectCharacters: " + correctCharacterCounter)
        randomString.split('').forEach(character => {
            const characterSpan = document.createElement('span')
            characterSpan.innerText = character
            textDisplayElement.appendChild(characterSpan)
        })
        textInputElement.value = null;
    }

    //render random words

    //render random quote
    if (testType == '4') {
        textDisplayElement.innerText = ""
        const quoteString = await getRandomQuote();
        var quoteList = quoteString.split("#")  //quoteString format <the quote>#<the autor>
        quote = quoteList[0];
        author = quoteList[1];
        currentTextLength = quote.length;
        console.log("renderNewText() --> type 4 (random quote)\nCurrentTextLength: " + currentTextLength + "\ncurrentCorrectCharacters: " + correctCharacterCounter)
        quote.split('').forEach(character => {
            const characterSpan = document.createElement('span')
            characterSpan.innerText = character
            textDisplayElement.appendChild(characterSpan)
        })
        authorDisplayElement.innerText = "~ " + author;
        textInputElement.value = null;
    }
}

/**
 * Procedure when the test is started
 * 1. disable textinput, hide start button and start countdown
 * 2. count down (3...2...1...GO)
 * 3. enable typing focus text input field
 * 4. start timer
 */

// 1. Disable textinput, hide start button and start countdown (3...2...1...GO)
function btnStart_Click() {
    //reset speed, mistakes, correct chars
    speedDisplayValue.innerHTML = "0"
    correctDiplayElement.innerHTML = "0"
    mistakeCountElement.innerHTML = "0"

    //show span for speed
    speedDisplayElement.removeAttribute('hidden')
    renderNewText();
    count = 3;
    ccorrectCharacterCounter = 0;
    correctCharacterCounter = 0;
    mistakesCounter = 0;
    mistakeCountElement.innerHTML = 0;

    //disable typing and clear input field
    textInputElement.value = "";
    textInputElement.readOnly = true;

    //disable Start button
    btnStart.disabled = true;

    //start Countdown
    intervallCountdown = setInterval(countdown, 1000);

    //start Countdown audio (a bit delayed to match visual countdown)
    setTimeout(function () {
        countdownElement.volume = 0.2;
        countdownElement.play();
    }, 200)

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
    textInputElement.readOnly = false;
    textInputElement.value = "";
    textInputElement.focus();

    //timestamp for the start time
    startTime = new Date()

    //start timer updatetes the timer value every sec
    intervallTimer = setInterval(startTimer, 998)

    //hide start button while test is running
    btnStart.hidden = true;

    //show pause and reset button
    btnPause.removeAttribute("hidden");
    btnReset.removeAttribute("hidden");
}

// 4. start timer
function startTimer() {
    timerTime = getTimerTime()
    if (timerTime < 0) {
        //timer over
        clearInterval(intervallTimer)
        testFinishedHandler()
    } else {
        timerElement.innerText = timerTime;
        
        //speed = character / timepassed in sec
        speed = (correctCharacterCounter / ((new Date() - startTime) / 1000)) * 60
        speed = Math.round(speed);
        speedDisplayValue.innerHTML = speed;
    }
}

//calculate timer time (exactly by comparing dates)
function getTimerTime() {
    //Timer current value = Timer start value - time passed
    timepassedInSec = (new Date() - startTime) / 1000;
    return Math.floor(timerStartValue - timepassedInSec);
}

//procedure when test is finished
function testFinishedHandler() {

    //display start button again
    btnStart.style.display = "block";

    //hide pause and reset button
    btnPause.hidden = true
    btnReset.hidden = true

    console.log("Testende >> correctCharacterCounter = " + correctCharacterCounter)

    //speed = characters per second * 60 = characters per minute
    speed = (correctCharacterCounter / timerStartValue) * 60
    speed = Math.round(speed);

    //accuracy in [%] --> make sure not to dived by 0
    if (correctCharacterCounter == 0) {
        accuracy = correctCharacterCounter.toFixed(2); // 0,00 %
    }
    else {
        accuracy = (100 - ((mistakesCounter / correctCharacterCounter) * 100)).toFixed(2);
    }
    speedDisplayValue.innerHTML = "0"
    correctDiplayElement.innerHTML = "0"
    mistakeCountElement.innerHTML = "0"
    speedDisplayElement.hidden = true

    //fill hiden input elements with test result values
    document.getElementById('speed').value = speed;
    document.getElementById('correctCharacters').value = correctCharacterCounter;
    document.getElementById('mistakes').value = mistakesCounter;
    document.getElementById('testDuration').value = timerStartValue;
    document.getElementById('accuracy').value = accuracy;
    document.getElementById('testResult').submit();
}




// handle text Input (highlighting and mistake counting)
textInputElement.addEventListener('input', () => {

    const arrayQuote = textDisplayElement.querySelectorAll('span')
    const arrayTextInput = textInputElement.value.split('')

    //check if mistake were made if something was entered
    if (arrayTextInput.length > 0) {
        currentInputLength = arrayTextInput.length
        //check for mistake --> mistake if last entered charcter isn't the same as the character at the matching index of quote
        currentInputCharacter = arrayTextInput[currentInputLength - 1]
        if (currentInputLength > arrayQuote.length) {
            //force mistake
            matchingQuoteCharacter = "definetlyNotAChar"
        } else {
            matchingQuoteCharacter = arrayQuote[currentInputLength - 1].innerHTML;
        }

        // if mistake --> increase mistake counter
        // probelem: if there were more than 1 mistake in a row and you click backspace it counts too... 
        // even if no new character was added
        // solution --> only check for mistake if new character is added (outer if condition)
        if (latestInputLenght < currentInputLength) {
            //Character was added
            if (currentInputCharacter != matchingQuoteCharacter) {
                //mistake was made
                mistakesCounter++;
                mistakeCountElement.innerHTML = mistakesCounter
            } else {
                //character was correct
                correctCharacterCounter += 1
                //console.log("added right: " + (correctCharacterCounter-1) + " --> " + correctCharacterCounter)
            }
        }

        //character got removed  
        if (latestInputLenght > currentInputLength) {
            //check if removed character was right
            if (latestInputCharacter == arrayQuote[currentInputLength].innerHTML) {
                //was right
                correctCharacterCounter -= 1
                //console.log("removed right: " + (correctCharacterCounter+1) + " --> " + correctCharacterCounter)
            }
        }

        correctDiplayElement.innerHTML = correctCharacterCounter;

        latestInputCharacter = currentInputCharacter
        latestInputLenght = currentInputLength
    }else{
        correctDiplayElement.innerHTML = "0";
    }



    //highlight character spans
    let correct = true
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayTextInput[index]

        if (character == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        } else if (character === characterSpan.innerText) {
            //correct character
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')

        } else {
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')

            correct = false
        }
    })

    //render new Text if everthing is correct
    if (correct) {
        renderNewText()
    }
})

//handle pause button click
function btnPause_Click() {

    //disable typitext.readOnly = true;
    clearInterval(intervallTimer);

    //hide pause button and show continue button
    btnPause.hidden = true;
    btnContinue.removeAttribute("hidden");
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
    mistakeCountElement.innerHTML = mistakesCounter;
    timerElement.innerText = timerStartValue;

    //show start button
    btnStart.removeAttribute("hidden");
    btnStart.disabled = false;


    //hide pause and reset button
    btnPause.hidden = true;
    btnReset.hidden = true;
    btnContinue.hidden = true;

    //hide speed
    speedDisplayValue.innerHTML = "0"
    correctDiplayElement.innerHTML = "0"
    mistakeCountElement.innerHTML = "0"
    speedDisplayElement.hidden = true
}

//handle continue button click
function btnContinue_Click() {

    //enable typing
    textInputElement.readOnly = false
    textInputElement.focus();

    //timestamp of the start of the typing test because intervall isn't exact
    startTime = new Date()

    //start timer again
    intervallTimer = setInterval(startTimer, 1000)

    //show pause button and hide continue button
    btnContinue.hidden = true;
    btnPause.removeAttribute("hidden");
}


//function that gets a random quote from http://api.quotable.io/random
function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content + "#" + data.author)
}

function generateRandomCharacters(length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    insertSpace = getRandomArbitrary(3, 9);

    for (var i = 0; i < length; i++) {
        if (insertSpace > 0) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            insertSpace--;
        } else {
            result += " ";
            insertSpace = getRandomArbitrary(3, 9);
        }
    }
    return result;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getFunnyQuote() {
    return funnyQuotes[Math.floor((Math.random() * funnyQuotes.length))]; //return ["Quote","Author"]
}


function getCurrentSpeed() {
    // speed = character / passed time * 60
    speed = (getCurrentCorrectCharacters() / (timerStartValue - timerTime)) * 60
    speed = Math.round(speed);
    return speed;
}

function getCurrentCorrectCharacters() {
    return correctCharacters + getCurrentCorrectCharacters();
}

//function that counts incorrect characters in input field
function getIncorrectCharacters() {
    //the quote displayed when timer runs out ("unfinished quote")
    const unfinishedQuoteArray = textDisplayElement.querySelectorAll('span')
    var incorrectCharacters = 0;
    //counting all correct characters
    unfinishedQuoteArray.forEach((characterSpan, index) => {
        if (characterSpan.classList.contains('incorrect')) {
            incorrectCharacters++;
        }
    })
    return incorrectCharacters;
}


// using jQuery to catch the event that is fired when modal is closing
$('#modalDialog').on('hidden.bs.modal', function () {
    console.log("Modal closed")
    //refresh page without POST request
    window.top.location = window.top.location
})