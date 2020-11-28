 //function that gets a random quote from http://api.quotable.io/random
 function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content + "#" + data.author)
}

//function that renders the new text to display
async function renderNewText() {
    quoteDisplayElement.innerHTML = "";

    testType = document.getElementById('testType').innerHTML;

    console.log("testType = " + testType)
    // Type:
    // value="1"       > selected funny quotes
    // value="2"       > Random words
    // value="3"       > Random characters 
    // value="4"       > Random quotes

    if(testType == '1'){
        funnyQuote = getFunnyQuote()

        authorDisplayElement.innerHTML = "~ " + funnyQuote[1];

        funnyQuoteString = funnyQuote[0];

        funnyQuoteString.split('').forEach(character => {
            const characterSpan = document.createElement('span')
            characterSpan.innerText = character
            quoteDisplayElement.appendChild(characterSpan)
        })
        quoteInputElement.value = null;

    }

    if (testType == '3') {
        authorDisplayElement.innerText = "~ R. Andom";

        const randomString = generateRandomCharacters(65);

        randomString.split('').forEach(character => {
            const characterSpan = document.createElement('span')
            characterSpan.innerText = character
            quoteDisplayElement.appendChild(characterSpan)
        })
        quoteInputElement.value = null;
    }

    //render random quote
    if (testType == '4') {
        quoteDisplayElement.innerText = ""
        const quoteString = await getRandomQuote();

        //quoteString format <the quote>#<the autor>
        var quoteList = quoteString.split("#")
        quote = quoteList[0];
        author = quoteList[1];
        currentTextLength = quote.length;

        quote.split('').forEach(character => {
            const characterSpan = document.createElement('span')
            characterSpan.innerText = character
            quoteDisplayElement.appendChild(characterSpan)
        })
        authorDisplayElement.innerText = "~ " + author;
        quoteInputElement.value = null;
    }

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
    // console.log("Random String: " + result)

    return result;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getFunnyQuote(){
    //sourcces:
    //https://www.keepinspiring.me/funny-quotes/
    //https://www.coolfunnyquotes.com/
    const funnyQuotes = [
        ["Before you judge a man, walk a mile in his shoes. After that who cares?... He’s a mile away and you’ve got his shoes!","Billy Connolly"],
        ["People say nothing is impossible, but I do nothing every day","A.A. Milne"],
        ["If I were two-faced, would I be wearing this one?","Abraham Lincoln"],
        ["The best thing about the future is that it comes one day at a time.","Abraham Lincoln"],
        ["The only mystery in life is why the kamikaze pilots wore helmets.","Al McGuire"],
        ["Light travels faster than sound. This is why some people appear bright until you hear them speak.","Alan Dundes"],
        ["Nobody realizes that some people expend tremendous energy merely to be normal.","Albert Camus"],
        ["Men marry women with the hope they will never change. Women marry men with the hope they will change. Invariably they are both disappointed.","Albert Einstein"],
        ["The difference between stupidity and genius is that genius has its limits.","Albert Einstein"],
        ["All the things I really like to do are either immoral, illegal or fattening.","Alexander Woollcott"],
        ["War is God’s way of teaching Americans geography.","Ambrose Bierce"],
        ["It would be nice to spend billions on schools and roads, but right now that money is desperately needed for political ads.","Andy Borowitz"],
        ["A government that robs Peter to pay Paul can always depend on the support of Paul.","Shaw Quotes"],
        ["It’s just a job. Grass grows, birds fly, waves pound the sand. I beat people up.","Muhammad Ali"],
        ["God did not intend religion to be an exercise club.","Naguib Mahfouz"],
        ["Man has his will, but woman has her way.","Oliver Wendell Holmes Sr."],
        ["Gravitation can not be held responsible for people falling in love.","Albert Einstein"],
        ["A good speech should be like a woman's skirt: long enough to cover the subject and short enough to create interest.","Winston Churchill"],
        ["I am so clever that sometimes I don’t understand a single word of what I am saying."," Oscar Wilde"],
        ["I’m such a good lover because I practice a lot on my own.","Woody Allen"]

    ]
    return funnyQuotes[Math.floor((Math.random()*funnyQuotes.length))]; //return ["Quote","Author"]
}