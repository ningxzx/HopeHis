define(['txt!../../Office/allDynamicNews/adn.html',
        '../../Office/allDynamicNews/adnModel',
        'handlebars', 'backbone', "chosen", "jctLibs"],
    function (Template, allNewsModel, Handlebars, backbone, chose, jctLibs) {
        var opt = function (value, row, index) {
            return [
                //'<a class="member_edit" href="javascript:void(0)" title="detail">',
                //'编辑',
                //'</a>  ',
                '<a class="remove" style="color:red;" href="javascript:void(0)" title="Remove">' +
                '<i class="glyphicon glyphicon-remove"></i></a>'
            ].join('');
        };
        var formatAlink=function (value) {
            return '<a href="'+value+'" target="_blank">点击跳转</a>'
        }
        var view = Backbone.View.extend({
            initialize: function () {
                this.id = window.location.href.split('=')[1];
                this.model = new allNewsModel();
                this.listenTo(this.model, "gethistoryreder", this.hisreder);
            },
            hisreder: function (res) {
                if (res.errorNo == 0 && res.rows.length > 0) {
                    this.$el.find("#allNews_tbl").bootstrapTable('load', res.rows)}
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
                var start = $(this.el).find(".start_calender").val();
                var end = $(this.el).find(".end_calender").val();
                this.model.gethistoryreder(title, name, start, end);
            },

            historyMessagePanel: function () {
                window.location.href = '#office/postDynamicNews';
            },
            render: function () {
                var $el = $(this.el), _this = this;
                $(this.el).html(Template);

                this.$el.find("#allNews_tbl").bootstrapTable({
                    columns: [
                        {field: 'id', title: '序号'},
                        {field: 'news_title', title: '标题',width:'40%'},
                        {field: 'linker', title: '链接',width:'25%',formatter:formatAlink},
                        {field: 'create_date_time', title: '创建日期'}],
                    data: [],
                    pagination: true,
                    pageSize: 10,
                    onClickRow: function (row) {
                        $.ajax({
                            url:'http://114.55.85.57:8081/jethis/News/ShowNewsValue/'+row['id'],
                            type:'get'
                        })
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
