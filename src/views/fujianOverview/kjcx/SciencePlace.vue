<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='九市一区科研单位' :name='jsyqkydw'>
      </el-tab-pane>
      <el-tab-pane label='高新企业' :name='gxqy'>
      </el-tab-pane>
      <el-tab-pane label='九市一区高校' :name='jsyqgx'>
      </el-tab-pane>
      <el-tab-pane label='上市企业信息' :name='ssqyxx'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>
      <div v-if='type == jsyqkydw'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.areaName' clearable placeholder='请选择所在地数据'>
            <el-option
                v-for='(item, index) in cityList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keyWord' placeholder='根据科研机构名称模糊搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>

      <div v-if='type == ssqyxx'>
        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input style='width: 300px' v-model='queryParam.keyWord' placeholder='根据公司名称、所属行业、法定代表人搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>
      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if='type == jsyqkydw || type == ssqyxx' type='primary' icon='el-icon-search'
                       class='handle-del mr10' @click='buttonGetPageData'>
              查询
            </el-button>
            <el-button v-if='type == jsyqkydw' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增九市一区科研单位数据
            </el-button>
            <el-button v-if='type == gxqy' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增高新企业数据
            </el-button>
            <el-button v-if='type == jsyqgx' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增九市一区高校数据
            </el-button>
            <el-button v-if='type == ssqyxx' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增上市企业信息数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button v-if='(type == jsyqkydw || type == ssqyxx) && total != 0' type='danger' icon='el-icon-delete'
                       class='handle-del mr10' @click='clearData'>
              根据筛选条件清空数据
            </el-button>
            <el-button type='primary' icon='el-icon-s-tools' class='handle-del mr10' @click='addBaseMap'>
              底图数据配置
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <div v-if='type == jsyqkydw'>
      <el-table style='font-size: 15px' :data='jsyqkydwTableData' bojsyqkydwer class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='name' label='科研机构单位' align='center'></el-table-column>
        <el-table-column prop='areaName' label='所在地' align='center'></el-table-column>
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

    <div v-if='type == gxqy'>
      <el-table style='font-size: 15px' :data='gxqyTableData' bojsyqkydwer class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='value' label='高新企业数量' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == jsyqgx'>
      <el-table style='font-size: 15px' :data='jsyqgxTableData' bojsyqkydwer class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='value' label='高等院校数量/个' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == ssqyxx'>
      <el-table style='font-size: 15px' :data='ssqyxxTableData' bojsyqkydwer class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='code' label='股票代码' align='center'></el-table-column>
        <el-table-column prop='name' label='公司全称' align='center'></el-table-column>
        <el-table-column prop='year' label='成立时间' align='center'></el-table-column>
        <el-table-column prop='industry' label='所属行业' align='center'></el-table-column>
        <el-table-column prop='legalPerson' label='法定代表人' align='center'></el-table-column>
        <el-table-column prop='capital' label='注册资本（万元）' align='center'></el-table-column>
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

    <el-dialog :title='jsyqkydwTitle'
               :visible.sync='jsyqkydwFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='jsyqkydwDataRef' :model='jsyqkydwData' :rules='jsyqkydwDataRules' label-width='200px'>

        <el-form-item label='科研机构名单：' prop='name'>
          <el-input class='fjjdhl-input-width' v-model.trim='jsyqkydwData.name'></el-input>
        </el-form-item>

        <el-form-item label='所在地：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='jsyqkydwData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='jsyqkydwData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("jsyqkydwDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='gxqyTitle'
               :visible.sync='gxqyFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='gxqyDataRef' :model='gxqyData' :rules='gxqyDataRules' label-width='150px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='gxqyData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='高新企业数量：' prop='carbonValue'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='gxqyData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='gxqyData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("gxqyDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='jsyqgxTitle'
               :visible.sync='jsyqgxFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='jsyqgxDataRef' :model='jsyqgxData' :rules='jsyqgxDataRules' label-width='200px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='jsyqgxData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='高等院校数量/个：' prop='value'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='jsyqgxData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='jsyqgxData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("jsyqgxDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='ssqyxxTitle'
               :visible.sync='ssqyxxFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='ssqyxxDataRef' :model='ssqyxxData' :rules='ssqyxxDataRules' label-width='200px'>

        <el-form-item label='股票代码：' prop='code'>
          <el-input class='fjjdhl-input-width' v-model.trim='ssqyxxData.code'></el-input>
        </el-form-item>

        <el-form-item label='公司全称：' prop='name'>
          <el-input class='fjjdhl-input-width' v-model.trim='ssqyxxData.name'></el-input>
        </el-form-item>

        <el-form-item label='成立时间：' prop='year'>
          <el-input class='fjjdhl-input-width' v-model.trim='ssqyxxData.year'></el-input>
        </el-form-item>

        <el-form-item label='所属行业：' prop='industry'>
          <el-input class='fjjdhl-input-width' v-model.trim='ssqyxxData.industry'></el-input>
        </el-form-item>

        <el-form-item label='法定代表人：' prop='legalPerson'>
          <el-input class='fjjdhl-input-width' v-model='ssqyxxData.legalPerson'></el-input>
        </el-form-item>

        <el-form-item label='注册资本（万元）：' prop='capital'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='ssqyxxData.capital'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='ssqyxxData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("ssqyxxDataRef")'>确 定</el-button>
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
  saveJsyqkydwDataApi
  , editJsyqkydwDataApi
  , delJsyqkydwDataApi
  , pageJsyqkydwDataApi
  , queryJsyqkydwGroupListApi
  , saveSsqyxxDataApi
  , editSsqyxxDataApi
  , delSsqyxxDataApi
  , pageSsqyxxDataApi
  , clearJsyqkydwzlDataApi
  , clearSsqyxxDataApi
} from '../api/kjcx/SciencePlaceApi';
import {
  getJsonDataByCodeApi
  ,
  saveJsonDataApi
  ,
  delJsonDataApi
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

export default {
  name: 'sciencePlace',
  data() {
    return {
      code: 'kycs',
      type: '科技创新-科研场所-九市一区科研单位',
      jsyqkydw: '科技创新-科研场所-九市一区科研单位',
      gxqy: '科技创新-科研场所-高新企业',
      jsyqgx: '科技创新-科研场所-九市一区高校',
      ssqyxx: '科技创新-科研场所-上市企业信息',

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

      jsyqkydwTableData: [],
      jsyqgxTableData: [],
      gxqyTableData: [],
      ssqyxxTableData: [],

      cityList: [],
      xzqNameList: [],

      jsyqkydwData: {
        serial: 0,
        name: undefined,
        areaName: undefined
      },
      gxqyData: {
        serial: 0,
        areaName: undefined,
        value: 0
      },
      jsyqgxData: {
        serial: 0,
        areaName: undefined,
        value: 0
      },
      ssqyxxData: {
        code: undefined,
        serial: 0,
        name: undefined,
        year: undefined,
        industry: undefined,
        legalPerson: undefined,
        capital: 0
      },
      jsyqkydwDataRules: {
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '科研机构名称数据不能为空', trigger: 'blur' }],
        areaName: [{ required: true, message: '所在地数据不能为空', trigger: 'blur' }]
      },
      gxqyDataRules: {
        areaName: [{ required: true, message: '城市数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        carbonValue: [{ required: true, message: '高新企业数量数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '高新企业数量数据不能为空', trigger: 'blur' }]
      },
      jsyqgxDataRules: {
        areaName: [{ required: true, message: '城市数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '高等院校数量不能为空', trigger: 'blur' }]
      },
      ssqyxxDataRules: {
        code: [{ required: true, message: '股票代码数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '成立时间数据不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '公司全称数据不能为空', trigger: 'blur' }],
        industry: [{ required: true, message: '所属行业数据不能为空', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '法定代表人数据不能为空', trigger: 'blur' }],
        capital: [{ required: true, message: '注册资本数据不能为空', trigger: 'blur' }]
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }]
      },
      queryParam: {
        page: 1,
        pageSize: 10,
        year: undefined,
        areaName: undefined,
        keyWord: undefined
      },
      total: 0,
      jsyqkydwTitle: '新增数据',
      jsyqkydwFormFlag: false,
      jsyqgxTitle: '新增数据',
      jsyqgxFormFlag: false,
      gxqyTitle: '新增数据',
      gxqyFormFlag: false,
      ssqyxxTitle: '新增数据',
      ssqyxxFormFlag: false,
      copyData: {
        jsyqkydwData: {
          serial: 0,
          name: undefined,
          areaName: undefined
        },
        gxqyData: {
          serial: 0,
          areaName: undefined,
          value: 0
        },
        jsyqgxData: {
          serial: 0,
          areaName: undefined,
          value: 0
        },
        ssqyxxData: {
          code: undefined,
          serial: 0,
          name: undefined,
          year: undefined,
          industry: undefined,
          legalPerson: undefined,
          capital: 0
        },
        queryParam: {
          page: 1,
          pageSize: 10,
          year: undefined,
          areaName: undefined,
          keyWord: undefined
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
    this.initCityList();
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
        this.initCityList();
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
              this.initCityList();
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
              this.initCityList();
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
    clearData() {
      this.$confirm('确认根据筛选条件清空全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            if (this.type == this.jsyqkydw) {
              clearJsyqkydwzlDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initCityList();
                }
              });
            } else if (this.type == this.ssqyxx) {
              clearSsqyxxDataApi(this.queryParam).then(res => {
                if (res.code == 200) {

                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
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
          if (this.type == this.jsyqkydw) {
            if (this.jsyqkydwData.pid) {
              // 更新
              editJsyqkydwDataApi(this.jsyqkydwData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.jsyqkydwFormFlag = false;
                  this.getPageData();
                  this.initCityList();
                }
              });
            } else {
              // 新增
              saveJsyqkydwDataApi(this.jsyqkydwData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.jsyqkydwFormFlag = false;
                  this.getPageData();
                  this.initCityList();
                }
              });
            }
          } else if (this.type == this.ssqyxx) {
            if (this.ssqyxxData.pid) {
              // 更新
              editSsqyxxDataApi(this.ssqyxxData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.ssqyxxFormFlag = false;
                  this.getPageData();
                }
              });
            } else {
              // 新增
              saveSsqyxxDataApi(this.ssqyxxData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.ssqyxxFormFlag = false;
                  this.getPageData();
                }
              });
            }
          } else {
            // 存储json数据
            let params = {
              code: this.type,
              jsonValue: undefined,
              type: 1
            };
            if (this.type == this.gxqy) {
              params.jsonValue = JSON.stringify(this.gxqyData);
            } else if (this.type == this.jsyqgx) {
              params.jsonValue = JSON.stringify(this.jsyqgxData);
            }
            saveJsonDataApi(params).then(res => {
              if (res.code == 200) {
                this.$message.success('操作成功！');
                this.gxqyFormFlag = false;
                this.jsyqgxFormFlag = false;
                this.getPageData();
              } else {
                return false;
              }
            });
          }
        } else {
          this.$message.error('请补充必填项');
          return false;
        }
      });
    },
    initCityList() {
      if (this.type == this.jsyqkydw) {
        queryJsyqkydwGroupListApi().then(res => {
          if (res.code == 200) {
            this.cityList = res.data;
          }
        });
      }
    },
    buttonGetPageData() {
      this.queryParam.page = 1;
      this.getPageData();
    },
    getPageData() {
      if (this.type == this.jsyqkydw) {
        pageJsyqkydwDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.jsyqkydwTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.ssqyxx == this.type) {
        pageSsqyxxDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.ssqyxxTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else {
        getJsonDataByCodeApi({ code: this.type }).then(res => {
          if (this.type == this.gxqy) {
            if (res.data == '') {
              this.gxqyTableData = [];
            } else {
              this.gxqyTableData = JSON.parse(res.data);
            }
          } else {
            if (res.data == '') {
              this.jsyqgxTableData = [];
            } else {
              this.jsyqgxTableData = JSON.parse(res.data);
            }
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
    },
    addData() {
      if (this.type == this.jsyqkydw) {
        this.jsyqkydwTitle = '新增数据';
        this.jsyqkydwFormFlag = true;
        this.jsyqkydwData.pid = undefined;
        Object.assign(this.jsyqkydwData, this.copyData.jsyqkydwData);
      } else if (this.type == this.gxqy) {
        this.gxqyTitle = '新增数据';
        this.gxqyFormFlag = true;
        this.gxqyData.pid = undefined;
        Object.assign(this.gxqyData, this.copyData.gxqyData);
      } else if (this.type == this.jsyqgx) {
        this.jsyqgxTitle = '新增数据';
        this.jsyqgxFormFlag = true;
        this.jsyqgxData.pid = undefined;
        Object.assign(this.jsyqgxData, this.copyData.jsyqgxData);
      } else if (this.type == this.ssqyxx) {
        this.ssqyxxTitle = '新增数据';
        this.ssqyxxFormFlag = true;
        this.ssqyxxData.pid = undefined;
        Object.assign(this.ssqyxxData, this.copyData.ssqyxxData);
      }
    },
    handleEdit(row) {
      if (this.type == this.jsyqkydw) {
        this.jsyqkydwTitle = '编辑数据';
        this.jsyqkydwFormFlag = true;
        Object.assign(this.jsyqkydwData, row);
      } else if (this.type == this.gxqy) {
        this.gxqyTitle = '编辑数据';
        this.gxqyFormFlag = true;
        Object.assign(this.gxqyData, row);
      } else if (this.type == this.jsyqgx) {
        this.jsyqgxTitle = '编辑数据';
        this.jsyqgxFormFlag = true;
        Object.assign(this.jsyqgxData, row);
      } else if (this.type == this.ssqyxx) {
        this.ssqyxxTitle = '编辑数据';
        this.ssqyxxFormFlag = true;
        Object.assign(this.ssqyxxData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.jsyqkydw) {
          delJsyqkydwDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initCityList();
            }
          });
        } else if (this.type == this.ssqyxx) {
          delSsqyxxDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
            }
          });
        } else {
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
        }
      }).catch(_ => {

      });
    },
    handleClose() {
      if (this.type == this.jsyqkydw) {
        this.jsyqkydwFormFlag = false;
      } else if (this.type == this.ssqyxx) {
        this.ssqyxxFormFlag = false;
      } else {
        this.gxqyFormFlag = false;
        this.jsyqgxFormFlag = false;
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
  bojsyqkydwer-radius: 4px;
}

.background {
  background-color: white;
}

.el-cascader {
  width: 350px;
}
</style>