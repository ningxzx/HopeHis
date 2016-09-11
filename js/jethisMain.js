// main.js 主控程序
require.config({
    paths: {
        'jquery': 'libs/amazeui/js/jquery.min',
        'underscore': 'libs/underscore/underscore-min',
        'handlebars': 'libs/handlebars/handlebars.min',
        'backbone': 'libs/backbone/backbone',
        'txt': 'libs/require-text/text',
        'amazeui': 'libs/amazeui/js/amazeui',
        'jctLibs': 'libs/jctlibs/function',
        'bootstrap': 'libs/bootstrap/bootstrap',
        'bootstrapTable': 'libs/bootstrap-table/bootstrap-table',
        'calender': 'plugins/calender/calender',
        'chosen': 'plugins/amazeui-chosen/amazeui.chosen',
        'tableExport': 'plugins/tableExport/tableExport',
        'editBt': 'plugins/bootstrap3-editable/js/bootstrap-editable',
        'aes': 'libs/cryptojslib/rollups/amdAes',
        'padding': 'libs/cryptojslib/components/amdPad',
        'base64': 'libs/jctlibs/amdBase64',
        'md5': 'libs/cryptojslib/rollups/amdMD5',
        'wangEditor': "libs/wang/js/wangEditor",
        'printThis': "plugins/print/printThis",
        'intro': 'libs/intro/intro.min',
        'chart': 'libs/highcharts/highcharts.src',
        'bt_switch': 'plugins/switch/js/bootstrap-switch.min',
    },
    shim: {
        'bootstrap': ['jquery'],
        'bootstrapTable': ['bootstrap'],
        'amazeui': ['jquery'],
        'calender': ['jquery'],
        'chosen': ['amazeui'],
        'editBt': ['bootstrap'],
        'tableExport': ['jquery'],
        'padding': ['aes'],
        'printThis': ['jquery'],
        'chart':['jquery']
    }
});
require(['config', 'jquery', 'jethisRouter', 'underscore', 'backbone','jctLibs', 'amazeui', 'aes', 'padding', 'base64', 'md5'], function (Config, $, Router, Underscore, Backbone, jctLibs) {
    $(function () {
        window.onbeforeunload = function (e) {
            //e = e || window.event;
            //
            //// 兼容IE8和Firefox 4之前的版本
            //if (e) {
            //    e.returnValue = '关闭提示';
            //}
            //
            //// Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
            //return '关闭提示';
        };
        window.token = '';
        window.router = new Router();
        Backbone.history.start();
        // $('.compName').off('click').on('click', function () {
        //     window.location.href = '#'
        //     return false
        // })
        if (window.sessionStorage) {
            var username = sessionStorage.getItem('user_name');
            var deptname = sessionStorage.getItem('department_name');
            if (username != 'null') {
                document.getElementById("userName").innerHTML = username || "";
            }
            if (deptname != 'null') {
                document.getElementById("deptName").innerHTML = deptname || "";
            }
        }
        document.getElementById("backoff").onclick = function () {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('enterprise_name');
            sessionStorage.removeItem('enterprise_input_code');
            sessionStorage.removeItem('enterprise_id');
            window.location.href = 'http://www.jethis.cn/'
        }

        //根据权限显示主菜单
        var paths= sessionStorage.getItem('menu_path').split(',');
        var mainPaths=paths.filter(function(path){
            return path[0]!=='#';
        });
        var subPaths=paths.filter(function(path){
            return path[0]==='#'
        });
        var mainMenu = ['<li id="regist_menu"><a href="#regist/register"><span class="am-icon-medkit"></span>挂号</a></li>',
            '<li id="diagnose_menu"><a href="#diagnose"><span class="am-icon-stethoscope"></span>诊疗</a></li>',
            '<li id="bill_menu"><a href="#bill/charge"><span class="am-icon-money"></span>财务</a></li>',
            '<li id="medicine_menu"><a href="#medicine/mcurStorage"><span class="am-icon-flask"></span>药品</a></li>',
            '<li id="patient_menu"><a href="#patient/patientClass"><span class="am-icon-male"></span>患者</a></li>',
            '<li id="office_menu"><a href="#office/arrange"><span class="am-icon-pencil"></span>办公</a></li>',
            '<li id="member_menu"><a href="#member/memberList"><span class="glyphicon glyphicon-user"></span>会员</a></li>',
            '<li id="statistical_menu"><a href="#statistical/yearReport"><span class="am-icon-pie-chart"></span>统计</a></li>',
            '<li id="setting_menu"><a href="#setting/myClinic"><span class="am-icon-cog"></span>设置</a></li>',
        ];
        var roleMenu=mainMenu.map(function(li){
            var $li=$(li);
            if(mainPaths.indexOf($li.attr('id'))!=-1){
                var type=$li.attr('id').split('_')[0];
                var submenus=subPaths.filter(function (path) {
                    return (path.split('/')[0]).slice(1)==type
                });
                $li.find('a').attr('href',submenus[0]);
                return $li.prop('outerHTML');
            }
        });
        $('#main_menu').append(roleMenu.join(''))
        var menu=Backbone.history.fragment.split('/')[0],$menu = $("#" + menu+'_menu');
        $("#main_menu li").removeClass("menu-active");
        $menu.addClass("menu-active");

        //轮询
        var sessionAsk = window.setInterval('clock()', 60000)
        window.clock = function () {
            $.ajax({
                type: 'get',
                url: 'http://192.168.0.220:8081/jethis/login/flag',
                data: {account_id: sessionStorage.getItem('user_id')},
            })
        };
        //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
//site www.jbxue.com
        function banBackSpace(e){
            var ev = e || window.event;//获取event对象
            var obj = ev.target || ev.srcElement;//获取事件源
            var name = obj.nodeName.toLowerCase();//获取事件源类型
            //获取作为判断条件的事件类型
            var vReadOnly = obj.readOnly;
            var vDisabled = obj.disabled;
            //处理undefined值情况
            vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
            vDisabled = (vDisabled == undefined) ? true : vDisabled;
            //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
            //并且readOnly属性为true或disabled属性为true的，则退格键失效
            var flag1= ev.keyCode == 8 && ( name=='input'||name == "textarea")&& (vReadOnly==true || vDisabled==true);
            //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
            var flag2= ev.keyCode == 8 && name!='input'&&name != "textarea"&&obj.className!='wangEditor-textarea' ;
            //判断
            if(flag2 || flag1)return false;
        }
//禁止退格键 作用于Firefox、Opera
        document.onkeypress=banBackSpace;
//禁止退格键 作用于IE、Chrome
        document.onkeydown=banBackSpace
    });
});
