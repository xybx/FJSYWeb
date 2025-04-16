<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='GDP' :name='gdp'>
      </el-tab-pane>
      <el-tab-pane label='财政收入' :name='czsr'>
      </el-tab-pane>
      <el-tab-pane label='人均可支配' :name='rjkzp'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>
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
            <el-button v-if='type == gdp' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增GDP数据
            </el-button>
            <el-button v-if='type == czsr' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增财政收入数据
            </el-button>
            <el-button v-if='type == rjkzp' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增人均可支配数据
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

    <div v-if='type == gdp'>
      <el-table style='font-size: 15px' :data='gdpTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='gdp' label='GDP/亿元' align='center'></el-table-column>
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

    <div v-if='type == czsr'>
      <el-table style='font-size: 15px' :data='czsrTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='localFinanceIncome' label='地方一般财政预算收入（万元）' align='center'></el-table-column>
        <el-table-column prop='localFinanceExpend' label='地方一般财政预算支出（万元）' align='center'></el-table-column>
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

    <div v-if='type == rjkzp'>
      <el-table style='font-size: 15px' :data='rjkzpTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='townPeopleIncome' label='城镇居民可支配收入（元）' align='center'></el-table-column>
        <el-table-column prop='countyPeopleIncome' label='农村居民可支配收入（元）' align='center'></el-table-column>
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

    <el-dialog :title='gdpTitle'
               :visible.sync='gdpFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='gdpDataRef' :model='gdpData' :rules='gdpDataRules' label-width='150px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='gdpData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='GDP：' prop='gdp'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='gdpData.gdp'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='gdpData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='gdpData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("gdpDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='czsrTitle'
               :visible.sync='czsrFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='czsrDataRef' :model='czsrData' :rules='czsrDataRules' label-width='250px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='czsrData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='地方一般财政预算收入（万元）：' prop='localFinanceIncome'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='czsrData.localFinanceIncome'></el-input-number>
        </el-form-item>

        <el-form-item label='地方一般财政预算支出（万元）：' prop='localFinanceExpend'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='czsrData.localFinanceExpend'></el-input-number>
        </el-form-item>


        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='czsrData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='czsrData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("czsrDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='rjkzpTitle'
               :visible.sync='rjkzpFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='rjkzpDataRef' :model='rjkzpData' :rules='rjkzpDataRules' label-width='250px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='rjkzpData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='城镇居民可支配收入（元）：' prop='townPeopleIncome'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='rjkzpData.townPeopleIncome'></el-input-number>
        </el-form-item>

        <el-form-item label='农村居民可支配收入（元）：' prop='countyPeopleIncome'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='rjkzpData.countyPeopleIncome'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='rjkzpData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rjkzpData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("rjkzpDataRef")'>确 定</el-button>
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
import {
  saveGdpDataApi
  , editGDPDataApi
  , delGDPDataApi
  , pageGdpDataApi
  , queryGdpYearListApi
  , saveLocalFinanceDataApi
  , editLocalFinanceDataApi
  , delLocalFinanceDataApi
  , pageLocalFinanceDataApi
  , queryLocalFinanceYearListApi
  , savePeopleFinanceDataApi
  , editPeopleFinanceDataApi
  , delPeopleFinanceDataApi
  , pagePeopleFinanceDataApi
  , queryPeopleFinanceYearListApi
  , clearGdpDataApi
  , clearLocalFinanceDataApi
  , clearPeopleFinanceDataApi
} from '../api/shfj/SocialEconomicsApi';
import {
  exportExcel,
  getImportUrl,
  saveJsonDataApi,
  saveBaseMapApi,
  getBaseMapListApi,
  delBaseMapApi,
  editBaseMapApi,
  getServerTypeApi,
  choseImportMode
} from '@/views/fujianOverview/api/FjoPublicApi';

export default {
  name: 'socialEconomics',
  data() {
    return {
      code: "shjj",

      type: '山海福建-社会经济-gdp',
      gdp: '山海福建-社会经济-gdp',
      czsr: '山海福建-社会经济-财政收入',
      rjkzp: '山海福建-社会经济-人均可支配',

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

      gdpTableData: [],
      czsrTableData: [],
      rjkzpTableData: [],
      yearList: [],
      gdpData: {
        areaName: undefined,
        serial: 0,
        year: undefined,
        gdp: 0
      },
      czsrData: {
        areaName: undefined,
        year: undefined,
        serial: 0,
        localFinanceIncome: 0,
        localFinanceExpend: 0
      },
      rjkzpData: {
        areaName: undefined,
        serial: 0,
        year: undefined,
        townPeopleIncome: 0,
        countyPeopleIncome: 0
      },
      gdpDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        gdp: [{ required: true, message: 'GDP数据不能为空', trigger: 'blur' }]
      },
      czsrDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        localFinanceIncome: [{ required: true, message: '地方一般财政预算收入数据不能为空', trigger: 'blur' }],
        localFinanceExpend: [{ required: true, message: '地方一般财政预算支出数据不能为空', trigger: 'blur' }]
      },
      rjkzpDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        gdp: [{ required: true, message: 'GDP数据不能为空', trigger: 'blur' }],
        townPeopleIncome: [{ required: true, message: '城镇居民可支配收入数据不能为空', trigger: 'blur' }],
        countyPeopleIncome: [{ required: true, message: '农村居民可支配收入数据不能为空', trigger: 'blur' }]
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
        areaName: undefined
      },
      total: 0,
      gdpTitle: '新增数据',
      gdpFormFlag: false,
      czsrTitle: '新增数据',
      czsrFormFlag: false,
      rjkzpTitle: '新增数据',
      rjkzpFormFlag: false,
      copyData: {
        gdpData: {
          areaName: undefined,
          serial: 0,
          year: undefined,
          gdp: 0
        },
        czsrData: {
          areaName: undefined,
          year: undefined,
          serial: 0,
          localFinanceIncome: 0,
          localFinanceExpend: 0
        },
        rjkzpData: {
          areaName: undefined,
          serial: 0,
          year: undefined,
          townPeopleIncome: 0,
          countyPeopleIncome: 0
        },
        queryParam: {
          page: 1,
          pageSize: 10,
          year: undefined,
          areaName: undefined
        },
        baseMapForm: {
          name: undefined,
          url: undefined,
          type: undefined,
          code: undefined
        }
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
    clearData() {
      this.$confirm('确认根据筛选条件清空全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            if (this.type == this.gdp) {
              clearGdpDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.czsr) {
              clearLocalFinanceDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.rjkzp) {
              clearPeopleFinanceDataApi(this.queryParam).then(res => {
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
          if (this.type == this.gdp) {
            if (this.gdpData.pid) {
              // 更新
              editGDPDataApi(this.gdpData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.gdpFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveGdpDataApi(this.gdpData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.gdpFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.czsr) {
            if (this.czsrData.pid) {
              // 更新
              editLocalFinanceDataApi(this.czsrData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.czsrFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveLocalFinanceDataApi(this.czsrData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.czsrFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.rjkzp) {
            if (this.rjkzpData.pid) {
              // 更新
              editPeopleFinanceDataApi(this.rjkzpData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.rjkzpFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              savePeopleFinanceDataApi(this.rjkzpData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.rjkzpFormFlag = false;
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
      if (this.type == this.gdp) {
        queryGdpYearListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.czsr) {
        queryLocalFinanceYearListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.rjkzp) {
        queryPeopleFinanceYearListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      }
    },
    buttonGetPageData() {
      this.queryParam.page = 1;
      this.getPageData();
    },
    getPageData() {
      if (this.type == this.gdp) {
        pageGdpDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.gdpTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.czsr) {
        pageLocalFinanceDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.czsrTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.rjkzp) {
        pagePeopleFinanceDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.rjkzpTableData = res.data.records;
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
      if (this.type == this.gdp) {
        this.gdpTitle = '新增数据';
        this.gdpFormFlag = true;
        this.gdpData.pid = undefined;
        Object.assign(this.gdpData, this.copyData.gdpData);
      } else if (this.type == this.czsr) {
        this.czsrTitle = '新增数据';
        this.czsrFormFlag = true;
        this.czsrData.pid = undefined;
        Object.assign(this.czsrData, this.copyData.czsrData);
      } else if (this.type == this.rjkzp) {
        this.rjkzpTitle = '新增数据';
        this.rjkzpFormFlag = true;
        this.rjkzpData.pid = undefined;
        Object.assign(this.rjkzpData, this.copyData.rjkzpData);
      }
    },
    handleEdit(row) {
      if (this.type == this.gdp) {
        this.gdpTitle = '编辑数据';
        this.gdpFormFlag = true;
        Object.assign(this.gdpData, row);
      } else if (this.type == this.czsr) {
        this.czsrTitle = '编辑数据';
        this.czsrFormFlag = true;
        Object.assign(this.czsrData, row);
      } else if (this.type == this.rjkzp) {
        this.rjkzpTitle = '编辑数据';
        this.rjkzpFormFlag = true;
        Object.assign(this.rjkzpData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.gdp) {
          delGDPDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.czsr) {
          delLocalFinanceDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.rjkzp) {
          delPeopleFinanceDataApi(row.pid).then(res => {
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
      if (this.type == this.gdp) {
        this.gdpFormFlag = false;
      } else if (this.type == this.czsr) {
        this.czsrFormFlag = false;
      } else if (this.type == this.rjkzp) {
        this.rjkzpFormFlag = false;
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