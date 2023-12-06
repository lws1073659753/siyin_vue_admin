//import * as echarts from 'echarts';
import elementResizeDetector from "element-resize-detector";
import permission from '@/directive/permission/index.js'


export default {
    directives: { permission },

    data() {
        return {
            windowHeight: null,
            windowWidth: null,
            myChart: null,
            myChartByFail: null,
            pieData: [],
            deptList: [],
            roleList: [],
            permissons: [],
            permissonVisible: false,
            pieDataByFail: [],
            times: null,
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                name: undefined,
                settlementTypeName: '',
                beginTime: '',
                endTime: ''
            },
            pieQuery: {
                times: ''
            },
            // downLoadChartsData: {
            //     seriesData: [454, 886, 367, 278, 567, 454, 886, 367, 278, 567],
            //     yAxisData: ['分类1', '分类2', '分类3', '分类4', '分类5', '分类1', '分类2', '分类3', '分类4', '分类10'],
            //     yDataMax: 1000,
            //     yDataMin: 0
            // },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        start.setMonth(start.getMonth() - 1);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        //start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        start.setMonth(start.getMonth() - 3);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近六个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        //start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                        start.setMonth(start.getMonth() - 6);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一年',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        //start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
                        start.setMonth(start.getMonth() - 12);
                        picker.$emit('pick', [start, end]);
                    }
                },


                ]
            },
            spanArr: [], //遍历数据时，根据相同的标识去存储记录
            pos: 0,// 二维数组的索引
            total: 0,
            list: null,
            payList: null,
            listLoading: false,
            selRow: {},
            nameWidth:null,
            workerNameWidth:null,
            settlementNodeNameContentWidth:null,
            activeName: '应收款'
        }
    },
    // created() {
    //     //  this.getDataFun();　　// 实现轮询
    //     // this.times = setInterval(() => {
    //     //     this.getDataFun();
    //     // }, 1000 * 2);
    // },
    created() {
        const end = new Date();
        const start = new Date();
        //start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
        start.setMonth(start.getMonth() - 12);
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
        this.pieQuery.times = [start, end]
        this.init()
    },
    watch: {


    },
    // 页面初始化挂载dom
    mounted() {
        //this.onresize();
        // const end = new Date();
        // const start = new Date();
        // //start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
        // start.setMonth(start.getMonth() - 12);
        // end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
        // this.pieQuery.times = [start, end]
        //this.getList()
        // this.initCharts()
        // 实现轮询
        // this.times = setInterval(() => {
        //     this.getDataFun();
        // }, 1000 * 60);
        //this.getDataFun()
    },

    methods: {
        init() {
            //this.getList()
            this.fetchData()
        },
        getList() {
            this.listLoading = true
            this.listQuery.settlementTypeName = this.activeName
            this.listQuery.beginTime = this.pieQuery.times[0]
            this.listQuery.endTime = this.pieQuery.times[1]
            //console.log(this.listQuery)
            this.list = null
            this.payList = null
            GetProjectProgress(this.listQuery).then(data => {
                //console.log(data)



                //页面展示的数据，不一定是全部的数据，所以每次都清空之前存储的 保证遍历的数据是最新的数据。以免造成数据渲染混乱
                var spanArr = []
                var pos = 0
                var data2 = []
                //var data=data.data
                data.data.forEach((item, index) => {
                    // if(item.collectionAmount==null){
                    //     //item.collectionAmount=0
                    //     //item.push({speedOfProgress:0})
                    //     this.$set(item,'speedOfProgress',0)
                    // }else{

                    //     //item.push({speedOfProgress:this.NumRoundtoFormat((item.collectionAmount/item.invoiceProce)*100,2)})
                    //     this.$set(item,'speedOfProgress',this.NumRoundtoFormat((item.collectionAmount/item.invoiceProce)*100,2))
                    //     //item.collectionAmount=
                    //     //console.log(item.collectionAmount)
                    // }
                    //判断是否是第一项
                    if (index === 0) {
                        spanArr.push(1)
                        pos = 0
                    } else {
                        //不是第一项时，就根据标识去存储
                        if (data.data[index].name === data.data[index - 1].name) {
                            // 查找到符合条件的数据时每次要把之前存储的数据+1
                            spanArr[pos] += 1
                            spanArr.push(0)
                        } else {
                            // 没有符合的数据时，要记住当前的index
                            spanArr.push(1)
                            pos = index
                        }
                    }
                    data2.push({
                        children: item.children,
                        collectionAmount: item.collectionAmount,
                        currentState: item.currentState,
                        dayPrice: item.dayPrice,
                        invoiceProce: item.invoiceProce,
                        isPretax: item.isPretax,
                        isProjectSettlement: item.isProjectSettlement,
                        name: item.name,
                        parentId: item.parentId,
                        projectCurrentState: item.projectCurrentState,
                        projectId: item.projectId,
                        settelmeneId: item.settelmeneId,
                        settlementAmount: item.settlementAmount,
                        settlementModel: item.settlementModel,
                        settlementNode: item.settlementNode,
                        settlementNodeContent: item.settlementNodeContent,
                        settlementNodeName: item.settlementNodeName,
                        settlementObjectId: item.settlementObjectId,
                        settlementObjectName: item.settlementObjectName,
                        settlementTypeName: item.settlementTypeName,
                        workerName: item.workerName,
                        settlementNodeNameContent:
                            item.settlementNodeName != null && item.settlementNodeContent != null ?
                                item.settlementNodeName + ':' + item.settlementNodeContent : null

                    })
                })
                if (this.activeName == '应收款') {
                    this.list = data2
                } else {
                    this.payList = data2
                }
                this.nameWidth=this.flexWidth('nameWidth', data2, '名称')
                this.workerNameWidth=this.flexWidth('workerNameWidth', data2, '项目经理')
                this.settlementNodeNameContentWidth=this.flexWidth('settlementNodeNameContent', data2, '节点名称')
                this.spanArr = spanArr
                this.pos = pos
                //console.log(data2)
                this.listLoading = false
                this.total = data.totalCount
                //console.log(this.total)
            })
        },
        fetchData() {
            this.getList()
        },
        search() {
            //this.getList()
            //console.log(this.pieQuery.times)
            if (this.pieQuery.times == null) {
                this.$message({
                    message: '请选择日期',
                    type: 'warning'
                })
                return
            } else {
                this.getList()
            }

            // this.getDataFun();
            // this.myChart.dispose()
            // this.myChart = null
        },
        reset() {
            this.listQuery.name = ''
            //this.pieQuery.times = ''
            this.pieQuery.times = null
            //this.getList()
            //this.getDataFun();
        },
        handleFilter() {
            this.search()
        },
        fetchNext() {
            this.listQuery.pageIndex = this.listQuery.pageIndex + 1
            this.search()
        },
        fetchPrev() {
            this.listQuery.pageIndex = this.listQuery.pageIndex - 1
            this.search()
        },
        fetchPage(pageIndex) {
            this.listQuery.pageIndex = pageIndex
            this.search()
        },
        changeSize(pageSize) {
            this.listQuery.pageSize = pageSize
            this.search()
        },
        handleCurrentChange(currentRow, oldCurrentRow) {
            this.selRow = currentRow
        },
        // initCharts() {
        //     // if(this.myChart!=null)
        //     //     this.myChart.dispose()
        //     var chartDom = document.getElementById('main');
        //     //const colors = ['#91cc75', '#5470c6'];

        //     //let myChart2 = this.$echarts.init(document.getElementById('main'))
        //     let option = {
        //         title: {
        //             text: '项目机会转化成功率',
        //             //subtext: 'Fake Data',
        //             left: 'center',
        //             top: '2%',
        //         },
        //         textStyle: {
        //             // fontSize: arr.initHeight,
        //             color: '#17233D'// 字体颜色
        //         },
        //         tooltip: {
        //             // 悬停指示
        //             trigger: 'item',
        //             formatter: '{b}  <b>{c}</b>',
        //             backgroundColor: '#FFFFFF',
        //             textStyle: {
        //                 fontSize: 14,
        //                 padding: 20,
        //                 color: '#515A6E'// 字体颜色
        //             }
        //             //   formatter: function (params) {
        //             //      return params[0].name + ': ' + params[0].value+"%";
        //             //   },
        //         },
        //         yAxis: {
        //             data: this.downLoadChartsData.yAxisData,
        //             axisTick: { // x轴刻度线
        //                 show: true
        //             },
        //             splitLine: { // 网格线
        //                 show: false
        //             },
        //             axisLine: { // 坐标轴线
        //                 show: true
        //             },
        //             axisLabel: { // 调整文字倾斜角度(rotate=xxx)和颜色
        //                 interval: 0,
        //                 margin: 16,
        //                 textStyle: {
        //                     color: '#17233D',
        //                     fontSize: 14
        //                 }
        //             }
        //         },
        //         xAxis: {
        //             show: false,
        //             max: this.downLoadChartsData.yDataMax,
        //             min: this.downLoadChartsData.yDataMin,
        //             position: 'right'
        //         },
        //         grid: {
        //             left: 24,
        //             right: 24,
        //             bottom: 16,
        //             top: 24,
        //             containLabel: true
        //         },
        //         series: [{
        //             name: '收缴率',
        //             type: 'bar',
        //             stack: '使用情况',
        //             data: this.downLoadChartsData.seriesData,
        //             barWidth: 8, // 柱图宽度
        //             barGap: 36, // 柱图之间的间距
        //             // 标签
        //             label: {
        //                 normal: {
        //                     show: true,
        //                     fontSize: 14,
        //                     position: 'right',
        //                     // offset: [450, 0],
        //                     formatter: '{c}' // 模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
        //                 }
        //             },
        //             showBackground: true,
        //             backgroundStyle: {
        //                 color: '#CDEDDD',
        //                 barBorderRadius: [0, 100, 100, 0]
        //             },
        //             itemStyle: {
        //                 normal: {
        //                     color: '#1FD178',
        //                     // 设置柱子圆角
        //                     barBorderRadius: [0, 100, 100, 0]
        //                 }
        //             },
        //             markPoint: {
        //                 symbol: 'pin', // 标记类型
        //                 symbolSize: 10, // 图形大小
        //                 itemStyle: {
        //                     normal: {
        //                         borderColor: 'green',
        //                         borderWidth: 1, // 标注边线线宽，单位px，默认为1
        //                         label: {
        //                             show: true,
        //                             fontSize: 14
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //         {
        //             name: '',
        //             type: 'bar',
        //             stack: '使用情况',
        //             // data: [100, 100, 100, 100, 100],
        //             itemStyle: {
        //                 barBorderRadius: [0, 100, 100, 0] // 统一设置四个角的圆角大小
        //             }
        //         }
        //         ]
        //     }
        //     this.myChart.setOption(option)
        //     //option && this.myChart.setOption(option);
        //     // this.windowResize()
        //     window.addEventListener('resize', () => {
        //         this.myChart.resize();
        //     });
        // },

        // windowResize(){
        //     window.addEventListener('resize', () => {
        //         this.myChart.resize();
        //     });
        // },
        getDataFun() {
            var pieData = []
            // var pieDataByFail = []
            // GetProjectProgress({
            //     beginTime: this.pieQuery.times[0],
            //     endTime: this.pieQuery.times[1],
            // }).then(res => {

            // })

        },
        // stop() {
        //     clearInterval(this.timer);
        //     this.timer = null;
        // },
        onresize() {
            const that = this;
            var erd = elementResizeDetector();
            erd.listenTo(document.getElementById('row'), (element) => {   //监听的domdocument.get方法获取
                that.windowWidth = element.offsetWidth;
                that.windowHeight = document.documentElement.clientHeight;

                // that.$nextTick(() => {

                //     //this.getDataFun();
                //     //console.log("宽：" + that.windowWidth, "高：" + that.windowHeight)
                //     // 这里填写监听改变后的操作
                // });
            });

        },
        NumRoundtoFormat(x, n) {
            var f_x = parseFloat(x);
            if (isNaN(f_x)) {
                alert("传递参数不是数字！");
                return false;
            }
            var f_x = Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
            var s_x = f_x.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + n) {
                s_x += '0';
            }
            return s_x * 1;
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            //var data = { row, column, rowIndex, columnIndex }
            //console.log(data)
            // console.log(row)
            // console.log(column)
            // console.log(rowIndex)
            // console.log(columnIndex)

            if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {

                // 二维数组存储的数据 取出
                const _row = this.spanArr[rowIndex]
                const _col = _row > 0 ? 1 : 0
                return {
                    rowspan: _row,
                    colspan: _col
                }
                //不可以return {rowspan：0， colspan: 0} 会造成数据不渲染， 也可以不写else，eslint过不了的话就返回false
            } else {
                return false
            }
        },
        handleClick() {
            this.search()
            // this.listQuery.settlementTypeName=this.activeName
            //console.log(this.activeName)
        },
        // flexTwoWidth(prop1, prop2, this.list, title) {
        //     console.log(this.flexWidth(prop1, tableData, title) + this.flexWidth(prop2, tableData, title))
        //     return this.flexWidth(prop1, tableData, title) + this.flexWidth(prop2, tableData, title) + 'px'
        // },

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
            if (tableData==null||tableData.length === 0) {//表格没数据不做处理
                return;
            }
            //console.log(tableData)
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
            flexWidth = width.width + 80 + num
            return flexWidth + 'px';
        },
    }

}

