<template>
  <div>
    <el-row :gutter="20" style=" margin-top: 10px;">
      <el-col :span="24">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="库位进度" name="Bin">
            <el-col :span="24">
              <el-table ref="table" height="240px" :data="list" :header-cell-style="{ background: '#f5f5f7' }" border fit
                highlight-current-row>
                <el-table-column prop="bin" label="库位">
                </el-table-column>
                <el-table-column prop="binNum" label="导入库存数量">
                </el-table-column>
                <el-table-column prop="inventoryNum" label="盘点数量">
                </el-table-column>
                <el-table-column prop="differenceNum" label="差异数量" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <el-link  type="primary" @click.native="openTable(scope.row)"
                      target="_blank">{{ scope.row.differenceNum }}</el-link>                  
                  </template>
                </el-table-column>
              </el-table>

            </el-col>
          </el-tab-pane>
          <!-- <el-tab-pane label="项目进度" name="Project">
            <el-col :span="24">
              <el-table ref="table" height="240px" :data="listProject" :header-cell-style="{ background: '#f5f5f7' }"
                border fit highlight-current-row>
                <el-table-column prop="bin" label="项目">
                </el-table-column>
                <el-table-column prop="binNum" label="导入库存数量">
                </el-table-column>
                <el-table-column prop="inventoryNum" label="盘点数量">
                </el-table-column>
                <el-table-column prop="differenceNum" label="差异数量">
                </el-table-column>
              </el-table>
            </el-col>

          </el-tab-pane> -->
        </el-tabs>
      </el-col>
    </el-row>
    <el-row id="row">
      <el-col :span="12">
        <div>
          <div :style="'width:' + (windowWidth / 2) + 'px;height:' + (windowHeight - 250) + 'px'" id="main1"></div>
        </div>
      </el-col>
      <el-col :span="12">

        <div>
          <div :style="'width:' + (windowWidth / 2) + 'px;height:' + (windowHeight - 250) + 'px'" id="main2"></div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-dialog :title="differenceTitle" :visible.sync="differenceVisible" center width="70%">
      <el-table :data="differenceData"  :header-cell-style="{ background: '#f5f5f7' }" border fit
                highlight-current-row>
              <el-table-column v-for="(column, index) in tableLabel" :key="index" :prop="column.prop"
                :label="column.label" >
              </el-table-column> 
      </el-table>
      
      <el-row>
        <el-col :span="24">
          <el-button @click="differenceVisible=false">{{ $t('button.cancel') }}</el-button>
        </el-col>
      </el-row>
    </el-dialog> -->
  </div>
</template>

<script src="./monitoring.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

#row {
  margin-top: 20px;
  margin-left: 20px;
}
</style>