$(document).ready(function () {
  $("#navbar").load("/pages/navbar.html");
  $("#footer").load("/pages/footer.html");

  $('#contact_form').on('submit', function (e) {
    e.preventDefault();

    const addiction_name = $("#addiction_name").val();
    if (!addiction_name) {
      alert("Please provide an addiction name.");
      return;
    }

    const quit_date = $("#quit_date").val();
    if (!quit_date) {
      alert("Please provide a quit date.");
      return;
    }

    const savings_money = $("#savings_money").val();
    if (!savings_money || isNaN(savings_money) || parseFloat(savings_money) < 0) {
      alert("Please provide a valid savings amount.");
      return;
    }

    const reasons = $("#reasons").val();
    if (!reasons) {
      alert("Please provide reasons for quitting.");
      return;
    }

    $.post('/saveAddiction', $(this).serialize(), function (result) {
      if (result.success) {
        $('#success_message').removeClass('d-none');
        $('#contact_form')[0].reset();
      } else {
        alert('Failed to save data. ' + (result.message || ''));
      }
    }).fail(function () {
      alert('Failed to save data. Please try again.');
    });
  });
});
