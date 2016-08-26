/**
 * Created by xzx on 2016-06-15.
 */
define(['txt!../Diagnose/treatments.html',
        '../Diagnose/model/treatmentModel',
        '../Common/commonModel',
        'bootstrapTable', 'amazeui', 'handlebars', 'backbone', "jctLibs", "chosen"],
    function (treatments, treatmentModel, commonModel, bootstrapTable, ai, Handlebars, Backbone, jctLibs, chosen) {
        var medicineColumn = [
            {field: "goods_name", title: "名称", width: "33%"},
            {field: "goods_spec", title: "规格", width: "25%"},
            {field: "min_packing_unit", title: "单位", width: "10%"},
            {field: "current_num", title: "库存", width: "5%"},
            {field: "goods_sell_price", title: "单价(元）", width: "10%", formatter: jctLibs.generatePrice}
        ];
        //西药常用分类
        var subcategory = {
            wmedicineSubcategory: [
                {val: "", text: "感冒药"},
                {val: "", text: "中成药"},
                {val: "", text: "心脑血管用药"},
                {val: "", text: "胃病用药"}],
            //中药常用分类
            cmedicineSubcategory: [
                {val: "", text: "中草药"},
                {val: "", text: "解毒类"}
            ],
        };
        //西药明细表表头及key
        var columns = {
            //检查明细表表头及key
            checkColumns: [
                {field: "check_name", title: "名称", width: "20%"},
                {field: "check_price", title: "单价", width: "15%", formatter: jctLibs.generatePrice},
                {field: "remark", title: "明细", width: "65%"}
            ],
            //诊疗项目明细表表头及key
            cureProjectColumns: [
                {field: "dgns_treat_name", title: "名称", width: "20%"},
                {field: "dgns_treat_price", title: "单价", width: "15%", formatter: jctLibs.generatePrice},
                {field: "remark", title: "明细", width: "65%"}
            ],
            //检验项目明细表表头及key
            inspectColumns: [
                {field: "inspection_name", title: "名称", width: "20%"},
                {field: "inspection_price", title: "单价", width: "15%", formatter: jctLibs.generatePrice},
                {field: "remark", title: "明细", width: "65%"}
            ]
        };
        var checkColumns = {
            //检验
            inspectColumns: [
                {
                    field: "", title: "序号", width: "5%", formatter: jctLibs.generateIndex, footerFormatter: function () {
                    return '总金额'
                }
                },
                {field: "inspection_name", title: "名称"},
                {
                    field: "inspection_price", title: "价格", footerFormatter: function (data) {
                    return data.reduce(function (pre, current) {
                        return pre + (+current['inspection_price']);
                    }, 0)
                }
                },
                {field: "remark", title: "备注"},
                {
                    field: "",
                    title: "删除",
                    width: "8%",
                    events: {
                        'click .table_remove': function (e, value, row, index) {
                            var $table = $(e.target).closest("table");
                            $table.bootstrapTable('remove', {
                                field: 'inspection_name',
                                values: [row["inspection_name"]]
                            });
                        }
                    },
                    formatter: jctLibs.deleteFormatter
                }
            ],
            //检查
            checkColumns: [
                {
                    field: "", title: "序号", formatter: jctLibs.generateIndex, footerFormatter: function () {
                    return '总金额'
                }
                },
                {field: "check_name", title: "名称"},
                {
                    field: "check_price", title: "价格", footerFormatter: function (data) {
                    return data.reduce(function (pre, current) {
                        return pre + (+current['check_price']);
                    }, 0)
                }
                },
                {field: "remark", title: "备注"},
                {
                    field: "",
                    title: "删除",
                    width: "8%",
                    events: {
                        'click .table_remove': function (e, value, row, index) {
                            var $table = $(e.target).closest("table");
                            $table.bootstrapTable('remove', {
                                field: 'check_name',
                                values: [row["check_name"]]
                            });
                        }
                    },
                    formatter: jctLibs.deleteFormatter
                }
            ],
            cureProjectColumns: [
                {
                    field: "", title: "序号", width: "5%", formatter: jctLibs.generateIndex, footerFormatter: function () {
                    return '总金额'
                }
                },
                {field: "dgns_treat_name", title: "名称"},
                {
                    field: "dgns_treat_price", title: "价格", footerFormatter: function (data) {
                    return data.reduce(function (pre, current) {
                        return pre + (+current['dgns_treat_price']*current['billing_item_num']);
                    }, 0)
                }
                },
                {field: "billing_item_num", title: "数量", width: "15%", formatter: function (value, row, index,e) {
                    var $input = $('<input type="number" class="billing_item_num"/>');
                    if (value) {
                        $input.attr("value", value);
                    }
                    else {
                        $input.attr("value", 1);
                    }
                    return $input.prop('outerHTML');
                },events:{
                    //改变药物数量
                    'change .billing_item_num': function (e, value, row, index) {
                        var $table_t = $(e.target).closest("table"), $value = $(e.target).val();
                        row.billing_item_num = $value;
                        $table_t.bootstrapTable('updateRow', {index: index, row: row});
                    }
                }},
                {field: "remark", title: "备注"},
                {
                    field: "",
                    title: "删除",
                    width: "8%",
                    events: {
                        'click .table_remove': function (e, value, row, index) {
                            var $table = $(e.target).closest("table");
                            $table.bootstrapTable('remove', {
                                field: 'dgns_treat_name',
                                values: [row["dgns_treat_name"]]
                            });
                        }
                    },
                    formatter: jctLibs.deleteFormatter
                }
            ]
        };
        var treatmentView = Backbone.View.extend({
            initialize: function () {
                //新建一个执行项目的实例
                this.treatmentModel = new treatmentModel();
                this.commonModel = new commonModel();

                //TODO:根据医生中医or西医显示相应的药物目录

                this.listenTo(this.treatmentModel, "treatmentGetted", this.renderData);
                this.listenTo(this.treatmentModel, "getWmedicine", this.renderWmedicine);
                this.listenTo(this.treatmentModel, "getCmedicine", this.renderCmedicine);
                this.listenTo(this.treatmentModel, "saveTreat", this.treatReasult);
                this.listenTo(this.treatmentModel, "getDetail", this.renderDetail);
            },
            events: {
                "change #treatment_category": "changeRecipeType",
                "click .save_btn": "saveCheckTable",
                "click .reset_btn": "resetCheckTable",
                "keydown #w_medicine_input": "searchWmed",
                'click #w_medicine_search': 'searchWmedicine',
                "keydown #c_medicine_input": "searchCmed",
                'click #c_medicine_search': 'searchCmedicine',
                "keydown #treatment_input": "searchTmed",
                'click #treatment_search': 'searchTreatment',
                'click #w_medicine_panel .refresh_tool': 'searchWmedicine',
                'click #c_medicine_panel .refresh_tool': 'searchCmedicine',
                'click #medical_treat_panel .refresh_tool': 'searchTreatment',
            },
            //药物説明
            renderDetail:function(res){
                var type=$('#treatments_tabs>ul.am-nav-tabs>li.am-active').index();
                var data=$(this.el).find(type==1?"#c_medicine_detail":"#w_medicine_detail");

                if(res.errorNo==0) {
                    if (res.rows.length>0) {
                        //$('.detail_panel').removeClass('am-hide');
                        var medicine = res.rows[0];
                        //$('#drug_name').val(medicine.drug_name);
                        //$('#approval_no').val(medicine.approval_no);
                        data.html(medicine.drug_instructions);
                    }
                    else {
                        //$('.detail_panel').addClass('am-hide');
                        alert('很抱歉！未找到相应的说明书！！')
                    }
                }
            },
            //根据处方类型的不同生成不同的常用分类和表头
            changeRecipeType: function () {
                var $table = $(this.el).find("#treatment_table"),
                    $select = $('#treatment_category'),
                    $panelHeader = $(".add_treatment_title"),
                    $checkTable = $("#check_table"),
                    $treatmentHeader = $('.treatment_table_title'),
                    that = this;
                $table.bootstrapTable("destroy");
                var curType = $select.val();
                $(".check_panel").addClass("hid");
                switch (curType) {
                    case "check":
                        this.treatmentModel.geCureProject({table: 'admin.erp_check_item'});
                        $panelHeader.html("保存检查项目");
                        $treatmentHeader.html('检查项目');
                        $checkTable.bootstrapTable("destroy");
                        break;
                    case "cureProject":
                        this.treatmentModel.geCureProject({table: 'admin.erp_dgns_treat_item'});
                        $panelHeader.html("保存诊疗项目");
                        $treatmentHeader.html('诊疗项目');
                        $checkTable.bootstrapTable("destroy");
                        break;
                    case "inspect":
                        this.treatmentModel.geCureProject({table: 'admin.erp_inspection_item'});
                        $panelHeader.html("保存检验项目");
                        $treatmentHeader.html('检验项目');
                        $checkTable.bootstrapTable("destroy");
                        break;
                }
                $table.bootstrapTable({
                    columns: columns[curType + "Columns"],
                    data: [],
                    pagination: true,
                    pageSize: 7,
                    onClickRow: function (row) {
                        that.addCheck([row]);
                    }
                });
                $table.bootstrapTable("showLoading");
            },
            addCheck: function (rows) {
                var that = this;
                var recipe_type = $(this.el).find("#treatment_category").val();
                switch (recipe_type) {
                    //检查
                    case "check":
                        that.addTable(checkColumns.checkColumns, "check_name", rows);
                        break;
                    //诊疗
                    case "cureProject":
                        that.addTable(checkColumns.cureProjectColumns, "dgns_treat_name", rows);
                        break;
                    //检验
                    case "inspect":
                        that.addTable(checkColumns.inspectColumns, "inspection_name", rows);
                        break;
                }
            },
            //加入药物,当药物ID相同时,就加数目,不同时就添加新的行
            addTable: function (columnes, type, rows) {
                $(".check_panel").removeClass("hid");
                var $table = $(this.el).find("#check_table");
                $table.bootstrapTable({
                    columns: columnes,
                    showFooter: true,
                    dataField: "",
                });
                var check = rows;
                var foreData = $table.bootstrapTable("getData");
                for (var i = 0; i < check.length; i++) {
                    var row = check[i], isNew = true;

                    //复制对象,防止引用传递相互影响,bootstrapTable数据源赋值时,是对象的引用传递.
                    var data = $.extend(true, {}, row);
                    for (var j = 0; j < foreData.length; j++) {
                        var fData = foreData[j];
                        if (fData[type] == row[type]) {
                            isNew = false;
                            continue;
                        }
                    }
                    if (isNew) {
                        foreData.push(data);
                    }
                }
                $table.bootstrapTable("load", foreData);
            },

            saveCheckTable: function (e) {
                var type = $(this.el).find('#treatment_category').val();
                //var tableId = $(e.target).parent().find("table.table-condensed").attr("id");
                var data = $("#check_table").bootstrapTable("getData");
                var costs = 0;
                data.map(function (value) {
                    value.patient_id = $("span.pat_id").text();
                    value.patient_name = $("span.pat_name").eq(0).text();
                    value.patient_sex = $("span.pat_sex").text();
                    value.patient_birth = $("span.pat_birth").text();
                    value.marriage = $("span.pat_marriage").text();
                    //检验
                    if (type == "inspect") {
                        costs += value.check_price;
                        delete value[""];
                        delete value["id"];
                        delete value["update_date_time"];
                        value.total_costs = value.inspection_price;
                        value.hospital_id = sessionStorage.getItem("enterprise_id");
                        value.item_id = value.record_id;
                        value.item_name = value.inspection_name;
                        //诊疗
                    } else if (type == "cureProject") {
                        costs += parseFloat(value.dgns_treat_price*value.billing_item_num).toFixed(2);
                        delete value[""];
                        delete value["id"];
                        delete value["update_date_time"];
                        value.total_costs = value.dgns_treat_price;
                        value.item_name = value.dgns_treat_name;
                        value.item_id = value.record_id;
                        value.billing_item_num = value.billing_item_num;
                        value.treatment_hosp_id = sessionStorage.getItem("enterprise_id");
                        value.treatment_hosp_name = sessionStorage.getItem("enterprise_name");
                        //检查
                    } else if (type == "check") {
                        costs += value.check_price;
                        delete value[""];
                        delete value["id"];
                        delete value["update_date_time"];
                        value.item_id = value.record_id;
                        value.item_name = value.check_name;
                        value.total_costs = value.check_price;
                    }
                });

                if ($("span.pat_id").text() != "" && data != []) {
                    var info = {
                        hop_id: sessionStorage.getItem("enterprise_id"),
                        hop_name: sessionStorage.getItem("enterprise_name"),
                        register_id: $("input.register_id").val(),
                        patient_id: $("span.pat_id").text(),
                        patient_name: $("span.pat_name").eq(0).text(),
                        patient_sex: $("span.pat_sex").text(),
                        patient_birth: $("span.pat_birth").text(),
                        marriage: $("span.pat_marriage").text(),
                        doctor: sessionStorage.getItem("doctor_id"),
                        doctor_name: sessionStorage.getItem("doctor_name"),
                        department_id: sessionStorage.getItem("department_id"),
                        department_name: sessionStorage.getItem("department_name"),
                        //TODO:总费用还未获取
                        total_costs: parseFloat(costs)
                    };
                    this.treatmentModel.saveCheck(info, data, type);
                } else {
                    alert("请先选择患者!");
                }
            },
            resetCheckTable: function (e) {
                $("#check_table").bootstrapTable("removeAll");
            },
            treatReasult: function (result) {
                if (result.errorNo == 0) {
                    $(this.el).find("#check_table").bootstrapTable("load", []);
                    alert("保存检查单成功");
                }
            },
            renderWmedicine: function (res) {
                var $table = $(this.el).find("#w_medicine_table");
                $table.bootstrapTable("hideLoading");
                if (res.errorNo === 0) {
                    $table.bootstrapTable("load", res.data);
                    //console.log(result.data);
                    $(this.el).find(".am-alert").hide();
                }
                else {
                    $table.bootstrapTable("load", []);
                }
            },
            renderCmedicine: function (res) {
                var $table = $(this.el).find("#c_medicine_table");
                $table.bootstrapTable("hideLoading");
                if (res.errorNo === 0) {
                    $table.bootstrapTable("load", res.data);
                    //console.log(result.data);
                    $(this.el).find(".am-alert").hide();
                }
                else {
                    $table.bootstrapTable("load", []);
                }
            },
            renderData: function (result) {
                var $table = $(this.el).find("#treatment_table");
                $table.bootstrapTable("hideLoading");
                if (result.errorNo === 0) {
                    $table.bootstrapTable("load", result.data);
                    //console.log(result.data);
                    $(this.el).find(".am-alert").hide();
                }
                else {
                    $table.bootstrapTable("load", []);
                }
            },
            render: function () {
                this.$el.html(treatments);
                var that = this;
                //药物常用分类
                this.$el.find("select").chosen({
                    placeholder_text_single: "选择常用药物分类",
                    width: "100%",
                    disable_search_threshold: 10
                });
                subcategory.cmedicineSubcategory.forEach(function (cates) {
                    jctLibs.appendToChosen(that.$el.find("#c_medicine_category"), cates.val, cates.text);
                });
                subcategory.wmedicineSubcategory.forEach(function (cates) {
                    jctLibs.appendToChosen(that.$el.find("#w_medicine_category"), cates.val, cates.text);
                });
                var $wtable = $(this.el).find("#w_medicine_table"),
                    $ctable = $(this.el).find("#c_medicine_table");

                //工作站医生未选择医院时
                var medicineTableOption = function (type) {
                    return {
                        columns: medicineColumn,
                        sidePagination: 'jethis',
                        pageSize: 7,
                        formatShowingRows: function () {
                        },
                        formatRecordsPerPage: function () {
                        },
                        data: [],
                        onPageChange: function (number, size) {
                            var searchWords = (type == 10?that.$el.find('#c_medicine_input'):that.$el.find('#w_medicine_input')).val().trim();
                            that.treatmentModel.getMedicines(type, number, 'getWmedicine',searchWords);
                        },
                        onClickRow: function (row) {
                            row.medicine_type = type == 10 ? 'cmedicine' : 'wmedicine';
                            that.trigger("addTreatments", [row]);
                            that.treatmentModel.getDetail({drug_name:row['goods_name']})
                        }
                    }
                }
                $wtable.bootstrapTable(medicineTableOption(20));
                $ctable.bootstrapTable(medicineTableOption(10));
                this.treatmentModel.getMedicines('20', 1, 'getWmedicine');
                this.treatmentModel.getMedicines('10', 1, 'getCmedicine');
                this.$el.find('#treatment_table').bootstrapTable({
                    columns: columns["checkColumns"],
                    data: [],
                    pagination: true,
                    pageSize: 7,
                    onClickRow: function (row) {
                        that.addCheck([row]);
                    }
                });
                this.$el.find('.add_treatment_title').html("保存检查项目");
                this.$el.find('.treatment_table_title').html('检查项目')
                this.treatmentModel.geCureProject({table: 'admin.erp_check_item'});
                $wtable.bootstrapTable("showLoading");
                $ctable.bootstrapTable("showLoading");
                this.$el.find('#treatment_table').bootstrapTable("showLoading");
                return this;
            },
            searchWmedicine: function () {
                var searchWords = $('#w_medicine_input').val().trim();
                this.treatmentModel.getMedicines('20', 1, 'getWmedicine', searchWords);
            },
            searchWmed: function (e) {
                if(e.keyCode == "13"){
                    this.searchWmedicine();
                }
            },
            searchCmedicine: function () {
                var searchWords = $('#c_medicine_input').val().trim();
                this.treatmentModel.getMedicines('10', 1, 'getCmedicine', searchWords);
            },
            searchCmed: function (e) {
                if(e.keyCode == "13"){
                    this.searchCmedicine();
                }
            },
            searchTreatment: function () {
                var searchWords = $('#treatment_input').val().trim();
                var curType = $('#treatment_category').val();
                switch (curType) {
                    case "check":
                        this.commonModel.search('admin.erp_check_item', searchWords?{'check_name': searchWords}:{}, 'treatmentGetted');
                        break;
                    case "cureProject":
                        this.commonModel.search('admin.erp_dgns_treat_item', searchWords?{'dgns_treat_name': searchWords}:{}, 'treatmentGetted');
                        break;
                    case "inspect":
                        this.commonModel.search('admin.erp_inspection_item', searchWords?{'inspection_name': searchWords}:{}, 'treatmentGetted');
                        break;
                }
            },
            searchTmed: function (e) {
                if(e.keyCode == "13"){
                    this.searchTreatment();
                }
            },
        });
        return treatmentView;
    });