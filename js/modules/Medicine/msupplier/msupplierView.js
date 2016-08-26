//="{field:'"&LOWER(B1)&"',title:'"&C1&"'},"
define(['txt!../../Medicine/msupplier/msupplier.html',
        '../../Medicine/msupplier/supplierModel',
        '../../Common/commonModel',
        'handlebars', 'backbone', 'jctLibs'],
    function (Template, supplierModel, commonModel, Handlebars, Backbone, jctLibs) {
        var formatState = function (value) {
            return {'10': '启用', '00': '禁用'}[value]
        }
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new supplierModel();
                this.commonModel = new commonModel();

                /*获取所有供应商*/

                /***侦听回调事件***/
                this.listenTo(this.model, "addSupplier", this.addCallBack)
                this.listenTo(this.commonModel, "getSupplier", this.getCallBack)
            },
            events: {
                "click .row_edit": "editSupplier",
                "click #add_supl": "addSupplier",
                "click #supplier_search_btn": "searchSupplier",
                "click #add_tool": "addSupplier",
                'click .reset_search':'resetSearch',
                "click #edit_reset": "resetEdit",
                "click #edit_cancel": "cancelEdit",
                "click #edit_confirm": "confirmEdit"
            },
            resetSearch: function () {
                $(this.el).find('input').val('');
                $("#supplier_temp_type").val('all');
                this.commonModel.search('comm.suppliers_dict', {'enterprise_id': sessionStorage.getItem('enterprise_id')}, 'getSupplier')

            },
            searchSupplier: function () {
                var param = {};
                param['enterprise_id'] = sessionStorage.getItem('enterprise_id');
                var name=$('#search_supplier_name').val();
                var person=$('#search_supplier_contact').val();
                var tel=$('#search_supplier_tel').val();
                var type=$("#supplier_temp_type").val();
                if(name){
                    param['suppliers_name']=name;
                }
                if(person){
                    param['contact_person']=person;
                }
                if(tel){
                    param['contact_tel']=person;
                }
                if(type!='all'){
                    param['state']=person;
                }
                this.commonModel.search('comm.suppliers_dict',param, 'getSupplier')
            },
            addSupplier: function () {
                var $modal = $('#supplierModal'),
                    $title = $modal.find(".supplier_info_title");
                //如果上次是编辑状态,重置明细,将明细改为添加状态;如果上一次是添加状态且未提交,则不进行重置
                $modal.data("rowData", "");
                if ($modal.attr("type") !== "add") {
                    this.resetEdit();
                    $modal.attr("type", "add");
                }
                $title.html("新增供应商");
                $modal.modal({
                    width: 750
                });
            },
            editSupplier: function (e) {
                var suppliers = $(this.el).find("#supplier_tbl").bootstrapTable("getData"),
                    index = $(e.target).closest("tr").data("index"),
                    row = suppliers[index],
                    $info = $(this.el).find(".supplier_info"),
                    $title = $info.find(".supplier_info_title");
                //把数据赋给info,将明细改为编辑状态,编辑状态下始终重置明细
                $info.data("rowData", row);
                if ($info.attr("type") !== "edit") {
                    $info.attr("type", "edit");
                }
                this.resetEdit();
                $title.html("编辑供应商信息");

                //赋值给编辑组件
                $info.attr('supplier_id', row['id'])
                $info.find("#supplier_name").val(row.suppliers_name);
                $info.find("#contact_people").val(row.contact_person);
                $info.find("#contact_phone").val(row.contact_tel);
                $info.find("#supplier_address").val(row.suppliers_addr);
                $("input[name='supplier_state'][value=" + row['state'] + "]").attr("checked", 'checked');
                $info.modal({
                    width: 750
                });
            },
            resetEdit: function () {
                var $info = $(this.el).find(".supplier_info");
                $info.find("input:text").val("");
            },
            cancelEdit: function () {
                var $info = $(this.el).find(".supplier_info");
                $info.modal("close");
            },
            confirmEdit: function () {
                var $info = $(this.el).find(".supplier_info"), id = $info.attr('supplier_id');
                var supplier_name = $info.find("#supplier_name").val();
                var contact_people = $info.find("#contact_people").val();
                var contact_phone = $info.find("#contact_phone").val();
                var suppliers_addr = $info.find("#supplier_address").val();
                var state = $("input[name='supplier_state']:checked").val();
                if ($info.attr("type") !== "add") {
                    this.model.editSupplier(id, {
                        suppliers_name: supplier_name,
                        contact_person: contact_people,
                        contact_tel: contact_phone,
                        suppliers_addr: suppliers_addr,
                        state: state
                    })
                }
                else {
                    this.model.addSupplier({
                        suppliers_name: supplier_name,
                        contact_person: contact_people,
                        enterprise_id: sessionStorage.getItem('enterprise_id'),
                        contact_tel: contact_phone,
                        suppliers_addr: suppliers_addr,
                        state: state
                    })
                }
            },
            getCallBack: function (res) {
                var $table = $(this.el).find("#supplier_tbl");
                if (res.errorNo == 0) {
                    $table.bootstrapTable('load', res.rows)
                }
                else {
                    $table.bootstrapTable('load', [])
                }
            },
            addCallBack: function (res) {
                $('.am-alert').addClass('am-hide');
                var $modal = $('#supplierModal'), type = $modal.attr('type'), $su = $('#supplier_operate_su'), $fail = $('#supplier_operate_fail');
                if (res.type == 'delete') {
                    type = 'delete';
                }
                if (res.errorNo == 0 && res.state == 100) {
                    $('#supplier_operate_su>p').html(type == 'add' ? (type == 'delete' ? '删除供应商成功' : '添加供应商成功！') : '编辑供应商成功！');
                    $su.removeClass('am-hide');
                    window.setTimeout(function () {
                        $su.addClass('am-hide')
                    }, 2000);
                }
                else {
                    $('#supplier_operate_fail>p').html(type == 'add' ? (type == 'delete' ? '删除供应商失败' : '添加供应商失败！') : '编辑供应商失败！');
                    $fail.removeClass('am-hide')
                    window.setTimeout(function () {
                        $fail.addClass('am-hide')
                    }, 2000)
                }
                this.commonModel.search('comm.suppliers_dict', {'enterprise_id': sessionStorage.getItem('enterprise_id')}, 'getSupplier')
                $modal.modal('close');
            },
            render: function () {
                var _this = this;
                $(this.el).html(Template);
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("#supplier_tbl").bootstrapTable({
                    columns: [{field: "index", title: "序号", formatter: jctLibs.generateIndex},
                        {field: "suppliers_name", title: "供应商名称"},
                        {field: "contact_person", title: "联系人"},
                        {field: "contact_tel", title: "联系人电话"},
                        {field: "suppliers_addr", title: "地址"},
                        {field: "state", title: "状态", formatter: formatState},
                        {
                            field: 'operate', title: '操作', formatter: jctLibs.operateFormatter, events: {
                            "click .row_remove": function (e, value, row, index) {
                                _this.model.deleteSupplier(row['id']);
                            }
                        }
                        }],
                    data: [],
                    sortName: 'state',
                    sortOrder: 'desc',
                    rowStyle: function rowStyle(row, index) {
                        if (row['state'] == '00') {
                            return {
                                css: {"color": "red"}
                            }
                        }
                        else {
                            return {
                                css: {"color": "black"}
                            }
                        }
                    }
                });
                this.commonModel.search('comm.suppliers_dict', {'enterprise_id': sessionStorage.getItem('enterprise_id')}, 'getSupplier')
                return this;
            }
        });
        return view;
    });
