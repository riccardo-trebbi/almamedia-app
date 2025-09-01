// This script runs in the context of the popup.html, therefore the DOM is the one of the popup.
var origCareer = null
var career = null

function showResults() {
  $("#info").hide()
  $("#results").show()
}

function showInfo() {
  $("#results").hide()
  $("#info").show()
}

function addExamToCareer(row) {
  var gradeElem = $(row).find("input[name=grade]")
  var creditsElem = $(row).find("input[name=credits]")

  var gradeText = gradeElem.val()
  var creditsText = creditsElem.val()

  if (!gradeText && !creditsText) {
    return true
  }

  var credits = parseInt(creditsText)
  var grade = parseInt(gradeText)

  var exam = new Exam(credits)
  exam.setGrade(grade)
  career.addExam(exam)

  return true
}

function calcolaMediaFutura() {
  /* Every time calcola is clicked we reset the career because we retrieve all new exams again. */
  resetCareer()

  /* Retrieve all the exams inserted */
  var rows = $(".exam-row")
  var resultCalculation = true
  for (var i = 0; i < rows.length; ++i) {
    if (addExamToCareer(rows[i]) == false) resultCalculation = false
  }

  updateData()

  return false
}

function initializeDocument() {
  $("#info").hide()
  $("#results").hide()
}

function resetFormMediaFutura() {
  resetCareer()
  updateData()

  /* Remove all rows except one */
  $(".exam-row").each(function (index, element) {
    if (index > 0) {
      element.remove()
    }
  })

  return false
}

function resetCareer() {
  if (origCareer) {
    career = cloneCareer(origCareer)
  }
}

function updateData() {
  $("#studentName").text(career.name)
  $("#media").html(career.getMedia())
  $("#media_centodieci").html(career.getMediaCentoDieci())
  $("#cfu").html(career.getCFU())
}

function onDataReceived(response) {
  if (response.career == null) {
    showInfo()
  } else {
    origCareer = cloneCareer(response.career)
    resetCareer()
    showResults()
    updateData()
  }
}

function addNewExamRow() {
  var row = $(".exam-row").first().clone()
  row.find(".remove-btn").on("click", removeExamRowHandler)
  row.find("input").val("")
  $(".exam-form .rows").append(row)

  return false
}

function removeExamRowHandler() {
  if ($(".exam-row").length > 1) {
    $(this).parents(".exam-row").remove()
  }
}

$(document).ready(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { execute: "calculate" }, function (response) {
        onDataReceived(response)
      })
    }
  })

  $(".remove-btn").on("click", removeExamRowHandler)

  $("#add").on("click", addNewExamRow)

  var examForm = $(".exam-form")
  examForm.on("submit", function (event) {
    if (examForm[0].checkValidity()) {
      calcolaMediaFutura()
    }
    examForm.addClass("was-validated")
    event.preventDefault()
    event.stopPropagation()
  })
  examForm.on("reset", function (event) {
    resetFormMediaFutura()
    examForm.removeClass("was-validated")
  })

  initializeDocument()
})
