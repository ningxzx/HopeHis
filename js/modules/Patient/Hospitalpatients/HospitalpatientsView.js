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
                this.getProvinceState = false;
                //监听
                this.listenTo(this.model, "postHospital", this.postHospitalpost);
                this.listenTo(this.model, "getPatient", this.Hreder);
                this.listenTo(this.model, "patchPatient", this.patchCallback);
                this.listenTo(this.model, "getProvince", this.renderProvince);
                this.listenTo(this.model, "getCity", this.renderCity);
                this.listenTo(this.model, "getArea", this.renderArea);
            },
            Hreder: function (res) {
                if (res.errorNo == 0) {
                    var arr = res.rows;
                    $(this.el).find("#Hospitalpatients_tbl").bootstrapTable('load', arr);
                }
            },
            showInfo: function (data) {
                $("#m_name").val(data.patient_name);
                //$("#m_gender").val(data.patient_sex);
                $("#m_gender").attr("patient_sex", data.patient_sex).val({M: '男', F: '女', N: '不详'}[data.patient_sex]);
                $("#m_birth").val(data.patient_birth);
                $("#m_marry").attr("marry_code", data.marry_state).val({
                    WH: "未婚",
                    YH: "已婚",
                    LY: "离异",
                    SO: "丧偶",
                    BX: "不详"
                }[data.marry_state]);
                $("#m_card_id").val(data.card_id);
                $("#m_email").val(data.patient_email);
                $("#m_wechat").val(data.patient_wechet);
                $("#m_qq").val(data.patient_qq);
                $("#m_cellphone").val(data.patient_phone);
                $("#m_phone").val(data.patient_tel);
                $("#province").attr("province_name",data.province).val(data.province);
                $("#city").attr("city_name",data.city).val(data.city);
                $("#area").attr("area_name",data.area).val(data.area);
                $("#m_street").val(data.streat);
                $("#m_detail").val(data.addr);
                $("#f_name").val(data.next_of_kin);
                $("#f_phone").val(data.next_of_kin_phone);
                var $input = $(this.el).find("#my-confirm input");
                $input.attr("readonly", "readonly");
                $(".select_input").removeClass('am-hide');
                $("[class*='_select_wrapper']").addClass("am-hide");
                $("#changeInput").removeClass("am-hide");
                $("#changeBtn").addClass("am-hide");
                $('#error_tips').html('').css('color', 'green').addClass("hid");
            },
            events: {
                "click .pat_refresh_tool": "refresh",
                "click #wc_Hospitalpatients": "searchPat",
                "keydown #pat_code_name": "keySearch",
                "click #changeInput": 'changeInput',
                "click #changeBtn": 'submitEdit',
                "change #province_select": "changeProvince",//省份改变获取城市
                "change #city_select": "changeCity",//城市改变获取区县
            },
            changeInput: function () {
                var $input = $(this.el).find("#my-confirm input"),provinces=this.provinces,
                    province_code,
                    province_name=$("#province").attr('province_name'),
                    city_name=$("#city").attr('city_name'),
                    area_name=$("#area").attr('area_name')
                    _this=this;
                $input.attr("readonly", false);
                $(".select_input").addClass('am-hide');
                $("[class*='_select_wrapper']").removeClass("am-hide");
                $("#m_gender_select").val($("#m_gender").attr("patient_sex")).trigger("chosen:updated");
                $("#m_marry_select").val($("#m_marry").attr("marry_code")).trigger("chosen:updated");
                var preProvince=provinces.filter(function (p) {
                    if(p[2]===province_name)
                    {
                        province_code=p[1];
                        _this.model.getCity(p[1])
                    }
                });
                if(province_code) {
                    this.city_name = city_name;
                    this.area_name = area_name;
                    $("#province_select").val(province_code).trigger("chosen:updated");
                }
                else{
                    this.city_name = "";
                    this.area_name = "";
                    $("#province_select").val(0).trigger("chosen:updated");
                    $("#city_select,#area_select").html('').trigger("chosen:updated");
                }
                $("#changeInput").addClass("am-hide");
                $("#changeBtn").removeClass("am-hide");
            },
            changeProvince:function () {
                this.city_name="";
                this.area_name="";
                var province_code=$('#province_select').val();
                this.model.getCity(province_code);
            },
            changeCity:function () {
                this.city_name="";
                this.area_name="";
                var city_code=$('#city_select').val();
                this.model.getArea(city_code);
            },
            submitEdit: function () {
                var pat_id = $('#my-confirm').attr('pat_id');
                if (pat_id == '' || !pat_id) {
                    alert("请点击右上角关闭编辑窗口,并重新点击\"查看\"!")
                }
                else {
                    var $province = $("#province_select"),
                        $city = $("#city_select"),
                        $area = $("#area_select");
                    var province = $province.val() != 0 ? $province.find("option:checked").text() : "",
                        city = $city.val() != 0 ? $city.find("option:checked").text() : "",
                        area = $area.val() != 0 ? $area.find("option:checked").text() : "";
                    var param = {
                        patient_name: $("#m_name").val().trim(),
                        patient_sex: $("#m_gender_select").val(),
                        patient_birth: $("#m_birth").val().trim(),
                        marry_state: $("#m_marry_select").val(),
                        card_id: $("#m_card_id").val().trim(),
                        patient_phone: $("#m_cellphone").val().trim(),
                        patient_qq: $("#m_qq").val().trim(),
                        patient_wechet: $("#m_wechat").val().trim(),
                        patient_email: $("#m_email").val().trim(),
                        province: province,
                        city: city,
                        area: area,
                        streat: $("#m_street").val().trim(),
                        addr: $("#m_detail").val().trim(),
                        next_of_kin: $("#f_name").val().trim(),
                        next_of_kin_phone: $("#f_phone").val().trim()
                    }
                    this.model.patchPat(pat_id, param)
                }

            },
            patchCallback: function (res) {
                if (res.resultCode == '100') {
                    $('#error_tips').html('编辑患者成功!').css('color', 'green').removeClass("hid");
                    this.city_name="";
                    this.area_name="";
                    $('#my-confirm').modal('close');
                    this.searchPat();
                }
                else {
                    $('#error_tips').html('编辑患者出错!').css('color', 'red').removeClass("hid");
                    ;
                }
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
                var pat_code_name = $("#pat_code_name").val(),
                    data = {};
                if (pat_code_name) {
                    data['patient_code_name'] = pat_code_name;
                }
                this.model.getPatient(data);
            },
            //获取省份
            renderProvince: function (res) {
                var opt = "<option value=\"0\">请选择省份</option>";
                var $province = $("#province_select");
                for (var i = 0,l=res.length; i < l; i++) {
                    opt += "<option value=\"" + res[i][1] + "\">" +res[i][2] + "</option>";
                }
                this.provinces = res;
                $province.html(opt);
                $province.trigger('chosen:updated')

            },

            //获取城市
            renderCity: function (res) {
                var opt = "<option value=\"0\">请选择城市</option>",_this=this;
                var next = $("#city_select");
                next.html("<option value=\"0\">请选择城市</option>");
                for (var i = 0,l=res.length; i < l; i++) {
                    opt += "<option value=" + res[i][1] + ">" + res[i][2] + "</option>";
                }
                next.html(opt);
                var city_name=this.city_name
                if(city_name){
                    res.filter(function (a) {
                        if(a[2]===city_name)
                        {
                            next.val(a[1]).trigger('chosen:updated');
                            _this.model.getArea(a[1])
                        }
                    });
                }
                next.trigger('chosen:updated')
            },
            //获取区县
            renderArea: function (res) {
                var opt = "<option value=\"0\">请选择区县</option>";
                var next = $("#area_select");
                next.html("<option value=\"0\">请选择区县</option>");
                for (var i = 0,l=res.length; i < l; i++) {
                    opt += "<option value=" + res[i][1] + ">" + res[i][2] + "</option>";
                }
                next.html(opt);
                next.trigger('chosen:updated');
                var area_name=this.area_name
                if(area_name){
                    res.filter(function (a) {
                        if(a[2]===area_name)
                        {
                            next.val(a[1]).trigger('chosen:updated');
                        }
                    });
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
                        {field: 'patient_sex', title: '患者性别', formatter: showGender, width: "8%"},
                        {field: 'card_id', title: '患者身份证号', width: "15%"},
                        {field: 'patient_phone', title: '患者手机号'},
                        {field: 'city', title: '患者常住市'},
                        {field: 'isalive', title: '是否死亡', formatter: showAlive},
                        {
                            field: "operate", title: "操作", width: "15%", formatter: opt,
                            events: {
                                "click .row_edit": function (e, value, row, index) {
                                    var $modal = $('#my-confirm');
                                    that.showInfo(row);
                                    $modal.attr('pat_id', row['patient_id']).modal({
                                        width: 960,
                                        closeViaDimmer: false
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
                this.model.getProvince();
                return this;
            }
        });

        return patientGroupView;
    });