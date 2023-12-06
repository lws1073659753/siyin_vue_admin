import permission from '@/directive/permission/index.js'
import {auxiliaryExcelImport} from '@/api/wm/auxiliary'
import {getList,save,remove,getall,excelImport,GetTableLabelDynamic,confirmExcelImport} from '@/api/wm/auxiliaryCheck'
import {updateAtchNoState} from '@/api/wm/atchNo'
import { formatJson } from '@/api/excel/excel'



export default {
    directives: { permission },
    data() {
        return {
            //uploadUrl: excelImport,
            headers: { "Content-Type": "multipart/form-data;charset=UTF-8" },
            activeName:"已经存在的数据",
            isAdd: true,
            tableLabel:[
                {
                    label:'批次号',
                    prop:'name'
                },
                {
                    label:'sysPn',
                    prop:'sysPn'
                },
                {
                    label:'pn数量',
                    prop:'pnQty'
                },
                
                {
                    label:'创建时间',
                    prop:'createTime'
                },
                {
                    label:'原因',
                    prop:'description'
                },
            ],
            currentPage:1,
            tableData: [],
            tableLoading: false,
           
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                sysBin: undefined,
                piNum: undefined,
                sysPn: undefined,
                pnQty:0,
                beginTime: '',
                endTime: '',
            },
            templateExcel: [
                {
                    label: 'name/批次号',
                    prop: 'name'
                },
                {
                    label: 'sysPn/实物PN',
                    prop: 'sysPn'
                },
                {
                    label: 'sysQty/Pn数量',
                    prop: 'sysQty'
                },
                {
                    label: 'sysBin/库位',
                    prop: 'sysBin'
                },
                {
                    label: 'sysLocation/区域',
                    prop: 'sysLocation'
                },
            ],
            oldTableData:[],
            newTableData:[],
            tableData:[],
            total: 0,
            oldTotal: 0,
            newTotal: 0,
            pageNewSize: 10,
            pageOldSize:10,
            currentOldPage:1,
            currentNewPage:1,
            list: null,
            formData:undefined,
            listLoading: true,
            selRow: {},
            listStringVisible:false,
            listStringTitle:'',
            listStrings:'',
            confirmVisible:false,
            confirmTitle:'',
            primaryOldData:null,
            primaryNewData:null,
            multipleSelection:[],
        }
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },
    created() {
        //this.init()
        //this.initTableLabel();
        //new Date(2000, 10, 10, 10, 10)
        this.listQuery.beginTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)
        this.listQuery.endTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 0, 0, 0)
    },
    methods: {
        init() {
            this.fetchData()
        },
       
        fetchData() {
            this.listLoading = true
            if(new Date(this.listQuery.beginTime)>new Date(this.listQuery.endTime)){
                this.$message({
                    message: '开始时间不能大于结束时间',
                    type: 'warning'
                });
                this.listLoading = false
                return
            }
            getList(this.listQuery).then(data => {
              console.log(data)

              this.list = data.data

              this.listLoading = false
              this.total = data.totalCount
            })
        },
        search() {
            this.fetchData()
        },
        reset() {
            this.listQuery= {
                pageIndex: 1,
                pageSize: 10,
                name:undefined,
                sysPn: undefined,
                beginTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
                endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 0, 0, 0),
            },
            this.fetchData()
        },
        handleFilter() {
            this.getList()
        },
        fetchNext() {
            this.listQuery.pageIndex = this.listQuery.pageIndex + 1
            this.fetchData()
        },
        fetchPrev() {
            this.listQuery.pageIndex = this.listQuery.pageIndex - 1
            this.fetchData()
        },
        fetchPage(pageIndex) {
            this.listQuery.pageIndex = pageIndex
            this.fetchData()
        },
        changeSize(pageSize) {
            this.listQuery.pageSize = pageSize
            this.fetchData()
        },
        handleCurrentChange(currentRow, oldCurrentRow) {
            //console.log(currentRow)
            this.selRow = currentRow
        },
        // initTableLabel(){
        //     GetTableLabelDynamic().then(data=>{
        //         console.log(data,'data')
        //         this.tableLabel.forEach(element=>{
        //             data.forEach(item=>{
        //                 if(item.name==element.prop){
        //                     element.label=element.label+'/'+item.value
        //                 }
        //             })
                    
        //         })
        //     })
        // },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        resetForm() {
           
        },
        save() {

            this.$refs['form'].validate((valid) => {
                if (valid) {
                    save(data).then(response => {
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        })
                        this.fetchData()
                        this.formVisible = false
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        Cancel() {
            this.formVisible = false
            this.resetForm()
        },
        checkSel() {
            if (this.selRow && this.selRow.id) {
                return true
            }
            this.$message({
                message: '请选中操作项',
                type: 'warning'
            })
            return false
        },
        edit() {
            console.log(this.listQuery.piNum)
            if(this.listQuery.piNum!=''&&this.listQuery.piNum!=null){
                updateAtchNoState(this.listQuery.piNum).then(res=>{
                    this.$message({
                        message: '关闭成功',
                        type: 'success'
                    })
                })
            }
        },
        remove(row) {
            this.handleCurrentChange(row)
            if (this.checkSel()) {
                const id = this.selRow.id
                this.$confirm('确定删除该记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    remove(id).then(response => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.fetchData()
                    }).catch(err => {
                        this.$notify.error({
                            title: '错误',
                            message: err
                        })
                    })
                }).catch(() => {
                })
            }
        },
        //时间格式化
        formatDateC(Time,hour) {
            // 获取单元格数据
            let dtc = new Date(Time)
            //获取月,默认月份从0开始
            let dtuMonth = dtc.getMonth() + 1
            //获取日
            let dtuDay = dtc.getDate()
            //处理1-9月前面加0
            if (dtuMonth < 10) {
                dtuMonth = "0" + (dtc.getMonth() + 1)
            }
            //处理1-9天前面加0
            if (dtuDay < 10) {
                dtuDay = "0" + dtc.getDate()
            }
            //获取小时
            let dtuHours = dtc.getHours()
            //处理1-9时前面加0
            if (dtuHours < 10) {
                dtuHours = "0" + dtc.getHours()
            }
            //获取分钟
            let dtuMinutes = dtc.getMinutes()
            //处理1-9分前面加0
            if (dtuMinutes < 10) {
                dtuMinutes = "0" + dtc.getMinutes()
            }
            //获取秒
            let dtuSeconds = dtc.getSeconds()
            //处理1-9秒前面加0
            if (dtuSeconds < 10) {
                dtuSeconds = "0" + dtc.getSeconds()
            }
            //组装年月日时分秒,按自己的要求来
            return dtc.getFullYear() + "/" + dtuMonth + "/" + dtuDay
            + " " + hour + ":00:00"
        },
        /**
         * flexWidth
         * @param prop 每列的prop 可传''
         * @param tableData 表格数据
         * @param title 标题长内容短的，传标题  可不传
         * @param num 列中有标签等加的富余量
         * @returns 列的宽度
         * 注：prop,title有一个必传
         */
        flexWidth(prop, tableData, title, num = 0) {
            //console.log(tableData,"tableData");
            if (tableData === null || tableData.length === 0) {//表格没数据不做处理
                return;
            }
            let flexWidth = 0;//初始化表格列宽
            let columnContent = '';//占位最宽的内容
            let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");
            context.font = "14px Microsoft YaHei";
            if ((prop === '') && title) {//标题长内容少的，取标题的值,
                columnContent = title
            } else {// 获取该列中占位最宽的内容
                let index = 0;
                for (let i = 0; i < tableData.length; i++) {
                    const now_temp = tableData[i][prop] + '';
                    const max_temp = tableData[index][prop] + '';

                    const now_temp_w = context.measureText(now_temp).width
                    const max_temp_w = context.measureText(max_temp).width
                    if (now_temp_w > max_temp_w) {
                        index = i;
                    }
                }
                columnContent = tableData[index][prop]
                //比较占位最宽的值跟标题、标题为空的留出四个位置
                const column_w = context.measureText(columnContent).width
                const title_w = context.measureText(title).width
                if (column_w < title_w) {
                    columnContent = title || '留四个字'
                }
            }
            // 计算最宽内容的列宽
            let width = context.measureText(columnContent);
            flexWidth = width.width + 100 + num
            //console.log(flexWidth)
            return flexWidth + 'px';
        },
        close() {
            this.primaryNewData=null;
            this.primaryOldData=null;
            this.confirmVisible=false;
            this.confirmTitle='';
            this.listStringVisible=false;
            this.listStringTitle='';
            this.formData=new FormData();
            //console.log(123)
        },
        getRowClassName({ row, rowIndex }) {
            if (!row.children) {
                return 'row-expand-cover'
            } else if (!row.children.length) {
                return 'row-expand-cover'
            }
        },
        beforeUpload(file) {
            const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            if (!isExcel) {
                this.$message.error('只能上传Excel文件')
                return false
            }
            return true
        },

        handleFileUpload({ file }) {
            // file里面包含所选择的文件信息// 如果文件类型不符合xls|xlsx，也可以进行其他的判断
            if (file.name.slice(-3) != "xls" && file.name.slice(-4) != "xlsx") {
                this.$message.error("上传文件只能是 XLS | XLSX 格式!");
                return false;
            }
            else {
                // 通过URL.createObjectURL可以获取文件的真实url，需要slice是因为前缀有blob:
                //const fileUrl = URL.createObjectURL(file).slice(5)// 类型通过则把文件变成formData的形式，因为文件一般是formData数据
                this.formData = new FormData();
                this.formData.append('file', file);
                // 发送网络请求... 
                console.log(this.formData,'formData')
                console.log(file, 'file')
                auxiliaryExcelImport(this.formData).then(res => {
                    console.log(res,"jjjjssssj")
                    if(res !=null){
                        this.sysPn=res.sysPn;
                        this.pnQty=res.pnQty;
                        this.name=res.name;   
                                     
                        this.$message({
                            type: 'success',
                            message: '导入成功'
                        })   
                    }
                    if(res==null){
                        this.$message({
                            type: 'error',
                            message: '导入失败,PN重复导入'
                        })  
                       

                    }
                    if(res.state==0){
                        this.fetchData()
                        this.$message({
                            type: 'success',
                            message: '导入成功'
                        })                
                    }
                }).catch(err => {
                    // this.$message({
                    //     type: 'error',
                    //     message: '导入失败'
                    // })
                })
            }
        },
        handleCurrentChange(val) {
            this.getData(val);
        },
        pagedOldData() {
            const startIndex = (this.currentOldPage - 1) * this.pageOldSize;
            const endIndex = startIndex + this.pageOldSize;
            this.primaryOldData=this.oldTableData.slice(startIndex, endIndex);
            console.log(this.currentOldPage,this.pageOldSize,'endIndex')
            console.log(this.primaryOldData,'primaryOldData')
            return this.primaryOldData
        },
        pagedNewData() {
            const startIndex = (this.currentNewPage - 1) * this.pageNewSize;
            const endIndex = startIndex + this.pageNewSize;
             this.primaryNewData=this.newTableData.slice(startIndex, endIndex);
             console.log(this.newTableData,'newTableData')
             console.log(this.primaryNewData,'primaryNewData')
             return this.primaryNewData
        },
        handleOldSizeChange(pageIndex) {
            this.pageOldSize=pageIndex
            console.log(pageIndex,'pageIndex')
            this.pagedOldData()
        },
        handleOldCurrentChange(pageSize) {
            console.log(pageSize,'pageSize')
            this.currentOldPage=pageSize

            this.pagedOldData()
        },
        handleNewSizeChange(pageIndex) {
            this.pageNewSize=pageIndex

            this.pagedNewData()
        },
        handleNewCurrentChange(pageSize) {
            this.currentNewPage=pageSize

            this.pagedNewData()
        },
        fetchOldNext() {
            this.currentOldPage = this.currentOldPage + 1
            this.pagedOldData()
        },
        fetchOldPrev() {
            this.currentOldPage = this.currentOldPage - 1
            this.fetchData()
        },
        fetchNewNext() {
            this.currentNewPage = this.currentNewPage + 1
            this.pagedOldData()
        },
        fetchNewPrev() {
            this.currentNewPage = this.currentNewPage - 1
            this.fetchData()
        },
        confirmImport(){
            confirmExcelImport(this.formData).then(res=>{
                if(res.state==0){
                    this.fetchData()
                    this.confirmVisible=false
                    this.$message({
                        type: 'success',
                        message: '导入成功'
                    })
                }
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: '导入失败'
                })
            })
        },
        setExport2Excel() {

            var multipleSelection = this.multipleSelection;
            console.log(multipleSelection)
            if (multipleSelection.length <= 0) {
                this.$message({
                    message: '请选择导入信息',
                    type: 'warning'
                })
                return 
            }
            //tableLabel.
            const filterVal = this.tableLabel.map(obj=>obj.prop)//对应list'name',获取对应'value'
            var list = multipleSelection
            var merges = []
            
           
           
            const data = formatJson(filterVal, list);
            //console.log( this.formatDateTimeNow())
            const filename = '导入信息' + this.formatDateTimeNow();

            const title =this.tableLabel.map(obj=>obj.label) //['客户名称', '客户简称', '岗位', '地址','联系电话']
            let wscols = [    // 每列不同宽度px
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
            ];
            const borderAll = {
                //单元格外侧框线
                top: {
                    style: "thin"
                },
                bottom: {
                    style: "thin"
                },
                left: {
                    style: "thin"
                },
                right: {
                    style: "thin"
                }
            };
            let titleStyle = {
                font: {
                    name: "等线",
                    sz: 16,
                    color: { rgb: "000000" },
                    //bold: true
                    // italic: false,
                    // underline: false
                },
                border: borderAll,
                alignment: {
                    horizontal: "center",
                    vertical: "center"
                },
                

            };
            var titleInfo = []
            import("@/api/excel/BluesExport2Excel").then(excel => {
                //表头对应字段    
                excel.export_json_to_excel({
                    multiHeader: title,
                    header: [],
                    data2: data,
                    wscols: wscols,
                    titleInfo: titleInfo,
                    titleStyle: titleStyle,
                    filename: filename,
                    merges: merges,
                    autoWidth: true,
                    bookType: "xlsx",
                    //tail: tail,
                    //description: description
                });
            });




        },
        formatDateTimeNow() {
            // 获取单元格数据
            //let datac =Date.now
            let dtc = new Date()
            //获取月,默认月份从0开始
            let dtuMonth = dtc.getMonth() + 1
            //获取日
            let dtuDay = dtc.getDate()
            //处理1-9月前面加0
            if (dtuMonth < 10) {
                dtuMonth = "0" + (dtc.getMonth() + 1)
            }
            //处理1-9天前面加0
            if (dtuDay < 10) {
                dtuDay = "0" + dtc.getDate()
            }
            //获取小时
            let dtuHours = dtc.getHours()
            //处理1-9时前面加0
            if (dtuHours < 10) {
                dtuHours = "0" + dtc.getHours()
            }
            //获取分钟
            let dtuMinutes = dtc.getMinutes()
            //处理1-9分前面加0
            if (dtuMinutes < 10) {
                dtuMinutes = "0" + dtc.getMinutes()
            }
            //获取秒
            let dtuSeconds = dtc.getSeconds()
            //处理1-9秒前面加0
            if (dtuSeconds < 10) {
                dtuSeconds = "0" + dtc.getSeconds()
            }
            //组装年月日时分秒,按自己的要求来
            return dtc.getFullYear() + '' + dtuMonth + '' + dtuDay
            //+ " " + dtuHours
            // + ":" + dtuMinutes + ":" + dtuSeconds
        },
        exportTemplateExcel() {
            //tableLabel.
            const filterVal = this.templateExcel.map(obj => obj.prop)//对应list'name',获取对应'value'
            var list = []
            var merges = []
            const data = [];
            //console.log( this.formatDateTimeNow())
            const filename = '辅料盘点模板' + this.formatDateTimeNow();

            const title = this.templateExcel.map(obj => obj.label) //['客户名称', '客户简称', '岗位', '地址','联系电话']
           
            let wscols = [    // 每列不同宽度px
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
            ];
            const borderAll = {
                //单元格外侧框线
                top: {
                    style: "thin"
                },
                bottom: {
                    style: "thin"
                },
                left: {
                    style: "thin"
                },
                right: {
                    style: "thin"
                }
            };
            let titleStyle = {
                font: {
                    name: "等线",
                    sz: 16,
                    color: { rgb: "000000" },
                    //bold: true
                    // italic: false,
                    // underline: false
                },
                border: borderAll,
                alignment: {
                    horizontal: "center",
                    vertical: "center"
                },
                fill: {
                    fgColor: { rgb: "fcfc04" },
                },
            };
            var titleInfo = []
            import("@/api/excel/BluesExport2Excel").then(excel => {
                //表头对应字段    
                excel.export_json_to_excel({
                    multiHeader: title,
                    header: [],
                    data2: data,
                    wscols: wscols,
                    titleInfo: titleInfo,
                    titleStyle: titleStyle,
                    filename: filename,
                    merges: merges,
                    autoWidth: true,
                    bookType: "xlsx",
                    //tail: tail,
                    //description: description
                });
            });




        },
    }
}