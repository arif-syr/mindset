$(document).ready(function () {
    $("#navbar").load("/pages/navbar.html");
    $("#footer").load("/pages/footer.html");
  
    $('#sleep_form').on('submit', function (e) {
      e.preventDefault();
      const bedtime = $("#bedtime").val();
      const waketime = $("#waketime").val();
  
      const sleepData = { bedtime, waketime };
  
      $.ajax({
        type: 'POST',
        url: '/saveSleepSchedule',
        data: sleepData,
        success: function(result) {
          if (result.success) {
            $('#success_message').removeClass('d-none');
            $('#sleep_form')[0].reset();
          } else {
            alert('Failed to save data. ' + (result.message || ''));
          }
        },
        error: function() {
          alert('Failed to save data. Please try again.');
        }
      });
    });
  });
  