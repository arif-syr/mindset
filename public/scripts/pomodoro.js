$(document).ready(function () {
  $("#navbar").load("/pages/navbar.html");
  $("#footer").load("/pages/footer.html");

  let timer;
  let timeLeft;
  let duration;

  const updateTimerDisplay = () => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    $('#timer').text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  let isRunning = false;

  const startTimer = () => {
    clearInterval(timer);

    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timer);
        isRunning = false;
        $('#startBtn').text("Start");
      }
    }, 1000);

    isRunning = true;
    $('#startBtn').text("Restart");
  };


  $('#pomodoroBtn').click(() => {
    timeLeft = 25 * 60;
    updateTimerDisplay();
    $('body').css('background-color', 'lightred');
  });

  $('#shortBreakBtn').click(() => {
    timeLeft = 5 * 60;
    updateTimerDisplay();
    $('body').css('background-color', 'lightblue');
  });

  $('#longBreakBtn').click(() => {
    timeLeft = 15 * 60;
    updateTimerDisplay();
    $('body').css('background-color', 'lightgreen');
  });

  $('#startBtn').click(() => {
    if ($('#startBtn').text() === "Restart") {
      clearInterval(timer);
      startTimer();
    } else if ($('#startBtn').text() === "Start") {
      startTimer();
      $('#startBtn').text("Restart");
    }
  });

});
