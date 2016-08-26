'use strict';

// 生成16位随机key
var randomKey = function (length) {
    //var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789`=//[];',./~!@#$%^&*()_+|{}:<>?";
    var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789";

    var s = "";

    for (var i = 0; i < length; i++) {
        s += chars.charAt(Math.ceil(Math.random() * 1000) % chars.length);
    }
    return s;
};


//取得Request参数
var Request = {
    get: function (paras) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {};
        var i, j;
        for (var i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }
};

//字符串补零
var ZeroPadding = {
    left: function (str, length) {
        if (str.length >= length)
            return str;
        else
            return ZeroPadding.left("0" + str, length);
    },
    right: function (str, length) {
        if (str.length >= length)
            return str;
        else
            return ZeroPadding.right(str + "0", length);
    }
};


//获得URL相关
var URL = {
    getAll: function () {
        return window.location.href;
    },
    getProtocol: function () {
        return window.location.protocol;

    },
    getHost: function () {
        return window.location.host;
    },
    getPort: function () {
        return window.location.port;
    },
    getPathName: function () {
        return window.location.pathname;
    },
    getSearch: function () {
        return window.location.search
    },
    getHash: function () {
        return window.location.hash;
    }

};


//本地数据存储
var localDataStorage = {
    setItem: function (key, value) {
        localStorage.setItem(key, value);
    },
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    setObject: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getObject: function (key) {
        return JSON.parse(localStorage.getItem(key));
    },
    removeItem: function (key) {
        return localStorage.removeItem(key);
    },
    clearItem: function () {
        localStorage.clear();
    }

};

//cookie操作
var cookieOperate = {
    setCookie: function (name, value) {
        var exp = new Date();
        exp.setTime(exp.getTime()+0.5*60*60*1000);
        document.cookie = name + "=" + escape(value) + ";expires="+exp.toGMTString();
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg))

            return (arr[2]);
        else
            return null;
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = cookieOperate.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }
};



//error处理
function errorOperate(response) {
   var errorCode=response.code;
    if(errorCode=='602'){
        $('#denglu').show();
    }else if(errorCode=='603'){
        alert('无法识别的用户名或密码!');
        $('#denglu').show();
    }
}

//controller init
function ctrInit(){
    //隐藏广告栏
    $('#banner').hide();
    //去除滚动条事件
    if(URL.getAll().match('/#/productDetail')==null){
          $(window).unbind('scroll');
    }
}

//check sql injection
function checkSqlInjection(inputStr){
    var resultStr = inputStr.toLowerCase();
    var alertStr = "";

    var vFit = "'|and|exec|insert|select|delete|update|count|*|%|chr|mid|master|truncate|char|declare|; |or|-|+|,";
    var vFitter = vFit.split("|");
    var vFitterLen = vFitter.length;
    for(var vi=0; vi<vFitterLen; vi++){
        if(resultStr.indexOf(vFitter[vi]) >= 0){
            alertStr += vFitter[vi] + " ";
        }
    }
    if(alertStr == ""){
        return true;
    }else{
        alert("输入中不能包含如下字符：" + alertStr);
        return false;
    }
}

/**
 * 产生分页器显示数
 * @param page 请求的页号
 * @param pageSize 每页的记录数
 * @param recordCount 总的记录数
 * @param bursterMaxPage 分页可显示的最大页数
 * @return 分页器显示数
 */
function  _produceBurster(page,pageSize,recordCount,bursterMaxPage) {

   var bursterPageNumbers =[];

    var recordMaxPage=Math.ceil(recordCount/pageSize);

    if(bursterMaxPage>recordMaxPage){
        for(var i=0;i<recordMaxPage;i++){
            bursterPageNumbers[i] = i;
        }
    }else {
        if (page < Math.ceil(bursterMaxPage / 2)) {
            for (var i = 0; i < bursterMaxPage; i++) {
                bursterPageNumbers[i] = i;
            }
        } else if (page < recordMaxPage - Math.ceil(bursterMaxPage / 2)) {
            for (var i = 0, j = -Math.floor(bursterMaxPage / 2); i < bursterMaxPage; i++, j++) {
                bursterPageNumbers[i] = page + j;
            }
        } else {
            for (var i = 0, j = recordMaxPage - bursterMaxPage; i < bursterMaxPage; i++, j++) {
                bursterPageNumbers[i] = j;
            }
        }
    }

    return bursterPageNumbers;

}
//对象转换成对象
function listToObject(list,strKeyName) {
    var listStruct;
    var listData;
    var listRowData;

    // 对list进行空值判断
    if (typeof list == "undefined" || list == null ) {
        return null;
    }

    // 对需要结构化的Object Key进行适配
    if  (strKeyName == null) {
        strKeyName = "alllist";
    }

    // 对待适配的Key值进行空值判断
    if (typeof(list[strKeyName]) =="undefined" || list[strKeyName] == null) {
        return null;
    }

    // 对没有struct键的object直接返回，不做处理
    if  (typeof list.struct == "undefined" || list.struct == null ) {
        return list;
    }

    // 对下标长度进行适配
    listStruct=list.struct.split(",");
    if (list[strKeyName].length==0 || listStruct.length!=list[strKeyName][0].length) {
        list["error"]="错误:待处理的"+strKeyName+"的下标长度与struct的长度不匹配！";
        return list;
    }

    // 适配Struct
    listData=list[strKeyName];

    var arrayData = new Array();
    for (var i=0;i<listData.length;i++) {
        arrayData[i]={};
        for (var j=0;j<listData[i].length;j++) {
            arrayData[i][ltrim(listStruct[j])]=listData[i][j];
        }
    }

    for (var key  in list) {
        if (key===strKeyName) {
            list[key]=arrayData;
        }
    }
    return list;
};

var isEmpty=function(str) {
    if (typeof str == "undefined" || str.replace(/(^\s*)|(\s*$)/g,'')=='' || str==null ) {
        return true;
    } else {
        return false;
    }
}

var isNumber=function(str) {

    if (typeof str == "undefined" || str.replace(/(^\s*)|(\s*$)/g,'')=='' || str==null || isNaN(str)) {
        return false;
    } else {
        return true;
    }
}


var trim=function(str) {
    return str.replace(/(^\s*)|(\s*$)/g,'');
}


/**
 * 删除左边的空格
 */
var ltrim = function(str) {
    return str.replace(/(^\s*)/g,'');
}


/**
 * 删除右边的空格
 */
var rtrim = function(str) {
    return str.replace(/(\s*$)/g,'');
}


/**
 *浮点数 + - * /
 **/
var fnAdd=function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (fnMul(a, e) + fnMul(b, e)) / e;
}

var fnSub=function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (fnMul(a, e) - fnMul(b, e)) / e;
}

var fnMul=function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

var fnDiv=function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), fnMul(c / d, Math.pow(10, f - e));
}

var calcAge=function(dateText)
{
    if (dateText==undefined|| dateText==null || dateText=='') {
        return ''
    }
    var birthday=new Date(dateText.replace(/-/g, "\/"));
    var d=new Date();
    var age = d.getFullYear()-birthday.getFullYear()-((d.getMonth()<birthday.getMonth()||d.getMonth()==birthday.getMonth() && d.getDate()<birthday.getDate())?1:0);
    var month = calculateMonth(dateText);
    var year = calculateAge(dateText);

    return(age);
    //document.all.item("ageTextField").value=age;
    if(year >= 0){
        if(month<0 && year==1){
            //document.all.item("ageTextField").value='0';
            return(0);
        }
        else{
            //document.all.item("ageTextField").value=year;
            return(year);
        }
    }
    else{
        //document.all.item("ageTextField").value="";
        return('');
    }
}

function calculateMonth(birthday)
{
    var month=-1;
    if(birthday)
    {
        var aDate=birthday.split("-");
        if(aDate[1].substr(0,1) == '0')
            aDate[1]=aDate[1].substring(1);
        var birthdayMonth = parseInt(aDate[1]);
        var currentDate = new Date();
        var currentMonth = parseInt(currentDate.getMonth()+1);
        month = currentMonth-birthdayMonth;
        return month;
    }
    return month;
}

function calculateAge(birthday){
    if(birthday){
        var aDate=birthday.split("-");
        var birthdayYear = parseInt(aDate[0]);
        var currentDate = new Date();
        var currentYear = parseInt(currentDate.getFullYear());
        return currentYear-birthdayYear;
    }
    return 0;
}

var Utf8ToGb2312=function(str1){
    var substr = "";
    var a = "";
    var b = "";
    var c = "";
    var i = -1;
    i = str1.indexOf("%");
    if(i==-1){
        return str1;
    }
    while(i!= -1){
        if(i<3){
            substr = substr + str1.substr(0,i-1);
            str1 = str1.substr(i+1,str1.length-i);
            a = str1.substr(0,2);
            str1 = str1.substr(2,str1.length - 2);
            if(parseInt("0x" + a) & 0x80 == 0){
                substr = substr + String.fromCharCode(parseInt("0x" + a));
            }
            else if(parseInt("0x" + a) & 0xE0 == 0xC0){ //two byte
                b = str1.substr(1,2);
                str1 = str1.substr(3,str1.length - 3);
                var widechar = (parseInt("0x" + a) & 0x1F) << 6;
                widechar = widechar | (parseInt("0x" + b) & 0x3F);
                substr = substr + String.fromCharCode(widechar);
            }
            else{
                b = str1.substr(1,2);
                str1 = str1.substr(3,str1.length - 3);
                c = str1.substr(1,2);
                str1 = str1.substr(3,str1.length - 3);
                var widechar = (parseInt("0x" + a) & 0x0F) << 12;
                widechar = widechar | ((parseInt("0x" + b) & 0x3F) << 6);
                widechar = widechar | (parseInt("0x" + c) & 0x3F);
                substr = substr + String.fromCharCode(widechar);
            }
        }
        else {
            substr = substr + str1.substring(0,i);
            str1= str1.substring(i);
        }
        i = str1.indexOf("%");
    }

    return substr+str1;
}


var Utf8ToGBK = function(strUtf8) {
    var bstr = "";
    var nTotalChars = strUtf8.length;        // total chars to be processed.
    var nOffset = 0;                         // processing point on strUtf8
    var nRemainingBytes = nTotalChars;       // how many bytes left to be converted
    var nOutputPosition = 0;
    var iCode, iCode1, iCode2;               // the value of the unicode.

    while (nOffset < nTotalChars)
    {
        iCode = strUtf8.charCodeAt(nOffset);
        if ((iCode & 0x80) == 0)             // 1 byte.
        {
            if ( nRemainingBytes < 1 )       // not enough data
                break;

            bstr += String.fromCharCode(iCode & 0x7F);
            nOffset ++;
            nRemainingBytes -= 1;
        }
        else if ((iCode & 0xE0) == 0xC0)        // 2 bytes
        {
            iCode1 =  strUtf8.charCodeAt(nOffset + 1);
            if ( nRemainingBytes < 2 ||                        // not enough data
                (iCode1 & 0xC0) != 0x80 )                // invalid pattern
            {
                break;
            }

            bstr += String.fromCharCode(((iCode & 0x3F) << 6) | (         iCode1 & 0x3F));
            nOffset += 2;
            nRemainingBytes -= 2;
        }
        else if ((iCode & 0xF0) == 0xE0)        // 3 bytes
        {
            iCode1 =  strUtf8.charCodeAt(nOffset + 1);
            iCode2 =  strUtf8.charCodeAt(nOffset + 2);
            if ( nRemainingBytes < 3 ||                        // not enough data
                (iCode1 & 0xC0) != 0x80 ||                // invalid pattern
                (iCode2 & 0xC0) != 0x80 )
            {
                break;
            }

            bstr += String.fromCharCode(((iCode & 0x0F) << 12) |
                ((iCode1 & 0x3F) <<  6) |
                (iCode2 & 0x3F));
            nOffset += 3;
            nRemainingBytes -= 3;
        }
        else                                                                // 4 or more bytes -- unsupported
            break;
    }

    if (nRemainingBytes != 0) {
        // bad UTF8 string.
        return strUtf8;
    }

    return bstr;
}

var getExplorer=function() {
    var explorer = window.navigator.userAgent ;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
    }
};