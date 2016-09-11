define(['txt!../../Setting/checkSet/checkSet.html',
        '../../Setting/checkSet/checkSetModel',
        'jctLibs', '../../Common/commonModel',
        'handlebars', 'backbone', 'bootstrapTable'],
    function (Template, checkSetModel, jctLibs, commonModel, Handlebars, backbone) {

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


        var view = Backbone.View.extend({
            initialize: function () {
                this.model = new checkSetModel();

                this.commonM = new commonModel();

                /***侦听回调事件***/
                this.listenTo(this.commonM, "checkTbl", this.renderData);
                this.listenTo(this.commonM, "dgns_tbl", this.renderdgns);
                this.listenTo(this.commonM, "inspection_tbl", this.renderinspec);

                this.listenTo(this.model, "postcheckSetnew", this.PostcheckSetnew);

                this.listenTo(this.model, "PatchcheckSet", this.patchcheckSet);

                this.listenTo(this.model, "deleteCheckSet", this.DeleteCheckSet);
            },
            DeleteCheckSet: function (data) {
                if (data['rows'].state == 100) {
                    var data = {
                        'enterprise_id': sessionStorage.getItem('enterprise_id'),
                        'is_delete': false
                    };
                    this.commonM.search('admin.erp_check_item', data, 'checkTbl');
                    this.commonM.search('admin.erp_dgns_treat_item', data, 'dgns_tbl');
                    this.commonM.search('admin.erp_inspection_item', data, 'inspection_tbl');
                }
            },
            patchcheckSet: function (data) {
                //console.log(data);
                if (data['rows'].state == 100) {
                    var data = {
                        'enterprise_id': sessionStorage.getItem('enterprise_id'),
                        'is_delete': false
                    };
                    this.commonM.search('admin.erp_check_item', data, 'checkTbl');
                    this.commonM.search('admin.erp_dgns_treat_item', data, 'dgns_tbl');
                    this.commonM.search('admin.erp_inspection_item', data, 'inspection_tbl');
                }
            },
            PostcheckSetnew: function (data) {
                //console.log(data)
                if (data['rows'].state == 100) {
                    var data = {
                        'enterprise_id': sessionStorage.getItem('enterprise_id'),
                        'is_delete': false
                    };
                    this.commonM.search('admin.erp_check_item', data, 'checkTbl');
                    this.commonM.search('admin.erp_dgns_treat_item', data, 'dgns_tbl');
                    this.commonM.search('admin.erp_inspection_item', data, 'inspection_tbl');
                }
            },
            renderinspec: function (res) {
                var rows = [];
                if (res.errorNo == 0) {
                    rows = res.rows;
                }
                else {
                    rows = []
                }
                this.$el.find("#inspection_tbl").bootstrapTable('load', rows)
            },
            renderdgns: function (res) {
                var rows = [];
                if (res.errorNo == 0) {
                    rows = res.rows;
                }
                else {
                    rows = []
                }
                this.$el.find("#dgns_tbl").bootstrapTable('load', rows);

            },
            renderData: function (res) {
                var rows = [];
                if (res.errorNo == 0) {
                    rows = res.rows;
                }
                else {
                    rows = []
                }
                this.$el.find("#check_tbl").bootstrapTable('load', rows)

            },
            render: function () {
                var that = this;
                $(this.el).html(Template);

                this.$el.find("#check_tbl").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {
                            field: 'opt', title: '操作', formatter: opt, events: {
                            "click .level_edit": function (e, value, row, index) {
                                //alert(row.record_id);
                                $(that.el).find("#Check_name").val(row.check_name);
                                $(that.el).find("#Check_unit").val(row.check_price);
                                $(that.el).find("#remarks").val(row.remark);

                                var $modal = $(that.el).find('#check_modal');

                                $modal.attr('type', 'edit');
                                $modal.find('.am-modal-hd').html('编辑检查项目');
                                $modal.attr('recordId', row['record_id']);
                                $modal.modal();
                            },
                            "click .row_remove": function (e, value, row, index) {
                                var data = {};
                                data.erp = 'erp_check_item';
                                data['record_id'] = row['record_id']
                                that.model.deleteCheckSet(data);
                            }
                        }
                        },
                        {field: 'check_name', title: '检查名字'},
                        {field: 'check_price', title: '检查表单'},
                        {field: 'remark', title: '备注'},
                    ],
                    data: []
                });
                this.$el.find("#dgns_tbl").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {
                            field: 'opt', title: '操作', formatter: opt, events: {
                            "click .level_edit": function (e, value, row, index) {
                                $(that.el).find("#dgns_name").val(row.dgns_treat_name);
                                $(that.el).find("#dgns_unit").val(row.dgns_treat_price);
                                $(that.el).find("#dgns_remarks").val(row.remark);
                                var $modal = $(that.el).find('#dgns_modal');
                                $modal.find('.am-modal-hd').html('编辑诊疗项目');
                                $modal.attr('type', 'edit');
                                $modal.attr('recordId', row['record_id']);
                                $modal.modal();
                            },
                            "click .row_remove": function (e, value, row, index) {
                                var data = {};
                                data.erp = 'erp_dgns_treat_item';
                                data['record_id'] = row['record_id']
                                that.model.deleteCheckSet(data);
                            }
                        }
                        },
                        {field: 'dgns_treat_name', title: '诊疗名字'},
                        {field: 'dgns_treat_price', title: '诊疗项目单价'},
                        {field: 'remark', title: '备注'},
                    ],
                    data: []
                });
                this.$el.find("#inspection_tbl").bootstrapTable({
                    columns: [
                        {field: "index", title: "序号", width: "5%", formatter: jctLibs.generateIndex},
                        {
                            field: 'opt', title: '操作', formatter: opt, events: {
                            "click .level_edit": function (e, value, row, index) {
                                $(that.el).find("#inspectionName").val(row.inspection_name);
                                $(that.el).find("#inspection_unit").val(row.inspection_price);
                                $(that.el).find("#inspection_remarks").val(row.remark);
                                var $modal = $(that.el).find('#inspection_modal');
                                $modal.find('.am-modal-hd').html('编辑检验项目');
                                $modal.attr('type', 'edit');
                                $modal.attr('recordId', row['record_id']);
                                $modal.modal();
                            },
                            "click .row_remove": function (e, value, row, index) {
                                var data = {};
                                data.erp = 'erp_inspection_item';
                                data['record_id'] = row['record_id']
                                that.model.deleteCheckSet(data);
                            }
                        }
                        },
                        {field: 'inspection_name', title: '检验名字'},
                        {field: 'inspection_price', title: '检验单价'},
                        {field: 'remark', title: '备注'},
                    ],
                    data: []
                });
                $(this.el).find("input:radio").uCheck("enable");
                var data = {
                    'enterprise_id': sessionStorage.getItem('enterprise_id'),
                    'is_delete': false
                };
                this.commonM.search('admin.erp_check_item', data, 'checkTbl');
                this.commonM.search('admin.erp_dgns_treat_item', data, 'dgns_tbl');
                this.commonM.search('admin.erp_inspection_item', data, 'inspection_tbl');
                return this;
            },
            events: {
                "click #search_dens": "searchDens",
                'click #check_confirm': 'submitCheck',
                'click #diag_confirm': 'diagCheck',
                'click #inspect_confirm': 'inspectCheck',
                "click #check_items .add_tool": "addTool",
                "click #dgns .add_tool": "addDgns",
                "click #inspection .add_tool": "addInspection",
            },
            addInspection: function () {
                var that = this;
                this.emptyfun();
                $(this.el).find('#inspection_modal').modal();
                $(this.el).find('#inspection_modal').attr('type', 'add');
                $(this.el).find('#inspection_modal .am-modal-hd').html('添加检查项目');
            },
            addDgns: function () {
                this.emptyfun();
                $(this.el).find('#dgns_modal').modal();
                $(this.el).find('#dgns_modal').attr('type', 'add');
                $(this.el).find('#dgns_modal .am-modal-hd').html('添加诊疗项目');
            },
            addTool: function () {
                this.emptyfun();
                $(this.el).find('#check_modal').attr('type', 'add');
                $(this.el).find('#check_modal').modal();
                $(this.el).find('#check_modal .am-modal-hd').html('添加检验项目');
            },
            submitCheck: function () {
                var type = $(this.el).find('#check_modal').attr('type');
                var checkName = $(this.el).find("#Check_name").val();
                var Checkunit = $(this.el).find("#Check_unit").val();
                var Remarks = $(this.el).find("#remarks").val();
                var row = {erp: 'erp_check_item'};
                row.checkName = checkName;
                row.Checkunit = parseFloat(Checkunit);
                row.Remarks = Remarks;
                if (type == 'add') {
                    this.model.postcheckSetnew(row);
                }
                if (type == 'edit') {
                    var id = $(this.el).find('#check_modal').attr('recordId');
                    row['record_id'] = id;
                    this.model.PatchcheckSet(row);
                }
            },
            diagCheck: function () {
                var type = $(this.el).find('#dgns_modal').attr('type');
                var dgnsName = $(this.el).find("#dgns_name").val();
                var dgnsunit = $(this.el).find("#dgns_unit").val();
                var Remarks = $(this.el).find("#dgns_remarks").val();
                var row = {erp: 'erp_dgns_treat_item'};
                row.dgns_name = dgnsName;
                row.dgns_unit = parseFloat(dgnsunit);
                row.Remarks = Remarks;
                if (type == 'add') {
                    this.model.postcheckSetnew(row);
                }
                if (type == 'edit') {
                    var id = $(this.el).find('#dgns_modal').attr('recordId');
                    row['record_id'] = id;
                    this.model.PatchcheckSet(row);
                }
            },
            inspectCheck: function () {
                var type = $(this.el).find('#inspection_modal').attr('type');
                var inspectionName = $(this.el).find("#inspectionName").val();
                var inspectionunit = $(this.el).find("#inspection_unit").val();
                var Remarks = $(this.el).find("#inspection_remarks").val();
                var row = {erp: 'erp_inspection_item'};
                row.inspectionName = inspectionName;
                row.inspection_unit = parseFloat(inspectionunit);
                row.Remarks = Remarks;
                if (type == 'add') {
                    this.model.postcheckSetnew(row);
                }
                if (type == 'edit') {
                    var id = $(this.el).find('#inspection_modal').attr('recordId');
                    row['record_id'] = id;
                    this.model.PatchcheckSet(row);
                }
            },
            emptyfun: function () {
                var that = this;
                $(that.el).find("#Check_name").val("");
                $(that.el).find("#Check_unit").val('');
                $(that.el).find("#remarks").val('');

                $(that.el).find("#agns_name").val('');
                $(that.el).find("#dgns_unit").val('');
                $(that.el).find("#dgns_remarks").val('');

                $(that.el).find("#inspectionName").val('');
                $(that.el).find("#inspection_unit").val('');
                $(that.el).find("#inspection_remarks").val('');
            },
            rowsfun: function (type) {
                var rows = {}, that = this;
                var checkName = $(that.el).find("#Check_name").val();
                var Checkunit = $(that.el).find("#Check_unit").val();
                var Remarks = $(that.el).find("#remarks").val();

                var agns_name = $(that.el).find("#agns_name").val();
                var dgns_unit = $(that.el).find("#dgns_unit").val();
                var dgnsremarks = $(that.el).find("#dgns_remarks").val();

                var inspectionName = $(that.el).find("#inspectionName").val();
                var inspection_unit = $(that.el).find("#inspection_unit").val();
                var inspectionremarks = $(that.el).find("#inspection_remarks").val();


                if (Remarks !== "") {
                    rows.Remarks = Remarks;
                } else if (dgnsremarks !== "") {
                    rows.Remarks = dgnsremarks;
                } else if (inspectionremarks !== "") {
                    rows.Remarks = inspectionremarks;
                }
                //=======================
                if (checkName !== "") {
                    rows.checkName = checkName;
                    rows.erp = 'erp_check_item';
                }
                if (Checkunit !== "") {
                    rows.Checkunit = parseFloat(Checkunit);
                }
                if (agns_name !== "") {
                    rows.agns_name = agns_name;
                    rows.erp = 'erp_dgns_treat_item';
                }
                if (dgns_unit !== "") {
                    rows.dgns_unit = parseFloat(dgns_unit);
                }
                if (inspectionName !== "") {
                    rows.inspectionName = inspectionName;
                    rows.erp = 'erp_inspection_item';
                }
                if (inspection_unit !== "") {
                    rows.inspection_unit = parseFloat(inspection_unit);
                }
                if (type == 'add') {
                    that.model.postcheckSetnew(rows);
                }
                else {
                    that.model.PatchcheckSet(rows);
                }
            },
            searchDens: function () {
                var dens_name = $("#dens_name").val(), data = {};
                if (dens_name) {
                    data['dgns_treat_name'] = dens_name;
                }
                this.commonM.search('admin.erp_dgns_treat_item', data, 'dgns_tbl');
            }
        });
        return view;
    });