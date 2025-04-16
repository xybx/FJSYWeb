<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='道路长度网密度' :name='dlcdwmd'>
      </el-tab-pane>
      <el-tab-pane label='客运量及货运量' :name='kyljhyl'>
      </el-tab-pane>
      <el-tab-pane label='联系强度排名' :name='lxqdpm'>
      </el-tab-pane>
      <el-tab-pane label='公交、地铁覆盖率' :name='gjdtfgl'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>

      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if='type == dlcdwmd' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增道路长度网密度数据
            </el-button>
            <el-button v-if='type == kyljhyl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增客运量及货运量数据
            </el-button>
            <el-button v-if='type == lxqdpm' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增联系强度排名数据
            </el-button>
            <el-button v-if='type == gjdtfgl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增公交、地铁覆盖率数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button type='primary' icon='el-icon-s-tools' class='handle-del mr10' @click='addBaseMap'>
              底图数据配置
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <div v-if='type == dlcdwmd'>
      <el-table style='font-size: 15px' :data='dlcdwmdTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='roadLength' label='道路长度/公里' align='center'></el-table-column>
        <el-table-column prop='peopleAvgRoadArea' label='人均城市道路面积/平方米' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == kyljhyl'>
      <el-table style='font-size: 15px' :data='kyljhylTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='passengerVolume' label='客运量/万人' align='center'></el-table-column>
        <el-table-column prop='trafficVolume' label='货运量/万吨' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == lxqdpm'>
      <el-table style='font-size: 15px' :data='lxqdpmTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='migrate' label='百度迁徙出行强度' align='center'></el-table-column>
        <el-table-column prop='rank' label='排名' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == gjdtfgl'>
      <el-table style='font-size: 15px' :data='gjdtfglTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='coverageRate' label='公交、地铁覆盖率（%）' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title='dlcdwmdTitle'
               :visible.sync='dlcdwmdFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='dlcdwmdDataRef' :model='dlcdwmdData' :rules='dlcdwmdDataRules' label-width='200px'>

        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='dlcdwmdData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='道路长度/公里：' prop='roadLength'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='dlcdwmdData.roadLength'></el-input-number>
        </el-form-item>

        <el-form-item label='人均城市道路面积/平方米：' prop='peopleAvgRoadArea'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='dlcdwmdData.peopleAvgRoadArea'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='dlcdwmdData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("dlcdwmdDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='kyljhylTitle'
               :visible.sync='kyljhylFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='kyljhylDataRef' :model='kyljhylData' :rules='kyljhylDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='kyljhylData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='客运量/万人：' prop='passengerVolume'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='kyljhylData.passengerVolume'></el-input-number>
        </el-form-item>

        <el-form-item label='货运量/万吨：' prop='trafficVolume'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='kyljhylData.trafficVolume'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='kyljhylData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("kyljhylDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='lxqdpmTitle'
               :visible.sync='lxqdpmFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='lxqdpmDataRef' :model='lxqdpmData' :rules='lxqdpmDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='lxqdpmData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='百度迁徙出行强度：' prop='migrate'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lxqdpmData.migrate'></el-input-number>
        </el-form-item>

        <el-form-item label='排名：' prop='rank'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lxqdpmData.rank'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lxqdpmData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("lxqdpmDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='gjdtfglTitle'
               :visible.sync='gjdtfglFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='gjdtfglDataRef' :model='gjdtfglData' :rules='gjdtfglDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='gjdtfglData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='公交、地铁覆盖率（%）：' prop='coverageRate'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='gjdtfglData.coverageRate'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='gjdtfglData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("gjdtfglDataRef")'>确 定</el-button>
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


    <el-dialog title='底图配置' custom-class='my-dialog' :visible.sync='baseMap' width='50%' :close-on-click-modal='false'
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

    <el-dialog title='添加底图配置' custom-class='my-dialog' :visible.sync='baseMapData' width='30%'
               :close-on-click-modal='false'
               :before-close='handleImportDataClose'>


      <el-form ref='baseMapFormRef' :model='baseMapForm' :rules='baseMapFormRules' label-width='150px'>
        <el-form-item label='底图名称：' prop='name'>
          <el-input class='fjjdhl-input-width' v-model.trim='baseMapForm.name'></el-input>
        </el-form-item>

        <el-form-item label='底图地址：' prop='url'>
          <el-input class='fjjdhl-input-width' v-model.trim='baseMapForm.url'></el-input>
        </el-form-item>

        <el-form-item label='底图类型：' prop='type'>
          <el-select v-model='baseMapForm.type' placeholder='请选择类型'>
            <el-option
                v-for='(item, index) in baseMapTypeList'
                :key='index'
                :label='item.DICTNAME'
                :value='item.DICTVALUE'
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
  delJsonDataApi,
  getDictByCodeApi,
  getJsonDataByCodeApi,
  saveJsonDataApi,
  exportExcel,
  getImportUrl,
  saveBaseMapApi,
  getBaseMapListApi,
  delBaseMapApi,
  editBaseMapApi,
  getServerTypeApi, choseImportMode
} from '@/views/fujianOverview/api/FjoPublicApi';

export default {
  name: 'roadTraffic',
  data() {
    return {
      code: 'dljt',
      type: '城市建设-道路交通-道路长度网密度',
      dlcdwmd: '城市建设-道路交通-道路长度网密度',
      kyljhyl: '城市建设-道路交通-客运量及货运量',
      lxqdpm: '城市建设-道路交通-联系强度排名',
      gjdtfgl: '城市建设-道路交通-公交、地铁覆盖率',

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

      dlcdwmdTableData: [],
      kyljhylTableData: [],
      lxqdpmTableData: [],
      gjdtfglTableData: [],
      xzqNameList: [],

      dlcdwmdData: {
        serial: 0,
        areaName: undefined,
        roadLength: 0,
        peopleAvgRoadArea: 0
      },
      kyljhylData: {
        areaName: undefined,
        serial: 0,
        passengerVolume: 0,
        trafficVolume: 0
      },
      lxqdpmData: {
        areaName: undefined,
        serial: 0,
        migrate: 0,
        rank: 0
      },
      gjdtfglData: {
        areaName: undefined,
        serial: 0,
        coverageRate: 0
      },
      dlcdwmdDataRules: {
        areaName: [{ required: true, message: '行政区名称数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        roadLength: [{ required: true, message: '道路长度数据不能为空', trigger: 'blur' }],
        peopleAvgRoadArea: [{ required: true, message: '人均城市道路面积数据不能为空', trigger: 'blur' }]
      },
      kyljhylDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        passengerVolume: [{ required: true, message: '客运量数据不能为空', trigger: 'blur' }],
        trafficVolume: [{ required: true, message: '货运量数据不能为空', trigger: 'blur' }]
      },
      lxqdpmDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        migrate: [{ required: true, message: '百度迁徙出行强度数据不能为空', trigger: 'blur' }],
        rank: [{ required: true, message: '排名数据不能为空', trigger: 'blur' }]
      },
      gjdtfglDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        coverageRate: [{ required: true, message: '公交地铁覆盖率数据不能为空', trigger: 'blur' }]
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }]
      },

      dlcdwmdTitle: '新增数据',
      dlcdwmdFormFlag: false,
      kyljhylTitle: '新增数据',
      kyljhylFormFlag: false,
      lxqdpmTitle: '新增数据',
      lxqdpmFormFlag: false,
      gjdtfglTitle: '新增数据',
      gjdtfglFormFlag: false,
      copyData: {
        dlcdwmdData: {
          serial: 0,
          areaName: undefined,
          roadLength: 0,
          peopleAvgRoadArea: 0
        },
        kyljhylData: {
          areaName: undefined,
          serial: 0,
          passengerVolume: 0,
          trafficVolume: 0
        },
        lxqdpmData: {
          areaName: undefined,
          serial: 0,
          migrate: 0,
          rank: 0
        },
        gjdtfglData: {
          areaName: undefined,
          serial: 0,
          coverageRate: 0
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
      };
    }
  },
  mounted() {
    this.getPageData();
    this.initXzqNameList();
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
      });
    },
    getBaseMapList() {
      getBaseMapListApi({ code: this.code }).then(res => {
        if (res.code == 200) {
          this.baseMapList = res.data;
        }
      });
    },
    submitBaseMap(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          if (this.baseMapForm.pid != null || this.baseMapForm.pid != undefined) {
            editBaseMapApi(this.baseMapForm).then(res => {
              if (res.code == 200) {
                this.$message.success('修改成功！');
                this.baseMapData = false;
                this.getBaseMapList();
              }
            });
          } else {
            this.baseMapForm.code = this.code;
            saveBaseMapApi(this.baseMapForm).then(res => {
              if (res.code == 200) {
                this.$message.success('添加成功！');
                this.baseMapData = false;
                this.getBaseMapList();
              }
            });
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
          this.$message.success('删除成功！');
          this.getBaseMapList();
        }
      });
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
        this.initXzqNameList();
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
              this.initXzqNameList();
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
              this.initXzqNameList();
            }
          })
        });
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
              this.initXzqNameList();
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
              this.initXzqNameList();
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
    initXzqNameList() {
      getDictByCodeApi({ code: 'xzq' }).then(res => {
        if (res.code == 200) {
          this.xzqNameList = res.data;
          this.xzqNameList = this.xzqNameList.sort((a, b) => a.pid - b.pid);
        }
      });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 存储数据

          // 存储json数据
          let params = {
            code: this.type,
            jsonValue: undefined,
            type: 1
          };
          if (this.type == this.kyljhyl) {
            params.jsonValue = JSON.stringify(this.kyljhylData);
          } else if (this.type == this.lxqdpm) {
            params.jsonValue = JSON.stringify(this.lxqdpmData);
          } else if (this.type == this.dlcdwmd) {
            params.jsonValue = JSON.stringify(this.dlcdwmdData);
          } else if (this.type == this.gjdtfgl) {
            params.jsonValue = JSON.stringify(this.gjdtfglData);
          }
          saveJsonDataApi(params).then(res => {
            if (res.code == 200) {
              this.$message.success('操作成功！');
              this.kyljhylFormFlag = false;
              this.dlcdwmdFormFlag = false;
              this.lxqdpmFormFlag = false;
              this.gjdtfglFormFlag = false;
              this.getPageData();
            } else {
              return false;
            }
          });
        } else {
          this.$message.error('请补充必填项');
          return false;
        }
      });
    },
    buttonGetPageData() {
      this.queryParam.page = 1;
      this.getPageData();
    },
    getPageData() {

      // json数据
      getJsonDataByCodeApi({ code: this.type }).then(res => {
        if (res.code == 200) {
          if (this.type == this.kyljhyl) {
            if (res.data == '') {
              this.kyljhylTableData = [];
            } else {
              this.kyljhylTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.dlcdwmd) {
            if (res.data == '') {
              this.dlcdwmdTableData = [];
            } else {
              this.dlcdwmdTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.lxqdpm) {
            if (res.data == '') {
              this.lxqdpmTableData = [];
            } else {
              this.lxqdpmTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.gjdtfgl) {
            if (res.data == '') {
              this.gjdtfglTableData = [];
            } else {
              this.gjdtfglTableData = JSON.parse(res.data);
            }
          }
        }
      });
    },
    handleClick() {
      this.getPageData();
    },
    addData() {
      if (this.type == this.dlcdwmd) {
        this.dlcdwmdTitle = '新增数据';
        this.dlcdwmdFormFlag = true;
        this.dlcdwmdData.pid = undefined;
        Object.assign(this.dlcdwmdData, this.copyData.dlcdwmdData);
      } else if (this.type == this.kyljhyl) {
        this.kyljhylTitle = '新增数据';
        this.kyljhylFormFlag = true;
        this.kyljhylData.pid = undefined;
        Object.assign(this.kyljhylData, this.copyData.kyljhylData);
      } else if (this.type == this.lxqdpm) {
        this.lxqdpmTitle = '新增数据';
        this.lxqdpmFormFlag = true;
        this.lxqdpmData.pid = undefined;
        Object.assign(this.lxqdpmData, this.copyData.lxqdpmData);
      } else if (this.type == this.gjdtfgl) {
        this.gjdtfglTitle = '新增数据';
        this.gjdtfglFormFlag = true;
        this.gjdtfglData.pid = undefined;
        Object.assign(this.gjdtfglData, this.copyData.gjdtfglData);
      }
    },
    handleEdit(row) {
      if (this.type == this.dlcdwmd) {
        this.dlcdwmdTitle = '编辑数据';
        this.dlcdwmdFormFlag = true;
        Object.assign(this.dlcdwmdData, row);
      } else if (this.type == this.kyljhyl) {
        this.kyljhylTitle = '编辑数据';
        this.kyljhylFormFlag = true;
        Object.assign(this.kyljhylData, row);
      } else if (this.type == this.lxqdpm) {
        this.lxqdpmTitle = '编辑数据';
        this.lxqdpmFormFlag = true;
        Object.assign(this.lxqdpmData, row);
      } else if (this.type == this.gjdtfgl) {
        this.gjdtfglTitle = '编辑数据';
        this.gjdtfglFormFlag = true;
        Object.assign(this.gjdtfglData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        let params = {
          code: this.type,
          pid: row.pid
        };
        delJsonDataApi(params).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功！');
            this.getPageData();
          }
        });

      }).catch(_ => {

      });
    },
    handleClose() {
      if (this.type == this.dlcdwmd) {
        this.dlcdwmdFormFlag = false;
      } else if (this.type == this.kyljhyl) {
        this.kyljhylFormFlag = false;
      } else if (this.type == this.lxqdpm) {
        this.lxqdpmFormFlag = false;
      } else if (this.type == this.gjdtfgl) {
        this.gjdtfglFormFlag = false;
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
  width: 25%;
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