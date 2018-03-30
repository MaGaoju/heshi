function getCookie(key) {
	var name = key + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
					c = c.substring(1);
			 }
			if (c.indexOf(name)  == 0) {
					return c.substring(name.length, c.length);
			 }
	};
	return "";
}

function checkCookie(host, key)
{
  var sessionID = getCookie(key);
  if (sessionID == "")
  {
    document.getElementById('myaccountbtn').setAttribute("href", "login.html"); 
    document.getElementById('myaccountbtn').innerHTML = "<span class='glyphicon glyphicon-user' aria-hidden='true'></span>登录 | 注册";
    document.getElementById('myaccountbtnlogout').setAttribute("style", "visibility: hidden;");
    document.getElementById('myaccountbtn-mobile').setAttribute("href", "login.html"); 
    document.getElementById('myaccountbtn-mobile').innerHTML = "<span class='glyphicon glyphicon-user' aria-hidden='true'></span>登录 | 注册";
    document.getElementById('myaccountbtnlogout-mobile').setAttribute("style", "visibility: hidden;");
    return false;
  }
  else
  {
    document.getElementById('myaccountbtn').setAttribute("href", "myprofile.html"); 
    document.getElementById('myaccountbtn').innerHTML = "<span class='glyphicon glyphicon-user' aria-hidden='true'></span>用户信息";
    document.getElementById('myaccountbtnlogout').setAttribute("style", "visibility: display;");
    document.getElementById('myaccountbtn-mobile').setAttribute("href", "myprofile.html"); 
    document.getElementById('myaccountbtn-mobile').innerHTML = "<span class='glyphicon glyphicon-user' aria-hidden='true'></span>用户信息";
    document.getElementById('myaccountbtnlogout-mobile').setAttribute("style", "visibility: display;");
    return true;
  };
}
