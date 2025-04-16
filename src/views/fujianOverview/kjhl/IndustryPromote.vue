<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='产业增加值' :name='cyzjz'>
      </el-tab-pane>
      <el-tab-pane label='一二三产增加值' :name='yesczjz'>
      </el-tab-pane>
      <el-tab-pane label='零售' :name='ls'>
      </el-tab-pane>
      <el-tab-pane label='对外贸易' :name='dwmy'>
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
      <div v-if='type == cyzjz || type == yesczjz'>
        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.areaName' placeholder='根据行政区名称搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>
      <div v-if='type == ls'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.areaName' clearable placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-col>
      </div>
      <div v-if='type == dwmy'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.areaName' clearable placeholder='请选择地区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-col>
      </div>
      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonGetPageData'>
              查询
            </el-button>

            <el-button v-if='type == cyzjz' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增产业增加值数据
            </el-button>
            <el-button v-if='type == yesczjz' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增一二三产增加值数据
            </el-button>
            <el-button v-if='type == ls' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增零售数据
            </el-button>
            <el-button v-if='type == dwmy' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增对外贸易数据
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

    <div v-if='type == cyzjz'>
      <el-table style='font-size: 15px' :data='cyzjzTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='firstIncrease' label='第一产业增加值/万元' align='center'></el-table-column>
        <el-table-column prop='secondIncrease' label='第二产业增加值/万元' align='center'></el-table-column>
        <el-table-column prop='thirdlyIncrease' label='第三产业增加值/万元' align='center'></el-table-column>
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

    <div v-if='type == yesczjz'>
      <el-table style='font-size: 15px' :data='yesczjzTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='firstRate' label='第一产业（%）' align='center'></el-table-column>
        <el-table-column prop='secondRate' label='第二产业（%）' align='center'></el-table-column>
        <el-table-column prop='thirdlyRate' label='第三产业（%）' align='center'></el-table-column>
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

    <div v-if='type == ls'>
      <el-table style='font-size: 15px' :data='lsTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='value' label='社会消费品零售总额/亿元' align='center'></el-table-column>
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

    <div v-if='type == dwmy'>
      <el-table style='font-size: 15px' :data='dwmyTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='地区' align='center'></el-table-column>
        <el-table-column prop='value' label='进出口商品总额/亿元' align='center'></el-table-column>
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

    <el-dialog :title='cyzjzTitle'
               :visible.sync='cyzjzFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='cyzjzDataRef' :model='cyzjzData' :rules='cyzjzDataRules' label-width='200px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='cyzjzData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='第一产业增加值/万元：' prop='firstIncrease'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='cyzjzData.firstIncrease'></el-input-number>
        </el-form-item>

        <el-form-item label='第二产业增加值/万元：' prop='secondIncrease'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='cyzjzData.secondIncrease'></el-input-number>
        </el-form-item>

        <el-form-item label='第三产业增加值/万元：' prop='thirdlyIncrease'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='cyzjzData.thirdlyIncrease'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='cyzjzData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='cyzjzData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("cyzjzDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='yesczjzTitle'
               :visible.sync='yesczjzFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='yesczjzDataRef' :model='yesczjzData' :rules='yesczjzDataRules' label-width='150px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='yesczjzData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='第一产业（%）：' prop='firstRate'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='yesczjzData.firstRate'></el-input-number>
        </el-form-item>

        <el-form-item label='第二产业（%）：' prop='secondRate'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='yesczjzData.secondRate'></el-input-number>
        </el-form-item>

        <el-form-item label='第三产业（%）：' prop='thirdlyRate'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='yesczjzData.thirdlyRate'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='yesczjzData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='yesczjzData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("yesczjzDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='lsTitle'
               :visible.sync='lsFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='lsDataRef' :model='lsData' :rules='lsDataRules' label-width='200px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='lsData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='社会消费品零售总额/亿元：' prop='value'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lsData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='lsData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lsData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("lsDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='dwmyTitle'
               :visible.sync='dwmyFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='dwmyDataRef' :model='dwmyData' :rules='dwmyDataRules' label-width='200px'>
        <el-form-item label='地区：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='dwmyData.areaName' placeholder='请选择地区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='进出口商品总额/亿元：' prop='value'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='dwmyData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='dwmyData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='dwmyData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("dwmyDataRef")'>确 定</el-button>
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
  saveCyzjzDataApi
  , editCyzjzDataApi
  , delCyzjzDataApi
  , pageCyzjzDataApi
  , queryCyzjzGroupListApi
  , saveYesczjzDataApi
  , editYesczjzDataApi
  , delYesczjzDataApi
  , pageYesczjzDataApi
  , queryYesczjzGroupListApi
  , saveLsDataApi
  , editLsDataApi
  , delLsDataApi
  , pageLsDataApi
  , queryLsGroupListApi
  , saveDwmyDataApi
  , editDwmyDataApi
  , delDwmyDataApi
  , pageDwmyDataApi
  , queryDwmyGroupListApi
  , clearCyzjzDataApi
  , clearYesczjzDataApi
  , clearLsDataApi
  , clearDwmyDataApi
} from '../api/kjhl/IndustryPromoteApi';
import {
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
  name: 'industryPromote',
  data() {
    return {
      code: 'cyfz',
      type: '空间活力-产业发展-产业增加值',
      cyzjz: '空间活力-产业发展-产业增加值',
      yesczjz: '空间活力-产业发展-一二三产业增加值',
      ls: '空间活力-产业发展-零售',
      dwmy: '空间活力-产业发展-对外贸易',

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

      cyzjzTableData: [],
      lsTableData: [],
      yesczjzTableData: [],
      dwmyTableData: [],
      yearList: [],
      xzqNameList: [],
      cyzjzData: {
        areaName: undefined,
        serial: 0,
        year: undefined,
        firstIncrease: 0,
        secondIncrease: 0,
        thirdlyIncrease: 0
      },
      yesczjzData: {
        areaName: undefined,
        serial: 0,
        year: undefined,
        firstRate: 0,
        secondRate: 0,
        thirdlyRate: 0
      },
      lsData: {
        areaName: undefined,
        year: undefined,
        serial: 0,
        value: 0
      },
      dwmyData: {
        areaName: undefined,
        serial: 0,
        year: undefined,
        value: 0
      },
      cyzjzDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        firstIncrease: [{ required: true, message: '第一产业增加值数据不能为空', trigger: 'blur' }],
        secondIncrease: [{ required: true, message: '第二产业增加值数据不能为空', trigger: 'blur' }],
        thirdlyIncrease: [{ required: true, message: '第三产业增加值数据不能为空', trigger: 'blur' }]
      },
      yesczjzDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        firstRate: [{ required: true, message: '第一产业数据不能为空', trigger: 'blur' }],
        secondRate: [{ required: true, message: '第二产业数据不能为空', trigger: 'blur' }],
        thirdlyRate: [{ required: true, message: '第三产业数据不能为空', trigger: 'blur' }]
      },
      lsDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '社会消费品零售总额数据不能为空', trigger: 'blur' }]
      },
      dwmyDataRules: {
        areaName: [{ required: true, message: '地区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '进出口商品总额数据不能为空', trigger: 'blur' }]
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
      cyzjzTitle: '新增数据',
      cyzjzFormFlag: false,
      lsTitle: '新增数据',
      lsFormFlag: false,
      yesczjzTitle: '新增数据',
      yesczjzFormFlag: false,
      dwmyTitle: '新增数据',
      dwmyFormFlag: false,
      copyData: {
        cyzjzData: {
          areaName: undefined,
          serial: 0,
          year: undefined,
          firstIncrease: 0,
          secondIncrease: 0,
          thirdlyIncrease: 0
        },
        yesczjzData: {
          areaName: undefined,
          serial: 0,
          year: undefined,
          firstRate: 0,
          secondRate: 0,
          thirdlyRate: 0
        },
        lsData: {
          areaName: undefined,
          year: undefined,
          serial: 0,
          value: 0
        },
        dwmyData: {
          areaName: undefined,
          serial: 0,
          year: undefined,
          value: 0
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
            if (this.type == this.cyzjz) {
              clearCyzjzDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.yesczjz) {
              clearYesczjzDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.ls) {
              clearLsDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.dwmy) {
              clearDwmyDataApi(this.queryParam).then(res => {
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
          if (this.type == this.cyzjz) {
            if (this.cyzjzData.pid) {
              // 更新
              editCyzjzDataApi(this.cyzjzData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.cyzjzFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveCyzjzDataApi(this.cyzjzData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.cyzjzFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.yesczjz) {
            if (this.yesczjzData.pid) {
              // 更新
              editYesczjzDataApi(this.yesczjzData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.yesczjzFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveYesczjzDataApi(this.yesczjzData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.yesczjzFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.ls) {
            if (this.lsData.pid) {
              // 更新
              editLsDataApi(this.lsData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.lsFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveLsDataApi(this.lsData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.lsFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.dwmy) {
            if (this.dwmyData.pid) {
              // 更新
              editDwmyDataApi(this.dwmyData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.dwmyFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveDwmyDataApi(this.dwmyData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.dwmyFormFlag = false;
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
      if (this.type == this.cyzjz) {
        queryCyzjzGroupListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.yesczjz) {
        queryYesczjzGroupListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.ls) {
        queryLsGroupListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.dwmy) {
        queryDwmyGroupListApi().then(res => {
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
      if (this.type == this.cyzjz) {
        pageCyzjzDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.cyzjzTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.yesczjz) {
        pageYesczjzDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.yesczjzTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.ls) {
        pageLsDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.lsTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.dwmy) {
        pageDwmyDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.dwmyTableData = res.data.records;
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
      if (this.type == this.cyzjz) {
        this.cyzjzTitle = '新增数据';
        this.cyzjzFormFlag = true;
        this.cyzjzData.pid = undefined;
        Object.assign(this.cyzjzData, this.copyData.cyzjzData);
      } else if (this.type == this.yesczjz) {
        this.yesczjzTitle = '新增数据';
        this.yesczjzFormFlag = true;
        this.yesczjzData.pid = undefined;
        Object.assign(this.yesczjzData, this.copyData.yesczjzData);
      } else if (this.type == this.ls) {
        this.lsTitle = '新增数据';
        this.lsFormFlag = true;
        this.lsData.pid = undefined;
        Object.assign(this.lsData, this.copyData.lsData);
      } else if (this.type == this.dwmy) {
        this.dwmyTitle = '新增数据';
        this.dwmyFormFlag = true;
        this.dwmyData.pid = undefined;
        Object.assign(this.dwmyData, this.copyData.dwmyData);
      }
    },
    handleEdit(row) {
      if (this.type == this.cyzjz) {
        this.cyzjzTitle = '编辑数据';
        this.cyzjzFormFlag = true;
        Object.assign(this.cyzjzData, row);
      } else if (this.type == this.yesczjz) {
        this.yesczjzTitle = '编辑数据';
        this.yesczjzFormFlag = true;
        Object.assign(this.yesczjzData, row);
      } else if (this.type == this.ls) {
        this.lsTitle = '编辑数据';
        this.lsFormFlag = true;
        Object.assign(this.lsData, row);
      } else if (this.type == this.dwmy) {
        this.dwmyTitle = '编辑数据';
        this.dwmyFormFlag = true;
        Object.assign(this.dwmyData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.cyzjz) {
          delCyzjzDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.yesczjz) {
          delYesczjzDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.ls) {
          delLsDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.dwmy) {
          delDwmyDataApi(row.pid).then(res => {
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
      if (this.type == this.cyzjz) {
        this.cyzjzFormFlag = false;
      } else if (this.type == this.yesczjz) {
        this.yesczjzFormFlag = false;
      } else if (this.type == this.ls) {
        this.lsFormFlag = false;
      } else if (this.type == this.dwmy) {
        this.dwmyFormFlag = false;
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