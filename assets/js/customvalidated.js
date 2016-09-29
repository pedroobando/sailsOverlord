$().ready(function(){

  $('#sign-up-form').validate({
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
        required: true,
        equalTo: "#password"
      }
    },
    messages: {
      firstName: {
        required: "El firstName es requerido"
      }


    },
    success: function (element) {
      element
      .text('Ok..!').addClass('valid')
    }
  });
});
