define(['txt!../Diagnose/diagnose.html',
        '../Diagnose/regPatsView',
        '../Diagnose/recipeView',
        '../Diagnose/recipeRecordView',
        '../Diagnose/treatmentsView',
        '../Common/commonModel',
        '../Diagnose/model/diagnoseModel',
        '../Diagnose/model/medRecordModel',
        'amazeui',
        'handlebars', 'backbone', "jctLibs", "chosen"],
    function (diagnose, regPatsView, recipeView, recipeRecordView, treatmentsView, commonModel, diagnoseModel, medRecordModel, ai, Handlebars, backbone, jctLibs) {
        //var  appendCheckBox = function ($elem, val, text, name) {
        //    var $check = $('<label class="am-radio-inline am-secondary"><input type="radio" data-am-ucheck>' + text + '</label>');
        //    $check.find("input").val(val);
        //    $check.find("input").attr("name", name);
        //    $elem.append($check);
        //};
        var formatTempType = function (value, row, index) {
            return value == 1 ? '公有模板' : '私有模板';
        };
        var formatRecipeType = function (value, row, index) {
            return {'10': '中药处方', '20': '西药模板'}[value]
        };
        Handlebars.registerHelper('patient_age', function (birth) {
            if (birth) {
                return new Date().getFullYear() - birth.substring(0, 4);
            }
        });
        /*****
         *诊疗界面，包括患者队列，处方显示，药物项目三个部分，需要利用弹出框或者隐藏div显示的还有历史处方，诊疗模板
         *需要完成的功能有：显示医生当前患者队列，医生常用药物。开始就诊则将患者自动移除出队列，并且在处方界面载入基础数据，以及载入病人历史处方。
         *  点击诊断，可以选择模板，可以存为模板。选择诊疗，检查，药物，处方界面随之修改。保存处方生成处方单。
         *需要的数据有：医生个人资料，医生常用药，当前患者队列，全科队列，药物（按频次，展现常用药），诊疗项目，检查项目，
         *
         *
         */
        var diagnoseView = Backbone.View.extend({
            initialize: function () {

                //初始化子view及数据集合模型
                this.pats = new regPatsView();
                this.recipe = new recipeView();
                this.recordRecipe = new recipeRecordView();
                this.treatments = new treatmentsView();
                this.diagModel = new diagnoseModel();
                this.commonModel = new commonModel();
                this.diagnosis_id = "";
                this.param = {};

                //子view事件触发父view事件
                this.pats.on("addRecipe", this.showPatRecipe, this);
                this.pats.on("clearRecipe", this.clearPatRecipe, this);
                this.pats.on('showRecordModal', this.showRecordModal, this);
                this.treatments.on("addTreatments", this.addTreatments, this);

                //侦听模板model异步请求成功后进行render；
                this.listenTo(this.commonModel, 'getDiagTemp', this.selectDiag);
                this.listenTo(this.commonModel, 'getAdviceTemp', this.selectAdvice);
                this.listenTo(this.commonModel, 'getAdviceTemp1', this.selectAdvice1);
                this.listenTo(this.commonModel, 'getRecipeTemp', this.selectRecipe);//添加处方明细
                this.listenTo(this.commonModel, 'getRecipeTemp1', this.selectRecipe1);
                this.listenTo(this.commonModel, 'getRecordZyRecipe', this.showZyRecipe);
                this.listenTo(this.commonModel, 'getRecordXyRecipe', this.showXyRecipe);
                this.listenTo(this.diagModel, 'getHisResult', this.getResult);
                this.listenTo(this.diagModel, 'saveHisResult', this.saveResult);
                this.listenTo(this.diagModel, 'finishDiagnose', this.finishResult);
                this.listenTo(this.diagModel, 'stopDiagnose', this.stopResult);
                this.listenTo(this.diagModel, 'postBodyCheck', this.bodyCheckCall);
                this.listenTo(this.diagModel, 'getBodyCheck', this.getBodyCheck);
            },
            events: {
                "click .am-icon-close": "closeTab",
                "click #treatments_table": "showTreatmentsInfo",
                "click .get_history": "getHistory",
                "click .get_allergy": "getAllergy",
                "click .search_diagTemp": "getDiagTemp",
                "click .doc_adviceTemp": "getAdviceTemp",
                "click .search_recipeTemp": "getRecipeTemp",
                "click .alert-close": "closeAlert",
                "confirm.modal.amui  #diagnose_temp_modal": "useDiagTemp",
                "confirm.modal.amui  #docAdvice_temp_modal": "useAdviceTemp",
                "confirm.modal.amui  #recipe_temp_modal": "useRecipeTemp",
                "confirm.modal.amui  #history_modal": "saveHistory",
                "confirm.modal.amui  #allergy_modal": "saveAllergy",
                "change select.take_ways": "changeTakeWays",
                "click .finish_diag": "finishDiagnose",
                "removeRow.bs.table .am-tabs-bd>div.am-active table": "calTotal",
                "change .am-tabs-bd>div.am-active table select": "calTotal",
                //TODO:打开一个新的处方tabs时,药品列表初始化.打开一个尚未结束就诊的处方界面,载入暂存的药品信息.
                "open.tabs.amui #pats_info_tabs": "",
                "click #diag_tmp_sure": "diagDates",
                "click #pat_body_check": "showBodyCheck",
                "click #submit_body_check": "submitBodyCheck",
            },
            showBodyCheck:function () {
                var pat_id=$("#diagnose_box").attr('patient_id'),param={};
                if(pat_id==''||!pat_id){
                    alert('请先选择一名患者进行就诊!');
                    return;
                }
                var register_no= $(".register_id").val();
                var diagnosis_id= this.diagnosis_id;
                this.diagModel.getBodyCheck(pat_id,diagnosis_id,register_no);
                $('#body_check_modal').modal({
                    closeViaDimmer:false
                });
            },
            getBodyCheck:function (res) {
                if(res.errorNo===0){
                    var checkData=res.checkData;
                    for(var key in checkData){
                        $('#'+key).val(checkData[key])
                    }
                }
            },
            submitBodyCheck:function () {
                var pat_id=$("#diagnose_box").attr('patient_id'),param={};
                if(pat_id==''||!pat_id){
                    alert('请先选择一名患者进行就诊!');
                    return;
                }
                else{
                    var register_no= $(".register_id").val()
                    var diagnosis_id= this.diagnosis_id;
                    var pat_height= $("#pat_height").val();
                    if(pat_height){
                        param['pat_height']=pat_height;
                    }
                    var pat_weight= $("#pat_weight").val();
                    if(pat_weight){
                        param['pat_weight']=pat_weight;
                    }
                    var pat_pulse= $("#pat_pulse").val();
                    if(pat_pulse){
                        param['pat_pulse']=pat_pulse;
                    }
                    var pat_temperature= $("#pat_temperature").val();
                    if(pat_temperature){
                        param['pat_temperature']=pat_temperature;
                    }
                    var s_blood_pressure_h= $("#s_blood_pressure_h").val();
                    if(s_blood_pressure_h){
                        param['s_blood_pressure_h']=s_blood_pressure_h;
                    }
                    var s_blood_pressure_l= $("#s_blood_pressure_l").val();
                    if(s_blood_pressure_l){
                        param['s_blood_pressure_l']=s_blood_pressure_l;
                    }
                    var i_blood_pressure_h= $("#i_blood_pressure_h").val();
                    if(i_blood_pressure_h){
                        param['i_blood_pressure_h']=i_blood_pressure_h;
                    }
                    var i_blood_pressure_l= $("#i_blood_pressure_l").val();
                    if(i_blood_pressure_l){
                        param['i_blood_pressure_l']=i_blood_pressure_l;
                    }
                    if(register_no&&diagnosis_id){
                        this.diagModel.postBodyCheck(pat_id,diagnosis_id,register_no,param)
                    }
                }
            },
            bodyCheckCall:function(res){
                if(res.errorNo==0){
                    $('#body_check_modal').modal('close')
                }
            },
            changeTakeWays: function (ev) {
                var e = window.event || ev;
                e.preventDefault();
            },
            showPatRecipe: function (row) {
                this.diagnosis_id = row.diagnosis_id || "";
                $("#diagnose_box").attr('patient_id',row['patient_id']);
                $(".pat_name").val(row.patient_name);
                $(".pat_sex").val(row.patient_sex == 'M' ? '男' : '女');
                var date = 0;
                if (row.patient_birth) {
                    date = new Date().getFullYear() - row.patient_birth.slice(0, 4);
                }
                $(".pat_age").val(date);
                $(".pat_id").val(row.patient_id);
                $(".pat_cardId").val(row.card_id);
                $(".pat_addr").val(row.addr);
                $(".register_id").val(row.register_no);
                $(".register_id").attr('title', row.register_no);
                $(".register_date").val(row.diagnosis_date);
                $("#recipe_table").bootstrapTable("removeAll");
                $("#zy_table").bootstrapTable("removeAll");
            },
            clearPatRecipe: function () {
                $(".pat_name").val("");
                $(".pat_sex").val("");
                $(".pat_age").val("");
                $(".pat_id").val("");
                $(".pat_cardId").val("");
                $(".pat_addr").val("");
                $(".register_id").val("");
                $(".register_date").val("");
                $("#recipe_table").bootstrapTable("removeAll");
                $("#zy_table").bootstrapTable("removeAll");
            },
            closeTab: function (event) {
                var event = window.event || event,
                    $tab = $(this.el).find("#pats_info_tabs"),
                    $nav = $tab.find(".am-tabs-nav"),
                    $bd = $tab.find(".am-tabs-bd"),
                    target = event.target,
                    $item = $(target).closest('li');
                var index = $nav.children('li').index($item);
                var registerNo = $($item).find("a").attr("id").slice(5);

                //获取相应的view，并删除
                var view = this.recipes[registerNo];
                view.remove();
                view.unbind();
                $item.remove();
                delete this.recipes[registerNo];
                $bd.find('.am-tab-panel').eq(index).remove();

                $tab.tabs('open', index > 0 ? index - 1 : index + 1);
                $tab.tabs('refresh');
            },
            showTreatmentsInfo: function (event) {
                var event = window.event || event,
                    target = event.target,
                    rowIndex = $(target).parent().attr("data-index"),
                    row = $(this.el).find("#treatments_table").bootstrapTable("getData")[rowIndex];
                //$("#treatments_info_detail").html(row["detail"]);
                //$("#treatments_info_effect").html(row["effect"]);
                //$("#treatments_info_against").html(row["against"]);
            },
            getTemp: function (table, evName) {
                var enterprise_id = sessionStorage.getItem('enterprise_id'),
                    doctor_id = sessionStorage.getItem('doctor_id'),
                    role = sessionStorage.getItem("role");
                var ids = [enterprise_id, doctor_id];
                this.commonModel.search(table, {
                    template_owner_id: ids.join(','),
                }, evName)
            },
            getDiagTemp: function () {
                this.getTemp("template.diagnosis_template", 'getDiagTemp');
                return false;
            },
            getAdviceTemp: function () {
                this.getTemp("template.doctor_advice_template", 'getAdviceTemp1');
                return false;
            },
            getRecipeTemp: function () {
                this.getTemp("template.prescription_template", 'getRecipeTemp1');
                return false;
            },
            getHistory: function () {
                var patient_id = $(".pat_id").val();
                var patient_name = $(".pat_name").val();
                //10过敏史， 20既往史
                if (patient_id) {
                    this.diagModel.getHis(patient_id, patient_name, "20");
                } else {
                    alert("请先选择患者");
                }
            },
            getAllergy: function () {
                var patient_id = $(".pat_id").val();
                var patient_name = $(".pat_name").val();
                //10过敏史， 20既往史
                if (patient_id) {
                    this.diagModel.getHis(patient_id, patient_name, "10");
                } else {
                    alert("请先选择患者");
                }
            },
            getResult: function (result) {
                if (result.errorNo == 0) {
                    if (result.type == "20") {
                        $("#history_modal").attr("record", result.record_id).modal();
                        $("#pat_history").val(result.data);
                    } else if (result.type == "10") {
                        $("#allergy_modal").attr("record", result.record_id).modal();
                        $("#pat_allergy").val(result.data);
                    }
                } else {
                    if (result.type == "20") {
                        $("#history_modal").modal();
                        $("#pat_history").val("");
                    } else if (result.type == "10") {
                        $("#allergy_modal").modal();
                        $("#pat_allergy").val("");
                    }
                }
            },
            saveHistory: function () {
                var patient_id = $(".pat_id").val();
                var patient_name = $(".pat_name").val();
                var detail = $("#pat_history").val();
                var record = $("#history_modal").attr("record");
                //10过敏史， 20既往史
                if (detail) {
                    this.diagModel.saveHis(patient_id, patient_name, record, detail, "20");
                } else {
                    alert("请先选择患者");
                }

            },
            saveAllergy: function () {
                var patient_id = $(".pat_id").val();
                var patient_name = $(".pat_name").val();
                var detail = $("#pat_allergy").val();
                var record = $("#allergy_modal").attr("record");
                //10过敏史， 20既往史
                if (detail) {
                    this.diagModel.saveHis(patient_id, patient_name, record, detail, "10");
                } else {
                    alert("请先选择患者");
                }
            },
            saveResult: function (result) {
                if (result.errorNo == 0) {
                    if (result.type == "10") {
                        alert("保存过敏史成功");
                    } else if (result.type == "20") {
                        alert("保存既往史成功");
                    }
                }
            },
            selectDiag: function (result) {
                var $diagTable = $('#diag_temp_tbl');
                if (result.errorNo === 0) {
                    //TODO:缓存模板数据
                    $diagTable.bootstrapTable('load', result.rows)
                    $('#diagnose_temp_modal').modal({
                        width: '960px'
                    })
                }
                else {
                    //TODO:show error modal
                    $('#no_diagTemp_modal').modal({
                        onConfirm: function (e) {
                            $('#no_diagTemp_modal').modal('close')
                            window.location.href = '#setting/recipeMaintain'
                        },
                    })
                }
            },
            selectRecipe1: function (result) {
                var $tb = $('#recipe_temp_tbl');
                if (result.errorNo === 0) {
                    $tb.bootstrapTable('load', result.rows)
                    $('#recipe_temp_modal').modal({
                        width: '960px'
                    })
                    $('#recipe_tabs').tabs('refresh')
                }
                else {
                    $('#no_recipeTemp_modal').modal({
                        onConfirm: function (e) {
                            $('#no_recipeTemp_modal').modal('close')
                            window.location.href = '#setting/recipeMaintain'
                        },
                    })
                }
            },
            //点击模板确定后
            diagDates: function () {
                var rows = $("#diag_temp_tbl").bootstrapTable("getSelections")[0];
                $("#patient_tell").val(rows.patient_tell || "");
                $("#recipe_diagnose").val(rows.diagnosis_result || "");
                var params1 = {
                    'template_id': rows.doc_advice_tempid
                };
                var params2 = {
                    'template_id': rows.prescription_id
                };
                //获取医嘱模板  处方模板
                if (rows.doc_advice_tempid) {
                    this.commonModel.search('template.doctor_advice_template', params1, 'getAdviceTemp');
                }
                if (row.prescription_id) {
                    this.commonModel.search('template.prescription_template_detail', params2, 'getRecipeTemp');
                }
            },
            selectAdvice1: function (result) {
                if (result.errorNo == 0) {
                    var $tb = $(this.el).find("#docAdvice_temps");
                    $tb.bootstrapTable('load', result.rows);
                    $tb.bootstrapTable("uncheckAll");
                    $('#docAdvice_temp_modal').modal({
                        width: '960px'
                    })
                }
                else {
                    $('#no_adviceTemp_modal').modal({
                        onConfirm: function (e) {
                            $('#no_adviceTemp_modal').modal('close')
                            window.location.href = '#setting/recipeMaintain'
                        },
                    })
                }
            },
            selectAdvice: function (result) {
                var data = result.rows[0];
                var $textarea = $(this.el).find("#recipe_medAdvice");
                var value = $textarea.val(), detail = data['template_detail'].trim();
                var str = value ? (detail + ' ; ' + value) : detail;
                $textarea.val(str);
            },
            //医嘱模块确认之后的操作
            useAdviceTemp: function () {
                var $tb = $(this.el).find("#docAdvice_temps");
                var rows = $tb.bootstrapTable("getSelections");
                if (rows.length == 0) {
                    return;
                }
                else {
                    var strArr = rows.map(function (a) {
                        return a['template_detail'].trim()
                    });
                    var str = strArr.join(' ; ')
                    var $textarea = $(this.el).find("#recipe_medAdvice");
                    var value = $textarea.val();
                    str = value ? (str + ' ; ' + value) : str;
                    $textarea.val(str);
                }
            },
            selectRecipe: function (result) {
                var $Table = $("#recipe_table");
                if (result.errorNo == 0) {
                    var oldData = $Table.bootstrapTable('getData');
                    var data = result.rows;
                    var codes = result.rows.map(function (drug) {
                        return drug['drug_code'];
                    });
                    oldData.forEach(function (drug) {
                        if (codes.indexOf(drug['drug_code']) == -1) {
                            data.push(drug)
                        }
                    });
                    $Table.bootstrapTable('load', data);
                } else {
                }
            },
            //点击处方模板时,请求处方明细并显示
            useRecipeTemp: function () {
                var $tb = $(this.el).find("#recipe_temp_tbl");
                var rows = $tb.bootstrapTable("getSelections");
                var _this = this;
                if (rows.length == 0) {
                    return;
                }
                rows.forEach(function (val) {
                    var param = {
                        'template_id': val.template_id
                    }
                    _this.commonModel.search('template.prescription_template_detail', param, 'getRecipeTemp');
                });
            },
            //加入药物,当药物ID相同时,就加数目,不同时就添加新的行
            addTreatments: function (rows) {
                $('#recipe_tabs').tabs('open',0)
                var drugs = {}, isRow = false;
                if (rows.errorNo && rows.errorNo != 0) {
                    //alert(rows.resultInfo);
                }
                else if (rows.errorNo === 0) {
                    drugs = rows.tempDetail;
                }
                else {
                    drugs = rows;
                    isRow = true;
                }
                var recipe_type = rows[0].medicine_type;
                var tableId = $("#recipe_table"), total_type = "input.xy_cost";
                if (recipe_type == "cmedicine") {
                    tableId = $("#zy_table");
                    total_type = "input.zy_cost";
                    $('#recipe_tabs').tabs('open',1);
                }
                var foreData = tableId.bootstrapTable("getData");
                for (var i = 0; i < drugs.length; i++) {
                    var row = drugs[i], isNew = true;
                    if (isRow) {
                        row.price = row.goods_sell_price;
                        row.unit = row.min_packing_unit;
                        row.drug_name = row.goods_name;
                        row.packing_spec = row.goods_spec;
                        row.drug_code = row.goods_id;
                    }

                    //复制对象,防止引用传递相互影响,bootstrapTable数据源赋值时,是对象的引用传递.
                    var data = $.extend({}, row);
                    data.drug_num || (data.drug_num = 1);
                    for (var j = 0; j < foreData.length; j++) {
                        var fData = foreData[j];
                        if (fData.drug_code == row.drug_code && fData.drug_name == row.drug_name) {
                            isNew = false;
                        }
                    }
                    if (isNew) {
                        foreData.push(data);
                    }
                }
                //添加药物到处方的药物表
                tableId.bootstrapTable("load", foreData);
                this.calTotal(tableId, total_type);
            },
            calTotal: function (tableId, type) {
                var $totalCost = $(type);
                var foreData = tableId.bootstrapTable("getData"), total = 0;
                foreData.forEach(function (row, i) {
                    total += row.price * row.drug_num;
                });
                $totalCost.val(total.toFixed(2));
            },
            render: function () {
                var $el = $(this.el);
                $el.append(diagnose);

                //将pats里的点击绑定事件及参数传递到showPatRecipe方法上。
                this.pats.render();
                this.treatments.render();
                this.recipe.render();
                this.recordRecipe.render();
                $el.find('#diag_detail').html(this.recordRecipe.el);
                $el.find("#pats_queue_wrapper").append(this.pats.el);
                $el.find("#treatments").append(this.treatments.el);
                $el.find("#diagnose_box").append(this.recipe.el);
                //诊断模板
                $el.find("#diag_temp_tbl").bootstrapTable({
                    columns: [
                        {field: "", title: "", checkbox: true},
                        {field: 'template_name', title: '名称'},
                        {field: 'patient_tell', title: '患者主诉'},
                        {field: 'diagnosis_result', title: '诊断结果'},
                        {field: 'advice_temp_name', title: '医嘱模板'},
                        {field: 'recipe_temp_name', title: '处方模板'},
                        {field: 'remark', title: '备注'},
                    ],
                    data: [],
                    clickToSelect: true,
                    singleSelect: true
                });
                //医嘱模板
                $(this.el).find("#docAdvice_temps").bootstrapTable({
                    sortName: "template_power",
                    columns: [
                        {field: "", title: "", checkbox: true},
                        {field: 'template_name', title: '模板名称', width: "25%",},
                        {field: 'template_power', title: '模板类型', formatter: formatTempType, width: "15%",},
                        {field: 'template_detail', title: '模板内容', align: 'left', halign: 'center', width: "60%",},
                    ],
                    data: [],
                    clickToSelect: true
                });
                //处方模板
                $el.find("#recipe_temp_tbl").bootstrapTable({
                    columns: [
                        {field: "", title: "", checkbox: true},
                        {field: 'template_name', title: '名称'},
                        {field: 'prescription_type', title: '处方类别', formatter: formatRecipeType},
                        {field: 'template_power', title: '模板类别', formatter: formatTempType},
                        {field: 'remark', title: '处方备注'},
                    ],
                    data: [],
                    clickToSelect: true,
                    singleSelect: true
                });
                //var source = $el.find(".print_content").html();
                //var template = Handlebars.compile(source)([]);
                //$el.find(".print_content").html(template);
                //显示处方
                return this;
            },
            finishDiagnose: function (e) {
                var param = {};
                var el = $(this.el);
                var registerNo = el.find(".register_id").val();
                var xyData = $("#recipe_table").bootstrapTable("getData");
                var zyData = $("#zy_table").bootstrapTable("getData");

                xyData.forEach(function (value) {
                    value.unit_price = value.price;
                    value.drug_sic_name = value.drug_name;
                    value.take_times=value.take_times||"seo";
                    delete value.id;
                    delete value[""];
                });

                zyData.forEach(function (value) {
                    value.unit_price = value.price;
                    value.drug_sic_name = value.drug_name;
                    value.packing_spec = value.goods_spec;
                    value.take_times=value.take_times||"seo";
                    delete value.id;
                    delete value[""];
                });

                param["visit_date"] = new Date().toLocaleDateString().replace(/\//g, "-");
                param["dept_name"] = sessionStorage.getItem("department_name");
                param["doctor_advice"] = el.find("#recipe_medAdvice").val() || "";
                param["register_no"] = registerNo;
                param["diagnosis_result"] = el.find("#recipe_diagnose").val() || "";
                param["patient_tell"] = el.find("#patient_tell").val() || "";
                param["patient_id"] = $(".pat_info .pat_id").text();
                param["patient_name"] = $(".pat_info .pat_name").text();
                param["d_serialno"] = $(".pat_info .pat_seri").text();
                param["enterprise_id"] = sessionStorage.getItem('enterprise_id');
                param["enterprise_name"] = sessionStorage.getItem('enterprise_name');
                param["doctor_id"] = sessionStorage.getItem('doctor_id');
                param["doctor_name"] = sessionStorage.getItem('doctor_name');
                param["patient_sex"] = $(".pat_info .pat_sex").text();
                param["patient_birth"] = $(".pat_info .pat_birth").text();
                param["patient_age"] = new Date().getFullYear() - $(".pat_info .pat_birth").splice(0, 4);
                param["patient_marriage"] = $(".pat_info .pat_marriage").text();
                param["diagnosis_id"] = $(".finish_diag").eq(1).attr("diagnosis_id");
                param["xy"] = xyData;
                param["zy"] = zyData;

                //TODO:中西药费用为分开
                param["total_cost"] = $(".total_cost").val();
                param["zy_cost"] = $(".zy_cost").val();
                param["xy_cost"] = $(".xy_cost").val();
                var type = $(e.target).attr("name");
                if (type == "stop") {
                    if (!!this.diagnosis_id) {
                        param["diagnosis_id"] = this.diagnosis_id;
                        this.diagModel.stopDiag(param);
                    } else {
                        alert("未开始接诊，请接诊成功后再进行诊疗");
                    }
                } else if (type == "finish") {
                    if (param["doctor_advice"] && param["patient_id"]) {
                        this.diagModel.finishDiag(param);
                        $.extend(true, this.param, param);
                        //this.param = param;
                    } else {
                        alert("请选择患者并填写医嘱");
                    }
                }
                //if(type == "print"){
                //    this.print(param);
                //}
            },
            print: function (param) {
                if (param["doctor_advice"] && param["patient_id"]) {
                    $(".print_content .print_pat_name").html(param["patient_name"]);
                    $(".print_content .print_pat_sex").html(param["patient_sex"]);
                    $(".print_content .print_pat_age").html(param["patient_age"]);
                    $(".print_content .reg_id").html(param["register_no"]);
                    $(".print_content .dept_name").html(param["dept_name"]);
                    $(".print_content .diag_date").html(jctLibs.getDateStr(new Date()));
                    $(".print_total_cost, .print_drug_cost").html($('input.total_cost').val());
                    $(".print_content .doc_name").html(param["doctor_name"]);
                    $(".print_content .diag_result").html(param["diagnosis_result"]);
                    $(".drug_list").html("");
                    if (param["xy"].length > 0) {
                        param["xy"].forEach(function(xy){
                            var $div=$("<div class='am-g'></div>");
                            var subDiv="<div class='am-u-md-2'></div>";
                            $div.html([$(subDiv).html("&nbsp;").prop('outerHTML'),$(subDiv).html(xy['drug_sic_name']).prop('outerHTML'),$(subDiv).html(xy['packing_spec']).prop('outerHTML'),$(subDiv).html(xy['drug_num']).prop('outerHTML'),$(subDiv).html(xy['min_packing_unit']).prop('outerHTML'),$(subDiv).html(xy['take_way']).prop('outerHTML')].join(''));
                            $('.drug_list').append($div);
                        })
                    }
                    else if (param["zy"].length) {

                    }
                    $(".print_content").printThis({
                        importStyle: true,
                        importCSS: false
                    });
                } else {
                    alert("请选择患者并填写医嘱");
                }
            },
            stopResult: function (result) {
                if (result.errorNo == 0) {
                    alert("挂单成功");
                    $('.recipe_basic_info input').val('');
                    $("#patient_tell").val("");
                    $("#recipe_diagnose").val("");
                    $("#recipe_medAdvice").val("");
                    $("#recipe_table").bootstrapTable("removeAll");
                    $("#zy_table").bootstrapTable("removeAll");
                } else if (result.errorNo == "-1") {
                    alert(result.info);
                } else {
                    alert("挂单失败")
                }
            },
            finishResult: function (result) {
                if (result.errorNo == 0) {
                    this.print(this.param);
                    this.pats.regPatsModel.getRegPatients("1,2,3");
                    //获取已就诊的挂号患者
                    this.pats.regPatsModel.getRegPatients(0);
                    $("#diagnose_box").removeAttr('patient_id');
                    $('#body_check_modal input').val('');
                    $('#success_alert').modal();
                    this.resetAll();
                    this.param = {};
                } else if (result.errorNo == "-1") {
                    alert(result.info);
                } else {
                    //alert("保存病历失败")
                }
            },
            resetAll: function () {
                $(".pat_id").text("");
                $(".pat_name").text("");
                $(".pat_sex").text("");
                $(".pat_birth").text("");
                $(".pat_marriage").text("");
                $(".pat_seri").text("");
                $(".pat_tell").text("");
                $(".pat_idCard").text("");
                $(".pat_age").text("");
                $("#diag_record_tbl").bootstrapTable("removeAll");

                $('.recipe_basic_info input').val('');
                $("#patient_tell").val("");
                $("#recipe_diagnose").val("");
                $("#recipe_medAdvice").val("");
                $("#recipe_table").bootstrapTable("removeAll");
                $("#zy_table").bootstrapTable("removeAll");
            },
            showRecordModal: function (row) {
                var diagnosis = row['diagnosis'], check = row['check'], inspection = row['inspection'], treatment = row['treatment'], perscription = row['prescription'];
                var $detail = $('#diag_detail');
                $('#diag_detail h3').html(diagnosis['patient_name'] + ' 的病历');
                var diagDocName = diagnosis['doctor_name']
                //当前医生显示姓名，不是当前医生仅显示姓+医生，例：刘医生
                var doctorName = diagnosis['doctor_id'] == sessionStorage.getItem('doctor_id') ? diagDocName : diagDocName.slice(0, 1) + '医生';
                var str = '<div class="am-g record_summary"><div class="am-u-sm-6">就诊时间：' + diagnosis['diagnosis_date'] + '</div><div class="am-u-sm-6">就诊医生：' + doctorName + '</div></div>';


                //显示主诉、诊断、医嘱
                $detail.find("#patient_record_tell").val(diagnosis.patient_tell);
                $detail.find("#recipe_record_diagnose").val(diagnosis.diagnosis_result);
                $detail.find("#recipe_record_medAdvice").val(diagnosis.doctor_advice);
                var zyArr, xyArr;
                for (var key in perscription['ZY']) {
                    zyArr = perscription['ZY'][key]
                }
                for (var xkey in perscription['XY']) {
                    xyArr = perscription['XY'][xkey]
                }
                //显示处方
                var zyCode = zyArr ? zyArr.join(',') : 'none', xyCode = xyArr ? xyArr.join(',') : "none";
                this.commonModel.search('diagnosis.prescription_drug_detail', {
                    'enterprise_id': sessionStorage.getItem('enterprise_id'),
                    'record_id': zyCode
                }, 'getRecordZyRecipe');
                this.commonModel.search('diagnosis.prescription_drug_detail', {
                    'enterprise_id': sessionStorage.getItem('enterprise_id'),
                    'record_id': xyCode
                }, 'getRecordXyRecipe');
                $('#diag_detail .record_time_summary').html(str);
                $('#diag_detail').find('textarea,input').attr('readonly', 'readonly')
                $('#diag_record_modal').modal({
                    width: 900
                });
            },
            showZyRecipe: function (res) {
                $('table#zy_record_table').bootstrapTable('removeAll');
                if (res.errorNo == 0) {
                    var data = res.rows;
                    data.forEach(function (drug) {
                        drug['drug_name'] = drug['drug_sic_name'];
                        drug['price'] = drug['unit_price'];
                    })
                    $('table#zy_record_table').bootstrapTable('load', data);
                }
            },
            showXyRecipe: function (res) {
                $('table#recipe_record_table').bootstrapTable('removeAll');
                if (res.errorNo == 0) {
                    var data = res.rows;
                    data.forEach(function (drug) {
                        drug['drug_name'] = drug['drug_sic_name'];
                        drug['price'] = drug['unit_price'];
                    })
                    $('table#recipe_record_table').bootstrapTable('load', data)
                }
            },
        });
        return diagnoseView;
    });

