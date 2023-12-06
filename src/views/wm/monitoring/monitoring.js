import * as echarts from 'echarts';
import elementResizeDetector from "element-resize-detector";
import { GetInventoryMonitoring, GetInventoryMonitoringByLocation ,GetInventoryMonitoringByDifference} from '@/api/wm/monitoring'



export default {

    data() {
        return {
            // windowWidth: document.documentElement.clientWidth,  //实时屏幕宽度
            // windowHeight: document.documentElement.clientHeight,   //实时屏幕高度
            windowHeight: null,
            windowWidth: null,
            myChartByProject: null,
            myChartByPiNum: null,
            legendByProject: [],
            xAxisDataByProject: [],
            seriesByProject: [],
            legendByPiNum: [],
            xAxisDataByPiNum: [],
            seriesByPiNum: [],
            times: null,
            total: 0,
            listQuery: {
                pageIndex: 1,
                pageSize: 10,
                typeName: '',
                bin: '',
            },
            total: 0,
            list: null,
            allTable:[],
            listProject: null,
            listLoading: false,
            selRow: {},
            activeName: "Bin",
            differenceData:[],
            differenceVisible:false,
            differenceTitle:"差异详情",
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
                {
                    label: 'snState',
                    prop: 'snState'
                },
            ],
        }
    },
    // created() {
    //     //  this.getDataFun();　　// 实现轮询
    //     // this.times = setInterval(() => {
    //     //     this.getDataFun();
    //     // }, 1000 * 2);
    // },
    created() {
        //this.getDataFun();
        this.init()
    },
    watch: {

        // windowHeight (val) {
        //   let that = this;
        //   console.log("实时屏幕高度：",val, that.windowHeight );
        // },
        // windowWidth (val) {
        //   let that = this;
        //   console.log("实时屏幕宽度：",val, that.windowHeight );
        // }
        // windowHeight:null,
        // windowWidth:null,
    },
    // 页面初始化挂载dom
    mounted() {
        this.onresize();
        this.getDataFun();
        this.initGetList();
        // 实现轮询
        this.times = setInterval(() => {
            this.getDataFun();
            this.initGetList();
        }, 1000 * 120);
        //this.getDataFun()
    },

    methods: {
        init() {
        },
        initGetList() {
            GetInventoryMonitoringByLocation().then(data => {
                this.list = data.filter(label => label.name == 'Bin');
                this.listProject = data.filter(label => label.name == 'Project');
                // console.log(this.list ,'this.list ')
                // console.log(this.listProject ,'this.listProject ')
            })
        },

        initChartsByProject() {
            var chartDom = document.getElementById('main1');
            //var colors= ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
            if (this.myChartByProject == null)
                this.myChartByProject = echarts.init(chartDom);

            var option;
            option = {
                //color: colors,
                title: {
                    text: '今日项目盘点进度',
                    //subtext: 'Fake Data',
                    left: 'left',
                    //top: '1%',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: this.legendByProject
                },
                // toolbox: {
                //     show: true,
                // },
                // calculable: true,

                xAxis: [
                    {
                        type: 'category',
                        // prettier-ignore
                        data: this.xAxisDataByProject
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: this.seriesByProject

            };

            option && this.myChartByProject.setOption(option);
            // this.windowResize()
            window.addEventListener('resize', () => {
                this.myChartByProject.resize();
            });
        },
        initChartsByPiNum() {
            var chartDom = document.getElementById('main2');
            if (this.myChartByPiNum == null)
                this.myChartByPiNum = echarts.init(chartDom);
            var option;
            option = {
                //color: colors,
                title: {
                    text: '今日批次号盘点进度',
                    //subtext: 'Fake Data',
                    left: 'left',
                    //top: '2%',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: this.legendByPiNum
                },
                xAxis: [
                    {
                        type: 'category',
                        // prettier-ignore
                        data: this.xAxisDataByPiNum
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: this.seriesByPiNum

            };

            option && this.myChartByPiNum.setOption(option);
            // this.windowResize()
            window.addEventListener('resize', () => {
                this.myChartByPiNum.resize();
            });
        },
        // windowResize(){
        //     window.addEventListener('resize', () => {
        //         this.myChart.resize();
        //     });
        // },
        getDataFun() {
            // this.legendByProject=[];
            // this.xAxisDataByProject=[];
            this.seriesByProject = [];
            // this.legendByPiNum=[];
            // this.xAxisDataByPiNum=[];
            this.seriesByPiNum = [];
            // var pieDataByFail = []
            GetInventoryMonitoring().then(data => {
                this.legendByProject = data.listInventoryProject.map(item => item.projectName);
                this.xAxisDataByProject = data.listInventoryProject[0].inventoryHoursCounts.map(item => item.groupDay);
                data.listInventoryProject.forEach(element => {
                    this.seriesByProject.push({
                        name: element.projectName,
                        type: 'bar',
                        barWidth: 22,//柱图宽度
                        data: element.inventoryHoursCounts.map(x => x.countNum)
                    })
                });
                this.legendByPiNum = data.listInventoryPiNum.map(item => item.piNum);
                this.xAxisDataByPiNum = data.listInventoryPiNum[0].inventoryHoursCounts.map(item => item.groupDay);
                data.listInventoryPiNum.forEach(element => {
                    this.seriesByPiNum.push({
                        name: element.piNum,
                        type: 'bar',
                        barWidth: 22,//柱图宽度
                        data: element.inventoryHoursCounts.map(x => x.countNum)
                    })
                });
                // console.log(this.legendByProject)
                // console.log(this.xAxisDataByProject)
                // console.log(this.seriesByProject)
                this.initChartsByProject()
                this.initChartsByPiNum()
            })

            // this.pieData=pieData
            // this.myChart.dispose()
            //         this.myChart = null
            // this.pieDataByFail=pieDataByFail
            // this.initCharts();
            // this.initChartsByFail()

        },
        onresize() {
            const that = this;
            var erd = elementResizeDetector();
            erd.listenTo(document.getElementById('row'), (element) => {   //监听的domdocument.get方法获取
                that.windowWidth = element.offsetWidth;
                that.windowHeight = document.documentElement.clientHeight - 80;

                that.$nextTick(() => {

                    //this.getDataFun();
                    console.log("宽：" + that.windowWidth, "高：" + that.windowHeight)
                    // 这里填写监听改变后的操作
                });
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
            return s_x;
        },
        handleClick(tab, event) {
            // if(tab.name=='inventory'){
            //     this.cardTable=this.tableLabel
            // }else{
            //     this.cardTable=this.tableLabelByAuxiliary
            // }
            console.log(tab, event);
        },
        openTable(val) {
            this.$router.push({
                path: '/DataQuery',
                query: {
                  funcName: 'getMonitoringByDifference',
                  bin:val.bin,
                  typeName:val.name,
                },
                // param:{
                //     bin:val.bin
                // }
              })
            //this.differenceVisible=true
            console.log(val, 'val')
        },
        // fetchData(){
        //     GetInventoryMonitoringByDifference().then(data=>{
        //         this.allTable=data
        //         const startIndex = (this.currentPage - 1) * this.pageSize;
        //         const endIndex = startIndex + this.pageSize;
        //         this.differenceData =  this.allTable.slice(startIndex, endIndex);
        //         // this.differenceData=data
        //         return this.differenceData
                
        //     })
        // },
        // handleSizeChange(pageIndex) {
        //     this.pageSize = pageIndex
        //     this.pagedData()
        // },
        // handleCurrentChange(pageSize) {
        //     this.currentPage = pageSize

        //     this.pagedData()
        // },
        // fetchNext() {
        //     this.currentPage = this.currentPage + 1
        //     this.pagedData()
        // },
        // fetchPrev() {
        //     this.currentPage = this.currentPage - 1
        //     this.fetchData()
        // },
    }
}

