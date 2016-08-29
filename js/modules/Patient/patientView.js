define(['txt!../Common/sidebar.html',
        '../Patient/patientClass/patientClassView',
        '../Patient/addpatient/addpatientView',
        '../Patient/Hospitalpatients/HospitalpatientsView',
        '../Patient/Patientsdepartment/PatientsdepartmentView',
        '../Patient/patientVip/patientVipView',
        '../Patient/patientModify/patientModifyView',
        'jquery', 'handlebars', 'backbone'],
    function (sidebarTemp, patientClassView,addpatientView, HospitalpatientsView,PatientsdepartmentView,patientVipView, patientModifyView, jquery, Handlebars, backbone) {
        var sidebarData = {
            topic:"患者管理",
            description:"自定义患者分组,设置VIP患者,监控重点关注人群健康档案",
            submenus: [
                {spanClass: "am-icon-wheelchair", submenu: "医院患者", sublink: "#patient/Hospitalpatients",subid:"patient_Hospitalpatients", parents: ""},
                {spanClass: "am-icon-wheelchair", submenu: "科室患者", sublink: "#patient/Patientsdepartment",subid:"patient_Patientsdepartment", parents: ""},
                {spanClass: "am-icon-wheelchair", submenu: "我的患者", sublink: "#patient/patientClass",subid:"patient_patientClass", parents: ""},
                {spanClass: "am-icon-wheelchair", submenu: "添加患者", sublink: "#patient/addpatient",subid:"patient_addpatient", parents: ""},
                //{spanClass: "am-icon-wifi", submenu: "修改患者信息", sublink: "#patient/patientModify",subid:"patient_patientModify", parents: ""},
            ]
        };
        var subviews = {
            patientClass: patientClassView,
            addpatient:addpatientView,
            Hospitalpatients:HospitalpatientsView,
            Patientsdepartment:PatientsdepartmentView,
            patientVip: patientVipView,
            patientModify: patientModifyView
        };
        var patientView = Backbone.View.extend({
            template: Handlebars.compile(sidebarTemp),
            render: function () {
                var paths=sessionStorage.getItem('menu_path');
                sidebarData.submenus=sidebarData.submenus.filter(function(menu){
                    return paths.indexOf(menu['sublink'])!=-1
                })
                var sidebarHtml = this.template(sidebarData);
                $(this.el).append(sidebarHtml);
                if (this.id) {
                    var subview = new subviews[this.id]();
                    subview.render();
                    $(this.el).append(subview.el);
                }
                return this;
            }
        });
        return patientView;
    });
