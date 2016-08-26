//="{field:'"&LOWER(B1)&"',title:'"&C1&"'},"
define(['txt!../../Setting/recipeFeeSet/recipeFeeSet.html',
        '../../Common/basicTable',
        'handlebars', 'backbone', 'jctLibs'],
    function (Template, basicTable, Handlebars, backbone, jctLibs) {

        var cols= [
            {field: "", title: "",checkbox:true},
            {field: "index", title: "序号",width:"5%", formatter: jctLibs.generateIndex},
            {field: 'opt', title: '操作',width:"15%",formatter:jctLibs.opt},
            {field: 'sorate_id', title: '费用名称'},
            {field: 'operator_name', title: '金额'},
            {field: 'goods_fee', title: '处方类型'},
            {field: 'sorate_date', title: '状态'},
            {field: 'check_state', title: '创建时间'}
        ];


        var view = Backbone.View.extend({
            initialize: function () {
            },
            events: {
                "click .row_remove": "removeSupplier",
                "click .row_edit": "editSupplier",
                "click #add_supl": "addSupplier",
                "click #search_supl": "searchSupplier",
                "click .add_tool": "addSupplier",
                "click #edit_reset": "resetEdit",
                "click #edit_cancel": "cancelEdit",
                "click #edit_confirm": "confirmEdit"
            },
            addSupplier: function () {
                var $info = $(this.el).find(".supplier_info"),
                    $title = $info.find(".supplier_info_title");
                //如果上次是编辑状态,重置明细,将明细改为添加状态;如果上一次是添加状态且未提交,则不进行重置
                $info.data("rowData", "");
                if ($info.attr("edit_type") !== "add") {
                    this.resetEdit();
                    $info.attr("edit_type", "add");
                }
                $title.html("新增供应商");
                $info.show("slow");
            },
            editSupplier: function (e) {
                var suppliers = $(this.el).find("#supplier_table").bootstrapTable("getData"),
                    index = $(e.target).closest("tr").data("index"),
                    row = suppliers[index],
                    $info = $(this.el).find(".supplier_info"),
                    $title = $info.find(".supplier_info_title");
                //把数据赋给info,将明细改为编辑状态,编辑状态下始终重置明细
                $info.data("rowData", row);
                if ($info.attr("edit_type") !== "edit") {
                    $info.attr("edit_type", "edit");
                }
                this.resetEdit();
                $title.html("编辑供应商信息");

                //赋值给编辑组件
                $info.find("#supplier_name").val(row.supplier_name);
                $info.find("#bank_accounts").val(row.bank_accounts);
                $info.find("#apliy_accounts").val(row.apliy_accounts);
                $info.find("#contact_people").val(row.contact_people);
                $info.find("#contact_phone").val(row.contact_phone);
                $info.find("#contact_mobile").val(row.contact_mobile);
                $info.show("slow");
            },
            removeSupplier: function (e) {
                var suppliers = $(this.el).find("#supplier_table").bootstrapTable("getData"),
                    index = $(e.target).closest("tr").data("index");
                var row = suppliers[index];
                this.supplier.set("id", row.supplier_id);
                this.supplier.deleteSupplier(row.supplier_id);
            },
            resetEdit: function () {
                var $info = $(this.el).find(".supplier_info");
                $info.find("input:text").val("");
            },
            cancelEdit: function () {
                var $info = $(this.el).find(".supplier_info");
                $info.hide("fast");
            },
            confirmEdit: function () {
                var $info = $(this.el).find(".supplier_info"), supplier = this.supplier;
                supplier.set("supplier_name", $info.find("#supplier_name").val());
                supplier.set("bank_accounts", $info.find("#bank_accounts").val());
                supplier.set("apliy_accounts", $info.find("#apliy_accounts").val());
                supplier.set("contact_people", $info.find("#contact_people").val());
                supplier.set("contact_phone", $info.find("#contact_phone").val());
                supplier.set("contact_mobile", $info.find("#contact_mobile").val());
                if ($info.attr("edit_type") !== "add") {
                    supplier.save();
                }
                else {
                    supplier.saveLevel();
                }
            },
            renderData: function (result) {
                if (result.errorNo === 0) {
                    var fees = result.resData;
                    $(this.el).find("#recipe_fee_table").bootstrapTable("load", fees);
                }
                else {
                    $(this.el).find("#recipe_fee_table").bootstrapTable("load", []);
                }
            },
            render: function () {
                $(this.el).html(Template);
                basicTable($(this.el).find("#recipe_fee_table"), cols, []);
                $(this.el).find("input:radio").uCheck("enable");
                $(this.el).find("select").chosen({width: "100%",disable_search_threshold: 100});
                return this;
            }
        });
        return view;
    });
