<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="refForm" :model="form" :rules="rules" label-width="120px" label-position="right">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-row>
              <el-col :span="24">
                <el-form-item label="选择库位" prop="bin">
                  <el-select  v-model="form.bin">
                    <el-option v-for="item in listBin" :key="item.id" :label="item.name" :value="item.name" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="选择区域" prop="location">
                  <el-select  v-model="form.location">
                    <el-option v-for="item in listLocation" :key="item.id" :label="item.name" :value="item.name" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="选择项目号" prop="projectName">
                  <el-select  v-model="form.projectName" @change="changeProject(form.projectName)">
                    <el-option v-for="item in listProject" :key="item.id" :label="item.name" :value="item.name" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="请输入Pallet" prop="pallet">
                  <el-input  v-model="form.pallet" @keyup.native.enter="focusNext('scanBox')"
                    @change="changePallet(form.pallet)" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Scan_SN" prop="scanSn">
                  <el-input  ref="scanSn" v-model="scanSn" :disabled="!isScanPn" @keyup.native.enter="focusNext('scanPn')"
                    @change="changeSn(scanSn)" minlength="1" />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="Scan_PN" prop="scanPn">
                  <el-input  ref="scanPn" v-model="scanPn" :disabled="isScanPn" @change="changePn(scanPn)" minlength="1" />
                </el-form-item>
              </el-col>

            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="24">
                <el-form-item label="Sn校验规则" prop="snRules">
                  <el-radio-group v-model="form.snRules">
                    <el-radio :label="0">NO</el-radio>
                    <el-radio :label="8"></el-radio>
                    <el-radio v-permission="['/Inventory/Force']" :label="-1">{{ $t('button.inventoryForce') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Pn校验规则" prop="pnRules">
                  <el-radio-group v-model="form.pnRules">
                    <el-radio :label="0">NO</el-radio>
                    <el-radio :label="10"></el-radio>
                    <el-radio :label="6"></el-radio>
                    <el-radio :label="3"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="箱号Box" prop="boxName">
                  <el-input ref="scanBox"   v-model="form.boxName" @keyup.native.enter="focusNext('scanBox')"
                    @change="changeBox(form.boxName)" minlength="1" :disabled="isAutomatic" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-col :span="12">
                  <el-form-item label="PalletQty:" prop="palletQty">
                    <label style="font-size: 25px;">{{ form.palletQty }}</label>
                  </el-form-item></el-col>
                <el-col :span="12">
                  <el-form-item v-permission="['/Inventory/ClosePN']" label="是否关闭PN">
                    <el-radio-group v-model="form.closePN">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="12">
                  <el-form-item label="BoxQTY:" prop="account">
                    <label style="font-size: 25px;">{{ form.boxQTY }}</label>
                  </el-form-item></el-col>
                <el-col :span="12">
                  <el-form-item v-permission="['/Inventory/OpenBox']" label="打开箱号">
                    <el-radio-group v-model="form.openBox" @input="checkOpenBox">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="account">
                  <el-button type="info" @click="printInventoryByBox">箱号打印</el-button>
                  <el-button type="info" @click="printInventory">盘点票打印</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="account">
                  <el-button :disabled="isSave" type="success" @click="save">保存</el-button>
                  <el-button v-permission="['/Inventory/ClosePallet']" type="info" @click="closePallet">{{
                    $t('button.inventoryClose') }}</el-button>
                  <!-- <el-button type="info" @click="printInventoryByBox">箱号打印</el-button>
                  <el-button type="info" @click="printInventory">盘点票打印</el-button> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-col :span="24">
                <el-form-item label="">
                  <label style="color: red; font-size: 30px;word-wrap: break-word;"> {{ errorText }}</label>
                </el-form-item>
              </el-col>

            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="扫入数据" ac name="扫入数据">
        <el-col :span="24">
          <el-table ref="table" height="500" :data="tableData" :row-class-name="getRowClassName"
            :header-cell-style="{ background: '#f5f5f7' }" element-loading-text="Loading" border fit
            highlight-current-row>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column v-for="(column, index) in tableLabel" :key="index" :prop="column.prop" :label="column.label"
              :width="flexWidth(column.prop, tableData, '日期')">
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="230" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="removeTableData(row)">{{
                  $t('button.delete')
                }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

      </el-tab-pane>
      <el-tab-pane label="扫入失败数据" name="扫入失败数据">
        <el-col :span="24">
          <el-table ref="table" height="500" :data="tableErrorData" :row-class-name="getRowClassName"
            :header-cell-style="{ background: '#f5f5f7' }" element-loading-text="Loading" border fit
            highlight-current-row>
            <el-table-column v-for="(column, index) in tableErrorLabel" :key="index" :prop="column.prop"
              :label="column.label" :width="flexWidth(column.prop, tableErrorData, '日期')">
            </el-table-column>
          </el-table>
        </el-col>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="checkTitle" :visible.sync="checkVisible" center width="70%">
      <el-table ref="table" :data="tableCheckData" :row-class-name="getRowClassName"
        @selection-change="handleSelectionChange" :header-cell-style="{ background: '#f5f5f7' }"
        element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(column, index) in tableLabel" :key="index" :prop="column.prop" :label="column.label"
          :width="flexWidth(column.prop, tableCheckData, '日期')">
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="checkSubmit">{{ $t('button.submit') }}</el-button>
          <el-button @click="close">{{ $t('button.cancel') }}</el-button>
        </el-col>
      </el-row>
    </el-dialog>


    <el-dialog :title="errorText" :visible.sync="errorVisible" center width="65%">
      <el-row>
        <el-col :span="23">
          <label style="color: red; font-size: 30px;word-wrap: break-word;"> {{ errorText }}</label>
        </el-col>
      </el-row>
      <br/>
      <br/>
      <el-row>
        <el-col :span="24">
          <el-button @click="errorVisible=false">{{ $t('button.cancel') }}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
  
<script src="./inventory.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

.el-input{
  font-size: 24px;
}
.el-select {
  font-size: 26px;
}
</style>