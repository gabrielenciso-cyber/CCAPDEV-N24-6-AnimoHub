// sample data and helper functions

var DAYS = {M:'Mon', T:'Tue', W:"Wed", H:"Thu",F:"Fri", S:"Sat"}
var TIMES = ["08:00-09:30","09:45-11:15","11:30-13:00",'13:15-14:45',"15:00-16:30",'16:45-18:15']
var MAX_UNITS=24;


var defaultCourses = [
	{code:"CCPROG3", name:"Object-Oriented Programming", units:3, sections:[
		{sec:"S11", days:"MH", time:'08:00-09:30', modes:["Onsite",'Onsite'], room:"G302",prof:"Reyes, Carlo", slots:3, max:40},
		 {sec:"S12",days:'TF', time:'09:45-11:15', modes:["Online","Online"], room:'Online',prof:"Reyes, Carlo", slots:0, max:40},
		{sec:'S13', days:'WS', time:"11:30-13:00", modes:["Onsite","Online"], room:'G304', prof:"Cruz, Ana",slots:12, max:40}
	]},
	{code:"CCAPDEV", name:"Web Application Development", units:3, sections:[
		{sec:"S11", days:'TF', time:'08:00-09:30', modes:["Onsite","Onsite"], room:"G306", prof:"Santos, Miguel", slots:8, max:35},
		{sec:"S12", days:"MH", time:'13:15-14:45', modes:['Online',"Onsite"], room:"G306", prof:'Lim, Patricia', slots:1, max:35}
	]},
	{code:'CSALGCM', name:'Algorithms and Complexity',units:3, sections:[
		{sec:'S11', days:"MH", time:"09:45-11:15", modes:["Onsite",'Online'], room:'G210', prof:'Tan, Roberto',slots:10, max:40},
		{sec:'S12', days:'WS', time:"15:00-16:30", modes:["Online",'Online'], room:"Online",prof:"Tan, Roberto", slots:0, max:40}
	]},
{code:"CSARCH1", name:'Computer Organization and Architecture', units:3, sections:[
  {sec:'S11', days:"TF", time:"11:30-13:00",modes:["Onsite","Onsite"], room:"G201", prof:'Villanueva, Joel', slots:14,max:40},
    {sec:"S12", days:'MH', time:'15:00-16:30', modes:["Onsite","Online"], room:'G201', prof:"Villanueva, Joel", slots:5, max:40}
  ]},
  {code:"ITNET04", name:'Networking 2', units:3, sections:[
    {sec:"S11", days:'WS', time:"08:00-09:30", modes:["Onsite",'Onsite'], room:"G404", prof:"Garcia, Elena", slots:6, max:30},
    {sec:"S12", days:"TF", time:"13:15-14:45", modes:['Onsite',"Online"], room:'G404', prof:'Garcia, Elena', slots:15, max:30}
  ]},
{code:"CCDSTRU", name:"Data Structures and Algorithms", units:4, sections:[
      {sec:"S11",days:'MH', time:"11:30-13:00", modes:["Onsite","Onsite"], room:'G310', prof:"Ocampo, Liza", slots:0, max:40},
   {sec:'S12', days:"TF", time:"15:00-16:30",modes:['Online',"Online"], room:"Online", prof:'Ocampo, Liza',slots:20, max:45}
   ]},
   {code:"STETHIC", name:'Ethics', units:3, sections:[
      {sec:'S11', days:"WS", time:'13:15-14:45', modes:["Online","Online"], room:"Online", prof:"Mendoza, Paolo", slots:25, max:45},
      {sec:'S12', days:"TF", time:"16:45-18:15", modes:['Onsite',"Onsite"], room:"A1005", prof:"Mendoza, Paolo", slots:9, max:45}
   ]}
]
var defaultUsers = [
  {email:'admin@dlsu.edu.ph', password:"admin123", name:'ITS Admin', role:"admin", enlisted:[]},
  {email:"juan_delacruz@dlsu.edu.ph", password:"pass123", name:"Juan Dela Cruz", role:'student',
    enlisted:[{code:'CCPROG3', sec:'S11'}, {code:"CCAPDEV",sec:"S11"},{code:"ITNET04",sec:"S11"}]},
  {email:"maria_santos@dlsu.edu.ph",password:'pass123', name:'Maria Santos',role:"student",
    enlisted:[{code:'CCAPDEV',sec:"S12"}, {code:"CSALGCM",sec:"S11"}]},
  {email:"pedro_reyes@dlsu.edu.ph", password:"pass123", name:"Pedro Reyes", role:"student", enlisted:[]},
  {email:"ana_lim@dlsu.edu.ph", password:"pass123", name:'Ana Lim', role:"student", enlisted:[]},
  {email:'jose.rizal@dlsu.edu.ph', password:"pass123", name:"Jose Rizal", role:"teacher", enlisted:[]}
]
var defaultOrgs = [
	{id:1, name:"Computer Society", desc:'The home of CCS students who love coding, hackathons and tech talks. We hold workshops every term.', color:'#0b6b3a', recruiting:true, officerHiring:false,
		events:[{id:1, title:'Annual Recruitment Week', date:'2026-10-20', place:"Henry Sy Hall Lobby"},{id:2, title:"Intro to Git Workshop", date:"2026-11-05", place:'G302'}],
		applications:[{id:1, email:'ana_lim@dlsu.edu.ph', name:"Ana Lim", reason:'I want to learn more about programming.', type:"member"}], resignations:[]},
	 {id:2, name:"Game Developers Guild", desc:'We make games together! Game jams, art and sound collabs, and playtesting nights.', color:"#8e44ad", recruiting:true,officerHiring:true,
		events:[{id:1, title:"Game Jam 2026", date:"2026-11-14", place:"Gokongwei Hall"}], applications:[], resignations:[]},
	{id:3, name:"Cybersecurity Circle", desc:'CTFs, security talks and ethical hacking training for everyone who is curious.',color:'#c0392b',recruiting:false, officerHiring:false,
		events:[{id:1, title:"CTF Night", date:"2026-12-02", place:'Online'}], applications:[], resignations:[]},
	{id:4, name:"Data Science Society", desc:'Learn data analysis, machine learning and visualization with other students.', color:'#2471a3', recruiting:true, officerHiring:false,
		events:[], applications:[], resignations:[]},
	{id:5, name:"Robotics Club", desc:'Build robots, join competitions, and tinker with microcontrollers.', color:"#d68910", recruiting:false, officerHiring:true,
		events:[{id:1,title:'Line Follower Contest', date:'2026-11-28', place:'Br. Andrew Gonzalez Hall'}], applications:[], resignations:[]}
];

var defaultMembers = [
    {orgId:1, email:"juan_delacruz@dlsu.edu.ph", role:"president"},
    {orgId:1, email:"maria_santos@dlsu.edu.ph",role:'officer'},
    {orgId:1, email:"pedro_reyes@dlsu.edu.ph", role:"member"},
    {orgId:2,email:'maria_santos@dlsu.edu.ph', role:"president"},
    {orgId:2, email:"pedro_reyes@dlsu.edu.ph", role:"member"},
    {orgId:3, email:'pedro_reyes@dlsu.edu.ph', role:"president"},
    {orgId:4, email:'juan_delacruz@dlsu.edu.ph', role:'member'}
]

// get and save data from localstorage
function getData(key, def) {
  var s=localStorage.getItem(key);
  if (s == null) {
    localStorage.setItem(key, JSON.stringify(def));
    return JSON.parse(JSON.stringify(def));
  }
  return JSON.parse(s);
}
function setData(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getUsers(){ return getData("users", defaultUsers); }
function saveUsers(u){ setData('users', u); }
function getOrgs() { return getData("orgs", defaultOrgs); }
function saveOrgs(o){ setData("orgs", o); }
function getMembers() { return getData('members', defaultMembers); }
function saveMembers(m){ setData("members", m); }
function getCourses() { return getData("courses", defaultCourses); }
function saveCourses(c){ setData('courses', c); }

function getUserByEmail(email) {
  var users = getUsers(); 
  for(var i = 0; i < users.length; i += 1){
    if(users[i].email == email) return users[i]
  }
  return null;
}

function saveUser(user){
  var users = getUsers();
  for(var i = 0; i < users.length; i += 1) {
    if(users[i].email == user.email){ users[i] = user; }
  }
  saveUsers(users)
}


function getOrg(id) {
  var orgs = getOrgs();
  for(var i = 0; i < orgs.length; i += 1){
    if (orgs[i].id == id) return orgs[i]
  }
  return null;
}

function saveOrg(org) {
	var orgs = getOrgs();
	for(var i = 0; i < orgs.length; i += 1){
		if (orgs[i].id == org.id){ orgs[i] = org; }
	}
	saveOrgs(orgs);
}



function nextId(list) {
  var m = 0;
  for(var i = 0; i < list.length; i++){
    if(list[i].id > m) m = list[i].id;
  }
  return m + 1
}


// returns president, officer, member or none
function getRole(email, orgId){
	var m = getMembers();
	for (var i = 0; i<m.length; i++){
			 if(m[i].orgId == orgId&&m[i].email == email) return m[i].role;
	}
	return 'none';
}

function countMembers(orgId){
    var m = getMembers();  
    var c = 0;
    for (var i = 0; i < m.length; i += 1){
        if (m[i].orgId == orgId) c += 1;
    }
    return c;
}

// orgs the user can manage
function managedOrgs(email){
  var res = []
  var orgs = getOrgs();
  var u = getUserByEmail(email)
  for (var i=0; i < orgs.length; i++) {
    var r = getRole(email, orgs[i].id);
    if(r == 'president'||r == 'officer'||(u && u.role == "admin")) {
      res.push(orgs[i])
    }
  }
  return res;
}

function findSection(code, sec){
	var courses = getCourses();
	for(var i = 0; i < courses.length; i++){
		if (courses[i].code==code) {
			for (var j = 0; j < courses[i].sections.length; j++){  
				if (courses[i].sections[j].sec == sec) {
					return {course:courses[i], section:courses[i].sections[j]};
				}
			}
		}
	}
	 return null;
}


function changeSlots(code, sec,n){
  var courses = getCourses();
  for(var i = 0; i < courses.length; i++){
    if(courses[i].code == code){
      for(var j = 0; j < courses[i].sections.length; j++) {
        if(courses[i].sections[j].sec == sec){ courses[i].sections[j].slots += n; }
      }
     }
  }
  saveCourses(courses)
}




function totalUnits(user) {
  var t = 0;
  for (var i = 0; i < user.enlisted.length; i += 1){
    var f = findSection(user.enlisted[i].code, user.enlisted[i].sec);
    if (f != null) t += f.course.units;
  }
  return t;
} 
// enlist a course, returns true if it worked
function doEnlist(code,sec) {
    var u = getUser();
    if(u == null || u.role != "student") {
        toast('Only students can enlist', 'error');
        return false;
    }
    var f=findSection(code,sec);
    if (f == null) { toast("Section not found", 'error'); return false; }

    for (var i = 0; i<u.enlisted.length; i++) {
        if (u.enlisted[i].code==code) {
            toast("You already enlisted " + code, "error");
            return false;
        }
    }
    if (f.section.slots <= 0) { toast("Section is full", 'error'); return false; }
    if (totalUnits(u) + f.course.units > MAX_UNITS){
        toast("Max units reached (" + MAX_UNITS + ')', "error");
        return false;
    }
     for(var i = 0; i < u.enlisted.length; i++) {
        var o=findSection(u.enlisted[i].code, u.enlisted[i].sec);
        if (o==null) continue
        if(o.section.time == f.section.time) {
            for (var k = 0; k < f.section.days.length; k++){
                if(o.section.days.indexOf(f.section.days.charAt(k))!=-1) {
                    toast('Schedule conflict with ' + o.course.code, 'error')
                    return false;
                }
            }
        }
    }

    u.enlisted.push({code:code,sec:sec});
    saveUser(u);
    changeSlots(code, sec, -1)
    toast('Enlisted in ' + code + ' ' + sec, 'success');
    return true;
}

function doDrop(code) {
  var u=getUser();
   for (var i = 0; i < u.enlisted.length; i++) {
    if (u.enlisted[i].code == code) {
       var sec = u.enlisted[i].sec;
       u.enlisted.splice(i, 1)
       saveUser(u);
      changeSlots(code, sec, 1)
      toast("Dropped " + code, 'info');
      return true;
    }
  }
  return false;
}
