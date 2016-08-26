define(['bootstrapTable','jctLibs','chosen'],
    function (bt,jctLibs,chosen){
        var basicTable=function ($table,columnNames,data,totalRows,ifOperate){
            var columns=[],operateEvents,operateFormatter;
            columnNames.forEach(function(columnName){
                var column=Object.create({});
                column=columnName;
                column.align='center';
                column.valign='middle';
                columns.push(column);
            });
            //药物用法生成的方法
            if(ifOperate){
                columns.push({
                    field: 'operate',
                    title: '操作',
                    align: 'center',
                    valign: 'middle',
                    events: jctLibs.operateEvents,
                    formatter: jctLibs.operateFormatter
                })
            };
            $table.bootstrapTable({
                columns: columns,
                data:data,
                jcount:totalRows,
                onPageNumber: function () {
                    alert(arguments);
                }
            });
        }
        return basicTable;
    });

