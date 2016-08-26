/**
 * Created by xiangzx on 15-11-23.
 */
define(['backbone'], function (Backbone) {
    var hospitalModel = new Backbone.Model.extend({
        defaults:{
            enterprise_id:"",//机构ID
            enterprise_name:"",//机构全名
            enterprise_code:"",//机构拼音码
            nationality:"",//机构国籍
            province:"",//机构省所在地
            city:"",//机构市所在地
            area:"",//机构所在区域
            streat:"",//机构所在街道
            addr:"",//机构详细地址
            landline_tel:"",//机构固话
            consult_tel:"",//机构咨询电话
            enterprise_type:"",//机构类型
            enterprise_level:"",//机构评级
            enterprise_abs:"",//机构简介
            speciality:"",//机构特长标签
            scale:"",//机构规模
            bank_account:"",//机构银联帐号
            alipay_account:"",//机构支付宝帐号
            weichet_account:"",//机构微信帐号
            admin_id:"",//管理员登录ID
            admin_tel:"",//管理员固定电话
            admin_phone:"",//管理员手机号
            admin_qq:"",//管理员QQ号
            admin_email:"",//管理员邮箱
            admin_wechat:"",//管理员微信
            license_no:"",//营业执照编号
            award_enterprise:"",//营业执照颁发机关
            license_photo:"",//营业执照副本照片
            corporation_name:"",//法人姓名
            corporation_no:"",//法人证件号
            corporation_photo:"",//法人手持证件照
            check_state:"",//是否通过审核
            state:"",//状态
            register_time:"",//机构注册时间
            agreement_id:"",//合同ID
            start_date:"",//合同开始时间
            end_date:"",//合同结束时间
            agreement_count:""//合同约定使用帐号数量
        },
        idAttribute:""
    });

    var hostitalCollection = new Backbone.Collection.extend({
        model: hospitalModel,
        url: "http://URL/hospital/"
    });
})
