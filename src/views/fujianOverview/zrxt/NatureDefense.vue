<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='国家公园' :name='gjgy'>
      </el-tab-pane>
      <el-tab-pane label='自然保护区' :name='zrbhq'>
      </el-tab-pane>
      <el-tab-pane label='自然公园' :name='zrgy'>
      </el-tab-pane>
      <el-tab-pane label='全省珍稀动植物栖息地' :name='qszxdzwqxd'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>

      <div v-if='type == zrbhq'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.type' clearable placeholder='请选择保护区类型'>
            <el-option
                v-for='(item, index) in zrbhqTypeList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.areaName' placeholder='根据保护区名称进行模糊搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>

      <div v-if='type == zrgy'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.type' clearable placeholder='请选择公园类型'>
            <el-option
                v-for='(item, index) in zrgyTypeList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.areaName' placeholder='根据公园名称进行模糊搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>

      <div v-if='type == qszxdzwqxd'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.areaName' clearable placeholder='请选择地市'>
            <el-option
                v-for='(item, index) in qszxdzwqxdXzqList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.type' placeholder='根据名称、保护种类进行模糊搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>

      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if='type != gjgy' type='primary' icon='el-icon-search' class='handle-del mr10'
                       @click='buttonGetPageData'>
              查询
            </el-button>

            <el-button v-if='type == zrbhq' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增自然保护区数据
            </el-button>
            <el-button v-if='type == zrgy' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增自然公园数据
            </el-button>
            <el-button v-if='type == qszxdzwqxd' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增全省珍稀动植物栖息地数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button v-if='type != gjgy && total != 0' type='danger' icon='el-icon-delete' class='handle-del mr10'
                       @click='clearData'>
              根据筛选条件清空数据
            </el-button>
            <el-button type='primary' icon='el-icon-s-tools' class='handle-del mr10' @click='addBaseMap'>
              底图数据配置
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <div v-if='type == gjgy' class='first-div'>
      <el-form :model='gjgyData' ref='gjgyDataRef' :rules='gjgyDataRule' label-width='100px'>

        <el-form-item label='背景图片：' prop='bgImg'>
          <el-upload ref='addUpload' :action='uploadUrl' list-type='picture-card' :file-list='gjgyFileList'
                     :auto-upload='true'
                     :limit='9' :on-success='handleSuccess' :on-preview='handlePictureCardPreview'
                     :on-remove='handleRemove' :headers='headers' :on-exceed='beforeAddIcon' accept='.jpg,.png'>
            <i slot='default' class='el-icon-plus'></i>
          </el-upload>
        </el-form-item>

        <el-form-item label='描述：' prop='description'>
          <el-input style='width: 500px' type='textarea' class='fjjdhl-input-width' :rows='9'
                    v-model='gjgyData.description'></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type='primary' @click="submitJson('gjgyDataRef')">确 定</el-button>
        </el-form-item>
      </el-form>

      <el-dialog :visible.sync='dialogVisible'>
        <img width='100%' :src='dialogImageUrl' alt=''>
      </el-dialog>
    </div>

    <div v-if='type == zrbhq' class='first-div'>
      <el-table style='font-size: 15px' :data='zrbhqTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='name' label='保护区名称' align='center'></el-table-column>
        <el-table-column prop='type' label='保护区类型' align='center'></el-table-column>
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

    <div v-if='type == zrgy' class='first-div'>
      <el-table style='font-size: 15px' :data='zrgyTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='name' label='公园名称' align='center'></el-table-column>
        <el-table-column prop='type' label='公园类型' align='center'></el-table-column>
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

    <div v-if='type == qszxdzwqxd' class='first-div'>
      <el-table style='font-size: 15px' :data='qszxdzwqxdTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='name' label='栖息地名称' align='center'></el-table-column>
        <el-table-column prop='protectionType' label='保护种类' align='center'></el-table-column>
        <el-table-column prop='areaName' label='地市' align='center'></el-table-column>
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


    <el-dialog :title='zrbhqTitle'
               :visible.sync='zrbhqFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='zrbhqDataRef' :model='zrbhqData' :rules='zrbhqDataRules' label-width='150px'>
        <el-form-item label='保护区名称：' prop='name'>
          <el-input class='fjjdhl-dialog-input-width' v-model.trim='zrbhqData.name'></el-input>
        </el-form-item>

        <el-form-item label='保护区类型：' prop='type'>
          <el-select class='fjjdhl-dialog-input-width' v-model='zrbhqData.type' placeholder='请选择保护区类型'>
            <el-option
                v-for='(item, index) in zrbhqTypeList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-dialog-input-width' :min='0'
                           v-model.number='zrbhqData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("zrbhqDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='zrgyTitle'
               :visible.sync='zrgyFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='zrgyDataRef' :model='zrgyData' :rules='zrgyDataRules' label-width='150px'>
        <el-form-item label='公园名称：' prop='name'>
          <el-input class='fjjdhl-dialog-input-width' v-model.trim='zrgyData.name'></el-input>
        </el-form-item>

        <el-form-item label='公园类型：' prop='type'>
          <el-select class='fjjdhl-dialog-input-width' v-model='zrgyData.type' placeholder='请选择公园类型'>
            <el-option
                v-for='(item, index) in zrgyTypeList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-dialog-input-width' :min='0'
                           v-model.number='zrgyData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("zrgyDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='qszxdzwqxdTitle'
               :visible.sync='qszxdzwqxdFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='qszxdzwqxdDataRef' :model='qszxdzwqxdData' :rules='qszxdzwqxdDataRules' label-width='150px'>
        <el-form-item label='名称：' prop='name'>
          <el-input class='fjjdhl-dialog-input-width' v-model.trim='qszxdzwqxdData.name'></el-input>
        </el-form-item>

        <el-form-item label='保护种类：' prop='protectionType'>
          <el-input class='fjjdhl-dialog-input-width' v-model.trim='qszxdzwqxdData.protectionType'></el-input>
        </el-form-item>

        <el-form-item label='所属地市：' prop='areaName'>
          <el-select class='fjjdhl-dialog-input-width' v-model='qszxdzwqxdData.areaName' placeholder='请选择地市'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-dialog-input-width' :min='0'
                           v-model.number='qszxdzwqxdData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("qszxdzwqxdDataRef")'>确 定</el-button>
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
          <el-input style='width: 200px' v-model.trim='baseMapForm.name'></el-input>
        </el-form-item>

        <el-form-item label='底图地址：' prop='url'>
          <el-input style='width: 200px' v-model.trim='baseMapForm.url'></el-input>
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
  getJsonDataByCodeApi
  ,
  saveJsonDataApi
  ,
  getDictByCodeApi,
  exportExcel,
  getImportUrl,
  saveBaseMapApi,
  getBaseMapListApi,
  delBaseMapApi,
  editBaseMapApi,
  getServerTypeApi, choseImportMode
} from '@/views/fujianOverview/api/FjoPublicApi';
import {
  delBgImgApi
  , listBgImgApi
  , getUploadUrl
  , saveZrbhqDataApi
  , editZrbhqDataApi
  , delZrbhqDataApi
  , pageZrbhqDataApi
  , saveZrgyDataApi
  , editZrgyDataApi
  , delZrgyDataApi
  , pageZrgyDataApi
  , saveQszxdzwqxdDataApi
  , editQszxdzwqxdDataApi
  , delQszxdzwqxdDataApi
  , pageQszxdzwqxdDataApi
  , queryQszxdzwqxdGroupList
  , clearZrbhqDataApi
  , clearZrgyDataApi
  , clearQszxdzwqxdDataApi
} from '@/views/fujianOverview/api/zrxt/NatrueDefenseApi';

export default {
  name: 'natureDefense',
  data() {
    return {
      code: 'zrbh',
      type: '自然系统-自然保护-国家公园',
      gjgy: '自然系统-自然保护-国家公园',
      zrbhq: '自然系统-自然保护-自然保护区',
      zrgy: '自然系统-自然保护-自然公园',
      qszxdzwqxd: '自然系统-自然保护-全省珍稀动植物栖息地',

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

      queryParam: {
        page: 1,
        pageSize: 10,
        year: undefined,
        type: undefined,
        areaName: undefined
      },
      total: 0,
      zrbhqTitle: '新增数据',
      zrbhqFormFlag: false,
      zrgyTitle: '新增数据',
      zrgyFormFlag: false,
      qszxdzwqxdTitle: '新增数据',
      qszxdzwqxdFormFlag: false,

      zrbhqTableData: [],
      zrgyTableData: [],
      qszxdzwqxdTableData: [],
      typeList: [],
      xzqNameList: [],
      qszxdzwqxdXzqList: [],
      zrbhqTypeList: [
        {
          name: '自然保护区'
        },
        {
          name: '海洋自然保护区'
        },
        {
          name: '水利自然保护区'
        }
      ],
      zrgyTypeList: [
        {
          name: '森林公园'
        },
        {
          name: '湿地公园'
        },
        {
          name: '地质公园'
        },
        {
          name: '海洋公园'
        }
      ],
      gjgyFileList: [],
      uploadUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      gjgyData: {
        description: undefined
      },
      gjgyDataRule: {
        description: [{ required: true, message: '描述数据不能为空', trigger: 'blur' }]
      },
      zrbhqData: {
        serial: 0,
        name: undefined,
        type: undefined
      },
      zrbhqDataRules: {
        serial: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '保护区名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '保护区类型不能为空', trigger: 'change' }]
      },
      zrgyData: {
        serial: 0,
        name: undefined,
        type: undefined
      },
      zrgyDataRules: {
        serial: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '公园名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '公园类型不能为空', trigger: 'change' }]
      },
      qszxdzwqxdData: {
        serial: 0,
        name: undefined,
        protectionType: undefined,
        areaName: undefined
      },
      qszxdzwqxdDataRules: {
        serial: [{ required: true, message: '序号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        protectionType: [{ required: true, message: '保护种类不能为空', trigger: 'blur' }],
        areaName: [{ required: true, message: '所属地市不能为空', trigger: 'change' }]
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }]
      },
      dataCopy: {
        gjgyData: {
          description: undefined
        },
        zrbhqData: {
          serial: 0,
          name: undefined,
          type: undefined
        },
        zrgyData: {
          serial: 0,
          name: undefined,
          type: undefined
        },
        qszxdzwqxdData: {
          serial: 0,
          name: undefined,
          protectionType: undefined,
          areaName: undefined
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
    this.initUploadUrl();
    this.initData();
    this.initBgImg();
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
        this.initUploadUrl();
        this.initData();
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
              this.initUploadUrl();
              this.initData();
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
              this.initUploadUrl();
              this.initData();
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
    clearData() {
      this.$confirm('确认根据筛选条件清空全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            if (this.type == this.zrbhq) {
              clearZrbhqDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.dataCopy.queryParam);
                  this.getPageData();
                }
              });
            } else if (this.type == this.zrgy) {
              clearZrgyDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.dataCopy.queryParam);
                  this.getPageData();
                }
              });
            } else if (this.type == this.qszxdzwqxd) {
              clearQszxdzwqxdDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.dataCopy.queryParam);
                  this.initQueryList();
                  this.getPageData();
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
          if (this.type == this.zrbhq) {
            if (this.zrbhqData.pid) {
              // 更新
              editZrbhqDataApi(this.zrbhqData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.zrbhqFormFlag = false;
                  this.getPageData();
                }
              });
            } else {
              // 新增
              saveZrbhqDataApi(this.zrbhqData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.zrbhqFormFlag = false;
                  this.getPageData();
                }
              });
            }
          } else if (this.type == this.zrgy) {
            if (this.zrgyData.pid) {
              // 更新
              editZrgyDataApi(this.zrgyData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.zrgyFormFlag = false;
                  this.getPageData();
                  // this.initYearList();
                }
              });
            } else {
              // 新增
              saveZrgyDataApi(this.zrgyData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.zrgyFormFlag = false;
                  this.getPageData();
                  // this.initYearList();
                }
              });
            }
          } else if (this.type == this.qszxdzwqxd) {
            if (this.qszxdzwqxdData.pid) {
              // 更新
              editQszxdzwqxdDataApi(this.qszxdzwqxdData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.qszxdzwqxdFormFlag = false;
                  this.getPageData();
                  this.initQueryList();
                }
              });
            } else {
              // 新增
              saveQszxdzwqxdDataApi(this.qszxdzwqxdData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.qszxdzwqxdFormFlag = false;
                  this.getPageData();
                  this.initQueryList();
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
    initXzqNameList() {
      getDictByCodeApi({ code: 'xzq' }).then(res => {
        if (res.code == 200) {
          this.xzqNameList = res.data;
          this.xzqNameList = this.xzqNameList.sort((a, b) => a.pid - b.pid);
        }
      });
    },
    submitJson(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 存储json数据
          let params = {
            code: this.type,
            jsonValue: JSON.stringify(this.gjgyData),
            type: 0
          };
          saveJsonDataApi(params).then(res => {
            if (res.code == 200) {
              this.$message.success('操作成功！');
              this.initData();
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
    initQueryList() {
      queryQszxdzwqxdGroupList().then(res => {
        if (res.code == 200) {
          this.qszxdzwqxdXzqList = res.data;
        }
      });
    },
    handleClick() {
      this.initData();
      this.initBgImg();
      this.total = 0;
      if (this.type == this.qszxdzwqxd) {
        this.initQueryList();
      }
      Object.assign(this.queryParam, this.dataCopy.queryParam);
    },
    addData() {
      if (this.type == this.zrbhq) {
        this.zrbhqFormFlag = true;
        this.zrbhqTitle = '新增数据';
        Object.assign(this.zrbhqData, this.dataCopy.zrbhqData);
      } else if (this.type == this.zrgy) {
        this.zrgyFormFlag = true;
        this.zrgyTitle = '新增数据';
        Object.assign(this.zrgyData, this.dataCopy.zrgyData);
      } else if (this.type == this.qszxdzwqxd) {
        this.qszxdzwqxdFormFlag = true;
        this.qszxdzwqxdTitle = '新增数据';
        Object.assign(this.qszxdzwqxdData, this.dataCopy.qszxdzwqxdData);
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
    handleEdit(row) {
      if (this.type == this.zrbhq) {
        this.zrbhqTitle = '编辑数据';
        this.zrbhqFormFlag = true;
        Object.assign(this.zrbhqData, row);
      } else if (this.type == this.zrgy) {
        this.zrgyTitle = '编辑数据';
        this.zrgyFormFlag = true;
        Object.assign(this.zrgyData, row);
      } else if (this.type == this.qszxdzwqxd) {
        this.qszxdzwqxdTitle = '编辑数据';
        this.qszxdzwqxdFormFlag = true;
        Object.assign(this.qszxdzwqxdData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.zrbhq) {
          delZrbhqDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
            }
          });
        } else if (this.type == this.zrgy) {
          delZrgyDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
            }
          });
        } else if (this.type == this.qszxdzwqxd) {
          delQszxdzwqxdDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initQueryList();
            }
          });
        }
      }).catch(_ => {

      });
    },
    handleClose() {
      if (this.type == this.zrbhq) {
        this.zrbhqData.pid = undefined;
        this.zrbhqFormFlag = false;
      } else if (this.type == this.zrgy) {
        this.zrgyFormFlag = false;
        this.zrgyData.pid = undefined;
      } else if (this.type == this.qszxdzwqxd) {
        this.qszxdzwqxdFormFlag = false;
        this.qszxdzwqxdData.pid = undefined;
      }
    },
    initParams() {

    },
    initUploadUrl() {
      this.uploadUrl = getUploadUrl();
    },
    buttonGetPageData() {
      this.queryParam.page = 1;
      this.getPageData();
    },
    getPageData() {
      if (this.type == this.zrbhq) {
        pageZrbhqDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.zrbhqTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.zrgy) {
        pageZrgyDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.zrgyTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.qszxdzwqxd) {
        pageQszxdzwqxdDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.qszxdzwqxdTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      }
    },
    initBgImg() {
      if (this.type == this.gjgy) {
        // 初始化背景图片与json数据
        listBgImgApi().then(res => {
          if (res.code == 200) {
            if (res.data.length > 0) {
              if (this.gjgyFileList.length == 0) {
                for (let i = 0; i < res.data.length; i++) {
                  let file = {
                    name: res.data[i].name,
                    url: window.resourceUrl + res.data[i].url,
                    pid: res.data[i].pid
                  };
                  this.gjgyFileList.push(file);
                }
              }
            }
          }
        });
      }
    },
    initData() {
      if (this.type == this.gjgy) {
        // json数据
        getJsonDataByCodeApi({ code: this.type }).then(res => {
          if (res.code == 200) {
            if (res.data == '') {
              Object.assign(this.gjgyData, this.dataCopy.gjgyData);
            } else {
              this.gjgyData = JSON.parse(res.data);
            }
          }
        });
      } else {
        this.getPageData();
      }

    },
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.$message.success('上传成功！');
        let letFile = {
          name: response.data.name,
          url: window.resourceUrl + response.data.url,
          pid: response.data.pid
        };
        this.gjgyFileList.push(letFile);
      } else {
        this.$message.error(response.msg);
      }
    },
    beforeAddIcon(files, fileList) {
      if (this.gjgyFileList.length >= 9) {
        this.$message.warning(`当前限制上传 9 个背景图，请先移除后上传`);
      }
    },
    handleRemove(file, fileList) {
      delBgImgApi(file.pid).then(res => {
        if (res.code == 200) {
          this.$message.success('删除成功！');
          let index = -1;
          for (let i = 0; i < this.gjgyFileList.length; i++) {
            if (file.pid == this.gjgyFileList[i].pid) {
              index = i;
              break;
            }
          }
          this.gjgyFileList.splice(index, 1);
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>
<style>
.first-div {
  margin-top: 20px;
}


.input-width {
  width: 200px;
}

.fjjdhl-input-width {
  width: 500px;
}

.fjjdhl-dialog-input-width {
  width: 250px;
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