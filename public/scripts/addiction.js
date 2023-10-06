$(document).ready(function () {
  $('#contact_form').bootstrapValidator({
    // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      addiction_name: {
        validators: {
          stringLength: {
            min: 1,
          },
          notEmpty: {
            message: 'Please supply addiction name'
          }
        }
      },
      quit_date: {
        validators: {
          date: {
            format: 'MM-DD-YYYY',
            message: 'The date is not valid'
          },
          notEmpty: {
            message: 'Please supply your quit date'
          },
          callback: {
            message: 'Quit date must be later than today',
            callback: function (value, validator, $field) {
              var today = new Date().toLocaleDateString('en-US');
              return new Date(value) > new Date(today);
            }
          }
        }
      },
      savings_money: {
        validators: {
          notEmpty: {
            message: 'Please supply a dollar amount'
          },
          numeric: {
            message: 'The value must be a number'
          },
          greaterThan: {
            value: 0,
            inclusive: true,
            message: 'Enter a non-negative value'
          }
        }
      },
      phone: {
        validators: {
          notEmpty: {
            message: 'Please supply your phone number'
          }
        }
      },
      comment: {
        validators: {
          stringLength: {
            min: 10,
            max: 2000,
            message: 'Please enter at least 10 characters and no more than 2000'
          },
          notEmpty: {
            message: 'Please supply a description of your reasons'
          }
        }
      }
    }
  })
    .on('success.form.bv', function (e) {
      e.preventDefault();
      var $form = $(e.target);
      var bv = $form.data('bootstrapValidator');
      $.post($form.attr('action'), $form.serialize(), function (result) {
        console.log(result);
        if (result.success) {
          $('#success_message').slideDown({ opacity: "show" }, "slow")
          $('#contact_form').data('bootstrapValidator').resetForm();
        } else {
          $('#errorMessage').text('Form submission failed. Please try again.');
        }
      }, 'json');
    });
});

