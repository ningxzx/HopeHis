define(['txt!../../Setting/userMange/userMange.html',
        '../../Setting/userMange/userModel',
        '../../Setting/departMange/departMangeModel',
        '../../Common/commonModel',
        'jquery', 'jctLibs', 'backbone', 'bootstrapTable', 'amazeui', 'chosen'],
    function (Template, userModel, departMangeModel, commonModel, $, jctLibs, Backbone, bootstrapTable, amazeui, chosen) {
        var en_id = sessionStorage.getItem('enterprise_id');
        var en_name = sessionStorage.getItem('enterprise_name');
        var operateFormatter = function (value, row, index, e) {
            if(row['role']=='管理员'){
                return '<a class="row_edit" href="javascript:void(0)" >编辑</a>';
            }
            else {
                return [
                    '<a class="row_edit" href="javascript:void(0)" >',
                    '编辑',
                    '</a>  ',
                    '<a class="menu_edit" href="javascript:void(0)" >',
                    '修改权限',
                    '</a>  ',
                    '<a class="state_edit" href="javascript:void(0)" >',
                    '启用/禁用',
                    '</a>'
                ].join('');
            }
        };
        var passFormatter = function (value, row, index) {
            return [
                '<a class="row_pass" href="javascript:void(0)" title="">',
                '分配科室',
                '</a>  '
            ].join('');
        };
        var formatFatherMenu = function (value, row, index) {
            return showUcheck(row);
        };
        var formatMenu = function (value, row, index) {
            return value.map(function (menu) {
                return showChildUcheck(menu)
            }).join('')
        };
        var showUcheck = function (row) {
            return '<label class="am-checkbox"><input type="checkbox" class="father_menu" disabled value=' + row["menu_id"] + ' name="menu"><span>' + row["father_menu"] + "</span></label>"
        };
        var showChildUcheck = function (value) {
            return '<div class="am-u-md-2 am-u-end"><label class="am-checkbox"><input type="checkbox" value=' + value["menu_id"] + '  name="menu"><span>' + value["menu_name"] + "</span></label></div>"
        };
        var view = Backbone.View.extend({
            initialize: function () {
                this.switch=true;
                this.userModel = new userModel();
                this.deptModel = new departMangeModel();
                this.comModel = new commonModel();
                this.addDataReady = true;
                this.userModel.getEmployers(en_id);
                this.menus = "";
                this.conn_record_id = "";
                /***侦听回调事件***/
                this.listenTo(this.userModel, "getCheckDoctors", this.renderCheckDocs);
                this.listenTo(this.comModel, "getDoctors", this.renderDocs);
                this.listenTo(this.deptModel, "deptsGetted", this.renderDepts);
                this.listenTo(this.userModel, "getCheckedResult", this.checkCallback);
                this.listenTo(this.userModel, "getEmployers", this.renderEmployers);
                this.listenTo(this.userModel, "updateEmployer", this.updateUserResult);
                this.listenTo(this.userModel, "reEmployer", this.ifaddOk);
                this.listenTo(this.comModel, "getDept", this.renderDepart);
                this.listenTo(this.comModel, "getRole", this.renderRole);
                this.listenTo(this.comModel, "getTitle", this.renderTitle);
                this.listenTo(this.userModel, "saveResult", this.saveMenuResult);
                this.listenTo(this.comModel, "searchDoctors", this.searchDocResult);
                this.listenTo(this.userModel, "passDoctor", this.passDocResult);
                this.listenTo(this.comModel, "getMenu", this.renderMenu);
                this.listenTo(this.userModel, "stateResult", this.stateResult);
            },

            render: function () {
                var _this = this;
                $(this.el).html(Template);
                $(this.el).find("select").chosen({
                    width: "100%",
                    no_results_text: '没有找到匹配的项！',
                    disable_search_threshold: 100,
                    placeholder_text_single: '请选择一项',
                    placeholder_text_multiple: '可选择多项'
                });
                $(this.el).find('#user_birth').datepicker();
                $(this.el).find("#check_doctors_table").bootstrapTable({
                    pagination: true,
                    data: [],
                    columns: [
                        {field: 'doctor_name', title: '医生姓名'},
                        {field: 'department', title: '科室'},
                        {
                            field: 'doctor_title', title: '医生职称', formatter: function (value) {
                            var name = {
                                "10": "主治医师",
                                "20": "主任医师",
                                "21": "副主任医师",
                                "30": "门诊医师"
                            };
                            return name[value];
                        }
                        },
                        //{field: 'hosptil', title: '从业医院'},
                        {field: 'department', title: '从业科室'},
                        {field: 'shcool', title: '毕业医院'},
                        {field: 'doctor_education', title: '学历'},
                        {field: 'doctor_phone', title: '手机号'},
                        {field: 'card_no', title: '身份证号'},
                        {field: 'work_year', title: '执业年限（年）'},
                        {field: 'license_no', title: '执业资格证编号'},
                        {
                            field: 'operation', title: '操作', formatter: passFormatter, events: {
                            'click .row_pass': function (e, value, row, index) {
                                var name = {
                                    "10": "主治医师",
                                    "20": "主任医师",
                                    "21": "副主任医师",
                                    "30": "门诊医师"
                                };
                                $("#choose_dept_modal").attr("account_id", row.account_id);
                                $("#choose_dept_modal").attr("doctor_title", row.doctor_title);
                                $("#choose_dept_modal").attr("title_name", name[row.doctor_title]);

                                $("#choose_dept_modal").modal();
                            }
                        }
                        }]
                });
                $(this.el).find("#doctors_table").bootstrapTable({
                    data: [],
                    search: true,
                    columns: [
                        {field: 'doctor_name', title: '医生姓名'},
                        {field: 'department_name', title: '科室'},
                        {
                            field: 'doctor_title', title: '医生级别', formatter: function (value) {
                            var name = {
                                "10": "主治医师",
                                "20": "主任医师",
                                "21": "副主任医师",
                                "30": "门诊医师"
                            };
                            return name[value];
                        }
                        },
                        {field: 'register_fee', title: '挂号费'},
                        {field: 'user_id', title: '登录账号'}
                    ]
                });
                $(this.el).find("#employer_table").bootstrapTable({
                    data: [],
                    search: true,
                    sortName: 'role',
                    columns: [
                        {field: 'user_name', title: '姓名'},
                        {field: 'account_id', title: '用户名'},
                        {field: 'role', title: '角色', sortable: true},
                        {field: 'user_sex', title: '性别', formatter: jctLibs.formatGender},
                        {field: 'department_name', title: '科室'},
                        {
                            field: 'account_state', title: '状态', formatter: function (value) {
                            return {"jy": "禁用", "qy": "启用"}[value];
                        }
                        },
                        {field: 'create_date_time', title: '注册时间'},
                        {
                            field: 'operate', title: '操作', width: '20%', formatter: operateFormatter,
                            events: {
                                'click .state_edit': function (e, value, row, index) {
                                    $("#state_confirm").attr({goal: row.account_id, state: row.account_state});
                                    $("#state_confirm").modal();
                                },
                                'click .row_edit': function (e, value, row, index) {
                                    _this.conn_record_id = row["conn_record_id"];
                                    var $addModal = $('#add_user_modal');
                                    $addModal.find('#user_id').attr('readonly', true);
                                    $addModal.attr('ifAdmin', row['role_id'].indexOf('ROLE10001')!==-1?'isAdmin':"notAdmin");
                                    $addModal.attr("type", "updateEmployer");
                                    $addModal.find('.password_wrapper').hide();
                                    $addModal.find('#user_name').val(row['user_name']);
                                    $addModal.find('#user_id').val(row['account_id']);
                                    $addModal.find('#user_sex').val(row['user_sex']);
                                    $addModal.find('#user_email').val(row['user_email']);
                                    $addModal.find('#user_tel').val(row['user_phone']);
                                    if (row['role_id'].indexOf('ROLE10002')!==-1) {
                                        $('.doctor_info').removeClass('hid');
                                        $addModal.find('#user_dept').val(row['department_id']).trigger("chosen:updated");
                                        $addModal.find('#doctor_level').val(row['title_code']).trigger("chosen:updated");
                                        //$addModal.find('#doctor_regfee').val(row['register_fee']);
                                    }
                                    else{
                                        $('.doctor_info').addClass('hid');
                                        $addModal.find('#user_dept').val("").trigger("chosen:updated");
                                        $addModal.find('#doctor_level').val("").trigger("chosen:updated");
                                        $addModal.find('#register_fee').val("");
                                    }
                                    $('#add_user_modal').find('#user_role').val(
                                        row['role_id'].split(",")
                                    ).trigger("chosen:updated");
                                    $addModal.modal({
                                        'width': '700'
                                    })
                                },
                                'click .menu_edit': function (e, value, row, index) {
                                    _this.comModel.search('admin.menu', {state: '1'}, 'getMenu');
                                    _this.menus = row["menus"];
                                    _this.conn_record_id = row["conn_record_id"];
                                    $("#menu_tbl").bootstrapTable({
                                        columns: [
                                            {
                                                field: 'father_menu',
                                                title: '主菜单',
                                                width: '10%',
                                                formatter: formatFatherMenu,
                                                events: {
                                                    "change .father_menu": function (e, value, row, index) {
                                                        var $target = $(e.target), ifCheck = $target[0].checked, $childTd = $target.closest('td').next('td');
                                                        if (ifCheck) {
                                                            $childTd.find('input[type=checkbox]').prop('checked', ifCheck);
                                                        }
                                                        else {
                                                            $childTd.find('input[type=checkbox]').removeAttr('checked');
                                                        }
                                                    }
                                                }
                                            },
                                            {field: 'child_menu', title: '子菜单', formatter: formatMenu},
                                        ],
                                        pagination: false
                                    });
                                }
                            }
                        }
                    ],
                    rowStyle: function (row) {
                        if(row['account_state']=='jy'){
                            return {
                                css:{
                                    color:'red'
                                }
                            }
                        }
                        else{
                            return {
                                css:{
                                    color:'black'
                                }
                            }
                        }
                    },
                    sortName:'account_state',
                    sortOrder:'desc'
                });
                //获取正在审核中的医生列表
                //this.refreshCheckDoctors();
                //获取已审核的医生列表
                this.refreshDoctors();
                this.comModel.search('admin.role', {enterprise_id: sessionStorage.getItem('enterprise_id'),state:'10'}, 'getRole');
                this.comModel.search('customer.department', {enterprise_id: sessionStorage.getItem('enterprise_id')}, 'getDept');
                this.comModel.search('comm.title_dict', {}, 'getTitle');
                this.deptModel.getDepts(sessionStorage.getItem('enterprise_id'));
                return this;
            },
            events: {
                "click #cancelCheckBtn": "cancelCheck",
                "click #confirmCheckBtn": "confirmCheck",
                'click #refresh_check_doctors': 'refreshCheckDoctors',
                'click #refresh_doctors': 'refreshDoctors',
                'click #add_employers': 'showModal',
                'change #user_role': "showDeptInput",
                'click #add_role_submit': 'addSubmit',
                'click #refresh_employers': 'refreshUser',
                'blur #user_name': 'checkName',
                'blur #user_id': 'checkAccount',
                'blur #password': 'checkPassword',
                'blur #repeat_password': 'repeatpassword',
                'blur #user_tel': 'checkPhone',
                'blur #user_email': 'checkEmail',
                'click #modify_menus': "modifyMenus",
                //"chosen:showing_dropdown #user_role": "hideDoctor",
                "click #search_doc": "searchDoc",
                "click #state_change": "stateChange"
            },
            stateChange: function () {
                var data = {
                    goal_account: $("#state_confirm").attr('goal'),
                    before_change_value: $("#state_confirm").attr('state'),
                    after_change_value: $("#state_confirm").attr('state') == "qy" ? "jy" : "qy"
                };
                this.userModel.stateChange(data);
            },
            stateResult: function (result) {
                if (result.errorNo == 0) {
                    alert("修改状态成功");
                    this.refreshUser();
                } else {
                    alert(result.errorInfo);
                }
            },
            searchDoc: function () {
                var doc_id = $("#doc_id").val();
                var doc_username = $("#doc_username").val();
                this.comModel.concatSearch({
                    "json": JSON.stringify({
                        "from": "customer.doctor_info as ubi",
                        "LEFT customer.account_record.account_id as ar|ubi.account_id": "",
                        "ar.account_power": "10",
                        "ubi.doctor_name": doc_username || "",
                        "ubi.account_id": doc_id || ""
                    })
                }, "searchDoctors");
            },
            searchDocResult: function (result) {
                if (result.errorNo == "0") {
                    $("#check_doctors_table").bootstrapTable("load", result.rows || []);
                } else {
                    alert("未查询到数据，请重新查询");
                }
            },
            passDocResult: function (result) {
                if (result.errorNo == "0") {
                    $("#choose_dept_modal").modal("close");
                    this.refreshDoctors();
                } else {
                    alert("添加失败，请重新添加");
                }
            },
            //设置医生不可选
            hideDoctor: function () {
                if ($("#add_user_modal").attr("type") == "updateEmployer") {
                    $("#user_role_chosen .chosen-results").find("li:contains('医生')").removeClass("active-result").addClass("disabled-result");
                }
            },
            renderMenu: function (res) {
                if (res.errorNo == 0 && !!this.menus) {
                    var menus = res.rows, fatherMenus = [], newMenus = [];
                    var ownMenus = this.menus.split(",");
                    fatherMenus = menus.filter(function (menu) {
                        if (ownMenus.indexOf(menu["menu_id"]) != -1) {
                            return menu['father_menu_id'] == 0;
                        }
                    });
                    fatherMenus.forEach(function (menu) {
                        var m = {}, id = menu['menu_id'];
                        m.father_menu = menu['menu_name'];
                        m.menu_id = id;
                        m.child_menu = menus.filter(function (child) {
                            return child['father_menu_id'] == id
                        });
                        newMenus.push(m);
                    });
                    $("#menu_tbl").bootstrapTable('load', newMenus);
                    $('#menu_tbl').find('input[type=checkbox]').removeAttr('checked');
                    ownMenus.forEach(function (menu_id) {
                        $('#menu_tbl').find('input[value=' + menu_id + ']').prop('checked', true);
                    });
                    $("#modify_menu_modal").attr('')
                    $("#modify_menu_modal").modal({
                        width: '960'

                    });
                } else {
                    alert("获取数据失败，请重试");
                }
            },
            modifyMenus: function () {
                var menus = $('#menu_tbl input[type=checkbox]').not("input:checked"), ids = [];
                menus.each(function (i, ele) {
                    ids.push(ele.value)
                });
                var data = {
                    conn_record_id: this.conn_record_id,
                    menus: ids.join(",")
                };
                this.userModel.saveMenu(data);
            },
            saveMenuResult: function (result) {
                if (result.errorNo == "0") {
                    this.refreshUser();
                    alert("修改权限成功");
                } else {
                    alert("修改权限失败");
                }
            },
            repeatpassword: function (e) {
                var $target = $(e.currentTarget),
                    name = $target.val();
                var src = $(e.target).closest(".am-g").find("img"),
                    span = src.next("span");
                var pd = $(this.el).find("#password").val();
                if (pd != name) {
                    src.attr('src', 'imgs/wrong.png');
                    span.html("两次输入密码不一致");
                } else {
                    src.attr('src', 'imgs/right.png');
                    span.html("正确");
                }
            },
            //检验电话号码
            checkPhone: function (e) {
                var $target = $(e.currentTarget),
                    name = $target.val();
                var src = $(e.target).closest(".am-g").find("img"),
                    span = src.next("span");
                if (name == "") {
                    src.attr('src', 'imgs/wrong.png');
                    span.html("电话不能为空");
                } else
                if (!(name.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/))) {
                    //src.attr('src', 'imgs/wrong.png');
                    span.html("输入正确的手机号码");
                } else {
                    src.attr('src', 'imgs/right.png');
                    span.html("正确");
                }
            },
            //检查姓名
            checkName: function (e) {
                var $target = $(e.currentTarget),
                    name = $target.val();
                var src = $(e.target).closest(".am-g").find("img"),
                    span = src.next("span");
                if (!name) {
                    src.attr('src', 'imgs/wrong.png');
                    span.html("不能为空");
                } else if (!name.match(/^[\u4e00-\u9fa5]+$/)) {
                    src.attr('src', 'imgs/wrong.png');
                    span.html("必须是中文");
                } else {
                    src.attr('src', 'imgs/right.png');
                    span.html("正确");
                }
            },

            //检查用户名是否存在
            checkAccount: function (e) {
                //为空
                var $target = $(e.currentTarget),
                    name = $target.val();
                var src = $(e.target).closest(".am-g").find("img"),
                    span = src.next("span");
                if (!(name.match(/^(?!^\d+$)[A-Za-z0-9\\-_]{6,16}$/))) {
                    //用户名为数字和字母的组合，4~16位
                    src.attr('src', 'imgs/wrong.png');
                    span.html("用户名为数字和字母的组合，6~16位");
                } else {
                    //是否存在
                    $.ajax({
                        type: "post",
                        url: "http://192.168.0.220:8081/jethis/Jethis_User/checkaccount",
                        data: JSON.stringify({
                            "account_id": name
                        }),
                        success: function (data) {
                            if (data.result !== "av") {
                                src.attr('src', 'imgs/wrong.png');
                                span.html("用户名已存在");
                            } else {
                                src.attr('src', 'imgs/right.png');
                                span.html("用户名可以使用");
                            }
                        },
                        error: function () {
                            src.attr('src', 'imgs/wrong.png');
                            span.html("错误");
                        }
                    })
                }
            },
            //检查密码
            checkPassword: function (e) {
                var $target = $(e.currentTarget),
                    name = $target.val();
                var src = $(e.target).closest(".am-g").find("img"),
                    span = src.next("span");

                if (name == "") {
                    //为空
                    src.attr('src', 'imgs/wrong.png');
                    span.html("不能为空");
                } else if (name.length < 6) {
                    //长度
                    src.attr('src', 'imgs/wrong.png');
                    span.html("必须大于5位");
                } else if (!(name.match(/^[A-Za-z0-9\\-_]*$/))) {
                    //输入规则
                    src.attr('src', 'imgs/wrong.png');
                    span.html("必须为字母和数字");
                } else {
                    src.attr('src', 'imgs/right.png');
                    span.html("正确");
                }
            },
            //验证邮箱
            checkEmail: function (e) {
                var $target = $(e.currentTarget),
                    name = $target.val();
                var src = $(e.target).closest(".am-g").find("img"),
                    span = src.next("span");
                if (name == "") {
                    src.attr('src', 'imgs/wrong.png');
                    span.html("不能为空");
                } else if (!(name.match(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/))) {
                    src.attr('src', 'imgs/wrong.png');
                    span.html("输入正确的邮箱 ");
                } else {
                    src.attr('src', 'imgs/right.png');
                    span.html("正确");
                }
            },
            addSubmit: function () {
                var type = $("#add_user_modal").attr("type"),
                    ifAdmin=$("#add_user_modal").attr("ifAdmin");
                var roleArr= $("#user_role").val();
                if(ifAdmin=='isAdmin'){
                    roleArr.push('ROLE10001');
                }
                var userId = $("#user_id").val(),
                    userName = $("#user_name").val(),
                    password = $("#password").val(),
                    tel = $("#user_tel").val(),
                    gender = $("#select_gender").val() || 'M',
                    role = roleArr.join(','),
                    email = $("#user_email").val(),
                    dept = $("#user_dept").val(),
                    dept_name = $("#user_dept option:selected").html(),
                    title_code = $("#doctor_level").val(),
                    title_name = $("#doctor_level option:selected").html();
                    //register_fee = $("#doctor_regfee").val()
                var strMD5Passwd = CryptoJS.MD5(password).toString();
                var data = {
                    "enterprise_id": en_id,
                    "enterprise_name": en_name,
                    "account_id": userId,
                    "login_pwd": strMD5Passwd,
                    "user_name": userName,
                    "user_phone": tel,
                    "user_sex": gender,
                    "role": role,
                    'user_email': email
                };
                if (roleArr.indexOf("ROLE10002")!=-1) {
                    data['dept'] = dept;
                    data['department_name'] = dept_name;
                    data['title_code'] = title_code;
                    data['title_name'] = title_name;
                    //data['register_fee'] = register_fee;
                }
                if (type == "addEmployer") {
                    this.userModel.addEmployer(data);
                } else if (type == "updateEmployer" && !!this.conn_record_id) {
                    var updateInfo = {
                        'user_name': userName,
                        'account_id': userId,
                        'user_sex': gender,
                        'user_phone': tel,
                        'user_email': email,
                        'role': role,
                        'conn_record_id': this.conn_record_id,
                        'dept': dept,
                    'department_name': dept_name,
                    'title_code': title_code,
                    'title_name': title_name,
                    //'register_fee': register_fee,
                    };
                    this.userModel.updateEmployer(updateInfo);
                } else {
                    alert("操作失败，请刷新后重试");
                }
            },
            updateUserResult: function (result) {
                if (result.errorNo == "0") {
                    this.refreshUser();
                    alert("编辑用户信息成功");
                } else {
                    alert("编辑用户信息失败");
                }
                $('#add_user_modal').modal('close');
            },
            ifaddOk: function (res) {
                if (res.resultCode == "100") {
                    alert("添加成功");
                    this.userModel.getEmployers(en_id);
                    $('#add_user_modal').modal('close');
                }
                else if (res.resultCode == "111") {
                    alert("用户名重复");
                }
                else {
                    alert("添加失败");
                }
            },
            refreshUser: function () {
                this.userModel.getEmployers(en_id);
            },
            showDeptInput: function (e) {
                var $target = $(e.currentTarget), value = $target.val();
                if (value && value.length != 0) {
                    if (value.indexOf('ROLE10002') != -1) {
                        $('.doctor_info').removeClass('hid');
                        this.comModel.search('customer.department', {enterprise_id: sessionStorage.getItem('enterprise_id')}, 'getDept');
                        this.comModel.search('comm.title_dict', {}, 'getTitle');
                    }
                    else {
                        $('.doctor_info').addClass('hid');
                    }
                }
                else {
                    $('#user_role option').attr('disabled', false);
                    $('.doctor_info').addClass('hid');
                }
            },
            renderDepart: function (res) {
                var that=this;
                //console.log(res)
                var $select = $(this.el).find("#user_dept");
                $select.html('');
                if (res.errorNo === 0) {
                    that.switch=true;
                    $select.html("");
                    var data = res.rows;
                    data.forEach(function (val) {
                        $select.append($('<option></option>')
                                .val(val['department_id'])
                                .html(val['department_name'])
                        ).trigger('chosen:updated');
                    })
                } else if (res.errorNo == 802) {
                    that.switch=false;
                    //alert("请先在 科室管理 里面添加 科室");
                    $(this.el).find("#depd_no").modal({
                        relatedTarget: this,
                        onConfirm: function (options) {
                            window.location.href = "#setting/departMange";
                            $("#depd_no").modal('close');
                        },
                        closeViaDimmer: false
                    });
                }

            },
            renderRole: function (res) {
                var $select = $(this.el).find("#user_role");
                $select.html('');
                if (res.errorNo === 0) {
                    var data = res.rows;
                    data.forEach(function (val) {
                        if (val['role_name'] != "管理员") {
                            $select.append($('<option></option>')
                                    .val(val['role_id'])
                                    .html(val['role_name'])
                            ).trigger('chosen:updated');
                        }
                    })
                }
            },
            renderTitle: function (res) {
                var $select = $(this.el).find("#doctor_level");
                $select.html('');
                if (res.errorNo === 0) {
                    var data = res.rows;
                    data.forEach(function (val) {
                        $select.append($('<option></option>')
                                .val(val['title_code'])
                                .html(val['title_name'])
                        ).trigger('chosen:updated');
                    })
                }
            },
            showModal: function () {
                if(this.switch){
                    $('.doctor_info').addClass('hid');
                    $("#add_user_modal .password_wrapper").show();
                    $("#add_user_modal input").val('').attr('readonly', false);
                    $("#add_user_modal select").val('');
                    $("#add_user_modal").attr("type", "addEmployer");
                    $("#add_user_modal").modal({width: "960", top: '10', closeViaDimmer: false});
                    this.comModel.search('admin.role', {enterprise_id: sessionStorage.getItem('enterprise_id')}, 'getRole');
                }else{
                    $(this.el).find("#depd_no").modal({
                        relatedTarget: this,
                        onConfirm: function (options) {
                            window.location.href = "#setting/departMange";
                            $("#depd_no").modal('close');
                        },
                        closeViaDimmer: false
                    });
                }

            },
            refreshCheckDoctors: function () {
                this.userModel.getDoctors(1);
            },
            refreshDoctors: function () {
                this.comModel.concatSearch({
                    "json": JSON.stringify({
                        "from": "customer.doctor_info as ubi",
                        "LEFT customer.account_record.account_id as ar|ubi.account_id": "",
                        "LEFT customer.enterprise_user_connect.login_account_id as euc|ubi.account_id": "",
                        "ar.account_power": "10",
                        "euc.enterprise_id": sessionStorage.getItem("enterprise_id")
                    })
                }, "getDoctors");
            },
            renderCheckDocs: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find("#check_doctors_table").bootstrapTable('load', res.rows || []);
                }
            },
            renderDocs: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find("#doctors_table").bootstrapTable('load', res.rows)
                }
            },
            confirmCheck: function () {
                if (!!$("#depts").val()) {
                    var data = {
                        enterprise_id: sessionStorage.getItem("enterprise_id"),
                        enterprise_name: sessionStorage.getItem("enterprise_name"),
                        login_account_id: $("#choose_dept_modal").attr("account_id"),
                        department_id: $("#depts").val(),
                        account_id: sessionStorage.getItem("user_id"), //创建管理员 ID
                        department_name: $("#depts option:selected").text(),     //科室名
                        title_code: $("#choose_dept_modal").attr("doctor_title"),
                        title_name: $("#choose_dept_modal").attr("title_name")
                    };
                    this.userModel.passDoctor(data);
                } else {
                    alert("请选择科室");
                }
            },
            cancelCheck: function () {
                $('#choose_dept_modal').modal('close');
            },
            renderDepts: function (res) {
                if (res.errorNo === 0) {
                    var depts = res.depts;
                    depts.forEach(function (dept) {
                        jctLibs.appendToChosen($("#depts"), dept.department_id, dept.department_name);
                    });
                }
            },
            checkCallback: function (res) {
                if (res.status.toLowerCase() === 'ok') {
                    //获取正在审核中的医生列表
                    this.userModel.getDoctors(1);
                    //获取已审核的医生列表
                    this.userModel.getDoctors(2);
                    $('#choose_dept_modal').modal('close')
                }
            },
            renderEmployers: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find("#employer_table").bootstrapTable('load', res.rows)
                }
            }
        });
        return view;
    });