/**
 * Created by insomniahl on 15/11/23.
 * 补交欠款
 */
define(["backbone"], function (Backbone) {
    var afterPayModel = Backbone.Model.extend({
        defaults:{
            credit_record_id:" ",//赊账记录ID
            entity_id:" ",//实体ID
            entity_name:" ",//实体名称
            entity_code:" ",//实体拼音码
            pay_area_id:" ",//收费点ID
            pay_area_name:" ",//收费点名称
            operator_id:" ",//收费员ID
            operator_name:" ",//收费员名称
            operator_code:" ",//收费员拼音码
            patient_id:" ",//患者ID
            patient_name:" ",//患者名称
            patient_code:" ",//患者拼音码
            credit_date:" ",//赊账日期
            ori_credit_fee:" ",//原始赊账金额
            actul_repayment_fee:" ",//实际应还金额
            repayment_fee:" ",//以还金额
            cash_pay:" ",//现金还款金额
            wechet_pay:" ",//微信还款金额
            wechet_account:" ",//微信支付帐号
            ali_pay:" ",//支付宝还款金额
            ali_pay_account:" ",//支付宝支付帐号
            bank_card_pay:" ",//银行卡还款金额
            bank_card_id:" ",//还款银行卡卡号
            bank:" ",//还款银行卡开户银行
            heath_card_type:" ",//医保类型
            heath_card_pay:" ",//医保支付金额
            heath_card_id:" ",//医保支付卡卡号
            round_fee:" ",//舍入金额
            discount_fee:" ",//优惠金额
            clear_date:" ",//帐务还清日期
            clear_type:" ",//帐务还清的还款方式
            charge_record_id:" ",//收费记录ID
            last_pay_date:" ",//最后一次还款日期
            last_pay_fee:" ",//最后一次还款金额
            last_operator_id:" ",//最后一次还款收费人员ID
            last_operator_name:" ",//最后一次还款收费人员姓名
            last_operator_code:" "//最后一次还款收费人员拼音码
        }
    });

    return afterPayModel;
});
