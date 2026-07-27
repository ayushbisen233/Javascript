function GradeSystem() {
    var name = document.getElementById("name").value;
    var marks = document.getElementById("marks").value;

    if (name == "") {
        alert("Please enter Student Name");
        return;
    }

    if (marks == "") {
        alert("Please enter marks");
        return;
    }

    marks = Number(marks);
    if (marks < 0 || marks > 100) {
        alert("Invalid marks");
        return;
    }

    var grade;
    var result;
    if (marks >= 90) { grade = "A+"; result = "Pass"; }
    else if (marks >= 80) { grade = "A"; result = "PASS"; }
    else if (marks >= 70) { grade = "B"; result = "PASS"; }
    else if (marks >= 60) { grade = "C"; result = " Pass"; }
    else if (marks >= 50) { grade = "D"; result = "Pass"; }
    else if (marks >= 40) { grade = "E"; result = "Fail"; }
    else { grade = "F"; result = "Fail"; }

    var reportDiv = document.getElementById("report");
    reportDiv.innerHTML = "<h2>Student Grade Report</h2>" +
                          "<hr>" +
                          "<b>Student Name :</b> " + name + "<br><br>" +
                          "<b>Marks :</b> " + marks + "<br><br>" +
                          "<b>Grade :</b> " + grade + "<br><br>" +
                          "<b>Result :</b> " + result;
    reportDiv.style.display = "block";
}
