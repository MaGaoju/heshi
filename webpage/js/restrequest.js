 var accessToken = 'Jbm6XfXQj/KqmMTqz6c4GQWl9U6JMLQ/T4LzPWIEi2W2Q23GDkuIfxvbUC/rar8ZJIWWSVo68fZ/hv6n0oAeXaQKEfhKmGUZ8m8JHm5TteBZwqZuqXAbOeowTJVBn8aaUhfSfZbmgNnXwDEnhjZ1DZ8jG2Khy9uzoHu5ogwbVHQ=';
 var baseURI = 'https://localhost:8443/';

 function userregister()
 {
		var auth_token = accessToken;
		
		var url_base = baseURI + 'api/users';
		
		var requestPayload = {
			'cellphone': $('input#tel').val(),
			'username': $('input#realname').val(),
			'password':  $('input#newaccountpassword').val(),
			'email': $('input#newaccountemail').val(),
			'user_type': 'customer'
		};

	$.ajax({
		'url': url_base,
		'type': 'POST',
		'content-Type': 'multipart/form-data',
		'headers': {
			// Use access_token 
			'X-Auth-Token': auth_token
		},
		'xhrFields':{withCredentials:true},
		'data': requestPayload,
		'success': function (result) {
			//Process success actions
		//	accessToken = result.access_token;
			baseURI = result.resource_server_base_uri;
			document.getElementById('userloginform').innerHTML = "注册成功！";
			setTimeout(document.location.href = 'login.html',"5000")
			return result;
		},
		'error': function (XMLHttpRequest, responseText) {
			//Process error actions
			document.getElementById('userloginform').innerHTML ='Error: ' + XMLHttpRequest.responseText ;
			sleep(2000);
			document.location.href = 'register.html';
			return false;
		}
 	});
}


 function userlogin()
 {
		var auth_token = accessToken;
		
		var url_base = baseURI + 'api/login';
		
		var requestPayload = {
			'username': $('input#loginkey').val(),
			'password':  $('input#accountpassword').val(),
			'user_type': $('select#usertype').val(),
		};

	$.ajax({
		'url': url_base,
		'type': 'POST',
		'content-Type': 'multipart/form-data',
		'headers': {
			// Use access_token previously retrieved from inContact token 
			// service.
			'X-Auth-Token': auth_token
		},
		'xhrFields': {withCredentials:true},
		'data': requestPayload,
		'success': function (result) {
			//Process success actions
		//	accessToken = result.access_token;
			baseURI = result.resource_server_base_uri;
			if (checkCodeFromresult(result))
			{document.getElementById('userloginform').innerHTML ='错误: ' + result["message"] ;
			setTimeout(function(){document.location.href = 'login.html';}, 3000);
			return false;
		  }
			else
			setTimeout(function(){document.location.href = 'home.html';}, 3000);
			var userprofile=result["userprofile"];
			userprofile = JSON.parse(userprofile);
			sessionStorage.setItem("UUID", userprofile["id"]);
			sessionStorage.setItem("token", "Bearer "+result["token"]);
			return true;
		},
		'error': function (XMLHttpRequest, responseText) {
			//Process error actions
			document.getElementById('userloginform').innerHTML ='错误: ' + XMLHttpRequest.responseText ;
			setTimeout(function(){document.location.href = 'login.html';}, 3000);
		
			return false;
		}
 	});
}

function userlogout() {
	var auth_token = sessionStorage.token;
	var url_base = baseURI + 'api/customer/logout';
	 $.ajax({
		 'url': url_base,
		 'type': 'POST',
		 'content-Type': 'x-www-form-urlencoded',
		 'dataType': 'json',
		 'xhrFields': {withCredentials:true},
		 'headers': {
		   // Use access_token
			 'Authorization' : auth_token,
			 'X-Auth-Token': accessToken
		 },
		 
		 'success': function (result) {
			 //Process success actions
			 sessionStorage.clear();
			 location.reload(true);
			 return true
		 },
		 'error': function (XMLHttpRequest, textStatus, errorThrown) {
		   //Process error actions
			 //TODO error handling 
		   return false;
		 }
	 });
 }

 function getToken() {
	 var url_base = 
		'';

	 // The auth_token is the base64 encoded string for the API 
	 // application.
	 var auth_token = accessToken;
	 auth_token = window.btoa(auth_token);
	 var requestPayload = {
		 // Enter your inContact credentials for the 'username' and 
		 // 'password' fields.
		 'grant_type': 'password',
		 'username': 'YourUsernameHere',
		 'password': 'YourPasswordHere',
		 'scope': ''
	 }
	 $.ajax({
		 'url': url_base,
		 'type': 'POST',
		 'content-Type': 'x-www-form-urlencoded',
		 'dataType': 'json',
		 'xhrFields': {withCredentials:true},
		 'headers': {
		   // Use access_token previously retrieved from inContact token 
		   // service.
		   'Authorization': 'basic ' + auth_token
		 },
		 'data': requestPayload,
		 'success': function (result) {
		   //Process success actions
		   accessToken = result.access_token;
		   baseURI = result.resource_server_base_uri;
		   document.getElementById('pageDiv').innerHTML = result.access_token;
		   return result;
		 },
		 'error': function (XMLHttpRequest, textStatus, errorThrown) {
		   //Process error actions
		   console.log(XMLHttpRequest.status + ' ' + 
			   XMLHttpRequest.statusText);
		   return false;
		 }
	 });
   }

 // List products
 function getproductsList(Jtype) {
	var auth_token = accessToken;
	var url_base = baseURI + 'api/products/'+ Jtype;

 $.ajax({
		 'url': url_base,
		 'type': 'GET',
		 'content-Type': 'x-www-form-urlencoded',
		 'dataType': 'json',
		 'xhrFields': {withCredentials:true},
		 'headers': {
		   // Use access_token 
		   'X-Auth-Token': auth_token
		 },
		 'success': function (result) {
		   //Process success actions
			document.getElementById('productsList').innerHTML = renderJresult(result, "没有对应的产品")
		
			 return true
		 },
		 'error': function (XMLHttpRequest, textStatus, errorThrown) {
		   //Process error actions
			 document.getElementById('productsList').innerHTML = XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText;
		   return false;
		 }
	 });
 }

 function getproductbyID(Jtype) {
	var auth_token = accessToken;
	var url_base = baseURI + 'api/products/search/'+ Jtype;
	var requestPayload = { 
		// search prosuct by Stok_ID
		'ref': $('input[name=searchref]').val(),
	};
	 $.ajax({
		 'url': url_base,
		 'type': 'POST',
		 'content-Type': 'x-www-form-urlencoded',
		 'dataType': 'json',
		 'xhrFields':{withCredentials:true},
		 'data': requestPayload,
		 'headers': {
		   // Use access_token 
		   'X-Auth-Token': auth_token
		 },
		 
		 'success': function (result) {
		   //Process success actions
		
		 document.getElementById('productsList').innerHTML = renderJresult(result, "没有对应ID的产品")
			return true
		 },
		 'error': function (XMLHttpRequest, textStatus, errorThrown) {
		   //Process error actions
			 document.getElementById('productsList').innerHTML = XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText;
		   return false;
		 }
	 });
 }

 function getproductsbyCategory(Jtype, category) {
	var auth_token = accessToken;
	var url_base = baseURI + 'api/products/filter/'+ Jtype;
	var requestPayload = {
		// search prosuct by Stok_ID
		'category': category,
	};
	 $.ajax({
		 'url': url_base,
		 'type': 'POST',
		 'content-Type': 'x-www-form-urlencoded',
		 'dataType': 'json',
		 'xhrFields':{withCredentials:true},
		 'data': requestPayload,
		 'headers': {
		   // Use access_token 
		   'X-Auth-Token': auth_token
		 },
		 
		 'success': function (result) {
		   //Process success actions
			 document.getElementById('productsList').innerHTML = renderJresult(result, "没有对应的产品")
			 return true
		 },
		 'error': function (XMLHttpRequest, textStatus, errorThrown) {
		   //Process error actions
			 document.getElementById('productsList').innerHTML = XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText;
		   return false;
		 }
	 });
 }

 function getUserinfro()
 {
	var auth_token = accessToken;
		
	var url_base = baseURI + '/api/admin/users';
	
	var requestPayload = {	};
	

$.ajax({
	'url': url_base,
	'type': 'POST',
	'content-Type': 'multipart/form-data',
	'headers': {
		// Use access_token previously retrieved from inContact token 
		// service.
		'X-Auth-Token': auth_token
	},
	'xhrFields':{withCredentials:true},
	'data': requestPayload,
	'xhrFields':{withCredentials:true},
	'success': function (result) {
		//Process success actions
	//	accessToken = result.access_token;
		baseURI = result.resource_server_base_uri;
		setTimeout(document.location.href = 'home.html',"5000")
		return result;
	},
	'error': function (XMLHttpRequest, responseText) {
		//Process error actions
		document.getElementById('userloginform').innerHTML ='Error: ' + XMLHttpRequest.responseText ;
		sleep(2000);
		document.location.href = 'login.html';
		return false;
	}
 });
 }

 function getproductsJbyfilter(Jtype) {
	var auth_token = accessToken;
	var url_base = baseURI + 'api/products/filter/'+ Jtype;
	var requestPayload = {
		// search prosuct by Stok_ID
		'material':  document.getElementById('materialselection').value,
		'price': document.getElementById('priceselection').value,
		'mounting_type': document.getElementById('mountingtypeselection').value,
		'dia_shape': document.getElementById('diashapeselection').value,
		'small_dias': document.getElementById('smalldiaschoiceselection').value,
	};
	 $.ajax({
		 'url': url_base,
		 'type': 'POST',
		 'content-Type': 'x-www-form-urlencoded',
		 'dataType': 'json',
		 'xhrFields':{withCredentials:true},
		 'data': requestPayload,
		 'headers': {
		   // Use access_token 
		   'X-Auth-Token': auth_token
		 },
		 
		 'success': function (result) {
		   //Process success actions
			 document.getElementById('productsList').innerHTML = renderJresult(result, "没有对应的产品")
			 return true
		 },
		 'error': function (XMLHttpRequest, textStatus, errorThrown) {
		   //Process error actions
			 document.getElementById('productsList').innerHTML = XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText;
		   return false;
		 }
	 });
 }


 function renderJresult(result, message)
 {
	if (result == null)
	{
		Prosuctbox = message
	}
	else 
	{
	 var Prosuctbox = '';

	 for(var i=0;i<result.length;i++)
	 {
		 var prosuctDataline = '<div class="jewelrybox complete"><a class="seedetailbtn-big demo-box" href="jewelrydetail.html?id='+ result[i]["id"] + '">' +
		 '<span class="imageholder" style="background-image:url("/pic/jewelry/thumbs/' + result[i]["images"] + '")"></span>'+ 
		 '<span class="jewelryname">'+ result[i]["name"]+'</span>'+
		 '<span class="jewelryprice">'+ result[i]["price"]+ '<span class="glyphicon glyphicon-eur" aria-hidden="true"></span></span>'+ 
		 '<span class="stocknum">'+ result[i]["stock_quantity"]+'</span>' +
		 '</a><p class="actionbox"><a class="seedetailbtn" href="jewelrydetail.html?id='+ result[i]["id"] + '">' + '详情</a></div>';
		 Prosuctbox = Prosuctbox + prosuctDataline;
	 }
	
	}
	return Prosuctbox
 }

 function getproductsDbyfilter(Jtype) {
	var auth_token = accessToken;
	var url_base = baseURI + 'api/products/filter/'+ Jtype;
	var requestPayload = {
		// search prosuct by Stok_ID
		'sharp':  document.getElementById('materialselection').value,
		'place': document.getElementById('placechooser').value,
		'mounting': document.getElementById('mountingtypeselection').value,
		'diashape': document.getElementById('diashapeselection').value,
		'smalldiaschoice': document.getElementById('smalldiaschoiceselection').value,
	};
	 $.ajax({
		 'url': url_base,
		 'type': 'POST',
		 'content-Type': 'x-www-form-urlencoded',
		 'dataType': 'json',
		 'data': requestPayload,
		 'headers': {
		   // Use access_token 
		   'X-Auth-Token': auth_token
		 },
		 
		 'success': function (result) {
		   //Process success actions
			 document.getElementById('productsList').innerHTML = renderJresult(result, "没有对应的产品")
			 return true
		 },
		 'error': function (XMLHttpRequest, textStatus, errorThrown) {
		   //Process error actions
			 document.getElementById('productsList').innerHTML = XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText;
		   return false;
		 }
	 });
 }

function checkCodeFromresult(result)
{
	if (result["code"] > 200)
	{return true;}
	else 	
	{return false;}
}



