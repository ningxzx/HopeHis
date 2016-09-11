define(['txt!../Diagnose/regPats.html',
        '../Diagnose/model/regPatsModel',
        '../Common/patientModel',
        '../Common/commonModel',
        '../Diagnose/model/diagnoseModel',
        'amazeui',
        'handlebars', 'backbone', "jctLibs", "bootstrapTable"],
    function (regPatsTemp, regPatsModel, patientModel, commonModel, diagnoseModel, ai, Handlebars, Backbone, jctLibs, bootstrapTable) {
        var curPatsColumns = [
            {field: "d_serialno", title: "序号"},
            {field: "patient_name", title: "患者姓名"},
            {field: "patient_sex", title: "性别", formatter: jctLibs.formatGender},
            {field: "patient_birth", title: "年龄", formatter: jctLibs.generateAge},
        ];
        var deptPatsColumns = [
            {field: "register_no", title: "就诊号",},
            {field: "patient_name", title: "患者",},
            {field: "patient_sex", title: "性别", formatter: jctLibs.formatGender},
            {field: "patient_birth", title: "年龄", formatter: jctLibs.generateAge},
        ];
        var formatDate = function (value, row, index) {
            return row['diagnosis']['diagnosis_date'].split(' ')[0]
        };
        var formatDiag = function (value, row, index) {
            return row['diagnosis']['diagnosis_result']
        };
        var regPatsView = Backbone.View.extend({
                initialize: function () {
                    this.regPatsModel = new regPatsModel();
                    this.patientModel = new patientModel();
                    this.diagModel = new diagnoseModel();
                    this.commonModel = new commonModel();
                    this.diagnosis_id = "";
                    this.listenTo(this.regPatsModel, "waitPatientsGetted", this.renderWaitPats);
                    this.listenTo(this.regPatsModel, "curePatientsGetted", this.renderCurePats);
                    this.listenTo(this.regPatsModel, "startDiagnose", this.startResult);
                    this.listenTo(this.regPatsModel, "regist_result", this.addPatCallBack);
                    this.listenTo(this.regPatsModel, "getDoctorRegFee", this.getRegFee);
                    this.listenTo(this.patientModel, "searchById", this.showPatientInfoById);
                    this.listenTo(this.patientModel, "searchByName", this.showPatientInfoByName);
                    this.listenTo(this.commonModel, 'getPatRecord', this.renderDiagRecord);//获取就诊记录
                    this.listenTo(this.commonModel, 'getHistory', this.renderHistory);//获取就诊记录
                    this.listenTo(this.commonModel, 'getOutHistory', this.renderOutHistory);//获取就诊记录
                    this.listenTo(this.diagModel, 'stopDiagnose', this.stopResult);
                },
                events: {
                    //"click #wait_pats td": "clickPats",
                    "click #cure_pats td": "showRecipe",
                    "click .am-nav-tabs a": "changeQueue",
                    "click #reg_pats_refresh": "refreshPats",
                    "click #reg_pats_plus": "showModel",
                    "click #search_id": "searchId",
                    "click #start_treat": "clickTreat",
                    "click #addPatient": "AddPatient",
                    'keyup #keyword': 'keySearchId'
                },
                getRegFee: function (res) {
                    if(res.errorNo==0){
                        var regData=res.regData;
                        $("#regFee").val(regData.regsterFee)
                    }
                },
                addPatCallBack: function (res) {
                    if (res.state == '100') {
                        this.refreshPats();
                    }
                    else{
                        alert('加号失败,请重试!!')
                    }
                },
                keySearchId: function (e) {
                    if (e.keyCode == 13) {
                        this.searchId();
                    }
                },
                AddPatient: function () {
                    $("#add_patient_modal").modal('close');
                    window.location.href = '#patient/addpatient';
                    $("#add_patient_modal").modal('close');
                },
                clickTreat: function (event) {
                    var event = window.event || event;
                    var rowIndex = $(event.target).parent().attr("data-index") || 0;
                    var row = $(this.el).find("#wait_pats").bootstrapTable("getData")[0];
                    this.startTreat(row, 0);
                },
                startTreat: function (row, index) {
                    if(row.state=='4'){
                        return;
                    }
                    var data = {
                        "enterprise_id": sessionStorage.getItem("enterprise_id"),
                        "enterprise_name": sessionStorage.getItem("enterprise_name"),
                        "doctor_id": sessionStorage.getItem('doctor_id'),
                        "doctor_name": sessionStorage.getItem('doctor_name'),
                        "patient_id": row.patient_id,
                        "patient_name": row.patient_name,
                        "register_no": row.register_no,
                        "state": row.state,
                    };
                    this.regPatsModel.startPatient(data,index);
                },
                startResult: function (result) {
                    var that = this;
                    if (result.errorNo == "0") {
                        $(".finish_diag").eq(1).attr("diagnosis_id", result.diagnosis_id);
                        var data = $("#wait_pats").bootstrapTable("getData")[result.index];
                        var diagData = result.diagData;
                        data.diagnosis_id = diagData.diagnosis_id;
                        this.diagnosis_id = diagData.diagnosis_id;
                        $("#recipe_diagnose").val(diagData.diagnosis_result || "");
                        $("#recipe_medAdvice").val(diagData.doctor_advice || "");
                        $("#patient_tell").val(diagData.patient_tell || "");
                        this.addRecipe(data);
                        $('#pat_tabs').tabs('open', 0)
                    } else {
                        alert("接诊失败，请直接点击患者")
                    }
                },
                //显示挂号model
                showModel: function () {
                    var that = this;
                    $('#no_pat_wrapper').hide();
                    var acc_id = sessionStorage.getItem("user_id");
                    var doc_id = sessionStorage.getItem("doctor_id");
                    this.regPatsModel.getDoctorRegFee(doc_id);
                    $(this.el).find("#add_patient_modal").modal({
                        onConfirm: function () {
                            var enter_id = sessionStorage.getItem("enterprise_id");
                            var dept_id = sessionStorage.getItem("department_id");
                            var dept_name = sessionStorage.getItem("department_name");
                            var id = $("#id").val(),
                                fee = $('#regFee').val();
                            if(fee===""){
                                alert("获取挂号费失败,请尝试刷新页面!")
                                return;
                            }
                            if (id == "" || !id) {
                                return false;
                            }
                            that.regPatsModel.addNo(enter_id, id, doc_id, acc_id, dept_id, dept_name, fee);
                        },
                        onCancel: function () {
                            $(that.el).find("form")[0].reset();
                            $(that.el).find("#keyword").val("");
                        }
                    });
                },
                //挂号结果
                registResult: function (result) {
                    if (result.errorNo == 0) {
                        //TODO:追加失败
                        this.refreshPats();
                        this.resetInput();
                    }
                },
                //查询是否存在患者
                searchId: function () {
                    var that = this;
                    $("#regist_tip").addClass("hid");
                    $(this.el).find("#names").addClass("hid");
                    var select_condition = $("#select_condition").val();
                    var $keyword = $("#keyword").val();
                    if ($keyword == "") {
                        alert('请输入查询关键字');
                        $("#keyword").focus();
                        return;
                    }
                    if (select_condition == "id") {
                        //发送ID查询
                        that.patientModel.searchPatientById('', $keyword);
                    } else if (select_condition == "name") {
                        //发送NAME查询
                        that.patientModel.searchPatientByName('', $keyword);
                    }
                },

                //通过ID显示患者信息
                showPatientInfoById: function (result) {
                    if (result.errorNo == "0") {
                        $('#no_pat_wrapper').hide();
                        var data = result.obj;
                        $("#id").val(data.patient_id);
                        $("#name").val(data.patient_name);
                        $("#cardId").val(data.card_id);
                        $("#birth").val(data.patient_birth);
                        $("#gender").val(data.patient_sex);
                        var now = new Date();
                        var age = now.getFullYear() - data.patient_birth.substring(0, 4);
                        $("#age").val(age);
                        $("#address").val(data.province + "-" + data.city + "-" + data.area + "-" + data.addr);
                        $("#phone").val(data.patient_phone);
                    } else if (result.errorNo == "-2") {
                        $("#regist_tip").removeClass("hid").find("p").text("无患者信息");
                    } else {
                        $('#no_pat_wrapper').show();
                    }
                },

                //通过姓名显示患者信息
                showPatientInfoByName: function (result) {
                    if (result.errorNo == 0) {
                        $('#no_pat_wrapper').hide();
                        var data = result.obj;
                        if (data == "") {
                            return;
                        }
                        if (data.length == 1) {
                            var pat = data[0];
                            $("#id").val(pat.patient_id);
                            $("#name").val(pat.patient_name);
                            $("#cardId").val(pat.card_id);
                            $("#birth").val(pat.patient_birth);
                            $("#gender").val(pat.patient_sex);
                        }
                        else {
                            $("#names").removeClass("hid");
                            $("#patient_names").bootstrapTable('load', data);
                        }
                    } else if (result.errorNo == -1) {
                        $("#names").addClass("hid");
                        $("#regist_tip").removeClass("hid").find("p").text("查询失败");
                    } else {
                        $('#no_pat_wrapper').show();
                    }
                },
                //点击待诊就诊
                clickPats: function (event) {
                    var event = window.event || event;
                    var that = this;
                    var rowIndex = $(event.target).parent().attr("data-index");
                    var data = $(this.el).find("#wait_pats").bootstrapTable("getData");
                    var row = data[rowIndex];
                    if (!!row) {
                        $('#temp_pat_info').removeClass('am-hide');
                        $(".temp_pat_name").text(row.patient_name);
                        $(".temp_pat_sex").text(row.patient_sex == 'M' ? '男' : '女');
                        $(".temp_pat_marriage").text(row.marry_state == 'WH' ? '未婚' : '已婚');
                        $(".temp_pat_idCard").text(row.card_id);
                    } else {
                        $(".pat_seri").text("");
                        $(".pat_name").text("");
                        $(".pat_sex").text("");
                        $(".pat_age").text("");
                        $(".pat_id").text("");
                        $(".pat_idCard").text("");
                        $(".pat_addr").text("");
                        $(".pat_birth").text("");
                        $(".register_id").text("");
                        $(".register_date").text("");
                        $(".pat_marriage").text("");
                        $(".pat_register").text("");
                        $(".pat_tell").text("");
                        $("#out_history").text("");
                        $("#history").text("");
                        $("#diag_record_tbl").bootstrapTable("removeAll");
                    }
                },
                dBClickPats: function (event) {
                    var event = window.event || event;
                    var that = this;
                    var rowIndex = $(event.target).parent().attr("data-index");
                    var data = $(this.el).find("#wait_pats").bootstrapTable("getData");
                    var row = data[rowIndex];
                    if(row['state']=='4'){
                        return;
                    }
                    row.diagnosis_id = that.diagnosis_id;
                    var pat_seri = $(".pat_seri").text();
                    $('#temp_pat_info').addClass('am-hide');
                    if (!!pat_seri && row["d_serialno"] != pat_seri) {
                        $("#change_pat_modal .current_pat_name").text($('.pat_name').eq(0).html());
                        $("#change_pat_modal").modal();
                        $('#stop_diag').off('click').on('click',function () {
                            var stopData = data.filter(function (x) {
                                return x.d_serialno == pat_seri
                            })[0]
                            that.diagModel.stopDiag(stopData);
                            that.addRecipe(row);
                            that.startTreat(row, rowIndex);
                            $("#change_pat_modal").modal('close');
                        });
                    }
                    else {
                        that.addRecipe(row);
                        that.startTreat(row, rowIndex);
                    }
                    $('#pat_tabs').tabs('open', 0)
                },
                stopResult: function (result) {
                    if (result.errorNo == 0) {
                        alert("挂单成功");
                        this.refreshPats();
                    } else if (result.errorNo == "-1") {
                        alert(result.info);
                    } else {
                        alert("挂单失败")
                    }
                },
                //通过点击触发一个事件，并将event对象传向父级视图
                addRecipe: function (row) {
                    if (!!row) {
                        $(".pat_seri").text(row.d_serialno);
                        $(".pat_id").text(row.patient_id);
                        $(".pat_name").text(row.patient_name);
                        $(".pat_sex").text(row.patient_sex == 'M' ? '男' : '女');
                        $(".pat_birth").text(row.patient_birth);
                        $(".pat_marriage").text(row.marry_state == 'WH' ? '未婚' : '已婚');
                        $(".pat_register").text(row.register_no);
                        $(".pat_tell").text(row.patient_phone);
                        $(".pat_idCard").text(row.card_id);
                        var age = row.patient_birth ? (new Date().getFullYear() - row.patient_birth.substring(0, 4)) : "";
                        $(".pat_age").text(age);
                        this.commonModel.searchRecord(row.patient_id);
                        this.commonModel.search('diagnosis.patient_history', {
                            patient_id: row.patient_id,
                            type: '20'
                        }, 'getHistory');
                        this.commonModel.search('diagnosis.patient_history', {
                            patient_id: row.patient_id,
                            type: '10'
                        }, 'getOutHistory');

                        this.trigger("addRecipe", row);
                    } else {
                        $(".pat_seri").text("");
                        $(".pat_name").text("");
                        $(".pat_sex").text("");
                        $(".pat_age").text("");
                        $(".pat_id").text("");
                        $(".pat_idCard").text("");
                        $(".pat_addr").text("");
                        $(".pat_birth").text("");
                        $(".register_id").text("");
                        $(".register_date").text("");
                        $(".pat_marriage").text("");
                        $(".pat_register").text("");
                        $(".pat_tell").text("");
                        $("#out_history").text("");
                        $("#history").text("");
                        $("#diag_record_tbl").bootstrapTable("removeAll");
                    }
                },
                //显示已完诊的患者
                showRecipe: function (event) {
                    var event = window.event || event;
                    var rowIndex = $(event.target).parent().attr("data-index");
                    var row = $(this.el).find("#cure_pats").bootstrapTable("getData")[rowIndex];
                    //this.trigger("addRecipe", row);
                },
                resetInput: function () {
                    $("form")[0].reset();
                    $("#keyword").val("");
                },
                refreshPats: function () {
                    //获取未就诊的挂号患者
                    this.regPatsModel.getRegPatients("1,2,3,4");
                    //获取已就诊的挂号患者
                    this.regPatsModel.getRegPatients(0);
                },
                renderWaitPats: function (res) {
                    $(this.el).find("#wait_pats").bootstrapTable("hideLoading");
                    if (res.errorNo == 0) {
                        if (res.data.length == 0) {
                            $(this.el).find("#wait_pats").bootstrapTable('load', []);
                            this.addRecipe();
                        } else {
                            $(this.el).find("#wait_pats").bootstrapTable('load', res.data);
                            //this.addRecipe(res.data[0]);
                        }
                    } else {
                        $(this.el).find("#wait_pats").bootstrapTable('load', [])
                    }
                },
                renderCurePats: function (res) {
                    $(this.el).find("#cure_pats").bootstrapTable("hideLoading");
                    if (res.errorNo == 0) {
                        $(this.el).find("#cure_pats").bootstrapTable('load', res.data);
                    } else {
                        if (res.status == '404') {
                            $(this.el).find("#cure_pats").bootstrapTable('load', [])
                        }
                        else {
                        }
                    }
                },
                renderDiagRecord: function (res) {
                    if (res.rows.length > 0) {
                        $(this.el).find('#diag_record_tbl').bootstrapTable('load', res.rows)
                    }
                },
                renderHistory: function (res) {
                    if (res.errorNo == 0) {
                        $(this.el).find('#history').html((res.rows[0]).detail)
                    }
                },
                renderOutHistory: function (res) {
                    if (res.errorNo == 0) {
                        $(this.el).find('#out_history').html((res.rows[0]).detail)
                    }
                },
                render: function () {
                    var _this = this;
                    $(this.el).html(regPatsTemp);
                    $(this.el).find(".am-tabs").tabs("refresh")
                    $(this.el).find("#wait_pats").bootstrapTable({
                        columns: curPatsColumns,
                        data: [],
                        sortName: 'd_serialno',
                        rowStyle: function (row, index) {
                            if (row["state"] == "1") {
                                return {
                                    css: {"color": "red"}
                                };
                            }
                            if (row["state"] == "4") {
                                return {
                                    css: {"color": "grey"}
                                };
                            }else {
                                return {
                                    css: {"color": "black"}
                                }
                            }
                        },
                        onClickRow: function (e) {
                            _this.clickPats(e);
                        },
                        onDblClickRow: function (e) {
                            _this.dBClickPats(e);
                        }
                    });
                    $(this.el).find("#cure_pats").bootstrapTable({
                        columns: deptPatsColumns,
                        data: [],
                        pagination: true,
                        pageSize: 10
                    });
                    $(this.el).find("#stay_pats").bootstrapTable({
                        columns: deptPatsColumns,
                        data: [],
                        pagination: true,
                        pageSize: 10
                    });
                    $(this.el).find("#diag_record_tbl").bootstrapTable({
                        columns: [
                            {field: "diagnosis_date", title: "就诊时间", formatter: formatDate},
                            {field: "diagnosis_result", title: "诊断结果", formatter: formatDiag}
                        ],
                        formatShowingRows: function () {
                        },
                        data: [],
                        onClickRow: function (row, $element) {
                            _this.trigger('showRecordModal', row);
                        },
                        formatRecordsPerPage: function () {

                        },
                        pageSize: 4
                    });
                    $(this.el).find("#patient_names").bootstrapTable({
                        data: [],
                        onClickRow: function (row, el) {
                            $("#id").val(row.patient_id);
                            $("#name").val(row.patient_name);
                            $("#cardId").val(row.card_id);
                            $("#birth").val(row.patient_birth);
                            $("#gender").val(row.patient_sex);
                            var now = new Date();
                            var age = row.patient_birth ? (now.getFullYear() - row.patient_birth.substring(0, 4)) : '';
                            $("#age").val(age);
                            $("#address").val(row.province + "-" + row.city + "-" + row.area + "-" + row.addr);
                            $("#phone").val(row.patient_phone);
                            $("#names").addClass("hid");
                            sessionStorage.removeItem("doc_id");
                        }
                    });
                    $(this.el).find("select").chosen({
                        width: "100%",
                        no_results_text: '没有找到匹配的项！',
                        disable_search_threshold: 10
                    });
                    //显示正在载入
                    $(this.el).find("#wait_pats").bootstrapTable("showLoading");
                    $(this.el).find("#cure_pats").bootstrapTable("showLoading");
                    $(this.el).find("#stay_pats").bootstrapTable("showLoading");
                    //获取未就诊的挂号患者
                    this.regPatsModel.getRegPatients("1,2,3,4");
                    //获取已就诊的挂号患者
                    this.regPatsModel.getRegPatients(0);

                    return this;
                }

            })
            ;
        return regPatsView;
    });
