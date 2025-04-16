<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='绿色全要素生产率' :name='lsqysscl'>
      </el-tab-pane>
      <el-tab-pane label='平均受教育年限' :name='pjsjynx'>
      </el-tab-pane>
      <el-tab-pane label='区县级数字基础设施' :name='qxjszjcss'>
      </el-tab-pane>
      <el-tab-pane label='区县级数字乡村指数' :name='qxjszxczs'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>
      <div v-if='type == lsqysscl'>
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
      <div v-if='type == qxjszjcss || type == qxjszxczs'>
        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.areaName' placeholder='根据区划名称搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>
      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if='type != pjsjynx' type='primary' icon='el-icon-search' class='handle-del mr10'
                       @click='buttonGetPageData'>
              查询
            </el-button>

            <el-button v-if='type == lsqysscl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增绿色全要素生产率数据
            </el-button>
            <el-button v-if='type == pjsjynx' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增平均受教育年限数据
            </el-button>
            <el-button v-if='type == qxjszjcss' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增区县级数字基础设施数据
            </el-button>
            <el-button v-if='type == qxjszxczs' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增区县级数字乡村指数数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button v-if='total != 0 && type != pjsjynx' type='danger' icon='el-icon-delete' class='handle-del mr10'
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

    <div v-if='type == lsqysscl'>
      <el-table style='font-size: 15px' :data='lsqyssclTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='value' label='绿色全要素生产率' align='center'></el-table-column>
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

    <div v-if='type == pjsjynx'>
      <el-table style='font-size: 15px' :data='pjsjynxTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='avgEducation' label='平均受教育年限' align='center'></el-table-column>
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

    <div v-if='type == qxjszjcss'>
      <el-table style='font-size: 15px' :data='qxjszjcssTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='区划名称' align='center'></el-table-column>
        <el-table-column prop='figureFinance' label='数字金融基础设施' align='center'></el-table-column>
        <el-table-column prop='figureBase' label='数字基础设施指数' align='center'></el-table-column>
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

    <div v-if='type == qxjszxczs'>
      <el-table style='font-size: 15px' :data='qxjszxczsTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='区划名称' align='center'></el-table-column>
        <el-table-column prop='financeValue' label='乡村经济数字化' align='center'></el-table-column>
        <el-table-column prop='figureValue' label='乡村治理数字化指数' align='center'></el-table-column>
        <el-table-column prop='lifeFigureValue' label='乡村生活数字化指数' align='center'></el-table-column>
        <el-table-column prop='villageFigureValue' label='数字乡村指数' align='center'></el-table-column>
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

    <el-dialog :title='lsqyssclTitle'
               :visible.sync='lsqyssclFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='lsqyssclDataRef' :model='lsqyssclData' :rules='lsqyssclDataRules' label-width='200px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='lsqyssclData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='绿色全要素生产率：' prop='value'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lsqyssclData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='lsqyssclData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lsqyssclData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("lsqyssclDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='pjsjynxTitle'
               :visible.sync='pjsjynxFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='pjsjynxDataRef' :model='pjsjynxData' :rules='pjsjynxDataRules' label-width='150px'>

        <el-form-item label='平均受教育年限：' prop='avgEducation'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='pjsjynxData.avgEducation'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='pjsjynxData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='pjsjynxData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("pjsjynxDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='qxjszjcssTitle'
               :visible.sync='qxjszjcssFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='qxjszjcssDataRef' :model='qxjszjcssData' :rules='qxjszjcssDataRules' label-width='200px'>
        <el-form-item label='区划名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='qxjszjcssData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='数字金融基础设施：' prop='figureFinance'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qxjszjcssData.figureFinance'></el-input-number>
        </el-form-item>

        <el-form-item label='数字基础设施指数：' prop='figureBase'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qxjszjcssData.figureBase'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='qxjszjcssData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("qxjszjcssDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='qxjszxczsTitle'
               :visible.sync='qxjszxczsFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='qxjszxczsDataRef' :model='qxjszxczsData' :rules='qxjszxczsDataRules' label-width='200px'>
        <el-form-item label='区划名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='qxjszxczsData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='乡村经济数字化：' prop='financeValue'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qxjszxczsData.financeValue'></el-input-number>
        </el-form-item>

        <el-form-item label='乡村治理数字化指数：' prop='figureValue'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qxjszxczsData.figureValue'></el-input-number>
        </el-form-item>

        <el-form-item label='乡村生活数字化指数：' prop='lifeFigureValue'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qxjszxczsData.lifeFigureValue'></el-input-number>
        </el-form-item>

        <el-form-item label='数字乡村指数：' prop='villageFigureValue'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qxjszxczsData.villageFigureValue'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='qxjszxczsData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("qxjszxczsDataRef")'>确 定</el-button>
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
  saveLsqyssclDataApi
  , editLsqyssclDataApi
  , delLsqyssclDataApi
  , pageLsqyssclDataApi
  , queryLsqyssclGroupListApi
  , savePjsjynxDataApi
  , editPjsjynxDataApi
  , delPjsjynxDataApi
  , pagePjsjynxDataApi
  , queryPjsjynxGroupListApi
  , saveQxjszjcssDataApi
  , editQxjszjcssDataApi
  , delQxjszjcssDataApi
  , pageQxjszjcssDataApi
  , queryQxjszjcssGroupListApi
  , saveQxjszxczsDataApi
  , editQxjszxczsDataApi
  , delQxjszxczsDataApi
  , pageQxjszxczsDataApi
  , queryQxjszxczsGroupListApi
  , clearLsqyssclDataApi
  , clearQxjszjcssDataApi
  , clearQxjszxczsDataApi
} from '../api/kjcx/InnovationIndexApi';
import {
  getDictByCodeApi,
  exportExcel,
  getImportUrl,
  saveBaseMapApi,
  getBaseMapListApi,
  delBaseMapApi,
  editBaseMapApi,
  getServerTypeApi,
  choseImportMode
} from '@/views/fujianOverview/api/FjoPublicApi';

export default {
  name: 'innovationIndex',
  data() {
    return {
      code: 'cxzb',
      type: '科技创新-创新指标-绿色全要素生产率',
      lsqysscl: '科技创新-创新指标-绿色全要素生产率',
      pjsjynx: '科技创新-创新指标-平均受教育年限',
      qxjszjcss: '科技创新-创新指标-区县级数字基础设施',
      qxjszxczs: '科技创新-创新指标-区县级数字乡村指数',

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

      lsqyssclTableData: [],
      qxjszjcssTableData: [],
      pjsjynxTableData: [],
      qxjszxczsTableData: [],
      yearList: [],
      xzqNameList: [],
      lsqyssclData: {
        areaName: undefined,
        serial: 0,
        year: undefined,
        value: 0
      },
      pjsjynxData: {
        serial: 0,
        year: undefined,
        avgEducation: 0
      },
      qxjszjcssData: {
        areaName: undefined,
        serial: 0,
        figureFinance: 0,
        figureBase: 0
      },
      qxjszxczsData: {
        areaName: undefined,
        serial: 0,
        financeValue: 0,
        figureValue: 0,
        lifeFigureValue: 0,
        villageFigureValue: 0
      },
      lsqyssclDataRules: {
        areaName: [{ required: true, message: '地区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '绿色全要素生产率数据不能为空', trigger: 'blur' }]
      },
      pjsjynxDataRules: {
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        avgEducation: [{ required: true, message: '平均受教育年限数据不能为空', trigger: 'blur' }]
      },
      qxjszjcssDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        figureFinance: [{ required: true, message: '数字金融基础设施数据不能为空', trigger: 'blur' }],
        figureBase: [{ required: true, message: '数字基础设施指数数据不能为空', trigger: 'blur' }]
      },
      qxjszxczsDataRules: {
        areaName: [{ required: true, message: '地区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        financeValue: [{ required: true, message: '乡村经济数字化数据不能为空', trigger: 'blur' }],
        figureValue: [{ required: true, message: '乡村治理数字化指数数据不能为空', trigger: 'blur' }],
        lifeFigureValue: [{ required: true, message: '乡村生活数字化指数数据不能为空', trigger: 'blur' }],
        villageFigureValue: [{ required: true, message: '数字乡村指数数据不能为空', trigger: 'blur' }]
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
      lsqyssclTitle: '新增数据',
      lsqyssclFormFlag: false,
      qxjszjcssTitle: '新增数据',
      qxjszjcssFormFlag: false,
      pjsjynxTitle: '新增数据',
      pjsjynxFormFlag: false,
      qxjszxczsTitle: '新增数据',
      qxjszxczsFormFlag: false,
      copyData: {
        lsqyssclData: {
          areaName: undefined,
          serial: 0,
          year: undefined,
          value: 0
        },
        pjsjynxData: {
          serial: 0,
          year: undefined,
          avgEducation: 0
        },
        qxjszjcssData: {
          areaName: undefined,
          serial: 0,
          figureFinance: 0,
          figureBase: 0
        },
        qxjszxczsData: {
          areaName: undefined,
          serial: 0,
          financeValue: 0,
          figureValue: 0,
          lifeFigureValue: 0,
          villageFigureValue: 0
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
            if (this.type == this.lsqysscl) {
              clearLsqyssclDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.qxjszjcss) {
              clearQxjszjcssDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.qxjszxczs) {
              clearQxjszxczsDataApi(this.queryParam).then(res => {
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
          if (this.type == this.lsqysscl) {
            if (this.lsqyssclData.pid) {
              // 更新
              editLsqyssclDataApi(this.lsqyssclData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.lsqyssclFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveLsqyssclDataApi(this.lsqyssclData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.lsqyssclFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.pjsjynx) {
            if (this.pjsjynxData.pid) {
              // 更新
              editPjsjynxDataApi(this.pjsjynxData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.pjsjynxFormFlag = false;
                  this.getPageData();
                }
              });
            } else {
              // 新增
              savePjsjynxDataApi(this.pjsjynxData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.pjsjynxFormFlag = false;
                  this.getPageData();
                }
              });
            }
          } else if (this.type == this.qxjszjcss) {
            if (this.qxjszjcssData.pid) {
              // 更新
              editQxjszjcssDataApi(this.qxjszjcssData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.qxjszjcssFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveQxjszjcssDataApi(this.qxjszjcssData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.qxjszjcssFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.qxjszxczs) {
            if (this.qxjszxczsData.pid) {
              // 更新
              editQxjszxczsDataApi(this.qxjszxczsData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.qxjszxczsFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveQxjszxczsDataApi(this.qxjszxczsData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.qxjszxczsFormFlag = false;
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
      if (this.type == this.lsqysscl) {
        queryLsqyssclGroupListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.pjsjynx) {
        queryPjsjynxGroupListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.qxjszjcss) {
        queryQxjszjcssGroupListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.qxjszxczs) {
        queryQxjszxczsGroupListApi().then(res => {
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
      if (this.type == this.lsqysscl) {
        pageLsqyssclDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.lsqyssclTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.pjsjynx) {
        pagePjsjynxDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.pjsjynxTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.qxjszjcss) {
        pageQxjszjcssDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.qxjszjcssTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.qxjszxczs) {
        pageQxjszxczsDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.qxjszxczsTableData = res.data.records;
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
      if (this.type == this.lsqysscl) {
        this.lsqyssclTitle = '新增数据';
        this.lsqyssclFormFlag = true;
        this.lsqyssclData.pid = undefined;
        Object.assign(this.lsqyssclData, this.copyData.lsqyssclData);
      } else if (this.type == this.pjsjynx) {
        this.pjsjynxTitle = '新增数据';
        this.pjsjynxFormFlag = true;
        this.pjsjynxData.pid = undefined;
        Object.assign(this.pjsjynxData, this.copyData.pjsjynxData);
      } else if (this.type == this.qxjszjcss) {
        this.qxjszjcssTitle = '新增数据';
        this.qxjszjcssFormFlag = true;
        this.qxjszjcssData.pid = undefined;
        Object.assign(this.qxjszjcssData, this.copyData.qxjszjcssData);
      } else if (this.type == this.qxjszxczs) {
        this.qxjszxczsTitle = '新增数据';
        this.qxjszxczsFormFlag = true;
        this.qxjszxczsData.pid = undefined;
        Object.assign(this.qxjszxczsData, this.copyData.qxjszxczsData);
      }
    },
    handleEdit(row) {
      if (this.type == this.lsqysscl) {
        this.lsqyssclTitle = '编辑数据';
        this.lsqyssclFormFlag = true;
        Object.assign(this.lsqyssclData, row);
      } else if (this.type == this.pjsjynx) {
        this.pjsjynxTitle = '编辑数据';
        this.pjsjynxFormFlag = true;
        Object.assign(this.pjsjynxData, row);
      } else if (this.type == this.qxjszjcss) {
        this.qxjszjcssTitle = '编辑数据';
        this.qxjszjcssFormFlag = true;
        Object.assign(this.qxjszjcssData, row);
      } else if (this.type == this.qxjszxczs) {
        this.qxjszxczsTitle = '编辑数据';
        this.qxjszxczsFormFlag = true;
        Object.assign(this.qxjszxczsData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.lsqysscl) {
          delLsqyssclDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.pjsjynx) {
          delPjsjynxDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
            }
          });
        } else if (this.type == this.qxjszjcss) {
          delQxjszjcssDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
            }
          });
        } else if (this.type == this.qxjszxczs) {
          delQxjszxczsDataApi(row.pid).then(res => {
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
      if (this.type == this.lsqysscl) {
        this.lsqyssclFormFlag = false;
      } else if (this.type == this.pjsjynx) {
        this.pjsjynxFormFlag = false;
      } else if (this.type == this.qxjszjcss) {
        this.qxjszjcssFormFlag = false;
      } else if (this.type == this.qxjszxczs) {
        this.qxjszxczsFormFlag = false;
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