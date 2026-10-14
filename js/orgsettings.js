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
    renderStats();
    renderInfo();
    clearAnnForm();
    renderAnnouncements();
    clearEvForm();
    renderEvents();
    renderApps();
    renderResign()
    renderMembers()
}


// org info
function renderInfo(){
  document.getElementById("infoCategory").value = org.category || "Community";
  document.getElementById("infoType").value = org.orgType || "Student Organization";
  document.getElementById("infoDesc").value = org.desc;
  document.getElementById('infoColor').value = org.color;
  document.getElementById("infoRecruit").checked=org.recruiting;
  document.getElementById("infoHiring").checked = org.officerHiring;
  document.getElementById("infoCategory").disabled = !is_pres;
  document.getElementById("infoType").disabled = !is_pres;
  document.getElementById("infoRecruit").disabled = !is_pres;
  document.getElementById("infoHiring").disabled = !is_pres;
  document.getElementById("infoDesc").disabled = !is_pres;
  document.getElementById('infoColor').disabled = !is_pres;
}

function saveInfo() {
  if (!isPresidentOf(user.email, cur_id)) {
    toast('Only the president or admin can change organization information.', 'error');
    return;
  }
  var desc = document.getElementById('infoDesc').value.trim();
  var orgType = document.getElementById('infoType').value.trim();
  if (!desc || !orgType) {toast('Description and organization type are required.', 'error'); return;}
  org = getOrg(cur_id);
  org.desc = desc;
  org.orgType = orgType;
  org.category = document.getElementById('infoCategory').value;
  org.color = document.getElementById('infoColor').value;
  org.recruiting = document.getElementById('infoRecruit').checked;
  org.officerHiring = document.getElementById('infoHiring').checked;
  saveOrg(org);
  toast('Organization information updated.', 'success');
  renderAll();
}

// events
function renderEvents() {
  var h = ""
  for (var i = 0; i < org.events.length; i += 1) {
    var e=org.events[i];
    h += '<div class="row"><div><b>' + esc(e.title) + '</b><br><span class="muted">' + e.date + ' | ' + esc(e.place) + (e.time ? ' | ' + esc(e.time) : '') + '</span></div>';
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
    document.getElementById("evTime").value=""   
    document.getElementById("evBtn").innerText = 'Add Event';
}

function saveEvent(){
  if (!canManageOrg(user.email, cur_id)) {toast('You do not have access.', 'error'); return;}
  var title = document.getElementById('evTitle').value.trim();
  var date = document.getElementById('evDate').value;
  var place = document.getElementById('evPlace').value.trim();
  var time = document.getElementById('evTime').value;
  var id = document.getElementById('evId').value;
  if (!title || !date || !place) {toast('Fill in all required event fields.', 'error'); return;}
  org = getOrg(cur_id);
  if (id) {
    var item = org.events.find(function(event) {return event.id === Number(id);});
    if (!item) {toast('Event not found.', 'error'); return;}
    Object.assign(item, {title:title, date:date, place:place, time:time});
    toast('Event updated.', 'success');
  } else {
    org.events.push({id:nextId(org.events), title:title, date:date, place:place, time:time});
    toast('Event added.', 'success');
  }
  saveOrg(org);
  clearEvForm();
  renderEvents();
  renderStats();
}
function editEvent(id) {
    if (!canManageOrg(user.email, cur_id)) return;
    for (var i=0; i<org.events.length; i++) {
        if(org.events[i].id == id) {
            document.getElementById('evId').value = id;
            document.getElementById('evTitle').value = org.events[i].title;
            document.getElementById('evDate').value = org.events[i].date
            document.getElementById("evPlace").value = org.events[i].place;
            document.getElementById("evTime").value = org.events[i].time || "";
            document.getElementById("evBtn").innerText = "Update Event";
         }
    }
}



function deleteEvent(id) {
   if (!canManageOrg(user.email, cur_id)) { toast("No management access.", "error"); return; }
   if (!confirm("Delete this event?")) return;
  org = getOrg(cur_id);
  for (var i = 0; i < org.events.length; i++) {
    if (org.events[i].id == id){ org.events.splice(i,1); break; }
  }
  saveOrg(org);
  renderEvents();
  renderStats();
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
  if (!canManageOrg(user.email, cur_id)) { toast("No management access.", "error"); return; }
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
    renderStats();
    renderApps()
    renderMembers();
}
function rejectApp(id){
  if (!canManageOrg(user.email, cur_id)) { toast("No management access.", "error"); return; }
   org = getOrg(cur_id);
   for(var i = 0; i < org.applications.length; i += 1){   
      if(org.applications[i].id == id) { org.applications.splice(i, 1); break; }
   }
   saveOrg(org);
   toast("Application rejected", "info")
   renderApps();
   renderStats();
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
  if (!canManageOrg(user.email, cur_id)) { toast("No management access.", "error"); return; }
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
    renderStats();
}


function declineResign(id){
  if (!canManageOrg(user.email, cur_id)) { toast("No management access.", "error"); return; }
	org = getOrg(cur_id)
	for (var i = 0; i<org.resignations.length; i++) {
		if(org.resignations[i].id == id){ org.resignations.splice(i, 1); break; }
	}
	saveOrg(org);
		toast("Resignation declined", "info");
	renderResign();
    renderStats();
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
  if (!canManageOrg(user.email, cur_id)) { toast("No management access.", "error"); return; }
  if (role !== 'member' && role !== 'officer') { toast('Invalid role.', 'error'); return; }
	var mems = getMembers();
	for(var i = 0; i < mems.length; i += 1){
		if(mems[i].orgId == cur_id && mems[i].email==email && mems[i].role !== "president") { mems[i].role = role; }
	}
	saveMembers(mems);
	toast("Role updated", "success");
}

function removeMember(email, quiet){
  if (!canManageOrg(user.email, cur_id)) { toast("No management access.", "error"); return; }
  var mems = getMembers()   
    for (var i = 0; i < mems.length; i++) {
    if(mems[i].orgId == cur_id&&mems[i].email == email && mems[i].role != 'president'){
      mems.splice(i, 1);
      break;
    }
  }
  saveMembers(mems);
  renderStats();
  if(!quiet) toast("Member removed", 'info')
}


function kickMember(email) {
    if(!confirm("Remove this member?")) return;
    removeMember(email, false);
    renderMembers()
}


init();

// org statistics and announcements
function renderStats() {
  org = getOrg(cur_id);
  var metrics = [
    ['Members', countMembers(cur_id)],
    ['Pending applications', org.applications.length],
    ['Upcoming events', upcomingEvents(org).length],
    ['Announcements', org.announcements.length]
  ];
  document.getElementById('managementStats').innerHTML = metrics.map(function(m) {
    return '<div class="card stat"><div class="num">' + m[1] + '</div><span class="muted">' + m[0] + '</span></div>';
  }).join('');
}

function clearAnnForm() {
  document.getElementById('annId').value = '';
  document.getElementById('annTitle').value = '';
  document.getElementById('annContent').value = '';
  document.getElementById('annDate').value = new Date().toISOString().slice(0,10);
  document.getElementById('annVisibility').value = 'public';
  document.getElementById('annBtn').textContent = 'Publish Announcement';
}
function renderAnnouncements() {
  org = getOrg(cur_id);
  var html = org.announcements.slice().sort(function(a,b) {
    return b.date.localeCompare(a.date);
  }).map(function(a) {
    return '<div class="row"><div><b>' + esc(a.title) + '</b><p class="muted compact">' +
      esc(a.date) + ' &middot; ' + (a.visibility === 'members' ? 'Members only' : 'Public') +
      '</p><p>' + esc(a.content) + '</p></div><div><button class="btn small outline" onclick="editAnnouncement(' +
      a.id + ')">Edit</button> <button class="btn small red" onclick="deleteAnnouncement(' + a.id + ')">Delete</button></div></div>';
  }).join('');
  document.getElementById('annList').innerHTML = html || '<p class="muted">No announcements published.</p>';
}
function saveAnnouncement() {
  if (!canManageOrg(user.email, cur_id)) {toast('You cannot manage this organization.', 'error'); return;}
  var id = document.getElementById('annId').value;
  var title = document.getElementById('annTitle').value.trim();
  var content = document.getElementById('annContent').value.trim();
  var date = document.getElementById('annDate').value;
  var visibility = document.getElementById('annVisibility').value;
  if (!title || !content || !date) {toast('Complete the announcement fields.', 'error'); return;}
  org = getOrg(cur_id);
  if (id) {
    var item = org.announcements.find(function(a) {return a.id === Number(id);});
    if (!item) {toast('Announcement not found.', 'error'); return;}
    Object.assign(item, {title:title, content:content, date:date, visibility:visibility});
    toast('Announcement updated.', 'success');
  } else {
    org.announcements.push({id:nextId(org.announcements), title:title, content:content, date:date, visibility:visibility});
    toast('Announcement published.', 'success');
  }
  saveOrg(org);
  clearAnnForm();
  renderAnnouncements();
  renderStats();
}
function editAnnouncement(id) {
  if (!canManageOrg(user.email, cur_id)) return;
  var a = org.announcements.find(function(item) {return item.id === id;});
  if (!a) return;
  document.getElementById('annId').value = a.id;
  document.getElementById('annTitle').value = a.title;
  document.getElementById('annContent').value = a.content;
  document.getElementById('annDate').value = a.date;
  document.getElementById('annVisibility').value = a.visibility;
  document.getElementById('annBtn').textContent = 'Update Announcement';
}
function deleteAnnouncement(id) {
  if (!canManageOrg(user.email, cur_id)) { toast("No management access.", "error"); return; }
  if (!confirm('Delete this announcement?')) return;
  org = getOrg(cur_id);
  org.announcements = org.announcements.filter(function(a) {return a.id !== id;});
  saveOrg(org);
  renderAnnouncements();
  renderStats();
  toast('Announcement deleted.', 'info');
}
