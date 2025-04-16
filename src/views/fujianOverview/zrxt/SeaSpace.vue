<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='九市一区海域面积' :name='jsyqhymj'>
      </el-tab-pane>
      <el-tab-pane label='海洋生产总值' :name='hysczz'>
      </el-tab-pane>
      <el-tab-pane label='海水产品产量及海水养殖产量' :name='hscpcl'>
      </el-tab-pane>
      <el-tab-pane label='福建海水产品产量' :name='fjhscpcl'>
      </el-tab-pane>
      <el-tab-pane label='福建省沿海港口货物吞吐量' :name='hwttl'>
      </el-tab-pane>
      <el-tab-pane label='数据注释信息' :name='remark'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>

      <div v-if='type == hscpcl || type == hwttl'>
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

      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if='type == hscpcl || type == hwttl' type='primary' icon='el-icon-search'
                       class='handle-del mr10'
                       @click='buttonGetPageData'>
              查询
            </el-button>
            <el-button v-if='type == jsyqhymj' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增九市一区海域面积数据
            </el-button>
            <el-button v-if='type == hysczz' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增海洋生产总值数据
            </el-button>
            <el-button v-if='type == hscpcl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增海水产品产量数据
            </el-button>
            <el-button v-if='type == fjhscpcl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增福建海水产品产量数据
            </el-button>
            <el-button v-if='type == hwttl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增福建省沿海港口货物吞吐量数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>

            <el-button v-if='(type == hscpcl || type == hwttl) && total != 0' type='danger' icon='el-icon-delete' class='handle-del mr10'
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

    <div v-if='type == jsyqhymj'>
      <el-table style='font-size: 15px' :data='jsyqhymjTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='海域名称' align='center'></el-table-column>
        <el-table-column prop='area' label='面积（平方千米）' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == hysczz'>
      <el-form :model='hysczzData' ref='hysczzDataRef' :rules='hysczzDataRules' label-width='300px'>
        <el-form-item label='海洋生产总值（亿元）：' prop='productionTotal'>
          <el-input-number class='input-width' :min='0' v-model.number='hysczzData.productionTotal'></el-input-number>
        </el-form-item>
        <el-form-item label='第一产业（亿元）：' prop='firstEstate'>
          <el-input-number class='input-width' :min='0' v-model.number='hysczzData.firstEstate'></el-input-number>
        </el-form-item>
        <el-form-item label='第二产业（亿元）：' prop='secondEstate'>
          <el-input-number class='input-width' :min='0' v-model.number='hysczzData.secondEstate'></el-input-number>
        </el-form-item>
        <el-form-item label='第三产业（亿元）：' prop='thirdEstate'>
          <el-input-number class='input-width' :min='0' v-model.number='hysczzData.thirdEstate'></el-input-number>
        </el-form-item>
        <el-form-item label='海洋生产总值占地区生产总值比重（%）：' prop='productionPercent'>
          <el-input-number class='input-width' :min='0' v-model.number='hysczzData.productionPercent'></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type='primary' @click="submit('hysczzDataRef')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if='type == hscpcl'>
      <el-table style='font-size: 15px' :data='hscpclTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='firstType' label='一级类型' align='center'></el-table-column>
        <el-table-column prop='secondType' label='二级类型' align='center'></el-table-column>
        <el-table-column prop='value' label='产量（吨）' align='center'></el-table-column>
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

    <div v-if='type == fjhscpcl'>
      <el-form :model='fjhscpclData' ref='fjhysczzDataRef' :rules='fjhscpclDataRules' label-width='200px'>
        <el-form-item label='海水养殖产量（吨）：' prop='cultureValue'>
          <el-input-number class='input-width' :min='0' v-model.number='fjhscpclData.cultureValue'></el-input-number>
        </el-form-item>
        <el-form-item label='海水捕捞产量（吨）：' prop='catchValue'>
          <el-input-number class='input-width' :min='0' v-model.number='fjhscpclData.catchValue'></el-input-number>
        </el-form-item>
        <el-form-item label='远洋渔业产量（吨）：' prop='fishIndustryValue'>
          <el-input-number class='input-width' :min='0' v-model.number='fjhscpclData.fishIndustryValue'></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type='primary' @click="submit('fjhysczzDataRef')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if='type == hwttl'>
      <el-table style='font-size: 15px' :data='hwttlTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='portName' label='港口名称' align='center'></el-table-column>
        <el-table-column prop='year' label='年份' align='center'></el-table-column>
        <el-table-column prop='value' label='吞吐量（万吨）' align='center'></el-table-column>
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

    <div v-if='type == remark'>
      <el-form :model='remarkData' ref='remarkDataRef' :rules='remarkDataRules' label-width='250px'>
        <el-form-item label='福建省沿海港口货物吞吐量注释信息：' prop='qsfjqRemark'>
          <el-input class='input-width' v-model.trim='remarkData.qsfjqRemark'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="submit('remarkDataRef')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title='jsyqhymjTitle'
               :visible.sync='jsyqhymjFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='jsyqhymjDataRef' :model='jsyqhymjData' :rules='jsyqhymjDataRules' label-width='200px'>

        <el-form-item label='海域名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='jsyqhymjData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='面积（平方千米）：' prop='area'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='jsyqhymjData.area'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='jsyqhymjData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("jsyqhymjDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='hscpclTitle'
               :visible.sync='hscpclFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='hscpclDataRef' :model='hscpclData' :rules='hscpclDataRules' label-width='200px'>
        <el-form-item label='一级分类：' prop='firstType'>
          <el-select class='fjjdhl-input-width' v-model='hscpclData.firstType' placeholder='请选择一级分类'>
            <el-option
                v-for='(item, index) in firstTypeList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='二级分类：'>
          <el-select class='fjjdhl-input-width' v-model='hscpclData.secondType' placeholder='请选择二级分类'>
            <el-option
                v-for='(item, index) in secondTypeList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='产量（吨）：' prop='value'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='hscpclData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000'
                           v-model.number='hscpclData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='hscpclData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("hscpclDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='hwttlTitle'
               :visible.sync='hwttlFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='hwttlDataRef' :model='hwttlData' :rules='hwttlDataRules' label-width='200px'>
        <el-form-item label='港口名称：' prop='portName'>
          <el-select class='fjjdhl-input-width' v-model='hwttlData.portName' placeholder='请选择港口'>
            <el-option
                v-for='(item, index) in portNameList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='hwttlData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='吞吐量（万吨）：' prop='value'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='hwttlData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='hwttlData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("hwttlDataRef")'>确 定</el-button>
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
  saveHscpclDataApi
  , editHscpclDataApi
  , delHscpclDataApi
  , pageHscpclDataApi
  , clearHscpclDataApi
  , queryHscpclGroupList

  , saveHwttlDataApi
  , editHwttlDataApi
  , delHwttlDataApi
  , pageHwttlDataApi
  , clearHwttlDataApi
  , queryHwttlGroupList
} from '../api/zrxt/SeaSpaceApi';
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
  name: 'seaSpace',
  data() {
    return {
      code: 'hykj',
      type: '自然系统-海洋空间-九市一区海域面积',
      jsyqhymj: '自然系统-海洋空间-九市一区海域面积',
      hysczz: '自然系统-海洋空间-海洋生产总值',
      hscpcl: '自然系统-海洋空间-海水产品产量',
      fjhscpcl: '自然系统-海洋空间-福建海水产品产量',
      hwttl: '自然系统-海洋空间-福建省沿海港口货物吞吐量',
      remark: '自然系统-海洋空间-数据注释信息',

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

      jsyqhymjTableData: [],
      hysczzTableData: [],
      hscpclTableData: [],
      hwttlTableData: [],
      msslpmTableData: [],
      xzqNameList: [],

      remarkData: {
        qsfjqRemark: undefined,
        rjjdmsslRemark: undefined,
        jdslpmRemark: undefined,
        msslpmRemark: undefined
      },
      remarkDataRules: {},
      jsyqhymjData: {
        serial: 0,
        areaName: undefined,
        area: 0
      },
      hysczzData: {
        productionTotal: 0,
        firstEstate: 0,
        secondEstate: 0,
        thirdEstate: 0,
        productionPercent: 0
      },
      hscpclData: {
        firstType: undefined,
        secondType: undefined,
        serial: 0,
        value: 0,
        year: 0
      },
      fjhscpclData: {
        cultureValueValue: 0,
        catchValueValue: 0,
        fishIndustryValue: 0
      },
      hwttlData: {
        portName: undefined,
        serial: 0,
        year: 0,
        value: 0
      },
      jsyqhymjDataRules: {
        areaName: [{ required: true, message: '海域名称数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        area: [{ required: true, message: '面积数据不能为空', trigger: 'blur' }]
      },
      hysczzDataRules: {
        productionTotal: [{ required: true, message: '海洋生产总值数据不能为空', trigger: 'blur' }],
        firstEstate: [{ required: true, message: '第一产业数据不能为空', trigger: 'blur' }],
        secondEstate: [{ required: true, message: '第二产业数据不能为空', trigger: 'blur' }],
        thirdEstate: [{ required: true, message: '第三产业数据不能为空', trigger: 'blur' }],
        productionPercent: [{ required: true, message: '海洋生产总值占地区生产总值比重数据不能为空', trigger: 'blur' }]
      },
      hscpclDataRules: {
        firstType: [{ required: true, message: '一级分类数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '产品产量数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }]
      },
      fjhscpclDataRules: {
        cultureValue: [{ required: true, message: '海水养殖产量数据不能为空', trigger: 'change' }],
        catchValue: [{ required: true, message: '海洋捕捞产量数据不能为空', trigger: 'blur' }],
        fishIndustryValue: [{ required: true, message: '远洋渔业产量数据不能为空', trigger: 'blur' }]
      },
      hwttlDataRules: {
        portName: [{ required: true, message: '港口名称数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '吞吐量数据不能为空', trigger: 'blur' }]
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }]
      },

      firstTypeList: [
        '海水产品产量',
        '海水养殖产量量'
      ],
      secondTypeList: [
        '鱼类', '虾蟹类', '贝类', '藻类'
      ],
      portNameList: [
        '福州港', '厦门港', '泉州港', '湄洲湾港'
      ],
      yearList: [],
      queryParam: {
        page: 1,
        pageSize: 10,
        keyWord: undefined,
        year: undefined,
        type: undefined
      },
      total: 0,
      jsyqhymjTitle: '新增数据',
      jsyqhymjFormFlag: false,
      hysczzTitle: '新增数据',
      hysczzFormFlag: false,
      hscpclTitle: '新增数据',
      hscpclFormFlag: false,
      hwttlTitle: '新增数据',
      hwttlFormFlag: false,
      copyData: {
        jsyqhymjData: {
          serial: 0,
          areaName: undefined,
          area: 0
        },
        hysczzData: {
          productionTotal: 0,
          firstEstate: 0,
          secondEstate: 0,
          thirdEstate: 0,
          productionPercent: 0
        },
        hscpclData: {
          firstType: undefined,
          secondType: undefined,
          serial: 0,
          value: 0,
          year: 0
        },
        fjhscpclData: {
          cultureValue: 0,
          catchValue: 0,
          fishIndustryValue: 0
        },
        hwttlData: {
          portName: undefined,
          serial: 0,
          year: 0,
          value: 0
        },
        queryParam: {
          page: 1,
          pageSize: 10,
          keyWord: undefined,
          year: undefined,
          type: undefined
        },
        baseMapForm: {
          name: undefined,
          url: undefined,
          type: undefined,
          code: undefined
        },
        remarkData: {
          qsfjqRemark: undefined,
          rjjdmsslRemark: undefined,
          jdslpmRemark: undefined,
          msslpmRemark: undefined
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
        this.$confirm('导入数据中存在重复数据，请选择导入方式！', '提示', {
          confirmButtonText: '增量导入',
          cancelButtonText: '覆盖导入',
          type: 'warning'
        }).then(_ => {
          let data = {
            id: response.data.id,
            type: false
          };
          // 增量导入
          choseImportMode(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              // 关闭对话框，刷新列表
              this.importData = false;
              this.getPageData();
              this.initXzqNameList();
            }
          });
        }).catch(_ => {
          // 覆盖导入
          let data = {
            id: response.data.id,
            type: true
          };
          // 增量导入
          choseImportMode(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              // 关闭对话框，刷新列表
              this.importData = false;
              this.getPageData();
              this.initXzqNameList();
              if (this.type == this.hscpcl || this.type == this.hwttl) {
                this.initYearList();
              }
            }
          });
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
    initYearList() {
      if (this.type == this.hscpcl) {
        queryHscpclGroupList().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        })
      } else if (this.type == this.hwttl) {
        queryHwttlGroupList().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        })
      }
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
            if (this.type == this.hscpcl) {
              clearHscpclDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                }
              });
            } else if (this.type == this.hwttl) {
              clearHwttlDataApi(this.queryParam).then(res => {
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
          if (this.type == this.hscpcl) {
            if (this.hscpclData.pid) {
              // 更新
              editHscpclDataApi(this.hscpclData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.hscpclFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveHscpclDataApi(this.hscpclData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.hscpclFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.hwttl) {
            if (this.hwttlData.pid) {
              // 更新
              editHwttlDataApi(this.hwttlData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.hwttlFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveHwttlDataApi(this.hwttlData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.hwttlFormFlag = false;
                  this.getPageData();
                  this.initYearList();
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
            if (this.type == this.jsyqhymj) {
              params.jsonValue = JSON.stringify(this.jsyqhymjData);
            } else if (this.type == this.hysczz) {
              params.type = 0;
              params.jsonValue = JSON.stringify(this.hysczzData);
            } else if (this.type == this.fjhscpcl) {
              params.type = 0;
              params.jsonValue = JSON.stringify(this.fjhscpclData);
            } else if (this.type == this.remark) {
              params.type = 0;
              params.jsonValue = JSON.stringify(this.remarkData);
            }
            saveJsonDataApi(params).then(res => {
              if (res.code == 200) {
                this.$message.success('操作成功！');
                this.jsyqhymjFormFlag = false;
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
    buttonGetPageData() {
      this.queryParam.page = 1;
      this.getPageData();
    },
    getPageData() {
      if (this.type != this.hscpcl && this.type != this.hwttl) {
        // json数据
        getJsonDataByCodeApi({ code: this.type }).then(res => {
          if (res.code == 200) {
            if (this.type == this.jsyqhymj) {
              if (res.data == '') {
                this.jsyqhymjTableData = [];
              } else {
                this.jsyqhymjTableData = JSON.parse(res.data);
              }
            } else if (this.type == this.hysczz) {
              if (res.data == '') {
                Object.assign(this.hysczzData, this.copyData.hysczzData);
              } else {
                this.hysczzData = JSON.parse(res.data);
              }
            } else if (this.type == this.fjhscpcl) {
              if (res.data == '') {
                Object.assign(this.fjhscpclData, this.copyData.fjhscpclData);
              } else {
                this.fjhscpclData = JSON.parse(res.data);
              }
            } else if (this.type == this.remark) {
              if (res.data == '') {
                Object.assign(this.remarkData, this.copyData.remarkData);
              } else {
                this.remarkData = JSON.parse(res.data);
              }
            }
          }
        });
      } else {
        if (this.type == this.hscpcl) {
          pageHscpclDataApi(this.queryParam).then(res => {
            if (res.code == 200) {
              this.hscpclTableData = res.data.records;
              this.total = res.data.total;
            }
          });
        } else {
          pageHwttlDataApi(this.queryParam).then(res => {
            if (res.code == 200) {
              this.hwttlTableData = res.data.records;
              this.total = res.data.total;
            }
          });
        }
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
      this.initYearList();
      this.getPageData();
    },
    addData() {
      if (this.type == this.jsyqhymj) {
        this.jsyqhymjTitle = '新增数据';
        this.jsyqhymjFormFlag = true;
        this.jsyqhymjData.pid = undefined;
        Object.assign(this.jsyqhymjData, this.copyData.jsyqhymjData);
      }
      if (this.type == this.hscpcl) {
        this.hscpclTitle = '新增数据';
        this.hscpclFormFlag = true;
        this.hscpclData.pid = undefined;
        Object.assign(this.hscpclData, this.copyData.hscpclData);
      } else if (this.type == this.hwttl) {
        this.hwttlTitle = '新增数据';
        this.hwttlFormFlag = true;
        this.hwttlData.pid = undefined;
        Object.assign(this.hwttlData, this.copyData.hwttlData);
      }
    },
    handleEdit(row) {
      if (this.type == this.jsyqhymj) {
        this.jsyqhymjTitle = '编辑数据';
        this.jsyqhymjFormFlag = true;
        Object.assign(this.jsyqhymjData, row);
      } else if (this.type == this.hscpcl) {
        this.hscpclTitle = '编辑数据';
        this.hscpclFormFlag = true;
        Object.assign(this.hscpclData, row);
      } else if (this.type == this.hwttl) {
        this.hwttlTitle = '编辑数据';
        this.hwttlFormFlag = true;
        Object.assign(this.hwttlData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type != this.hscpcl && this.type != this.hwttl) {
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
        } else {
          if (this.type == this.hscpcl) {
            delHscpclDataApi(row.pid).then(res => {
              if (res.code == 200) {
                this.$message.success('删除成功！');
                this.getPageData();
                this.initYearList();
              }
            });
          } else if (this.type == this.hwttl) {
            delHwttlDataApi(row.pid).then(res => {
              if (res.code == 200) {
                this.$message.success('删除成功！');
                this.getPageData();
                this.initYearList();
              }
            });
          }
        }
      }).catch(_ => {

      });
    },
    handleClose() {
      if (this.type == this.jsyqhymj) {
        this.jsyqhymjFormFlag = false;
      } else if (this.type == this.hysczz) {
        this.hysczzFormFlag = false;
      } else if (this.type == this.hscpcl) {
        this.hscpclFormFlag = false;
      } else if (this.type == this.hwttl) {
        this.hwttlFormFlag = false;
      } else if (this.type == this.msslpm) {
        this.msslpmFormFlag = false;
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