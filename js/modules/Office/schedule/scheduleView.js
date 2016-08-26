define(['txt!../../Office/schedule/schedule.html',
        '../../Common/commonModel',
        '../../Office/schedule/scheduleModel',
        'handlebars', 'backbone', "jctLibs", 'calender'],
    function (Template, commonModel, model, Handlebars, backbone, jctLibs, calender) {

        //获取数据
        var t_date = new Date();
        var week = t_date.getDay();
        var scheduleView = Backbone.View.extend({
            initialize: function () {
                this.commonModel = new commonModel();
                this.model = new model();
                this.listenTo(this.commonModel, "getWeekSchedule", this.renderWeek);
                this.listenTo(this.commonModel, "getDaySchedule", this.renderDay);
            },
            events: {
                "click .index_calender td": "changeSelect"
            },
            changeSelect: function () {
                var dates = $(this.el).find(".index_calender").dpGetSelected();//分别存放年，月，周，日
                dates[1] = dates[1] + 1;
                var select_day = [];
                select_day.push(dates[0]);
                select_day.push(dates[1]);
                select_day.push(dates[3]);
                var ouou = select_day.join("-");
                var doctorId = sessionStorage.getItem('doctor_id');
                this.commonModel.search('admin.scheduling', {
                    doctor_id: doctorId,
                    plan_date_time: ouou
                }, 'getDaySchedule');
            },
            renderWeek: function (res) {
                if (res.rows) {
                    var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                    res.rows.forEach(function (value) {
                        value["plan_date_time"] = value["plan_date_time"].substring(0, 10) + "&emsp;" + week[new Date(value["plan_date_time"]).getDay()];
                        if (value["planwork_type"] == "1") {
                            value["morning"] = "上班";
                        } else if (value["planwork_type"] == "2") {
                            value["afternoon"] = "上班";
                        } else if (value["planwork_type"] == "4") {
                            value["night"] = "上班";
                        } else if (value["planwork_type"] == "3") {
                            value["morning"] = "上班";
                            value["afternoon"] = "上班";
                        } else if (value["planwork_type"] == "5") {
                            value["morning"] = "上班";
                            value["night"] = "上班";
                        } else if (value["planwork_type"] == "6") {
                            value["afternoon"] = "上班";
                            value["night"] = "上班";
                        } else if (value["planwork_type"] == "7") {
                            value["morning"] = "上班";
                            value["afternoon"] = "上班";
                            value["night"] = "上班";
                        } else {
                            value["morning"] = "";
                            value["afternoon"] = "";
                            value["night"] = "";
                        }
                    });
                    $(this.el).find("#week_schedule").bootstrapTable("load", res.rows);
                } else {
                    console.log("数据有误");
                }
            },
            renderDay: function (res) {
                if (res.rows) {
                    var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                    var value = res.rows[0];
                    value["plan_date_time"] = value["plan_date_time"].substring(5, 10) + "&emsp;" + week[new Date(value["plan_date_time"]).getDay()];
                    if (value["planwork_type"] == "1") {
                        value["morning"] = "上班";
                    } else if (value["planwork_type"] == "2") {
                        value["afternoon"] = "上班";
                    } else if (value["planwork_type"] == "4") {
                        value["night"] = "上班";
                    } else if (value["planwork_type"] == "3") {
                        value["morning"] = "上班";
                        value["afternoon"] = "上班";
                    } else if (value["planwork_type"] == "5") {
                        value["morning"] = "上班";
                        value["night"] = "上班";
                    } else if (value["planwork_type"] == "6") {
                        value["afternoon"] = "上班";
                        value["night"] = "上班";
                    } else if (value["planwork_type"] == "7") {
                        value["morning"] = "上班";
                        value["afternoon"] = "上班";
                        value["night"] = "上班";
                    } else {
                        value["morning"] = "";
                        value["afternoon"] = "";
                        value["night"] = "";
                    }
                    $("#someday_schedule").bootstrapTable("load", [value]);
                } else {
                    $("#someday_schedule").bootstrapTable("load", []);
                }
            },
            render: function () {
                $(this.el).html(Template);
                //传入四个参数，第一个是目标table元素，第二个是标题及字段的数组，第三个是数据源，第四个为是否需要编辑true/false
                $(this.el).find("#week_schedule").bootstrapTable({
                    columns: [
                        {field: "plan_date_time", title: ""},
                        {field: "morning", title: "8:00-12:00"},
                        {field: "afternoon", title: "13:00-17:00"},
                        {field: "night", title: "19:00-21:00"}
                    ],
                    data: []
                });
                $(this.el).find("#someday_schedule").bootstrapTable({
                    columns: [
                        {field: "plan_date_time", title: ""},
                        {field: "morning", title: "8:00-12:00"},
                        {field: "afternoon", title: "13:00-17:00"},
                        {field: "night", title: "19:00-21:00"}
                    ],
                    data: []
                });
                $(this.el).find(".index_calender").datePicker({
                    inline: true,
                    selectMultiple: false,
                    calenderId: "officeCl"
                });
                var doctorId = sessionStorage.getItem('doctor_id');
                var str_d = jctLibs.dataGet.getWeekStartDate(); //jctLib
                var end_d = jctLibs.dataGet.getWeekEndDate();
                this.commonModel.search('admin.scheduling', {
                    doctor_id: doctorId,
                    plan_date_time: str_d + "|" + end_d
                }, 'getWeekSchedule');
                return this;
            }
        });
        return scheduleView;
    });