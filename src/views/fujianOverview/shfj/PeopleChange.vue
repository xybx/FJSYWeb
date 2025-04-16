<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='人口数据' :name='rksj'>
      </el-tab-pane>
      <el-tab-pane label='城镇化率' :name='czhl'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>
      <div v-if='type == rksj'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.type' clearable placeholder='请选择普查类型'>
            <el-option
                v-for='(item, index) in typeList'
                :key='item'
                :label="item + '数据'"
                :value='item'
            ></el-option>
          </el-select>
        </el-col>
      </div>
      <div v-if='type == czhl'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.year' clearable placeholder='请选择数据年份'>
            <el-option
                v-for='(item, index) in yearList'
                :key='item'
                :label="item + '年数据'"
                :value='item'
            ></el-option>
          </el-select>
        </el-col>
      </div>
      <el-col :span='3.5'>
        <div class='grid-content bg-purple'>
          <div>
            <el-input v-model='queryParam.areaName' placeholder='根据行政区名称模糊搜索'></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonGetPageData'>
              查询
            </el-button>
            <el-button v-if='type == rksj' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增人口数据
            </el-button>
            <el-button v-if='type == czhl' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增城镇化率数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button v-if='total != 0' type='danger' icon='el-icon-delete' class='handle-del mr10' @click='clearData'>
              根据筛选条件清空数据
            </el-button>
            <el-button type='primary' icon='el-icon-s-tools' class='handle-del mr10' @click='addBaseMap'>
              底图数据配置
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <div v-if='type == rksj'>
      <el-table style='font-size: 15px' :data='rksjTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='population' label='人口' align='center'></el-table-column>
        <el-table-column prop='type' label='普查类型' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='pagination'>
        <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                       :current-page='queryParam.page'
                       :page-sizes='[10, 15]' :page-size='100' layout='total, sizes, prev, pager, next, jumper'
                       :total='total'>
        </el-pagination>
      </div>
    </div>

    <div v-if='type == czhl'>
      <el-table style='font-size: 15px' :data='czhlTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='townRate' label='城镇化率（%）' align='center'></el-table-column>
        <el-table-column prop='year' label='年份' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='pagination'>
        <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                       :current-page='queryParam.page'
                       :page-sizes='[10, 15]' :page-size='100' layout='total, sizes, prev, pager, next, jumper'
                       :total='total'>
        </el-pagination>
      </div>
    </div>

    <el-dialog :title='rksjTitle'
               :visible.sync='rksjFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='rksjDataRef' :model='rksjData' :rules='rksjDataRules' label-width='150px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='rksjData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='人口：' prop='population'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rksjData.population'></el-input-number>
        </el-form-item>

        <el-form-item label='普查类型：' prop='type'>
          <el-select class='fjjdhl-input-width' v-model='rksjData.type' placeholder='请选择普查类型'>
            <el-option
                v-for='(item, index) in dictTypeList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rksjData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("rksjDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='czhlTitle'
               :visible.sync='czhlFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='czhlDataRef' :model='czhlData' :rules='czhlDataRules' label-width='150px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='czhlData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='城镇化率（%）：' prop='townRate'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='czhlData.townRate'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='czhlData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='czhlData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("czhlDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog
        title='导入模板数据'
        :visible.sync='importData'
        width='30%'
        :close-on-click-modal='false'
        :before-close='handleImportDataClose'>
      <el-upload class='upload-demo' :timeout='0' :action='importURL'
                 :headers='headers' :data='datas' accept='.xlsx' :multiple='false'
                 :limit='1' :on-exceed='handleExceed'
                 :on-success='onSuccess'
                 :file-list='fileList'>
        <el-button size='small' type='primary'>点击导入</el-button>
        <div slot='tip' class='el-upload__tip'>
          请导入下载的模板！
          不同的sheet页对应不同的标签数据，如果部分标签无数据导入请删除对应sheet页！
          <br>
          <span style='color: red'>如果导入的数据已存在，会提示选择导入方式！</span>
          <br>
          1.覆盖导入：根据行政区、年份、地区来进行判断，如果数据已存在，本次导入的数据视作修改。不存在就正常导入；
          <br>
          2.增量导入：直接新增数据，不进行任何操作；
        </div>
      </el-upload>
      <span slot='footer' class='dialog-footer'>
          <el-button @click='importData = false'>取 消</el-button>
        </span>
    </el-dialog>

    <el-dialog title='底图配置' custom-class="my-dialog" :visible.sync='baseMap' width='50%' :close-on-click-modal='false'
               :before-close='handleImportDataClose'>

      <el-row :gutter='20'>
        <el-col :span='3.5'>
          <el-button type='primary' @click='addBaseMapData()'>添 加</el-button>
        </el-col>
      </el-row>
      <div class='my-dialog-content'>
        <el-table style='font-size: 15px; margin-top: 10px' :data='baseMapList' border class='table'
                  ref='multipleTable'
                  header-cell-class-name='table-header'>

          <el-table-column prop='name' label='底图名称' align='center'></el-table-column>
          <el-table-column prop='url' label='底图地址' align='center'></el-table-column>
          <el-table-column prop='type' label='底图类型' align='center'></el-table-column>
          <el-table-column label='操作' align='center' width='150px'>
            <template slot-scope='scope'>
              <el-button type='text' icon='el-icon-edit' @click='editBaseMap(scope.row)'>编辑</el-button>
              <el-button type='text' icon='el-icon-delete' confirm @click='delBaseMap(scope.row)'
                         style='color:red'>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='baseMap = false'>关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title='添加底图配置' custom-class="my-dialog" :visible.sync='baseMapData' width='30%' :close-on-click-modal='false'
               :before-close='handleImportDataClose'>


      <el-form ref='baseMapFormRef' :model='baseMapForm' :rules='baseMapFormRules' label-width='150px'>
        <el-form-item label='底图名称：' prop='name'>
          <el-input class='fjjdhl-input-width' v-model.trim='baseMapForm.name'></el-input>
        </el-form-item>

        <el-form-item label='底图地址：' prop='url'>
          <el-input class='fjjdhl-input-width' v-model.trim='baseMapForm.url'></el-input>
        </el-form-item>

        <el-form-item label='底图类型：' prop='type'>
          <el-select v-model="baseMapForm.type" placeholder="请选择类型">
            <el-option
                v-for="(item, index) in baseMapTypeList"
                :key="index"
                :label="item.DICTNAME"
                :value="item.DICTVALUE"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='baseMapData = false'>取 消</el-button>
                <el-button type='primary' @click='submitBaseMap("baseMapFormRef")'>确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveChangeDataApi
  , editChangeDataDataApi
  , delChangeDataDataApi
  , pageChangeDataDataApi
  , queryChangeDataTypeListApi
  , saveTownRateDataApi
  , editTownRateDataApi
  , delTownRateDataApi
  , pageTownRateDataApi
  , queryTownRateYearListApi
  , clearChangeDataApi
  , clearTownRateDataApi
  } from '../api/shfj/PeopleChangeApi';
import {
  exportExcel,
  getDictByCodeApi,
  getImportUrl,
  saveBaseMapApi,
  getBaseMapListApi,
  delBaseMapApi,
  editBaseMapApi,
  getServerTypeApi,
  choseImportMode
} from '@/views/fujianOverview/api/FjoPublicApi';

export default {
  name: 'peopleChange',
  data() {
    return {
      code: "rkbq",

      type: '山海福建-人口变迁-人口数据',
      rksj: '山海福建-人口变迁-人口数据',
      czhl: '山海福建-人口变迁-城镇化率',

      importData: false,
      importURL: '',
      fileList: [],
      baseMap: false,
      baseMapData: false,
      baseMapList: [],
      baseMapForm: {
        name: undefined,
        url: undefined,
        type: undefined,
        code: undefined
      },
      baseMapTypeList: [],

      rksjTableData: [],
      czhlTableData: [],
      yearList: [],
      typeList: [],
      dictTypeList: [],
      rksjData: {
        areaName: undefined,
        serial: 0,
        type: undefined,
        population: 0
      },
      czhlData: {
        areaName: undefined,
        year: undefined,
        serial: 0,
        townRate: 0,
      },
      rksjDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '普查类型不能为空', trigger: 'changer' }],
        population: [{ required: true, message: '人口数据不能为空', trigger: 'blur' }]
      },
      czhlDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        townRate: [{ required: true, message: '城镇化率数据不能为空', trigger: 'blur' }],
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }],
      },
      queryParam: {
        page: 1,
        pageSize: 10,
        year: undefined,
        type: undefined,
        areaName: undefined
      },
      total: 0,
      rksjTitle: '新增数据',
      rksjFormFlag: false,
      czhlTitle: '新增数据',
      czhlFormFlag: false,
      copyData: {
        rksjData: {
          areaName: undefined,
          serial: 0,
          type: undefined,
          population: 0
        },
        czhlData: {
          areaName: undefined,
          year: undefined,
          serial: 0,
          townRate: 0,
        },
        queryParam: {
          page: 1,
          pageSize: 10,
          year: undefined,
          type: undefined,
          areaName: undefined
        },
        baseMapForm: {
          name: undefined,
          url: undefined,
          type: undefined,
          code: undefined
        },
      }
    };
  },
  components: {},
  computed: {
    // 上传时需要的请求头
    headers() {
      const token = sessionStorage.getItem('token');
      return {
        Authorization: token,
        loginType: 'system'
      };
    },
    datas() {
      return {
        code: this.code
      }
    }
  },
  mounted() {
    this.getPageData();
    this.initYearList();
    this.initDictTypeList();
    this.initImportUrl();
    this.initBaseMapList();
  },
  created() {
  },
  methods: {
    initBaseMapList() {
      getServerTypeApi().then(res => {
        if (res.code == 200) {
          this.baseMapTypeList = res.data;
        }
      })
    },
    getBaseMapList() {
      getBaseMapListApi({code: this.code}).then(res => {
        if (res.code == 200) {
          this.baseMapList = res.data;
        }
      })
    },
    submitBaseMap(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          if (this.baseMapForm.pid != null || this.baseMapForm.pid != undefined) {
            editBaseMapApi(this.baseMapForm).then(res => {
              if (res.code == 200) {
                this.$message.success("修改成功！");
                this.baseMapData = false;
                this.getBaseMapList();
              }
            })
          } else {
            this.baseMapForm.code = this.code;
            saveBaseMapApi(this.baseMapForm).then(res => {
              if (res.code == 200) {
                this.$message.success("添加成功！");
                this.baseMapData = false;
                this.getBaseMapList();
              }
            })
          }
        } else {
          this.$message.error('请补充必填项');
          return false;
        }
      });
    },
    editBaseMap(row) {
      this.baseMapData = true;
      Object.assign(this.baseMapForm, row);
    },
    delBaseMap(row) {
      delBaseMapApi(row.pid).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功！");
          this.getBaseMapList();
        }
      })
    },
    addBaseMapData() {
      this.baseMapData = true;
      this.baseMapForm.pid = undefined;
Object.assign(this.baseMapForm, this.copyData.baseMapForm);
    },
    addBaseMap() {
      this.baseMap = true;
      this.getBaseMapList();
    },
    handleImportDataClose(done) {
      done();
    },
    onSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.$message.success(response.msg);
        // 关闭对话框，刷新列表
        this.importData = false;
        this.getPageData();
        this.initYearList();
        this.initDictTypeList();
      } else if (response.code == 5002) {
        // 代表当前需要判断是否覆盖导入或增量导入
        this.$confirm("导入数据中存在重复数据，请选择导入方式！", "提示", {
          confirmButtonText:"增量导入",
          cancelButtonText:"覆盖导入",
          type: "warning"
        }).then(_ => {
          let data = {
            id: response.data.id,
            type: false
          }
          // 增量导入
          choseImportMode(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              // 关闭对话框，刷新列表
              this.importData = false;
              this.getPageData();
              this.initYearList();
              this.initDictTypeList();
            }
          })
        }).catch(_ => {
          // 覆盖导入
          let data = {
            id: response.data.id,
            type: true
          }
          // 增量导入
          choseImportMode(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              // 关闭对话框，刷新列表
              this.importData = false;
              this.getPageData();
              this.initYearList();
              this.initDictTypeList();
            }
          })
        });
      } else {
        this.$message.warning(response.msg);
        // 删除当前数据
        let index = -1;
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].name == file.name) {
            index = i;
          }
        }
        fileList.splice(index, 1);
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制单次上传 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    initImportUrl() {
      this.importURL = getImportUrl();
    },
    importExcel() {
      this.importData = true;
      this.fileList = [];
    },
    // 下载模板数据
    downTemplate() {
      exportExcel(this.code);
    },
    initDictTypeList() {
      getDictByCodeApi({code:"pclx"}).then(res => {
        if (res.code == 200) {
          this.dictTypeList = res.data;
          this.dictTypeList = this.dictTypeList.sort((a, b) => a.pid - b.pid);
        }
      })
    },
    clearData() {
      this.$confirm('确认根据筛选条件清空全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            if (this.type == this.rksj) {
              clearChangeDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.czhl) {
              clearTownRateDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          })
          .catch(_ => {
          });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 存储数据
          if (this.type == this.rksj) {
            if (this.rksjData.pid) {
              // 更新
              editChangeDataDataApi(this.rksjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.rksjFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveChangeDataApi(this.rksjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.rksjFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.czhl) {
            if (this.czhlData.pid) {
              // 更新
              editTownRateDataApi(this.czhlData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.czhlFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveTownRateDataApi(this.czhlData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.czhlFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          }
        } else {
          this.$message.error('请补充必填项');
          return false;
        }
      });
    },
    initYearList() {
      if (this.type == this.rksj) {
        queryChangeDataTypeListApi().then(res => {
          if (res.code == 200) {
            this.typeList = res.data;
          }
        })
      } else if (this.type == this.czhl) {
        queryTownRateYearListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        })
      }
    },
    buttonGetPageData() {
      this.queryParam.page = 1;
      this.getPageData();
    },
    getPageData() {
      if (this.type == this.rksj) {
        pageChangeDataDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.rksjTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.czhl) {
        pageTownRateDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.czhlTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      }
    },
    // 分页参数回调
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.getPageData();
    },
    handleCurrentChange(val) {
      this.queryParam.page = val;
      this.getPageData();
    },
    handleClick() {
      Object.assign(this.queryParam, this.copyData.queryParam);
      this.total = 0;
      this.getPageData();
      this.initYearList();
    },
    addData() {
      if (this.type == this.rksj) {
        this.rksjTitle = '新增数据';
        this.rksjFormFlag = true;
        this.rksjData.pid = undefined;
        Object.assign(this.rksjData, this.copyData.rksjData);
      } else if (this.type == this.czhl) {
        this.czhlTitle = '新增数据';
        this.czhlFormFlag = true;
        this.czhlData.pid = undefined;
        Object.assign(this.czhlData, this.copyData.czhlData);
      }
    },
    handleEdit(row) {
      if (this.type == this.rksj) {
        this.rksjTitle = '编辑数据';
        this.rksjFormFlag = true;
        Object.assign(this.rksjData, row);
      } else if (this.type == this.czhl) {
        this.czhlTitle = '编辑数据';
        this.czhlFormFlag = true;
        Object.assign(this.czhlData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.rksj) {
          delChangeDataDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.czhl) {
          delTownRateDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        }
      }).catch(_ => {

      });
    },
    handleClose() {
      if (this.type == this.rksj) {
        this.rksjFormFlag = false;
      } else if (this.type == this.czhl) {
        this.czhlFormFlag = false;
      }
    }
  }
};
</script>
<style>
.first-div {
  margin-top: 20px;
}

.input-width {
  width: 15%;
}

.fjjdhl-input-width {
  width: 200px;
}

.el-row {
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}
.el-col {
  border-radius: 4px;
}

.background {
  background-color: white;
}

.el-cascader {
  width: 350px;
}
</style>