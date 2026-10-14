// profile page
var user = checkLogin()


function showTab(t) {
    var tabs=['info', 'sched', "orgs"];
    for (var i = 0; i < tabs.length; i++){   
        document.getElementById(tabs[i] + "Tab").style.display = (tabs[i] == t) ? 'block' : "none"
         document.getElementById("btn_" + tabs[i]).className = (tabs[i] == t) ? "tab active" : 'tab';
    }
}

function loadInfo() {
    var u = getUser();
    document.getElementById('pName').value = u.name;
    document.getElementById('pEmail').value = u.email;
     document.getElementById("pRole").value = u.role
}


function saveProfile(){
	var name = document.getElementById('pName').value.trim();
	if (name == '') { toast('Name cant be empty', 'error'); return; }
	var u = getUser();
	u.name = name;
	saveUser(u);
	buildNav();
	toast("Profile updated", "success");
}

function buildSchedule(){
    var u = getUser()
    if(u.role!="student"){
        document.getElementById('schedBox').innerHTML = '<p class="muted">Schedules are only available for student accounts.</p>';
        return;
    }
    var html = '<div class="tablewrap"><table class="sched"><tr><th>Time</th>';
    for(var d in DAYS){ html += "<th>" + DAYS[d] + '</th>'; }
    html += '</tr>';

    for(var t = 0; t < TIMES.length; t++){
        html += '<tr><td>' + TIMES[t] + '</td>'
        for(var d in DAYS) {
            var cellHtml = "";
            for (var i = 0; i < u.enlisted.length; i++) {
                var f = findSection(u.enlisted[i].code,u.enlisted[i].sec);
                 if(f == null) continue;
                var pos = f.section.days.indexOf(d);
                if(f.section.time == TIMES[t]&&pos != -1) {
                    var m = f.section.modes[pos];
                    cellHtml += '<div class="cls ' + m.toLowerCase() + '"><b>' + f.course.code + '</b> ' + f.section.sec + "<br>" + m + '<br>' + (m == 'Online' ? "Online" : f.section.room) + "<br>" + f.section.prof+'</div>';
                }
            }   
            html += "<td>" + cellHtml + '</td>';
        }
        html += '</tr>';
    }
    html += '</table></div>';  
    html += '<p class="muted"><span class="badge Onsite">Onsite</span> <span class="badge Online">Online</span></p>';
    document.getElementById("schedBox").innerHTML = html;
}



function loadOrgs(){
  var orgs = getOrgs();
   var h = ""
  for (var i = 0; i<orgs.length; i++) {
    var r = getRole(user.email, orgs[i].id);
    if (r == 'none') continue
    h += '<div class="row"><a href="org.html?id=' + orgs[i].id + '">' + esc(orgs[i].name) + '</a><span class="badge ' + r + '">' + r + '</span></div>'
  }
  if (h == "") h = '<p class="muted">You have not joined any organization yet.</p>';
  document.getElementById('myOrgs').innerHTML = h;
}


loadInfo(); 
buildSchedule();
loadOrgs();
showTab('info');

console.log('profile done')
