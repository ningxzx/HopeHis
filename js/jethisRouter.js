define(['jquery',
        'modules/Index/indexView',
        'modules/Regist/registView',
        'modules/Diagnose/diagnoseView',
        'modules/Patient/patientView',
        'modules/Office/officeView',
        'modules/Medicine/medicineView',
        'modules/Bill/billView',
        'modules/Setting/settingView',
        'modules/Member/MemberView',
        'modules/Statistical/statisticalView',
        'amazeui',
        'underscore',
        'backbone',
        'wangEditor',
        'jctLibs'
    ],
    function ($,indexView, registView, diagnoseView, patientView, officeView, medicineView, billView, settingView, MemberView, statisticalView, Ai, Underscore, Backbone,editor,jctLibs) {
        var Router = Backbone.Router.extend({
            routes: {
                '': 'Index',
                'regist(/:optional)': 'Regist',
                'diagnose': 'Diagnose',
                'patient(/:optional)': 'Patient',
                'office(/:optional)': 'Office',
                'medicine(/:optional)': 'Medicine',
                'bill(/:optional)': 'Bill',
                'setting(/:optional)': 'Setting',
                'member(/:optional)': 'Member',
                'statistical(/:optional)': 'Statistical'
            },
            firstPage: true,

            Index: function (actions) {
                var menu = "index_menu";
                this.changePage(new indexView(), menu);
            },
            Regist: function (submenu) {
                var menu = "regist_menu";
                if (submenu) {
                    this.changePage(new registView({id: submenu}), menu, submenu);
                }
                else {
                    this.changePage(new registView(), menu);
                }
            },
            Diagnose: function (actions) {
                var menu = "diagnose_menu";
                this.changePage(new diagnoseView(), menu);
            },
            Patient: function (submenu) {
                var menu = "patient_menu";
                if (submenu) {
                    this.changePage(new patientView({id: submenu}), menu, submenu);
                }
                else {
                    this.changePage(new patientView(), menu);
                }
            },
            Office: function (submenu) {
                var menu = "office_menu";
                if (submenu) {
                    this.changePage(new officeView({id: submenu}), menu, submenu);
                }
                else {
                    this.changePage(new officeView(), menu);
                }
            },
            Medicine: function (submenu) {
                var menu = "medicine_menu";
                if (submenu) {
                    this.changePage(new medicineView({id: submenu}), menu, submenu);
                }
                else {
                    this.changePage(new medicineView(), menu);
                }
            },
            Bill: function (submenu) {
                var menu = "bill_menu";
                if (submenu) {
                    this.changePage(new billView({id: submenu}), menu, submenu);
                }
                else {
                    this.changePage(new billView(), menu);
                }
            },
            Member: function (submenu) {
                var menu = "member_menu";
                if (submenu) {
                    this.changePage(new MemberView({id: submenu}), menu, submenu);
                }
                else {
                    this.changePage(new MemberView(), menu);
                }
            },
            Setting: function (submenu) {
                var menu = "setting_menu";
                if (submenu) {
                    this.changePage(new settingView({id: submenu}), menu, submenu);
                }
                else {
                    this.changePage(new settingView(), menu);
                }
            },
            Statistical: function (submenu) {
                var menu = "statistical_menu";
                if (submenu) {
                    this.changePage(new statisticalView({id: submenu}), menu, submenu);
                }
                else {
                    this.changePage(new statisticalView(), menu);
                }
            },
            changePage: function (view, menu, submenu) {
                $.ajaxSetup({
                    headers:{
                        'app-key': 'fb98ab9159f51fd1',
                        'app-secret': '09f7c8cba635f7616bc131b0d8e25947s',
                        'Authorization':sessionStorage.getItem('token'),
                        'account_id':sessionStorage.getItem('user_id')
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        if(jqXHR.code=='604'){
                            alert('当前用户已登录！');
                            window.location.href='http://www.jethis.cn';
                            return;
                        }
                        switch (jqXHR.status){
                            case(500):
                                alert("服务器系统内部错误");
                                break;
                            case(401):
                                alert("未登录");
                                window.location.href='http://www.jethis.cn';
                                break;
                            case(403):
                                alert("无权限执行此操作");
                                break;
                            case(408):
                                alert("请求超时");
                                break;
                            case(404):
                                var res=$.parseJSON(jqXHR.responseText);
                                if(res.code=='605'){
                                    alert(res.message);
                                    window.location.href='http://www.jethis.cn';
                                    return;
                                }
                            default:
                        }
                    },
                });
                view.render();
                var $el=$(view.el);
                $el.find(".start").each(function (i, elem) {
                    $(elem).datepicker({
                        onRender: function (date, viewMode) {
                            var endDate = $el.find(".end").eq(i).val();
                            if (endDate) {
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

                                return date.valueOf() >= viewDate ? 'am-disabled' : '';
                            }

                        }
                    })
                });
                $el.find(".end").each(function (i, elem) {
                    $(elem).datepicker({
                        onRender: function (date, viewMode) {
                            var startDate = $el.find(".start").eq(i).val();
                            if (startDate) {
                                var inTime = new Date(startDate);
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

                                return date.valueOf() <= viewDate ? 'am-disabled' : '';
                            }

                        }
                    })
                });
                $('.admin-main').html($(view.el));
                if (submenu) {
                    var subid = menu.slice(0, -5) + "_" + submenu;
                    var $submenu = $("#" + subid);
                    $submenu.find("a").addClass("menu_on");
                }
                var $menu = $("#" + menu);
                $("#main_menu li").removeClass("menu-active");
                $menu.addClass("menu-active");
                //绑定excel输出函数
                $('.excel_tool').off('click').on('click', function () {
                    var $panel=$(this).closest('.am-panel');
                    var $table=$panel.find('.am-panel-bd .fixed-table-body table');
                    var title=$panel.find('.panel_title').html()+' '+jctLibs.dataGet.currentDate();
                    $table.one('page-change.bs.table', function () {
                        $table.tableExport({type:'excel',fileName:title})
                        $table.bootstrapTable('togglePagination');
                    });
                    $table.bootstrapTable('togglePagination');
                })
                $('.first_focus').focus();
                $.ajax({
                    url:'http://192.168.0.220:8081/jethis/message/messageNum',
                    type:'get',
                    success:function (res) {
                        $('#messages').html(res.msgNum);
                    },
                    error:function (res) {
                        
                    }
                })
            }
        });
        return Router;
    }
);
