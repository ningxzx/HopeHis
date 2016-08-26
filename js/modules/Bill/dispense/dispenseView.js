define(['txt!../../Bill/dispense/dispense.html',
        '../../Bill/dispense/dispenseModel',
        '../../Common/commonModel',
        'handlebars', 'jquery', 'backbone', 'jctLibs', 'bootstrapTable'],
    function (Template, dspModel, commonModel, Handlebars, $, backbone, jctLibs) {
        var formatGender = function (value, row, index) {
            return {'M': '男', 'F': "女", "N": "不详"}[value]
        };
        var columns = [
            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: 'item_name', title: '药品名称'},
            {field: 'item_sell_num', title: '处方数量', width: "15%"},
            {field: 'billing_item_num', title: '实际销售数量', width: "15%"},
            {field: 'packing_spec', title: '规格'},
            {field: 'unit', title: '单位'},
            {field: 'unit_price', title: '单价(元）'},
            {field: 'total_charges', title: '总价'},
        ];
        var patColumn = [
            {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
            {field: 'patient_name', title: '患者姓名'},
            {field: 'card_id', title: '身份证号'},
            {field: 'patient_sex', title: '性别', width: "5%", formatter: formatGender}
        ];
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new dspModel();
                this.commonModel = new commonModel();
                this.listenTo(this.model, "getDrug", this.renderData);
                this.listenTo(this.model, "dispenseCallback", this.answerCallBack);
                this.listenTo(this.commonModel, "getPatsBypatient_name", this.renderNamePats);
            },
            events: {
                'click #searchOrderNo': 'searchOrderNo',
                'click #searchName': 'searchPatName',
                'click #submit_record': 'submitDrugs',
                'click #clear_record':'clearView',
                "keydown #patient_name":"patientName",
                "keydown #order_no":"orderNo"
            },
            orderNo:function(e){
                if(e.keyCode==13){
                    this.searchOrderNo(e);
                }
            },
            patientName:function(e){
                if(e.keyCode==13){
                    $(this.el).find('.name_search_wrapper').addClass('hid');
                    this.searchPatName(e);
                }
                //return false;
            },
            render: function () {
                var _this = this;
                $(this.el).html(Template);
                this.$el.find("#medicine_table").bootstrapTable({
                    search: true,
                    columns: columns,
                    data: []
                });
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find('#name_search_table').bootstrapTable({
                    columns: patColumn, data: [], onClickRow: function (row, $element) {
                        _this.clearView();
                        var $pat = $('#patient_name');
                        $pat.val(row['patient_name']);
                        $('#select_gender').val(row['patient_sex']).trigger('chosen:updated');
                        $('#card_id').val(row['card_id']);
                        $('#pat_age').val(row['patient_birth']);
                        $element.closest('.pat_table_wrapper').addClass('hid');
                        _this.model.dispenseDrug({patient_id:row['patient_id']})
                    }
                });
                $(this.el).find('#current_date').val(jctLibs.dataGet.currentDate());
                return this;
            },
            searchPatName: function (e) {
                var $searchInput = $(e.target).closest('.am-input-group').find('input'),
                    searchValue = $searchInput.val(),
                    searchKey = $searchInput.attr('id');
                if (searchValue == '' || searchValue == null) {
                    return;
                }
                var param = {};
                param[searchKey] = searchValue;
                this.commonModel.searchPatMember(param, 'getPatsBy' + searchKey,1)
            },
            searchOrderNo: function (e) {
                var $searchInput = $(e.currentTarget).closest('.am-input-group').find('input'),
                    searchValue = $searchInput.val();
                if (searchValue == '' || searchValue == null) {
                    return;
                }
                this.model.dispenseDrug({order_no:searchValue}, 'getData')
                this.clearView();
            },
            renderNamePats: function (res) {
                var rows=res.rows;
                if(rows.length==1){
                    var data=rows[0];
                    this.clearView();
                    var $pat = $('#patient_name');
                    $pat.val(data['patient_name']);
                    $('#select_gender').val(data['patient_sex']).trigger('chosen:updated');
                    $('#card_id').val(data['card_id']);
                    $('#pat_age').val(data['patient_birth']);
                    this.model.dispenseDrug({patient_id:data['patient_id']});
                }else if (rows !== []&&rows.length>1) {
                    $(this.el).find('.pat_table_wrapper').addClass('hid')
                    var $nameTable = $(this.el).find('#name_search_table')
                    $nameTable.bootstrapTable('load', res.rows);
                    $(this.el).find('.name_search_wrapper').removeClass('hid');
                }
            },
            renderData: function (res) {
                if (res.rows.length > 0) {
                    var expData = res.rows[0];
                    $('#patient_name').val(expData['patient_name']);
                    $('#order_no').val(expData['order_no']);
                    $('#pat_age').val(expData['patient_birth']);
                    $('#card_id').val(expData['card_id']);
                    $('#select_gender').val(expData['patient_sex']);
                    $('#bill_name').val(expData['user_name']);
                    $('#bill_date').val(expData['charge_date_time']);
                    $('#sum_charge').val(expData['total_charges']);
                    $('#billing_record_id').val(expData['billing_record_id']);
                    this.$el.find("#medicine_table").bootstrapTable('load', res.rows || [])
                }
                else{
                    this.$el.find("#medicine_table").bootstrapTable('removeAll');
                    alert('非常抱歉！没有找到相应的收费信息！')
                }
            },
            submitDrugs: function () {
                var rows = this.$el.find("#medicine_table").bootstrapTable('getData');
                var param={};
                param.billing_record_id=$('#billing_record_id').val();
                param.detail=rows;
                this.model.dispense(param);
            },
            clearView: function () {
                $(this.el).find('input').val('');
                this.$el.find("#medicine_table").bootstrapTable('removeAll');
            },
            answerCallBack: function (res) {
                if(res.result=='OK'){
                    alert('发药成功！！')
                    this.clearView();
                }
            }
        });
        return view;
    });
