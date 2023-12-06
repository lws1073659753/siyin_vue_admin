<template>
    <div class="app-container">
        <div class="block">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input v-model="listQuery.name" size="mini" placeholder="请输项目号" />
                </el-col>
                <el-col :span="6">
                    <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{
                        $t('button.search') }}</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset')
                    }}</el-button>
                </el-col>
            </el-row>
            <br>
            <el-row>
                <el-col :span="24">
                    <el-button type="success" size="mini" icon="el-icon-plus" @click.native="add">{{ $t('button.add')
                    }}</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- <el-table
            v-loading="listLoading" :data="list" element-loading-text="Loading" :header-cell-style="{ background: '#f5f5f7' }" border  fit highlight-current-row @current-change="handleCurrentChange"
        >            -->
        <el-table :data="list" style="width: 100%">
            <el-table-column label="项目号" prop="name">

            </el-table-column>
            <el-table-column label="box前缀" prop="boxPrefix">

            </el-table-column>

            <el-table-column label="TAG_NO前缀" prop="taG_NOPrefix">

            </el-table-column>

            <el-table-column label="条码替换" prop="snReplace">

            </el-table-column>

            <el-table-column label="条码末尾屏蔽内容" prop="endShield">

            </el-table-column>
            <el-table-column label="是否厂内盘点" prop="isPlantSn">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isPlantSn" :active-color="scope.row.isPlantSn === true ? '是' : '否'" disabled />

                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="240" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(row)">{{ $t('button.edit')
                    }}</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="remove(row)">{{
                        $t('button.delete') }}</el-button>
                </template>

            </el-table-column>
        </el-table>
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100, 500]"
            :page-size="listQuery.pageSize" :total="total" @size-change="changeSize" @current-change="fetchPage"
            @prev-click="fetchPrev" @next-click="fetchNext" />
        <el-dialog :title="formTitle" :visible.sync="formVisible" width="70%">
            <el-form ref="form" :model="form" :rules="rules" label-width="200px">
                <el-row>
                    <!-- <el-col :span="12" v-show="isAdd">
                      <el-form-item label="项目线索" prop="selectClues">
                          <el-select v-model="selectCluesItem" clearable @change="selectClues(selectCluesItem)"
                              placeholder="请选择">
                              <el-option v-for="item in allClues" :key="item.id" :label="item.name" :value="item.id" />
                          </el-select>
                      </el-form-item>
                  </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="项目号" prop="name">
                            <el-input v-model="form.name" minlength="1" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="box前缀" prop="boxPrefix">
                            <el-input v-model="form.boxPrefix" minlength="1" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="TAG_NO前缀" prop="taG_NOPrefix">
                            <el-input v-model="form.taG_NOPrefix" minlength="1" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="条码替换(示例：_|.|)" prop="snReplace">
                            <el-input v-model="form.snReplace" minlength="1" placeholder="示例：_|.|"  />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="条码末尾屏蔽(示例：-A|-B|-C)" prop="endShield">
                            <el-input v-model="form.endShield" minlength="1" placeholder="示例：-A|-B|-C" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否厂内盘点" prop="isPlantSn">
                            <el-switch v-model="form.isPlantSn" active-color="#13ce66" inactive-color="#ff4949"></el-switch>

                        </el-form-item>
                    </el-col>


                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                    <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script src="./itemproduct.js"></script>