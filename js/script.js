var sentenceEng,
    sentenceKor,
    audio = new Audio(''),
    audioPlayer,
    activeSentence,
    langTrans,
    hideTrans,
    dictationBtn,
    listeningBtn,
    dictationMode,
    goHomeBtn;

hideTrans = $('#hide-trans').hide();
goHomeBtn = $('#home-btn');

goHomeBtn.on('click', function() {
    document.location.href = '../index.html';
});

$('#audio-player').hide();
dictationBtn = $('#dict-btn');
dictationBtn.on('click', function() {
    dictationMode = true;
    listeningBtn.show();
    dictationBtn.hide();
    sentenceEng.hide();
    sentenceKor.show();
    langTrans.show();
    hideTrans.hide();
});

langTrans = $('#trans-lang-toggle');
langTrans.on('click', function() {
    langTrans.hide();
    hideTrans.show();
    if (dictationMode) {
        $('.active .eng').show();
        $('.active .kor').css('color', '#0000b3');
    } else {
        $('.active .kor').css('color', '#0000b3').show();

    }

    setTimeout(function() {

    });

});

hideTrans = $('#hide-trans');
hideTrans.on('click', function() {
   $(this).hide();
   langTrans.show();
    if (dictationMode) {
        $('.eng').css('color', '').hide();
        $('.kor').css('color', '');
    } else {
        $('.kor').css('color', '').hide();
    }
});

listeningBtn = $('#listen-btn').hide();
$(listeningBtn).on('click', function() {
    location.reload();
});

assignLanguage();
createDivForSentence();
$(sentenceKor).hide();

initMP3Data();

function assignLanguage() {
    sentenceEng = $('.main-text a:even').add('.dialog a:even');
    sentenceKor = sentenceEng.next();
    sentenceEng.addClass('eng');
    sentenceKor.addClass('kor');
}

function createDivForSentence() {
    $(sentenceEng).each(function() {
        matchingKor = $(this).next();
        $(this).add(matchingKor).wrapAll('<div class="sentence" />');
    });

    $('.dialog h4').wrap('<div class="sentence" />');
}

function initMP3Data() {
    $('#read .sentence').attr('data-mp3', function (i) {
        i++;
        var mp3_file;
        if (i <= 9) {
            mp3_file = '0' + i + '.mp3';
        } else {
            mp3_file = i + '.mp3';
        }
        return mp3_file
    });
};

$('div.sentence').on('click', function() {
    
    $('div.sentence').not(this).removeClass('active');
console.log($(this).children().first()[0].tagName == 'H5');
    if ($(this).children().first()[0].tagName == 'H5') {
        hideTrans.hide();
        langTrans.hide();
    } else {
        hideTrans.hide();
        langTrans.show();

       if (dictationMode) {
            $('.eng').css('color', '').hide();
            $('.kor').css('color', '');
       } else {
            $('.kor').css('color', '').hide();
       }

        $(this).addClass('active');
    }
    audioPlayer = $('#audio-player').show();
    $(audioPlayer).insertAfter(this);
    activeSentence = $(this);
    initPlayer();
});


function initPlayer() {

    lesson_id = $('#title-bar').attr('data-title');

    talk_id = activeSentence.attr('data-mp3');
    // console.log(talk_id);
    url = 'mp3/' + lesson_id + '/' + talk_id;

    // console.log(url);
    // console.log(audio.src);
    if (audio.paused || url != audio.src) {
        if (audio.canPlayType('audio/mp3')) {
            audio.src = url;
        }
        audioPlay();
    } else {
        audio.pause();
        // audio.currentTime = 0;
    }
}
//
$('#play').on('click', function () {
    audioPlay();
});

$('#pause').on('click', function () {
    audio.pause();
    $('#play').show();
    $('#pause').hide();
});

$('#volumebar').change(function () {
    audio.volume = parseFloat(this.value / 10);
});


audio.addEventListener('durationchange', initSeekbar, false);

seekbar = document.getElementById('seekbar');

function initSeekbar() {
    seekbar.min = 0;
    seekbar.step = 1 / audio.duration;
    seekbar.max = audio.duration;
}

$(seekbar).on('click', function() {
    audio.pause();
});


$(seekbar).change(function () {
    audio.currentTime = seekbar.value;
    setTimeout(1000);
    audioPlay()
});

$('#fast-forward').on('click', function() {
    $(this).addClass('hvr-wobble-horizontal');
    setTimeout(function(){
        $('#fast-forward').removeClass('hvr-wobble-horizontal');
    }, 1000);
//    audio.pause();
    audio.currentTime += 1;
});
$('#fast-backward').on('click', function() {
    $(this).addClass('hvr-wobble-horizontal');
    setTimeout(function(){
        $('#fast-backward').removeClass('hvr-wobble-horizontal');
    }, 1000);
//    audio.pause();
    audio.currentTime -= 2;
})


audio.addEventListener('timeupdate', updateTime, false);
//
function updateTime() {
    //Get duration hours & minutes
    var duration_s = parseInt(audio.duration % 60);
    var duration_m = parseInt(parseInt(audio.duration / 60) % 60);
    //Get Hours & Minutes
    var s = parseInt(audio.currentTime % 60);
    var m = parseInt(parseInt(audio.currentTime / 60) % 60);
    // Add 0 if less than 10
    if (duration_s < 10) {
        duration_s = '0' + duration_s;
    }
    if (s < 10) {
        s = '0' + s;
    }
    $('#elapsed').html(m + ':' + s + '/' + duration_m + ':' + duration_s);
    seekbar.min = audio.startTime;
    seekbar.value = audio.currentTime;

    if (audio.currentTime == audio.duration) {

        console.log(audio.currentTime = 0);
        audioInit();
        seekbar.value = 0;
    }
}
//
function audioPlay() {
    audio.play();
    $('#play').hide();
//    $('#elapsed').fadeIn(1000);
    $('#pause').show();
}
//
// function audioPause() {
//     audio.pause();
//     $('#play').show();
//     $('#pause').hide();
// }
// //
function audioInit() {
    $('#play').show();
    $('#pause').hide();
//    $('#elapsed').fadeOut(1000);
}
