// course offerings page
var user = checkLogin();   

function sectionRow(c, s){
  var me=getUser();
  var day_text = ""
  for (var k = 0; k < s.days.length; k++) { 
    day_text += DAYS[s.days.charAt(k)] + ' <span class="badge ' + s.modes[k] + '">' + s.modes[k] + "</span><br>";
  }
  var alreadyEnlisted = false;
  for(var i = 0; i < me.enlisted.length; i++){
    if (me.enlisted[i].code == c.code && me.enlisted[i].sec == s.sec) alreadyEnlisted = true
  }
  var action = "";
  if(me.role == "student"){
    if (alreadyEnlisted) action = '<span class="badge ok">Enlisted</span>'   
    else if(s.slots > 0) action='<button class="btn small" onclick="enlistFromPage(\'' + c.code + '\',\'' + s.sec + '\')">Enlist</button>'
    else action = '<button class="btn small" disabled>Full</button>'
   }
  var h = '<tr><td>' + s.sec + '</td><td>' + day_text + '</td><td>' + s.time + '</td>';
  h += '<td>' + s.room + '</td><td>' + s.prof + '</td>';
  h += '<td><span class="badge ' + (s.slots > 0 ? 'ok' : 'full') + '">' + s.slots+'/' + s.max + '</span></td>';
  h += '<td>' + action + '</td></tr>'  
  return h;
}


function render(){
    var q = document.getElementById("search").value.toLowerCase()
    var mode = document.getElementById("modeFilter").value; 
    var avail = document.getElementById("availFilter").value;
    var courses = getCourses();
    var html = '';
    for(var i = 0; i<courses.length; i++){
        var c = courses[i]
        var tblRows="";
        for(var j = 0; j < c.sections.length; j++) {
            var s = c.sections[j];
            var text = (c.code + ' ' + c.name + " " + s.prof).toLowerCase();
            if (q != "" && text.indexOf(q) == -1) continue;
            if (mode!="all" && s.modes.indexOf(mode) == -1) continue;
            if (avail == "open" && s.slots <= 0) continue;
            if(avail == 'full' && s.slots > 0) continue;
            tblRows += sectionRow(c, s);
            }
        if(tblRows != "") {
            html += '<div class="card"><h3>' + c.code + " - " + c.name + ' <span class="muted">(' + c.units + ' units)</span></h3>'
            html += '<div class="tablewrap"><table><tr><th>Section</th><th>Days / Mode</th><th>Time</th><th>Room</th><th>Professor</th><th>Slots</th><th></th></tr>' + tblRows + '</table></div></div>';
        }
    }
    if(html == ''){ html = '<div class="card muted">No courses found.</div>'; }
    document.getElementById('courseList').innerHTML=html;
    document.getElementById('lastUpdate').innerText = 'Last updated: ' + new Date().toLocaleTimeString();
}

function enlistFromPage(code, sec){
  doEnlist(code, sec);
  render();
}

// hide enlistment tabs for non students
if(user.role != 'student') { document.getElementById("subtabs").style.display = "none"; }
render();
// refresh every 5 sec so the slots stay updated
setInterval(render, 5000);
console.log('courses ready')
