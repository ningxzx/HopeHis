define(['txt!../../Setting/myClinic/myClinic.html',
        '../../Common/commonModel',
        'handlebars','backbone','bootstrapTable'],
    function (Template,commonModel,Handlebars,backbone){
        var data=[
            {
                "name":"",
                "phone":"",
                "email":""
            }
        ]
        Handlebars.registerHelper('showImage', function (url) {
            if (url) {
                return 'http://114.55.85.57:8081'+url;
            }
        });
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