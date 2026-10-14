// dashboard page
var user = checkLogin();
var courses = getCourses();
var orgs = getOrgs()
var members = getMembers();
var users = getUsers();

document.getElementById('welcome').innerText = "Welcome back, " + user.name + '!';

function statCard(label, val){
     return '<div class="card stat hover"><div class="num">' + val + '</div><div class="muted">' + label + '</div></div>';
}
var stat_cards = document.getElementById('statcards');


if (user.role == "student") {
  var myOrgs = 0;
  for(var i = 0; i < members.length; i += 1){
    if(members[i].email == user.email) myOrgs += 1;
  }
  var units = totalUnits(user);
  stat_cards.innerHTML = statCard("Courses enlisted", user.enlisted.length) + statCard("Total units", units) + statCard("Units left", MAX_UNITS - units) + statCard("Organizations joined", myOrgs);


  var per_day = {M:0, T:0, W:0, H:0, F:0, S:0};
  for (var i = 0; i < user.enlisted.length; i++) {
      var f = findSection(user.enlisted[i].code, user.enlisted[i].sec);
    if (f == null) continue
    for (var d = 0; d<f.section.days.length; d++) {
      per_day[f.section.days.charAt(d)]++;
    }
  }
    document.getElementById("chart1title").innerText = 'My classes per day';
  drawBars('chart1',["Mon",'Tue',"Wed",'Thu','Fri',"Sat"], [per_day.M, per_day.T,per_day.W,per_day.H, per_day.F, per_day.S])
}


else if (user.role == 'teacher') {
   var sec_count = 0;
   var labels = [];
   var vals = [];
   for (var i = 0; i < courses.length; i++){
      sec_count += courses[i].sections.length;  
      labels.push(courses[i].code);
      vals.push(courses[i].sections.length);
   }
   stat_cards.innerHTML = statCard("Courses offered", courses.length) + statCard('Total sections', sec_count) + statCard("Organizations", orgs.length);
   document.getElementById('chart1title').innerText = "Sections per course";
   drawBars("chart1", labels, vals);
}

else {
   var labels = [];
   var vals = []
   for (var i=0; i < orgs.length; i += 1) {
      labels.push(orgs[i].name.substring(0, 14))
      vals.push(countMembers(orgs[i].id));
   }
   stat_cards.innerHTML = statCard('Organizations', orgs.length) + statCard('Registered users', users.length) + statCard('Memberships', members.length);
   document.getElementById("chart1title").innerText = 'Members per organization';
   drawBars('chart1', labels, vals);
}
// open slots per course (everyone sees this)
var cl = [];
var cv = [];
for(var i=0; i < courses.length; i++) { 
  var total = 0;
  for (var j = 0; j < courses[i].sections.length; j += 1) {
    total += courses[i].sections[j].slots
  }
  cl.push(courses[i].code);
  cv.push(total);
}
drawBars("chart2", cl, cv);

// carousel + events
var slides_html = '<div class="slide active"><h2>Enlistment is open!</h2><p>Check the Course Offerings page to plan your schedule early.</p><a class="btn" href="courses.html">View courses</a></div>';
slides_html += '<div class="slide" style="background:#2471a3"><h2>Join an organization</h2><p>Browse the CCS organization catalogue and apply during recruitment periods.</p><a class="btn" href="organizations.html">Browse orgs</a></div>';


var events = [];
for (var i = 0; i<orgs.length; i++) {
	for(var j = 0; j<orgs[i].events.length; j++){
		var e = orgs[i].events[j]
        if (e.date < new Date().toISOString().slice(0,10)) continue;
		events.push({title:e.title, date:e.date, place:e.place, org:orgs[i].name, color:orgs[i].color, orgId:orgs[i].id});
	}
}
events.sort(function(a, b) { return a.date > b.date ? 1 : -1; });

for (var i = 0; i < events.length && i < 3; i++) {
    slides_html += '<div class="slide" style="background:' + events[i].color + '"><p>' + esc(events[i].org)+"</p><h2>" + esc(events[i].title) + '</h2><p>'+events[i].date + " @ " + esc(events[i].place) + '</p><a class="btn" href="org.html?id=' + events[i].orgId + '">View org</a></div>'
}
document.getElementById("slides").innerHTML = slides_html
makeCarousel("carousel");
var evHtml = '' 
if(events.length == 0){ evHtml = '<p class="muted">No upcoming events.</p>'; }
for(var i = 0; i < events.length && i < 6; i++) {
	evHtml += '<div class="row"><div><b>' + esc(events[i].title) + '</b><br><span class="muted">' + esc(events[i].org) + " | "+esc(events[i].place) + '</span></div><span class="badge ok">' + events[i].date + '</span></div>';
}
document.getElementById("eventlist").innerHTML = evHtml;

console.log("dashboard loaded")
