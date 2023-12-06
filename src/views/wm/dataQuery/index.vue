<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="refForm" v-show="InventoryShow" label-width="78px" label-position="right">
        <el-row :gutter="20">

          <el-col :span="4">
            <el-form-item label="选择项目">
              <el-select v-model="listQuery.projectName" clearable >
                <el-option v-for="item in listProject" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="选择区域">
              <el-select v-model="listQuery.location" clearable >
                <el-option v-for="item in listLocation" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="选择库位">
              <el-select v-model="listQuery.sysBin" clearable >
                <el-option v-for="item in listBin" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="扫入SN">
              <el-input v-model="listQuery.scanSn" placeholder="请输入SN" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="扫入PN">
              <el-input v-model="listQuery.scanPn" placeholder="请输入PN" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="员工号">
              <el-input v-model="listQuery.creator" placeholder="请输入员工号" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="拖号">
              <el-input v-model="listQuery.pallet" placeholder="请输入拖号" />
            </el-form-item>
          </el-col> -->
        </el-row>
       
        <br>
        <el-row :gutter="20">
          <!-- <el-col :span="4">
            <el-form-item label="部门">
              <el-input v-model="listQuery.deptName" placeholder="请输入部门" />
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item label="拖号">
              <el-input v-model="listQuery.pallet" placeholder="请输入拖号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="箱号">
              <el-input v-model="listQuery.boxName" placeholder="请输入箱号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="开始时间">
              <el-date-picker v-model="listQuery.beginTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                :default-value="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 8, 0, 0)"
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="结束时间">
              <el-date-picker v-model="listQuery.endTime" value-format="yyyy-MM-dd HH:mm:ss"
                :default-value="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 20, 0, 0)"
                type="datetime" placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="float:right;text-align: right;">
            <el-button type="success" icon="el-icon-search" @click.native="search">{{ $t('button.search')
            }}</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset')
            }}</el-button>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col :span="4">
            <el-button v-permission="['/DataQuery/Export']" type="info" icon="el-icon-document"
              @click.native="setExport">{{ $t('button.export') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-form v-show="differenceShow" label-width="78px" label-position="right">       
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="选择库位">
              <el-select v-model="listQuery.sysBin" clearable >
                <el-option v-for="item in listBin" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="success" icon="el-icon-search" @click.native="search">{{ $t('button.search')
            }}</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset')
            }}</el-button>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col :span="4">
            <el-button v-permission="['/DataQuery/Export']" type="info" icon="el-icon-document"
              @click.native="setExport">{{ $t('button.export') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="盘点数据" name="inventory">
        <el-col :span="24">
          <el-table ref="table" :data="list" :row-class-name="getRowClassName"
            :header-cell-style="{ background: '#f5f5f7' }" element-loading-text="Loading" border fit highlight-current-row
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column v-for="(column, index) in tableLabel" :key="index" :prop="column.prop" :label="column.label"
              :width="flexWidth(column.prop, list, '账册编号')">
            </el-table-column>
          </el-table>
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,50,200,500,1000]"
            :page-size="listQuery.pageSize" :total="total" @size-change="changeSize" @current-change="fetchPage"
            @prev-click="fetchPrev" @next-click="fetchNext" />
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="辅料数据" name="auxiliaryInventory">
        <el-col :span="24">
          <el-table ref="table" :data="auxiliaryList" :row-class-name="getRowClassName"
            :header-cell-style="{ background: '#f5f5f7' }" element-loading-text="Loading" border fit highlight-current-row
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column v-for="(column, index) in tableLabelByAuxiliary" :key="index" :prop="column.prop" :label="column.label"
             >
            </el-table-column>
          </el-table>
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,50,200,500,1000]"
            :page-size="listQuery.pageSize" :total="total" @size-change="changeSize" @current-change="fetchPage"
            @prev-click="fetchPrev" @next-click="fetchNext" />
        </el-col>

      </el-tab-pane>
      <el-tab-pane label="差异数据" name="difference">
        <el-col :span="24">
          <el-table ref="table" :data="differenceData" :row-class-name="getRowClassName"
            :header-cell-style="{ background: '#f5f5f7' }" element-loading-text="Loading" border fit highlight-current-row
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column v-for="(column, index) in tableLabelByDiff" :key="index" :prop="column.prop" :label="column.label"
              :width="flexWidth(column.prop, differenceData, '账册编号')">
            </el-table-column>
          </el-table>
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,50,200,500,1000]"
            :page-size="listQuery.pageSize" :total="total" @size-change="changeSize" @current-change="fetchPage"
            @prev-click="fetchPrev" @next-click="fetchNext" />
        </el-col>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="列表数据 请选择导出字段" :visible.sync="excelTableVisible" center width="70%">
      <template>
        <!-- <h1 >列表数据请选择导出字段</h1> -->
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="excelTableList" @change="handleCheckedCitiesChange">
         
          <el-checkbox v-for="city in cardTable" :label="city.label" :key="city.prop">{{ city.label }}</el-checkbox>
          <!-- <el-checkbox  v-show="activeName=='auxiliaryInventory'" v-for="city in tableLabelByAuxiliary" :label="city.label" :key="city.prop">{{ city.label }}</el-checkbox> -->
        </el-checkbox-group>
        <!-- <el-dropdown-item v-for="(column, index)  in excelTableList" :key="index" @click="toggleColumnVisible(column.prop)">
            <el-checkbox v-model="column.isCheck"> {{ column.label }} </el-checkbox>
          </el-dropdown-item> -->
      </template>
      <div style="margin: 15px 0;"></div>
      <el-row>
        <el-col :span="24">
          <el-button v-permission="['/DataQuery/Export']" type="info" icon="el-icon-document"
            @click.native="setExport2Excel">{{ $t('button.export') }}</el-button>
          <el-button @click="excelTableVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>
<script src="./dataQuery.js"></script>
<style  rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>