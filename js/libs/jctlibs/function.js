define(function () {
    'use strict';
    var t_date = new Date();
    var nowWeek = t_date.getDay()
    var nowYear = t_date.getFullYear();
    var nowMonth = t_date.getMonth();
    var nowDay = t_date.getDate();
    var jctLibs = {

// 生成16位随机key
        randomKey: function (length) {
            //var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789`=//[];',./~!@#$%^&*()_+|{}:<>?";
            var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789";

            var s = "";

            for (var i = 0; i < length; i++) {
                s += chars.charAt(Math.ceil(Math.random() * 1000) % chars.length);
            }
            return s;
        },


//取得Request参数
        Request: {
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
        },

//字符串补零
        ZeroPadding: {
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
        },


//获得URL相关
        URL: {
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

        },


//本地数据存储
        localDataStorage: {
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

        },

//cookie操作
        cookieOperate: {
            setCookie: function (name, value) {
                var exp = new Date();
                exp.setTime(exp.getTime() + 0.5 * 60 * 60 * 1000);
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
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
        },


//error处理
        errorOperate: function (response) {
            var errorCode = response.code;
            if (errorCode == '602') {
                $('#denglu').show();
            } else if (errorCode == '603') {
                alert('无法识别的用户名或密码!');
                $('#denglu').show();
            }
        },

//controller init
        ctrInit: function () {
            //隐藏广告栏
            $('#banner').hide();
            //去除滚动条事件
            if (URL.getAll().match('/#/productDetail') == null) {
                $(window).unbind('scroll');
            }
        },

//check sql injection
        checkSqlInjection: function (inputStr) {
            var resultStr = inputStr.toLowerCase();
            var alertStr = "";

            var vFit = "'|and|exec|insert|select|delete|update|count|*|%|chr|mid|master|truncate|char|declare|; |or|-|+|,";
            var vFitter = vFit.split("|");
            var vFitterLen = vFitter.length;
            for (var vi = 0; vi < vFitterLen; vi++) {
                if (resultStr.indexOf(vFitter[vi]) >= 0) {
                    alertStr += vFitter[vi] + " ";
                }
            }
            if (alertStr == "") {
                return true;
            } else {
                alert("输入中不能包含如下字符：" + alertStr);
                return false;
            }
        },

        /**
         * 产生分页器显示数
         * @param page 请求的页号
         * @param pageSize 每页的记录数
         * @param recordCount 总的记录数
         * @param bursterMaxPage 分页可显示的最大页数
         * @return 分页器显示数
         */
        _produceBurster: function (page, pageSize, recordCount, bursterMaxPage) {

            var bursterPageNumbers = [];

            var recordMaxPage = Math.ceil(recordCount / pageSize);

            if (bursterMaxPage > recordMaxPage) {
                for (var i = 0; i < recordMaxPage; i++) {
                    bursterPageNumbers[i] = i;
                }
            } else {
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

        },

//对象转换成对象
        listToObject: function (list, strKeyName) {
            var listStruct;
            var listData;
            var listRowData;

            // 对list进行空值判断
            if (typeof list == "undefined" || list == null) {
                return null;
            }

            // 对需要结构化的Object Key进行适配
            if (strKeyName == null) {
                strKeyName = "alllist";
            }

            // 对待适配的Key值进行空值判断
            if (typeof(list[strKeyName]) == "undefined" || list[strKeyName] == null) {
                return null;
            }

            // 对没有struct键的object直接返回，不做处理
            if (typeof list.struct == "undefined" || list.struct == null) {
                return list;
            }

            // 对下标长度进行适配
            listStruct = list.struct.split(",");
            if (list[strKeyName].length == 0 || listStruct.length != list[strKeyName][0].length) {
                list["error"] = "错误:待处理的" + strKeyName + "的下标长度与struct的长度不匹配！";
                return list;
            }

            // 适配Struct
            listData = list[strKeyName];

            var arrayData = new Array();
            for (var i = 0; i < listData.length; i++) {
                arrayData[i] = {};
                for (var j = 0; j < listData[i].length; j++) {
                    arrayData[i][this.ltrim(listStruct[j])] = listData[i][j];
                }
            }

            for (var key  in list) {
                if (key === strKeyName) {
                    list[key] = arrayData;
                }
            }
            return list;
        },

        isEmpty: function (str) {
            if (typeof str == "undefined" || str.replace(/(^\s*)|(\s*$)/g, '') == '' || str == null) {
                return true;
            } else {
                return false;
            }
        },

        isNumber: function (str) {

            if (typeof str == "undefined" || str.replace(/(^\s*)|(\s*$)/g, '') == '' || str == null || isNaN(str)) {
                return false;
            } else {
                return true;
            }
        },


        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },


        /**
         * 删除左边的空格
         */
        ltrim: function (str) {
            return str.replace(/(^\s*)/g, '');
        },


        /**
         * 删除右边的空格
         */
        rtrim: function (str) {
            return str.replace(/(\s*$)/g, '');
        },


        /**
         *浮点数 + - * /
         **/
        fnAdd: function add(a, b) {
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
        },

        fnSub: function sub(a, b) {
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
        },

        fnMul: function mul(a, b) {
            var c = 0,
                d = a.toString(),
                e = b.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) {
            }
            try {
                c += e.split(".")[1].length;
            } catch (f) {
            }
            return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        },

        fnDiv: function div(a, b) {
            var c, d, e = 0,
                f = 0;
            try {
                e = a.toString().split(".")[1].length;
            } catch (g) {
            }
            try {
                f = b.toString().split(".")[1].length;
            } catch (g) {
            }
            return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), fnMul(c / d, Math.pow(10, f - e));
        },

        calcAge: function (dateText) {
            if (dateText == undefined || dateText == null || dateText == '') {
                return ''
            }
            var birthday = new Date(dateText.replace(/-/g, "\/"));
            var d = new Date();
            var age = d.getFullYear() - birthday.getFullYear() - ((d.getMonth() < birthday.getMonth() || d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate()) ? 1 : 0);
            var month = calculateMonth(dateText);
            var year = calculateAge(dateText);

            return (age);
            //document.all.item("ageTextField").value=age;
            if (year >= 0) {
                if (month < 0 && year == 1) {
                    //document.all.item("ageTextField").value='0';
                    return (0);
                }
                else {
                    //document.all.item("ageTextField").value=year;
                    return (year);
                }
            }
            else {
                //document.all.item("ageTextField").value="";
                return ('');
            }
        },

        calculateMonth: function (birthday) {
            var month = -1;
            if (birthday) {
                var aDate = birthday.split("-");
                if (aDate[1].substr(0, 1) == '0')
                    aDate[1] = aDate[1].substring(1);
                var birthdayMonth = parseInt(aDate[1]);
                var currentDate = new Date();
                var currentMonth = parseInt(currentDate.getMonth() + 1);
                month = currentMonth - birthdayMonth;
                return month;
            }
            return month;
        },

        calculateAge: function (birthday) {
            if (birthday) {
                var aDate = birthday.split("-");
                var birthdayYear = parseInt(aDate[0]);
                var currentDate = new Date();
                var currentYear = parseInt(currentDate.getFullYear());
                return currentYear - birthdayYear;
            }
            return 0;
        },

        Utf8ToGb2312: function (str1) {
            var substr = "";
            var a = "";
            var b = "";
            var c = "";
            var i = -1;
            i = str1.indexOf("%");
            if (i == -1) {
                return str1;
            }
            while (i != -1) {
                if (i < 3) {
                    substr = substr + str1.substr(0, i - 1);
                    str1 = str1.substr(i + 1, str1.length - i);
                    a = str1.substr(0, 2);
                    str1 = str1.substr(2, str1.length - 2);
                    if (parseInt("0x" + a) & 0x80 == 0) {
                        substr = substr + String.fromCharCode(parseInt("0x" + a));
                    }
                    else if (parseInt("0x" + a) & 0xE0 == 0xC0) { //two byte
                        b = str1.substr(1, 2);
                        str1 = str1.substr(3, str1.length - 3);
                        var widechar = (parseInt("0x" + a) & 0x1F) << 6;
                        widechar = widechar | (parseInt("0x" + b) & 0x3F);
                        substr = substr + String.fromCharCode(widechar);
                    }
                    else {
                        b = str1.substr(1, 2);
                        str1 = str1.substr(3, str1.length - 3);
                        c = str1.substr(1, 2);
                        str1 = str1.substr(3, str1.length - 3);
                        var widechar = (parseInt("0x" + a) & 0x0F) << 12;
                        widechar = widechar | ((parseInt("0x" + b) & 0x3F) << 6);
                        widechar = widechar | (parseInt("0x" + c) & 0x3F);
                        substr = substr + String.fromCharCode(widechar);
                    }
                }
                else {
                    substr = substr + str1.substring(0, i);
                    str1 = str1.substring(i);
                }
                i = str1.indexOf("%");
            }

            return substr + str1;
        },


        Utf8ToGBK: function (strUtf8) {
            var bstr = "";
            var nTotalChars = strUtf8.length;        // total chars to be processed.
            var nOffset = 0;                         // processing point on strUtf8
            var nRemainingBytes = nTotalChars;       // how many bytes left to be converted
            var nOutputPosition = 0;
            var iCode, iCode1, iCode2;               // the value of the unicode.

            while (nOffset < nTotalChars) {
                iCode = strUtf8.charCodeAt(nOffset);
                if ((iCode & 0x80) == 0)             // 1 byte.
                {
                    if (nRemainingBytes < 1)       // not enough data
                        break;

                    bstr += String.fromCharCode(iCode & 0x7F);
                    nOffset++;
                    nRemainingBytes -= 1;
                }
                else if ((iCode & 0xE0) == 0xC0)        // 2 bytes
                {
                    iCode1 = strUtf8.charCodeAt(nOffset + 1);
                    if (nRemainingBytes < 2 ||                        // not enough data
                        (iCode1 & 0xC0) != 0x80)                // invalid pattern
                    {
                        break;
                    }

                    bstr += String.fromCharCode(((iCode & 0x3F) << 6) | (         iCode1 & 0x3F));
                    nOffset += 2;
                    nRemainingBytes -= 2;
                }
                else if ((iCode & 0xF0) == 0xE0)        // 3 bytes
                {
                    iCode1 = strUtf8.charCodeAt(nOffset + 1);
                    iCode2 = strUtf8.charCodeAt(nOffset + 2);
                    if (nRemainingBytes < 3 ||                        // not enough data
                        (iCode1 & 0xC0) != 0x80 ||                // invalid pattern
                        (iCode2 & 0xC0) != 0x80) {
                        break;
                    }

                    bstr += String.fromCharCode(((iCode & 0x0F) << 12) |
                        ((iCode1 & 0x3F) << 6) |
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
        },

        getExplorer: function () {
            var explorer = window.navigator.userAgent;
            //ie
            if (explorer.indexOf("MSIE") >= 0) {
                return 'ie';
            }
            //firefox
            else if (explorer.indexOf("Firefox") >= 0) {
                return 'Firefox';
            }
            //Chrome
            else if (explorer.indexOf("Chrome") >= 0) {
                return 'Chrome';
            }
            //Opera
            else if (explorer.indexOf("Opera") >= 0) {
                return 'Opera';
            }
            //Safari
            else if (explorer.indexOf("Safari") >= 0) {
                return 'Safari';
            }
        },

        //Model返回的结果
        jetHisResult: function () {
            return {
                errorNo: 0,//0为success，其余值为错误或异常
                resData: null,//返回的数据
                errorInfo: ""//错误信息
            }
        },

        //动态添加下拉列表的option
        appendToChosen: function ($elem, val, text) {
            $elem
                .append($('<option></option>')
                    .val(val)
                    .html(text)).trigger('chosen:updated');
        },
        //动态添加下拉列表的option
        appendToSelect: function ($elem, val, text) {
            $elem
                .append($('<option></option>')
                    .val(val)
                    .html(text));
        },
        formatDate: function (value,row, index) {
            if(value) {
                return value.split(' ')[0]
            }
            else{
                return '';
            }
        },
        //时间格式化，获取当前一周
        dataGet: {
            //格式化日期：yyyy-MM-dd
            formatDate: function (date) {
                var myyear = date.getFullYear();
                var mymonth = date.getMonth() + 1;
                var myweekday = date.getDate();
                if (mymonth < 10) {
                    mymonth = "0" + mymonth;
                }
                if (myweekday < 10) {
                    myweekday = "0" + myweekday;
                }
                return (myyear + "-" + mymonth + "-" + myweekday);
            },
            //获得本周的开始日期
            getWeekStartDate: function () {
                var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowWeek + 1);
                return this.formatDate(weekStartDate);
            },
            //获得本周的结束日期
            getWeekEndDate: function () {
                var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowWeek));
                return this.formatDate(weekEndDate);
            },
            //获取当天日期
            currentDate: function () {
                var weekDate = new Date(nowYear, nowMonth, nowDay);
                return this.formatDate(weekDate);
            }
        },
        //获取格式为yyyy-MM-dd hh24:mm:ss
        getCurrentTime: function () {
            var date = new Date(), dateArr = [], timeArr = [], datetimeArr = [], dateStr = "", timeStr = "", datetimeStr = "";
            dateArr.push(date.getFullYear());
            dateArr.push(date.getMonth() + 1);
            dateArr.push(date.getDate());
            dateStr = dateArr.join('-');
            timeArr.push(date.getHours());
            timeArr.push(date.getMinutes());
            timeArr.push(date.getSeconds())
            timeStr = timeArr.join(':');
            datetimeArr.push(dateStr), datetimeArr.push(timeStr), datetimeStr = datetimeArr.join(' ')
            return {date: dateStr, time: timeStr, datetime: datetimeStr}
        },
        //生成药物用法备注
        generateInput: function (value, row, index) {
            var $input = $('<input type="text" class="drug_remark" />');
            if (value) {
                $input.attr("value", value);
            }
            else {
                $input.attr("value", "");
            }
            return $input.prop('outerHTML');
        },
        changeRemark: {
            //改变药物的用法备注
            'change .drug_remark': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.packing_spec = $value;
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        },
        changeTakeRemark: {
            //改变药物的用法备注
            'change .drug_remark': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.take_way_remark = $value;
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        },
        //价格
        generatePrices: function(value,row,index){
            var $input = $('<input type="number" class="take_num" />');
            if (value) {
                $input.attr("value", value);
            }
            else {
                $input.attr("value", "");
            }
            return $input.prop('outerHTML');
        },
        //生成药品每次用量
        generateTakeNum: function (value, row, index) {
            var unit;
            //判断药品来自模板还是药物库存
            unit = row.unit || row.take_unit || "g";
            var $input = $('<input type="text" class="take_num" />');
            if (value) {
                $input.attr("value", parseInt(value));
            }
            else {
                row.take_spec = 1+unit;
                $input.attr("value", 1);
                return $input.prop('outerHTML') + unit;
            }
            return $input.prop('outerHTML') + unit;
        },
        changeTakeNum: {
            //改变药物单次用量
            'change .take_num': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.take_spec = $value;
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        },
        //生成药物总量
        generateDrugNum: function (value, row, index,e) {
            var $input = $('<input type="text" class="drug_num"/>');
            if (value) {
                $input.attr("value", value);
            }
            else {
                $input.attr("value", 1);
            }
            return $input.prop('outerHTML');
        },
        changeTotal: {
            //改变药物数量
            'change .drug_num': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.drug_num = $value;
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        },
        changeTotalNum: {
            //改变药物数量
            'change .drug_num': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.drug_num = $value;
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        },
        //生成药品组号的下拉列表,暂时设置为最大10个.
        generateDrugGroup: function (value, row, index) {
            var $select = $("<select class='drug_group'>");
            for (var i = 1; i < 10; i++) {
                jctLibs.appendToSelect($select, i, i)
            }
            if (value) {
                $select.find("option[value=" + value + "]").attr('selected', true);
            }
            return $select.prop('outerHTML');
        },
        changeGroupNo: {
            //改变药物组号
            'change .drug_group': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.group_no = $value;
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        },
        //生成药品服用天数,暂时设置为最多30.
        generateTakeDays: function (value, row, index) {
            var $select = $("<select class='take_days'>");
            for (var i = 1; i < 30; i++) {
                jctLibs.appendToSelect($select, i, i)
            }
            ;
            if (value) {
                $select.find("option[value=" + value + "]").attr('selected', true);
            }
            return $select.prop('outerHTML');
        },
        changeDays: {
            //改变用药天数
            'change .take_days': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.take_date = $value;
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        },
        //药品添加一堆乱七八糟的入库数据
        //返回药品单位
        returnUnit:{
            'change #drug_unit': function(e,value,row,index){
                var $table_t = $(e.target).closest("table"), $value = $(e.target).find("option:checked").attr("value");
                row.min_packing_unit = $value;
                $table_t.bootstrapTable ('updateRow', {index:index, row: row});
            }
        },
        //返回药品类型
        returnGoods:{
            'change #goods_type': function(e,value,row,index){
                var $table_t = $(e.target).closest("table"), $value = $(e.target).find("option:checked").attr("value");
                row.goods_type = $value;
                $table_t.bootstrapTable ('updateRow', {index:index, row: row});
            }
        },
        //应收药品数量
        returnNum:{
            'change .drug_num': function(e,value,row,index){
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.original_total_num = $value;
                $table_t.bootstrapTable ('updateRow', {index:index, row: row});
            }
        },
        //实收药品数量
        returnActual:{
            'change .drug_num': function(e,value,row,index){
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val(),total=0;
                row.actual_total_num = $value;
                row.total_costs = (row.unit_price||0) * (row.actual_total_num||1);
                row.total_recipe_costs = (row.pesc_price||0) * (row.actual_total_num||0);
                $table_t.bootstrapTable('updateRow', {index:index, row: row});
            }
        },
        //药品成本价
        rUnitPrice:{
            'change .take_num': function(e,value,row,index){
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.unit_price = $value;
                row.total_costs = (row.unit_price||0) * (row.actual_total_num||1);
                $table_t.bootstrapTable('updateRow', {index:index, row: row});
            }
        },
        //药品售价
        rSellPrice:{
            'change .take_num': function(e,value,row,index){
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.sell_price = $value;
                $table_t.bootstrapTable('updateRow', {index:index, row: row});
            }
        },
        //药品处方价
        rPescPrice:{
            'change .take_num': function(e,value,row,index){
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.pesc_price = $value;
                row.total_recipe_costs = (row.pesc_price||0) * (row.actual_total_num||1);
                $table_t.bootstrapTable('updateRow', {index:index, row: row});
            }
        },
        //生产日期
        rProductTime:{
            'change .mDates': function(e,value,row,index){
                var $table_t = $(e.target).closest("table");
                var dd= $(e.currentTarget).find("input");
                var arr=[];
                for(var i=0;i<dd.length;i++){
                    arr.push(dd[i].value);
                }
                var date=arr.join("-");
                row.product_date_time = date;
                $table_t.bootstrapTable('updateRow', {index:index, row: row});
            }
        },
        //过期日期
        rDeadlineTime:{
            'change .mDates': function(e,value,row,index){
                var $table_t = $(e.target).closest("table");
                var dd= $(e.currentTarget).find("input");
                var arr=[];
                for(var i=0;i<dd.length;i++){
                    arr.push(dd[i].value);
                }
                var date=arr.join("-");
                row.deadline_date_time = date;
                $table_t.bootstrapTable('updateRow', {index:index, row: row});
            }
        },
        //生成药物的单位和最小单位
        generateDrugUnit: function (value, row, index) {
            //如果药品来自药品列表，则返回单位和最小单位组成的下拉列表
            if (row.min_unit) {
                var $select = $("<select class='drug_unit'>");
                jctLibs.appendToSelect($select, row.drug_unit, row.drug_unit);
                jctLibs.appendToSelect($select, row.min_unit, row.min_unit);
                $select.find("option[value=" + value + "]").attr('selected', true);
                return $select.prop('outerHTML');
            }
            //如果药品来自模板列表，则直接返回单位
            else {
                return row.drug_unit;
            }
        },
        //返回slect选择药品单位
        generateSelect: function(value,row,index){
            var $select=$('<select id="drug_unit"><option value="g">g</option><option value="盒">盒</option><option value="瓶">瓶</option><option value="袋">袋</option><option value="套">套</option><option value="箱">箱</option><option value="支">支</option></select>');
            if(value) {
                $select.find('option[value=' + value + ']').attr("selected",true);
            }
            return $select.prop('outerHTML')
        },
        //返回slect选择药品类型
        generateSelectG: function(value,row,index){
            var $select=$('<select id="goods_type"><option value="20">西药</option><option value="10" >中药</option><option value="30">耗材</option></select>');
            if(value) {
                $select.find('option[value=' + value + ']').attr("selected",true);
            }
            return $select.prop('outerHTML')
        },
        //操作时,更新row的数据.
        changePrice: {
            //改变药品单位,随之改变药品单价
            'change .drug_unit': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                var bigUnit = row.drug_unit, smallUnit = row.min_unit, bigPrice = row.charge_fee, smallPrice = row.min_unit_price;
                if ($value == bigUnit) {
                    row.unit = bigUnit;
                    row.price = bigPrice;
                    $table_t.bootstrapTable('updateRow', {index: index, row: row});
                }
                if ($value == smallUnit) {
                    row.unit = smallUnit
                    row.price = smallPrice;
                    $table_t.bootstrapTable('updateRow', {index: index, row: row});
                }
            }
        },
        //生成药品用法的下拉列表
        generateTakeWay: function (value, row, index) {
            var takeWays = [{text: "口服", code: "口服"},
                {text: "静脉注射", code: "静脉注射"},
                {text: "外服", code: "外服"},
                {text: "冲服", code: "冲服"},
                {text: "煎服", code: "煎服"}];
            var $select = $("<select class='take_ways'>");
            takeWays.forEach(function (takeWay) {
                jctLibs.appendToSelect($select, takeWay.code, takeWay.text)
            })
            if (value) {
                $select.find("option[value=" + value + "]").attr('selected', true);
            }
            else {
                row.take_way = '口服';
            }
            return $select.prop('outerHTML');

        },
        changeWay: {
            //改变给药方式
            'change .take_ways': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.take_way = $value;
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        },
        //生成药品频度的下拉列表 TODO:从后端获取,写成通用组件
        generateFreq: function (value, row, index) {
            var frequencies =
                [{text: "一天两次", code: "seo"},
                    {text: "一天三次", code: "tho"},
                    {text: "一天四次", code: "foo"},
                    {text: "2小时一次", code: "twoho"},
                    {text: "6小时一次", code: "sho"},
                    {text: "8小时一次", code: "eho"},
                    {text: "睡前一次", code: "bbo"},
                    {text: "饭前一次", code: "bmo"}];
            var $select = $("<select class='take_times'>");
            frequencies.forEach(function (frequency) {
                jctLibs.appendToSelect($select, frequency.code, frequency.text)
            })
            if (value) {
                $select.find("option[value=" + value + "]").attr('selected', true);
            }
            return $select.prop('outerHTML');
        },
        //返回日期格式化
        generateDate: function(value, row, index){
            var curDate = new Date();
            var curYear=curDate.getFullYear();    //获取完整的年份(4位,1970-????)
            var curMonth=curDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
            var curDay=curDate.getDate();        //获取当前日(1-31)
            var $div=$('<div class="mDates"><input id="YXQN" class="InputText " type="text" style="width: 40px;" maxlength="4">-<input id="YXQY" class="InputText " type="text" style="width: 20px;" maxlength="2" >-<input id="YXQR" class="InputText " type="text" style="width: 20px;" maxlength="2"></div>');
            if (value) {
                var arr=value.split('-');
                $div.find('#YXQN').attr('value',arr[0]);
                $div.find('#YXQY').attr('value',arr[1]);
                $div.find('#YXQR').attr('value',arr[2]);
            }
            else {
                $div.find('#YXQN').attr('value',curYear);
                $div.find('#YXQY').attr('value',curMonth);
                $div.find('#YXQR').attr('value',curDay);

            }
            return $div.prop('outerHTML');
        },
        changeTimes: {
            //改变用药频率
            'change .take_times': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                row.take_times = $value;
                $table_t.bootstrapTable('updateRow', {index: index, row: row});
            }
        },
        generateDrugPrice: function (value, row, index) {
            //检验value是否有值
            if (value != null) {
                if (!isNaN(value)) {
                    return value.toFixed(2);
                }
                else {
                    return parseInt(value).toFixed(2);
                }
            }
            else {
                return "";
            }
        },
        //生成标准化的年龄
        generateAge: function (value, row, index) {
            var date = new Date(), birth = new Date(value);
            var age = date.getFullYear() - birth.getFullYear();
            return age >= 0 ? age : "wrong";
        },

        //生成标准化的性别
        generateSex: function (value, row, index) {
            switch (value.toUpperCase()) {
                case "M":
                    return "男";
                case "F":
                    return "女";
                case "S":
                    return "不详";
            }
        },

        //生成标准化的价格,保留两位小数
        generatePrice: function (value, row, index) {
            //检验value是否有值
            if (value != null) {
                if (!isNaN(value)) {
                    return value.toFixed(2);
                }
                else {
                    return parseInt(value).toFixed(2);
                }
            }
            else {
                return "null";
            }
        },

        //生成列表序号
        generateIndex: function (value, row, index) {
            return index + 1;
        },
        //生成查看明细与删除按钮
        opt: function (value, row, index) {
            return [
                '<a class="search_detail" href="javascript:void(0)" title="detail">',
                '明细',
                '</a>  ',
                '<a class="row_remove" href="javascript:void(0)" title="Remove">',
                '删除',
                '</a>'
            ].join('');
        },
        //生成编辑按钮和删除按钮
        operateFormatter: function (value, row, index) {
            return [
                '<a class="row_edit" href="javascript:void(0)" title="">',
                '编辑',
                '</a>  ',
                //'<a class="row_remove" href="javascript:void(0)" title="Remove">',
                //'删除',
                //'</a>'
                '<a class="row_remove" style="color:red;" href="javascript:void(0)" title="Remove">' +
                '<i class="glyphicon glyphicon-remove"></i></a>'
            ].join('');
        },
        operateSmallFormatter: function (value, row, index) {
            return [
                '<a class="row_edit" href="javascript:void(0)" title="">',
                '<i class="glyphicon glyphicon-edit"></i></a>  ',
                //'<a class="row_remove" href="javascript:void(0)" title="Remove">',
                //'删除',
                //'</a>'
                '<a class="row_remove" style="color:red;" href="javascript:void(0)" title="Remove">' +
                '<i class="glyphicon glyphicon-remove"></i></a>'
            ].join('');
        },
        editFormatter: function (value, row, index) {
            return [
                '<a class="row_edit" href="javascript:void(0)" title="">',
                '编辑',
                '</a>  '
            ].join('');
        },

        //生成编辑事件和删除事件
        operateEvents: {
            'click .row_remove': function (e, value, row, index) {
                var $table = $(e.target).closest("table");
                $table.bootstrapTable('remove', {
                    field: 'drug_name',
                    values: [row.id]
                });
            }
        },

        //生成删除按钮
        deleteFormatter: function (value, row, index) {
            return [
                '<a class="table_remove" href="javascript:void(0)" title="Remove">',
                '<i class="am-icon-remove"></i>',
                '</a>'
            ].join('');
        },
        //生成删除事件
        deleteDrugEvents: {
            'click .table_remove': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table");
                //debugger
                $table_t.bootstrapTable('remove', {
                    field: 'id',
                    values: [row.id]
                });
                $table_t.bootstrapTable("onRemoveRow");
            }
        },
        //生成删除事件
        deleteGoodsEvents: {
            'click .table_remove': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table");
                //debugger
                $table_t.bootstrapTable('remove', {
                    field: 'goods_id',
                    values: [row.goods_id]
                });
                $table_t.bootstrapTable("onRemoveRow");
            }
        },
        deleteRow: {
            'click .table_remove': function (e, value, row, index) {
                var $table_t = $(e.target).closest("table");
                //debugger
                $table_t.bootstrapTable('remove', {
                    field: 'drug_code',
                    values: [row.drug_code]
                });
                $table_t.bootstrapTable("onRemoveRow");
            }
        },

        //datepicker组件,禁用事件的渲染方法
        //开始日期,state为0;结束日期,state为1.
        dateRender: function ($elem, state) {
            var value = $elem.val();
            var render = function (date, viewMode) {
                if (value) {
                    var inTime = new Date(endDate);
                    var inDay = inTime.valueOf();
                    var inMoth = new Date(inTime.getFullYear(), inTime.getMonth(), 1, 0, 0, 0, 0).valueOf();
                    var inYear = new Date(inTime.getFullYear(), 0, 1, 0, 0, 0, 0).valueOf();
                    // 默认 days 视图，与当前日期比较
                    var viewDate = inDay;

                    switch (viewMode) {
                        // moths 视图，与当前月份比较
                        case 1:
                            viewDate = inMoth;
                            break;
                        // years 视图，与当前年份比较
                        case 2:
                            viewDate = inYear;
                            break;
                    }

                    return start ? (date.valueOf() >= viewDate ? 'am-disabled' : '') : (date.valueOf() <= viewDate ? 'am-disabled' : '');
                }


            }
            return render
        },
        formatTitle: function (value, row, index) {
            var level = {
                'D10': "主任医师",
                'D20': "副主任医师",
                'D30': "主治医师",
                'D40': "住院医师",
            }
            return level[value];
        },
        formatGender: function (value, row, index) {
            if(value=='M'){
                return '男'
            }
            else if(value=='F'){
                return '女'
            }
            else{
                return '不详'
            }
        },
        formatChosenDoctors: function (value, row, index) {
            if (row['type'] == 'getData') {
                if(value.length) {
                    var names = value.map(function (a) {
                        return a['doctor_name']
                    }).join(',');
                    var ids = value.map(function (a) {
                        return a['doctor_id']
                    }).join(',');
                    return $('<span></span>').attr('docvalue', ids).html(names)[0].outerHTML;
                }
                return '<span></span>'
            }
            else {
                var $select = $('<select multiple></select>'),selectVal=[];
                value.forEach(function (doctor) {
                    $select.addClass('onDutyDoctors')
                        .append($('<option></option>')
                            .val(doctor['doctor_id'])
                            .html(doctor['doctor_name']));
                })
                if(value.type=='morning')
                {
                    selectVal=row['selectedMorning'].map(function(x){return x['doctor_id']})
                }
                else if(value.type=='afternoon'){
                    selectVal=row['selectedAfternoon'].map(function(x){return x['doctor_id']})
                }
                else{
                    selectVal=row['selectedEvening'].map(function(x){return x['doctor_id']})
                }
                $select.attr('periodType',value.type);
                $select.attr('selectedValue',selectVal.join(','))
                return $select[0].outerHTML;
            }
        },
        getDateStr: function (date) {
            var day = date.getDate();
            var year = date.getFullYear();
            var month = date.getMonth();
            return [year,month+1,day].join('-')
        }
    }
    return jctLibs;
})
