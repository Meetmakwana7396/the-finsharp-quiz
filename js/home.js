const URL = "http://192.168.12.159:9500/";

var QuestionDetails;
var userAns = {};
var ansSheet = {};
var score = 0;
var time;

$(document).ready(function () {
  getQuestions();
  setTimer(120);
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
  var arr = [];
  Object.entries(ansSheet).forEach((entry) => {
    const [key, value] = entry;
    let temp = { question: key, answer: value };
    arr.push(temp);
    if (userAns[key] == value) {
      score++;
    }
  });
  localStorage.setItem("SCORE", score);
  $.ajax({
    url: `${URL}api/submit-your-answers`,
    type: "post",
    data: {
      user_id: localStorage.getItem("UID"),
      score: score,
      time: time,
      questionAnswer: arr,
    },
    dataType: "json",
    success: function (data) {
      if (data.success) {
        window.location.replace("./Response.html");
      }
    },
  });
}

function setTimer(t) {
  time = t;
  $("#timer").html(convertToMin(t));

  setInterval(() => {
    if (time == 0) {
      handleQuizSubmit();
      return;
    }
    time--;

    $("#timer").html(convertToMin(time));
  }, 1000);
}

function convertToMin(t) {
  var min = 0;
  var sec = 0;
  min = parseInt(t / 60);
  sec = t - min * 60;
  return "0" + min + ":" + (sec < 10 ? "0" + sec : sec);
}