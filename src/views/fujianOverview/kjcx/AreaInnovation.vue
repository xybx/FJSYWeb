<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='福建省R&D支出' :name='rd'>
      </el-tab-pane>
      <el-tab-pane label='区县碳排放数据' :name='qxtpf'>
      </el-tab-pane>
      <el-tab-pane label='专利数量统计' :name='zl'>
      </el-tab-pane>
      <el-tab-pane label='绿色专利' :name='lszl'>
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
      <div v-if='type == qxtpf'>
        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.areaName' placeholder='根据行政区名称搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>
      <div v-if='type == lszl'>
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
            <el-button v-if='type == rd' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增福建省R&D支出数据
            </el-button>
            <el-button v-if='type == qxtpf' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增区县碳排放数据
            </el-button>
            <el-button v-if='type == zl' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增专利数量统计数据
            </el-button>
            <el-button v-if='type == lszl' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增绿色专利数据
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

    <div v-if='type == rd'>
      <el-table style='font-size: 15px' :data='rdTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='rdExpend' label='R&D经费支出/亿元' align='center'></el-table-column>
        <el-table-column prop='rdInnerExpend' label='R&D经费内部支出占GDP比重（%）' align='center'></el-table-column>
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

    <div v-if='type == qxtpf'>
      <el-table style='font-size: 15px' :data='qxtpfTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='cityName' label='地市名称' align='center'></el-table-column>
        <el-table-column prop='countyName' label='区县名称' align='center'></el-table-column>
        <el-table-column prop='carbonValue' label='碳排放' align='center'></el-table-column>
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

    <div v-if='type == zl'>
      <el-table style='font-size: 15px' :data='zlTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区划名称' align='center'></el-table-column>
        <el-table-column prop='value' label='专利数量（件）' align='center'></el-table-column>
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

    <div v-if='type == lszl'>
      <el-table style='font-size: 15px' :data='lszlTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='地区' align='center'></el-table-column>
        <el-table-column prop='greenNumber' label='获得的绿色发明数量' align='center'></el-table-column>
        <el-table-column prop='greenRate' label='绿色发明占地区年度获得的专利总数百分比（%）' align='center'></el-table-column>
        <el-table-column prop='greenPatent' label='获得的绿色实用新型数量' align='center'></el-table-column>
        <el-table-column prop='greenPatentRate' label='绿色实用新型占地区年度获得的实用新型总数百分比（%）' align='center'></el-table-column>
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

    <el-dialog :title='rdTitle'
               :visible.sync='rdFormFlag'
               width='40%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='rdDataRef' :model='rdData' :rules='rdDataRules' label-width='300px'>

        <el-form-item label='R&D经费支出/亿元：' prop='rdExpend'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rdData.rdExpend'></el-input-number>
        </el-form-item>

        <el-form-item label='R&D经费内部支出占GDP比重（%）：' prop='rdInnerExpend'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rdData.rdInnerExpend'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='1949' v-model.number='rdData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rdData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("rdDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='qxtpfTitle'
               :visible.sync='qxtpfFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='qxtpfDataRef' :model='qxtpfData' :rules='qxtpfDataRules' label-width='150px'>
        <el-form-item label='地市名称：' prop='cityName'>
          <el-input class='fjjdhl-input-width' v-model.trim='qxtpfData.cityName'></el-input>
        </el-form-item>

        <el-form-item label='区县名称：' prop='countyName'>
          <el-input class='fjjdhl-input-width' v-model.trim='qxtpfData.countyName'></el-input>
        </el-form-item>

        <el-form-item label='碳排放：' prop='carbonValue'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='qxtpfData.carbonValue'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='qxtpfData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='qxtpfData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("qxtpfDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='zlTitle'
               :visible.sync='zlFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='zlDataRef' :model='zlData' :rules='zlDataRules' label-width='200px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='zlData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='专利数量（件）：' prop='value'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='zlData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='年份：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='zlData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='zlData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("zlDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='lszlTitle'
               :visible.sync='lszlFormFlag'
               width='40%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='lszlDataRef' :model='lszlData' :rules='lszlDataRules' label-width='400px'>
        <el-form-item label='地市名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='lszlData.areaName' placeholder='请选择地市名称'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='获得的绿色发明数量：' prop='greenNumber'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lszlData.greenNumber'></el-input-number>
        </el-form-item>

        <el-form-item label='绿色发明占地区年度获得的专利总数百分比（%）：' prop='greenRate'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lszlData.greenRate'></el-input-number>
        </el-form-item>

        <el-form-item label='获得的绿色实用新型数量：' prop='greenPatent'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lszlData.greenPatent'></el-input-number>
        </el-form-item>

        <el-form-item label='绿色实用新型占地区年度获得的实用新型总数百分比（%）：' prop='greenPatentRate'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='lszlData.greenPatentRate'></el-input-number>
        </el-form-item>

        <el-form-item label='会计年度：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='2000' v-model.number='lszlData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lszlData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("lszlDataRef")'>确 定</el-button>
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
  saveRdDataApi
  , editRdDataApi
  , delRdDataApi
  , pageRdDataApi
  , queryRdGroupListApi
  , saveQxtpfDataApi
  , editQxtpfDataApi
  , delQxtpfDataApi
  , pageQxtpfDataApi
  , queryQxtpfGroupListApi
  , saveZlDataApi
  , editZlDataApi
  , delZlDataApi
  , pageZlDataApi
  , queryZlGroupListApi
  , saveLszlDataApi
  , editLszlDataApi
  , delLszlDataApi
  , pageLszlDataApi
  , queryLszlGroupListApi
  , clearRdDataApi
  , clearQxtpfDataApi
  , clearCyzjzDataApi
  , clearLszlDataApi
} from '../api/kjcx/AreaInnovationApi';
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
      code: 'qycx',
      type: '科技创新-区域创新-福建省RD支出',
      rd: '科技创新-区域创新-福建省RD支出',
      qxtpf: '科技创新-区域创新-区县碳排放',
      zl: '科技创新-区域创新-专利数量统计',
      lszl: '科技创新-区域创新-绿色专利',

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

      rdTableData: [],
      zlTableData: [],
      qxtpfTableData: [],
      lszlTableData: [],
      yearList: [],
      xzqNameList: [],
      rdData: {
        serial: 0,
        year: undefined,
        rdExpend: 0,
        rdInnerExpend: 0
      },
      qxtpfData: {
        serial: 0,
        year: undefined,
        cityName: undefined,
        countyName: undefined,
        carbonValue: 0
      },
      zlData: {
        areaName: undefined,
        year: undefined,
        serial: 0,
        value: 0
      },
      lszlData: {
        areaName: undefined,
        serial: 0,
        year: undefined,
        greenNumber: 0,
        greenRate: 0,
        greenPatent: 0,
        greenPatentRate: 0
      },
      rdDataRules: {
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        rdExpend: [{ required: true, message: 'R&D经费支出数据不能为空', trigger: 'blur' }],
        rdInnerExpend: [{ required: true, message: 'R&D经费内部支出占GDP比重数据不能为空', trigger: 'blur' }]
      },
      qxtpfDataRules: {
        cityName: [{ required: true, message: '城市数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        countyName: [{ required: true, message: '区县数据不能为空', trigger: 'blur' }],
        carbonValue: [{ required: true, message: '碳排放数据不能为空', trigger: 'blur' }]
      },
      zlDataRules: {
        areaName: [{ required: true, message: '行政区划名称数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年份数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '专利数量数据不能为空', trigger: 'blur' }]
      },
      lszlDataRules: {
        areaName: [{ required: true, message: '地市名称数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '会计年度数据不能为空', trigger: 'blur' }],
        greenNumber: [{ required: true, message: '当年获得的绿色发明数量数据不能为空', trigger: 'blur' }],
        greenRate: [{ required: true, message: '绿色发明占地区年度获得的专利总数百分比数据不能为空', trigger: 'blur' }],
        greenPatent: [{ required: true, message: '当年获得的绿色实用新型数量数据不能为空', trigger: 'blur' }],
        greenPatentRate: [{ required: true, message: '绿色实用新型占地区年度获得的实用新型总数百分比数据不能为空', trigger: 'blur' }]
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
      rdTitle: '新增数据',
      rdFormFlag: false,
      zlTitle: '新增数据',
      zlFormFlag: false,
      qxtpfTitle: '新增数据',
      qxtpfFormFlag: false,
      lszlTitle: '新增数据',
      lszlFormFlag: false,
      copyData: {
        rdData: {
          serial: 0,
          year: undefined,
          rdExpend: 0,
          rdInnerExpend: 0
        },
        qxtpfData: {
          serial: 0,
          year: undefined,
          cityName: undefined,
          countyName: undefined,
          carbonValue: 0
        },
        zlData: {
          areaName: undefined,
          year: undefined,
          serial: 0,
          value: 0
        },
        lszlData: {
          areaName: undefined,
          serial: 0,
          year: undefined,
          greenNumber: 0,
          greenRate: 0,
          greenPatent: 0,
          greenPatentRate: 0
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
            if (this.type == this.rd) {
              clearRdDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.qxtpf) {
              clearQxtpfDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.zl) {
              clearCyzjzDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else if (this.type == this.lszl) {
              clearLszlDataApi(this.queryParam).then(res => {
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
          if (this.type == this.rd) {
            if (this.rdData.pid) {
              // 更新
              editRdDataApi(this.rdData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.rdFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveRdDataApi(this.rdData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.rdFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.qxtpf) {
            if (this.qxtpfData.pid) {
              // 更新
              editQxtpfDataApi(this.qxtpfData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.qxtpfFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveQxtpfDataApi(this.qxtpfData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.qxtpfFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.zl) {
            if (this.zlData.pid) {
              // 更新
              editZlDataApi(this.zlData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.zlFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveZlDataApi(this.zlData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.zlFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            }
          } else if (this.type == this.lszl) {
            if (this.lszlData.pid) {
              // 更新
              editLszlDataApi(this.lszlData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.lszlFormFlag = false;
                  this.getPageData();
                  this.initYearList();
                }
              });
            } else {
              // 新增
              saveLszlDataApi(this.lszlData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.lszlFormFlag = false;
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
      if (this.type == this.rd) {
        queryRdGroupListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.qxtpf) {
        queryQxtpfGroupListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.zl) {
        queryZlGroupListApi().then(res => {
          if (res.code == 200) {
            this.yearList = res.data;
          }
        });
      } else if (this.type == this.lszl) {
        queryLszlGroupListApi().then(res => {
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
      if (this.type == this.rd) {
        pageRdDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.rdTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.qxtpf) {
        pageQxtpfDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.qxtpfTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.zl) {
        pageZlDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.zlTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.lszl) {
        pageLszlDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.lszlTableData = res.data.records;
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
      if (this.type == this.rd) {
        this.rdTitle = '新增数据';
        this.rdFormFlag = true;
        this.rdData.pid = undefined;
        Object.assign(this.rdData, this.copyData.rdData);
      } else if (this.type == this.qxtpf) {
        this.qxtpfTitle = '新增数据';
        this.qxtpfFormFlag = true;
        this.qxtpfData.pid = undefined;
        Object.assign(this.qxtpfData, this.copyData.qxtpfData);
      } else if (this.type == this.zl) {
        this.zlTitle = '新增数据';
        this.zlFormFlag = true;
        this.zlData.pid = undefined;
        Object.assign(this.zlData, this.copyData.zlData);
      } else if (this.type == this.lszl) {
        this.lszlTitle = '新增数据';
        this.lszlFormFlag = true;
        this.lszlData.pid = undefined;
        Object.assign(this.lszlData, this.copyData.lszlData);
      }
    },
    handleEdit(row) {
      if (this.type == this.rd) {
        this.rdTitle = '编辑数据';
        this.rdFormFlag = true;
        Object.assign(this.rdData, row);
      } else if (this.type == this.qxtpf) {
        this.qxtpfTitle = '编辑数据';
        this.qxtpfFormFlag = true;
        Object.assign(this.qxtpfData, row);
      } else if (this.type == this.zl) {
        this.zlTitle = '编辑数据';
        this.zlFormFlag = true;
        Object.assign(this.zlData, row);
      } else if (this.type == this.lszl) {
        this.lszlTitle = '编辑数据';
        this.lszlFormFlag = true;
        Object.assign(this.lszlData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.rd) {
          delRdDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.qxtpf) {
          delQxtpfDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.zl) {
          delZlDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initYearList();
            }
          });
        } else if (this.type == this.lszl) {
          delLszlDataApi(row.pid).then(res => {
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
      if (this.type == this.rd) {
        this.rdFormFlag = false;
      } else if (this.type == this.qxtpf) {
        this.qxtpfFormFlag = false;
      } else if (this.type == this.zl) {
        this.zlFormFlag = false;
      } else if (this.type == this.lszl) {
        this.lszlFormFlag = false;
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