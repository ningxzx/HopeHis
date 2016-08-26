/**
 * Created by hl on 15-11-16.
 */
define(['txt!../Common/sidebar.html',
        '../Office/postDynamicNews/pdnView',
        '../Office/arrange/arrangeView',
        '../Office/schedule/scheduleView',
        '../Office/sendInfo/sendInfoView',
        '../Office/historyMessage/historyMessageView',
        '../Office/allNews/allNewsView',
        '../Office/allDynamicNews/adnView',
        'handlebars', 'backbone'],
    function (sidebarTemp, pdnView, arrangeView, scheduleView, sendInfoView,historyMessageView,allNewsView,adnView, Handlebars, backbone) {
        var sidebarData = {
            topic:"办公",
            description:"查看坐诊计划(对医生进行排班),安排行程",
            submenus: [
                {
                    spanClass: "am-icon-plane",
                    submenu: "坐诊计划",
                    sublink: "#office/schedule",
                    subid: "office_schedule",
                    parents: ""
                },
                {
                    spanClass: "am-icon-film",
                    submenu: "排班",
                    sublink: "#office/arrange",
                    subid: "office_arrange",
                    parents: ""
                },
                {
                    spanClass: "am-icon-send",
                    submenu: "推送通知",
                    sublink: "#office/sendInfo",
                    subid: "office_sendInfo",
                    parents: ""
                },
                {
                    spanClass: "am-icon-tasks",
                    submenu: "我的通知",
                    sublink: "#office/historyMessage",
                    subid: "office_historyMessage",
                    parents: ""
                },
                {
                    spanClass: "am-icon-newspaper-o",
                    submenu: "全部通知",
                    sublink: "#office/allNews",
                    subid: "office_allNews",
                    parents: ""
                },
                {
                    spanClass: "am-icon-instagram",
                    submenu: "发布动态",
                    sublink: "#office/postDynamicNews",
                    subid: "office_postDynamicNews",
                    parents: ""
                },
                {
                    spanClass: "am-icon-ioxhost",
                    submenu: "全部动态",
                    sublink: "#office/allDynamicNews",
                    subid: "office_allDynamicNews",
                    parents: ""
                }
            ]
        };
        var subviews = {
            arrange: arrangeView,
            schedule: scheduleView,
            sendInfo: sendInfoView,
            historyMessage:historyMessageView,
            allNews:allNewsView,
            postDynamicNews:pdnView,
            allDynamicNews:adnView,
        };
        var officeView = Backbone.View.extend({
            template: Handlebars.compile(sidebarTemp),
            render: function () {
                var paths=sessionStorage.getItem('menu_path');
                sidebarData.submenus=sidebarData.submenus.filter(function(menu){
                    return paths.indexOf(menu['sublink'])!=-1
                });
                var sidebarHtml = this.template(sidebarData);
                $(this.el).append(sidebarHtml);
                if (this.id) {
                    var subview = new subviews[this.id]();
                    subview.render();
                    $(this.el).append(subview.el);
                }

                return this;
            }
        });
        return officeView;
    });
