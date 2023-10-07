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
  clearInterval(timer);  // Clear existing timer

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;  // Update isRunning to false when timer ends
      $('#startBtn').text("Start");  // Reset button text to "Start"
    }
  }, 1000);

  isRunning = true;  // Set isRunning to true as the timer starts
  $('#startBtn').text("Restart");  // Set button text to "Restart" as the timer starts
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
    // If the button says "Restart"
    clearInterval(timer);  // Stop the timer
    startTimer();  // Start the timer again
  } else if ($('#startBtn').text() === "Start") {
    startTimer();  // If the button says "Start", start the timer
    $('#startBtn').text("Restart");  // Change button text to "Restart"
  }
});

});
