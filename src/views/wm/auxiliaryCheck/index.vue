<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-input v-model="listQuery.name" placeholder="请输入批次号" />
        </el-col>
        <!-- <el-col :span="3">
          <el-input v-model="listQuery.sysBin" placeholder="请输入bin" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.sysSn" placeholder="请输入sn" />
        </el-col> -->
        <el-col :span="3">
          <el-input v-model="listQuery.sysPn" placeholder="请输入pn" />
        </el-col>
        <el-col :span="3">
          <el-date-picker v-model="listQuery.beginTime" value-format="yyyy-MM-dd HH:mm:ss"   
          type="datetime" 
           :default-value="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 8, 0, 0)"
           placeholder="选择开始时间">
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-date-picker v-model="listQuery.endTime" value-format="yyyy-MM-dd HH:mm:ss"   :default-value="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 20, 0, 0)"  type="datetime" placeholder="选择结束日期">
          </el-date-picker>
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
         <el-col :span="3">
          <!-- <el-button v-permission="['/DataImport/Export']"  type="success" icon="el-icon-document" @click.native="setExport2Excel">{{ $t('button.export') }}</el-button>
        </el-col>
        <el-col :span="3">
          <el-button v-permission="['/DataImport/AtchNoClose']"  type="primary" icon="el-icon-close" @click.native="edit">{{ $t('button.atchNoClose') }}</el-button> -->
          <el-button v-permission="['/Auxiliary/CheckTemplate']" type="info" icon="el-icon-document"
            @click.native="exportTemplateExcel">{{ $t('button.auxiliaryCheckTemplate') }}</el-button>
        </el-col> 
        <el-col :span="4">
          <el-upload v-permission="['/AuxiliaryCheck/Excel']"  width="50px" class="C-demo" ref="xlsUpload" action="" :show-file-list="false" :headers="headers"
            :http-request="handleFileUpload">
            <el-button icon="el-icon-upload2" type="primary">{{ $t('button.dataImportExport') }}</el-button>
          </el-upload>
        </el-col>
        
      </el-row>
    </div>

    <el-table ref="table" :data="list" :row-class-name="getRowClassName" :header-cell-style="{ background: '#f5f5f7' }"
      element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column v-for="(column, index) in tableLabel" :key="index" :prop="column.prop" :label="column.label"
        :width="flexWidth(column.prop, list, 'accountBook/账册编号')">
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(row)">{{ $t('button.edit') }}</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="remove(row)">{{ $t('button.delete')
          }}</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100, 500]"
      :page-size="listQuery.pageSize" :total="total" @size-change="changeSize" @current-change="fetchPage"
      @prev-click="fetchPrev" @next-click="fetchNext" />

    <el-dialog :title="listStringTitle" :visible.sync="listStringVisible" center width="60%">
      <!-- <el-row>
        <el-col :span="24">{{ listStringTitle }}
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="23">
          <p>{{ listStrings }}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button @click="close">{{ $t('button.cancel') }}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :title="confirmTitle" :visible.sync="confirmVisible" center width="70%">
      <!-- <el-row><el-col :span="24">{{ listStringTitle }}
        </el-col>
      </el-row> -->
      <el-tabs v-model="activeName" type="card" >
      <el-tab-pane label="已经存在的数据" ac name="已经存在的数据">
        <el-col :span="24">
          <el-table :data="primaryOldData">
            <el-table-column v-for="(column, index) in tableLabel" :key="index" :prop="column.prop" :label="column.label"
              :width="flexWidth(column.prop, primaryOldData, 'accountBook/账册编号')">
            </el-table-column> </el-table>
            <el-pagination
              @size-change="handleOldSizeChange"
              @current-change="handleOldCurrentChange"
              :current-page="currentOldPage"
              :page-sizes="[10, 20, 30, 50,100]"
              :page-size="pageOldSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="oldTotal"
              @prev-click="fetchOldPrev" @next-click="fetchOldNext">
            </el-pagination>
        </el-col>
       
      </el-tab-pane>
      <el-tab-pane label="需要确认修改的数据" name="需要确认修改的数据">
        <el-col :span="24">
          <el-table :data="primaryNewData">
            <el-table-column v-for="(column, index) in tableLabel" :key="index" :prop="column.prop" :label="column.label"
              :width="flexWidth(column.prop, primaryNewData, 'accountBook/账册编号')">
            </el-table-column> </el-table>
            <el-pagination
              @size-change="handleNewSizeChange"
              @current-change="handleNewCurrentChange"
              :current-page="currentNewPage"
              :page-sizes="[10, 20, 30, 50,100]"
              :page-size="pageNewSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="newTotal"
              @prev-click="fetchNewPrev" @next-click="fetchNewNext">
            </el-pagination>
        </el-col>
        
      </el-tab-pane>

    </el-tabs>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="confirmImport">{{ $t('button.submit') }}</el-button>
          <el-button @click="close">{{ $t('button.cancel') }}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script src="./auxiliaryCheck.js"></script>
<style  rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>