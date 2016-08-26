define(['txt!../Index/index.html',
        '../Index/indexModel',
        '../Common/commonModel',
        'bootstrapTable', 'handlebars', 'backbone', 'calender'],
    function (index, indexModel, commonModel, bootstrapTable, Handlebars, backbone) {
        var batchCols = [
            {field: "index", title: "序号", width: "5%"},
            {field: 'sorate_id', title: '药品批次'},
            {field: 'operator_name', title: '名称'},
            {field: 'sorate_date', title: '类别'},
            {field: 'check_state', title: '成本价'},
            {field: 'check_state', title: '处方价'},
            {field: 'check_state', title: '销售价'},
            {field: 'check_state', title: '库存数量'},
            {field: 'check_state', title: '单位'},
            {field: 'check_state', title: '产商'},
            {field: 'check_state', title: '过期日期'}
        ];
        var batchCols = [
            {field: 'diagnosisNum', title: '挂号人数'},
            {field: 'totalCharges', title: '总收入'},
            {field: 'presNum', title: '处方数'},
            {field: 'diagnosisNum', title: '诊疗人数'},
        ];
        var otherCols = [
            {field: 'diagnosisNum', title: '挂号人数'},
            {field: 'presNum', title: '处方数'},
            {field: 'diagnosisNum', title: '诊疗人数'},
        ];
        var doctorCols = [
            {field: 'register', title: '挂号人数'},
            {field: 'diagnosis', title: '就诊人数'},
            {field: '10', title: '中药处方数'},
            {field: '20', title: '西药处方数'},
        ];
        var indexView = Backbone.View.extend({
            initialize: function () {
                this.indexModel = new indexModel();
                this.commonModel = new commonModel();
                this.listenTo(this.indexModel, "getTodaynews", this.renderInfo);
                this.listenTo(this.commonModel, "getDaySchedule", this.renderDay);
                this.listenTo(this.indexModel, "getHospCondition", this.renderCondition);
                this.listenTo(this.indexModel, "getDynamicNews", this.renderDn);
            },
            renderInfo: function (res) {
                var $dt = $(this.el).find('#tz');
                $dt.html('');
                if (res.errorNo == 0) {
                    var rows=res.rows;
                    if (rows.length == 0) {
                        $dt.append('<li>当前无通知</li>')
                    }
                    else {
                        var l=rows.length;
                        if(l>=7){
                            var gap_notice = rows[7], gap_href = '#office/historyMessage?id=' + gap_notice.record_id;
                            $('#notice_more').removeClass('am-hide');
                            $('#notice_more a').attr('href',gap_href);
                        }
                        for(var i=0;i<l;i++){
                            if(i<7) {
                                var news = rows[i], href = '#office/historyMessage?id=' + news.record_id;
                                var time= news['create_date_time'].slice(5).slice(0,-3);
                                var noticeClass=news['read_state']=='yd'?"grey":'';
                                $dt.append('<li class="'+noticeClass+'"><a href=' + href + '>' + news.title + '<span>'+time+'</span></li>')
                            }
                        }
                    }
                }
            },
            renderDn:function(res){
                var $dt = $(this.el).find('#dt');
                $dt.html('');
                if (res.errorNo == 0) {
                    var rows=res.rows;
                    if (rows.length == 0) {
                        $dt.append('<li>当前无动态</li>')
                    }
                    else {
                        var l=rows.length;
                        if(l>=7){
                            var gap_notice = rows[7], gap_href = '#office/allDynamicNews';
                            $('#news_more').removeClass('am-hide');
                            $('#news_more a').attr('href',gap_href);
                        }
                        for(var i=0;i<l;i++){
                            if(i<7) {
                                var news = rows[i], href =news['linker'];
                                var time= news['create_date_time'];
                                $dt.append('<li><a href="' + href + '" target="_blank" >' + news.news_title + '<span>'+time+'</span></li>')
                            }
                        }
                    }
                }
            },
            events: {
                "click .index_calender td": "changeSelect",
                'click #admin_guide .refresh_tool': 'refreshHisData',
                'click #doctor_guide .refresh_tool': 'refreshHisData'
            },
            changeSelect: function () {
                var dates = $(this.el).find(".index_calender").dpGetSelected();//分别存放年，月，周，日
                var ouou = "";
                if (!!dates) {
                    dates[1] = dates[1] + 1;
                    var select_day = [];
                    select_day.push(dates[0]);
                    select_day.push(dates[1]);
                    select_day.push(dates[3]);
                    ouou = select_day.join("-");
                } else {
                    ouou = new Date();
                }
                var doctorId = sessionStorage.getItem('doctor_id');
                if (doctorId != "undefined") {
                    this.commonModel.search('admin.scheduling', {
                        doctor_id: doctorId,
                        plan_date_time: ouou
                    }, 'getDaySchedule');
                } else {
                    $(this.el).find("#according_info .am-panel-bd").html("非值班医生，无值班安排");
                }
            },
            renderDay: function (res) {
                var content = "今日无上班安排";
                if (res.rows) {
                    var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                    var value = res.rows[0];

                    value["plan_date_time"] = value["plan_date_time"].substring(5, 10) + "&emsp;" + week[new Date(value["plan_date_time"]).getDay()];
                    if (value["planwork_type"] == "1") {
                        content = "上午&emsp;上班";
                    } else if (value["planwork_type"] == "2") {
                        content = "下午&emsp;上班";
                    } else if (value["planwork_type"] == "4") {
                        content = "晚上&emsp;上班";
                    } else if (value["planwork_type"] == "3") {
                        content = "上午、下午&emsp;上班";
                    } else if (value["planwork_type"] == "5") {
                        content = "上午、晚上&emsp;上班";
                    } else if (value["planwork_type"] == "6") {
                        content = "下午、晚上&emsp;上班";
                    } else if (value["planwork_type"] == "7") {
                        content = "全天&emsp;上班";
                    }
                }
                $("#according_info .am-panel-bd").html(content);
            },
            renderCondition: function (res) {
                if (res.errorNo == 0) {
                    var tableNameObj = {
                        "admin": 'admin_condition_table',
                        "doctor": 'doctor_condition_table',
                        "other": 'other_condition_table',
                    };
                    var role=$(this.el).find('#index_count').attr('role')
                    var tableName = tableNameObj[role]
                    $(this.el).find('#'+tableName).bootstrapTable('load', res.rows);
                }
            },
            refreshHisData: function () {
                this.indexModel.getHospitalCondition();
            },
            render: function () {
                $(this.el).append(index).find(".index_calender").datePicker({
                    inline: true,
                    selectMultiple: false,
                });
                $(this.el).find(".am-slider-default").flexslider();
                var role = sessionStorage.getItem('role');
                if (role.indexOf('ROLE10001') !== -1) {
                    $(this.el).find('#index_count').attr('role','admin')
                    $(this.el).find("#admin_condition_table").bootstrapTable({data: [], columns: batchCols});
                    $(this.el).find("#admin_guide").removeClass('am-hide');
                }
                else if (role.indexOf('ROLE10002') !== -1) {
                    $(this.el).find('#index_count').attr('role','doctor');
                    $(this.el).find("#doctor_condition_table").bootstrapTable({data: [], columns: doctorCols});
                    $(this.el).find("#doctor_guide").removeClass('am-hide');
                }
                else {
                    $(this.el).find('#index_count').attr('role','other');
                    $(this.el).find("#other_condition_table").bootstrapTable({data: [], columns: otherCols});
                    $(this.el).find("#other_guide").removeClass('am-hide');
                }
                this.indexModel.getTodaynews();
                this.indexModel.getDynamicNews();
                this.changeSelect();
                this.indexModel.getHospitalCondition();
                return this;
            }
        });
        return indexView;
    });
