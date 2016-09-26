$(document).ready[function () {

  $('.form-signin').validate({
    rules: {
      firstName: {
        required: true
      },
      emailAddress: {
        required: true,
        email: true
      },
      userName: {
        required: true
      },
      password: {
        minlength: 6,
        required: true
      },
      confirmation: {
        minlength: 6,
        equalTo: "#password"
      }
    },
    success: function (element) {
      element
      .text('Ok..!').addClass('valid')
    }
  });
}];
