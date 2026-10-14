// single organization page
var user = checkLogin();
var params = new URLSearchParams(location.search);
var orgId = parseInt(params.get("id"));
var org = null;
var my_role = "none";
var form_type = ''

function hasPending(type) {
  var i;
  if (type == "resign"){
    for(i = 0; i<org.resignations.length; i++) {
      if (org.resignations[i].email == user.email) return true;
    }
    return false
  }
   for (i = 0; i < org.applications.length; i++){
    if (org.applications[i].email == user.email && org.applications[i].type == type) return true;
  }
  return false  
}

function render() {
   org = getOrg(orgId);
   var box = document.getElementById("orgPage");
   if (org == null) {
      box.innerHTML = '<div class="card">Organization not found. <a href="organizations.html">Go back</a></div>';
      return;
   }
   my_role=getRole(user.email,orgId);
   document.title = 'AnimoHub - ' + org.name

   var btns = ''
   if (user.role == 'student') {
      if (my_role == "none") {
         if (org.recruiting){
            if (hasPending('member')) btns += '<span class="badge warn">Application pending</span> ';
            else btns += '<button class="btn" onclick="openForm(\'member\')">Apply to Join</button> ';
         }
         else btns += '<span class="badge full">Recruitment closed</span> '
      }
      else {
         if(my_role == 'member'&&org.officerHiring) {  
            if(hasPending("officer")) btns += '<span class="badge warn">Officer application pending</span> ';
            else btns += '<button class="btn" onclick="openForm(\'officer\')">Apply for Officer</button> ';
         }
         if(my_role != "president"){
            if (hasPending("resign")) btns += '<span class="badge warn">Resignation pending</span> ';
            else btns += '<button class="btn red" onclick="openForm(\'resign\')">Leave Organization</button> '
         } 
      }
   }
   if(my_role == 'president' || my_role == 'officer' || user.role == "admin") {
      btns += '<a class="btn" style="background:white;color:#222" href="orgsettings.html?id=' + orgId + '">Manage</a>';  
   } 

   var members=getMembers();
   var leadersHtml = ""   
   var cnt = 0
   for (var i = 0; i<members.length; i++){
      if(members[i].orgId != orgId) continue;
      cnt++;
      if (members[i].role!="member"){
         var u=getUserByEmail(members[i].email);
         leadersHtml += '<div class="row"><span>' + esc(u ? u.name : members[i].email) + '</span><span class="badge ' + members[i].role + '">' + members[i].role + '</span></div>'
      }
   }
   if (leadersHtml == "") leadersHtml = '<p class="muted">No officers yet.</p>';

   var evHtml = '';
   for(var i = 0; i < org.events.length; i++) {
      var e = org.events[i]
      evHtml += '<div class="row"><div><b>' + esc(e.title) + '</b><br><span class="muted">' + esc(e.place) + '</span></div><span class="badge ok">' + e.date + '</span></div>';
   }
   if (evHtml == '') evHtml = '<p class="muted">No events yet.</p>';

   var h = '<div class="orgbanner" style="background:' + org.color + '"><h1>' + esc(org.name) + '</h1>'
   h += '<p>' + cnt + ' members';
   if (my_role != "none") h += ' | You are: ' + my_role;
    h += '</p>' + btns + '</div>';
   h += '<div class="card"><h3>About</h3><p>' + esc(org.desc) + '</p>';
   h += '<p class="muted">Recruitment: ' + (org.recruiting ? 'open' : 'closed') + ' | Officer hiring: ' + (org.officerHiring ? 'open' : 'closed') + '</p></div>';
   h += '<div class="twocol"><div class="card"><h3>Events</h3>' + evHtml + '</div>';
   h += '<div class="card"><h3>Officers</h3>'+leadersHtml + '</div></div>';
   box.innerHTML = h;
}


function openForm(type) {
    form_type = type;
    var title = document.getElementById("formTitle");
    var label = document.getElementById('formLabel');
    if (type == "member"){ title.innerText = "Membership Application"; label.innerText = "Why do you want to join?"; }
    if (type == "officer"){ title.innerText = "Officer Application"; label.innerText = "Why do you want to be an officer?"; }
        if (type == "resign") { title.innerText='Resignation Form'; label.innerText = 'Reason for leaving'; }  
    document.getElementById('formReason').value = "";
    openModal("formModal");
}


function submitForm(){
  var reason = document.getElementById("formReason").value.trim();
  if (reason == ""){ toast("Please write a reason", 'error'); return; }   
  org = getOrg(orgId);
  if (form_type == 'resign'){
    org.resignations.push({id:nextId(org.resignations), email:user.email, name:user.name, reason:reason});
    toast("Resignation form submitted", "success");
  }   
  else {
      org.applications.push({id:nextId(org.applications), email:user.email, name:user.name, reason:reason, type:form_type});
    toast("Application submitted", "success");
   }
  saveOrg(org);
  closeModal("formModal")
  render();
}
render();


console.log(org)
