// single organization page
var user = checkLogin();
var params = new URLSearchParams(location.search);
var orgId = Number(params.get('id'));
var org = null;
var my_role = 'none';
var form_type = '';

function hasPending(type) {
  if (!org) return false;
  var items = type === 'resign' ? org.resignations : org.applications;
  return items.some(function(item) {
    return item.email === user.email && (type === 'resign' || item.type === type);
  });
}
function orgBadge(role) {
  return '<span class="badge ' + esc(role) + '">' + esc(role) + '</span>';
}
function render() {
  org = getOrg(orgId);
  var box = document.getElementById('orgPage');
  if (!org) {
    box.innerHTML = '<div class="card">Organization not found. <a href="organizations.html">Return to the catalogue</a></div>';
    return;
  }
  my_role = getRole(user.email, orgId);
  var manager = canManageOrg(user.email, orgId);
  var president = isPresidentOf(user.email, orgId);
  document.title = 'AnimoHub - ' + org.name;

  var buttons = '';
  if (user.role === 'student') {
    if (my_role === 'none') {
      if (hasPending('member')) buttons = '<span class="badge warn">Application pending</span>';
      else if (org.recruiting) buttons = '<button class="btn" onclick="openForm(\'member\')">Apply to Join</button>';
      else buttons = '<span class="badge full">Recruitment closed</span>';
    } else {
      buttons = orgBadge(my_role) + ' Active member';
      if (my_role === 'member') {
        if (hasPending('officer')) buttons += ' <span class="badge warn">Officer application pending</span>';
        else if (org.officerHiring) buttons += ' <button class="btn" onclick="openForm(\'officer\')">Apply for Officer</button>';
      }
      if (my_role !== 'president') {
        buttons += hasPending('resign') ? ' <span class="badge warn">Resignation pending</span>' : ' <button class="btn red" onclick="openForm(\'resign\')">Request Resignation</button>';
      }
    }
  }
  if (manager) buttons += ' <a class="btn outline contrast" href="orgsettings.html?id=' + org.id + '">Manage Organization</a>';

  var allMembers = getMembers().filter(function(m) {return m.orgId === orgId;});
  var leaders = allMembers.filter(function(m) {return m.role !== 'member';});
  var leadersHtml = leaders.map(function(m) {
    var member = getUserByEmail(m.email);
    return '<div class="row"><span>' + esc(member ? member.name : m.email) + '</span>' + orgBadge(m.role) + '</div>';
  }).join('') || '<p class="muted">No officers listed.</p>';

  var eventHtml = (org.events || []).slice().sort(function(a,b) {return a.date.localeCompare(b.date);}).map(function(e) {
    return '<div class="row"><div><b>' + esc(e.title) + '</b><p class="muted compact">' + esc(e.place) + '</p></div><span class="badge ok">' + esc(e.date) + (e.time ? ' ' + esc(e.time) : '') + '</span></div>';
  }).join('') || '<p class="muted">No events have been scheduled.</p>';

  var visibleAnnouncements = (org.announcements || []).filter(function(a) {
    return a.visibility !== 'members' || my_role !== 'none' || user.role === 'admin';
  }).slice().sort(function(a,b) {return b.date.localeCompare(a.date);});
  var announcementHtml = visibleAnnouncements.map(function(a) {
    return '<article class="announcement"><div class="row"><b>' + esc(a.title) + '</b><span class="muted">' + esc(a.date) + '</span></div><p>' + esc(a.content) + '</p>' + (a.visibility === 'members' ? '<span class="badge officer">Members only</span>' : '') + '</article>';
  }).join('') || '<p class="muted">No announcements available.</p>';

  var statHtml = '<div class="grid org-stats">' +
    '<div class="card stat"><div class="num">' + allMembers.length + '</div><div class="muted">Members</div></div>' +
    '<div class="card stat"><div class="num">' + upcomingEvents(org).length + '</div><div class="muted">Upcoming events</div></div>' +
    '<div class="card stat"><div class="num">' + visibleAnnouncements.length + '</div><div class="muted">Announcements</div></div></div>';

  var html = '<section class="orgbanner" style="background:' + esc(org.color) + '">' +
    '<span class="eyebrow">' + esc(org.category) + ' / ' + esc(org.orgType) + '</span>' +
    '<h1>' + esc(org.name) + '</h1><p>' + allMembers.length + ' members &middot; ' + (org.recruiting ? 'Recruiting' : 'Not recruiting') + '</p>' +
    '<div class="org-actions">' + buttons + '</div></section>' + statHtml;
  html += '<div class="org-detail-grid"><div><section class="card"><h2>About ' + esc(org.name) + '</h2><p>' + esc(org.desc) + '</p></section>';
  if (my_role !== 'none') html += '<section class="card"><h2>My Membership</h2><div class="row"><span>Status: Active</span>' + orgBadge(my_role) + '</div></section>';
  html += '<section class="card"><h2>Announcements</h2>' + announcementHtml + '</section>';
  html += '<section class="card"><h2>Events</h2>' + eventHtml + '</section></div>';
  html += '<aside><section class="card"><h3>Organization Information</h3><div class="row"><span>College</span><b>College of Computer Studies</b></div>' +
    '<div class="row"><span>Category</span><b>' + esc(org.category) + '</b></div>' +
    '<div class="row"><span>Type</span><b>' + esc(org.orgType) + '</b></div>' +
    '<div class="row"><span>Recruitment</span><b>' + (org.recruiting ? 'Open' : 'Closed') + '</b></div>' +
    '<div class="row"><span>Officer hiring</span><b>' + (org.officerHiring ? 'Open' : 'Closed') + '</b></div></section>' +
    '<section class="card"><h3>Organization Officers</h3>' + leadersHtml + '</section></aside></div>';
  if (manager) {
    html += '<section class="card"><h2>Organization Dashboard</h2><div class="grid org-stats">' +
      '<div class="card stat"><div class="num">' + org.applications.length + '</div><div class="muted">Pending applications</div></div>' +
      '<div class="card stat"><div class="num">' + org.resignations.length + '</div><div class="muted">Pending resignations</div></div></div>' +
      '<p><a class="btn" href="orgsettings.html?id=' + org.id + '">Open Management Dashboard</a></p>' +
      (president ? '<p class="muted">President controls include organization identity, appearance, and recruitment settings.</p>' : '') + '</section>';
  }
  box.innerHTML = html;
}
function openForm(type) {
  org = getOrg(orgId);
  my_role = getRole(user.email, orgId);
  var allowed = user.role === 'student' && (
    (type === 'member' && my_role === 'none' && org.recruiting && !hasPending(type)) ||
    (type === 'officer' && my_role === 'member' && org.officerHiring && !hasPending(type)) ||
    (type === 'resign' && (my_role === 'officer' || my_role === 'member') && !hasPending(type))
  );
  if (!allowed) {toast('This form is not currently available.', 'error'); return;}
  form_type = type;
  var data = {
    member: ['Membership Application', 'Why do you want to join?'],
    officer: ['Officer Application', 'Why do you want to become an officer?'],
    resign: ['Resignation Request', 'Why would you like to leave?']
  }[type];
  document.getElementById('formTitle').textContent = data[0];
  document.getElementById('formLabel').textContent = data[1];
  document.getElementById('formReason').value = '';
  openModal('formModal');
}
function submitForm() {
  var reason = document.getElementById('formReason').value.trim();
  if (!reason) {toast('Please explain your request.', 'error'); return;}
  org = getOrg(orgId);
  my_role = getRole(user.email, orgId);
  if (hasPending(form_type)) {toast('You already submitted this request.', 'error'); return;}
  if (form_type === 'resign' && (my_role === 'member' || my_role === 'officer')) {
    org.resignations.push({id:nextId(org.resignations),email:user.email,name:user.name,reason:reason,date:new Date().toISOString().slice(0,10)});
    toast('Resignation request submitted.', 'success');
  } else if ((form_type === 'member' && my_role === 'none' && org.recruiting) ||
             (form_type === 'officer' && my_role === 'member' && org.officerHiring)) {
    org.applications.push({id:nextId(org.applications),email:user.email,name:user.name,reason:reason,type:form_type,date:new Date().toISOString().slice(0,10)});
    toast('Application submitted for review.', 'success');
  } else {toast('This request is no longer available.', 'error'); return;}
  saveOrg(org);
  closeModal('formModal');
  render();
}
render();
