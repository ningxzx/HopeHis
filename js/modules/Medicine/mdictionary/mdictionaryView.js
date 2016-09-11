define(['txt!../../Medicine/mdictionary/mdictionary.html',
        'txt!../../Medicine/mdictionary/xinzengjia.html',
        '../../Medicine/mdictionary/mdictionaryModel',
        '../../Medicine/minStorage/inStorageModel',
        '../../Common/basicTable', 'bootstrapTable',
        "jquery", 'handlebars', 'backbone', "jctLibs"],
    function (Template, Zengjia, DictModel, inStorageModel, basicTable, bootstrapTable, $, Handlebars, backbone, jctLibs) {
        var columnNames = [
            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: "drug_code", title: "药物编码"},
            {field: "chinese_name", title: "药品名称"},
            {field: "drug_input_code", title: "药品拼音码"},
            {field: "drug_spec", title: "药品规格"},
            {field: "dosage_form", title: "剂型"},
            {field: "drug_type", title: "类别",sortable:true},
            {field: "drug_spec", title: "规格"},
            {field: "producter", title: "生产商"},
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new DictModel();
                this.inModel = new inStorageModel();
                this.listenTo(this.inModel, "getMedicine1", this.searchResult);
                this.listenTo(this.model, "getDetail", this.renderDetail);
                this.listenTo(this.model, "addDrug", this.addDrugCallback);
                this.listenTo(this.model, "searchOwnDrug", this.renderOwnDrug);
                this.listenTo(this.model, "editOwnDrug", this.editCallback);
            },
            addDrugCallback: function (res) {
                if (res.resultCode == '100') {
                    $('.Return_medicine').trigger('click');
                }
            },
            events: {
                "click #search_med": "searchBasicDrug",
                "click #search_own": "searchOwnDrug",
                "click #add_med": "gotoUrl",
                "click .Return_medicine": "returnM",
                "click #save_zy": "addDrug",
                "keyup #med_name": 'keySearchBasicDrug',
                "keyup #own_drug_name": 'keySearchOwnDrug',
                "click #refresh_basic_drug":"searchBasicDrug",
                "click #refresh_own_drug":"searchOwnDrug",
                "click #send_btn":"editOwnDrug",
            },
            keySearchBasicDrug:function (e) {
                if(e.keyCode==13){
                    this.searchBasicDrug()
                }
            },
            searchBasicDrug:function () {
                var drug_name=$("#med_name").val().trim();
                this.inModel.searchMedicine1(1,8,drug_name);
            },
            keySearchOwnDrug:function (e) {
                if(e.keyCode==13){
                    this.searchOwnDrug()
                }
            },
            searchOwnDrug:function () {
                var drug_name=$("#own_drug_name").val().trim(),data={};
                if(drug_name!==""){
                    data['drug_name']=drug_name;
                }
                this.model.searchOwnDrug(data);
            },
            //增加自制药品
            addDrug: function () {
                var drug_name = $("#zy_name").val().trim(),
                    drug_parts = $("#zy_parts").val().trim(),
                    drug_type = $("#type_select").val(),
                    dosage_form = $("#dosage_form_select").val(),
                    drug_spec = $("#zy_spec").val(),
                    drug_unit = $("#drug_unit_select").val(),
                    min_packing_unit = $("#drug_min_unit_select").val(),
                    memo = $("#zy_memo").val().trim();
                if(drug_name==''){
                    $('#error_tips').text('请输入药品名称!!!')
                    return false;
                }
                $('#error_tips').text('');
                var data={
                    drug_name:drug_name,
                    drug_parts:drug_parts,
                    dosage_form:dosage_form,
                    drug_spec:drug_spec,
                    drug_type:drug_type,
                    drug_unit:drug_unit,
                    min_packing_unit:min_packing_unit,
                    memo:memo,
                }
               this.model.addDrug(data);
            },
            editOwnDrug:function () {
                var drug_name = $("#edit_drug_name").val().trim(),
                    drug_parts = $("#edit_drug_parts").val().trim(),
                    drug_type = $("#edit_type_select").val(),
                    dosage_form = $("#edit_dosage_form_select").val(),
                    drug_spec = $("#edit_drug_spec").val(),
                    drug_unit = $("#edit_drug_unit_select").val(),
                    min_packing_unit = $("#edit_drug_min_unit_select").val(),
                    memo = $("#edit_drug_memo").val().trim();
                if(drug_name==''){
                    $('#edit_error_tips').text('请输入药品名称!!!')
                    return false;
                }
                $('#edit_error_tips').text('');
                var data={
                    drug_name:drug_name,
                    drug_parts:drug_parts,
                    dosage_form:dosage_form,
                    drug_spec:drug_spec,
                    drug_type:drug_type,
                    drug_unit:drug_unit,
                    min_packing_unit:min_packing_unit,
                    memo:memo,
                }
                var drug_id= $('#edit_own_drug').attr('drug_id')
                this.model.editOwnDrug(drug_id,data);
            },
            editCallback:function (res) {
                if(res.resultCode==100){
                    $('#edit_own_drug').modal('close');
                    $('#edit_error_tips').text('');
                    this.model.searchOwnDrug();
                }
                else{
                    $('#edit_error_tips').text('编辑药物出错!');
                }
            },
            //查询数据返回结果
            searchResult: function (res) {
                var data = res.data;
                if (res.errorNo == 0) {
                    $(this.el).find('#table_mdictionary').bootstrapTable('load', data)
                }
                else {
                    $('#med_name').val("")
                }
            },
            gotoUrl: function () {
                $(this.el).html(Zengjia);
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("input:radio").uCheck("enable");
            },
            renderOwnDrug:function(res){
                if(res.errorNo==0){
                    $(this.el).find("#own_medicine_table").bootstrapTable('load',res.rows);
                }
                else{
                    $(this.el).find("#own_medicine_table").bootstrapTable('load',[]);
                }
            },
            returnM: function () {
                this.render();
                $('#drug_dictionary_tabs').tabs("open", 1);
            },
            render: function () {
                var _this = this;
                //传入四个参数，第一个是目标table元素，第二个是标题及字段的数组，第三个是数据源，第四个为是否需要编辑true/false
                $(this.el).html(Template);
                $(this.el).find("#table_mdictionary").bootstrapTable({
                    columns: columnNames,
                    pageSize: 8,
                    pageList: [5, 8, 10],
                    pagination: true,
                    sidePagination: 'jethis',
                    onPageChange: function (number, size) {
                        var medName = $("#med_name").val();
                        _this.inModel.searchMedicine1(number, size, medName);
                    },
                    onClickRow: function (row) {
                        _this.model.getDetail({drug_name: row['chinese_name']})
                    }
                });
                $(this.el).find("#own_medicine_table").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        // {field: "drug_id", title: "药物编码"},
                        {field: "drug_name", title: "药品名称",width:'15%'},
                        {field: "drug_input_code", title: "药品拼音码"},
                        {field: "drug_spec", title: "药品规格"},
                        {field: "dosage_form", title: "剂型"},
                        {field: "drug_type", title: "类别"},
                        {field: "drug_unit", title: "单位"},
                        {field: "min_packing_unit", title: "最小单位"},
                        {field: "drug_parts", title: "药品成分",width:'20%'},
                        {field: "memo", title: "备注"},
                        {field: "edit", title: "操作",formatter:jctLibs.editFormatter,events:{
                            "click .row_edit":function (e,value, row, index) {
                                $('#edit_drug_name').val(row['drug_name']);
                                $('#edit_drug_parts').val(row['drug_parts']);
                                $('#edit_drug_memo').val(row['memo']);
                                $('#edit_drug_spec').val(row['drug_spec']);
                                $('#edit_type_select').val(row['drug_type']).trigger('chosen:updated');
                                $('#edit_dosage_form_select').val(row['dosage_form']).trigger('chosen:updated');
                                $('#edit_drug_unit_select').val(row['drug_unit']).trigger('chosen:updated');
                                $('#edit_drug_min_unit_select').val(row['min_packing_unit']).trigger('chosen:updated');
                                $('#edit_own_drug').attr('drug_id',row['drug_id']).modal({
                                    width:960,
                                    closeViaDimmer:false,
                                })
                            }
                        }},
                    ],
                    pageSize: 8,
                    pageList: [5, 8, 10],
                    pagination: true,
                });
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("input:radio").uCheck("enable");
                this.inModel.searchMedicine1(1, 8);
                this.model.searchOwnDrug();
                return this;
            }
            ,
            renderDetail: function (res) {
                if (res.errorNo == 0) {
                    if (res.rows.length > 0) {
                        $('.detail_panel').removeClass('am-hide');
                        var medicine = res.rows[0];
                        $('#drug_name').val(medicine.drug_name);
                        $('#approval_no').val(medicine.approval_no);
                        $('#instruction').val(medicine.drug_instructions);
                    }
                    else {
                        $('.detail_panel').removeClass('am-hide');
                        $('#drug_name').val("");
                        $('#approval_no').val("");
                        $('#instruction').val("很抱歉，未找到相应药物的说明书！");
                    }
                }
            }
        });
        return view;
    })
;
