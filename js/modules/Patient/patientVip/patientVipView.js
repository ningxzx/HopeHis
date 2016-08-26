define(['txt!../../Patient/patientVip/patientVip.html',
        '../../Common/vipRecordModel',
        '../../Common/vipRecordCollection',
        '../../Common/patientModel',
        'handlebars','backbone','bootstrapTable'],
    function (Template,vipRecordModel,patientModel,vipRecordCollection,Handlebars,backbone){
        var view = Backbone.View.extend({
            initialize: function () {
                this.vipRecordModel = new vipRecordModel();
                this.patientModel = new patientModel();
                //this.vipRecordCollection = new vipRecordCollection();

                this.listenTo(this.vipRecordModel, "VipResult", this.vipResult);
                this.listenTo(this.patientModel, "getAllPatient", this.patientResult);
                this.listenTo(this.vipRecordModel, "addVipResult", this.addResult);
                this.listenTo(this.vipRecordModel, "removeVipResult", this.removeResult);
            },
            render:function() {
                $(this.el).html(Template);
                $(this.el).find("#vip_tbl").bootstrapTable({
                    columns: [
                        {
                            field: "checkBtn",
                            title: "",
                            checkbox: true
                        },
                        {
                            field: "opt",
                            title: "操作",
                            align: 'center',
                            events: this.removeEvents,
                            formatter: this.removeFormatter
                        },
                        {field: "patient_id", title: "患者ID",align: 'center'},
                        {field: "patient_name", title: " 患者姓名",align: 'center'},
                        {field: "patient_sex", title: "性别",align: 'center'},
                        {field: "patient_birth", title: "出生日期",align: 'center'},
                        {field: "marry_state", title: "婚姻状况",align: 'center'},
                        {field: "card_id", title: "身份证号",align: 'center'},
                        {field: "nationality", title: "国籍",align: 'center'},
                        {field: "patient_phone", title: "联系电话",align: 'center'}
                    ],
                    data: [{
                        patient_id:"1",
                        patient_name:"1",
                        patient_sex:"1",
                        patient_birth:"1",
                        marry_state:"1",
                        card_id:"1",
                        nationality:"1",
                        patient_phone:"1"
                    }]
                });
                $(this.el).find("#pat_tbl").bootstrapTable({
                    columns: [
                        {
                            field: "opt",
                            title: "操作",
                            align: 'center',
                            events: this.addEvents,
                            formatter: this.addFormatter
                        },
                        {align: 'center',field: "patient_id", title: "患者ID"},
                        {align: 'center',field: "patient_name", title: " 患者姓名"},
                        {align: 'center',field: "patient_sex", title: "性别"},
                        {align: 'center',field: "patient_birth", title: "出生日期"},
                        {align: 'center',field: "marry_state", title: "婚姻状况"},
                        {align: 'center',field: "card_id", title: "身份证号"},
                        {align: 'center',field: "nationality", title: "国籍"},
                        {align: 'center',field: "patient_phone", title: "联系电话"}
                    ],
                    data: [{
                        patient_id:"2",
                        patient_name:"1",
                        patient_sex:"1",
                        patient_birth:"1",
                        marry_state:"1",
                        card_id:"1",
                        nationality:"1",
                        patient_phone:"1"
                    },{
                        patient_id:"3",
                        patient_name:"1",
                        patient_sex:"1",
                        patient_birth:"1",
                        marry_state:"1",
                        card_id:"1",
                        nationality:"1",
                        patient_phone:"1"
                    },{
                        patient_id:"4",
                        patient_name:"1",
                        patient_sex:"1",
                        patient_birth:"1",
                        marry_state:"1",
                        card_id:"1",
                        nationality:"1",
                        patient_phone:"1"
                    }]
                });

                this.vipRecordModel.getAllVip("ERP10001");
                //TODO:获取全部患者出现问题
                //this.patientModel.allPatient("ERP10001", "科室代码");
                return this;
            },

            events:{
                "click #vip_add": "addVips",
                "click #vip_delete": "removeVip"
            },

            //生成增加按钮
            addFormatter: function (value, row, index) {
                return [
                    '<a class="table_add" href="javascript:void(0)" title="Add">',
                    '添加',
                    '</a>'
                ].join('');
            },
            //生成增加事件
            addEvents: {
                'click .table_add': function (e, value, row, index) {
                    var allData = $("#vip_tbl").bootstrapTable('getData');
                    if(allData[0].patient_id == row.patient_id){
                        $("#tips").removeClass("hid").find("p").text("已存在，请添加其他患者");
                        return;
                    }
                    $("#VipNo").modal({
                        onConfirm: function(e) {
                            var vrm = new vipRecordModel();
                            vrm.addVip("ERP10001", row, e.data);
                        }
                    });
                }
            },
            //生成删除按钮
            removeFormatter: function (value, row, index) {
                return [
                    '<a class="table_remove" href="javascript:void(0)" title="Remove">',
                    '<i class="am-icon-remove row_remove"></i>',
                    '<span class="row_remove">删除</span>',
                    '</a>'
                ].join('');
            },
            //生成删除事件
            removeEvents: {
                'click .table_remove': 'removeVip'
            },

            //显示所有VIP患者
            vipResult: function (result) {
                console.log(result.resData);
                if(result.errorNo == 0){
                    $(this.el).find("#vip_tbl").bootstrapTable({data:result.resData});
                }
            },

            //显示所有患者
            patientResult: function (result) {
                if(result.errorNo == 0){
                    $(this.el).find("#pat_tbl").bootstrapTable({data:result.resData});
                }
            },

            //增加成功返回
            addResult: function (result) {
                if(result.errorNo == 0){
                    $("#vip_tbl").bootstrapTable('append', result.resData);
                }else if(result.errorNo == -1){
                    $("#tips").removeClass("hid").find("p").text(result.errorInfo);
                }else if(result.error == -2){
                    $("#tips").removeClass("hid").find("p").text(result.errorInfo);
                }
            },

            //批量删除
            removeVip: function () {
                var rows = $("#vip_tbl").bootstrapTable('getAllSelections');
                if(rows.length!=0) {
                    this.vipRecordModel.removeVips("ERP10001", rows);
                }
            },

            //批量删除成功返回
            removeResult: function (result) {
                if(result.errorNo == 0){
                    for(var i = 0; i<result.resData.length;i++){
                        $("#vip_tbl").bootstrapTable('remove', {field: 'patient_id', values: result.resData[i].patient_id});
                    }
                }else if(result.errorNo == -1){
                    $("#tips").removeClass("hid").find("p").text(result.errorInfo);
                }else if(result.error == -2){
                    $("#tips").removeClass("hid").find("p").text(result.errorInfo);
                }
            }
        });

        return view;
    });
