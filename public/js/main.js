const recognition = new webkitSpeechRecognition();

let text = "";

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";


$("#speak-btn").click(function () {
    text = "";
    $("#speak-btn").hide();
    $("#stop-btn").show();
    recognition.start();
});

$("#stop-btn").click(function () {
    $("#speak-btn").show();
    $("#stop-btn").hide();
    recognition.stop();
    startAnimation();
});

let words = [];
let index = 0;

function playNext() {
    if ($(".bttnPlaySiGMLURL").attr("disabled")) {
        console.log("waiting");
        return setTimeout(playNext, 1000);
    }
    playWord();
}

function hasNext() {
    return index < words.length;
}

function playWord() {
    console.log("playing word::", words[index])
    const link = "http://localhost:9000/public/SignFiles/" + words[index] + ".sigml";
    document.querySelector(".txtSiGMLURL.av1").value = link;
    $(".word").removeClass("playing-word");
    $("#word-"+words[index]).addClass("playing-word");
    $(".bttnPlaySiGMLURL").click();
    index++
    if (hasNext()) {
        return playNext();
    }
    console.log("done")
}

function setSignWordsToTag() {
    words.forEach(word => {
        $("#sign-text").append(`<span class="word" id="word-${word}">${word}</span>&nbsp;`)
    });
}

function setWords() {
    words = text.split(" ");
    console.log(words);
    index = 0;
}

function startAnimation() {
    if (text == "") return;
    setWords();
    setSignWordsToTag();
    playWord();
}

recognition.onresult = function (event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
    }
    $("#text").html(text);
    $("#sign-text").html("");
};