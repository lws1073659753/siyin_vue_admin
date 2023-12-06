import permission from '@/directive/permission/index.js'
import { getList, GetDataQueryTableLabel, GetPagedAsyncByExport, GetDataQueryTableLabelByAuxiliary } from '@/api/wm/inventoryHistory'
import { formatJson } from '@/api/excel/excel'
import { getAll as getAllLocation } from '@/api/basicData/area'
import { getAll as getAllBin } from '@/api/basicData/warehouse'
import { getAll as getAllProject } from '@/api/basicData/itemproduct'
import { getList as getListByAuxiliary, GetPagedAsyncByExport as GetPagedAsyncByExportByAuxiliary } from '@/api/wm/auxiliaryCheck'
import { GetInventoryMonitoringByDifference ,GetInventoryMonitoringByDifferenceByExcel} from '@/api/wm/monitoring'
import { GetTableLabelDynamic } from '@/api/wm/dataImport'



export default {
    directives: { permission },
    data() {
        return {
            //uploadUrl: excelImport,
            headers: { "Content-Type": "multipart/form-data;charset=UTF-8" },
            activeName: "inventory",
            isAdd: true,
            tableLabel: [
                {
                    label: 'piNum',
                    prop: 'piNum'
                },
                {
                    label: 'piDpt',
                    prop: 'piDpt'
                },
                {
                    label: 'sysOrgSn',
                    prop: 'sysOrgSn'
                },
                {
                    label: 'sysOrgPn',
                    prop: 'sysOrgPn'
                },
                {
                    label: 'sysSn',
                    prop: 'sysSn'
                },
                {
                    label: 'sysPn',
                    prop: 'sysPn'
                },
                {
                    label: 'scanSn',
                    prop: 'scanSn'
                },
                {
                    label: 'scanPn',
                    prop: 'scanPn'
                },
                {
                    label: 'projectName',
                    prop: 'projectName'
                },
                {
                    label: 'sysBin',
                    prop: 'sysBin'
                },
                {
                    label: 'sysLocation',
                    prop: 'sysLocation'
                },
                {
                    label: 'boxName',
                    prop: 'boxName'
                },
                {
                    label: 'scanPallet',
                    prop: 'scanPallet'
                },
                {
                    label: 'source',
                    prop: 'source'
                },
                {
                    label: 'accountBook',
                    prop: 'accountBook'
                },
                {
                    label: 'piProject',
                    prop: 'piProject'
                },
                {
                    label: 'filingNo',
                    prop: 'filingNo'
                },
                {
                    label: 'createDept',
                    prop: 'createDept'
                },
                {
                    label: 'creator',
                    prop: 'creator'
                },
                {
                    label: 'createTime',
                    prop: 'createTime'
                },
                {
                    label: 'snState',
                    prop: 'snState'
                },
            ],
            tableLabelByDiff: [
                {
                    label: 'piNum',
                    prop: 'piNum'
                },
                {
                    label: 'snState',
                    prop: 'snState'
                },
                {
                    label: 'piDpt',
                    prop: 'piDpt'
                },
                {
                    label: 'sysOrgSn',
                    prop: 'sysOrgSn'
                },
                {
                    label: 'sysOrgPn',
                    prop: 'sysOrgPn'
                },
                {
                    label: 'sysSn',
                    prop: 'sysSn'
                },
                {
                    label: 'sysPn',
                    prop: 'sysPn'
                },
                {
                    label: 'sysBin',
                    prop: 'sysBin'
                },
                {
                    label: 'sysLocation',
                    prop: 'sysLocation'
                },
                {
                    label: 'source',
                    prop: 'source'
                },
                {
                    label: 'accountBook',
                    prop: 'accountBook'
                },
                {
                    label: 'piProject',
                    prop: 'piProject'
                },
                {
                    label: 'filingNo',
                    prop: 'filingNo'
                },
                {
                    label: 'createDept',
                    prop: 'createDept'
                },
                {
                    label: 'creator',
                    prop: 'creator'
                },
                {
                    label: 'createTime',
                    prop: 'createTime'
                },

            ],
            tableLabelByAuxiliary: [
                {
                    label: 'name',
                    prop: 'name'
                },
                {
                    label: 'sysPn',
                    prop: 'sysPn'
                },
                {
                    label: 'pnQty',
                    prop: 'pnQty'
                },

                {
                    label: 'createTime',
                    prop: 'createTime'
                },
                {
                    label: 'description',
                    prop: 'description'
                },
            ],
            differenceShow:false,
            InventoryShow:true,
            cardTable: [],
            currentPage: 1,
            tableData: [],
            tableLoading: false,
            excelTableVisible: false,
            checkAll: false,
            isIndeterminate: true,
            excelTableList: [],
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                deptName: undefined,
                location: undefined,
                projectName: undefined,
                sysBin: undefined,
                piNum: undefined,
                sysSn: undefined,
                sysPn: undefined,
                beginTime: '',
                endTime: '',
            },
            differenceData: [],
            total: 0,
            list: null,
            errorList: null,
            formData: undefined,
            listLoading: true,
            selRow: {},
            listProject: [],
            listLocation: [],
            listBin: [],

            multipleSelection: [],
            auxiliaryList: [],
            typeName: "Bin",

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
        this.initTableLabel();
        this.initTableLabelByAuxiliary();
        this.initGetListBin()
        this.initGetListLocation()
        this.initGetListProject()
        this.initTableLabelByDiff();
        this.cardTable = this.tableLabel
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
            if (new Date(this.listQuery.beginTime) > new Date(this.listQuery.endTime)) {
                this.$message({
                    message: '开始时间不能大于结束时间',
                    type: 'warning'
                });
                this.listLoading = false
                return
            }
            if (this.activeName == 'inventory') {
                console.log(this.listQuery)
                getList(this.listQuery).then(data => {
                    console.log(data)

                    this.list = data.data

                    this.listLoading = false
                    this.total = data.totalCount
                })
            }
            if (this.activeName == 'auxiliaryInventory') {
                getListByAuxiliary(this.listQuery).then(data => {
                    this.auxiliaryList = data.data
                    this.listLoading = false
                    this.total = data.totalCount
                })
            }
            if (this.activeName == 'difference') {
                if(this.listQuery.sysBin!=''&&this.listQuery.sysBin!=null){
                    this.typeName="Bin"
                }
                GetInventoryMonitoringByDifference({
                    typeName: this.typeName,
                    bin: this.listQuery.sysBin,
                    pageIndex: this.listQuery.pageIndex,
                    pageSize: this.listQuery.pageSize,
                }).then(data => {
                    console.log(data)
                    this.differenceData = data.data
                    this.listLoading = false
                    this.total = data.totalCount
                })
            }

        },
        search() {
            this.fetchData()
        },
        reset() {
            this.listQuery = {
                pageIndex: 1,
                pageSize: 10,
                deptName: undefined,
                location: undefined,
                projectName: undefined,
                sysBin: undefined,
                piNum: undefined,
                sysSn: undefined,
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
        initTableLabel() {
            GetDataQueryTableLabel().then(data => {
                this.tableLabel.forEach(element => {
                    data.forEach(item => {
                        if (item.name == element.prop) {
                            element.label = item.value
                        }
                    })

                })
            })
        },
        initTableLabelByDiff() {
            GetTableLabelDynamic().then(data => {
                this.tableLabelByDiff.forEach(element => {
                    data.forEach(item => {
                        if (item.name == element.prop) {
                            element.label = item.value
                        }
                    })

                })
            })
        },
        initTableLabelByAuxiliary() {
            GetDataQueryTableLabelByAuxiliary().then(data => {
                this.tableLabelByAuxiliary.forEach(element => {
                    data.forEach(item => {
                        if (item.name == element.prop) {
                            element.label = item.value
                        }
                    })

                })
            })
        },
        initGetListBin() {
            getAllBin().then(data => {
                this.listBin = data
            })
        },
        initGetListLocation() {
            getAllLocation().then(data => {
                this.listLocation = data
            })
        },
        initGetListProject() {
            getAllProject().then(data => {
                this.listProject = data
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        resetForm() {

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

        //时间格式化
        formatDateC(Time, hour) {
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

            //console.log(123)
        },
        getRowClassName({ row, rowIndex }) {
            if (!row.children) {
                return 'row-expand-cover'
            } else if (!row.children.length) {
                return 'row-expand-cover'
            }
        },

        setExport2Excel() {
            this.excelTableVisible = false;
            this.listLoading = true
            if (new Date(this.listQuery.beginTime) > new Date(this.listQuery.endTime)) {
                this.$message({
                    message: '开始时间不能大于结束时间',
                    type: 'warning'
                });
                this.listLoading = false
                return
            }
            var multipleSelection = []
            if (this.activeName == 'inventory') {
                GetPagedAsyncByExport(this.listQuery).then(data2 => {
                    multipleSelection = data2.data
                    const checkedLabels = this.tableLabel.filter(label => this.excelTableList.find((x) => x == label.label))
                    //tableLabel.
                    // console.log(checkedLabels,'checkedLabels')
                    // return;
                    const filterVal = checkedLabels.map(obj => obj.prop)//对应list'name',获取对应'value'
                    var list = multipleSelection
                    var merges = []
                    const data = formatJson(filterVal, list);
                    //console.log( this.formatDateTimeNow())
                    const filename = '导出主料盘点信息' + this.formatDateTimeNow();
                    const title = checkedLabels.map(obj => obj.label) //['客户名称', '客户简称', '岗位', '地址','联系电话']
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
                    var footTable = ["总计" + multipleSelection.length + "条"]
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
                            footTable: footTable,
                            //description: description
                        });
                    });
                    this.listLoading = false
                })
            }
            if (this.activeName == 'auxiliaryInventory') {
                GetPagedAsyncByExportByAuxiliary(this.listQuery).then(data2 => {
                    multipleSelection = data2.data
                    const checkedLabels = this.tableLabelByAuxiliary.filter(label => this.excelTableList.find((x) => x == label.label))
                    //tableLabel.
                    // console.log(checkedLabels,'checkedLabels')
                    // return;
                    const filterVal = checkedLabels.map(obj => obj.prop)//对应list'name',获取对应'value'
                    var list = multipleSelection
                    var merges = []
                    const data = formatJson(filterVal, list);
                    //console.log( this.formatDateTimeNow())
                    const filename = '导出辅料盘点信息' + this.formatDateTimeNow();
                    const title = checkedLabels.map(obj => obj.label) //['客户名称', '客户简称', '岗位', '地址','联系电话']
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
                    var footTable = ["总计" + multipleSelection.length + "条"]
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
                            footTable: footTable,
                            //tail: tail,
                            //description: description
                        });
                    });
                    this.listLoading = false
                })
            }
            if (this.activeName == 'difference') {
                GetInventoryMonitoringByDifferenceByExcel({
                    typeName: this.typeName,
                    bin: this.listQuery.sysBin,
                    pageIndex: this.listQuery.pageIndex,
                    pageSize: this.listQuery.pageSize,
                }).then(data2 => {
                    multipleSelection = data2.data
                    const checkedLabels = this.tableLabelByDiff.filter(label => this.excelTableList.find((x) => x == label.label))
                    //tableLabel.
                    // console.log(checkedLabels,'checkedLabels')
                    // return;
                    const filterVal = checkedLabels.map(obj => obj.prop)//对应list'name',获取对应'value'
                    var list = multipleSelection
                    var merges = []
                    const data = formatJson(filterVal, list);
                    //console.log( this.formatDateTimeNow())
                    const filename = '导出差异信息' + this.formatDateTimeNow();
                    const title = checkedLabels.map(obj => obj.label) //['客户名称', '客户简称', '岗位', '地址','联系电话']
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
                    var footTable = ["总计" + multipleSelection.length + "条"]
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
                            footTable: footTable,
                            //description: description
                        });
                    });
                    this.listLoading = false
                })
            }

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
        setExport() {
            this.excelTableVisible = true
            this.excelTableList = this.cardTable.map(label => label.label)
            console.log(this.cardTable,'cardTable')
            this.handleCheckedCitiesChange(this.excelTableList)
        },
        handleCheckAllChange(val) {

            this.excelTableList = val ? this.cardTable.map(label => label.label) : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {

            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cardTable.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cardTable.length;
        },
        handleClick(tab, event) {
            // this.listQuery = {
            //     pageIndex: 1,
            //     pageSize: 10,
            //     deptName: undefined,
            //     location: undefined,
            //     projectName: undefined,
            //     sysBin: undefined,
            //     piNum: undefined,
            //     sysSn: undefined,
            //     sysPn: undefined,
            //     beginTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
            //     endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 0, 0, 0),
            // }
           
            //this.total = 0;
            if (tab.name == 'inventory') {
                this.InventoryShow=true
                this.differenceShow=false
                this.cardTable = this.tableLabel
            }
            if (tab.name == 'auxiliaryInventory') {
                this.InventoryShow=true
                this.differenceShow=false
                this.cardTable = this.tableLabelByAuxiliary
            }
            if (tab.name == 'difference') {
                this.InventoryShow=false
                this.differenceShow=true
                this.cardTable = this.tableLabelByDiff
            }
            //console.log(tab, event);
        },
        getMonitoringByDifference() {
            this.activeName = 'difference'
            this.cardTable = this.tableLabelByDiff
            this.InventoryShow=false
            this.differenceShow=true
            this.listLoading = true
            this.initTableLabelByDiff()
            GetInventoryMonitoringByDifference({
                typeName: this.typeName,
                bin: this.listQuery.sysBin,
                pageIndex: this.listQuery.pageIndex,
                pageSize: this.listQuery.pageSize,
            }).then(data => {
                console.log(data)
                this.differenceData = data.data
                this.listLoading = false
                this.total = data.totalCount
            })
        },

    },
    mounted() {
        const bin = this.$route.query.bin
        const typeName = this.$route.query.typeName
        this.typeName = typeName
        console.log( this.typeName,' this.typeName this.typeName')
        this.listQuery.sysBin = bin
        
        const funcName = this.$route.query.funcName
        if (this[funcName]) {
            this[funcName]()
        }
    }
}