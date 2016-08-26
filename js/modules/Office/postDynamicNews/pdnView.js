/**
 * Created by insomniahl on 16/5/10.
 */
define(['txt!../../Office/postDynamicNews/postDynamicNews.html',
        '../../Office/postDynamicNews/pdnModel',
        'jquery', 'backbone', "jctLibs", 'amazeui'],
    function (Template, Model, $, Backbone, jctLibs, amazeui) {
        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new Model();
                //侦听事件
                this.listenTo(this.model, "postDn", this.PostsendInfo);
            },
            PostsendInfo: function (res) {
                if (res.errorNo == 0) {
                    if (res.status == 100) {
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
                'focus #title': 'clearError'
            },
            regTitle: function () {
                var title = $("#title").val();
                if (!(title.match(/^[\u4e00-\u9fa5_a-zA-Z0-9\,\s]{3,25}$/))) {
                    $('#title_error').removeClass('am-hide');
                    return false;
                }
            },
            clearError: function () {
                $('#title_error').addClass('am-hide')
            },
            //重置按钮
            resetBtn: function () {
                $("#title").val('');
                $(".wangEditor-textarea").html('');
                $("#send_date").val('');
            },
            //上传按钮
            sendBtn: function () {
                var title = $("#title").val();
                var content = $("#send_content").val();
                if (title.trim() == '') {
                    alert('新闻标题不可为空！');
                    return false;
                }
                if (!(title.match(/^[\u4e00-\u9fa5_a-zA-Z0-9\,\s]{3,25}$/))) {
                    alert('新闻标题仅允许汉字、数字、英文字母、空格以及逗号！');
                    return false;
                }
                var header=['<!doctype html>',
                    '<html lang="zh-CN"> ',
                    '<head> <meta charset="UTF-8"> ',
                    '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">',
                    '<meta http-equiv="X-UA-Compatible" content="ie=edge">',
                    '<title>'+sessionStorage.getItem('enterprise_name')+'新闻</title>',
                    '<style type="text/css">.content{width:960px;margin: 20px auto;line-height: 1.6rem} .header{margin:40px auto 0;text-align: center;}</style>',
                    '</head><body><h2 class="header">'+title+'</h2><div class="content"> '].join('');
                var footer='</div></body></html>';
                var html= header+content+footer;
                this.model.postDn(title, html);
            },
            render: function () {
                $(this.el).html(Template);
                $(this.el).find("#send_date").datepicker();
                $(this.el).find("#send_date").val('');
                $(this.el).find('#send_content').wangEditor({
                    'menuConfig': [
                        ['fontFamily', 'bold', 'setHead'],
                        ['list', 'justify'],
                        ['createLink', 'insertHr', 'undo']
                    ]
                });
                return this;
            }
        });
        return view;
    })
