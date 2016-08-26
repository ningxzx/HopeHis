({
    mainConfigFile: './js/jethisMain.js',
    appDir: './',
    baseUrl: './js',
    dir: './dist',
    modules: [
        {
            name: "jethisMain",
            exclude: ["libs",'modules/Bill/billView','modules/Diagnose/diagnoseView','modules/Index/indexView','modules/Medicine/medicineView','modules/Office/officeView','modules/Patient/patientView','modules/Regist/registView','modules/Setting/settingView','modules/Statistical/statisticalView']
        },
        {
            name: 'libs'
        },
        {
            name: 'almond'
        },
        {name: 'modules/Bill/billView',exclude:['libs']},
        {name: 'modules/Diagnose/diagnoseView',exclude:['libs']},
        {name: 'modules/Index/indexView',exclude:['libs']},
        {name: 'modules/Medicine/medicineView',exclude:['libs']},
        {name: 'modules/Member/MemberView',exclude:['libs']},
        {name: 'modules/Office/officeView',exclude:['libs']},
        {name: 'modules/Patient/patientView',exclude:['libs']},
        {name: 'modules/Regist/registView',exclude:['libs']},
        {name: 'modules/Setting/settingView',exclude:['libs']},
        {name: 'modules/Statistical/statisticalView',exclude:['libs']},
    ],
    removeCombined: true,
    findNestedDependencies: true,
    fileExclusionRegExp: /^(r|build|almond)\.js$/,
    optimizeCss: 'standard',
    removeCombined: true,
})
/**
 * Created by xzx on 2016-07-13.
 */
