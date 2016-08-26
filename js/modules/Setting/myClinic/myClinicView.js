define(['txt!../../Setting/myClinic/myClinic.html',
        '../../Common/commonModel',
        'handlebars','backbone','bootstrapTable'],
    function (Template,commonModel,Handlebars,backbone){
        //var data={
        //    re_people:[
        //        {
        //            "name":"同仁堂",
        //            "phone":"234234",
        //            "email":"@@@@"
        //        }
        //    ],
        //    clinic:[
        //        {
        //            "name":"华西制药",
        //            "num":"ZH201511110012",
        //            "address":"成都市 天府大道中段",
        //            "max_user":"10",
        //            "contract_start":"2013/10/20 13:30",
        //            "contract_period":"1"
        //        }
        //    ]
        //};
        var data=[
            {
                "name":"",
                "phone":"",
                "email":""
            }
        ]

        var view = Backbone.View.extend({
            initialize: function () {
                //绑定入库记录集合
                this.Model=new commonModel();

                //侦听事件
                this.listenTo(this.Model, "clinicData", this.renderinvet);
            },
            renderinvet:function(data){
              console.log(data['rows'][0])
                var arr=data['rows'];
                var data_html = Handlebars.compile(Template)(arr);
                $(this.el).html(data_html);
            },
            render:function() {
                var data_html = Handlebars.compile(Template)(data);
                $(this.el).html(data_html);
                var jsonInfo={
                    'enterprise_id': sessionStorage.getItem('enterprise_id')
                };
                //this.commonModel.search('comm.suppliers_dict', {}, 'getSupplier')

                this.Model.search('customer.enterprise_info',jsonInfo,'clinicData');
                return this;
            }
        });
        return view;
    });