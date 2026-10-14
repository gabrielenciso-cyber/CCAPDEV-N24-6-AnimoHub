// login and sign up page
if(localStorage.getItem('currentUser')){ location.href = "dashboard.html"; }
// makes the default data
getUsers(); getOrgs(); getMembers(); getCourses();

function showTab(t){
    document.getElementById("loginForm").style.display = (t == "login") ? "block" : "none";
   document.getElementById("signupForm").style.display = (t == 'signup') ? "block" : "none"
   document.getElementById("tabLogin").className = (t=="login") ? 'tab active' : "tab";
   document.getElementById("tabSignup").className = (t == 'signup') ? 'tab active' : "tab"
}

// student has _ and teacher has .
function detectRole(email){
    if (!/^[a-z0-9._-]+@dlsu\.edu\.ph$/.test(email)) return null
    var local = email.split("@")[0];
    if (local.indexOf("_") != -1) return 'student'
    if(local.indexOf(".") != -1) return "teacher";
    return null;
}

function checkEmail() {
  var email = document.getElementById("suEmail").value.trim().toLowerCase();
  var hintBox = document.getElementById('roleHint')
  var r = detectRole(email);
  if (email == "") { hintBox.innerText = ''; }
  else if(r == null){ hintBox.innerText = "Use your DLSU email (student: first_last@dlsu.edu.ph, teacher: first.last@dlsu.edu.ph)"; }
  else { hintBox.innerText = "Detected account type: " + r; }
}


function doLogin() {
  var email = document.getElementById("liEmail").value.trim().toLowerCase()
  var pw=document.getElementById("liPass").value;
  var u = getUserByEmail(email);
  if (email == '' || pw==""){ toast('Please fill in all fields', 'error'); return; }
  if(u == null || u.password != pw){
    toast("Wrong email or password", 'error');
    return;
  }
  localStorage.setItem("currentUser", u.email); 
  toast("Welcome " + u.name + '!', "success");
  setTimeout(function(){ location.href = 'dashboard.html'; }, 700);
}

function doSignup() {
	var name = document.getElementById('suName').value.trim();
	var email = document.getElementById('suEmail').value.trim().toLowerCase();
	var pw = document.getElementById('suPass').value;
	var pw2 = document.getElementById("suPass2").value
	var role = detectRole(email);

	if(name == "" || email == ""||pw == '') { toast('Please fill in all fields', 'error'); return; }
	if(role == null) { toast("Please use a valid DLSU email", 'error'); return; }
	if(pw.length < 6){ toast("Password must be at least 6 characters", "error"); return; }
	 if(pw != pw2) { toast("Passwords dont match", "error"); return; }
	if(getUserByEmail(email) != null){ toast("Email is already registered", 'error'); return; }

	var users = getUsers(); 
	users.push({email:email, password:pw,name:name, role:role, enlisted:[]});
	saveUsers(users)
	localStorage.setItem("currentUser", email);
	toast("Account created!", 'success');
	setTimeout(function () { location.href = 'dashboard.html'; }, 800);
}


applyTheme();

