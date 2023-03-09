const URL = "http://192.168.12.159:9500/";

var fullname;
var phone;
var email;
var QuestionDetails;
var userAns = {};
var ansSheet = {};
var score = 0;

function loadR() {
  fullname = document.getElementById("name").value;
  phone = document.getElementById("phone").value;
  email = document.getElementById("email").value;
}
function validateR() {
  loadR();
  if (fullname === "") {
    document.getElementById("nameErr").innerHTML = "Please Enter Your Name";
  } else {
    document.getElementById("nameErr").innerHTML = "";
  }

  if (phone === "") {
    document.getElementById("phoneErr").innerHTML = "Please Enter Phone Number";
  } else {
    document.getElementById("phoneErr").innerHTML = "";
  }

  if (email === "") {
    document.getElementById("emailErr").innerHTML =
      "Please Enter Email Address";
  } else {
    document.getElementById("emailErr").innerHTML = "";
  }
}

function handleRegister() {
  loadR();
  validateR();
  console.log(fullname, phone, email, "Details");
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
  });
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
        getQuestions();
        window.location = "./Home.html";
      },
    });
  } else {
    console.log("Error in Login");
  }
}

$(document).ready(function () {
  getQuestions();
});

function getQuestions() {
  $.ajax({
    url: `${URL}api/get-questions`,
    type: "get",
    dataType: "json",
    success: function (data) {
      QuestionDetails = data.data;
      console.log(QuestionDetails);
      var questions = "";

      QuestionDetails.forEach((q, i) => {
        ansSheet[`${q.question}`] = q.correct_answer;
        questions += `<div class="question-bolck my-4">
          <p class="question" id="${q.id}">
            Q${i + 1}. ${q.question}
          </p>
          <div onclick="storeAns('${q.question}','${q.option_1}')">
            <label class="d-flex align-items-center option">
              <input
                type="radio"
                class="option-radio flex-grow-0"
                name="${q.id}"
                id="a"
              />
              <span class="col">${q.option_1}</span>
            </label>
          </div>

          <div onclick="storeAns('${q.question}','${q.option_2}')">
            <label class="d-flex align-items-center option">
              <input
                type="radio"
                class="option-radio flex-grow-0"
                name="${q.id}"
                id="b"
              />
              <span class="col">${q.option_2}</span>
            </label>
          </div>

          <div onclick="storeAns('${q.question}','${q.option_3}')">
            <label class="d-flex align-items-center option">
              <input
                type="radio"
                class="option-radio flex-grow-0"
                name="${q.id}"
                id="d"
              />
              <span class="col">${q.option_3}</span>
            </label>
          </div>

          <div onclick="storeAns('${q.question}', '${q.option_4}')">
            <label class="d-flex align-items-center option">
              <input
                type="radio"
                class="option-radio flex-grow-0"
                name="${q.id}"
                id="a"
              />
              <span class="col"
                >${q.option_4}</span
              >
            </label>
          </div>
        </div>`;
      });
      console.log(ansSheet);
      $("#questions").html(questions);
    },
  });
}

function storeAns(question, ans) {
  if (userAns.hasOwnProperty(question)) {
    userAns[`${question}`] = ans;
    return;
  }
  userAns[`${question}`] = ans;
  console.log();
}

function handleQuizSubmit() {
  if (Object.keys(userAns).length == 10) {
    Object.entries(ansSheet).forEach((entry) => {
      const [key, value] = entry;
      if (userAns[key] == value) {
        score++;
      }
    });
  } else {
    $("#submit-error").html("Please Attend All the Questions.");
  }
}
