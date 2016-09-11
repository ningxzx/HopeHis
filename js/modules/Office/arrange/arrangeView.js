define(['jquery',
        'txt!../../Office/arrange/arrange.html',
        "../../Office/arrange/arrangeModel",
        '../../Setting/userMange/userModel',
        '../../Common/basicTable',
        'handlebars', 'backbone', 'jctLibs', 'bootstrapTable', 'calender', 'amazeui'],
    function ($, Template, arrangeModel, userModel, basicTable, Handlebars, backbone, jctLibs, bt, cl, ssamazeui) {
        function showDate(date) {
            var dateObj = {}, weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            var nowWeek = date.getDay();
            var theYear = date.getFullYear();
            var nowMonth = date.getMonth();
            var nowDay = date.getDate();
            if (date instanceof Date) {
                for (var i = 1; i <= 7; i++) {
                    var weekDay = weekDays[i - 1];
                    var weekStartDate = new Date(theYear, nowMonth, nowDay - nowWeek + i);
                    dateObj[weekDay] = jctLibs.dataGet.formatDate(weekStartDate);
                }
            }
            return dateObj;
        }

        function showSpan(value, row) {
            //当医生休息时，显示空白。
            var $span = $('<p class="showEditModal unresolve" title="' + row['title_code'] + '"><span class="work_type" typeVal="-1"></span><span class="reg_type" typeVal="pt"></span><span class="reg_fee"></span></p>');//医生未设置时，设置为“点击编辑”
            // 查询日期小于今天时,直接显示为空
            if (row['out_date']) {
                $span.find('.work_type').attr("typeVal", 0);
                $span.find('.work_type,.reg_type,.reg_fee').html("");
            }
            else {
                //医生未设置时，设置为“点击编辑”
                if (typeof(value) == 'undefined' || value == 'unresolve-pt-0') {
                    $span.addClass("unresolve");
                    $span.find('.work_type').html('点击编辑');
                    row[this.field] = 'unresolve-pt-0';
                }
                //医生设置时，例：白天班-专-200
                else {
                    var arr = value.split('-');
                    if (arr[0] !== '0') {
                        $span.removeClass("unresolve");
                        var workText = ['', '上午班', "下午班", "白天班", "夜班", "上夜班", "下夜班", "24小时班"][arr[0]];
                        var regText = {"pt": "普通号", "zj": "专家号"}[arr[1]];
                        $span.find('.work_type').attr("typeVal", arr[0]);
                        $span.find('.work_type').html(workText);
                        $span.find('.work_type').append('<br/>')
                        $span.find('.reg_type').attr("typeVal", arr[1]);
                        $span.find('.reg_type').html(regText);
                        $span.find('.reg_fee').html(arr[2]);
                    }
                    else {
                        $span.find('.work_type').attr("typeVal", 0);
                        $span.find('.work_type,.reg_type,.reg_fee').html("");
                    }
                }
            }
            return $span.prop('outerHTML');
        }

        //表格标题与对应字段；
        var defaultDates = showDate(new Date()), reg_fees = {};
        var columnNames = [
            {field: "doctor_name", title: "医生姓名", width: "10%"},
            {field: "title_name", title: "医生级别", width: "20%"},
            {field: "Monday", title: defaultDates["Monday"], formatter: showSpan},
            {field: "Tuesday", title: defaultDates["Tuesday"], formatter: showSpan},
            {field: "Wednesday", title: defaultDates["Wednesday"], formatter: showSpan},
            {field: "Thursday", title: defaultDates["Thursday"], formatter: showSpan},
            {field: "Friday", title: defaultDates["Friday"], formatter: showSpan},
            {field: "Saturday", title: defaultDates["Saturday"], formatter: showSpan},
            {field: "Sunday", title: defaultDates["Sunday"], formatter: showSpan},
        ];
        var arrangeView = backbone.View.extend({
                initialize: function () {
                    this.model = new arrangeModel();
                    this.listenTo(this.model, "planGetted", this.renderPlan);
                    this.listenTo(this.model, "planPosted", this.postCallback);
                    this.listenTo(this.model, "doctorGetted", this.getDoctors);
                    this.listenTo(this.model, "deptGetted", this.getDept);
                    this.listenTo(this.model, "getLevelFee", this.getLevelFee);
                },
                render: function () {
                    var _this = this;
                    $(this.el).html(Template);
                    $(this.el).find("#tbs").bootstrapTable({
                        columns: columnNames,
                        data: [],
                        sortName: 'doctor_name',
                        onRefresh: function () {
                            var code = $('.list-group-item.active').attr('code');
                            var selectDate = $(".index_calender").dpGetSelected(),
                                realDate = selectDate ? new Date(selectDate[0], selectDate[1], selectDate[3]) : new Date(),
                                selectDates = showDate(realDate);
                            $('#edit_work_plan').removeClass('am-hide');
                            $('#post_work_plan').addClass('am-hide');
                            _this.model.getSchedule(code, selectDates['Monday'], selectDates['Sunday']);
                        }
                    })
                    $(this.el).find(".index_calender").datePicker({
                        inline: true,
                        selectMultiple: false,
                        selectWeek: true
                    });
                    $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                    this.model.getDept();
                    this.model.getLevelfee();
                    return this;
                },
                events: {
                    'click #edit_work_plan': 'editPlan',
                    'click #post_work_plan': 'postPlan',
                    "click .index_calender td": "changeDate",
                    'click .dept_list span': 'selectDept',
                    "change [name=plan_type]": "toggleEdit",
                    "change [name=reg_type]": "toggleReg",
                    "click #comfirmEdit": "confirmEdit"
                },
                changeDate: function () {
                    var $table = $(this.el).find("#tbs"),
                        selectDate = $(".index_calender").dpGetSelected();
                    var realDate = selectDate ? new Date(selectDate[0], selectDate[1], selectDate[3]) : new Date(),
                        selectDates = showDate(realDate);
                    var newColumnNames = [
                        {field: "doctor_name", title: "医生", width: "10%"},
                        {field: "title_name", title: "级别", width: "10%"},
                        {field: "Monday", title: selectDates["Monday"], formatter: showSpan},
                        {field: "Tuesday", title: selectDates["Tuesday"], formatter: showSpan},
                        {field: "Wednesday", title: selectDates["Wednesday"], formatter: showSpan},
                        {field: "Thursday", title: selectDates["Thursday"], formatter: showSpan},
                        {field: "Friday", title: selectDates["Friday"], formatter: showSpan},
                        {field: "Saturday", title: selectDates["Saturday"], formatter: showSpan},
                        {field: "Sunday", title: selectDates["Sunday"], formatter: showSpan},
                    ];
                    $table.bootstrapTable('destroy').bootstrapTable({
                        columns: newColumnNames,
                        sortName: 'doctor_name'
                    });
                    $table.off('click-cell.bs.table')
                    this.getSche();
                },
                getDoctors: function (res) {
                    var _this = this;
                    if (res.errorNo == 0) {
                        var rows = res.rows;
                        var selectDate = $(".index_calender").dpGetSelected();
                        var tempMonday = new Date(new Date(jctLibs.dataGet.getWeekStartDate()).setHours(0, 0, 0, 0)),
                            selectDateT = new Date(selectDate[0] + '-' + (selectDate[1] + 1) + '-' + selectDate[3]);
                        if (selectDate && selectDateT < tempMonday) {
                            $('#edit_work_plan,#post_work_plan').addClass('am-hide');
                            rows.forEach(function (row) {
                                row['out_date'] = true;
                            })
                        }
                        else {
                            $('#edit_work_plan').addClass('am-hide');
                            $('#post_work_plan').removeClass('am-hide');
                        }
                        $(this.el).find("#tbs")
                            .off('click-cell.bs.table')
                            .off('refresh.bs.table')
                            .on('click-cell.bs.table', _this.clickCell)
                            .bootstrapTable('load', rows);

                    }
                },
                editPlan: function () {
                    var _this = this;
                    $(this.el).find("#tbs").off('click-cell.bs.table').on('click-cell.bs.table', _this.clickCell);
                    $('#edit_work_plan').addClass('am-hide');
                    $('#post_work_plan').removeClass('am-hide');
                },
                postPlan: function () {
                    var currentData = $('#tbs').bootstrapTable('getData'), temp = {};
                    var selectDate = $(".index_calender").dpGetSelected();
                    var realDate = selectDate ? new Date(selectDate[0], selectDate[1], selectDate[3]) : new Date();
                    var selectDates = showDate(realDate);
                    currentData.forEach(function (a) {
                        var doc_id = a['doctor_id'];
                        temp[doc_id] = {};
                        for (var key in a) {
                            if (key.indexOf('day') != -1) {
                                var plan = a[key].split('-'), dateStr = selectDates[key];
                                plan[0] = (plan[0] == -1 || plan[0] == 'unresolve') ? 0 : plan[0];
                                temp[doc_id][dateStr] = {
                                    work_type: plan[0],
                                    reg_type: plan[1],
                                    reg_fee: plan[2] || 0
                                }
                            }
                        }
                    });
                    temp['department_id'] = $('.list-group-item.active').attr('code');
                    temp['start_date'] = selectDates['Monday'];
                    temp['end_date'] = selectDates['Sunday'];
                    this.model.postSchedule(temp);
                },
                renderPlan: function (res) {
                    var _this = this, selectDate = $(".index_calender").dpGetSelected();
                    var realDate = selectDate ? new Date(selectDate[0], selectDate[1], selectDate[3]) : new Date();
                    var selectDates = showDate(realDate);
                    if (res.errorNo == 0) {
                        var sches = res.sches, doctors = {}, tableData = [];
                        if (sches.length > 0) {
                            sches.forEach(function (sche) {
                                var doc_id = sche['doctor_id'], doc_name = sche['doctor_name'],
                                    title_code = sche['title_code'],
                                    title_name = sche['title_name'];
                                if (sche['plan_date_time']) {
                                    var date_str = sche['plan_date_time'].split(' ')[0],
                                        plan_type = sche['planwork_type'], register_type = sche['register_type'],
                                        reg_fee = sche['register_fee'] || 0;
                                    if (!doctors[doc_id]) {
                                        doctors[doc_id] = {
                                            'doctor_id': doc_id,
                                            'doctor_name': doc_name,
                                            'title_code': title_code,
                                            'title_name': title_name
                                        }
                                    }
                                    var week_str = '';
                                    for (var week_key in selectDates) {
                                        if (selectDates[week_key] == date_str) {
                                            week_str = week_key;
                                            continue;
                                        }
                                    }
                                    doctors[doc_id][week_str] = [plan_type, register_type, reg_fee].join('-');
                                }
                                else {
                                    doctors[doc_id] = {
                                        'doctor_id': doc_id,
                                        'doctor_name': doc_name,
                                        'title_code': title_code,
                                        'title_name': title_name
                                    }
                                    for (var week_key in selectDates) {
                                        doctors[doc_id][week_key] = [0, 'pt', '0'].join('-');
                                    }
                                }
                            })
                            for (var doctorKey in doctors) {
                                tableData.push(doctors[doctorKey]);
                            }
                            $(this.el).find("#tbs").off('click-cell.bs.table').bootstrapTable('load', tableData).off('refresh.bs.table').on('refresh.bs.table', function () {
                                _this.getSche.call(_this)
                            });
                        }
                        else {
                            var default_dept_id = $('.list-group-item.active').attr('code');
                            this.model.getDeptDoctor(default_dept_id);
                        }
                        var selectDate = $(".index_calender").dpGetSelected();
                        var tempMonday = new Date((new Date(jctLibs.dataGet.getWeekStartDate())).setHours(0, 0, 0, 0)),
                            selectDateT = new Date(selectDate[0] + '-' + (selectDate[1] + 1) + '-' + selectDate[3]);
                        if (selectDate && selectDateT < tempMonday) {
                            $('#edit_work_plan,#post_work_plan').addClass('am-hide');
                        }
                    }
                },
                postCallback: function (res) {
                    if (res.status == '100') {
                        var code = $('.list-group-item.active').attr('code')
                        var selectDate = $(".index_calender").dpGetSelected(),
                            realDate = selectDate ? new Date(selectDate[0], selectDate[1], selectDate[3]) : new Date(),
                            selectDates = showDate(realDate);
                        this.model.getSchedule(code, selectDates['Monday'], selectDates['Sunday']);
                        $('#edit_work_plan').removeClass('am-hide');
                        $('#post_work_plan').addClass('am-hide');
                        $('#post-success-alert').modal()
                    }
                    else {
                        $('#post-error-alert').modal()
                    }
                },
                confirmEdit: function () {
                    var arr = $('#edit_modal').attr("tdLocation").split('-'),
                        $table = $("#tbs"),
                        index = arr[0], field = arr[1],
                        workType = $('#edit_modal [name="plan_type"]').val(),
                        regType = $('#edit_modal [name="reg_type"]').val(),
                        regFee = $('#reg_free').val();
                    var row = $table.bootstrapTable('getData')[index];
                    row[field] = workType + '-' + regType + '-' + regFee || 0;
                    $table.bootstrapTable('updateRow', {index: index, row: row});
                    $('#edit_modal').modal('close');
                },
                toggleEdit: function () {
                    if ($('[name=plan_type]').val() == '0') {
                        $('[name=reg_type]').prop('disabled', true).trigger("chosen:updated");
                        $('#reg_free').attr('readonly', true);
                    }
                    else {
                        $('[name=reg_type]').prop('disabled', false).trigger("chosen:updated");
                        $('#reg_free').attr('readonly', false);
                    }
                },
                toggleReg: function (e) {
                    var $target = $(e.target);
                    $('#reg_free').val(this.fees[$target.attr('title_code') + '-' + $target.val()])
                },
                getDept: function (res) {
                    if (res.errorNo == 0 && res['rows'].length > 0) {
                        var depts = res['rows'], $deptLis = $(this.el).find('.dept_list');
                        depts.forEach(function (dept) {
                            var $li = $('<span></span>').addClass('list-group-item').html(dept['department_name']).attr('code', dept['department_id']);
                            $deptLis.append($li);
                        })
                        var $firstDept = $deptLis.find('span').eq(0);
                        $firstDept.addClass('active');
                        this.model.getSchedule($firstDept.attr('code'), defaultDates['Monday'], defaultDates['Sunday'])
                    }
                    else {
                        $(this.el).find("#depd_no").modal({
                            relatedTarget: this,
                            onConfirm: function (options) {
                                window.location.href = "#setting/departMange";
                                $("#depd_no").modal('close');
                            },
                            closeViaDimmer: false
                        });
                    }
                },
                getLevelFee: function (res) {
                    if (res.errorNo == 0) {
                        var fees = {}, rows = res.rows;
                        rows.forEach(function (row) {
                            var dockey = row['title_code'] + '-' + row['register_type'];
                            fees[dockey] = row['standard_register_fee'];
                        });
                        reg_fees = this.fees = fees;
                    }
                },
                selectDept: function (e) {
                    var $target = $(e.target).closest('span');
                    $('.dept_list span').removeClass('active');
                    $target.addClass('active');
                    this.getSche();
                },
                getSche: function () {
                    var code = $('.list-group-item.active').attr('code');
                    var selectDate = $(".index_calender").dpGetSelected(),
                        realDate = selectDate ? new Date(selectDate[0], selectDate[1], selectDate[3]) : new Date(),
                        selectDates = showDate(realDate);
                    $('#edit_work_plan').removeClass('am-hide');
                    $('#post_work_plan').addClass('am-hide');
                    this.model.getSchedule(code, selectDates['Monday'], selectDates['Sunday']);
                },
                clickCell: function (e, field, value, row, $element) {
                    if (field.indexOf('day') !== -1) {
                        var index = parseInt($element.closest('tr').attr('data-index'));
                        var workType = $element.find('.work_type').attr("typeVal");
                        var regType = $element.find('.reg_type').attr("typeVal");
                        var regFee = $element.find('.reg_fee').html();
                        var title_code = $element.find('.showEditModal').attr('title');
                        workType = workType == -1 ? 3 : workType;
                        $('#edit_modal [name="plan_type"]').val(workType).trigger('chosen:updated');
                        $('#edit_modal [name="reg_type"]').val(regType).attr('title_code', title_code).trigger('chosen:updated');
                        var fee = reg_fees[title_code + '-' + regType || 'pt']
                        $('#edit_modal #reg_free').val(regFee || fee);
                        $('#edit_modal').attr("tdLocation", index + '-' + field);
                        if (workType !== 0) {
                            $('[name=reg_type]').prop('disabled', false).trigger("chosen:updated");
                        }
                        $('#edit_modal').modal()
                    }
                }
            })
            ;
        return arrangeView;
    })
;
