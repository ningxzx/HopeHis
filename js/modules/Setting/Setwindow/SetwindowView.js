define(['txt!../../Setting/Setwindow/Setwindow.html',
        '../../Setting/Setwindow/SetwindowModel',
        'handlebars','backbone','bootstrapTable'],
    function (Template,SetwindowModel,Handlebars,backbone){
        var data={
            re_people:[
                {
                    "name":"玉林制药",
                    "phone":"13023655343",
                    "email":"2113234@qq.com"
                }
            ],
            clinic:[
                {
                    "name":"华西制药",
                    "num":"ZH201511110012",
                    "address":"成都市 天府大道中段",
                    "max_user":"10",
                    "contract_start":"2013/10/20 13:30",
                    "contract_period":"1"
                }
            ]
        }


        var view = Backbone.View.extend({
            render:function() {
                var data_html = Handlebars.compile(Template)(data);
                $(this.el).html(data_html);
                return this;
            }
        });
        return view;
    });