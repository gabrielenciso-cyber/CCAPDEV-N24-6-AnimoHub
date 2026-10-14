// organization settings page
var user = checkLogin();
var list = managedOrgs(user.email)
var cur_id = 0;  
var org = null
var myrole = 'none';   
var is_pres = false;

function init() {
    if(list.length == 0){
      toast('You dont have access to org settings', "error");   
      setTimeout(function(){ location.href = "dashboard.html"; }, 1200);
      return; 
   }
   var want = parseInt(new URLSearchParams(location.search).get("id"));
   cur_id = list[0].id;
   var sel = document.getElementById("orgSelect");
   for (var i = 0; i < list.length; i++){
      sel.innerHTML += '<option value="' + list[i].id + '">' + esc(list[i].name) + '</option>';
      if (list[i].id == want) cur_id = want;
   }
   sel.value = cur_id
   renderAll()
}

function changeOrg() {
	 cur_id = parseInt(document.getElementById("orgSelect").value);
	renderAll();
}


function renderAll() {
    org = getOrg(cur_id);
    myrole = getRole(user.email, cur_id)
    is_pres = (myrole == 'president' || user.role == "admin");
    document.getElementById('roleText').innerText = 'Your role: ' + (user.role=='admin' ? "admin" : myrole)
    renderInfo();
    clearEvForm();
    renderEvents();
    renderApps();
    renderResign()
    renderMembers()
}


// org info
function renderInfo(){
  document.getElementById("infoDesc").value = org.desc;
  document.getElementById('infoColor').value = org.color;
  document.getElementById("infoRecruit").checked=org.recruiting;
  document.getElementById("infoHiring").checked = org.officerHiring;
  document.getElementById("infoDesc").disabled = !is_pres;
  document.getElementById('infoColor').disabled = !is_pres;
}

function saveInfo() {
    org = getOrg(cur_id)
    if(is_pres){
        var d = document.getElementById("infoDesc").value.trim();
        if (d == "") { toast("Description cant be empty", 'error'); return; }
        org.desc = d
        org.color = document.getElementById("infoColor").value
         }
    org.recruiting = document.getElementById('infoRecruit').checked;
    org.officerHiring = document.getElementById('infoHiring').checked;
    saveOrg(org);
     toast('Organization info saved', 'success')  
}

// events
function renderEvents() {
  var h = ""
  for (var i = 0; i < org.events.length; i += 1) {
    var e=org.events[i];
    h += '<div class="row"><div><b>' + esc(e.title) + '</b><br><span class="muted">' + e.date + ' | ' + esc(e.place) + '</span></div>';
    h += '<div><button class="btn small outline" onclick="editEvent(' + e.id + ')">Edit</button> <button class="btn small red" onclick="deleteEvent(' + e.id + ')">Delete</button></div></div>';
  }
   if(h == '') h = '<p class="muted">No events yet.</p>'
   document.getElementById('evList').innerHTML = h;
}


function clearEvForm() {
    document.getElementById('evId').value = ""
    document.getElementById("evTitle").value=""
    document.getElementById("evDate").value = "";
    document.getElementById("evPlace").value=""   
    document.getElementById("evBtn").innerText = 'Add Event';
}

function saveEvent(){
   var title = document.getElementById('evTitle').value.trim();
   var date = document.getElementById("evDate").value;
   var place = document.getElementById("evPlace").value.trim();
   var id = document.getElementById("evId").value;
   if(title == "" || date == ""||place==""){ toast('Fill in all event fields', 'error'); return; }


   org = getOrg(cur_id);
   if (id!="") {
      for(var i = 0; i < org.events.length; i++){
         if (org.events[i].id == id) {
            org.events[i].title = title
            org.events[i].date = date;
            org.events[i].place = place;
         }
      }
      toast('Event updated', 'success');
   }
      else{
      org.events.push({id:nextId(org.events), title:title, date:date, place:place});
      toast("Event added", 'success');
   }
   saveOrg(org)
   clearEvForm();
   renderEvents()
}
function editEvent(id) {
    for (var i=0; i<org.events.length; i++) {
        if(org.events[i].id == id) {
            document.getElementById('evId').value = id;
            document.getElementById('evTitle').value = org.events[i].title;
            document.getElementById('evDate').value = org.events[i].date
            document.getElementById("evPlace").value = org.events[i].place;
            document.getElementById("evBtn").innerText = "Update Event";
         }
    }
}



function deleteEvent(id) {
   if (!confirm("Delete this event?")) return;
  org = getOrg(cur_id);
  for (var i = 0; i < org.events.length; i++) {
    if (org.events[i].id == id){ org.events.splice(i,1); break; }
  }
  saveOrg(org);
  renderEvents()
  toast('Event deleted', "info");
}



// applications
function renderApps() {
    var h = "";
    for (var i = 0; i < org.applications.length; i++){
        var a = org.applications[i];
        h += '<div class="row"><div><b>' + esc(a.name) + '</b> <span class="badge ' + (a.type == 'officer' ? "officer" : 'member') + '">' + a.type + '</span><br><span class="muted">' + esc(a.reason) + '</span></div>';
        h += '<div><button class="btn small" onclick="approveApp(' + a.id + ')">Approve</button> <button class="btn small red" onclick="rejectApp(' + a.id + ')">Reject</button></div></div>';
    }
    if(h == "") h = '<p class="muted">No pending applications.</p>';
    document.getElementById("appList").innerHTML = h
}

function approveApp(id) {
    org = getOrg(cur_id)
    var members = getMembers();
    for(var i = 0; i < org.applications.length; i++) {
        var a = org.applications[i];
        if(a.id != id) continue;
        var found = false;
        for(var j = 0; j < members.length; j++){
            if (members[j].orgId == cur_id&&members[j].email == a.email) {
                found = true; 
                if(a.type == "officer" && members[j].role == 'member') members[j].role = "officer";
            }
        }
        if (!found) members.push({orgId:cur_id, email:a.email, role:"member"})
        org.applications.splice(i, 1);
        break
    }
    saveMembers(members);
    saveOrg(org)
    toast("Application approved", 'success');
    renderApps()
    renderMembers();
}
function rejectApp(id){
   org = getOrg(cur_id);
   for(var i = 0; i < org.applications.length; i += 1){   
      if(org.applications[i].id == id) { org.applications.splice(i, 1); break; }
   }
   saveOrg(org);
   toast("Application rejected", "info")
   renderApps();
}


// resignations
function renderResign(){
    var h = '';
    for (var i = 0; i < org.resignations.length; i++){
        var r = org.resignations[i];
        h += '<div class="row"><div><b>' + esc(r.name) + '</b><br><span class="muted">' + esc(r.reason) + '</span></div>';
        h += '<div><button class="btn small" onclick="acceptResign(' + r.id + ')">Accept</button> <button class="btn small red" onclick="declineResign(' + r.id + ')">Decline</button></div></div>';
        }
    if (h=='') h = '<p class="muted">No resignation forms.</p>'
    document.getElementById("resList").innerHTML = h;
}


function acceptResign(id){
    org = getOrg(cur_id);
    for (var i = 0; i < org.resignations.length; i += 1) {
        if (org.resignations[i].id == id){
            removeMember(org.resignations[i].email, true);
            org = getOrg(cur_id);
            for (var j = 0; j < org.resignations.length; j += 1) {
                if(org.resignations[j].id == id){ org.resignations.splice(j, 1); break; }
            }
            break;
        }
    }
    saveOrg(org);
    toast('Resignation accepted', "success");
    renderResign();
    renderMembers();
}


function declineResign(id){
	org = getOrg(cur_id)
	for (var i = 0; i<org.resignations.length; i++) {
		if(org.resignations[i].id == id){ org.resignations.splice(i, 1); break; }
	}
	saveOrg(org);
		toast("Resignation declined", "info");
	renderResign();
}
// members
function renderMembers() {
	var mems=getMembers();
	var h = ''
	for(var i = 0; i < mems.length; i += 1) {
		var m = mems[i];
		if(m.orgId != cur_id) continue;
		var u = getUserByEmail(m.email);
		var roleCell = "";
		var actionCell = "";
		if(m.role == "president"){
			roleCell = '<span class="badge president">president</span>'
		}
		else{
			 roleCell = '<select onchange="changeRole(\'' + m.email + '\', this.value)">';
			roleCell += '<option value="member"' + (m.role == "member" ? " selected" : "") + '>member</option>';
			roleCell += '<option value="officer"' + (m.role=="officer" ? " selected" : "") + ">officer</option></select>";
			actionCell = '<button class="btn small red" onclick="kickMember(\'' + m.email + '\')">Remove</button>';
		 }
		h += '<tr><td>' + esc(u ? u.name : m.email) + '</td><td>' + m.email + '</td><td>' + roleCell + "</td><td>" + actionCell + "</td></tr>";
	}
	document.getElementById("memBody").innerHTML = h;
}


function changeRole(email, role){
	var mems = getMembers();
	for(var i = 0; i < mems.length; i += 1){
		if(mems[i].orgId == cur_id && mems[i].email==email) { mems[i].role = role; }
	}
	saveMembers(mems);
	toast("Role updated", "success");
}

function removeMember(email, quiet){
  var mems = getMembers()   
    for (var i = 0; i < mems.length; i++) {
    if(mems[i].orgId == cur_id&&mems[i].email == email && mems[i].role != 'president'){
      mems.splice(i, 1);
      break;
    }
  }
  saveMembers(mems);
  if(!quiet) toast("Member removed", 'info')
}


function kickMember(email) {
    if(!confirm("Remove this member?")) return;
    removeMember(email, false);
    renderMembers()
}


init();
