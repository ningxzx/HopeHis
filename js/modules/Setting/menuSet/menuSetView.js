/**
 * Created by xzx on 2016-05-19.
 */
define(['txt!../../Setting/menuSet/menuSet.html',
        '../../Setting/menuSet/menuSetModel',
        '../../Common/commonModel',
        'handlebars', 'jquery','backbone', 'jctLibs', 'bootstrapTable', 'amazeui'],
    function (Template, menuSetModel, commonModel, Handlebars,$, Backbone, jctLibs, bootstrapTable, amazeui) {
        var formatState = function (value, row, index) {
            return {'00': '禁用', '10': '启用'}[value]
        }
        var formatFatherMenu = function (value, row, index) {
            return showUcheck(row);
        }
        var formatMenu = function (value, row, index) {
            return value.map(function (menu) {
                return showChildUcheck(menu)
            }).join(' ')
        };
        var showUcheck = function (row) {
            return '<label class="am-checkbox"><input type="checkbox" class="father_menu" value=' + row["menu_id"] + ' name="menu"><span>' + row["father_menu"] + "</span></label>"
        };
        var showChildUcheck = function (value) {
            return '<div class="am-u-md-3 am-u-end"><label class="am-checkbox"><input type="checkbox" value=' + value["menu_id"] + '  name="menu"><span>' + value["menu_name"] + "</span></label></div>"
        };
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new menuSetModel();
                this.commonModel = new commonModel();
                //侦听事件
                this.listenTo(this.model, "submitRole", this.submitCallBack);
                this.listenTo(this.commonModel, "getRole", this.renderRole);
                this.listenTo(this.commonModel, "getMenu", this.renderMenu);
                this.listenTo(this.model, "deleteRole", this.deleteCallback);
                this.listenTo(this.model, "roleSaveMenu", this.saveMenuCallback);
            },
            events: {
                "click #role_table_wrapper .add_tool": "showRoleModal",
                "click #submit_role": "submitRole",
                'click .save_menu_tool': 'saveMenu'
            },
            render: function () {
                var temp = Handlebars.compile(Template), $el = $(this.el), _this = this;
                var menuSetHtml = temp([]);
                $el.html(menuSetHtml);
                $el.find("input[type='checkbox']").uCheck();
                $el.find("#role_tbl").bootstrapTable({
                    sortName:'id',
                    columns: [
                        {field: 'checked', title: '', checkbox: true},
                        {field: 'role_name', title: '名称'},
                        {field: 'state', title: '状态', formatter: formatState},
                        //{field: 'remark', title: '备注'},
                        {
                            field: 'opt', title: '操作', width: "30%", formatter: jctLibs.operateSmallFormatter, events: {
                            //编辑
                            "click .row_edit": function (e, value, row, index) {
                                var $modal = $('#role_modal');
                                $modal.attr('type', 'edit');
                                $modal.attr('role_id', row['id']);
                                $modal.find('.modal_title').html('编辑角色');
                                $('#role_name').val(row['role_name']);
                                $('#role_remark').val(row['remark']);
                                $("input[name='edit_role_type'][value=" + row['state'] + "]").uCheck('check');
                                $modal.modal({
                                    width: 700
                                });
                            },
                            //删除
                            "click .row_remove": function (e, value, row, index) {
                                _this.model.deleteRole(row['id'])
                            }
                        }
                        }
                    ],
                    singleSelect: true,
                    clickToSelect: true,
                    onClickRow: function (row, $element) {
                        $('#menu_tbl').find('input[type=checkbox]').removeAttr('checked');
                        if (!row['checked'] && row['menus']) {
                            var menus = row['menus'].split(',');
                            menus.forEach(function (menu_id) {
                                $('#menu_tbl').find('input[value=' + menu_id + ']').prop('checked', true);
                            });
                        }
                    }
                });
                $el.find("#menu_tbl").bootstrapTable({
                    columns: [
                        {
                            field: 'father_menu', title: '主菜单', width: '20%', formatter: formatFatherMenu, events: {
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
                })
                this.commonModel.search('admin.role', {}, 'getRole');
                this.commonModel.search('admin.menu', { state: '1'}, 'getMenu');
                return this;
            },
            showRoleModal: function () {
                var $modal = $('#role_modal');
                $modal.attr('type', 'add');
                $modal.find('.modal_title').html('添加角色')
                $modal.find('input[type=text],textarea').val('');
                $modal.find("input[name='edit_role_type'][value='10']").uCheck('check');
                $modal.modal({
                    width: 700
                });
            },
            renderRole: function (res) {
                if (res.errorNo == 0) {
                    $(this.el).find("#role_tbl").bootstrapTable('load', res.rows)
                }
            },
            submitRole: function () {
                var $modal = $('#role_modal'), param = {};
                var type = $modal.attr('type'),
                    name = $('#role_name').val(),
                    remark = $('#role_remark').val(),
                    state = $("input[name='edit_role_type']:checked").val();
                if (name == '') {
                    $('#role_operate_fail>p').html('角色名称不能为空！');
                    $('#role_operate_fail').removeClass('am-hide')
                    window.setTimeout(function () {
                        $('#role_operate_fail').addClass('am-hide')
                    }, 2000)
                    return;
                }
                param['role_name'] = name;
                param['remark'] = remark;
                param['state'] = state;
                if (type == 'add') {
                    this.model.submitRole('post', param, 'submitRole')
                }
                else {
                    var id = $modal.attr('role_id');
                    this.model.submitRole('patch', param, 'submitRole', id)
                }
            },
            submitCallBack: function (res) {
                var $modal = $('#role_modal');
                $('.am-alert').addClass('am-hide');
                var type = $('#role_modal').attr('type');
                if (res.errorNo == 0 && res.state == 100) {
                    $('#role_operate_su>p').html(type == 'add' ? '添加角色成功！' : '编辑角色成功！');
                    $('#role_operate_su').removeClass('am-hide');
                    window.setTimeout(function () {
                        $('#role_operate_su').addClass('am-hide')
                    }, 2000);
                    $modal.modal('close');
                    this.commonModel.search('admin.role', {enterprise_id: sessionStorage.getItem('enterprise_id')}, 'getRole');
                }
                else {
                    $('#role_operate_fail>p').html(type == 'add' ? '添加角色失败！' : '编辑角色失败！');
                    $('#role_operate_fail').removeClass('am-hide')
                    window.setTimeout(function () {
                        $('#role_operate_fail').addClass('am-hide')
                    }, 3000)
                }
            },
            deleteCallback: function (res) {
                if (res.state == 100) {
                    this.commonModel.search('admin.role', {enterprise_id: sessionStorage.getItem('enterprise_id')}, 'getRole');
                }
                else {
                    alert('删除出错')
                }
            },
            renderMenu: function (res) {
                if (res.errorNo == 0) {
                    var menus = res.rows, fatherMenus = [], newMenus = [];
                    fatherMenus = menus.filter(function (menu) {
                        return menu['father_menu_id'] == 0;
                    });
                    fatherMenus.forEach(function (menu) {
                        var m = {}, id = menu['menu_id'];
                        m.father_menu = menu['menu_name'];
                        m.menu_id = id;
                        m.child_menu = menus.filter(function (child) {
                            return child['father_menu_id'] == id
                        })
                        newMenus.push(m);
                    })
                }
                $(this.el).find("#menu_tbl").bootstrapTable('load', newMenus)
            },
            saveMenu: function () {
                var menus = $(this.el).find('#menu_tbl input[type=checkbox]:checked'), ids = [];
                var roles = $(this.el).find('#role_tbl').bootstrapTable('getAllSelections');
                if (roles.length == 0) {
                    var $bd = $('#save_menu_alert .am-modal-bd');
                    $bd.html('请选择角色！')
                    $('#save_menu_alert').modal();
                    return;
                }
                menus.each(function (i, ele) {
                    ids.push(ele.value)
                })
                var roleMenus = ids.sort(function(a,b){return a>b?1:-1}).join(',');
                var param = $.extend({},roles[0]);
                delete param.checked;
                delete param.index;
                param.menus = roleMenus
                this.model.submitRole('patch', param, 'roleSaveMenu', param['id'])
            },
            saveMenuCallback: function (res) {
                var $bd = $('#save_menu_alert .am-modal-bd');
                if (res.state == '100') {
                    $bd.html('保存菜单成功！')
                }
                else {
                    $bd.html('保存菜单失败！')
                }
                $('#save_menu_alert').modal()
            }
        });
        return view;
    });