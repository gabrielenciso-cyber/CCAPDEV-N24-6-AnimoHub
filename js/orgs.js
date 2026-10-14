// organizations page
var user=checkLogin();

function buildCarousel(){
	var orgs = getOrgs();
	var h = "";
	var n = 0;
	for (var i = 0; i < orgs.length; i += 1){
		if (!orgs[i].recruiting) continue;
		if(n >= 3) break;
		h += '<div class="slide" style="background:' + orgs[i].color + '"><p>Now recruiting</p><h2>' + esc(orgs[i].name) + '</h2><p>' + esc(orgs[i].desc.substring(0, 100)) + '...</p><a class="btn" href="org.html?id=' + orgs[i].id+'">View organization</a></div>';
		n++;
	}
	if (h == ""){ document.getElementById('carousel').style.display = 'none'; return; }
	document.getElementById('slides').innerHTML = h
	makeCarousel("carousel");
}

function render(){
    var q = document.getElementById("search").value.toLowerCase();
     var recVal=document.getElementById("recFilter").value;
     var category=document.getElementById("categoryFilter").value;
     var shown = 0;
    var orgs = getOrgs();
    var h = ""

    for (var i = 0; i < orgs.length; i++) {
        var o = orgs[i];
        if (q!='' && (o.name + ' '+o.desc).toLowerCase().indexOf(q) == -1) continue;
        if (recVal == "open" && !o.recruiting) continue
        if(recVal == 'closed' && o.recruiting) continue;
         if (category !== 'all' && o.category !== category) continue;
         shown++;
        var role = getRole(user.email, o.id);
        var role_badge = '';
        if (role != "none") role_badge = ' <span class="badge ' + role + '">' + role + '</span>';

        h += '<div class="card hover"><div class="stripe" style="background:' + o.color + '"></div>'
        h += '<div class="muted">' + esc(o.category) + ' &middot; ' + esc(o.orgType) + '</div>';
        h += '<h3>' + esc(o.name)+'</h3>' + role_badge;  
        h += '<p class="muted">'+esc(o.desc.length > 90 ? o.desc.substring(0, 90) + "..." : o.desc) + '</p>';
        h += '<p><span class="badge ' + (o.recruiting ? "ok" : 'full')+'">' + (o.recruiting ? "Recruiting" : 'Closed') + '</span> <span class="muted">' + countMembers(o.id) + ' members</span></p>';
        h += '<a class="btn" href="org.html?id=' + o.id + '">View</a></div>';
    }
    if (h == "") { h = '<div class="card muted">No organizations found.</div>'; }
    document.getElementById("orgGrid").innerHTML = h;
    document.getElementById("resultsCount").textContent = shown + ' organization' + (shown === 1 ? '' : 's') + ' found';
}


buildCarousel();
render()
