<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='供排水信息' :name='gpsxx'>
      </el-tab-pane>
      <el-tab-pane label='污水处理' :name='wscl'>
      </el-tab-pane>
      <el-tab-pane label='燃气普及率排名' :name='rqpjlpm'>
      </el-tab-pane>
      <el-tab-pane label='路桥基本信息' :name='lqjbxx'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>

      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>

            <el-button v-if='type == gpsxx' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增供排水信息数据
            </el-button>
            <el-button v-if='type == wscl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增污水处理数据
            </el-button>
            <el-button v-if='type == rqpjlpm' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增燃气普及率排名数据
            </el-button>
            <el-button v-if='type == lqjbxx' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增路桥基本信息数据
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

    <div v-if='type == gpsxx'>
      <el-table style='font-size: 15px' :data='gpsxxTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='waterChannel' label='供水管道长度/千米' align='center'></el-table-column>
        <el-table-column prop='drainWaterChannel' label='排水管网长度/千米' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == wscl'>
      <el-table style='font-size: 15px' :data='wsclTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='processingRate' label='污水处理率（%）' align='center'></el-table-column>
        <el-table-column prop='sewageTotal' label='污水处理总量/万吨' align='center'></el-table-column>
        <el-table-column prop='sewageFactory' label='污水处理厂/个' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == rqpjlpm'>
      <el-table style='font-size: 15px' :data='rqpjlpmTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='gasRate' label='燃气普及率（%）' align='center'></el-table-column>
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

    <div v-if='type == lqjbxx'>
      <el-table style='font-size: 15px' :data='lqjbxxTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='roadArea' label='道路面积/万平方米' align='center'></el-table-column>
        <el-table-column prop='peopleAvgRoadArea' label='人均城市道路面积/平方米' align='center'></el-table-column>
        <el-table-column prop='urbanBridge' label='城市桥梁数/座' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title='gpsxxTitle'
               :visible.sync='gpsxxFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='gpsxxDataRef' :model='gpsxxData' :rules='gpsxxDataRules' label-width='200px'>

        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='gpsxxData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='供水管道长度/千米：' prop='waterChannel'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='gpsxxData.waterChannel'></el-input-number>
        </el-form-item>

        <el-form-item label='排水管网长度/千米：' prop='drainWaterChannel'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='gpsxxData.drainWaterChannel'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='gpsxxData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("gpsxxDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='wsclTitle'
               :visible.sync='wsclFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='wsclDataRef' :model='wsclData' :rules='wsclDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='wsclData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='污水处理率（%）：' prop='processingRate'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='wsclData.processingRate'></el-input-number>
        </el-form-item>

        <el-form-item label='污水处理总量/万吨：' prop='sewageTotal'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='wsclData.sewageTotal'></el-input-number>
        </el-form-item>

        <el-form-item label='污水处理厂/个：' prop='sewageFactory'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='wsclData.sewageFactory'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='wsclData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("wsclDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='rqpjlpmTitle'
               :visible.sync='rqpjlpmFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='rqpjlpmDataRef' :model='rqpjlpmData' :rules='rqpjlpmDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='rqpjlpmData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='燃气普及率（%）：' prop='gasRate'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rqpjlpmData.gasRate'></el-input-number>
        </el-form-item>

        <el-form-item label='排名：' prop='rank'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rqpjlpmData.rank'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rqpjlpmData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("rqpjlpmDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='lqjbxxTitle'
               :visible.sync='lqjbxxFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='lqjbxxDataRef' :model='lqjbxxData' :rules='lqjbxxDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='lqjbxxData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='道路面积/万平方米：' prop='roadArea'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='lqjbxxData.roadArea'></el-input-number>
        </el-form-item>

        <el-form-item label='人均城市道路面积/平方米：' prop='peopleAvgRoadArea'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='lqjbxxData.peopleAvgRoadArea'></el-input-number>
        </el-form-item>

        <el-form-item label='城市桥梁数/座：' prop='urbanBridge'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='lqjbxxData.urbanBridge'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lqjbxxData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("lqjbxxDataRef")'>确 定</el-button>
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
      code: 'sdqlq',
      type: '城市建设-水电气路桥-供排水信息',
      gpsxx: '城市建设-水电气路桥-供排水信息',
      wscl: '城市建设-水电气路桥-污水处理',
      rqpjlpm: '城市建设-水电气路桥-燃气普及率排名',
      lqjbxx: '城市建设-水电气路桥-路桥基本信息',

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

      gpsxxTableData: [],
      wsclTableData: [],
      rqpjlpmTableData: [],
      lqjbxxTableData: [],
      xzqNameList: [],

      gpsxxData: {
        serial: 0,
        areaName: undefined,
        waterChannel: 0,
        drainWaterChannel: 0
      },
      wsclData: {
        areaName: undefined,
        serial: 0,
        processingRate: 0,
        sewageTotal: 0,
        sewageFactory: 0
      },
      rqpjlpmData: {
        areaName: undefined,
        serial: 0,
        gasRate: 0,
        rank: 0
      },
      lqjbxxData: {
        areaName: undefined,
        serial: 0,
        roadArea: 0,
        peopleAvgRoadArea: 0,
        urbanBridge: 0
      },
      gpsxxDataRules: {
        areaName: [{ required: true, message: '行政区名称数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        waterChannel: [{ required: true, message: '供水管道长度数据不能为空', trigger: 'blur' }],
        drainWaterChannel: [{ required: true, message: '排水管网长度数据不能为空', trigger: 'blur' }]
      },
      wsclDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        processingRate: [{ required: true, message: '污水处理率数据不能为空', trigger: 'blur' }],
        sewageFactory: [{ required: true, message: '污水处理厂数据不能为空', trigger: 'blur' }],
        sewageTotal: [{ required: true, message: '污水处理总量数据不能为空', trigger: 'blur' }]
      },
      rqpjlpmDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        gasRate: [{ required: true, message: '燃气普及率数据不能为空', trigger: 'blur' }],
        rank: [{ required: true, message: '排名数据不能为空', trigger: 'blur' }]
      },
      lqjbxxDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        roadArea: [{ required: true, message: '道路面积数据不能为空', trigger: 'blur' }],
        peopleAvgRoadArea: [{ required: true, message: '人均城市道路面积数据不能为空', trigger: 'blur' }],
        urbanBridge: [{ required: true, message: '城市桥梁数数据不能为空', trigger: 'blur' }]
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }]
      },

      gpsxxTitle: '新增数据',
      gpsxxFormFlag: false,
      wsclTitle: '新增数据',
      wsclFormFlag: false,
      rqpjlpmTitle: '新增数据',
      rqpjlpmFormFlag: false,
      lqjbxxTitle: '新增数据',
      lqjbxxFormFlag: false,
      copyData: {
        gpsxxData: {
          serial: 0,
          areaName: undefined,
          waterChannel: 0,
          drainWaterChannel: 0
        },
        wsclData: {
          areaName: undefined,
          serial: 0,
          processingRate: 0,
          sewageTotal: 0,
          sewageFactory: 0
        },
        rqpjlpmData: {
          areaName: undefined,
          serial: 0,
          gasRate: 0,
          rank: 0
        },
        lqjbxxData: {
          areaName: undefined,
          serial: 0,
          roadArea: 0,
          peopleAvgRoadArea: 0,
          urbanBridge: 0
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
          if (this.type == this.wscl) {
            params.jsonValue = JSON.stringify(this.wsclData);
          } else if (this.type == this.rqpjlpm) {
            params.jsonValue = JSON.stringify(this.rqpjlpmData);
          } else if (this.type == this.gpsxx) {
            params.jsonValue = JSON.stringify(this.gpsxxData);
          } else if (this.type == this.lqjbxx) {
            params.jsonValue = JSON.stringify(this.lqjbxxData);
          }
          saveJsonDataApi(params).then(res => {
            if (res.code == 200) {
              this.$message.success('操作成功！');
              this.wsclFormFlag = false;
              this.gpsxxFormFlag = false;
              this.rqpjlpmFormFlag = false;
              this.lqjbxxFormFlag = false;
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
          if (this.type == this.wscl) {
            if (res.data == '') {
              this.wsclTableData = [];
            } else {
              this.wsclTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.gpsxx) {
            if (res.data == '') {
              this.gpsxxTableData = [];
            } else {
              this.gpsxxTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.rqpjlpm) {
            if (res.data == '') {
              this.rqpjlpmTableData = [];
            } else {
              this.rqpjlpmTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.lqjbxx) {
            if (res.data == '') {
              this.lqjbxxTableData = [];
            } else {
              this.lqjbxxTableData = JSON.parse(res.data);
            }
          }
        }
      });
    },
    handleClick() {
      this.getPageData();
    },
    addData() {
      if (this.type == this.gpsxx) {
        this.gpsxxTitle = '新增数据';
        this.gpsxxFormFlag = true;
        this.gpsxxData.pid = undefined;
        Object.assign(this.gpsxxData, this.copyData.gpsxxData);
      } else if (this.type == this.wscl) {
        this.wsclTitle = '新增数据';
        this.wsclFormFlag = true;
        this.wsclData.pid = undefined;
        Object.assign(this.wsclData, this.copyData.wsclData);
      } else if (this.type == this.rqpjlpm) {
        this.rqpjlpmTitle = '新增数据';
        this.rqpjlpmFormFlag = true;
        this.rqpjlpmData.pid = undefined;
        Object.assign(this.rqpjlpmData, this.copyData.rqpjlpmData);
      } else if (this.type == this.lqjbxx) {
        this.lqjbxxTitle = '新增数据';
        this.lqjbxxFormFlag = true;
        this.lqjbxxData.pid = undefined;
        Object.assign(this.lqjbxxData, this.copyData.lqjbxxData);
      }
    },
    handleEdit(row) {
      if (this.type == this.gpsxx) {
        this.gpsxxTitle = '编辑数据';
        this.gpsxxFormFlag = true;
        Object.assign(this.gpsxxData, row);
      } else if (this.type == this.wscl) {
        this.wsclTitle = '编辑数据';
        this.wsclFormFlag = true;
        Object.assign(this.wsclData, row);
      } else if (this.type == this.rqpjlpm) {
        this.rqpjlpmTitle = '编辑数据';
        this.rqpjlpmFormFlag = true;
        Object.assign(this.rqpjlpmData, row);
      } else if (this.type == this.lqjbxx) {
        this.lqjbxxTitle = '编辑数据';
        this.lqjbxxFormFlag = true;
        Object.assign(this.lqjbxxData, row);
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
      if (this.type == this.gpsxx) {
        this.gpsxxFormFlag = false;
      } else if (this.type == this.wscl) {
        this.wsclFormFlag = false;
      } else if (this.type == this.rqpjlpm) {
        this.rqpjlpmFormFlag = false;
      } else if (this.type == this.lqjbxx) {
        this.lqjbxxFormFlag = false;
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