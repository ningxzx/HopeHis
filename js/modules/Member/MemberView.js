/**
 * Created by hl on 15-11-16.
 */
define(['txt!../Common/sidebar.html',
        '../Member/memberList/memberListView',
        '../Member/memberStatistics/memberStatisticsView',
        '../Member/memberSetting/memberSettingView',
        '../Member/memberRecord/memberRecordView',
        'jquery','handlebars','backbone'],
    function (sidebarTemp,memberListView,memberStatisticsView,memberSettingView,memberRecordView,jquery,Handlebars,backbone){
        var sidebarData={
            topic:"会员",
            description:"管理会员信息,查看会员消费充值记录,设置会员等级",
            submenus: [
                { spanClass: "am-icon-user", submenu: "会员列表", sublink: "#member/memberList", subid:"member_memberList",parents: ""},
                { spanClass: "am-icon-th", submenu: "会员统计", sublink: "#member/memberStatistics",subid:"member_memberStatistics", parents: ""},
                { spanClass: "am-icon-cog", submenu: "会员等级设置", sublink: "#member/memberSetting", subid:"member_memberSetting",parents: ""},
                { spanClass: "am-icon-money", submenu: "会员充值记录", sublink: "#member/memberRecord", subid:"member_memberRecord",parents: ""}
            ]
        };
        var subviews={
            memberList: memberListView,
            memberStatistics: memberStatisticsView,
            memberSetting: memberSettingView,
            memberRecord: memberRecordView
        };
        var registView = Backbone.View.extend({
            template : Handlebars.compile(sidebarTemp),
            events:{
                "click .submenu":"reRender"
            },
            /***点击子菜单回到子菜单原始页面***/
            reRender: function (e) {
                var submenuId=$(e.target).closest("li").attr("id").split("_")[1];
                //防止点击别的子菜单时再次渲染
                if(submenuId!==this.id){
                    return ;
                }
                this.subview = new subviews[submenuId]();
                this.subview.render();
                /***刷新amdin-content的内容,backbone会给el自动加一层div,因此直接取内层div的内容**/
                $(this.el).find(".admin-content").parent().html($(this.subview.el));
            },
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
