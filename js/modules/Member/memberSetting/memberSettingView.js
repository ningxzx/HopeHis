define(['txt!../../Member/memberSetting/memberSetting.html',
        "../../Member/memberSetting/memberLevelModel",
        'handlebars', 'backbone', '../../Common/basicTable',"jctLibs"],
    function (Template, mLevModel, Handlebars, backbone, basicTable,jctLibs) {
        var opt = function (value, row, index) {
            return [
                '<a class="level_edit" href="javascript:void(0)" title="detail">',
                '编辑',
                '</a>  ',
                '<a class="row_remove" href="javascript:void(0)" title="detail">',
                '删除',
                '</a>  '
            ].join('');
        };
        var generateState= function (value, row, index) {
            //return value?'启用':'禁用';
            if(value){
                return '启用';
            }else{
                return ['<a style="color:#f59490;text-decoration: none;" ' +
                'href="javascript:void(0)" >禁用'].join('');
            }

        };

        var view = Backbone.View.extend({
            initialize: function () {
                this.model=new mLevModel();

                this.listenTo(this.model, "getsetrecord", this.getSetrecord);

                this.listenTo(this.model, "postMember", this.PostMember);

                //this.listenTo(this.model, "postUplevelicon", this.PostUplevelicon);

                this.listenTo(this.model, "getdele", this.Getdele);

                this.listenTo(this.model, "postedit", this.Postedit);
            },
            Postedit:function(data){
                this.model.getsetrecord();
            },
            Getdele:function(data){
                if(data['rows'].state=="100"){
                    this.model.getsetrecord();
                }
            },
            PostMember:function(data){
                //console.log(data);
                if(data['rows'].state=="100"){
                    alert('成功');
                    var $levelInfo = $(this.el).find(".am-modal");
                    $levelInfo.find("input:text,input[type=number]").val("");
                    $levelInfo.find('input:radio').attr('checked', false);
                    this.model.getsetrecord();
                }
            },
            getSetrecord:function(data){
                //console.log(data)
                this.$el.find("#member_level_table").bootstrapTable('load',data.rows);
            },
            events: {
                "click #add_level": "addLevel",
                "click #refresh_level": "refreshLevel",
                "click #edit_reset": "resetEdit",
                //"click .level_edit": "editLevel",
                //"click #edit_cancel": "cancelEdit",
                "click #edit_confirm": "confirmEdit",

            },
            addLevel: function () {
                var that=this;
                var $levelInfo = $(this.el).find(".am-modal"),
                    $title = $levelInfo.find(".x_z");
                $levelInfo.find("#level_mark").removeAttr("newId");
                //如果上次是编辑状态,重置明细,将明细改为添加状态;如果上一次是添加状态且未提交,则不进行重置
                if ($levelInfo.attr("edit_type") !== "add") {
                    this.resetEdit();
                    $levelInfo.attr("edit_type", "add");
                }
                $title.html("新增会员等级");
                $(this.el).find("#alert_modal").modal({ width:960,});


            },

            refreshLevel: function () {
                //this.mlCollection.getMemberLevels();
                this.model.getsetrecord();
            },
            editLevel: function (row) {
                var that=this;
                //var levels = $(this.el).find("#member_level_table").bootstrapTable("getData"),
                //    index = $(e.target).closest("tr").data("index"),
                //    row = levels[index];
                var   $levelInfo = $(this.el).find(".am-modal"),
                    $title = $levelInfo.find(".level_info_title");
                //将明细改为编辑状态,编辑状态下始终重置明细
                if ($levelInfo.attr("edit_type") !== "edit") {
                    $levelInfo.attr("edit_type", "edit");
                }
                this.resetEdit();
                $title.html("编辑会员等级");

                var $levelInfo = $(this.el).find(".am-modal");
                $levelInfo.find(".x_z").html('编辑会员等级');
                    $levelInfo.find("#level_name").val(row.level_name);
                    $levelInfo.find("#level_id").val(row.level);
                    $levelInfo.find("#level_discount").val(row.discount);
                    $levelInfo.find("#level_score").val(row.points_condition);
                    $levelInfo.find("#pay_limit").val(row.lowest_consume_pay);
                    $levelInfo.find("#level_mark").val(row.remarks);
                    $levelInfo.find("input:radio[name=level_icon][value=" + row.icon_name + "]").uCheck('check');
                    $levelInfo.find("#level_state").val(row.level_state).trigger('chosen:updated') ;
                $levelInfo.find("#level_mark").attr("newId",row.id);
                $(this.el).find("#alert_modal").modal({ width:960,});

            },
            resetEdit: function () {

                var $levelInfo = $(this.el).find(".am-modal");
                $levelInfo.find("input:text,input[type=number]").val("");
                $levelInfo.find('input:radio').attr('checked', false);
            },
            cancelEdit: function () {
                var $levelInfo = $(this.el).find(".am-modal");
                $levelInfo.hide("fast");
            },
            confirmEdit: function () {
                var $levelInfo = $(this.el).find(".am-modal"),
                    level_name=$levelInfo.find("#level_name").val(),
                    level_id=$levelInfo.find("#level_id").val(),
                    level_discount=$levelInfo.find("#level_discount").val(),
                    level_score=$levelInfo.find("#level_score").val(),
                    pay_limit=$levelInfo.find("#pay_limit").val(),
                    level_mark=$levelInfo.find("#level_mark").val(),
                    stype=$levelInfo.find("#level_state").val(),
                    level_icon=$levelInfo.find(".member_rank_icon input:checked").val(),
                    iD=$levelInfo.find("#level_mark").attr("newId");


                if ($levelInfo.attr("edit_type") == "add") {
                    this.model.postMember(level_id,level_name,level_discount,pay_limit,
                        level_score,stype,level_mark,level_icon,iD);
                }else if ($levelInfo.attr("edit_type") == "edit") {
                    this.model.postedit(level_id,level_name,level_discount,pay_limit,
                                level_score,stype,level_mark,level_icon,iD);
                }
            },
            renderData: function (result) {
                if (result.errorNo === 0) {
                    var memberLevels = result.resData;
                    $(this.el).find("#member_level_table").bootstrapTable("load", memberLevels)
                }
                else {
                    $(this.el).find("#member_level_table").bootstrapTable("load", {})
                }
            },
            render: function () {
                var that=this;
                $(this.el).append(Template);

                this.$el.find("#member_level_table").bootstrapTable({
                    columns: [
                        {field: 'opt', title: '操作', formatter: opt,events:{
                            'click .row_remove': function(e, value, row, index){
                                $(".delete_alert").attr('level_id',row.id)
                                $(".delete_alert").modal({
                                    width:600,
                                    onConfirm: function() {
                                        that.member.delmember($(".delete_alert").attr('level_id'))
                                    },
                                    onCancel: function() {
                                        $(".delete_alert").modal('close');
                                    },
                                    closeViaDimmer:false
                                });
                            },
                            'click .level_edit': function(e, value, row, index){
                                that.editLevel(row);
                            }
                        }},
                        {field: 'level', title: '会员等级'},
                        {field: 'level_name', title: '等级名称'},
                        //{field: 'icon_name', title: '图标'},
                        {field: 'discount', title: '折扣'},
                        {field: 'lowest_consume_pay', title: '最低消费额'},
                        {field: 'points_condition', title: '积分升级条件'},
                        {field: 'level_state', title: '状态',formatter:generateState},
                        {field: 'remarks', title: '备注'},
                    ],
                    data: [],

                });
                $(this.el).find("input:radio").uCheck("enable");
                $(this.el).find("select").chosen({width: "100%",disable_search_threshold: 100});
                 this.model.getsetrecord();
                return this;
            }
        });
        return view;
    });
