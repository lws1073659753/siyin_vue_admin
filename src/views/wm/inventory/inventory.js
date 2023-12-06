import permission from '@/directive/permission/index.js'
import { getUerInfo } from '@/api/usr/user'
import { getAll as getAllLocation } from '@/api/basicData/area'
import { getAll as getAllBin } from '@/api/basicData/warehouse'
import { getAll as getAllProject } from '@/api/basicData/itemproduct'
import { GetPrimaryDataDtoBySn } from '@/api/wm/dataImport'
import { CreateErrorSnHistory } from '@/api/wm/inventoryHistory'
import { CreateInventory, GetPalletQty, remove as removeByScan } from '@/api/wm/inventory'
import { GetBoxName, AnyAsyncBoxName } from '@/api/wm/box'
import { PrintInventorySheet, PrintInventorySheetByBox } from '@/api/wm/pallet'
import { GetAtchNoByName } from '@/api/wm/atchNo'

import docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import JSZipUtils from "jszip-utils";

export default {
  directives: { permission },
  data() {
    return {
      isAdd: true,
      isAutomatic: false,
      isScanPn: true,
      errorVisible: false,
      isSave:false,
      deptName: '',
      activeName: '扫入数据',
      tableLabel: [
        {
          label: '批次号',
          prop: 'piNum'
        },
        {
          label: '部门',
          prop: 'piDpt'
        },
        {
          label: '希捷SN',
          prop: 'sysOrgSn'
        },
        {
          label: '希捷PN',
          prop: 'sysOrgPn'
        },
        {
          label: '导入SN',
          prop: 'sysSn'
        },
        {
          label: '导入PN',
          prop: 'sysPn'
        },
        {
          label: '扫入SN',
          prop: 'scanSn'
        },
        {
          label: '扫入PN',
          prop: 'scanPn'
        },
        {
          label: 'bin',
          prop: 'sysBin'
        },
        {
          label: '区域',
          prop: 'sysLocation'
        },
        {
          label: '箱号Box',
          prop: 'boxName'
        },
        {
          label: '拖号Pallet',
          prop: 'scanPallet'
        },
        {
          label: '来源',
          prop: 'source'
        },
        {
          label: '账册编号',
          prop: 'accountBook'
        },
        {
          label: '项号',
          prop: 'piProject'
        },
        {
          label: '备案编号',
          prop: 'filingNo'
        },
        {
          label: '导入部门',
          prop: 'createDept'
        },
        {
          label: '导入人员',
          prop: 'creator'
        },
        {
          label: '导入时间',
          prop: 'createTime'
        },
        {
          label: 'SN状态',
          prop: 'snState'
        },
      ],
      tableErrorLabel: [

        {
          label: '部门',
          prop: 'piDpt'
        },
        {
          label: '实物sn',
          prop: 'scanSn'
        },
        {
          label: 'bin',
          prop: 'sysBin'
        },
        {
          label: '区域',
          prop: 'sysLocation'
        },
        {
          label: '项号',
          prop: 'piProject'
        },
        {
          label: 'SN状态',
          prop: 'snState'
        },
      ],
      form: {
        bin: '',
        location: '',
        pallet: '',
        automaticTag: '',
        boxName: '',
        // scanSn:'',
        // scanPn:'',
        boxQTY: 0,
        palletQty: 0,
        projectName: '',
        snRules: 8,
        pnRules: 10,
        piNum: '',//批次号
        selectPiNum: '',
        snReplace: '',
        endShield: '',
        boxPrefix: '',
        tagPrefix: '',
        isPlantSn: false,
        closePN: false,//是否关闭Pn
        openBox: false,
      },
      //atchNoState:'',
      errorText: '',
      scanSn: '',
      scanPn: '',
      oldScanSn: '',
      tableData: [],
      tableNewData: [],
      tableErrorData: [],
      tableCheckData: [],
      rules: {
        bin: [
          { required: true, message: '请选bin', trigger: 'change' }
        ],
        location: [
          { required: true, message: '请选区域', trigger: 'change' }
        ],
        projectName: [
          { required: true, message: '请选项目', trigger: ["blur", 'change'] }
        ],
        pallet: [
          { required: true, message: '请输入拖号', trigger: 'blur' }
        ],
        boxName: [
          { required: true, message: '请输入箱号', trigger: 'blur' }
        ],
        // bin: [
        //   { required: true, message: '请选bin', trigger: 'blur' }
        // ],
        // desc: [
        //   { required: true, message: '请填写活动形式', trigger: 'blur' }
        // ]
      },
      checkVisible: false,
      checkTitle: '选择',
      list: null,
      listBin: [],
      listLocation: [],
      listProject: [],
      listLoading: true,
      selRow: {},
      checkTableByOne: {},
      dataNowRow: null,
      printData: {},
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
    this.init()
  },
  methods: {
    init() {
      this.initUserInfo()
      this.initGetListBin()
      this.initGetListLocation()
      this.initGetListProject()
    },
    initUserInfo() {
      getUerInfo().then(res => {
        // console.log(res,'res')
        this.deptName = res.profile.deptFullName
        if (res.profile.deptFullName == '仓库部门') {
          this.isAutomatic = true
        } else {
          this.isAutomatic = false
        }
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
    initGetBoxName() {
      GetBoxName(this.form.boxPrefix, this.form.bin, this.form.pallet).then(data => {
        this.form.boxName = data.toString()
        console.log( this.form.boxName,' this.form.boxName')
      })
    },
    // initGetPalletName() {
    //   GetPalletName(this.form.tagPrefix).then(data => {
    //     this.form.automaticTag = data
    //   })
    // },
    initAnyBoxName() {
      AnyAsyncBoxName(this.form.boxName).then(data => {
        this.form.boxName = data;
      }).catch(err => {
        this.errorText = "已经存在box信息"
        return;
      })
    },
    // initAtchNoState(){
    //   GetAtchNoByName(this.form.piNum).then(data =>{
    //     console.log(this.form.piNum,'this.form.piNum')
    //     console.log(data,'data')
    //       this.atchNoState=data.state
    //   })
    // },
    initGetPallQty() {
      GetPalletQty(this.form.pallet).then(data => {
        this.form.palletQty = data
      })
    },
    resetForm() {

      GetPalletQty(this.form.pallet).then(data => {
        this.form.palletQty = data
        this.form = {
          bin: this.form.bin,
          location: this.form.location,
          pallet: this.form.pallet,
          automaticTag: '',
          boxName: '',
          // scanSn:'',
          // scanPn:'',
          boxQTY: 0,
          palletQty: this.form.palletQty,
          projectName: this.form.projectName,
          snRules: this.form.snRules,
          pnRules: this.form.pnRules,
          piNum: '',//批次号
          selectPiNum: '',
          snReplace: this.form.snReplace,
          endShield: this.form.endShield,
          boxPrefix: this.form.boxPrefix,
          tagPrefix: this.form.tagPrefix,
          isPlantSn: false,
          closePN: this.form.closePN,
          openBox: false,
        }
      })
      //this.$refs['form'].resetFields();
      console.log(this.form, 'this.form')
      this.errorText = '';
      this.scanSn = '';
      this.scanPn = '';
      this.oldScanSn = '';
      this.tableData = [];
      this.tableNewData = [];
      this.tableCheckData = [];
      this.initUserInfo()
      if (this.isAutomatic) {
        this.$nextTick(() => {
          this.focusNext('scanSn')
        });
      } else {
        this.$nextTick(() => {
          this.focusNext('scanBox')
        });
        // this.focusNext('scanBox')
      }

    },

    save() {
      if (!this.isScanPn) {
        this.errorText = '请扫入pn后在保存'
        return
      }
      console.log(this.form)
      if (this.form.piNum != "" && this.form.piNum != null) {
        GetAtchNoByName(this.form.piNum).then(res => {
          if (res.state == "已关闭") {
            this.errorText = '批次号' + this.form.piNum + '已关闭请更换批次号在盘点'
            this.scanPn = ''
            this.scanSn = ''
            this.isScanPn = true
            this.errorVisible = true
          } else {
            this.$refs['refForm'].validate((valid) => {
              console.log(valid)
              if (valid) {
                this.isSave=true
                CreateInventory({
                  bin: this.form.bin,
                  location: this.form.location,
                  projectName: this.form.projectName,
                  boxName: this.form.boxName + '',
                  automaticTag: this.form.automaticTag,
                  pallet: this.form.pallet,
                  snRules: this.form.snRules,
                  pnRules: this.form.pnRules,
                  snReplace: this.form.snReplace,
                  endShield: this.form.endShield,
                  boxPrefix: this.form.boxPrefix,
                  tagPrefix: this.form.tagPrefix,
                  isPlantSn: this.form.IsPlantSn,
                  isBoxAutomatic: this.isAutomatic,
                  primaryNewDataDtos: this.tableNewData,
                  //primaryOldDataDtos: this.tableOldData,
                }).then(res => {
                  this.isSave=false
                  if (res.state == 0) {//清空数据
                    this.resetForm()
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    })
                  } else {//弹出信息区别模板
                    if (res.diffPrimaryDataDtos.length > 0) {
                      var str = res.diffPrimaryDataDtos.join(",")
                      this.errorText = "下面SN已经修改数据请删除后重新扫入" + str + "";
                      this.errorVisible = true
                      return;
                    } else {
                      var str = res.inventoryDataDtos.join(",")
                      this.errorText = "下面SN已经盘点" + str + "";
                      this.errorVisible = true
                      return
                    }
                  }
                  // this.fetchData()
                })
              } else {
                console.log('error submit!!')
                return false
              }
            })
          }

        })
      } else {
        this.$refs['refForm'].validate((valid) => {
          console.log(valid)
          if (valid) {
            this.isSave=true
            CreateInventory({
              bin: this.form.bin,
              location: this.form.location,
              projectName: this.form.projectName,
              boxName: this.form.boxName + '',
              automaticTag: this.form.automaticTag,
              pallet: this.form.pallet,
              snRules: this.form.snRules,
              pnRules: this.form.pnRules,
              snReplace: this.form.snReplace,
              endShield: this.form.endShield,
              boxPrefix: this.form.boxPrefix,
              tagPrefix: this.form.tagPrefix,
              isPlantSn: this.form.IsPlantSn,
              isBoxAutomatic: this.isAutomatic,
              primaryNewDataDtos: this.tableNewData,
              //primaryOldDataDtos: this.tableOldData,
            }).then(res => {
              this.isSave=false
              if (res.state == 0) {//清空数据
                this.resetForm()
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              } else {//弹出信息区别模板
                if (res.diffPrimaryDataDtos.length > 0) {
                  var str = res.diffPrimaryDataDtos.join(",")
                  this.errorText = "下面SN已经修改数据请删除后重新扫入" + str + "";
                  this.errorVisible = true
                  return;
                } else {
                  var str = res.inventoryDataDtos.join(",")
                  this.errorText = "下面SN已经盘点" + str + "";
                  this.errorVisible = true
                  return
                }

              }
              // this.fetchData()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }


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

    removeTableData(row) {
      console.log(row)
      //this.handleCurrentChange(row)
      this.$confirm('确定删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.id != null) {
          removeByScan(row.id).then(res => {
          })
        }
        //console.log(row, 'row')
        // console.log(this.tableData, ' this.tableData')
        // console.log(this.tableNewData, ' this.tableNewData')
        this.tableData = this.tableData.filter(item => item !== row);
        
        this.tableNewData = this.tableNewData.filter(item => row.id==null? item.scanSn!=row.scanSn:item.id != row.id); 
        console.log(this.tableData, ' this.tableData')
        console.log(this.tableNewData, ' this.tableNewData')
        //this.tableOldData = this.tableOldData.filter(item => item !== row);
        if (this.tableData.length == 0) {
          this.form.piNum = ''
        }
        //this.form.palletQty--;
        this.form.boxQTY = this.tableData.length
        this.errorText = '删除成功'
        if (this.form.closePN == true) {
          this.isScanPn = true
          this.scanSn = ''
          this.scanPn = ''
          this.errorText = ''
          this.$nextTick(() => {
            this.focusNext('scanSn')
          });
        } else {
          if (row.scanSn == this.dataNowRow.scanSn) {//
            this.dataNowRow = null
            this.isScanPn = true
            this.scanSn = ''
            this.scanPn = ''
            this.errorText = ''
            this.$nextTick(() => {
              this.focusNext('scanSn')
            });
          } else {
            if (this.this.dataNowRow == null) {
              this.isScanPn = true
              this.scanSn = ''
              this.scanPn = ''
              this.errorText = ''
              this.$nextTick(() => {
                this.focusNext('scanSn')
              });
            } else {
              this.scanPn = ''
              this.isScanPn = false
              this.$nextTick(() => {
                this.focusNext('scanPn')
              });
            }

          }
        }

      }).catch(() => {
      })
    },
    //时间格式化
    formatDateC(row) {
      // 获取单元格数据
      let datac = row.projectDto.startTime
      let dtc = new Date(datac)
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
      //+ " " + dtuHours + ":" + dtuMinutes + ":" + dtuSeconds
    },
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
      this.scanPn = ''
      this.scanSn = ''
      this.form.piNum = ''
      this.tableData = []
      this.tableNewData = []
      this.dataNowRow = []
      this.isScanPn = true
      this.checkVisible = false;
      //console.log(123)
    },

    getRowClassName({ row, rowIndex }) {
      if (!row.children) {
        return 'row-expand-cover'
      } else if (!row.children.length) {
        return 'row-expand-cover'
      }
    },
    changeProject(res) {
      this.listProject.forEach(item => {
        if (item.name == res) {
          this.form.projectName = res
          this.form.snReplace = item.snReplace
          this.form.endShield = item.endShield
          this.form.isPlantSn = item.isPlantSn != null ? item.isPlantSn : false;
          this.form.boxPrefix = item.boxPrefix == null ? '' : item.boxPrefix;
          this.form.tagPrefix = item.taG_NOPrefix == null ? '' : item.taG_NOPrefix;
          //console.log(item, ' item')
        }
      })
    },
    changePallet(res) {
      //console.log(res)
      this.form.pallet = this.form.pallet.replace(/[, ]/g, '')
      this.initGetPallQty()
      if (this.isAutomatic) {
        this.$nextTick(() => {
          this.focusNext('scanSn')
        });
      } else {
        this.$nextTick(() => {
          this.focusNext('scanBox')
        });
        // this.focusNext('scanBox')
      }
    },
    changeBox(res) {
      //this.initAnyBoxName();
      this.initGetPallQty()
      AnyAsyncBoxName(this.form.boxName).then(data => {
        console.log(data, 'data')
        if (data.length > 0) {//存在box页面显示box下SN的数量
          this.tableData = data
          this.isScanPn = true
          this.scanSn = ''
          this.scanPn = ''
          this.errorText = ''
          this.form.boxQTY = this.tableData.length
          // GetPalletQty(this.form.pallet).then(data => {
          //   this.form.palletQty = data+this.tableData.length
          // })
          //this.form.palletQIY += this.tableData.length
          this.$nextTick(() => {
            this.focusNext('scanSn')
          });
          // this.errorText = "该箱号" + this.form.boxName + '已经存在'
          // this.form.boxName = ""
          // this.$nextTick(() => {
          //   this.focusNext('scanBox')
          // });
          // return;
        } else {
          this.tableData = []
          this.tableNewData = []
          this.isScanPn = true
          this.scanSn = ''
          this.scanPn = ''
          this.errorText = ''
          this.form.boxQTY = this.tableData.length
          this.$nextTick(() => {
            this.focusNext('scanSn')
          });

        }
      })

    },
    changeSn(res) {
      res= res.replace(/[, ]/g, '')
      res = res.toUpperCase();
      this.scanSn = res
      //this.scanSn = this.scanSn.toUpperCase();
      if (this.errorVisible) {
        this.scanSn = ''
        this.errorVisible = false
        return;
      }
     
      this.errorText = ""
      console.log(res, 'res')
      if (res == "") {
        return;
      }

      if (this.form.projectName == "" || this.form.projectName == null) {
        this.errorText = '请先选择项目号'
        this.scanSn = ''
        this.errorVisible = true
        return
      }
      //console.log(this.form,'this.form')
      this.oldScanSn = res
      var snReplaceList = ""
      if (!this.form.isPlantSn) {
        if (this.form.snReplace != null && this.form.snReplace != '') {
          snReplaceList = this.form.snReplace.replace(/[|]/g, "")
          const escapedSymbols = snReplaceList.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // 对符号进行转义，避免被当做正则表达式中的特殊字符
          const regex = new RegExp("[" + escapedSymbols + "]", "g"); // 构造正则表达式
          this.scanSn = this.scanSn.replace(regex, ""); // 替换字符串中的符号
        }
        if (this.form.endShield != null && this.form.endShield != '') {
          let regexStr = "(" + this.form.endShield + ")$";
          const regex = new RegExp(regexStr);
          this.scanSn = this.scanSn.replace(regex, '');
        }
      }


      if (this.form.snRules == 8) {
        if (this.scanSn.length != this.form.snRules) {
          this.errorText = 'sn条码需要等于所选择规则的' + this.form.snRules + '位数'
          this.scanSn = ''
          this.errorVisible = true
          return
        }
      }
      const isNotNull = this.tableNewData.find(item => item.scanSn === this.scanSn);
      if (isNotNull != undefined) {
        this.errorText = 'SN:' + this.scanSn + '已存在'
        this.scanSn = ''
        this.errorVisible = true
        return
      }

      if (this.form.snRules == -1) {//不校验sn是否存在
        GetPrimaryDataDtoBySn(this.scanSn, this.oldScanSn, this.form.boxName, this.form.pallet, this.form.projectName).then(data => {
          console.log(data, 'data')
          if (data.length === 0) {///找不到对应的批次号
            var obj = {
              piNum: this.form.piNum,
              piDpt: this.deptName,
              sysOrgSn: '',
              sysOrgPn: '',
              sysSn: '',
              sysPn: '',
              scanSn: res,
              scanPn: '',
              sysBin: this.form.bin,
              sysLocation: this.form.location,
              source: '',
              accountBook: '',
              piProject: '',
              scanPallet: this.form.pallet,
              filingNo: '',
              snState: '',
              createDept: this.deptName,
              description: '',
              creator: '',
              createTime: '',
              editor: '',
              editTime: '',
              name: '',
              id: null,
            };
            console.log(obj, 'obj')
            
            this.tableData.unshift(obj)
            this.tableNewData.unshift(this.deepClone(obj))
            if (this.isAutomatic && this.form.boxName == "") {
              this.initGetBoxName()
            }
            //this.tableOldData.unshift(this.this.deepClone(obj))
            this.dataNowRow = obj
            //this.form.palletQty++
            this.form.boxQTY = this.tableData.length
            if (this.form.closePN == true) {
              this.isScanPn = true
              this.scanSn = ''
              this.scanPn = ''
              this.errorText = ''
              this.$nextTick(() => {
                this.focusNext('scanSn')
              });
            } else {
              this.isScanPn = false
              this.$nextTick(() => {
                this.focusNext('scanPn')
              });
            }
          } else {
            if (this.form.piNum == "") {
              if (data.length > 1) {//弹框选择批次值调用生成box和tag并赋值this.form.piNum
                // console.log('弹框选择批次值调用生成box和tag并赋值this.form.piNum2222')
                if (this.isAutomatic && this.form.boxName == "") {
                  this.initGetBoxName()
                }
                // this.initGetPalletName()
                this.tableCheckData = data;
                this.checkVisible = true;
                return
              } else {//往table添加数据  调用生成box和tag并赋值this.form.piNum
                //console.log('调用生成box和tag并赋值this.form.piNum')
                if (this.isAutomatic && this.form.boxName == "") {
                  this.initGetBoxName()
                }
                //this.initGetPalletName()
                this.form.piNum = data[0].piNum;
                if (this.form.piNum != "" && this.form.piNum != null) {
                  GetAtchNoByName(this.form.piNum).then(res => {
                    if (res.state == "已关闭") {
                      this.errorText = '批次号' + this.form.piNum + '已关闭请更换批次号在盘点'
                      this.scanPn = ''
                      this.scanSn = ''
                      //this.form.piNum = ''
                      //this.tableData = []
                      this.isScanPn = true
                      this.errorVisible = true
                    } else {
                      if (data[0].sysBin != this.form.bin) {

                        this.errorText = '该Sn' + this.scanSn + '的库位:' + data[0].sysBin + "和选择的库位不一致请更换正确的库位"
                        this.scanPn = ''
                        this.scanSn = ''
                        //this.form.piNum = ''
                        //this.tableData = []
                        this.isScanPn = true
                        this.errorVisible = true
                      } else {
                        this.dataNowRow = data[0]
                        this.tableData.unshift(data[0])
                        this.tableNewData.unshift(this.deepClone(data[0]))
                        //this.form.palletQty++;
                        this.form.boxQTY++;
                        if (this.form.closePN == true) {
                          this.isScanPn = true
                          this.scanSn = ''
                          this.scanPn = ''
                          this.errorText = ''
                          this.$nextTick(() => {
                            this.focusNext('scanSn')
                          });

                        } else {
                          this.isScanPn = false
                          this.$nextTick(() => {
                            this.focusNext('scanPn')
                          });

                        }
                      }

                    }
                  })
                }

              }
            } else {
              if (this.form.piNum != "" && this.form.piNum != null) {
                GetAtchNoByName(this.form.piNum).then(res => {
                  if (res.state == "已关闭") {
                    this.errorText = '批次号' + this.form.piNum + '已关闭请更换批次号在盘点'
                    this.scanPn = ''
                    this.scanSn = ''
                    //this.form.piNum = ''
                    //this.tableData = []
                    this.isScanPn = true
                    this.errorVisible = true

                  } else {
                    const obj = data.find(item => item.piNum === this.form.piNum);
                    if (obj == undefined) {
                      this.errorText = '该条码的' + this.scanSn + "批次号和之前扫入的批次号不一致请扫入该" + this.form.piNum + '批次号的sn'
                      this.isScanPn = true
                      this.scanSn = ''
                      this.errorVisible = true
                    } else {//往table添加数据
                      if (obj.sysBin != this.form.bin) {

                        this.errorText = '该Sn' + this.scanSn + '的库位:' + obj.sysBin + "和选择的库位不一致请更换正确的库位"
                        this.scanPn = ''
                        this.scanSn = ''
                        this.errorVisible = true
                        //this.form.piNum = ''
                        //this.tableData = []
                        this.isScanPn = true
                      } else {
                        const isNotNull = this.tableNewData.find(item => item.id === obj.id);
                        if (isNotNull != undefined) {
                          this.errorText = 'SN:' + this.scanSn + '已存在'
                          this.scanSn = ''
                          this.errorVisible = true
                          return
                        } else {
                          //console.log('弹框选择批次值调用生成box和tag并赋值this.form.piNum33333')
                          this.tableData.unshift(obj)
                          this.tableNewData.unshift(this.this.deepClone(obj))
                          this.dataNowRow = obj
                          //this.form.palletQty++;
                          this.form.boxQTY++;
                          if (this.form.closePN == true) {
                            this.isScanPn = true
                            this.scanSn = ''
                            this.scanPn = ''
                            this.errorText = ''
                            this.$nextTick(() => {
                              this.focusNext('scanSn')
                            });
                          } else {
                            this.isScanPn = false
                            this.$nextTick(() => {
                              this.focusNext('scanPn')
                            });
                          }
                        }

                      }

                    }
                  }
                })
              }

            }
          }
        })
      } else {
        GetPrimaryDataDtoBySn(this.scanSn, this.oldScanSn, this.form.boxName, this.form.pallet, this.form.projectName).then(data => {
          console.log(data, 'data')
          if (data.length == 0) {///找不到对应的批次号
            CreateErrorSnHistory({
              piDpt: this.deptName,
              scanSn: this.scanSn,
              piProject: this.form.projectName,
              sysBin: this.form.bin,
              sysLocation: this.form.location,
              scanPallet: this.form.pallet,
              snState: 'Sn' + res + "不存在",
              boxName: this.form.boxName,
              automaticTag: this.form.automaticTag,
            }).then(res => {
              this.tableErrorData.push(res)
              this.errorText = res.snState
              this.scanSn = ''
              this.errorVisible = true
              this.isScanPn = true
              return this.$nextTick(() => {
                this.focusNext('scanSn')
              });

              // return this.$message({
              //   message: '批次号'+this.scanSn+"不存在",
              //   type: 'error'
              // });
            })

          } else {
            if (this.form.piNum == "") {
              if (data.length > 1) {//弹框选择批次值调用生成box和tag并赋值this.form.piNum
                // console.log('弹框选择批次值调用生成box和tag并赋值this.form.piNum2222')
                if (this.isAutomatic && this.form.boxName == "") {
                  this.initGetBoxName()
                }
                // this.initGetPalletName()
                this.tableCheckData = data;
                this.checkVisible = true;

              } else {//往table添加数据  调用生成box和tag并赋值this.form.piNum
                //console.log('调用生成box和tag并赋值this.form.piNum')
                if (this.isAutomatic && this.form.boxName == "") {
                  this.initGetBoxName()
                }
                //this.initGetPalletName()
                this.form.piNum = data[0].piNum;
                if (this.form.piNum != "" && this.form.piNum != null) {
                  GetAtchNoByName(this.form.piNum).then(res => {
                    if (res.state == "已关闭") {
                      this.errorText = '批次号' + this.form.piNum + '已关闭请更换批次号在盘点'
                      this.scanPn = ''
                      this.scanSn = ''
                      this.errorVisible = true
                      //this.form.piNum = ''
                      //this.tableData = []
                      this.isScanPn = true
                    } else {
                      if (data[0].sysBin != this.form.bin) {

                        this.errorText = '该Sn' + this.scanSn + '的库位:' + data[0].sysBin + "和选择的库位不一致请更换正确的库位"
                        this.scanPn = ''
                        this.scanSn = ''
                        this.errorVisible = true
                        //this.form.piNum = ''
                        //this.tableData = []
                        this.isScanPn = true
                      } else {

                        this.dataNowRow = data[0]
                        this.tableData.unshift(data[0])
                        this.tableNewData.unshift(this.deepClone(data[0]))
                        //this.form.palletQty++;
                        this.form.boxQTY++;
                        if (this.form.closePN == true) {
                          this.isScanPn = true
                          this.scanSn = ''
                          this.scanPn = ''
                          this.errorText = ''
                          this.$nextTick(() => {
                            this.focusNext('scanSn')
                          });

                        } else {
                          this.isScanPn = false
                          this.$nextTick(() => {
                            this.focusNext('scanPn')
                          });

                        }
                      }

                    }
                  })
                }

              }
            } else {
              console.log(this.form.piNum)
              if (this.form.piNum != "" && this.form.piNum != null) {
                GetAtchNoByName(this.form.piNum).then(res => {
                  if (res.state == "已关闭") {
                    this.errorText = '批次号' + this.form.piNum + '已关闭请更换批次号在盘点'
                    this.scanPn = ''
                    this.scanSn = ''
                    this.errorVisible = true
                    //this.form.piNum = ''
                    //this.tableData = []
                    this.isScanPn = true

                  } else {

                    const obj = data.find(item => item.piNum === this.form.piNum);

                    console.log(this.form.piNum, 'this.form.piNum')
                    console.log(obj, 'obj')
                    if (obj == undefined) {
                      this.errorText = '该条码的' + this.scanSn + "批次号和之前扫入的批次号不一致请扫入该" + this.form.piNum + '批次号的sn'
                      this.isScanPn = true
                      this.scanSn = ''
                      this.errorVisible = true
                    } else {//往table添加数据
                      if (obj.sysBin != this.form.bin) {

                        this.errorText = '该Sn' + this.scanSn + '的库位:' + obj.sysBin + "和选择的库位不一致请更换正确的库位"
                        this.scanPn = ''
                        this.scanSn = ''
                        this.errorVisible = true
                        //this.form.piNum = ''
                        //this.tableData = []
                        this.isScanPn = true
                      } else {
                        const isNotNull = this.tableNewData.find(item => item.id === obj.id);
                        if (isNotNull != undefined) {
                          this.errorText = 'SN:' + this.scanSn + '已存在'
                          this.scanSn = ''
                          this.errorVisible = true
                          return
                        } else {
                          //console.log('弹框选择批次值调用生成box和tag并赋值this.form.piNum33333')
                          this.tableData.unshift(obj)
                          this.tableNewData.unshift(this.deepClone(obj))
                          //this.tableOldData.unshift(this.this.deepClone(obj))
                          this.dataNowRow = obj
                          //this.form.palletQty++;
                          this.form.boxQTY++;
                          if (this.form.closePN == true) {
                            this.isScanPn = true
                            this.scanSn = ''
                            this.scanPn = ''
                            this.errorText = ''
                            this.$nextTick(() => {
                              this.focusNext('scanSn')
                            });
                          } else {
                            this.isScanPn = false
                            this.$nextTick(() => {
                              this.focusNext('scanPn')
                            });
                          }
                        }

                      }

                    }
                  }
                })
              }

            }
          }
        })
      }
      // console.log(this.scanSn, ' this.scanSn')

    },

    focusNext(nextRef) {
      this.$refs[nextRef].focus()
    },
    changePn(res) {
      res= res.replace(/[, ]/g, '')
      res = res.toUpperCase();
      this.scanPn = this.scanPn.toUpperCase();
      this.scanPn = res
      if (res == "") {
        return;
      }
      if (this.errorVisible) {
        this.scanPn = ''
        this.errorVisible = false
        return;
      }
      if (this.form.pnRules == 10) {
        if (res.length != this.form.pnRules) {
          this.errorText = 'PN条码' + res + '需要等于所选择的' + this.form.pnRules + '位数'
          this.scanPn = ''
          this.errorVisible = true
          return
        }
        if (res != this.dataNowRow.sysPn && res != this.dataNowRow.sysOrgPn) {
          this.errorText = '扫入的Pn:' + res + '和SN对应的Pn:' + this.dataNowRow.sysPn + '或者OrgPn' + this.dataNowRow.sysOrgPn + '不一致'
          this.scanPn = ''
          this.errorVisible = true
          return
        }
      }
      else if (this.form.pnRules > 0) {
        var jieQuPN = res.substring(0, this.form.pnRules)
        console.log(this.dataNowRow, 'this.dataNowRow')
        var orgPn = this.dataNowRow.sysOrgPn
        var sn = this.dataNowRow.sysPn
        var isPnTrue=false;
        if (orgPn.substring(0, this.form.pnRules) !== jieQuPN) {//匹配Pn匹配数据的下一行的sysPn位置，匹配成功后将sysPn从数组中删除匹配的数据并将匹配的数据写入数组中，如
          isPnTrue=true;
          // this.errorText = '扫入的Pn的前' + this.form.pnRules + '位:' + jieQuPN + '和SN对应的Pn:' + orgPn + '不一致'
          // this.scanPn = ''
          // this.errorVisible = true
          // return
        }else{
          isPnTrue=false;
        }
        if(isPnTrue){
          if (sn.substring(0, this.form.pnRules) !== jieQuPN) {//匹配Pn匹配数据的下一行的sysPn位置，匹配成功后将sysPn从数组中删除匹配的数据并将匹配的数据写入数组中，如
            isPnTrue=true;
            // this.errorText = '扫入的Pn的前' + this.form.pnRules + '位:' + jieQuPN + '和SN对应的Pn:' + sn + '不一致'
            // this.scanPn = ''
            // this.errorVisible = true
            // return
          }else{
            isPnTrue=false;
          }
        }
        console.log(isPnTrue)
        if(isPnTrue){
          var errPn=orgPn.substring(0, this.form.pnRules) !== jieQuPN?orgPn:sn
           this.errorText = '扫入的Pn的前' + this.form.pnRules + '位:' + jieQuPN + '和SN对应的Pn:' + errPn + '不一致'
          this.scanPn = ''
          this.errorVisible = true
          return
        }
        
      }


      const obj = this.tableData.find(item => this.dataNowRow.id==null? item.scanSn === this.dataNowRow.scanSn:item.id==this.dataNowRow.id);
      const obj2 = this.tableNewData.find(item =>  this.dataNowRow.id==null? item.scanSn === this.dataNowRow.scanSn:item.id==this.dataNowRow.id);
      obj2.scanPn = res;
      obj.scanPn = res
      this.isScanPn = true
      this.scanSn = ''
      this.scanPn = ''
      this.errorText = ''
      this.$nextTick(() => {
        this.focusNext('scanSn')
      });

      //console.log(this.tableData, 'this.tableData')
      //this.dataNowRow.
    },

    checkSubmit() {
      if (this.checkTableByOne.length != 1) {
        return this.$message({
          message: '只能选择一个批次号',
          type: 'error'
        });
      }
      this.checkVisible = false;
      this.form.piNum = this.checkTableByOne[0].piNum;
      if (this.form.piNum != "" && this.form.piNum != null) {
        GetAtchNoByName(this.form.piNum).then(res => {
          if (res.state == "已关闭") {
            this.errorText = '批次号' + this.form.piNum + '已关闭请更换批次号在盘点'
            this.scanPn = ''
            this.scanSn = ''
            this.form.piNum = ''
            this.dataNowRow = []
            this.tableData = []
            this.tableNewData = []
            this.isScanPn = true
          } else {
            if (this.checkTableByOne[0].sysBin != this.form.bin) {
              this.errorText = '该Sn' + this.scanSn + '的库位:' + this.checkTableByOne[0].sysBin + "和选择的库位不一致请更换正确的库位"
              this.scanPn = ''
              this.scanSn = ''
              this.form.piNum = ''
              this.dataNowRow = []
              this.tableData = []
              this.tableNewData = []
              this.isScanPn = true
            } else {
              this.dataNowRow = this.checkTableByOne[0]
              this.tableData.unshift(this.checkTableByOne[0])
              this.tableNewData.unshift(this.deepClone(this.checkTableByOne[0]))
              //this.form.palletQty += this.tableData.length
              this.form.boxQTY = this.tableData.length
              //this.tableOldData.unshift(this.this.deepClone(this.checkTableByOne[0]))
              if (this.form.closePN == true) {
                this.isScanPn = true
                this.scanSn = ''
                this.scanPn = ''
                this.errorText = ''
                this.$nextTick(() => {
                  this.focusNext('scanSn')
                });

              } else {
                this.isScanPn = false
                this.$nextTick(() => {
                  this.focusNext('scanPn')
                });

              }
            }

          }
        })
      }


    },
    handleSelectionChange(val) {
      this.checkTableByOne = val
      console.log(val)
    },
    // ScanSn() {
    //   // GetPrimaryDataDtoBySn(scanSn).then(data => {
    //   //   console.log(data)
    //   // })
    // },
    deepClone(obj) {
      var _obj = JSON.stringify(obj) //  对象转成字符串
      var objClone = JSON.parse(_obj) //  字符串转成对象
      return objClone
    },
    generateHtml() {
      let html = '<table style="width: 100%;text-align: center;border-collapse:collapse;"';
      html += `<thead><tr style="border-bottom:1.5px solid black;border-top:1.5px solid black;"><th>ScanPN</th><th>ScanPnQTY</th><th>${this.printData.tagName}</th><th>${this.printData.location}</th></tr></thead>`;
      html += '<tbody>';
      for (let item of this.printData.listPallet) {
        html += `<tr><td>${item.scanPn}</td><td>${item.scanPnQty}</td><td></td><td></td></tr>`;
      }

      html += `<tr style="border-bottom:1.5px solid black;border-top:1.5px solid black;"><th>Pallet Qty</th><th>${this.form.palletQty}</th> <th>Pallet Carton</th><th>${this.printData.boxCount}</th></tr></tbody></table><div style="height: 100px;"></div>`;
      return html;
    },
    printHtml() {
      const tableData = this.printData; // 获取表格数据
      const jsonData = JSON.stringify(tableData); // 将表格数据转换为 json 格式

      console.log(jsonData, 'tableData')
      const html = this.generateHtml();
      //console.log(html, 'html')
      const printWindow = window.open('', '', 'height=500,width=500');
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    },
    printInventory() {
      // if (this.form.bin == '' || this.form.bin == null) {
      //   this.errorText = '请选择库位'
      //   return
      // }
      // if (this.form.location == '' || this.form.location == null) {
      //   this.errorText = '请选择区域'
      //   return
      // }
      if (this.form.pallet == '' || this.form.pallet == null) {
        this.errorText = '请输入Pallet拖号'
        return
      }
      // this.initGetPallQty()
      GetPalletQty(this.form.pallet).then(data => {
        this.form.palletQty = data
        PrintInventorySheet({
          state: '',
          bin: this.form.bin,
          name: this.form.pallet,
          location: this.form.location,
          palletCount: this.form.palletQty,
          tagName: '',
          palletPrefix: this.form.tagPrefix,
        }).then(data => {
          console.log(data);
          this.printData = data;
          this.print('/table.docx')
        })
      })

    },
    printInventoryByBox() {
      // if (this.form.bin == '' || this.form.bin == null) {
      //   this.errorText = '请选择库位'
      //   return
      // }
      // if (this.form.location == '' || this.form.location == null) {
      //   this.errorText = '请选择区域'
      //   return
      // }
      if (this.form.pallet == '' || this.form.pallet == null) {
        this.errorText = '请输入Pallet拖号'
        return
      }
      // this.initGetPallQty()
      GetPalletQty(this.form.pallet).then(data => {
        this.form.palletQty = data
        PrintInventorySheetByBox({
          state: '',
          bin: this.form.bin,
          name: this.form.pallet,
          location: this.form.location,
          palletCount: this.form.palletQty,
          tagName: '',
          palletPrefix: this.form.tagPrefix,
        }).then(data => {
          console.log(data);
          this.printData = data;
          this.print('/tableByBox.docx')
        })
      })

    },
    print(url) {
      var palletCount = this.form.palletQty;
      var tagName = this.printData.name;
      var location = this.printData.bin;
      var boxCount = this.printData.listPallet.length;
      const tableData = this.printData.listPallet; // 获取表格数据
      const jsonData = JSON.stringify(tableData); // 将表格数据转换为 json 格式
      //测试数
      //var ImageModule = require('docxtemplater-image-module-free');   //没有图片可以去掉这一段
      //*注*模板文件存放位置：vue-cli2在static文件夹下，vue-cli3在public文件夹下，文件后缀名为'.docx'
      JSZipUtils.getBinaryContent(url, function (error, content) {
        if (error) {
          throw error
        };
        // 图片处理开始
        let opts = {}
        opts = {
          //图像是否居中
          centered: false
        };
        // opts.getImage = (chartId) => {
        //   return that.base64DataURLToArrayBuffer(chartId);
        // }
        // opts.getSize = function (img, tagValue, tagName) {
        //   //自定义指定图像大小
        //   return [200, 150];
        // }
        //图片处理结束    没有图片可去掉这一段
        var zip = new PizZip(content);
        var doc = new docxtemplater()
        //doc.attachModule(new ImageModule(opts));  //没有图片可以去掉这一段
        doc.loadZip(zip);
        //获取数据
        doc.setData({
          tableData: JSON.parse(jsonData),
          palletCount: palletCount,
          tagName: tagName,
          location: location,
          boxCount: boxCount,
        });
        console.log({
          tableData: JSON.parse(jsonData),
          palletCount: palletCount,
          tagName: tagName,
          location: location,
          boxCount: boxCount,
        }, 'tableData')
        try {
          doc.render()
        } catch (error) {
          var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
          }
          console.log(JSON.stringify({
            error: e
          }));
          throw error;
        }
        // 生成 Word 文件
        // printFile(file);
        // var out = doc.getZip().generate({
        //   type: "blob",
        //   mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // })
        // const printWindow = window.open('', '_blank');
        // printWindow.document.write(`<iframe src="${URL.createObjectURL(out)}"></iframe>`);
        // printWindow.document.close();
        // printWindow.focus();
        // printWindow.print();
        // printWindow.close();
        // const printWindow = window.open('', '_blank');
        // const pdfUrl = 'your_word_document_url_to_pdf';
        // const iframe = printWindow.document.createElement('iframe');
        // iframe.onload = function () {
        //   iframe.contentWindow.print();
        //   printWindow.close();
        // };
        // iframe.src = pdfUrl;
        // printWindow.document.body.appendChild(iframe);
        // const out = doc.getZip().generate({
        //   type: 'blob'
        // });
        // const blob = new Blob([out], {
        //   type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        // });

        // const objectUrl = URL.createObjectURL(blob);
        // const iframe = document.createElement('iframe');
        // iframe.style.display = 'none';
        // iframe.src = objectUrl;
        // document.body.appendChild(iframe);
        // console.log(iframe, 'iframe')
        // iframe.contentWindow.print();
        // URL.revokeObjectURL(objectUrl);
        // document.body.removeChild(iframe);

        const out = doc.getZip().generate({
          type: 'blob'
        });
        const blob = new Blob([out], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        const objectUrl = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';

        // 添加 iframe 到文档中
        document.body.appendChild(iframe);
        console.log(iframe, 'iframe')

        // 等待用户操作后再打开窗口
        setTimeout(() => {
          iframe.src = objectUrl;
          iframe.onload = () => {
            // 等待 iframe 加载完成后打印
            iframe.contentWindow.print();
            URL.revokeObjectURL(objectUrl);
            // 打印完成后移除 iframe
            document.body.removeChild(iframe);
          };
        }, 100);
        //saveAs(out, "文件名.docx")
      })
    },
    closePallet() {
      this.form.pallet = ''
      this.form.boxName = ''
      this.isScanPn = true
      this.scanSn = ''
      this.scanPn = ''
      this.tableData = []
      this.tableNewData = []
      this.form.boxQTY = 0;
      this.form.palletQty = 0;
      this.dataNowRow = []
    },
    checkOpenBox(val) {
      this.isAutomatic = this.form.openBox ? false : true;
    }
  }
}