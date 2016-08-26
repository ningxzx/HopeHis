/**
 * Created by xiangzx on 15-11-12.
 */
define(['txt!../Common/sidebar.html',
        '../Setting/myClinic/myClinicView',
        '../Setting/functionSetting/functionSettingView',
        '../Setting/changePersonal/changePersonalView',
        '../Setting/userMange/userMangeView',
        '../Setting/dicTableMaintain/dicTableMaintainView',
        '../Setting/recipeMaintain/recipeMaintainView',
        '../Setting/menuSet/menuSetView',
        '../Setting/checkSet/checkSetView',
        '../Setting/recipeFeeSet/recipeFeeSetView',
        '../Setting/typiclCase/typiclCaseView',
        '../Setting/adviceSet/adviceSetView',
        '../Setting/departMange/departMangeView',
        '../Setting/registerFeeSet/registerFeeSetView',
        '../Setting/accountRefer/accountReferView',
        '../Setting/sysDataBackup/sysDataBackupView',
        '../Setting/Setwindow/SetwindowView',
        '../Setting/myFeedback/myFeedbackView',
        'jquery', 'handlebars', 'backbone'],
    function (sidebarTemp, myClinicView,functionSettingView, changePersonalView, userMangeView, dicTableMaintainView, recipeMaintainView, menuSetView, checkSetView, recipeFeeSetView, typiclCaseView, adviceSetView, departMangeView, registerFeeSetView, accountReferView, sysDataBackupView, SetwindowView, myFeedbackView, jquery, Handlebars, backbone) {
        var sidebarData = {
            topic: "系统设置",
            description: "设置诊所信息,管理用户,设置医疗基础信息,管理模板,设置基础费用,设置打印系统等功能",
            submenus: [
                {spanClass: "am-icon-info", submenu: "我的诊所", sublink: "#setting/myClinic", subid: "setting_myClinic", parents: ""},
                {spanClass: "am-icon-twitter", submenu: "功能设置", sublink: "#setting/functionSetting", subid: "setting_functionSetting", parents: ""},
                {spanClass: "am-icon-home", submenu: "修改个人信息", sublink: "#setting/changePersonal", subid: "setting_changePersonal", parents: ""},
                {spanClass: "am-icon-apple", submenu: "科室管理", sublink: "#setting/departMange", subid: "setting_departMange", parents: ""},
                {spanClass: "am-icon-apple", submenu: "用户管理", sublink: "#setting/userMange", subid: "setting_userMange", parents: ""},
                { spanClass: "am-icon-ils", submenu: "角色权限设置", sublink: "#setting/menuSet", subid: "setting_menuSet", parents: ""},
                {spanClass: "am-icon-apple", submenu: "挂号费用设置", sublink: "#setting/registerFeeSet", subid: "setting_registerFeeSet", parents: ""},
                {spanClass: "am-icon-apple", submenu: "诊疗模板设置", sublink: "#setting/recipeMaintain", subid: "setting_recipeMaintain", parents: ""},
                {spanClass: "am-icon-apple", submenu: "检查项目设置", sublink: "#setting/checkSet", subid: "setting_checkSet", parents: ""},
                //{spanClass: "am-icon-apple", submenu: "处方费用设置", sublink: "#setting/recipeFeeSet", subid: "setting_recipeFeeSet",parents: ""},
                {spanClass: "am-icon-facebook", submenu: "字典表维护", sublink: "#setting/dicTableMaintain", subid: "setting_dicTableMaintain", parents: ""},
                //{ spanClass: "am-icon-apple", submenu: "典型病例", sublink: "#setting/typiclCase", subid: "setting_typiclCase", parents: ""},
                ////{ spanClass: "am-icon-apple", submenu: "诊聊设置", sublink: "#setting/adviceSet", subid: "setting_adviceSet", parents: ""},
                //{ spanClass: "am-icon-apple", submenu: "账号登陆查询", sublink: "#setting/accountRefer", subid: "setting_accountRefer", parents: ""},
                ////{ spanClass: "am-icon-apple", submenu: "系统数据备份", sublink: "#setting/sysDataBackup", subid: "setting_sysDataBackup", parents: ""},
                //{ spanClass: "am-icon-apple", submenu: "设置窗口", sublink: "#setting/Setwindow", subid: "setting_Setwindow", parents: ""},
                //{ spanClass: "am-icon-apple", submenu: "我的反馈", sublink: "#setting/myFeedback", subid: "setting_myFeedback", parents: ""}
            ]
        };
        var subviews = {
            myClinic: myClinicView,
            functionSetting:functionSettingView,
            changePersonal: changePersonalView,
            userMange: userMangeView,
            dicTableMaintain: dicTableMaintainView,
            recipeMaintain: recipeMaintainView,
            menuSet: menuSetView,
            checkSet: checkSetView,
            recipeFeeSet: recipeFeeSetView,
            typiclCase: typiclCaseView,
            adviceSet: adviceSetView,
            departMange: departMangeView,
            registerFeeSet: registerFeeSetView,
            accountRefer: accountReferView,
            sysDataBackup: sysDataBackupView,
            Setwindow: SetwindowView,
            myFeedback: myFeedbackView
        };
        var settingView = Backbone.View.extend({
            template: Handlebars.compile(sidebarTemp),
            render: function () {
                var paths=sessionStorage.getItem('menu_path');
                sidebarData.submenus=sidebarData.submenus.filter(function(menu){
                    return paths.indexOf(menu['sublink'])!=-1
                })
                var sidebarHtml = this.template(sidebarData);
                $(this.el).append(sidebarHtml);
                if (this.id) {
                    var subview = new subviews[this.id]();
                    subview.render();
                    $(this.el).append(subview.el);
                }

                return this;
            },
            events: {
                "click .submenu": "reRender"
            },
            /***点击子菜单回到子菜单原始页面***/
            reRender: function (e) {
                //获取当前事件的 dom
                var submenuId = $(e.target).closest("li").attr("id").split("_")[1];
                //防止点击别的子菜单时再次渲染
                if (submenuId !== this.id) {
                    return;
                }
                //new 一个当前点击事件 的 view对象
                this.subview = new subviews[submenuId]();
                //执行对象里面的render属性
                this.subview.render();
                /***刷新amdin-content的内容,backbone会给el自动加一层div,因此直接取内层div的内容**/
                $(this.el).find(".admin-content").parent().html($(this.subview.el));
            }
        });
        return settingView;
    });
