$(document).ready(function () {
    $("#navbar").load("/pages/navbar.html");
    $("#footer").load("/pages/footer.html");
  
    $('#sleep_form').on('submit', function (e) {
      e.preventDefault();
      let bedtime = $("#bedtime").val().trim();
      let waketime = $("#waketime").val().trim();
  
      const sleepData = { bedtime, waketime };

      $.post('/saveSleepSchedule', {
        bedtime: bedtime,
        waketime: waketime,
      });
    });
  });
  