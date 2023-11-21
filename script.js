async function loadJSON() {
  const response = await fetch("rules.json");
  if (!response.ok) {
    throw new Error("HTTP error " + response.status);
  }
  const jsonData = await response.json();
  return jsonData;
}

var data;
var rules = [];
var countTrue = 0;
var lastRuleNumber;
var checkboxList;
var checkboxes

const savedList = localStorage.getItem('checkboxList');
if (savedList) {
  checkboxList = JSON.parse(savedList);
  if (checkboxList.length == 0)
    checkboxList = ['1', '2', '3'];
}
else {
  checkboxList = ['1', '2', '3'];
}

function getRandomEntry(data) {
  var result = [];
  var randomIndex;
  var randomIndex2;
  
  do {
    randomIndex = Math.floor(Math.random() * data.length);
  } while (
    !(checkboxList.includes(data[randomIndex].number.match(/^\d+/)[0]))
  );

  var firstDigitOfRandomIndex = data[randomIndex].number.match(/^\d+/)[0];
  do {
    randomIndex2 = Math.floor(Math.random() * data.length);
  } while (
    randomIndex2 === randomIndex &&
    data[randomIndex2].number.match(/^\d+/)[0] !== firstDigitOfRandomIndex &&
    !(checkboxList.includes(data[randomIndex].number.match(/^\d+/)[0]))
  );

  result.push(data[randomIndex]);
  result.push(data[randomIndex2]);

  return result;
}

function refresh(data) {
  do {
    rules = getRandomEntry(data);
  } while (rules[0].number === lastRuleNumber);

  lastRuleNumber = rules[0].number;
  var randomIndex = Math.floor(Math.random() * 2);
  var randomIndex2;
  do {
    randomIndex2 = Math.floor(Math.random() * 2);
  } while (randomIndex === randomIndex2);

  $("h3")[0].innerHTML = rules[0].number;
  $("#countTrue")[0].innerHTML = countTrue;

  $(".answer")[randomIndex].innerHTML = rules[0].text;
  $(".answer")[randomIndex2].innerHTML = rules[1].text;
}

$(document).ready(async function () {
  await loadJSON().then((jsonData) => {
    data = jsonData;
  });
  refresh(data);
  
  $(".card").click(function () {
    var clickedAnswerText = $(this).find(".answer").text();
    var h3NumberText = $("h3")[0].innerHTML;
    if (clickedAnswerText === rules[0].text) {
      countTrue++;
    } else {
      var $cardContent = $(this).find(".card-content");
      $cardContent.addClass("prevWrong");
      $cardContent.on("animationend", () => {
        $cardContent.removeClass("prevWrong");
      });
    }
    refresh(data);
  });
  
  checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
  const checkbox1 = document.getElementById('checkbox1');
  const checkbox2 = document.getElementById('checkbox2');
  const checkbox3 = document.getElementById('checkbox3');
  
  if (checkboxList.includes('1')) {
      checkbox1.checked = true;
  }

  if (checkboxList.includes('2')) {
      checkbox2.checked = true;
  }

  if (checkboxList.includes('3')) {
      checkbox3.checked = true;
  }
});

function handleCheckboxChange(checkbox) {
  let activeCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  if (activeCheckboxes.length === 1) {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].disabled = checkboxes[i].checked;
    }
  } else {
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].disabled = false;
    }
  }
  
  var value = checkbox.value;

  if (localStorage.getItem('checkboxList')) {
      checkboxList = JSON.parse(localStorage.getItem('checkboxList'));
  }

  if (checkbox.checked) {
      checkboxList.push(value);
  } else {
      let index = checkboxList.indexOf(value);
      if (index > -1) {
          checkboxList.splice(index, 1);
      }
  }

  localStorage.setItem('checkboxList', JSON.stringify(checkboxList));
}