function normalizeGrade(grade) {
  grade = grade.replace("verbalizzato: ", "") // remove 'verbalizzato'
  grade = grade.replace("e lode", "") // remove 'e lode' if present
  grade = grade.replace(/^\s+|\s+$/, "") // trim

  return isNaN(Number(grade)) ? grade : Number(grade)
}

function normalizeName(name) {
  name = name.replace(/^[0-9]*\s+-\s+/i, "")
  return name
}

function getExamRows() {
  return $("table.iceDataTblOutline").find("tr.riga0, tr.riga1")
}

const NAME_REGEX_IT = /(?<=Piano di studi - ).*?(?= \()/
const NAME_REGEX_EN = /(?<=Study plan ).*?(?= \()/

function getStudentName() {
  const titleContent = $(".titoloPagina").text()
  // Test against the italian regex
  const itMatch = titleContent.match(NAME_REGEX_IT)?.[0]
  if (itMatch) return itMatch
  // Test against the english regex
  const enMatch = titleContent.match(NAME_REGEX_EN)?.[0]
  if (enMatch) return enMatch
  return "Studente"
}

function getCareer() {
  var rows = getExamRows()

  if (rows.length == 0) return null

  var studentName = getStudentName()

  var career = new Career(studentName)
  for (var i = 0; i < rows.length; i++) {
    var columns = $(rows.get(i)).children(".colonna")

    if (columns != null && columns.length >= 6) {
      /*var name = $(columns.get(2)).html().trim();*/
      var credits = Number($(columns.get(4)).html())
      var grade = $(columns.get(5)).html()

      // We take into consideration only the grades that are "Verbalizzato" or "Riconosciuto"
      var exam = new Exam(credits)
      if (grade.indexOf("verbalizzato") >= 0 || grade.indexOf("Riconosciuto") >= 0) {
        grade = normalizeGrade(grade)
        exam.setGrade(grade)
      }
      career.addExam(exam)
    }
  }

  return career
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.execute == "calculate") {
    var career = getCareer()
    sendResponse({ career: career })
  }
})

/* We are in AlmaEsami page if the table of grades exists AND if there is the keyword AlmaEsami somewhere */
function isAlmaEsami() {
  var regex = /almaesami/i
  var keywordFound = regex.test($("body").html())
  var rows = getExamRows()

  return rows.length > 0 && keywordFound
}

$(document).ready(function () {
  if (isAlmaEsami()) {
    chrome.runtime.sendMessage({}, function (response) {})
  }
})
