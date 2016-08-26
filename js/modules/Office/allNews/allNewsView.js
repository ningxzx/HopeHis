define(['txt!../../Office/allNews/allNews.html',
        '../../Office/allNews/allNewsModel',
        '../../Common/basicTable',
        'handlebars', 'backbone', "chosen", "jctLibs"],
    function (Template, allNewsModel, tab, Handlebars, backbone, chose, jctLibs) {
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
                this.model = new allNewsModel();
                this.listenTo(this.model, "gethistoryreder", this.hisreder);
                this.listenTo(this.model, "dellhistoryreder", this.DellhistoryReder);
                this.listenTo(this.model, "getcontent", this.Getcontent);
            },
            Getcontent: function (res) {
                if (res.errorNo==0) {
                    var data = res.rows[0];
                    $(this.el).find("#all_news").removeClass("hid");
                    $(this.el).find(".post_people").html(data.user_name);
                    $(this.el).find(".post_time").html(data.create_date_time);
                    $(this.el).find(".news_title").html(data.title);
                    $(this.el).find("#all_news .content div").html(data.text_value);
                } else {
                    $(this.el).find("#all_news").addClass("hid");
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
                    this.$el.find("#allNews_tbl").bootstrapTable('load', res.rows)
                    this.model.getcontent(res.rows[0].record_id);
                }
                else {
                    this.$el.find("#allNews_tbl").bootstrapTable('load', [])
                }
            },
            events: {
                "click #allNews_btn": "historyMessageBtn",
                "click #historyMessage_panel .add_level": "historyMessagePanel",
                "click #historyMessage_panel .refresh_tool": "historyMessageBtn",
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

                this.$el.find("#allNews_tbl").bootstrapTable({
                    columns: [
                        {field: 'title', title: '标题'},
                        {field: 'create_date_time', title: '创建日期'}],
                    data: [],
                    pagination: true,
                    pageSize: 10,
                    onClickRow: function (row) {
                        _this.model.getcontent(row.record_id);
                    },
                    formatShowingRows: function () {
                    },
                    formatRecordsPerPage: function () {
                    }
                });
                this.model.gethistoryreder();
                return this;
            }
        });
        return view;
    });
