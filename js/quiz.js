const URL = "http://192.168.12.159/";

var fullname;
var phone;
var email;

function loadR() {
  fullname = document.getElementById("name").value;
  phone = document.getElementById("phone").value;
  email = document.getElementById("email").value;
}
function validateR() {
  loadR();
  var letters = /^[A-Za-z]+$/;
  let isValid = true;

  console.log(phone.length);
  if (fullname === "") {
    document.getElementById("nameErr").innerHTML = "Please Enter Your Name";
    isValid = false;
  } else {
    document.getElementById("nameErr").innerHTML = "";
  }

  if (phone === "") {
    document.getElementById("phoneErr").innerHTML = "Please Enter Phone Number";
    isValid = false;
  } else if (phone.length !== 10 || letters.test(phone)) {
    document.getElementById("phoneErr").innerHTML = "Enter valid Phone Number";
    isValid = false;
  } else {
    document.getElementById("phoneErr").innerHTML = "";
  }

  if (email === "") {
    document.getElementById("emailErr").innerHTML =
      "Please Enter Email Address";
    isValid = false;
  } else {
    document.getElementById("emailErr").innerHTML = "";
  }

  console.log(isValid);
  return isValid;
}

function handleRegister() {
  loadR();
  if (validateR()) {
    $.ajax({
      url: `${URL}api/register`,
      type: "post",
      data: { user_name: fullname, email: email, mobile_no: phone },
      dataType: "json",
      success: function (data) {
        console.log(data.data);
        localStorage.setItem("USER", data.data.user_name);
        localStorage.setItem("MOBILE", data.data.mobile_no);
        localStorage.setItem("EMAIL", data.data.email);

        window.location = "./Login.html";
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $("#RegisterErr").html(xhr.responseJSON.message);
        console.log(xhr.responseJSON.message);
      },
    });
  }
  console.log(fullname, phone, email, "Details");
}

function loadL() {
  phone = document.getElementById("phone").value;
  email = document.getElementById("email").value;
}

function validateL() {
  loadL();
  let isValid = true;
  if (phone === "") {
    document.getElementById("phoneErr").innerHTML = "Please Enter Phone Number";
    isValid = false;
  } else if (phone.length > 10) {
    document.getElementById("phoneErr").innerHTML = "Enter valid Phone Number";
    isValid = false;
  } else {
    document.getElementById("phoneErr").innerHTML = "";
  }

  if (email === "") {
    document.getElementById("emailErr").innerHTML =
      "Please Enter Email Address";
    isValid = false;
  } else {
    document.getElementById("emailErr").innerHTML = "";
  }

  return isValid;
}

function handleLogin() {
  loadL();
  if (validateL()) {
    $.ajax({
      url: `${URL}api/login`,
      type: "post",
      data: { email: email, mobile_no: phone },
      dataType: "json",
      success: function (data) {
        localStorage.setItem("MOBILE", data.data.mobile_no);
        localStorage.setItem("EMAIL", data.data.email);
        localStorage.setItem("UID", data.data._id);
        localStorage.setItem("response", 0);

        // getQuestions();
        alert(
          "You're about to Attend 10 question.\n The Time provided is 2 Minutes to Attend all of the Questions. \nTimer Will Start Right After You Click Ok Button."
        );
        window.location = "./Home.html";
      },
      error: function (xhr, ajaxOptions, thrownError) {
        $("#loginErr").html(xhr.responseJSON.message);
        console.log(xhr.responseJSON.message);
      },
    });
  } else {
    console.log("Error in Login");
  }
}

function handleLogout() {
  window.location = "./Login.html";
}
