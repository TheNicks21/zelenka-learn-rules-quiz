function loadJSON(callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', 'rules.json', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}

var data = loadJSON(data)
var rules = [];
var countTrue = 0;
var lastRuleNumber;

function getRandomEntry(data) {
    var result = [];
    var randomIndex = Math.floor(Math.random() * data.length);
    var randomIndex2;

    var firstDigitOfRandomIndex = (data[randomIndex].number).match(/^\d+/)[0];
    do {
        randomIndex2 = Math.floor(Math.random() * data.length);
    } while(randomIndex2 === randomIndex && (data[randomIndex2].number).match(/^\d+/)[0] !== firstDigitOfRandomIndex);

    result.push(data[randomIndex]);
    result.push(data[randomIndex2]);

    return result;
}

function refresh() {
  do {
    rules = getRandomEntry(data);
  } while(rules[0].number === lastRuleNumber);

  lastRuleNumber = rules[0].number;
  var randomIndex = Math.floor(Math.random() * 2);
  var randomIndex2;
  do {
    randomIndex2 = Math.floor(Math.random() * 2);
  } while(randomIndex === randomIndex2);

  $('h3')[0].innerHTML = rules[0].number;
  $('#countTrue')[0].innerHTML = countTrue;
  
  $('.answer')[randomIndex].innerHTML = rules[0].text;
  $('.answer')[randomIndex2].innerHTML = rules[1].text;
}
$(document).ready(function () {
  refresh(data);
  $('.card').click(function () {
    var clickedAnswerText = $(this).find('.answer').text();
    var h3NumberText = $('h3')[0].innerHTML;
    if (clickedAnswerText === rules[0].text) {
      countTrue++;
    } else {
      $(this).find(".card-content").toggleClass("animation");
    }
    refresh(data);
  });
});