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
    if($("#role").val()=="translator")
        getTranslatedtext();
    else{
        getResponsortext();
    }
});

function getResponse(url){
    $.get(url, function (resp) {
        text = resp.pre_process_string;
        startAnimation();
    });
}

function getResponsortext(){
    getResponse("http://localhost:9000/responsor?speech=" + text);
}

function getTranslatedtext() {
    getResponse("http://localhost:9000/parser?speech=" + text);
}

let words = [];
let index = 0;

function playNextWord() {
    if ($(".bttnPlaySiGMLURL").attr("disabled")) {
        console.log("waiting");
        return setTimeout(playNextWord, 1000);
    }
    playWord();
}

function hasNext() {
    return index < words.length;
}

function setWordBg(){
    $(".word").removeClass("playing-word");
    $("#word-"+words[index]).addClass("playing-word");
}

function playWord() {
    console.log("playing word::", words[index])
    setWordBg();
    const link = "http://localhost:9000/public/SignFiles/" + words[index] + ".sigml";
    document.querySelector(".txtSiGMLURL.av1").value = link;
    $(".bttnPlaySiGMLURL").click();
    index++;
    if (hasNext()) {
        return playNextWord();
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