//jshint esversion:6
let pass = '';
let cPass = '';
let email = '';
let cEmail = '';
let passMatch = false;
let emailMatch = false;
let passLengthBool = false;
let boolIsEmail = false;

$(document).ready(function() {
  var buyBox = $('#register-buy');
  $(buyBox).hide();
});

// Check that passwords match
function PasswordsMatch(){
    pass = $('input[name=password]').val();
    cPass = $('input[name=cPassword]').val();
    if(($('input[name=password]').val().length == 0) || ($('input[name=cPassword]').val().length == 0)){
        $('#cPass-list').removeClass('invalid input-requirements');
        $('#cPass-list').addClass('invalid');
        passMatch = false;
    }
    else if (pass != cPass) {
        $('#cPass-list').removeClass('valid input-requirements');
        $('#cPass-list').addClass('invalid');
        passMatch = false;
    }
    else {
        $('#cPass-list').removeClass('invalid input-requirements');
        $('#cPass-list').addClass('valid');
        passMatch = true;
        // alert("Emails Match: "+emailMatch+"\n Password 8 chars: "+passLengthBool+"\n Passwords match: "+passMatch);
    }
}

function EmailsMatch() {
    email = $('input[name=username]').val();
    cEmail = $('input[name=cUsername]').val();
    if(($('input[name=username]').val().length == 0) || ($('input[name=cUsername]').val().length == 0)){
        $('#email-list').removeClass('input-requirements');
        $('#email-list').addClass('invalid');
        emailMatch = false;
    }
    else if (email != cEmail) {
        $('#email-list').removeClass('valid input-requirements');
        $('#email-list').addClass('invalid');
        emailMatch = false;
    }
    else {
        $('#email-list').removeClass('invalid input-requirements');
        $('#email-list').addClass('valid');
        emailMatch = true;
        // alert("Emails Match: "+emailMatch+"\n Password 8 chars: "+passLengthBool+"\n Passwords match: "+passMatch);
    }
}

$('input[name=username]').keyup(function() {
    EmailsMatch();
});

$('input[name=cUsername]').keyup(function() {
    EmailsMatch();
});

$('input[name=password]').keyup(function() {
    // Check if password is at least 8 characters
    pass = $('input[name=password]').val();
    if(($('input[name=password]').val().length < 8)){
        $('#pass-list').removeClass('valid input-requirements');
        $('#pass-list').addClass('invalid');
        passLengthBool = false;
    }
    else {
        $('#pass-list').removeClass('invalid input-requirements');
        $('#pass-list').addClass('valid');
        passLengthBool = true;
        // alert("Emails Match: "+emailMatch+"\n Password 8 chars: "+passLengthBool+"\n Passwords match: "+passMatch);
    }

     PasswordsMatch();
});

$('input[name=cPassword]').keyup(function() {
     PasswordsMatch();
});

$(":input").keyup(function(){
   if(emailMatch && passMatch && passLengthBool) {
        $("#register-buy").show();
        // $(".prices").removeClass("notVisible").addClass("visible");
        // $(".prices").slideDown();
   }
   else {
       $("#register-buy").hide();
       // $(".prices").slideUp();
   }
});
