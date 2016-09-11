define(['txt!../../Patient/patientModify/patientModify.html',
        '../../Common/patientModel',
        '../../Common/patientCollection',
        'handlebars','backbone','jctLibs'],
    function (Template, patientModel, patientCollection, Handlebars,backbone,jctLibs){
        var view = Backbone.View.extend({
            initialize: function(){
                this.patientModel = new patientModel();
                this.patientCollection = new patientCollection();
            },

            render:function() {
                $(this.el).html(Template);
                $(this.el).find("#select_condition").chosen({
                    width: "20rem",
                    no_results_text: '没有找到匹配的项！',
                    disable_search_threshold: 10
                });
                $(this.el).find("#m_birth").datepicker();
                return this;
            },

            events:{
                "click #search_keyWord": "searchKeyWord",
                "click #m_modify": "patientModify"
            },

            //查询关键字
            searchKeyWord: function(){
                var that = this;
                $("#tips").addClass("hid");
                $(this.el).find("#names").addClass("hid");
                var select_condition = $("#select_condition").val();
                var $keyword = $("#keyword");
                if ($keyword.val() == "") {
                    alert('请输入查询关键字');
                    $keyword.focus();
                    return;
                }
                if (select_condition == "id") {
                    //发送ID查询
                    that.patientModel.url = "http://192.168.0.220:8081/jethis/patient/patient";
                    that.patientModel.fetch({
                        async: true,
                        data: $.param({
                            patient_id: $keyword.val(),
                            enterprise_id: "ERP10001"
                        }),
                        success: function (model, response) {
                            that.patientCollection.add(model);
                            var data = jctLibs.listToObject(response.patient,"data")["data"];
                            if(!data){
                                return;
                            }
                            that.showInfo(data[0]);
                        },
                        error: function (err, response) {
                            $("#tips").removeClass("hid").find("p").text("查询失败"+response);
                        }
                    });
                } else if (select_condition == "name") {
                    //发送NAME查询
                    that.patientModel.url = "http://192.168.0.220:8081/jethis/patient/patient";
                    that.patientModel.fetch({
                        async: true,
                        data: $.param({
                            patient_name: $keyword.val(),
                            enterprise_id: "ERP10001"
                        }),
                        success: function (model, response) {
                            $("#names").removeClass("hid");
                            that.patientCollection.add(model);
                            var data = jctLibs.listToObject(response.patient,"data")["data"];
                            if(data == ""){
                                return;
                            }
                            $("#patient_names").bootstrapTable({
                                data: data,
                                //height: 100,
                                onDblClickRow: function (row, el) {
                                   that.showInfo(row);
                                    $("#names").addClass("hid");
                                }
                            });
                        },
                        error: function (err, response) {
                            $("#tips").removeClass("hid").find("p").text("查询失败"+response);
                        }
                    });
                }
            },

            //显示信息
            showInfo: function (data) {
                $("#m_name").val(data.patient_name);
                $("#m_gender").val(data.patient_sex);
                $("#m_birth").val(data.patient_birth);
                $("#m_marry").val(data.marry_state);
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
                $("#m_detail").val(data.addr);
                $("#f_name").val(data.next_of_kin);
                $("#f_phone").val(data.next_of_kin_phone);
            },

            //修改按钮
            patientModify: function () {
                $("#tips").addClass("hid");
                if(this.patientCollection.length == 0){
                    $("#tips").addClass("am-alert-warning").removeClass("am-alert-success hid").find("p").text("请先提取患者信息");
                    return;
                }
                console.log(this.patientCollection);
                this.patientModel.url = "http://192.168.0.220:8081/JetHis/Patch/patient";
                this.patientModel.save({
                    enterprise_id: "ERP10001",
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
                }, {
                    success: function (model, response) {
                        console.log(response);
                        if (response.status == "1") {
                            $("#tips").addClass("am-alert-success").removeClass("am-alert-warning hid").find("p").text("修改成功");
                        } else if (response.status == "-1") {
                            $("#tips").addClass("am-alert-warning").removeClass("am-alert-success hid").find("p").text("修改失败，请再次点击提交修改信息");
                        }
                    },
                    error: function (err, response) {
                        $("#tips").addClass("am-alert-warning").removeClass("am-alert-success hid").find("p").text("提交失败，请重新提交修改"+response);
                    }
                });
            }
        });

        return view;
    });
