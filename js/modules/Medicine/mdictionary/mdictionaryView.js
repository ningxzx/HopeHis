define(['txt!../../Medicine/mdictionary/mdictionary.html',
        'txt!../../Medicine/mdictionary/xinzengjia.html',
        '../../Medicine/mdictionary/mdictionaryModel',
        '../../Medicine/minStorage/inStorageModel',
        '../../Common/basicTable', 'bootstrapTable',
        "jquery", 'handlebars', 'backbone', "jctLibs"],
    function (Template, Zengjia, DictModel, inStorageModel,basicTable, bootstrapTable, $, Handlebars, backbone, jctLibs) {
        var columnNames = [
            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: "drug_code", title: "药物编码"},
            {field: "chinese_name", title: "药品名称"},
            {field: "drug_input_code", title: "药品拼音码"},
            {field: "drug_spec", title: "药品规格"},
            {field: "dosage_form", title: "剂型"},
            {field: "drug_spec", title: "规格"},
            {field: "producter", title: "生产商"},
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new DictModel();
                this.inModel = new inStorageModel();
                this.listenTo(this.inModel, "getMedicine1", this.searchResult);
                this.listenTo(this.model, "getDetail", this.renderDetail);
                this.listenTo(this.model, "SaveZY", this.asaveZY);
            },
            asaveZY:function(data){
                var arr=data.rows;
                //debugger;
                if(arr.state=='101'){
                    alert("提交成功");
                }
            },
            events: {
                "click #search_med": "searchMed",
                "click #add_med": "gotoUrl",
                "click .Return_medicine": "returnM",
                "click #save_zy": "saveZY",
                "keyup #med_name":'searchMed'
            },
            //查询数据
            searchMed: function () {
                var medName = $("#med_name").val();
                var drugType = $("#drug_type_select").val();
                this.inModel.searchMedicine1(1,8,medName);
                //TODO:还未筛选输入数据
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
            //
            gotoUrl: function () {
                $(this.el).html(Zengjia);
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("input:radio").uCheck("enable");
            },
            returnM: function () {
                this.render();
            },
            //保存中药
            saveZY: function () {
                var data = {};
                data.drugName = $("#zy_name").val();
                data.enterpriseId = sessionStorage.getItem("enterprise_id");
                data.addAccountId = sessionStorage.getItem("user");
                data.drugParts = $("#zy_parts").val();
                data.memo = $("#zy_memo").val();
                data.drugStatus = $("input:radio[name='zy_state']:checked").val();
                data.drugSpec = $("#zy_spec").val();
                data.drugUnit = $("#zy_unit").val();
                this.model.SaveZY(data);
            },

            render: function () {
                var _this=this;
                //传入四个参数，第一个是目标table元素，第二个是标题及字段的数组，第三个是数据源，第四个为是否需要编辑true/false
                $(this.el).html(Template);
                $(this.el).find("#table_mdictionary").bootstrapTable({
                    columns: columnNames,
                    data: [],
                    pageSize: 8,
                    pageList: [5,8,10],
                    pagination: true,
                    sidePagination: 'jethis',
                    onPageChange: function (number, size) {
                        var medName = $("#med_name").val();
                        _this.inModel.searchMedicine1(number, size,medName);
                    },
                    onClickRow: function (row) {
                        _this.model.getDetail({drug_name:row['chinese_name']})
                    }
                });
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("input:radio").uCheck("enable");
                this.$el.find("#xzx2").bootstrapTable({
                    data: {},

                });
                this.$el.find('#Drugs_add').bootstrapTable({
                    data: {}
                });
                this.inModel.searchMedicine1(1,8);
                return this;
            },
            renderDetail: function (res) {
                if(res.errorNo==0) {
                    if (res.rows.length>0) {
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
    });
