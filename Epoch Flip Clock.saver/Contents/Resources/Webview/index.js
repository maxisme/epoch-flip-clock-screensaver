'use strict';

var digits = [];

function getEpoch() {
    return Date.now().toString().slice(0, -3);
}

function createDigit() {
    var digit = document.createElement('digit');
    digit.innerHTML = '\
    <flap-top>          <n></n>   </flap-top>\
    <flap-top-flip>     <n></n>   </flap-top-flip>\
    <flap-bottom>       <n></n>   </flap-bottom>\
    <flap-bottom-flip>  <n></n>   </flap-bottom-flip>';
    return digit;
}

function flipDigitTo(digit, currentVal, updatedVal) {
    var topFlapNum = digit.querySelector('flap-top > n'),
    topFlapFlip = digit.querySelector('flap-top-flip'),
    topFlapFlipNum = topFlapFlip.querySelector('n'),
    bottomFlapNum = digit.querySelector('flap-bottom > n'),
    bottomFlapFlip = digit.querySelector('flap-bottom-flip'),
    bottomFlapFlipNum = bottomFlapFlip.querySelector('n');

    topFlapNum.innerHTML = updatedVal;
    bottomFlapNum.innerHTML = currentVal;

    topFlapFlipNum.innerHTML = currentVal;
    topFlapFlip.style.display = 'block';

    setTimeout(function() {
               topFlapFlip.style.display = 'none';
               }, 300);

    setTimeout(function() {
               bottomFlapFlipNum.innerHTML = updatedVal;
               bottomFlapFlip.style.display = 'block';
               }, 300);

    setTimeout(function() {
               bottomFlapNum.innerHTML = updatedVal;
               bottomFlapFlip.style.display = 'none';
               }, 450);

    digit.setAttribute('current-val', updatedVal);
}

function updateClock() {
    var epoch = getEpoch(),
    staggerDelay,
    currentVal,
    updatedVal,
    i;

    for (i = 0; i < epoch.length; i += 1) {
        if (i === epoch.length - 1) {
            staggerDelay = 0;
        } else {
            staggerDelay = Math.random() * 400;
        }
        currentVal = digits[i].getAttribute('current-val');
        updatedVal = epoch[i];
        if (currentVal !== updatedVal) {
            setTimeout(flipDigitTo, staggerDelay, digits[i], currentVal, updatedVal);
        }
    }
    writeReadableDate();
}

function writeReadableDate() {
    var query = getQueryParams(document.location.search);
    if(query.rt == "0"){
        var now = new Date();
        var d = now.getDate();
        var M = now.getMonth();
        var y = now.getFullYear();
        var h = now.getHours();
        var m = now.getMinutes();
        var s = now.getSeconds();
        if (h < 10){ h = "0"+h; }
        if (m < 10){ m = "0"+m; }
        if (s < 10){ s = "0"+s; }
        var str = d + "/" + M + "/" + y + " " + h + ":" + m + ":" + s;
        
        document.getElementById('realtime').innerHTML = str;
    }
}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');
    
    var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;
    
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    
    return params;
}

function setupClock() {
    var epoch = getEpoch(),
    staggerDelay,
    digit,
    i;

    for (i = 0; i < epoch.length; i += 1) {
        digit = createDigit();
        staggerDelay = Math.random() * 400;
        document.body.appendChild(digit);
        setTimeout(flipDigitTo, staggerDelay, digit, null, epoch[i]);
    }
    digits = document.querySelectorAll('digit');

    // real time
    writeReadableDate();
}

//function toggleRealTime(){
//    var x = document.getElementById("realtime");
//    if (x.style.display === "none") {
//        x.style.display = "block";
//    } else {
//        x.style.display = "none";
//    }
//}

setupClock();
setInterval(updateClock, 1000);
