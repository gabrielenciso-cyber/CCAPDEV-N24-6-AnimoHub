// enlistment page
var user = checkLogin();
if (user.role != 'student'){ location.href = "dashboard.html"; }

function fillCourses(){
   var sel = document.getElementById("courseSel");
   var courses = getCourses();
   var txt = '';
   for (var i = 0; i < courses.length; i += 1) {
      txt += '<option value="' + courses[i].code + '">' + courses[i].code + ' - ' + courses[i].name + '</option>';
   }
   sel.innerHTML=txt
   fillSections();
}



function fillSections() {
    var code = document.getElementById("courseSel").value;
    var courses = getCourses();
    var txt = '';
    for (var i = 0; i < courses.length; i++) {
        if(courses[i].code == code) {
            for(var j = 0; j < courses[i].sections.length; j++) {
                var s=courses[i].sections[j];
                txt += '<option value="' + s.sec + '">' + s.sec + ' | ' + s.days + ' ' + s.time + ' | ' + s.slots + ' slots</option>';
            }
        }
    }
    document.getElementById('secSel').innerHTML = txt;
}
function renderTable() {
    var u = getUser();
    var txt = "";
    for(var i = 0; i < u.enlisted.length; i++) {
        var f = findSection(u.enlisted[i].code,u.enlisted[i].sec);
        if (f==null) continue
        txt += '<tr><td>' + f.course.code + '</td><td>' + f.course.name + '</td><td>' + f.section.sec + '</td>';
        txt += '<td>' + f.section.days + ' ' + f.section.time + '</td><td>' + f.course.units + '</td>'
        txt += '<td><button class="btn small red" onclick="dropCourse(\'' + f.course.code + '\')">Drop</button></td></tr>';
    }
    if(txt == '') { txt = '<tr><td colspan="6" class="muted">You have not enlisted in any course yet.</td></tr>'; }
    document.getElementById("enlistBody").innerHTML=txt;
    var t = totalUnits(u);
    document.getElementById('unitsText').innerText = 'Total units: ' + t + ' / ' + MAX_UNITS
}

function addCourse() {
    var code=document.getElementById("courseSel").value
    var sec = document.getElementById("secSel").value
    if(doEnlist(code, sec)){
        renderTable();  
             fillSections()
    }   
}

function dropCourse(code){
	if(confirm("Drop " + code + "?")){
		doDrop(code);
		renderTable();
		fillSections();
	}
}

fillCourses();
renderTable();
