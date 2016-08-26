//=LOWER(B1)&":"&""""&""&""""&",//"&C1
//字段中文名作为注释
//属性名称为下划线，英文小写
//idAttribute 默认为''

define(["backbone"], function (Backbone) {
    // 执行项目Model，包含诊疗项目,检查项目,检验项目
    var execitemModel = Backbone.Model.extend({
        defaults: {
            enterprise_id: "",//机构ID
            enterprise_name: "",//机构全称
            enterprise_code: "",//机构拼音码
            item_id: "",//执行项目ID
            item_name: "",//执行项目名称
            item_code: "",//执行项目编码
            item_cost: "",//执行项目成本
            item_type: "",//执行项目类型
            item_spec: "", //项目规格
            item_num: "",//项目数量
            orig_fee: "",//应收费用
            charge_fee: "",//实收费用
            item_instrument: "",//执行子项使用仪器
            item_detail: "",//执行子项描述
            create_account: "",//创建检查项目帐号
            create_name: "",//创建人员的名称
            create_code: "",//创建人员的拼音码
            is_again_discount: ""//是否允许折上折
        }
    });


    return execitemModel;

});
