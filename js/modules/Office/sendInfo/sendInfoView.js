/**
 * Created by insomniahl on 16/5/10.
 */
define(['txt!../../Office/sendInfo/sendInfo.html',
        '../../Office/sendInfo/sendInfoModel',
        'jquery', 'backbone', "jctLibs", 'amazeui'],
    function (Template, sendInfoModel, $, Backbone, jctLibs, amazeui) {
        var view = Backbone.View.extend({
            initialize: function () {
                this.renderRecipients();
                this.model = new sendInfoModel();

                //侦听事件
                this.listenTo(this.model, "postsendInfo", this.PostsendInfo);

                this.listenTo(this.model, "getsend", this.Getsend)
            },
            Getsend: function (res) {
                if(res.errorNo==0) {
                    var arr = res.rows;
                    arr.forEach(function (supplier) {
                        $('#recipients')
                            .append($('<option></option>').val(supplier['account_id']).html(supplier['user_name']))
                            .trigger('chosen:updated');
                    })
                }
            },
            PostsendInfo: function (res) {
                if (res.errorNo == 0) {
                    if (res['rows'].state == 100) {
                        alert('提交成功');
                        this.resetBtn();
                    } else {
                        alert('提交失败');
                    }
                }
            },
            events: {
                "click #reset_btn": "resetBtn",
                "click #send_btn": "sendBtn",
                "blur #title": "regTitle",
                'focus #title':'clearError'
            },
            regTitle: function () {
                var title = $("#title").val();

                if(!(title.match(/^[\u4e00-\u9fa5_a-zA-Z0-9\,\s]{3,25}$/))){
                    $('#title_error').removeClass('am-hide');
                    return false;
                }
            },
            clearError: function () {
                $('#title_error').addClass('am-hide')
            },
            //初始化收件人
            renderRecipients: function () {
                $.ajax({
                    type: "",
                    url: "",
                    data: ""
                }).done(function (response) {

                }).fail(function (error) {

                });
            },
            //重置按钮
            resetBtn: function () {
                $("#title").val('');
                $("#recipients").val('').trigger('chosen:updated');
                $(".wangEditor-textarea").html('');
                $("#send_date").val('');
            },
            //上传按钮
            sendBtn: function () {
                var title = $("#title").val();
                var recs= $("#recipients").val();
                if(!recs){
                    alert('接收人列表不能为空！');
                    return false;
                }
                var recipient =recs.join(',');
                var content = $("#send_content").val();
                if(title.trim()==''){
                    alert('通知标题不可为空！');
                    return false;
                }
                if(!(title.match(/^[\u4e00-\u9fa5_a-zA-Z0-9\,\s]{3,25}$/))){
                    alert('通知标题仅允许汉字、数字、英文字母、空格以及逗号！');
                    return false;
                }
                this.model.postsendInfo(title, recipient, content);

            },
            render: function () {
                $(this.el).html(Template);
                $(this.el).find("#send_date").datepicker();
                $(this.el).find("#send_date").val('');
                $(this.el).find("#recipients").chosen({
                    width: "100%",
                    no_results_text: '没有找到匹配的项！',
                    placeholder_text_multiple: '选择用户',
                    disable_search_threshold: 10
                });
                $(this.el).find('#send_content').wangEditor({
                    'menuConfig': [
                        ['fontFamily', 'bold', 'setHead'],
                        ['list', 'justify'],
                        ['createLink', 'insertHr', 'undo']
                    ]
                });
                this.model.getsend();
                return this;
            }
        });
        return view;
    })
;
