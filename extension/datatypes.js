// Data types definitions

/*********** EXAM *************************/
function Exam(credits) {
  this.credits = credits
  this.grade = null // we set null if the exam has not been passed, the grade can be a number or a string (like ID)
}

Exam.prototype.setGrade = function (grade) {
  // we set the grade only if it is valid. This means ID, ST or a number.
  if ($.isNumeric(grade) || grade == "ID" || grade == "ST") {
    this.grade = grade
  }
}

Exam.prototype.isPassed = function () {
  return this.grade != null
}

Exam.prototype.isGradeNumber = function () {
  return $.isNumeric(this.grade)
}

/*********************** Career ******************************/
function Career(name) {
  this.name = name
  this.exams = new Array()
}

Career.prototype.addExam = function (exam) {
  this.exams.push(exam)
}

Career.prototype.getMedia = function () {
  var gradesSum = 0
  var creditsSum = 0
  for (var i = 0; i < this.exams.length; i++) {
    if (this.exams[i].isPassed() && this.exams[i].isGradeNumber()) {
      gradesSum += this.exams[i].grade * this.exams[i].credits
      creditsSum += this.exams[i].credits
    }
  }
  var media = 0
  if (creditsSum > 0) media = gradesSum / creditsSum
  return media.toFixed(2)
}

Career.prototype.getCFU = function () {
  var creditsSum = 0
  for (var i = 0; i < this.exams.length; i++) {
    if (this.exams[i].isPassed()) {
      creditsSum += this.exams[i].credits
    }
  }
  return creditsSum
}

Career.prototype.getMediaCentoDieci = function () {
  return ((this.getMedia() * 110) / 30).toFixed(2)
}

// We need this because JSON cannot pass object.
// Therefore we must recreate another career object.
function cloneCareer(careerObject) {
  var career = new Career(careerObject.name)
  for (var i = 0; i < careerObject.exams.length; ++i) {
    var exam = new Exam(careerObject.exams[i].credits)
    exam.setGrade(careerObject.exams[i].grade)
    career.addExam(exam)
  }
  return career
}
