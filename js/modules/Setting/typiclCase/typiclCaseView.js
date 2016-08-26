define(['txt!../../Setting/typiclCase/typiclCase.html',
        '../../Setting/typiclCase/typiclCaseModel',
        '../../Setting/typiclCase/typiclCaseCollection',
        'handlebars','backbone','bootstrapTable'],
    function (Template,typiclCaseModel,typiclCaseCollection,Handlebars,backbone){

        var view = Backbone.View.extend({
            initialize: function () {

                this.typiclCaseModel=new typiclCaseModel;

                this.typiclCaseCollection=new typiclCaseCollection;

                //this.listenTo(this.typiclCaseCollection,"detail",this.settleQuery);

            },
            render:function() {
                $(this.el).append(Template);

                return this;
            },
            events:{
                "click #settle_sub":"seeAbout"
            },
            seeAbout:function(){

            }
        });
        return view;
    });

