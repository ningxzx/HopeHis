define(['txt!../../Regist/searchRegister/searchRegister.html',
        '../../Regist/searchRegister/searchRegModel',
        'jctLibs', 'bootstrapTable', 'handlebars', 'backbone', 'amazeui', 'chosen'],
    function (Template, srModel, jctLibs, bootstrapTable, Handlebars, backbone) {
        //判断是否已经就诊
        function stateFunc(value) {
            return {
                0: '已就诊',
                1: '挂单',
                2: '现诊',
                3: '未就诊',
                4: '未收费'
            }[value];
        }

        var showBill = function (value, row) {
            if (row['state'] == 3) {
                return '<a class="print_reg" href="javascript:void(0)" title="打印">打印</a>'
            }
            else if (row['state'] == 4) {
                return '<a class="charge_reg" href="javascript:void(0)" title="收费">收费</a>'
            }
            else {
                return '';
            }
        }
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new srModel();
                this.listenTo(this.model, 'getRegInfo', this.renderResult);
                this.listenTo(this.model, 'chargeReg', this.chargeCallBack);
            },

            render: function () {
                var that = this;
                $(this.el).html(Template);
                $(this.el).find("select").chosen({
                    width: "20rem",
                    no_results_text: '没有找到匹配的项！',
                    disable_search_threshold: 10
                });

                $(this.el).find("#regist_tbl").bootstrapTable({
                    columns: [
                        {field: 'register_no', title: '挂号编号', width: '20%'},
                        {field: 'register_fee', title: '挂号费'},
                        {field: 'department_name', title: '科室'},
                        {field: 'doctor_name', title: '医生姓名'},
                        {field: 'patient_name', title: '患者姓名'},
                        {field: 'patient_register_time', title: '挂号时间', width: '20%'},
                        {field: 'user_name', title: '操作员'},
                        {field: 'state', title: '挂号状态', formatter: stateFunc},
                        {
                            field: 'operation', title: '操作', formatter: showBill, events: {
                            "click .charge_reg": function (e, value, row) {
                                var $modal = $("#confirmFee");
                                $modal.attr('pat_id', row['patient_id']);
                                $modal.attr('reg_no', row['register_no']);
                                $modal.attr('reg_fee', row['register_fee']);
                                var user_name = sessionStorage.getItem('user_name')
                                gender = {M: '男', N: '不详', F: '女'}[row['patient_sex']];
                                $('#cost').html(row['register_fee']);
                                $("#money").val('');
                                $('#change').html('');
                                $("#printArea").html("<ul class=\"am-list am-list-static am-list-striped\">" +
                                    "<li>姓名：" + row['patient_name'] + "</li>" +
                                    "<li>身份证号：" + row['card_id'] + "</li>" +
                                    "<li>性别：" + gender + "</li>" +
                                    "<li>挂号科室：" + row['department_name'] + "</li>" +
                                    "<li>医生：" + row['doctor_name'] + "</li>" +
                                    "<li>挂号员：" + user_name + "</li>" +
                                    "<li>挂号费：" + row['register_fee'] + "元</li>" +
                                    "</ul>")
                                $modal.modal();
                            },
                            'click .print_reg': function (e, value, row) {
                                var user_name = row['user_name'],
                                gender = {M: '男', N: '不详', F: '女'}[row['patient_sex']];
                                $("#printArea").html("<ul class=\"am-list am-list-static am-list-striped\">" +
                                    "<li>姓名：" + row['patient_name'] + "</li>" +
                                    "<li>身份证号：" + row['card_id'] + "</li>" +
                                    "<li>性别：" + gender + "</li>" +
                                    "<li>挂号科室：" + row['department_name'] + "</li>" +
                                    "<li>医生：" + row['doctor_name'] + "</li>" +
                                    "<li>挂号员：" + user_name + "</li>" +
                                    "<li>挂号费：" + row['register_fee'] + "元</li>" +
                                    "</ul>")
                                $("#printArea").printThis({
                                    importCSS: false
                                });
                            }
                        }
                        }
                    ],
                    pageSize: 7,
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
                        } else {
                            return {
                                css: {"color": "black"}
                            }
                        }
                    },
                });
                this.model.getRegInfo();
                return this;
            },
            events: {
                "click #refresh_info": "searchReg",      //刷新按钮
                "click #search_reg": "searchReg",         //查询患者
                "keyup .search_wrapper input": "keuSearchReg",
                "keyup #money": "changeFee",               //输入金额改变找零
                "keydown #money": "moneyKey",//打印
                "click #getFee": "printReg",//打印
            },
            //应找金额
            changeFee: function () {
                var money = $(this.el).find("#money").val();
                var cost = $(this.el).find("#cost").text();
                var fee = parseFloat(money) - parseFloat(cost);
                $(this.el).find("#change").text(fee);
                if (parseFloat(fee) < 0) {
                    $(this.el).find("#fee_tips").text("提示：应找金额不能为负值");
                } else if (money == "") {
                    $(this.el).find("#fee_tips").text("提示：实收金额不能为空值");
                } else if (isNaN(money)) {
                    $(this.el).find("#fee_tips").text("提示:只能输入数字");
                } else {
                    $(this.el).find("#fee_tips").text("");
                }
            },
            //打印
            moneyKey: function (e) {
                if (e.keyCode == 13) {
                    this.printReg();
                }
            },
            printReg: function () {
                var $modal = $("#confirmFee");
                var pat_id = $modal.attr('pat_id');
                var reg_no = $modal.attr('reg_no');
                var reg_fee = $modal.attr('reg_fee');
                var money = $(this.el).find("#money").val();
                var fee = $(this.el).find("#change").text();
                if (parseFloat(fee) < 0 || money == "" || isNaN(money)) {
                    $(this.el).find("#fee_tips").text("金额有误!");
                    return;
                }
                this.model.chargeRecord({
                    "patient_id": pat_id,
                    "register_no": reg_no,
                    "register_fee": reg_fee
                })
            },
            chargeCallBack: function (res) {
                $('#confirmFee').modal('close');
                if (res.errorNo == 0) {
                    $("#printArea").printThis({
                        importCSS: false
                    });
                    this.searchReg();
                }
                else {
                    alert('收费失败,请重试!')
                }
            },
            keuSearchReg: function (e) {
                if (e.keyCode == '13') {
                    this.searchReg();
                }
            },
            renderResult: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find("#regist_tbl").bootstrapTable('load', res.rows);
                }
                else {
                    $(this.el).find("#regist_tbl").bootstrapTable('load', []);
                }
            },
            searchReg: function () {
                var pat_id = $('#pat_id').val().trim(),
                    pat_name = $('#pat_name').val().trim(),
                    doctor = $('#doctor').val().trim(),
                    dept = $('#dept').val().trim(),
                    start = $('#start').val(),
                    end = $('#end').val();
                var param = {};
                if (pat_id !== "") {
                    param['patient_id'] = pat_id
                }
                if (pat_name !== "") {
                    param['patient_name'] = pat_name
                }
                if (doctor !== "") {
                    param['doctor_name'] = doctor
                }
                if (dept !== "") {
                    param['department_name'] = dept
                }
                if (start !== "") {
                    param['startDateTime'] = start
                }
                if (end !== "") {
                    param['endDateTime'] = end
                }
                this.model.getRegInfo(param);
            }

        });

        return view;
    });
