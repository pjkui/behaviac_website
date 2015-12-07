var locationHref = location.href;
var hostname = "";
if(locationHref.indexOf("from_sys=go")!=-1){	//此参数已经在跨域框架(即XXX_domain.js)里面封装好，
	hostname = "http://" + window.location.host;		//因为跨域了，所以新tab连接必须是绝对路径并且要带上子页面的域名 
}

function addNewTab(title,url) {
	if(hostname==""){	//不跨域的情况，保持原来的方式不变
		try{
			if( typeof(window.parent.addTab) == "function" ){
				window.parent.addTab(title,url);
			}else{
				window.open(url);
			}
	    }catch(error){
	    	window.open(url);
	    }
	}else{	//跨域的情况
		var messenger = Messenger.initInIframe();
		if(!url.indexOf("http:")){
			messenger.send(title+"##"+url);
		}else{
			messenger.send(title+"##"+hostname+url);
		}
		
		
	}
}