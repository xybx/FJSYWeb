<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='住宅土地出让面积价格' :name='zztdcrmj'>
      </el-tab-pane>
      <el-tab-pane label='各区县房产均价' :name='gqxfcjj'>
      </el-tab-pane>
      <el-tab-pane label='住宅销售待售面积' :name='zzxsdsmj'>
      </el-tab-pane>
      <el-tab-pane label='九市一区土地交易信息' :name='jsyqtdjyxx'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>
      <div v-if='type == gqxfcjj'>
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
              <el-input v-model='queryParam.areaName' placeholder='根据行政区名称搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>
      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if='type == gqxfcjj' type='primary' icon='el-icon-search' class='handle-del mr10'
                       @click='buttonGetPageData'>
              查询
            </el-button>
            <el-button v-if='type == zztdcrmj' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增住宅土地出让面积数据
            </el-button>
            <el-button v-if='type == gqxfcjj' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增各区县房产均价数据
            </el-button>
            <el-button v-if='type == zzxsdsmj' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增住宅销售待售面积数据
            </el-button>
            <el-button v-if='type == jsyqtdjyxx' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增九市一区土地交易信息数据
            </el-button>

            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button v-if='(type == zztdcrmj || type == zzxsdsmj) && total != 0' type='danger' icon='el-icon-delete'
                       class='handle-del mr10' @click='clearData'>
              清空数据
            </el-button>
            <el-button v-if='type == gqxfcjj && total != 0' type='danger' icon='el-icon-delete' class='handle-del mr10'
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

    <div v-if='type == zztdcrmj'>
      <el-table style='font-size: 15px' :data='zztdcrmjTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='transferArea' label='住宅土地出让面积（平方米）' align='center'></el-table-column>
        <el-table-column prop='transactionPrice' label='住宅土地成交价格（亿元）' align='center'></el-table-column>
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

    <div v-if='type == gqxfcjj'>
      <el-table style='font-size: 15px' :data='gqxfcjjTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='avgValue' label='均价(元/㎡)' align='center'></el-table-column>
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

    <div v-if='type == zzxsdsmj'>
      <el-table style='font-size: 15px' :data='zzxsdsmjTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='rentOutArea' label='住宅出租面积（平方米）' align='center'></el-table-column>
        <el-table-column prop='saleArea' label='住宅销售面积（平方米）' align='center'></el-table-column>
        <el-table-column prop='pendingSale' label='住宅待销售面积（平方米）' align='center'></el-table-column>
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

    <div v-if='type == jsyqtdjyxx'>
      <el-table style='font-size: 15px' :data='jsyqtdjyxxTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='priceSum' label='成交价格总和/亿元' align='center'></el-table-column>
        <el-table-column prop='landGranted' label='土地出让宗数' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title='zztdcrmjTitle'
               :visible.sync='zztdcrmjFormFlag'
               width='35%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='zztdcrmjDataRef' :model='zztdcrmjData' :rules='zztdcrmjDataRules' label-width='250px'>

        <el-form-item label='住宅土地出让面积（平方米）：' prop='transferArea'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='zztdcrmjData.transferArea'></el-input-number>
        </el-form-item>

        <el-form-item label='住宅土地成交价格（亿元）：' prop='transactionPrice'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='zztdcrmjData.transactionPrice'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='zztdcrmjData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='zztdcrmjData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("zztdcrmjDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='gqxfcjjTitle'
               :visible.sync='gqxfcjjFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='gqxfcjjDataRef' :model='gqxfcjjData' :rules='gqxfcjjDataRules' label-width='200px'>
        <el-form-item label='区县：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='gqxfcjjData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='均价(元/㎡)：' prop='avgValue'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='gqxfcjjData.avgValue'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='gqxfcjjData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='gqxfcjjData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("gqxfcjjDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='zzxsdsmjTitle'
               :visible.sync='zzxsdsmjFormFlag'
               width='35%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='zzxsdsmjDataRef' :model='zzxsdsmjData' :rules='zzxsdsmjDataRules' label-width='250px'>

        <el-form-item label='住宅出租面积（平方米）：' prop='rentOutArea'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='zzxsdsmjData.rentOutArea'></el-input-number>
        </el-form-item>

        <el-form-item label='住宅销售面积（平方米）：' prop='saleArea'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='zzxsdsmjData.saleArea'></el-input-number>
        </el-form-item>

        <el-form-item label='住宅待销售面积（平方米）：' prop='pendingSale'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='zzxsdsmjData.pendingSale'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='zzxsdsmjData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='zzxsdsmjData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("zzxsdsmjDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='jsyqtdjyxxTitle'
               :visible.sync='jsyqtdjyxxFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='jsyqtdjyxxDataRef' :model='jsyqtdjyxxData' :rules='jsyqtdjyxxDataRules' label-width='200px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='jsyqtdjyxxData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='成交价格总和/亿元：' prop='priceSum'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='jsyqtdjyxxData.priceSum'></el-input-number>
        </el-form-item>

        <el-form-item label='土地出让宗数：' prop='landGranted'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='jsyqtdjyxxData.landGranted'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='jsyqtdjyxxData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("jsyqtdjyxxDataRef")'>确 定</el-button>
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
  saveZztdcrmjDataApi
  , editZztdcrmjDataApi
  , delZztdcrmjDataApi
  , pageZztdcrmjDataApi
  , saveGqxfcjjDataApi
  , editGqxfcjjDataApi
  , delGqxfcjjDataApi
  , pageGqxfcjjDataApi
  , queryGqxfcjjGroupListApi
  , saveZzxsdsmjDataApi
  , editZzxsdsmjDataApi
  , delZzxsdsmjDataApi
  , pageZzxsdsmjDataApi
  , clearGqxfcjjDataApi
  , clearZzxsdsmjDataApi
  , clearZztdcrmjDataApi
} from '../api/csjs/HousingRealEstateApi';
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
  name: 'farmResource',
  data() {
    return {
      code: 'zfdc',

      type: '城市建设-住房地产-住宅土地出让面积',
      zztdcrmj: '城市建设-住房地产-住宅土地出让面积',
      gqxfcjj: '城市建设-住房地产-各区县房产均价',
      zzxsdsmj: '城市建设-住房地产-住宅销售待售面积',
      jsyqtdjyxx: '城市建设-住房地产-九市一区土地交易信息',

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

      zztdcrmjTableData: [],
      gqxfcjjTableData: [],
      zzxsdsmjTableData: [],
      jsyqtdjyxxTableData: [],

      yearList: [],
      xzqNameList: [],

      zztdcrmjData: {
        year: undefined,
        transferArea: 0,
        transactionPrice: 0,
        serial: 0
      },
      gqxfcjjData: {
        areaName: undefined,
        year: undefined,
        serial: 0,
        avgValue: 0
      },
      zzxsdsmjData: {
        year: undefined,
        serial: 0,
        rentOutArea: 0,
        saleArea: 0,
        pendingSale: 0
      },
      jsyqtdjyxxData: {
        areaName: undefined,
        serial: 0,
        priceSum: 0,
        landGranted: 0
      },

      zztdcrmjDataRules: {
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        transferArea: [{ required: true, message: '住宅土地出让面积数据不能为空', trigger: 'blur' }],
        transactionPrice: [{ required: true, message: '住宅土地成交价格数据不能为空', trigger: 'blur' }]
      },
      gqxfcjjDataRules: {
        areaName: [{ required: true, message: '区县数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        avgValue: [{ required: true, message: '均价数据不能为空', trigger: 'blur' }]
      },
      zzxsdsmjDataRules: {
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        rentOutArea: [{ required: true, message: '住宅出租面积数据不能为空', trigger: 'blur' }],
        saleArea: [{ required: true, message: '住宅销售面积数据不能为空', trigger: 'blur' }],
        pendingSale: [{ required: true, message: '住宅待销售面积数据不能为空', trigger: 'blur' }]
      },
      jsyqtdjyxxDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        priceSum: [{ required: true, message: '成交价格总和数据不能为空', trigger: 'blur' }],
        landGranted: [{ required: true, message: '土地出让面积数据不能为空', trigger: 'blur' }]
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
        areaName: undefined
      },
      total: 0,
      zztdcrmjTitle: '新增数据',
      zztdcrmjFormFlag: false,
      gqxfcjjTitle: '新增数据',
      gqxfcjjFormFlag: false,
      zzxsdsmjTitle: '新增数据',
      zzxsdsmjFormFlag: false,
      jsyqtdjyxxTitle: '新增数据',
      jsyqtdjyxxFormFlag: false,
      copyData: {
        zztdcrmjData: {
          year: undefined,
          transferArea: 0,
          transactionPrice: 0,
          serial: 0
        },
        gqxfcjjData: {
          areaName: undefined,
          year: undefined,
          serial: 0,
          avgValue: 0
        },
        zzxsdsmjData: {
          areaName: undefined,
          year: undefined,
          serial: 0,
          rentOutArea: 0,
          saleArea: 0,
          pendingSale: 0
        },
        jsyqtdjyxxData: {
          areaName: undefined,
          serial: 0,
          priceSum: 0,
          landGranted: 0
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
      };
    }
  },
  mounted() {
    this.getPageData();
    this.initYearList();
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
        this.initYearList();
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
    clearData() {
      this.$confirm('确认根据筛选条件清空全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            if (this.type == this.zztdcrmj) {
              clearZztdcrmjDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.gqxfcjj) {
              clearGqxfcjjDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.zzxsdsmj) {
              clearZzxsdsmjDataApi(this.queryParam).then(res => {
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
          if (this.type == this.zztdcrmj) {
            if (this.zztdcrmjData.pid) {
              // 更新
              editZztdcrmjDataApi(this.zztdcrmjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.zztdcrmjFormFlag = false;
                  this.getPageData();
                }
              });
            } else {
              // 新增
              saveZztdcrmjDataApi(this.zztdcrmjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.zztdcrmjFormFlag = false;
                  this.getPageData();
                }
              });
            }
          } else if (this.type == this.gqxfcjj) {
            if (this.gqxfcjjData.pid) {
              // 更新
              editGqxfcjjDataApi(this.gqxfcjjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.gqxfcjjFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveGqxfcjjDataApi(this.gqxfcjjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.gqxfcjjFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.zzxsdsmj) {
            if (this.zzxsdsmjData.pid) {
              // 更新
              editZzxsdsmjDataApi(this.zzxsdsmjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.zzxsdsmjFormFlag = false;
                  this.getPageData();
                }
              });
            } else {
              // 新增
              saveZzxsdsmjDataApi(this.zzxsdsmjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.zzxsdsmjFormFlag = false;
                  this.getPageData();
                }
              });
            }
          } else if (this.type == this.jsyqtdjyxx) {
            // 存储json数据
            let params = {
              code: this.type,
              jsonValue: JSON.stringify(this.jsyqtdjyxxData),
              type: 1
            };
            saveJsonDataApi(params).then(res => {
              if (res.code == 200) {
                this.$message.success('操作成功！');
                this.jsyqtdjyxxFormFlag = false;
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
    initYearList() {
      if (this.type == this.gqxfcjj) {
        queryGqxfcjjGroupListApi().then(res => {
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
      if (this.type == this.zztdcrmj) {
        pageZztdcrmjDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.zztdcrmjTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.gqxfcjj) {
        pageGqxfcjjDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.gqxfcjjTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.zzxsdsmj) {
        pageZzxsdsmjDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.zzxsdsmjTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.jsyqtdjyxx) {
        // json数据
        getJsonDataByCodeApi({ code: this.type }).then(res => {
          if (res.code == 200) {
            if (res.data == '') {
              this.jsyqtdjyxxTableData = [];
            } else {
              this.jsyqtdjyxxTableData = JSON.parse(res.data);
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
      this.initYearList();
    },
    addData() {
      if (this.type == this.zztdcrmj) {
        this.zztdcrmjTitle = '新增数据';
        this.zztdcrmjFormFlag = true;
        this.zztdcrmjData.pid = undefined;
        Object.assign(this.zztdcrmjData, this.copyData.zztdcrmjData);
      } else if (this.type == this.gqxfcjj) {
        this.gqxfcjjTitle = '新增数据';
        this.gqxfcjjFormFlag = true;
        this.gqxfcjjData.pid = undefined;
        Object.assign(this.gqxfcjjData, this.copyData.gqxfcjjData);
      } else if (this.type == this.jsyqtdjyxx) {
        this.jsyqtdjyxxTitle = '新增数据';
        this.jsyqtdjyxxFormFlag = true;
        this.jsyqtdjyxxData.pid = undefined;
        Object.assign(this.jsyqtdjyxxData, this.copyData.jsyqtdjyxxData);
      } else if (this.type == this.zzxsdsmj) {
        this.zzxsdsmjFormFlag = true;
        this.zzxsdsmjTitle = '新增数据';
        this.zzxsdsmjData.pid = undefined;
        Object.assign(this.zzxsdsmjData, this.copyData.zzxsdsmjData);
      }
    },
    handleEdit(row) {
      if (this.type == this.zztdcrmj) {
        this.zztdcrmjTitle = '编辑数据';
        this.zztdcrmjFormFlag = true;
        Object.assign(this.zztdcrmjData, row);
      } else if (this.type == this.gqxfcjj) {
        this.gqxfcjjTitle = '编辑数据';
        this.gqxfcjjFormFlag = true;
        Object.assign(this.gqxfcjjData, row);
      } else if (this.type == this.jsyqtdjyxx) {
        this.jsyqtdjyxxTitle = '编辑数据';
        this.jsyqtdjyxxFormFlag = true;
        Object.assign(this.jsyqtdjyxxData, row);
      } else if (this.type == this.zzxsdsmj) {
        this.zzxsdsmjFormFlag = true;
        this.zzxsdsmjTitle = '编辑数据';
        Object.assign(this.zzxsdsmjData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.zztdcrmj) {
          delZztdcrmjDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
            }
          });
        } else if (this.type == this.gqxfcjj) {
          delGqxfcjjDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.zzxsdsmj) {
          delZzxsdsmjDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
            }
          });
        } else if (this.type == this.jsyqtdjyxx) {
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
      if (this.type == this.zztdcrmj) {
        this.zztdcrmjFormFlag = false;
      } else if (this.type == this.gqxfcjj) {
        this.gqxfcjjFormFlag = false;
      } else if (this.type == this.jsyqtdjyxx) {
        this.jsyqtdjyxxFormFlag = false;
      } else if (this.type == this.zzxsdsmj) {
        this.zzxsdsmjFormFlag = false;
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