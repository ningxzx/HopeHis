define(['txt!../../Setting/changePersonal/changePersonal.html',
        "../../Setting/changePersonal/changePersonalModel",
        'handlebars','jquery','backbone','jctLibs','bootstrapTable','aes','padding','base64','md5'],
    function (Template,pModel,Handlebars,$,backbone,jctlibs){
        var datas;
        Handlebars.registerHelper('formatSex', function (value) {
            return {M:'男',F:'女',N:'不详'}[value]
        })
        var view = Backbone.View.extend({
            initialize: function () {
                this.model=new pModel();
                this.listenTo(this.model,"personInfo",this.getInfo);
                this.listenTo(this.model,"changeInfo",this.changeInfo);
                this.listenTo(this.model,"getmes",this.getMes);
                this.listenTo(this.model,"changephone",this.returnPhone);
                this.listenTo(this.model,"changepwd",this.returnmi);
            },
            getInfo:function(result){
                var res = jctlibs.listToObject(result,"rows")["rows"];
                datas=res[0];
                this.iconSrc=datas['user_icon']
                this.render(res);
            },
            changeInfo:function(res){
                if(res.resultCode=="100"){
                    $("#error_tips").html("成功信息：个人信息修改成功！").css('color','green').removeClass("hid");
                    var name=$('#user_name').val();
                    sessionStorage.setItem('user_name',name);
                    $('.back #userName').html(name);
                    this.readMode();
                    this.model.getInfos();
                }
                else{
                    $("#error_tips").html("成功信息：个人信息修改失败！").css('color','red').removeClass("hid");
                }
            },
            getMes:function(res){
                if(res.result=="OK"){
                    console.log("发送成功")
                }
            },
            returnmi: function (res) {
                if(res.result=="OK"){
                    $("#error_tips").html("成功信息：密码修改成功！").css('color','green').removeClass("hid");
                    window.location.href='http://www.jethis.cn';
                }
            },
            returnPhone:function(res){
                if(res.resultCode=="100"){
                    $("#error_tips").html("成功信息：新手机号绑定成功！").css('color','green').removeClass("hid");
                    this.model.getInfos();
                }
            },
            render:function(data) {
                var html=$(Template);
                var temp = Handlebars.compile(html.find("#changeInfo").html());
                if(data){
                    html.find("#changeInfo").html(temp(data[0]));
                    $(this.el).find('#select_sex').val(data[0]['user_sex'])
                    $(this.el).html(html);
                }else{
                    this.model.getInfos();
                    html.find("#changeInfo").html(temp([]));
                    $(this.el).html(html);
                }
                $(this.el).find("select").chosen({
                    width:'100%',
                    disable_search_threshold: 10
                });
                return this;
            },

            events:{
                "click #changePdw": "resetPwd",
                "click #changePhone": "resetPhone",
                "click #changePhoto": "resetPhoto",
                "click #changeBtn": "subpersonal",
                "blur #userqq":"checkqq",
                "blur #userwx":"checkwx",
                "blur #checknickname":"checknk",
                "click #sendmes":"sendM",
                "blur #newphone1":"checkPhone",
                "click #phonesure":"changePhone",
                "change .dd-file-file":"showImage",
                "click #uploadimg":"upload",
                "click #pwdsure":"changemi",
                'click #refreshInfo':'refreshInfo',
                'blur #user_name':'checkName',
                'focus #user_name':'reName',
                'click #changeInput':'changeInput',
            },
            reName: function () {
                var $name=$('#user_name');
                    $name.closest('.am-input-group').removeClass("am-input-group-danger")
            },
            changeInput:function () {
                this.editMode();
            },
            editMode:function () {
                $("#changeBtn").removeClass('am-hide');
                $("#changeInput").addClass('am-hide');
                $("#user_name").attr('readonly',false);
                $("#usernickname").attr('readonly',false);
                $("#show_sex").addClass('am-hide');
                $("#select_sex_wrapper").removeClass("am-hide");
                $("#select_sex").val($("#show_sex").attr('realValue')).trigger("chosen:updated");
                $("#user_card_id").attr('readonly',false);
                $("#userqq").attr('readonly',false);
                $("#userwx").attr('readonly',false);
                $("#user_email").attr('readonly',false);
            },
            readMode:function () {
                $("#changeBtn").addClass('am-hide');
                $("#changeInput").removeClass('am-hide');
                $("#user_name").attr('readonly',true);
                $("#usernickname").attr('readonly',true);
                $("#show_sex").removeClass('am-hide');
                $("#select_sex_wrapper").addClass("am-hide");
                $("#user_card_id").attr('readonly',true);
                $("#userqq").attr('readonly',true);
                $("#userwx").attr('readonly',true);
                $("#user_email").attr('readonly',true);
            },
            checkName: function () {
                var $name=$('#user_name');
                if($name.val().trim()==""){
                    $name.closest('.am-input-group').addClass("am-input-group-danger")
                }
            },
            refreshInfo: function () {
                this.model.getInfos();
            },
            changemi:function(){
                var arr=[];
                var oldp=$("#oldpwd").val().trim();
                var newp=$("#newpwd2").val().trim();
                var newp1=$("#newpwd1").val().trim();
                if(newp!=newp1){
                    alert("两次输入密码不一致");
                    return;
                }
                //var account = sessionStorage.getItem("user");
                arr.push(this.md5(oldp));
                arr.push(this.md5(newp));
                this.model.changePwd(arr);
            },
            md5:function(pwd){
                return CryptoJS.MD5(pwd).toString();
            },
            upload:function(){
                var fileInfo = new FormData();
                if($('#head_photo')[0].files.length==0){
                    alert("请上传图片");
                    return;
                }
                fileInfo.append('Icon_img', $('#head_photo')[0].files[0],$('#head_photo').attr('filename'));
                $.ajax({
                    url: "http://192.168.0.220:8081/jethis/user/changeicon",
                    type: 'POST',
                    cache: false,
                    data: fileInfo,
                    processData: false,
                    contentType: false
                }).done(function (res) {
                    if(res.result=="OK"){
                        window.location.reload();
                    }
                }).fail(function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    console.log("修改失败");
                })
            },
            showImage:function(){
                var file = event.target.files[0],url = null,name=file.name;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                }
                $("#dd-img").attr("src", url);
                $(event.target).attr("filename", name);
            },
            sendM:function(){
                //$("#sendmes").attr("disabled","true");
                var phoneN=$("#newphone1").val();
                this.model.getmessage(phoneN);
            },
            checkqq:function(e){
                var _this=$(e.target)
                var con = _this.val().trim();
                if(!/^\d{5,11}$/.test(con)){
                    alert("请输入正确qq号");
                    debugger
                    _this.val(datas.user_qq);
                    return;
                }
            },
            checkwx:function(e){
                var _this=$(e.target)
                var con = _this.val().trim();
                if(!/^[a-zA-Z\d_]{5,}$/.test(con)){
                    alert("请输入正确的微信号");
                    _this.val(datas.user_wechate);
                    return;
                }
            },
            checknk:function(e){
                var _this=$(e.target)
                var con = _this.val().trim();
                if(!con){
                    alert("请输入修改的昵称");
                    _this.val(datas.user_nickname);
                    return;
                }
            },
            subpersonal:function(){
                var name=$("#user_name").val().trim(),
                    user_id=$("#user_id").val().trim(),
                    card_id=$("#user_card_id").val().trim();
                if(name==""){
                    $("#error_tips").html("错误提示：请填写姓名！").removeClass("hid");
                    return;
                }
                if(user_id==""||!user_id){
                    $("#error_tips").html("错误提示：用户ID为空,即将刷新页面！").removeClass("hid");
                    window.location.reload();
                    return;
                }
                if(card_id&&!card_id.match(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)){
                    $("#error_tips").html("错误提示：请填写正确的身份证号！").removeClass("hid");
                    return;
                }
                var data={
                    "user_qq":$("#userqq").val(),
                    "user_wechat":$("#userwx").val(),
                    "user_nickname":$("#usernickname").val(),
                    "user_card_id":card_id,
                    "user_sex":$("#select_sex").val(),
                    "user_name":name,
                    "user_email":$("#user_email").val(),
                }
                this.model.changeInfos(data);
            },
            checkPhone:function(){
                var phone = $("#newphone1").val();
                if (phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)) {
                    $("#sendmes").attr("disabled",false);
                } else {
                    alert("手机格式不对")
                }
            },
            changePhone:function(){
                var arr=[]
                arr.push($("#checkmes").val());
                arr.push($("#newphone1").val());
                this.model.changePhone(arr);
            },
            //打开修改密码窗口
            resetPwd: function () {
                $("#confirmPwd").modal({
                    onConfirm: function (e) {
                        console.log(e);
                    }
                });
            },

            //打开修改绑定手机窗口
            resetPhone: function () {
                $("#oldphone").val(datas?datas.user_phone:null);
                $("#confirmPhone").modal({
                    onConfirm: function (e) {
                        console.log(e);
                    }
                });
            },

            //打开修改头像窗口
            resetPhoto: function () {
                $("#confirmPhoto img").attr('src','http://192.168.0.220:8081'+this.iconSrc)
                $("#confirmPhoto").modal({
                    onConfirm: function (e) {
                        console.log(e);
                    }
                });
            },
        });
        return view;
    });