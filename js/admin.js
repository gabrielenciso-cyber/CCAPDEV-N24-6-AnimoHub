// admin page
var user = checkLogin();
if (user.role != "admin"){ location.href = 'dashboard.html'; }

function getPresident(orgId){
  var m = getMembers();
  for (var i = 0; i < m.length; i++){
    if (m[i].orgId == orgId && m[i].role == "president") return m[i].email;
  }
  return ""
}

function renderOrgs(){
  var orgs = getOrgs();
  var h=""
  for(var i = 0; i < orgs.length; i += 1) {
    var o=orgs[i];
    h += '<tr><td>' + esc(o.name) + '</td><td>' + (getPresident(o.id) || '-') + '</td><td>' + countMembers(o.id) + '</td>'
    h += '<td><button class="btn small outline" onclick="editOrg(' + o.id + ')">Edit</button> <button class="btn small red" onclick="deleteOrg(' + o.id + ')">Delete</button></td></tr>';
  }
  document.getElementById("orgRows").innerHTML=h;
}

function newOrg() {
	document.getElementById("orgFormTitle").innerText = "Add Organization";
	document.getElementById("oId").value = '';
	document.getElementById("oName").value="";
	 document.getElementById("oDesc").value = "";
	document.getElementById("oPres").value="";
	openModal("orgModal")
}
function editOrg(id) {
  var o = getOrg(id)
  document.getElementById("orgFormTitle").innerText = 'Edit Organization';
  document.getElementById('oId').value = id;
  document.getElementById('oName').value = o.name
  document.getElementById("oDesc").value = o.desc;
  document.getElementById('oPres').value=getPresident(id);
   openModal("orgModal");
}

function saveOrgForm(){
  var id=document.getElementById('oId').value;
  var name = document.getElementById("oName").value.trim();
  var desc = document.getElementById("oDesc").value.trim();
  var presEmail=document.getElementById("oPres").value.trim().toLowerCase();

  if(name=="" || desc == "" || presEmail == "") { toast('Please fill in all fields', 'error'); return; }
  var presUser = getUserByEmail(presEmail)
  if(presUser==null || presUser.role != "student"){ toast('President must be a registered student email', "error"); return; }
  var orgs = getOrgs()
  var orgId; 
  if(id == "") {
     orgId=nextId(orgs);  
    orgs.push({id:orgId, name:name, desc:desc,color:"#0b6b3a", recruiting:true, officerHiring:false, events:[], applications:[], resignations:[]});
    toast("Organization added", "success");   
  }
  else {
    orgId = parseInt(id);
    for(var i = 0; i < orgs.length; i += 1) {
      if (orgs[i].id == orgId){ orgs[i].name = name; orgs[i].desc = desc; }
    }
    toast('Organization updated', 'success');
  }
  saveOrgs(orgs);

  // give the president role
  var mems = getMembers()
  var found = false;
  for (var i=0; i < mems.length; i += 1) {
     if (mems[i].orgId == orgId && mems[i].role == "president" && mems[i].email != presEmail) { mems[i].role = "member"; }
    if(mems[i].orgId == orgId&&mems[i].email == presEmail){ mems[i].role = 'president'; found = true; }
  }
  if(!found) mems.push({orgId:orgId, email:presEmail,role:"president"});
  saveMembers(mems);

  closeModal('orgModal')
  renderOrgs();
}


function deleteOrg(id) {
	if(!confirm('Delete this organization? This cant be undone.')) return;
	var orgs = getOrgs()
	for (var i = 0; i < orgs.length; i += 1){
		if(orgs[i].id==id){ orgs.splice(i, 1); break; }
	}
	saveOrgs(orgs);
	var mems=getMembers()
	var keep = [];
	for (var i = 0; i<mems.length; i++) { 
		if(mems[i].orgId != id) keep.push(mems[i]);
	}
	saveMembers(keep)
	 renderOrgs();
	toast("Organization deleted", 'info');
}


// make new admin account
function createAdmin() {
    var name = document.getElementById("aName").value.trim();
    var em = document.getElementById("aEmail").value.trim().toLowerCase()
    var pw = document.getElementById("aPass").value;   
    if (name==''||em == "" || pw == ""){ toast('Fill in all fields', "error"); return; }
    if(em.indexOf("@dlsu.edu.ph") == -1){ toast('Use a DLSU email', 'error'); return; }
    if (pw.length < 6){ toast('Password must be at least 6 characters', "error"); return; }
    if(getUserByEmail(em)!=null) { toast('Email already exists', "error"); return; }
    var users = getUsers();
    users.push({email:em,password:pw, name:name, role:'admin',enlisted:[]});
    saveUsers(users);
    document.getElementById('aName').value = "";
    document.getElementById("aEmail").value = "";
    document.getElementById("aPass").value = ""
    toast("Admin account created", 'success');
}


renderOrgs();
