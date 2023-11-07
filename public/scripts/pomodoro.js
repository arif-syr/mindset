$(document).ready(function () {
  $("#navbar").load("/pages/navbar.html");
  $("#footer").load("/pages/footer.html");

  let timers = {
    pomodoroTimer: { timeLeft: 25 * 60, timerInstance: null },
    shortBreakTimer: { timeLeft: 5 * 60, timerInstance: null },
    longBreakTimer: { timeLeft: 15 * 60, timerInstance: null }
  };

  const updateTimerDisplay = (timerId) => {
    let minutes = Math.floor(timers[timerId].timeLeft / 60);
    let seconds = timers[timerId].timeLeft % 60;
    $('#' + timerId).text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const startTimer = (timerId, duration) => {
    stopTimer(timerId); 
    timers[timerId].timeLeft = duration;
    timers[timerId].timerInstance = setInterval(() => {
      timers[timerId].timeLeft--;
      updateTimerDisplay(timerId);
      if (timers[timerId].timeLeft <= 0) {
        stopTimer(timerId);
      }
    }, 1000);
  };

  const stopTimer = (timerId) => {
    clearInterval(timers[timerId].timerInstance);
  };

  const resetTimer = (timerId, duration) => {
    stopTimer(timerId);
    timers[timerId].timeLeft = duration;
    updateTimerDisplay(timerId);
  };

  $('.controlBtn').on('click', function () {
    const timerId = $(this).data('timer');
    const action = $(this).data('action');
    const duration = parseInt($(this).data('duration'));

    if (action === 'start') {
      startTimer(timerId, duration);
    } else if (action === 'stop') {
      stopTimer(timerId);
    } else if (action === 'reset') {
      resetTimer(timerId, duration);
    }
  });

  $('.controlBtn').on('click', function () {
    const timerId = $(this).data('timer');
    const action = $(this).data('action');
    const duration = parseInt($(this).data('duration'), 10);
  
    switch(action) {
      case 'start':
        startTimer(timerId, duration);
        break;
      case 'stop':
        stopTimer(timerId);
        break;
      case 'reset':
        resetTimer(timerId, duration);
        break;
      default:
        console.log('Invalid action');
    }
  });

  updateTimerDisplay('pomodoroTimer');
  updateTimerDisplay('shortBreakTimer');
  updateTimerDisplay('longBreakTimer');
});

