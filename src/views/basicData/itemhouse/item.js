
import { remove, getList, save,GetItem } from '@/api/basicData/item'
import { regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import { getall as getCluesAll } from '@/api/basicData/item'
import permission from '@/directive/permission/index.js'

export default {
  directives: { permission },
  data() {
    return {

      props: { multiple: false },
      options: regionDataPlus,
      selectedOptions: [],
      formVisible: false,
      formTitle: '添加库位',
      deptList: [],
      roleList: [],
      isAdd: true,
      checkedPermissionKeys: [],
      permissons: [],
      // defaultProps: {
      //   id: 'id',
      //   label: 'name',
      //   children: 'children'
      // },
      
      form: {
        id: 0,
        name: '',
        boxPrefix:'',
        taG_NOPrefix: '',
        snReplace: '',
        isPlantSn: false,
        endShield: '',
        createDept:undefined
     
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        // warehouseCode: [
        //   { required: true, message: '请输入库位码', trigger: 'blur' },
        //   { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        // ],
        // warehouseRemarks: [
        //   { required: true, message: '请输入备注', trigger: 'blur' },
        //   { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        // ],
      },

      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        createDept:undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      allInvoices: {},
      allClues: {},
      selectCluesItem: null,
    }
  },
//   filters: {
//     statusFilter(status) {
//       const statusMap = {
//         published: 'success',
//         draft: 'gray',
//         deleted: 'danger'
//       }
//       return statusMap[status]
//     }
//   },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.initItem()
    },
    fetchData() {
      this.listQuery.createDept='仓库部门'
      this.listLoading = true
      getList(this.listQuery).then(data => {
        this.list = data.data
        console.log(data.data,'data');
        this.listLoading = false
        this.total = data.totalCount
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.name = ''
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
      this.selRow = currentRow
    },
    initClues() {
      getCluesAll().then(data => {
        this.allClues = data
      })
    },
    //重置
    resetForm() {
      this.form = {
        id: 0,
        name: '',
        boxPrefix: '',
        taG_NOPrefix: '',
        snReplace: '',
        isPlantSn: false,
        endShield: ''
      }
    },

    // initInvoices() {
    //   getAll().then(data => {
    //     this.allInvoices = data
    //   })
    // },
    add() {
      this.resetForm()
      // this.initInvoices()
      //this.initClues()
      console.log(this.form,"111")
      this.formTitle = '添加项目号'
      this.formVisible = true;
      this.isAdd = true;
    },
    initItem() {
      GetItem().then(data => {
        console.log(data, "datapppppppppppppp");
        if (data) {
          data.forEach(val => {
            if (val.name === "Warehouse") {
              this.listQuery.createDept = val.value;
            }
          })
          if (this.listQuery.createDept !== "") {
            this.fetchData();
          }
        }
      })
    },

    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            id: this.form.id,
            name: this.form.name,
            boxPrefix: this.form.boxPrefix,
            taG_NOPrefix: this.form.taG_NOPrefix,
            snReplace: this.form.snReplace,
            isPlantSn: this.form.isPlantSn,
            endShield: this.form.endShield,
            createDept: this.listQuery.createDept
            //invoiceIds: this.form.invoiceIds
          }).then(response => {
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
    edit(row) {
      
      this.handleCurrentChange(row)
      if (this.checkSel()) {
        console.log(this.row)
        this.selectCluesItem=null
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '修改项目号'
        this.formVisible = true
        if (row.name != null) {
          console.log(this.checkSel,'cek');
          var str = row.name.split("-");
          this.selectedOptions = str;
        }
        // var list = str.split(",");
        // list.forEach(item => {
        //   var addresslist = [];
        //   addresslist.push(item.split("-"))

        //   this.selectedOptions.push(item.split("-"))
        // })
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
              message: '提交成功',
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
    // updateElCascaderStyle(value) {
    //   // 效果：项目名称的input框随着内容的长度而自适应，设置 el_cascader 标签的width
    //   var elCascader = document.querySelector('#el-cascader')
    //   var length = value.join('.').length + 1
    //   var num =  length * 11  + 'px'
    //   elCascader.style.width = num
    // },
    selectClues(res) {
      this.allClues.forEach(element => {
        if (element.id == res) {
          this.form.name = element.name
          this.form.address = element.addressDetails
          this.form.addressDetails = element.address
          this.form.linkman = element.contacts
          this.form.linkmanTelephone = element.contactsPhone
          if (element.address != null) {
            var str = element.address.split("-");
            this.selectedOptions = str
          }
        }
      });
    },
    handleChange(value) {
      //console.log(value)
      //this.updateElCascaderStyle(value)
      var addresslist = "";
      // value.forEach(element => {

      //   addresslist += element.join('-') + ","
      //   //console.log(addresslist)
      // });
      addresslist += value.join('-') + ","

      this.form.addressDetails = addresslist.substring(0, addresslist.length - 1);
    },
    flexWidth(prop, tableData, title, num = 0) {
      //console.log(tableData,"tableData");
      if (tableData===null||tableData.length === 0) {//表格没数据不做处理
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
  }
}
