define(['txt!../../Common/patRecord/patRecord.html',
        '../../Common/commonModel',
        'handlebars', 'backbone', 'jctLibs', 'bootstrapTable'],
    function (Template, commonModel, Handlebars, Backbone, jctLibs, bootstrapTable) {
        var formatDate = function (value, row, index) {
            return row['diagnosis']['diagnosis_date'].split(' ')[0]
        };
        var formatDiag = function (value, row, index) {
            return row['diagnosis']['diagnosis_result']
        };
        var formatTimes = function (value, row) {
            return {
                "seo": "一天两次",
                "tho": "一天三次",
                "foo": "一天四次",
                "twoho": "2小时一次",
                "sho": "6小时一次",
                "eho": "8小时一次",
                "bbo": "睡前一次",
                "bmo": "饭前一次",
            }[value];
        };
        var wmedicineColumns = [
            {field: "", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: "drug_name", width: "13%", title: "名称"},
            {field: "drug_code", width: "5%", title: "药品码"},
            {field: "take_spec", width: "8%", title: "单次用量"},
            {field: "take_way", width: "10%", title: "用法"},
            {field: "packing_spec", width: "12%", title: "最小包装规格", formatter: formatTimes},
            {field: "take_times", width: "15%", title: "频度"},
            {field: "prescription_num", width: "6%", title: "总量"},
            //TODO:根据单位修改价格
            {field: "drug_unit", width: "4%", title: "单位"},
            {field: "unit_price", width: "8%", title: "单价", formatter: jctLibs.generateDrugPrice}
        ];
        var wmedicineColumns2 = [
            {field: "", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: "drug_name", width: "13%", title: "名称"},
            //{field: "group_no", width: "5%", title: "组号"},
            //{field: "take_spec", width: "8%", title: "单次用量"},
            //{field: "take_way", width: "10%", title: "用法"},
            //{field: "packing_spec", width: "12%", title: "最小包装规格"},
            //{field: "take_times", width: "15%", title: "频度"},
            {field: "drug_num", width: "6%", title: "总量"},
            //TODO:根据单位修改价格
            //{field: "unit", width: "4%", title: "单位"},
            {field: "price", width: "8%", title: "单价", formatter: jctLibs.generateDrugPrice},
            {
                field: "delete", title: "删除", width: "8%", events: {
                'click .table_remove': function (e, value, row, index) {
                    var $table = $(e.target).closest("table");
                    $table.bootstrapTable('remove', {
                        field: 'drug_name',
                        values: [row.drug_name]
                    });
                }
            }, formatter: jctLibs.deleteFormatter
            }
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.commonModel = new commonModel();
                /***侦听回调事件***/
                this.listenTo(this.commonModel, 'getPatRecord', this.renderDiagRecord);

                this.listenTo(this.commonModel, 'getRecordZyRecipe', this.showZyRecipe);
                this.listenTo(this.commonModel, 'getRecordXyRecipe', this.showXyRecipe);
                //xiangmu
                this.listenTo(this.commonModel, 'Diagnosis_projects', this.Diagnosisprojects);
                this.listenTo(this.commonModel, 'Check_project', this.Checkproject);
                this.listenTo(this.commonModel, 'Inspection_items', this.Inspectionitems);

            },
            Diagnosisprojects: function (res) {
                console.log(res)

                $('#Diagnosis_projects').bootstrapTable('removeAll');
                if (res.errorNo == 0) {
                    var data = res.rows;
                    //data.forEach(function (drug) {
                    //    drug['drug_name'] = drug['drug_sic_name'];
                    //    drug['price'] = drug['unit_price'];
                    //})
                    $('#Diagnosis_projects').bootstrapTable('load', data)
                }
            },
            Checkproject: function (res) {
                console.log(res)
                $('#Check_project').bootstrapTable('removeAll');
                if (res.errorNo == 0) {
                    var data = res.rows;
                    //data.forEach(function (drug) {
                    //    drug['drug_name'] = drug['drug_sic_name'];
                    //    drug['price'] = drug['unit_price'];
                    //})
                    $('#Check_project').bootstrapTable('load', data)
                }
            },
            Inspectionitems: function (res) {
                console.log(res)

                $(this.el).find('#Inspection_items').bootstrapTable('removeAll');
                if (res.errorNo == 0) {
                    var data = res.rows;
                    //data.forEach(function (drug) {
                    //    drug['drug_name'] = drug['drug_sic_name'];
                    //    drug['price'] = drug['unit_price'];
                    //})
                    $(this.el).find('#Inspection_items').bootstrapTable('load', data)
                }
            },
            showZyRecipe: function (res) {
                if (res.errorNo == 0) {
                    //console.log($('table#zy_record_table').bootstrapTable('getData'))
                    var data = res.rows;
                    $('#zy_record_table').bootstrapTable('load', data);
                }
            },
            showXyRecipe: function (res) {
                $(this.el).find('table#recipe_record_table').bootstrapTable('removeAll');
                if (res.errorNo == 0) {
                    var data = res.rows;
                    $(this.el).find('table#recipe_record_table').bootstrapTable('load', data)
                }
            },
            events: {},
            render: function (patId) {
                $(this.el).html(Template);
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                this.commonModel.searchRecord(patId);
                var $table = $(this.el).find(".recipe_record_table");
                $table.bootstrapTable({
                    columns: wmedicineColumns,
                });
                $(this.el).find(".recipe_table").bootstrapTable({
                    columns: wmedicineColumns2,
                });
                $table.find("tr.no-records-found td").hide();
                $(this.el).find(".diag_panel_tool").remove();
                return this;
            },
            renderDiagRecord: function (res) {
                var arr = res['rows'], _this = this;
                $(this.el).find("#record_tbl").bootstrapTable({
                    columns: [
                        {field: "diagnosis_date", title: "就诊时间", formatter: formatDate},
                        {field: "diagnosis_result", title: "诊断结果", formatter: formatDiag}
                    ],
                    formatShowingRows: function () {
                    },
                    onClickRow: function (row, $e) {
                        var diagnosis = row['diagnosis'], check = row['check'], inspection = row['inspection'],
                            treatment = row['treatment'], perscription = row['prescription'];
                        //console.log(row)
                        var $detail = $('#diag_record_wrapper');
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
                        var zyCode = zyArr ? zyArr.join(',') : 'none', xyCode = xyArr ? xyArr.join(',') : "none";
                        _this.commonModel.search('diagnosis.prescription_drug_detail', {
                            'enterprise_id': sessionStorage.getItem('enterprise_id'),
                            'record_id': zyCode
                        }, 'getRecordZyRecipe');
                        _this.commonModel.search('diagnosis.prescription_drug_detail', {
                            'enterprise_id': sessionStorage.getItem('enterprise_id'),
                            'record_id': xyCode
                        }, 'getRecordXyRecipe');

                        //项目
                        var Check, Inspection, Treatment;
                        for (var ckkey in check) {
                            Check = check[ckkey]
                        }
                        for (var inkey in check) {
                            Inspection = inspection[inkey]
                        }
                        for (var trkey in check) {
                            Treatment = treatment[trkey]
                        }
                        var checkCode = Check ? Check.join(',') : 'none';
                        var InspectionCode = Inspection ? Inspection.join(',') : 'none';
                        var TreatmentCode = Treatment ? Treatment.join(',') : 'none';


                        _this.commonModel.search('diagnosis.treatment_detail_record', {
                            'enterprise_id': sessionStorage.getItem('enterprise_id'),
                            'treatment_no': TreatmentCode
                        }, 'Diagnosis_projects');
                        _this.commonModel.search('diagnosis.check_detail_record', {
                            'enterprise_id': sessionStorage.getItem('enterprise_id'),
                            'check_no': checkCode
                        }, 'Check_project');
                        _this.commonModel.search('diagnosis.inspection_detail_record', {
                            'enterprise_id': sessionStorage.getItem('enterprise_id'),
                            'inspection_no': InspectionCode
                        }, 'Inspection_items');
                    },
                    data: arr,
                });
            }
        });
        return view;
    });
