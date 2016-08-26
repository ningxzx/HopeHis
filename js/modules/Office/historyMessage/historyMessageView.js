define(['txt!../../Office/historyMessage/historyMessage.html',
        '../../Office/historyMessage/historyMessageModel',
        '../../Common/basicTable',
        'handlebars', 'backbone', "chosen", "jctLibs"],
    function (Template, historyMessageModel, tab, Handlebars, backbone, chose, jctLibs) {
        var opt = function (value, row, index) {
            return [
                //'<a class="member_edit" href="javascript:void(0)" title="detail">',
                //'编辑',
                //'</a>  ',
                '<a class="remove" style="color:red;" href="javascript:void(0)" title="Remove">' +
                '<i class="glyphicon glyphicon-remove"></i></a>'
            ].join('');
        };

        var view = Backbone.View.extend({
            initialize: function () {
                this.id = window.location.href.split('=')[1];
                console.log(this.id);
                this.model = new historyMessageModel();
                this.listenTo(this.model, "gethistoryreder", this.hisreder);
                this.listenTo(this.model, "dellhistoryreder", this.DellhistoryReder);
                this.listenTo(this.model, "getcontent", this.Getcontent);
            },
            Getcontent: function (res) {
                if (res.errorNo==0) {
                    var data = res.rows[0];
                    $(this.el).find("#my_news").removeClass("hid");
                    $(this.el).find(".post_people").html(data.user_name);
                    $(this.el).find(".post_time").html(data.create_date_time);
                    $(this.el).find(".news_title").html(data.title);
                    $(this.el).find("#my_news .content div").html(data.text_value);
                    this.historyMessageBtn();
                } else {
                    $(this.el).find("#my_news").addClass("hid");
                }

            },
            DellhistoryReder: function (data) {
                //console.log(data);
                if (data['rows'].state == 100) {
                    this.model.gethistoryreder();
                }
            },
            hisreder: function (res) {
                if (res.errorNo == 0 && res.rows.length > 0) {
                    this.$el.find("#historyMessage_tbl").bootstrapTable('load', res.rows)
                }
                else {
                    this.$el.find("#historyMessage_tbl").bootstrapTable('load', [])
                }
            },
            events: {
                "click #historyMessage_btn": "historyMessageBtn",
                "click #historyMessage_panel .add_level": "historyMessagePanel",
                "click #historyMessage_panel .refresh_level": "historyMessageBtn",
                "keyup #hm_id":"historyMessageBtn"
            },
            historyMessageBtn: function () {
                var title = $(this.el).find("#hm_id").val();
                var name = $(this.el).find("#hism_name").val();
                var start = $(this.el).find(".start_calender").val();
                var end = $(this.el).find(".end_calender").val();
                this.model.gethistoryreder(title, name, start, end);
            },
            historyMessagePanel: function () {
                window.location.href = '#office/sendInfo';
            },
            render: function () {
                var $el = $(this.el), _this = this;
                $(this.el).html(Template);

                this.$el.find("#historyMessage_tbl").bootstrapTable({
                    columns: [
                        {field: 'title', title: '标题'},
                        {field: 'create_date_time', title: '创建日期'},],
                    data: [],
                    pagination: true,
                    pageSize: 10,
                    rowStyle: function (row) {
                        if (row['read_state'] == 'yd') {
                            return {
                                css: {
                                    color: 'grey'
                                }
                            }
                        }
                        else {
                            return {
                                css: {
                                    color: 'black'
                                }
                            }
                        }
                    },
                    onClickRow: function (row) {
                        _this.model.getcontent(row.record_id);
                    },
                    formatShowingRows:function(){},
                    formatRecordsPerPage:function(){}
                });
                $el.find(".start_calender").each(function (i, elem) {
                    $(elem).datepicker({
                        onRender: function (date, viewMode) {
                            var endDate = $($(_this.el).find(".end_calender")[i]).val();
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
                $el.find(".end_calender").each(function (i, elem) {
                    $(elem).datepicker({
                        onRender: function (date, viewMode) {
                            var startDate = $($(_this.el).find(".start_calender")[i]).val();
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


                this.model.gethistoryreder();
                if (this.id) {
                    this.model.getcontent(this.id);
                }

                return this;
            }
        });
        return view;
    });
