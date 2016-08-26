/**
 * Created by hl on 15-11-16.
 */
define(['txt!../Common/sidebar.html',
        '../Regist/register/registerView',
        '../Regist/searchRegister/searchRegisterView',
        '../Regist/totalRegister/totalRegisterView',
        'jquery','handlebars','backbone'],
    function (sidebarTemp,registerView,searchRegisterView,totalRegisterView,jquery,Handlebars,backbone){
        var sidebarData={
            topic:"挂号",
            description:"当日挂号,现场预约挂号,患者登记,挂号记录查询",
            submenus: [
                { spanClass: "am-icon-info", submenu: "新开就诊", sublink: "#regist/register", parents: "", subid: "regist_register"},
                { spanClass: "am-icon-apple", submenu: "查询挂号", sublink: "#regist/searchRegister", parents: "", subid: "regist_searchRegister"},
                { spanClass: "am-icon-apple", submenu: "挂号统计", sublink: "#regist/totalRegister", parents: "", subid: "regist_totalRegister"}
            ]
        };
        var subviews={
            register: registerView,
            searchRegister: searchRegisterView,
            totalRegister: totalRegisterView
        };
        var registView = Backbone.View.extend({
            template : Handlebars.compile(sidebarTemp),
            render:function() {
                var paths=sessionStorage.getItem('menu_path');
                sidebarData.submenus=sidebarData.submenus.filter(function(menu){
                    return paths.indexOf(menu['sublink'])!=-1
                })
                var sidebarHtml=this.template(sidebarData);
                $(this.el).append(sidebarHtml);
                if(this.id) {
                    var subview = new subviews[this.id]();
                    subview.render();
                    $(this.el).append(subview.el);
                }

                return this;
            }
        });
        return registView;
    });
