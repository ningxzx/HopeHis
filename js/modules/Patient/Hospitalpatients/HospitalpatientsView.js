/**
 * Created by insomniahl on 15/12/17.
 */
define(['txt!../../Patient/Hospitalpatients/Hospitalpatients.html',
        '../../Common/patRecord/patRecordView',
        '../../Patient/Hospitalpatients/HospitalpatientsModel',
        'backbone', 'jctLibs', 'bootstrapTable'],
    function (Template, patRecordView, HospitalpatientsModel, backbone, jctLibs, bootstrapTable) {
        var opt = function (value, row, index) {
            return [
                '<a class="row_edit" href="javascript:void(0)" title="detail">',
                '查看',
                '</a>  ',
                '<a class="row_history" href="javascript:void(0)" title="detail">',
                '就诊记录',
                '</a>  '
            ].join('');
        };

        function showGender(value) {
            return {'M': '男', 'F': '女', 'N': '不详'}[value]
        }

        function showAlive(value) {
            return {'1': '是', '2': '否'}[value]
        }

        var patientGroupView = Backbone.View.extend({
            initialize: function () {
                this.model = new HospitalpatientsModel();

                //监听
                this.listenTo(this.model, "postHospital", this.postHospitalpost);
                this.listenTo(this.model, "getPatient", this.Hreder);
            },
            postHospitalpost: function (data) {
                console.log(data)
            },
            Hreder: function (res) {
                if (res.errorNo == 0) {
                    var arr = res.rows;
                    $(this.el).find("#Hospitalpatients_tbl").bootstrapTable('load', arr);
                }
            },
            render: function () {
                var that = this;
                $(this.el).html(Template);
                $(this.el).find("select").chosen({width: "100%", disable_search_threshold: 100});
                $(this.el).find("#Hospitalpatients_tbl").bootstrapTable({
                    pagination: true,
                    pageSize: 10,
                    columns: [
                        //{field: "", title: "", checkbox: true},
                        {field: "index", title: "序号", formatter: jctLibs.generateIndex},
                        {field: 'patient_id', width: "15%", title: '患者ID'},
                        {field: 'patient_name', title: '患者姓名'},
                        {field: 'patient_sex', title: '患者性别', formatter: showGender},
                        {field: 'card_id', title: '患者身份证号'},
                        {field: 'patient_phone', title: '患者手机号'},
                        {field: 'city', title: '患者常住市'},
                        {field: 'isalive', title: '是否死亡', formatter: showAlive},
                        {
                            field: "operate", title: "操作", width: "15%", formatter: opt,
                            events: {
                                "click .row_edit": function (e, value, row, index) {
                                    that.showInfo(row);

                                    var $confirm = $(that.el).find('#my-confirm');
                                    var $confirmBtn = $confirm.find('[data-am-modal-confirm]');
                                    var $cancelBtn = $confirm.find('[data-am-modal-cancel]');
                                    $confirmBtn.off('click.confirm.modal.amui').off('click').on('click', function () {
                                        var data = {
                                            patient_name: $("#m_name").val().trim(),
                                            patient_sex: $("#m_gender").val(),
                                            patient_birth: $("#m_birth").val().trim(),
                                            marry_state: $("#m_marry").val(),
                                            card_id: $("#m_card_id").val().trim(),
                                            patient_phone: $("#m_cellphone").val().trim(),
                                            patient_tel: $("#m_phone").val().trim(),
                                            patient_qq: $("#m_qq").val().trim(),
                                            patient_wechet: $("#m_wechat").val().trim(),
                                            patient_email: $("#m_email").val().trim(),
                                            nationaloty: $("#my_address").find("select[name='country']>option:selected").text().trim(),
                                            province: $("#my_address").find("select[name='province']>option:selected").text().trim(),
                                            city: $("#my_address").find("select[name='city']>option:selected").text().trim(),
                                            area: $("#my_address").find("select[name='area']>option:selected").text().trim(),
                                            //street: $("#a_detail").val(),
                                            addr: $("#m_detail").val().trim(),
                                            next_of_kin: $("#f_name").val().trim(),
                                            next_of_kin_phone: $("#f_phone").val().trim()
                                        };
                                        that.model.postHospital(data);
                                        $confirm.modal('close');
                                    });

                                    $cancelBtn.off('click.cancel.modal.amui').on('click', function () {
                                        $confirm.modal('close');
                                    });

                                    $(that.el).find('#my-confirm').modal({
                                        width: 960
                                    });
                                },

                                "click .row_history": function (e, value, row, index) {
                                    that.patRecordView = new patRecordView();
                                    that.patRecordView.render(row['patient_id']);
                                    $(that.el).find('#patient_history .am-modal-bd').html('').append(that.patRecordView.$el);
                                    $(that.el).find('#patient_history').modal({
                                        width: 960,
                                        height: 700
                                    });
                                }

                            }
                        },


                    ],
                    data: []
                });
                $(this.el).find("#m_birth").datepicker();
                var data = {
                    enterprise_id: sessionStorage.getItem('enterprise_id')
                };
                var $Input = $(this.el).find("#my-confirm input");
                $Input.attr("readonly", "readonly");

                $(this.el).find("select").chosen({width: '100%'});
                this.model.getPatient();
                //this.getProvince();
                return this;
            },
            empty: function () {
                $("#m_name").val("");
                $("#m_gender").val("");
                $("#m_birth").val('');
                $("#m_marry").val('');
                $("#m_card_id").val('');
                $("#m_email").val('');
                $("#m_wechat").val('');
                $("#m_qq").val('');
                $("#m_cellphone").val('');
                $("#m_phone").val('');
                $("#my_address").find('');
                $("#m_detail").val('');
                $("#f_name").val('');
                $("#f_phone").val('');
            },
            showInfo: function (data) {
                $("#m_name").val(data.patient_name);
                //$("#m_gender").val(data.patient_sex);
                $("#m_gender").val({M: '男', F: '女', N: '不详'}[data.patient_sex]);

                $("#m_birth").val(data.patient_birth);
                //$("#m_marry").val({}[data.marry_state]);
                $("#m_card_id").val(data.card_id);
                $("#m_email").val(data.patient_email);
                $("#m_wechat").val(data.patient_wechet);
                $("#m_qq").val(data.patient_qq);
                $("#m_cellphone").val(data.patient_phone);
                $("#m_phone").val(data.patient_tel);
                $("#my_address").find("select[name='country'] option").text(data.nationality);
                $("#my_address").find("select[name='province'] option").text(data.province);
                $("#my_address").find("select[name='city'] option").text(data.city);
                $("#my_address").find("select[name='area'] option").text(data.area);
                $("#m_city").val(data.city);
                $("#m_detail").val(data.addr);
                $("#f_name").val(data.next_of_kin);
                $("#f_phone").val(data.next_of_kin_phone);
            },
            events: {
                "click .pat_refresh_tool": "refresh",
                "click #wc_Hospitalpatients": "searchPat",
                "keydown #pat_code_name": "keySearch",
            },
            keySearch: function (e) {
                if (e.keyCode == '13') {
                    this.searchPat();
                }
            },
            HospitalpatientsName: function (e) {
                if (e.keyCode == '13') {
                    this.searchPat();
                }
            },
            refresh: function () {
                this.model.getPatient();
            },
            searchPat: function () {
                var pat_code_name=$("#pat_code_name").val(),
                    data = {};
                if(pat_code_name){
                    data['patient_code_name']=pat_code_name;
                }
                this.model.getPatient(data);
            },
        });

        return patientGroupView;
    });