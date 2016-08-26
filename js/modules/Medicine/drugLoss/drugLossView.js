define(['txt!../../Medicine/drugLoss/drugLoss.html',
        'handlebars','backbone','bootstrapTable'],
    function (Template,Handlebars,backbone){
        var view = Backbone.View.extend({
            render:function() {
                $(this.el).html(Template);

                this.$el.find("#xzx").bootstrapTable({
                    data: {}
                });
                return this;
            }
        });
        return view;
    });
