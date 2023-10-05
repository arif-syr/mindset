let interval;
let minutes = 0;
let seconds = 0;

$(document).ready(function() {
    $("#startBtn").click(function() {
        if (!interval) {
            interval = setInterval(updateTimer, 1000);
        }
    });

    $("#pauseBtn").click(function() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    });
});

function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        minutes++;
        seconds = 0;
    }
    let displayMinutes = (minutes < 10) ? '0' + minutes : minutes;
    let displaySeconds = (seconds < 10) ? '0' + seconds : seconds;
    $("#timer").text(displayMinutes + ':' + displaySeconds);
}
