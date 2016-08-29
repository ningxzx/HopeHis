define(['txt!../../Member/memberList/memberList.html',
        '../../Member/memberList/memberModel',
        "../../Member/memberSetting/memberLevelModel",
        '../../Common/commonModel',
        '../../Common/patientModel',
        'handlebars', 'backbone', '../../Common/basicTable', "jctLibs", "bootstrapTable", "amazeui"],
    function (Template, memberModel, memberLevelModel, commonModel, patientModel, Handlebars, backbone, basicTable, jctLibs) {
        var opt = function (value, row, index) {
            return [
                '<a class="level_edit" href="javascript:void(0)" title="detail">',
                '编辑',
                '</a>',
                '&nbsp;',
                '<a class="member_pay" href="javascript:void(0)" title="Remove">',
                '充值',
                '</a>',
                '<a class="row_remove" href="javascript:void(0)" title="detail">',
                '删除',
                '</a>'
                //'<a class="11" href="javascript:void(0)" title="Remove">',
                //'积分清零',
                //'</a>'
            ].join('');
        };
        var formatState = function (value) {
            var obj = {0: '禁用', 1: '启用'}
            return obj[value];
        }
        var view = Backbone.View.extend({
            initialize: function () {
                this.commonM = new commonModel();
                this.patModel = new patientModel();
                this.member = new memberModel();
                this.LevelModel = new memberLevelModel();
                /*获取所有供应商
                 * getMembers: function (memberId, customerName, customerTel, memberLevel, memberState,page,rowNUm) {
                 */
                /***侦听回调事件***/
                this.listenTo(this.member, "deptsGetted", this.renderData);
                this.listenTo(this.member, "addMember", this.add_Member);
                this.listenTo(this.member, "conditionMember", this.ConditionMember);
                this.listenTo(this.member, "memberCharged", this.chargeCallBack);
                this.listenTo(this.patModel, "searchByName", this.Memberl);
                this.listenTo(this.patModel, "searchById", this.showPatTableById);
                this.listenTo(this.member, "PATCHedit", this.patchedit);
                this.listenTo(this.member, "delmember", this.delMember);
                this.listenTo(this.LevelModel, "getsetrecord", this.Getsetrecord);
                this.listenTo(this.member, "postMemberExcel", this.postMemberCallback);
            },
            delMember: function (data) {
                this.member.getMembers(sessionStorage.getItem('enterprise_id'));
            },
            patchedit: function (data) {
                this.member.getMembers(sessionStorage.getItem('enterprise_id'));
            },
            Getsetrecord: function (data) {
                if (data.errorNo == 0) {
                    var arr = data.rows, options = "";
                    if (arr.length) {
                        for (var i = 0; i < arr.length; i++) {
                            options += "<option value=" + arr[i].level + ">" + arr[i].level_name + "</option>";
                        }
                        $(this.el).find(".member_level").html(options);
                        $(this.el).find(".member_level").trigger("chosen:updated")
                    }
                    else {
                        $('#no_level_alert .am-modal-bd').html('很抱歉！当前无会员等级,无法添加/编辑会员！')
                        this.noLevelAlert();
                    }
                }
                else {
                    $('#no_level_alert .am-modal-bd').html('很抱歉！获取会员等级失败，请刷新页面！')
                    this.noLevelAlert();
                }
            },
            Memberl: function (data) {
                if (data.obj) {
                    if (data.obj.length > 1) {
                        $(this.el).find("#name_search_table").bootstrapTable('load', data.obj);
                        $(this.el).find('.name_search_wrapper').removeClass('hid');
                    }
                    else {
                        this.showPatInfo(data.obj[0]);
                    }
                }
                else {
                    $(this.el).find("#name_search_table").bootstrapTable('load', []);
                    $(this.el).find('.name_search_wrapper').addClass('hid');
                }
            },
            showPatTableById: function (data) {
                if (data.obj) {
                    this.showPatInfo(data.obj)
                }
                else {

                }
            },
            events: {
                "click #search_member": "searchMember",
                "click #add_member": "gotourl",
                "click #Return_member": "returnM",
                "click #rm-member": "returnM",
                "click #my-confirm #search_pat_name": "searchinputbtn",
                "keyup #txtName": "keySearchinputbtn",
                "click #my-confirm #search_pat_id": "searchPatId",
                "keyup #txtAccountNum": "keySearchPatId",
                "click #my-confirm #sub_btn": "subBtn",
                "click #refresh_level": "refreshLevel",
                "click #in_excel_tool": "inExcelModal",
                "input .member_pay": "calTotal",
                "click #upload_excel": "uploadExcel",
                "change #member_list_excel": "showExcelName",
            },
            calTotal: function () {
                var wechat_pay = parseFloat($('#wx_pay').val() || 0),
                    ali_pay = parseFloat($('#ali_pay').val() || 0),
                    bank_card_pay = parseFloat($('#insu_pay').val() || 0),
                    cash_pay = parseFloat($('#cash_pay').val() || 0);
                $('#total_charge').val(wechat_pay + ali_pay + bank_card_pay + cash_pay)
            },
            noLevelAlert: function () {
                $('#no_level_alert').modal({
                    onConfirm: function () {
                        $('#no_level_alert').modal('close');
                        window.location.href = "#member/memberSetting";
                    },
                    closeViaDimmer: false
                });
            },
            refreshLevel: function () {
                this.member.getMembers(sessionStorage.getItem('enterprise_id'));
            },
            subBtn: function () {
                var $levelInfo = $(this.el).find("#my-confirm");

                var entityid = sessionStorage.getItem('enterprise_id'),
                    entityname = sessionStorage.getItem('enterprise_name'),
                    customerid = $("#txtAccountNum").val(),
                    customername = $("#txtName").val(),
                    customertel = $("#txtMobileNum").val(),
                    customercardid = $("#txtIdentityNum").val(),
                    memberlevel = $("#ddlDmLevel").val(),
                    memberpoints = $("#txtPhoneNum").val() || 0,
                    cardmoney = $("#txtMoeny").val() || 0,
                    memberstate, discount, isusemoneypoor, memberId;
                if ($levelInfo.attr("edit_type") == "add") {
                    memberId = $("#memberId").val().trim();
                    if (memberId == '') {
                        alert("请输入会员号")
                        return;
                    }
                    this.member.addMember(memberId, entityid, entityname, customerid,
                        customername, customertel, customercardid,
                        memberlevel, memberpoints, cardmoney, memberstate, discount, isusemoneypoor)
                } else if ($levelInfo.attr("edit_type") == "edit") {
                    memberId = $levelInfo.attr("memberid");
                    this.member.PATCHedit(memberID, entityid, entityname, customerid,
                        customername, customertel, customercardid,
                        memberlevel, memberpoints, cardmoney, memberstate, discount, isusemoneypoor);
                }


            },
            searchinputbtn: function () {
                var patient_name = $(this.el).find("#txtName").val();
                $(this.el).find('.id_search_wrapper').addClass('hid');
                this.patModel.searchPatientByName('', patient_name);
            },
            keySearchinputbtn: function (e) {
                if (e.keyCode == 13) {
                    this.searchinputbtn();
                }
            },
            keySearchPatId: function (e) {
                if (e.keyCode == 13) {
                    this.searchPatId();
                }
            },
            searchPatId: function () {
                var patient_id = $(this.el).find("#txtAccountNum").val();
                $(this.el).find('.name_search_wrapper').addClass('hid');
                this.patModel.searchPatientById('', patient_id);
            },
            ConditionMember: function (result) {
                var arr = result.data;
                if (arr.result == "None") {
                    alert("没有找到数据");
                    $(this.el).find("#member_table").bootstrapTable("load", [])
                } else {
                    if (result.errorNo == 0) {
                        var data = jctLibs.listToObject(arr, 'rows')['rows'];

                        $(this.el).find("#member_table").bootstrapTable("load", data)
                    }
                }

            },
            add_Member: function (data) {
                if (data['depts'].result == "OK") {
                    alert("提交成功");
                    this.member.getMembers(sessionStorage.getItem('enterprise_id'));
                } else if (data['depts'].result == "exist") {
                    alert("该会员已经存在");
                }
            },
            gotourl: function () {
                if ($("#ddlDmLevel option").length == 0) {
                    $('#no_level_alert .am-modal-bd').html('很抱歉！当前无会员等级,无法添加/编辑会员！')
                    this.noLevelAlert();
                    return false;
                }
                var $levelInfo = $(this.el).find("#my-confirm"),
                    $title = $levelInfo.find(".meber");
                $('#memberId').attr('readonly', false);
                //如果上次是编辑状态,重置明细,将明细改为添加状态;如果上一次是添加状态且未提交,则不进行重置
                if ($levelInfo.attr("edit_type") !== "add") {
                    $levelInfo.attr("edit_type", "add");
                    $title.html("新增会员");
                }
                this.hidfunc();
                //$(this.el).html(addMember);
                $(this.el).find('#my-confirm').modal({
                    width: 960
                });
            },
            //returnM: function () {
            //
            //   this.render();
            //},
            searchMember: function () {
                var $el = $(this.el);
                //memberId, customerName, customerTel, memberLevel, memberState
                var memberId = $el.find("#member_id").val(),
                    customerName = $el.find("#member_name").val(),
                    customerTel = $el.find("#member_tel").val(),
                    memberLevel = $el.find(".member_level option:selected").val(),
                    memberState = $el.find(".member_state").val();

                this.member.conditionMember(memberId, customerName, customerTel, memberLevel, memberState)

            },
            renderData: function (result) {
                if (result['depts'].length > 0) {
                    var members = result.depts;
                    for (var i = 0; i < members.length; i++) {
                        if (members[i].isuse_money_poor == 'n') {
                            members[i].isuse_money_poor = '不可用';
                        } else if (members[i].isuse_money_poor == 'y') {
                            members[i].isuse_money_poor = '可用';
                        }
                    }
                    $(this.el).find("#member_table").bootstrapTable("load", members)
                }
                else {
                    $(this.el).find("#member_table").bootstrapTable("load", [])
                }
            },
            render: function () {
                var that = this;
                $(this.el).html(Template);

                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 10});
                $(this.el).find("input[type='radio']").uCheck("enable");
                $(this.el).find(".member_select");
                $(this.el).find("#member_table").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {
                            field: 'opt', width: "15%", title: '操作', formatter: opt, events: {
                            'click .member_pay': function (e, value, row, index) {
                                $(that.el).find("#memberlist_money input").val("");
                                var $modal = $(that.el).find("#memberlist_money");
                                $modal.attr('member_id', row['member_id']);
                                $modal.attr('customer_id', row['customer_id']);
                                $(that.el).find("#memberlist_money").modal({
                                    width: 960,
                                    onConfirm: function () {
                                        var $modal = $('#memberlist_money');
                                        var wechat_pay = $('#wx_pay').val() || 0,
                                            ali_pay = $('#ali_pay').val() || 0,
                                            bank_card_pay = $('#insu_pay').val() || 0,
                                            patient_id = $modal.attr('customer_id'),
                                            cash_pay = $('#cash_pay').val() || 0,
                                            total_charge = $('#total_charge').val() || 0;
                                        var param = {
                                            patient_id: patient_id,
                                            total_charges: total_charge,
                                            cash_pay: cash_pay,
                                            wechat_pay: wechat_pay,
                                            ali_pay: ali_pay,
                                            bank_card_pay: bank_card_pay
                                        }

                                        that.member.chargeMember($modal.attr('member_id'), param)
                                    },
                                });
                            },
                            'click .level_edit': function (e, value, row, index) {
                                if ($("#ddlDmLevel option").length == 0) {
                                    $('#memberId').attr('readonly', true);
                                    $('#no_level_alert .am-modal-bd').html('很抱歉！当前无会员等级,无法添加/编辑会员！')
                                    that.noLevelAlert();
                                    return false;
                                }
                                that.editLevel(row);
                            },
                            'click .row_remove': function (e, value, row, index) {
                                $(".delete_alert").attr('member_id', row.member_id)
                                $(".delete_alert").modal({
                                    width: 600,
                                    onConfirm: function () {
                                        that.member.delmember($(".delete_alert").attr('member_id'))
                                    },
                                    onCancel: function () {
                                        $(".delete_alert").modal('close');
                                    },
                                    closeViaDimmer: false
                                });
                            },
                        }
                        },
                        {field: 'member_id', width: "20%", title: '会员卡号'},
                        {field: 'customer_name', title: '姓名'},
                        {field: 'customer_tel', width: "10%", title: '手机号'},
                        {field: 'member_level', title: '会员等级'},
                        {field: 'member_points', title: '会员积分'},
                        {field: 'card_money', title: '会员余额'},
                        {field: 'member_state', title: '会员状态', formatter: formatState},
                    ],
                    data: []
                });
                $(this.el).find("#name_search_table,#id_search_table").bootstrapTable({
                    columns: [
                        {field: 'patient_name', title: '患者姓名'},
                        {field: 'patient_sex', title: '性别', formatter: jctLibs.generateSex},
                        {field: 'patient_birth', title: '年龄', formatter: jctLibs.generateAge},
                    ],
                    onClickRow: this.showPatInfo
                });
                this.member.getMembers(sessionStorage.getItem('enterprise_id'));
                this.LevelModel.getsetrecord();
                return this;
            },
            editLevel: function (row) {
                //console.log(row.member_id)
                this.hidfunc();
                var $levelInfo = $(this.el).find("#my-confirm"),
                    $title = $levelInfo.find(".meber");

                //如果上次是编辑状态,重置明细,将明细改为添加状态;如果上一次是添加状态且未提交,则不进行重置
                if ($levelInfo.attr("edit_type") !== "edit") {
                    $levelInfo.attr("edit_type", "edit");
                    $title.html("编辑会员等级");

                }
                $levelInfo.attr("memberid", row.member_id);
                $levelInfo.find("#txtName").val(row.customer_name);
                $levelInfo.find("#txtAccountNum").val(row.customer_id);
                $levelInfo.find("#txtMobileNum").val(row.customer_tel);
                //$levelInfo.find("#txtBirthday").val(row.patient_birth);
                $levelInfo.find("#txtIdentityNum").val(row.customer_card_id);
                $levelInfo.find("#txtPhoneNum").val(row.member_points);
                $levelInfo.find("#txtMoeny").val(row.card_money);
                $levelInfo.find("#ddlDmLevel").val(row.member_level);


                $(this.el).find('#my-confirm').modal({
                    width: 960
                });
            },
            hidfunc: function () {
                $("#txtName").val('')
                $("#txtAccountNum").val('');
                $("#txtMobileNum").val('');
                //$("#txtBirthday").val('');
                $("#ddlSex_0").val('');
                $("#txtIdentityNum").val('');
                $("#txtPhoneNum").val('');
                $("#txtMoeny").val('');
                //$("#ddlDmLevel").val('');
                $("#stype_m").val('');
                $("#member_ls").val('');
                $("#member_no").val('');
            },
            showPatInfo: function (row) {
                var $data = $("#my-confirm");
                $data.find("#txtName").val(row.patient_name);
                $data.find("#txtAccountNum").val(row.patient_id);
                $data.find("#txtMobileNum").val(row.patient_phone);
                $data.find("#txtIdentityNum").val(row.card_id);
                $('.name_search_wrapper').addClass('hid');
            },
            chargeCallBack: function (res) {
                if (res.status == '100') {
                    alert('充值成功！');
                    this.member.getMembers(sessionStorage.getItem('enterprise_id'));
                }
                else {
                    alert('充值失败！');
                }
            },
            inExcelModal: function () {
                $('#member_excel_modal').modal('open');
            },
            showExcelName: function (e) {
                var event=window.event||e;
                var file = event.target.files[0], name = file.name;
                $('#member_excel_tips').attr('filename', name).html(name);
            },
            uploadExcel: function () {
                var excelData = new FormData();
                var files = document.getElementById('member_list_excel').files,
                    name = $('#member_list_excel').attr('filename');
                if (files.length) {
                    excelData.append('member_excel', files[0], name);
                    this.member.postExcel(excelData);
                }
            },
            postMemberCallback: function (res) {
                if (res.errorNo == 0) {
                    if (res.status == '100') {
                        $('#member_list_excel').val('').attr('filename', '');
                        this.refreshLevel();
                    }
                    else if(res.status == '408'){
                        alert("身份证出错!")
                    }
                    else{
                        alert('上传excel出错!')
                    }
                }
                else {
                    alert('上传excel失败!');
                }
            }
        });
        return view;
    })
;
