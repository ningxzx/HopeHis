define(['txt!../../Setting/registerFeeSet/registerFeeSet.html',
        '../../Setting/registerFeeSet/registerFeeSetModel',
        '../../Setting/userMange/userModel',
        'jquery', 'jctLibs', 'backbone', 'bootstrapTable'],
    function (Template, registerFeeSetModel, userModel, $, jctLibs, Handlebars, backbone) {
        var formatRegFee = function (value, row) {
            return value ? value : row['standard_register_fee']
        }
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new registerFeeSetModel();
                this.userModel = new userModel();
                this.listenTo(this.userModel, "getDoctors", this.renderDoctors);
                this.listenTo(this.model, "changeSingleFee", this.changeCallback);
                this.listenTo(this.model, "getLevelFee", this.renderLevelFee);
                this.listenTo(this.model, "changeLevel", this.changeLevelCallback);
            },
            render: function () {
                $(this.el).append(Template);
                $(this.el).find("#level_fee_table").bootstrapTable({
                    columns: [
                        {field: 'title_name', title: '医生级别'},
                        {field: 'pt', title: '普通号挂号费'},
                        {field: 'zj', title: '专家号挂号费'}
                    ],
                    data: [],
                });
                $(this.el).find("#doctors_fee_table").bootstrapTable({
                    search: true,
                    columns: [
                        {field: 'doctor_name', title: '医生姓名'},
                        {field: 'department_name', title: '科室'},
                        {field: 'title_name', title: '医生级别'},
                        {field: 'register_fee', title: '普通号挂号费', formatter: formatRegFee},
                        {field: 'account_id', title: '登录账号'},
                        {
                            field: 'operation', title: '操作', formatter: jctLibs.editFormatter, events: {
                            'click .row_edit': function (e, value, row, index) {
                                //弹出修改费用modal
                                var $singleFeeModel = $('#single_fee_modal');
                                $singleFeeModel.attr('accountId', row['account_id'])
                                $('#old_register_fee').val(row['register_fee'] || row['standard_register_fee']);
                                $('#single_fee_modal').modal({
                                    width: 700
                                })
                            }
                        }
                        }],
                    data: [],
                    pageSize:5,
                    pageList:[5,8]
                });
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                this.userModel.getDoctors(2);
                this.model.getLevelfee();
                return this;
            },
            events: {
                "click #save_regfee": "saveFee",
                "click #edit_level_fee": "showEditLevelModal",
                'click #save_single_fee': 'saveSingle',
                'click #save_level_fee': 'saveLevel',
                'click #refresh_doctors': 'refreshDoc',
                "click #refresh_level":"refreshLevel"
            },
            refreshLevel:function(){
                this.model.getLevelfee();
            },
            refreshDoc: function () {
                this.userModel.getDoctors(2);
            },
            //获取所有挂号费
            showEditLevelModal: function () {
                $('#level_fee_modal').modal({
                    width: 700
                })
                this.model.getLevelfee();
            },
            //获取所有医生
            renderDoctors: function (res) {
                //console.log(res)
                if (res.errorNo === 0) {
                    var doctors = res.rows;
                    $(this.el).find("#doctors_fee_table").bootstrapTable('load', doctors)
                }
            },
            //挂号费列表
            renderLevelFee: function (res) {
                if (res.errorNo === 0) {
                    var levelFee = res.rows,levels={},fees=[];
                    levelFee.forEach(function(a) {
                        var title_code= a['title_code'],reg_type=a['register_type'],fee=a['standard_register_fee'];
                        if(!levels[title_code]) {
                            levels[title_code] = {
                                title_name:a['title_name'],
                                title_code:title_code
                            };
                        }
                        levels[title_code][reg_type] = fee;
                    })
                    for(var key in levels){
                        if(levels.hasOwnProperty(key)){
                            fees.push(levels[key])
                        }
                    }
                    $('#20_pt').val(levels['20']['pt']);
                    $('#20_zj').val(levels['20']['zj']);
                    $('#21_pt').val(levels['21']['pt']);
                    $('#21_zj').val(levels['21']['zj']);
                    $('#10_pt').val(levels['10']['pt']);
                    $('#10_zj').val(levels['10']['zj']);
                    $('#30_pt').val(levels['30']['pt']);
                    $('#30_zj').val(levels['30']['zj']);
                    $(this.el).find("#level_fee_table").bootstrapTable('load',fees)
                }
            },
            saveSingle: function () {
                var $singleFeeModel = $('#single_fee_modal');
                var epid = sessionStorage.getItem('enterprise_id'),
                    accoutId = $singleFeeModel.attr('accountId'),
                    singleFee = $('#new_register_fee').val();
                if (singleFee == "" || !accoutId) {
                    alert('缺乏必需的医生！')
                    return
                }
                this.model.changeSingleRegfee(epid, accoutId, singleFee)
            },
            saveLevel: function () {
                var _this = this,vals={};
                $('.level_fee').each(function () {
                    var fee=$(this).val(),level=$(this).attr('title_code'),type=$(this).attr('reg_type');
                    if(!vals[level]) {
                        vals[level] = {};
                    }
                    vals[level][type] = fee
                });
                //console.log(vals);
                this.model.saveFee(vals);
                this.model.getLevelfee();
            },
            changeCallback: function (res) {
                if (res.errorNo == 0) {
                    var status = res.status;
                    if (status == -1) {
                        alert('点击失败，请重试！')
                    }
                    $('#new_register_fee').val('')
                    $('#single_fee_modal').modal('close')
                    this.userModel.getDoctors(2);
                }
            },
            changeLevelCallback: function (res) {
                if (res.errorNo == 0) {
                    var status = res.status;
                    if (status == -1) {
                        alert('点击失败，请重试！')
                    }
                    $('#level_fee_modal').modal('close')
                }
            }
        });
        return view;
    });

