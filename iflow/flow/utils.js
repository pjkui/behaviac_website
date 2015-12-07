/***
 * generzhang@tencent.com
 * 2013-11-13
 */

String.prototype.replaceAll  = function(s1,s2){       
return this.replace(new RegExp(s1,"gm"),s2);       
}
String.prototype.trim= function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");  
}
String.prototype.trims= function(){
    return this.replaceAll(" ", "");  
}
function getEventTargetElement(e){
	return e.target||e.srcElement;
}

function obj2str(o) {
	var r = [];
	if (typeof o == "string")
		return "\""
				+ o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n")
						.replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
	if (typeof o == "undefined")
		return "undefined";
	if (typeof o == "object") {
		if (o === null)
			return "null";
		else if (!o.sort) {
			for ( var i in o)
				r.push(i + ":" + obj2str(o[i]))
			r = "{" + r.join() + "}"
		} else {
			for ( var i = 0; i < o.length; i++)
				r.push(obj2str(o[i]))
			r = "[" + r.join() + "]"
		}
		return r;
	}
	return o.toString();
}

function parsePX(str){
	return parseInt(str)+"px";
}

function getInputLength(input){
	var reg = new RegExp(K.Pattern.url,'gi'); 
	var urlList = input.match(reg)||[];
	var len = 0, tempStr = input;
	for(var i=0; i<urlList.length; i++ ){
		tempStr = tempStr.replace(urlList[i],'');
		len += 20;
	}
	len += K.String.getRealLength(tempStr);
	return len;
}


var K = {$:jQuery};

/*==================== Shortcuts ====================*/
var __noop = jQuery.noop;


K.isIE6 = function() {
	return !window.XMLHttpRequest;
};


/*==================== Debug ====================*/
var __debug = true;
var __console = {
	noop: __noop,
	console: window.console,
	prefix: '[Tencent]',
	methods: 'group,groupEnd,trace,debug,info,warn,error,fatal',
	init: function() {
		var methodArray = this.methods.split(','),
			i, numMethodArray = methodArray.length, method;
		for (i = 0; i < numMethodArray; i++) {
			method = methodArray[i];
			// IE8似乎有console对象，但它的方法，比如typeof console.info是object，所以没有apply方法
			// 这里需要排除这种情况
			if (typeof __debug !== 'undefined' && __debug === true && this.console && this.console[method] && this.console[method].apply) {
				this[method] = this.generateMethod(method);
			} else {
				this[method] = this.noop;
			}
		}
	},
	generateMethod: function(method) {
		return function() {
			Array.prototype.unshift.call(arguments, this.prefix);
			this.console[method].apply(this.console, arguments);
		};
	}
};
__console.init();


/*==================== StringBuilder ====================*/
K.StringBuilder = function(str) {
	this.array = [];
	if (str != null) {
		this.array.push(str);
	}
};
K.StringBuilder.prototype = {
	append: function(str) {
		this.array.push(str);
	},
	toString: function() {
		return this.array.join('');
	}
};
K.str = function() {
	return Array.prototype.join.call(arguments, '');
};

K.addIframe = function(parent,width,height){
	if(!parent) return;
	var iframe = document.createElement("iframe");
	iframe.setAttribute("frameborder","0");
	iframe.setAttribute("allowtransparency","true");
	iframe.className="iframe";
	if(width!=undefined)iframe.style.width=width+"px";
	if(height!=undefined)iframe.style.height=height+"px";
	parent.appendChild(iframe);
};

K.addSimpleIframe = function(parent){
	var $parent = this.$(parent);
	K.addIframe(parent, parseInt($parent.width()), parseInt($parent.height()));
};

/*==================== SimpleTemplate ====================*/
K.SimpleTemplate = function() {
	this.parts = [];
	this._pushAll(arguments);
};
K.SimpleTemplate.prototype = {
	_: function() {
		this._pushAll(arguments);
		return this;
	},
	
	toString: function() {
		return this.parts.join('');
	},
	
	_pushAll: function(arr) {
		var i, n = arr.length;
		for (i = 0; i < n; i++) {
			this.parts.push(arr[i]);
		}
	}
};

K.ucfirst = function(str) {
	return str.substring(0,1).toUpperCase() + str.substring(1);
};
K.String = {
	getRealLength: function(str){
		return (str || '').replace(/[^\x00-\xff]/g,"**").length;
	},
	//url 算10个字符，其它按一个字符返回
	getInputLength: function(input){
		var reg = new RegExp(K.Pattern.url,'gi'); 
		var urlList = input.match(reg)||[];
		var len = 0, tempStr = input;
		for(var i=0; i<urlList.length; i++ ){
			tempStr = tempStr.replace(urlList[i],'');
			len += 10;
		}
		len += tempStr.length;
		return len;
	},
	ucFirst: function(str){
		return str.substring(0,1).toUpperCase() + str.substring(1);
	},
	//截取中英文字符长度
	getShortStr: function(str, n ,suffix){
		if (!str) return '';
		var len = str.length, relLen = 0, i, s, index = 0;
		for(i=0; i<len; i++){
			s = str.charAt(i);
			if(/[^\x00-\xff]/.test(s)){
				if(relLen + 2 > n) break;
				relLen += 2; index++;
			}else{
				relLen++; index++;
			}
			if(relLen >= n) break;
		}
		
		var result = str.substring(0, index);
		if(index < len-1 && suffix){
			result += suffix;
		}
		return result;
	},
	
	// 不区分中英文截取字符
	getShortIgnore: function(str, len, suffix){
		if(!str) return '';
		var l = str.length, suffix = suffix || '...';
		if(l > len){
			str = str.substring(0, len) + suffix ;
		}
		return str;
	},
	
	/* 为URL地址添加链接  http://t.k.com -> <a href="http://t.k.com">http://t.k.com</a>*/
	replaceUrlAsLink: function(text, title, target) {
		var regex = /(http\:\/\/([\w.]+)(\/[\w-\.\/\?%&=]*)?)/gi;
		return typeof text == "string" ? text.replace(regex, '<a href="$1" title="'+ (title || '$1') +'" target="' + (target || '_blank') + '">$1</a>') : text;
	},
	
	/** HTML实体代码转成显示的字符串 */
	htmlToString: function(str){
		var entity = ['&lt;', '&gt;', '&amp;', '&quot;'],
		html = ['<', '>', '&', '"'],
		len = entity.length, reg;
		for(var i=0; i<len; i++){
			reg = new RegExp(entity[i], 'g');
			str = str.replace(reg, html[i]);
		}
		return str;
	},
	
	/** 将字符串转换成html实体 */
	htmlEntities: function(str){
		if(typeof str === 'undefined') return '';
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	},
	
	checkEmail: function(str) {
		var reg = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/; // 正确的邮箱地址
		return reg.test(str);
	},
	
	checkEmailPrefix: function(str) {
		var reg = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*$/; // 邮箱前缀
		return reg.test(str);
	},
	
	checkPhoneOnly: function (str) {
		var reg = /^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/; // Only座机
		return reg.test(str);
	},
	
	checkPhone: function (str) {
		var reg = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/; // 手机、座机
		return reg.test(str);
	},
	
	checkMobilePhone: function(str){
		var reg = /^\d{11}$/; // 临时，以后完善
		return reg.test(str); 
	},
	
	/** 清除左空格 */
	ltrim: function(str){
		return str.replace(/^\s+/, '');
	},
	
	/** 清除右空格 */
	rtrim: function(str){
		return str.replace(/\s+$/, '');
	},
	
	/** 清除头尾空格 */
	trim: function(str){
		return this.rtrim(this.ltrim(str));
	}
};

/** ====== 截取带链接的字符串 =============================================== */
K.StringForHtml = {
	regLink: /<a\b[^>]*>([^<]*)<\/a>/gi,
	regImg: /<img[^>]*>/gi,
	regBr: /<br\s?\/?>/gi,
	
	subString: function(content, len){
		//debugger;
		var originalContent = content, 
			linkArr=[], imgArr=[], 
			linkIndex = 0, imgIndex = 0,
			me = this;
		content = content.replace(this.regBr, '\n');  // 回车改成换行
		content = content.replace(this.regLink, function(linkStr, plainStr){    // 替换链接
			linkArr.push(linkStr);
			var returnStr = me.repeatStr(plainStr.length, '¤');
			return '|' + returnStr + '|';
		});
		content = content.replace(this.regImg, function(imgStr){     // 替换图片
			imgArr.push(imgStr);
			return '|♂|';
		});  
		if(content.lenght <= len) return originalContent;
		
		content = content.substring(0, len);
		content = content.replace(/\|¤+$/, '');
		content = content.replace(/\|♂$/, '');         // 清除被截断的链接替换符
		content = content.replace(/\|¤+\|/g, function(){         // 替换回链接
			return linkArr[linkIndex++];
		});
		content = content.replace(/\|♂\|/g, function(){          // 替换回图片
			return imgArr[imgIndex++];
		});
		content = content.replace(/\n/g, '<br />');              // 替换回回车
		return content;
	},
	
	repeatStr: function(len, str){
		var s = '';
		for(var i=0; i<len; i++){
			s += str;
		}
		return s;
	},
	
	getPlainLength: function(content){
		content = content.replace(this.regBr, '\n');
		content = content.replace(this.regLink, "|$1|");
		content = content .replace(this.regImg, '|♂|');
		return content.length;
	}
};

K.Url = {
		/*
		 * 获取URL参数 getQueryStr(url)
		 * 例如 URL = http://t.kingdee.com/index.jsp?x=1&y=2
		 * 则 getQueryStr(url)返回{x:'1',y:'2'}
		 */
		getQueryStr: function(url){
			if(url.indexOf('?')<=0){return null;};
		    var queryStr = url.split('?')[1];
		    var result = {};
			var p = queryStr.split('&');
		    for(var i=0;i<p.length;i++){
			  result[p[i].split('=')[0]] = p[i].split('=')[1];
		    }
		    return result;
		},
		
		/*
		 * 给url添加或修改参数addQueryStr(url ,obj)
		 * obj为一json对象，如{x:'1',y:'2'}。
		 */
		addQueryStr: function(url,obj){
			if(url.indexOf('?')<=0){url += '?';}
			for(var s in obj){
			    var newQuery = '&' + s + '=' + obj[s];
			    var regex = eval('/[&]?' + s + '=[^&]*/');
			    url = url.replace(regex, '');
			    url += newQuery;
			}
			return url;
		},
		/*
		 * 删除url中的某个或某组参数 delQueryStr(url,attr)
		 * 其中attr参数可以是string也可以是数组。
		 */
		delQueryStr: function(url,attr){
			var attrList = typeof(attr) == "string" ? new Array(attr) : attr;
			for(var a in attrList){
				var regex = eval('/[&]?' + attrList[a] + '=[^&]*/');
				url = url.replace(regex, '');
			}
			return url;
			
		}
};

K.Pattern = {
	url: "(http[s]?://[a-zA-Z0-9!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]*)(\s)*"
};

/**
 * K.Browser 存储浏览器类型和版本
 * ex. 调用K.Browser.ie 要么返回undefined要么或者版本号
 * 
 */
(function(){
	K.Browser = {}; 
	var ua = navigator.userAgent.toLowerCase(),s; 
	(s = ua.match(/msie ([\d.]+)/)) ? K.Browser.ie = s[1] : 
	(s = ua.match(/firefox\/([\d.]+)/)) ? K.Browser.firefox = s[1] : 
	(s = ua.match(/chrome\/([\d.]+)/)) ? K.Browser.chrome = s[1] : 
	(s = ua.match(/opera.([\d.]+)/)) ? K.Browser.opera = s[1] : 
	(s = ua.match(/version\/([\d.]+).*safari/)) ? K.Browser.safari = s[1] : 0; 
	ua.match(/ipad/i) ? K.Browser.isiPad = true :
	ua.match(/iphone os/i) ? K.Browser.isiPhone = true :
	ua.match(/android/i) ? K.Browser.isAndroid = true : 0;
			
})();

//判断客户端浏览器是否安装了flash插件
K.hasFlashPlugin= function(){
	if(K.Browser.ie){
		try { 
	        var swf=new ActiveXObject("ShockwaveFlash.ShockwaveFlash"); 
	        return true;
		} catch(e) { 
	        return false;
	    } 
	}else{
		 return navigator.plugins["Shockwave Flash"] ? true: false; 
	}
};


// 延迟执行函数，如果在延迟时间到达之前该方法再被调用，则之前的函数取消执行
K.delayRace = (function() {
	var timer = 0;
	return function(fn, ms){
		window.clearTimeout(timer);
		timer = window.setTimeout(fn, ms);
	};
})();

K.throttle = function(func, wait) {
	var context, args, timeout, result,
		previous = 0;
	
	var later = function() {
		previous = new Date;
		timeout = null;
		result = func.apply(context, args);
	};
	return function() {
		var now = new Date,
			remaining = wait - (now - previous);
		
		context = this;
		args = arguments;
		if (remaining <= 0) {
			clearTimeout(timeout);
			timeout = null;
			previous = now;
			result = func.apply(context, args);
		} else if (!timeout) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
};

// 获取对象的属性，支持链式声明式，如K.getObjProp({a:{a1:1,a2:2}}, 'a.a1');
K.getObjProp = function(obj, propChain) {
	if (typeof propChain !== 'string') {
		return;
	}
	
	var props = propChain.split('.'), i = 0, len = props.length, prop, o = obj;
	for (; i < len; i++) {
		prop = props[i];
		if (o){
			o = o[prop];
		} else {
			break;
		}
	}

	return o;
};

K.getMapKeys = function(map, seperators) {
	var key, keys = [];
	for (key in map) {
		keys.push(key);
	}
	
	return (typeof seperators === 'undefined') ? keys : keys.join(seperators);
};

K.numChar = function(str, c) {
	var i, len = str.length, _c, num = 0;
	for (i = 0; i < len; i++) {
		_c = str.charAt(i);
		if (_c == c) {
			num++;
		}
	}
	return num;
};