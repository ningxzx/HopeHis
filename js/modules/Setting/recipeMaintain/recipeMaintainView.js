define(['txt!../../Setting/recipeMaintain/recipeMaintain.html',
        '../../Setting/recipeMaintain/recipeMaintainModel',
        '../../Common/commonModel', 'jquery',
        'handlebars', 'backbone', 'jctLibs', 'bootstrapTable', 'amazeui'],
    function (Template, recipeMaintainModel, commonModel, $, Handlebars, backbone, jctLibs) {
        var opt = function (value, row, index) {
            return [
                '<a class="search_detail" href="javascript:void(0)" title="detail">',
                '明细',
                '</a>  ',
                '<a class="row_check" href="javascript:void(0)" title="detail">',
                '编辑',
                '</a>  ',
                '<a class="row_remove" href="javascript:void(0)" title="Remove">',
                '删除',
                '</a>'
            ].join('');
        };
        var formatTempType = function (value, row, index) {
            return value == 1 ? '公有模板' : '私有模板';
        };
        var formatRecipeType = function (value, row, index) {
            return {'10': '中药处方', '20': '西药模板'}[value]
        };
        var view = Backbone.View.extend({
            initialize: function () {
                //绑定model
                this.commonModel = new commonModel();
                this.model = new recipeMaintainModel();

                //侦听事件
                this.listenTo(this.commonModel, "getAdviceTemp", this.renderAdvice);
                this.listenTo(this.commonModel, "getRecipeTemp", this.renderRecipe);
                this.listenTo(this.commonModel, "getDiagTemp", this.renderDiag);
                this.listenTo(this.commonModel, "getMedicine", this.renderMedicine);
                this.listenTo(this.commonModel, "selectAdviceTemp", this.selectAdviceTemp);
                this.listenTo(this.commonModel, "selectRecipeTemp", this.selectRecipeTemp);
                this.listenTo(this.model, "addAdvice", this.addAdviceCallback);
                this.listenTo(this.model, "addRecipeDetail", this.addRecipeCallback);
                this.listenTo(this.model, "addDiagTemp", this.addDiagCallback);
                this.listenTo(this.model, "deleteAdvice", this.deleteCallback);
                this.listenTo(this.model, "deleteRecipe", this.deleteCallback);
                this.listenTo(this.model, "deleteDiag", this.deleteCallback);
                this.listenTo(this.model, "postDetail", this.addRecipeCallback);
                this.listenTo(this.commonModel, "getRecipeDetail", this.renderRecipeDetail);
            },
            events: {
                "click #advice_table_wrapper .add_tool": "addAdviceModal",
                'click #add_advice_template': "addAdviceTemp",
                'click #refresh_advice_template': 'getAdviceTemp',
                'click #search_advice_btn': 'searchAdvice',
                'click #search_advice_btn': 'searchAdvice',
                'click #search_advice_btn': 'searchAdvice',
                'click .reset_search': 'resetSearch',
                "click #recipe_table_wrapper .add_tool": "addRecipeModal",
                "click #diag_table_wrapper .add_tool": "addDiagModal",
                "click #recipe_temp_detail_wrapper .add_tool": "addRecipeDetailModal",
                "click #recipe_table_wrapper .refresh_tool": "getRecipeTemp",
                'click #add_recipe_template': 'addRecipeTemp',
                'click #add_recipe_detail': 'addRecipeDetail',
                'click #return_recipe_template': 'closeRecipeDetail',
                'click .am-tabs .am-icon-close': 'closeRecipeDetail',
                'click #add_diag_template': 'addDiagTemp'
            },
            render: function () {
                var _this = this,
                    role = sessionStorage.getItem("role"),
                    $el = $(this.el);
                $el.html(Template);
                //管理员及其他角色不能添加私有模板
                if (role != 2) {
                    $el.find('#personal_advice_temp').attr('disabled', true)
                    $el.find('#public_advice_temp').attr('checked', true)
                }
                else {
                    $el.find('#personal_advice_temp').attr('checked', true)
                }
                $el.find("select").chosen(
                    {
                        width: "100%",
                        no_results_text: '没有找到匹配的项！',
                        disable_search_threshold: 10
                    }
                );
                $el.find('#template_author').val(sessionStorage.getItem('user_name'))
                $el.find('#template_create_time').val(jctLibs.dataGet.currentDate())
                $el.find('select').chosen({width: "100%",disable_search_threshold: 100});
                //医嘱模板
                $el.find("#advice_tbl").bootstrapTable({
                    sortName: "template_power",
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'template_name', title: '模板名称', width: "10%",},
                        {field: 'template_power', title: '模板类型', formatter: formatTempType},
                        {field: 'template_detail', title: '模板内容', align: 'left', halign: 'center'},
                        {
                            field: 'opt', title: '操作', width: "10%", formatter: jctLibs.operateFormatter, events: {
                            //编辑
                            "click .row_edit": function (e, value, row, index) {
                                $('#advice_modal').attr('type', 'edit');
                                $('#advice_modal').attr('temp_id', row['template_id'])
                                $('#advice_template_name').val(row['template_name']);
                                $("input[name='template_power'][value=" + row['template_power'] + "]").attr("checked", 'checked');
                                $('#advice_template_detail').val(row['template_detail']);
                                $('#advice_modal .modal_title').html('编辑医嘱模板')
                                if (row['template_power'] == '1') {
                                    $el.find('#personal_advice_temp').attr('disabled', true)
                                }
                                $('#advice_modal').modal({
                                    width: 700
                                });
                            },
                            //删除
                            "click .row_remove": function (e, value, row, index) {
                                _this.model.removeAdviceTemp('doctor_advice_template', row['template_id'], 'deleteAdvice')
                            }
                        }
                        },
                    ],
                    data: []
                });
                //
                //诊断模板
                $el.find("#diag_tbl").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'template_name', width: "5%", title: '名称'},
                        {field: 'patient_tell', width: "15%", title: '患者主诉'},
                        {field: 'diagnosis_result', width: "30%", title: '诊断结果'},
                        {field: 'advice_temp_name', width: "10%", title: '医嘱模板'},
                        {field: 'recipe_temp_name', width: "10%", title: '处方模板'},
                        {field: 'remark', title: '备注', width: "10%",},
                        {
                            field: 'opt', title: '操作', formatter: jctLibs.operateFormatter, events: {
                            //编辑
                            "click .row_edit": function (e, value, row, index) {
                                $('#diag_modal').attr('type', 'edit');
                                $('#diag_modal .modal_title').html('编辑诊断模板');
                                $('#diag_modal').attr('temp_id', row['template_id']);
                                $('#patient_ask').val(row['patient_tell']);
                                $('#diag_template_detail').val(row['diagnosis_result']);
                                $('#diag_template_remark').val(row['remark']);
                                $('#diag_template_name').val(row['template_name']);
                                $("input[name='diag_type'][value=" + row['template_power'] + "]").attr("checked", 'checked');
                                $("#diag_temp_advice").val(row['doc_advice_tempid']);
                                $("#diag_temp_recipe").val(row['prescription_id']);
                                if (row['template_power'] == '1') {
                                    $el.find('#personal_diag_temp').attr('disabled', true)
                                }
                                _this.getAdviceTemp('template.doctor_advice_template', 'selectAdviceTemp');
                                _this.getAdviceTemp('template.prescription_template', 'selectRecipeTemp');
                                $('#diag_modal').modal({
                                    width: 700
                                });
                            },
                            //删除
                            "click .row_remove": function (e, value, row, index) {
                                _this.model.removeAdviceTemp('diagnosis_template', row['template_id'], 'deleteDiag')
                            }
                        }
                        },
                    ],
                    data: []
                });
                //处方模板
                $el.find("#recipe_tbl").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'template_name', title: '名称'},
                        {field: 'prescription_type', title: '处方类别', formatter: formatRecipeType},
                        {field: 'template_power', title: '模板类别', formatter: formatTempType},
                        {field: 'remark', title: '处方备注'},
                        {
                            field: 'opt', title: '操作', width: "10%", formatter: jctLibs.operateFormatter, events: {
                            //编辑
                            "click .row_edit": function (e, value, row, index) {
                                var $tab = $('#template_tabs');
                                _this.commonModel.search('template.prescription_template_detail', {
                                    template_id: row['template_id']
                                }, 'getRecipeDetail');
                                $tab.tabs('refresh');
                                $('#recipe_detail_template_hd').attr('temp_id', row['template_id'])
                                $tab.tabs('open', $('#recipe_detail_template_hd a'));
                                $('#recipe_template_name').val(row['template_name']);
                                $("#recipe_type").val( row.prescription_type).trigger('chosen:updated');
                                $("#recipe_template_type").val( row.template_power).trigger('chosen:updated');
                                $('#template_create_time').val(row['create_date_time'])
                                $('#recipe_detail_template_hd').removeClass('hid');
                                $('#recipe_template_remark').val(row['remark']);
                                $('#add_recipe_wrapper').attr('type', 'edit');
                                $('#recipe_detail_template_hd a').html('编辑处方模板');
                            },
                            //删除
                            "click .row_remove": function (e, value, row, index) {
                                _this.model.removeAdviceTemp('prescription_template', row['template_id'], 'deleteRecipe')
                            }
                        }
                        },
                    ],
                    data: []
                });
                //处方明细模板
                $el.find("#recipe_detail_tbl").bootstrapTable({
                    columns: [
                        {field: "", checkbox: true},
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: "drug_name", width: "10%", title: "名称"},
                        {field: "packing_spec", width: "8%", title: "规格"},
                        {field: "group_no", width: "10%", title: "组号", events: jctLibs.changeGroupNo, formatter: jctLibs.generateDrugGroup},
                        {field: "take_spec", width: "10%", title: "单次用量", events: jctLibs.changeTakeNum, formatter: jctLibs.generateTakeNum},
                        {field: "take_way", width: "10%", title: "用法", events: jctLibs.changeWay, formatter: jctLibs.generateTakeWay},
                        {field: "take_way_remark", width: "12%", title: "备注", events: jctLibs.changeTakeRemark, formatter: jctLibs.generateInput},
                        {field: "take_times", width: "15%", title: "频度", events: jctLibs.changeTimes, formatter: jctLibs.generateFreq},
                        {field: "take_date", width: "10%", title: "天数", events: jctLibs.changeDays, formatter: jctLibs.generateTakeDays},
                        {field: "drug_num", width: "6%", title: "总量", events: jctLibs.changeTotalNum, formatter: jctLibs.generateDrugNum},
                        {field: "unit", width: "4%", title: "单位"},
                        {field: "del", title: "删除", width: "8%", events: jctLibs.deleteGoodsEvents, formatter: jctLibs.deleteFormatter}
                    ],

                    data: []
                });
                //药物表格
                $el.find("#medicine_tbl").bootstrapTable({
                    columns: [
                        {field: "", checkbox: true},
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {field: 'batch_no', title: '药品批次'},
                        {field: 'goods_name', title: '药品名称',width: "20%",},
                        {field: 'goods_type', title: '药品分类'},
                        {field: 'suppliers_name', title: '供应商'},
                        {field: 'producter_name', title: '生产厂家'},
                        {field: 'goods_id', title: '药品批号'},
                        {field: 'min_packing_unit', title: '剂量单位', width: '10%'},
                        {field: 'current_num', title: '库存'},
                        {field: 'product_date_time', title: '生产日期'},
                        {field: 'deadline_date_time', title: '过期日期'},
                    ],
                    clickToSelect: true,
                    search:true,
                    data: [],
                    pageSize: 5,
                    pagination: true,
                    pageList: [5]
                });
                //获取处方模板，医嘱模板，诊断模板
                this.getAdviceTemp('template.doctor_advice_template', 'getAdviceTemp');
                this.getAdviceTemp('template.prescription_template', 'getRecipeTemp');
                this.getAdviceTemp('template.diagnosis_template', 'getDiagTemp');
                //获取库存药物
                this.commonModel.searchMedicine();
                return this;
            },
            //打开药物明细modal，选择药物加入处方
            addRecipeDetailModal: function () {
                $('#medicine_modal').modal({
                    width: '1000'
                })
            },
            //重置查询条件
            resetSearch: function (e) {
                var $target = $(e.target);
                var $wrapper = $target.closest('.search_wrapper');
                $wrapper.find('input[type=text]').val('');
                $wrapper.find('select').val('all');
                $wrapper.find('.start').datepicker('setValue', null)
                $wrapper.find('.end').datepicker('setValue', '')
            },
            //根据条件查询医嘱模板
            searchAdvice: function () {
                var params = {};
                var name = $('#search_advice_name').val(),
                    enterprise_id = sessionStorage.getItem('enterprise_id'),
                    doctor_id = sessionStorage.getItem('doctor_id'),
                    startDate = $('#advice_temp_wrapper .start').val(),
                    endDate = $('#advice_temp_wrapper .end').val(),
                    tempType = $('#advice_temp_type').val();
                doctor_id=doctor_id!=='undefined'?doctor_id:"";
                if (name !== "") {
                    params['template_name'] = name;
                }
                if (startDate !== "" || endDate !== "") {
                    params['create_date_time'] = startDate + '|' + endDate
                }
                if (tempType !== 'all') {
                    params['template_owner_id'] = tempType == '1' ? enterprise_id : doctor_id;
                }
                else {
                    params['template_owner_id'] = enterprise_id + ',' + doctor_id;
                }
                this.commonModel.search('template.doctor_advice_template', params, 'getAdviceTemp')
            },
            //获取医嘱模板
            getAdviceTemp: function (table, evName) {
                var enterprise_id = sessionStorage.getItem('enterprise_id'),
                    doctor_id = sessionStorage.getItem('doctor_id')!='undefined'?sessionStorage.getItem('doctor_id'):"",
                    role = sessionStorage.getItem("role");
                var ids = [enterprise_id, doctor_id];
                this.commonModel.search(table, {
                    template_owner_id: ids.join(',')
                }, evName)
            },
            //添加诊断模板modal弹出
            addDiagModal: function () {
                $('#diag_modal').attr('type', 'add');
                $('#diag_modal .modal_title').html('添加诊断模板');
                $('#diag_template_name').val('');
                $('#patient_ask').val('');
                $('#diag_template_detail').val('');
                $('#diag_template_remark').val('');
                $('#diag_modal textarea').val('');
                $('#diag_modal input[type=radio]').attr('disabled', false);
                $('#diag_modal input[type=radio]')[0].checked = true;
                $('#diag_modal').modal({
                    width: 700
                });
                this.getAdviceTemp('template.doctor_advice_template', 'selectAdviceTemp');
                this.getAdviceTemp('template.prescription_template', 'selectRecipeTemp');
            },
            selectAdviceTemp: function (res) {
                $('#diag_temp_advice').html('')
                if (res['errorNo'] == 0) {
                    var advices = res.rows;
                    advices.forEach(function (advice) {
                        jctLibs.appendToChosen($('#diag_temp_advice'), advice['template_id'], advice['template_name'])
                    });
                    $('#diag_temp_advice').chosen('update')
                }
            },
            selectRecipeTemp: function (res) {
                $('#diag_temp_recipe').html('')
                if (res['errorNo'] == 0) {
                    var recipes = res.rows;
                    recipes.forEach(function (recipe) {
                        jctLibs.appendToChosen($('#diag_temp_recipe'), recipe['template_id'], recipe['template_name'])
                    });
                    $('#diag_temp_recipe').chosen('update')
                }
            },
            //添加医嘱模板modal弹出
            addAdviceModal: function () {
                $('#advice_modal').attr('type', 'add');
                $('#advice_modal .modal_title').html('添加医嘱模板')
                $('#advice_template_name').val('');
                $('#advice_modal textarea').val('');
                $('#advice_modal input[type=radio]').attr('disabled', false)
                $('#advice_modal input[type=radio]')[0].checked = true;
                $('#advice_modal').modal({
                    width: 700
                })
            },
            //添加处方模板tabs显示
            addRecipeModal: function () {
                var $tab = $('#template_tabs');
                //清空input，表格及选择项
                $('#add_recipe_temp_wrapper #recipe_template_name,textarea').val('');
                $('#add_recipe_temp_wrapper input[type=radio]').attr('checked', false);
                $('#recipe_detail_tbl').bootstrapTable('load', []);
                $('#medicine_tbl').bootstrapTable('uncheckAll');
                //传入当前用户以及时间
                $('#add_recipe_wrapper').attr('type', 'add');
                $('#recipe_detail_template_hd a').html('新增处方模板');
                $('#recipe_detail_template_hd').removeClass('hid');
                $tab.tabs('refresh');
                $tab.tabs('open', $('#recipe_detail_template_hd a'));
            },
            //查询医嘱模板
            renderAdvice: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find("#advice_tbl").bootstrapTable('load', res.rows)
                }
                else {
                    $(this.el).find("#advice_tbl").bootstrapTable('load', [])
                }
            },
            //添加医嘱模板
            addAdviceTemp: function () {
                var type = $('#advice_modal').attr('type'),
                    temp_id = $('#advice_modal').attr('temp_id');
                var tempName = $('#advice_template_name').val();
                var tempType = $("input[name='advice_type']:checked").val();
                var detail = $('#advice_template_detail').val()
                if (tempName == '' || detail == '') {
                    alert('模板内容及名称不能为空！')
                    return;
                }
                if (type == 'add') {
                    this.model.addTemp('post', {
                        template_name: tempName,
                        template_power: tempType,
                        template_detail: detail,
                        tableName: 'doctor_advice_template'
                    }, 'addAdvice');
                }
                else {
                    var data = {
                        template_id: temp_id,
                        template_name: tempName,
                        template_power: tempType,
                        template_detail: detail,
                        tableName: 'doctor_advice_template'
                    };
                    if (tempType == '1') {
                        data.template_owner_id = sessionStorage.getItem('enterprise_id');
                        data.template_owner_name = sessionStorage.getItem('enterprise_name');
                    }
                    this.model.addTemp('patch', data, 'addAdvice');
                }
            },
            addAdviceCallback: function (res) {
                $('.am-alert').addClass('am-hide');
                var type = $('#advice_modal').attr('type');
                if (res.errorNo == 0 && (res.tip == 'OK' || res.template_id)) {
                    $('#advice_operate_su>p').html(type == 'add' ? '添加模板成功！' : '编辑模板成功！');
                    $('#advice_operate_su').removeClass('am-hide');
                    window.setTimeout(function () {
                        $('#advice_operate_su').addClass('am-hide')
                    }, 2000);
                }
                else {
                    $('#advice_operate_fail>p').html(type == 'add' ? '添加模板失败！' : '编辑模板失败！');
                    $('#advice_operate_fail').removeClass('am-hide')
                    window.setTimeout(function () {
                        $('#advice_operate_fail').addClass('am-hide')
                    }, 2000)
                }
                this.getAdviceTemp('template.doctor_advice_template', 'getAdviceTemp');
                $('#advice_template_name').val('');
                $('#advice_modal textarea').val('');
                $('#advice_modal input[type=radio]').attr('disabled', false)
                $('#advice_modal input[type=radio]')[0].checked = true;
                $('#advice_modal').modal('close');
            },
            /**添加处方模板回调事件
             * 添加模板失败，停留在添加处方模板界面。添加模板成功，跳转回处方模板界面。显示成功提示
             * @param res
             */
            addRecipeCallback: function (res) {
                $('.am-alert').addClass('am-hide');
                var type = $('#add_recipe_wrapper').attr('type');
                if (res.errorNo == 0) {
                    $('#recipe_operate_su>p').html('操作成功！');
                    $('#recipe_operate_su').removeClass('am-hide');
                    window.setTimeout(function () {
                        $('#recipe_operate_su').addClass('am-hide')
                    }, 2000);
                    this.getAdviceTemp('template.prescription_template', 'getRecipeTemp');
                    this.closeRecipeDetail();
                }
                else {
                    $('.recipe_error_text').html('很抱歉，操作失败！');
                    $(this.el).find('#recipe_detail_tbl').bootstrapTable('load', [])
                    $(this.el).find('#medicine_tbl').bootstrapTable('uncheckAll')
                    $('#recipe_error_alert').modal()
                }
            },
            //删除医嘱模板的回调函数
            deleteCallback: function (res, type) {
                $('.am-alert').addClass('am-hide')
                var tempType = res['type'],
                    $suc = $('#' + tempType + '_operate_su'),
                    $err = $('#' + tempType + '_operate_fail');
                if (res.errorNo == 0 && res.tip == '1') {
                    $suc.find('p').html('删除模板成功！')
                    $suc.removeClass('am-hide')
                    window.setTimeout(function () {
                        $suc.addClass('am-hide')
                    }, 2000)
                }
                else {
                    $err.find('p').html('删除模板失败！')
                    $err.removeClass('am-hide')
                    window.setTimeout(function () {
                        $err.addClass('am-hide')
                    }, 2000)
                }
                if (tempType == 'advice') {
                    this.getAdviceTemp('template.doctor_advice_template', 'getAdviceTemp');
                }
                else if (tempType == 'recipe') {
                    this.getAdviceTemp('template.prescription_template', 'getRecipeTemp');
                }
                else {
                    this.getAdviceTemp('template.diagnosis_template', 'getDiagTemp');
                }
            },
            //显示库存药物数据
            renderMedicine: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find('#medicine_tbl').bootstrapTable('load', res.rows)
                }
            },
            getRecipeTemp: function () {
                this.getAdviceTemp('template.prescription_template', 'getRecipeTemp');
            },
            addDiagTemp: function () {
                var type = $('#diag_modal').attr('type');
                var name = $('#diag_template_name').val();
                if (!name) {
                    alert('很抱歉，模板名称不能为空，请填写模板名称');
                    return
                }
                var patientAsk = $('#patient_ask').val();
                if (!patientAsk) {
                    alert('很抱歉，主诉不能为空，请填写主诉');
                    return
                }
                var diagResult = $('#diag_template_detail').val();
                if (!diagResult) {
                    alert('很抱歉，诊断结果不能为空，请填写诊断结果');
                    return
                }
                var adviceId = $('#diag_temp_advice').val()||"";
                var adviceName = $('#diag_temp_advice').find("option:selected").text();
                var recipeId = $('#diag_temp_recipe').val()||"";
                var recipeName = $('#diag_temp_recipe').find("option:selected").text();
                var tempType = $("input[name='diag_type']:checked").val();
                var remark = $("#diag_template_remark").val();
                var param = {
                    template_name: name,
                    diagnosis_result: diagResult,
                    template_power: tempType,
                    patient_tell: patientAsk,
                    prescription_id: recipeId,
                    doc_advice_tempid: adviceId,
                    advice_temp_name: adviceName,
                    recipe_temp_name: recipeName,
                    remark: remark,
                    tableName: 'diagnosis_template'
                };
                if (type == 'add') {
                    this.model.addTemp('post', param, 'addDiagTemp');
                }
                if (type == 'edit') {
                    param['template_id'] = $('#diag_modal').attr('temp_id');
                    param['tableName'] = 'diagnosis_template';
                    this.model.addTemp('patch', param, 'addDiagTemp');
                }
            },
            addDiagCallback: function (res) {
                $('.am-alert').addClass('am-hide');
                var type = $('#diag_modal').attr('type');
                if (res.errorNo == 0 && (res.tip == '1' || res.template_id)) {
                    $('#diag_operate_su>p').html(type == 'add' ? '添加模板成功！' : '编辑模板成功！');
                    $('#diag_operate_su').removeClass('am-hide');
                    window.setTimeout(function () {
                        $('#diag_operate_su').addClass('am-hide')
                    }, 2000);
                }
                else {
                    $('#diag_operate_fail>p').html(type == 'add' ? '添加模板失败！' : '编辑模板失败！');
                    $('#diag_operate_fail').removeClass('am-hide')
                    window.setTimeout(function () {
                        $('#diag_operate_fail').addClass('am-hide')
                    }, 2000)
                }
                $('#diag_template_name').val('');
                $('#diag_modal textarea').val('');
                $('#diag_modal input[type=radio]').attr('disabled', false)
                $('#diag_modal input[type=radio]')[0].checked = true;
                $('#diag_modal').modal('close');
                this.getAdviceTemp('template.diagnosis_template', 'getDiagTemp');
            },
            //点击药品信息框中的“提交药物”，modal关闭，药物信息进入处方模块
            addRecipeDetail: function () {
                var medicines = [].concat($(this.el).find('#medicine_tbl').bootstrapTable('getAllSelections'));
                var curData = $(this.el).find('#recipe_detail_tbl').bootstrapTable('getData'), ids = [], newData = [];
                ids = curData.map(function (x) {
                    return x['goods_id']
                });
                medicines.forEach(function (medicine) {
                    medicine['drug_num'] = 1
                    medicine['drug_name'] = medicine['goods_name'];
                    medicine['drug_code'] = medicine['goods_id'];
                    medicine['packing_spec'] = medicine['goods_spec'];
                    medicine['unit']=medicine['min_packing_unit']
                    var i = ids.indexOf(medicine['goods_id']);
                    if (i != -1) {
                        curData[i]['drug_num'] = parseInt(curData[i]['drug_num']) + 1;
                    }
                    else {
                        newData.push($.extend(true, {}, medicine))
                    }
                })
                newData = newData.concat(curData)
                $(this.el).find('#recipe_detail_tbl').bootstrapTable('load', newData)
                $('#medicine_modal').modal('close')
            },
            //点击新增处方模块的“确认”，先提交处方模板主表信息，然后提交明细
            addRecipeTemp: function () {
                var _this = this;
                var data = $(this.el).find('#recipe_detail_tbl').bootstrapTable('getData'), params = {};
                var name = $('#recipe_template_name').val();
                if (name == '') {
                    alert('模板名称不能为空！');
                    return;
                }
                params['tableName'] = 'prescription_template';
                var tempType = $("#recipe_type").val();
                var tempPower = $("#recipe_template_type").val();
                if (!tempType) {
                    alert('请选择处方类型！');
                    return;
                }
                if (!tempPower) {
                    alert('请选择模板类型！');
                    return;
                }
                var remark = $('#recipe_template_remark').val();
                params['template_name'] = name;
                params['prescription_type'] = tempType;
                params['template_power'] = tempPower;
                params['remark'] = remark;
                if(tempPower==0&&sessionStorage.getItem('doctor_name')=='undefined'){
                    alert('非常抱歉只有医生可以添加私有模板！');
                    return;
                }
                if ($('#add_recipe_wrapper').attr('type') == 'add') {
                    params['enterprise_id'] = sessionStorage.getItem('enterprise_id');
                    params['enterprise_name'] = sessionStorage.getItem('enterprise_name')
                    params['doctor_name'] = sessionStorage.getItem('doctor_name')
                    $.ajax({
                        type: 'post',
                        url: 'http://114.55.85.57:8081/jethis/setting/templateSetting',
                        data: JSON.stringify(params)
                    }).done(function (res) {
                        if (res['template_id']) {
                            _this.tempRecipe = res;
                            if (data.length > 0) {
                                $('#add_recipe_wrapper').attr('type', 'addDetail');
                                _this.addRecipeTempDetail();
                            }
                            else {
                                _this.addRecipeCallback({errorNo: 0})
                            }
                        }
                    }).fail(function () {
                        $('.recipe_error_text').html('很抱歉，添加处方模板失败！');
                        $(_this.el).find('#recipe_detail_tbl').bootstrapTable('load', [])
                        $(_this.el).find('#medicine_tbl').bootstrapTable('uncheckAll')
                        $('#recipe_error_alert').modal({
                            width: 700
                        })
                    });
                }
                else {
                    var temp_id = $('#recipe_detail_template_hd').attr('temp_id');
                    params['template_id'] = temp_id;
                    $.ajax({
                        type: 'patch',
                        url: 'http://114.55.85.57:8081/jethis/setting/templateSetting',
                        data: JSON.stringify(params)
                    }).done(function (res) {
                        if (res) {
                            res = jctLibs.listToObject(res, 'rows')['rows'];
                            _this.tempRecipe = res[0];
                            if (data.length > 0) {
                                $('#add_recipe_wrapper').attr('type', 'editDetail');
                                _this.addRecipeTempDetail();
                            }
                            else {
                                _this.addRecipeCallback({errorNo: 0})
                            }
                        }
                    }).fail(function () {
                        $('.recipe_error_text').html('很抱歉，编辑处方模板失败！');
                        $(_this.el).find('#medicine_tbl').bootstrapTable('uncheckAll')
                        $('#recipe_error_alert').modal({
                            width: 700
                        })
                    });
                }
            },
            addRecipeTempDetail: function () {
                var type = $('#add_recipe_wrapper').attr('type');
                var param = {}, rows, recipe = this.tempRecipe;
                param.mainTemplate =recipe['template_id'] ;
                var details = $(this.el).find('#recipe_detail_tbl').bootstrapTable('getData');
                rows = details.map(function (x) {
                    var detail = {};
                    detail['create_account_id'] = sessionStorage.getItem('user_id')
                    detail['drug_code'] = x['drug_code'];
                    detail['drug_name'] = x['drug_name'];
                    detail['drug_num'] = x['drug_num'];
                    detail['packing_spec'] = x['packing_spec'];
                    detail['unit'] = x['unit'];
                    detail['group_no'] = x['group_no'] || 1;
                    detail['take_spec'] = x['take_spec'];
                    detail['take_times'] = x['take_times'] || '一天两次';
                    detail['take_way'] = x['take_way'] || '口服';
                    return detail
                });
                param['detailList']=rows;
                this.model.addRecipeDetail(param);

            },
            renderRecipe: function (res) {
                var $recipeTable = $(this.el).find('#recipe_tbl');
                if (res.errorNo == 0) {
                    $recipeTable.bootstrapTable('load', res.rows)
                }
                else {
                    $recipeTable.bootstrapTable('load', [])
                }
            },
            renderDiag: function (res) {
                var $diagTable = $(this.el).find('#diag_tbl');
                if (res.errorNo == 0) {
                    $diagTable.bootstrapTable('load', res.rows)
                }
                else {
                    $diagTable.bootstrapTable('load', [])
                }
            },
            renderRecipeDetail: function (res) {
                var $recipeDetailTable = $(this.el).find('#recipe_detail_tbl'),
                    details = res.rows, realData = [];
                if (res.errorNo == 0) {
                    details.forEach(function (detail) {
                        var data = $.extend(true, {}, detail);
                        data['goods_id'] = detail['drug_code'];
                        data['goods_name'] = detail['drug_name'];
                        data['min_packing_unit'] = detail['packing_spec'];
                        data['total_num'] = detail['drug_num'];
                        realData.push(data);
                    })
                    $recipeDetailTable.bootstrapTable('load', realData)
                }
                else {
                    $recipeDetailTable.bootstrapTable('load', [])
                }
            },
            closeRecipeDetail: function () {
                var $tab = $('#template_tabs');
                $('#add_recipe_wrapper').attr('type', 'add');
                $('#recipe_detail_template_hd').addClass('hid');
                $tab.tabs('refresh');
                $tab.tabs('open', $('#recipe_template_hd a'));
            },
        });
        return view;
    });