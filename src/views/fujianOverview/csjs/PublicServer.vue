<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='科教文化数量' :name='kjwhsl'>
      </el-tab-pane>
      <el-tab-pane label='幼小中职高' :name='yxzzg'>
      </el-tab-pane>
      <el-tab-pane label='养老设施覆盖率' :name='ylssfgl'>
      </el-tab-pane>
      <el-tab-pane label='公园绿地覆盖率' :name='gyldfgl'>
      </el-tab-pane>
      <el-tab-pane label='二级及以上医院数量' :name='ejjysyysl'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>

      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <!--            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板-->
            <!--            </el-button>-->
            <!--            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据-->
            <!--            </el-button>-->
            <el-button v-if='type == kjwhsl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增科教文化数量数据
            </el-button>
            <el-button v-if='type == yxzzg' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增幼小中职高数据
            </el-button>
            <el-button v-if='type == ylssfgl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增养老设施覆盖率数据
            </el-button>
            <el-button v-if='type == gyldfgl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增公园绿地覆盖率数据
            </el-button>
            <el-button v-if='type == ejjysyysl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增二级及以上医院数量数据
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

    <div v-if='type == kjwhsl'>
      <el-table style='font-size: 15px' :data='kjwhslTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='science' label='科技馆' align='center'></el-table-column>
        <el-table-column prop='museum' label='博物馆' align='center'></el-table-column>
        <el-table-column prop='culture' label='文化宫' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == yxzzg'>
      <el-table style='font-size: 15px' :data='yxzzgTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='kindergarten' label='幼儿园' align='center'></el-table-column>
        <el-table-column prop='primarySchool' label='小学' align='center'></el-table-column>
        <el-table-column prop='middleSchool' label='中学' align='center'></el-table-column>
        <el-table-column prop='vti' label='职业技术学校' align='center'></el-table-column>
        <el-table-column prop='universities' label='高等院校' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == ylssfgl'>
      <el-table style='font-size: 15px' :data='ylssfglTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='value' label='养老设施覆盖率（%）' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == gyldfgl'>
      <el-table style='font-size: 15px' :data='gyldfglTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='value' label='公园绿地覆盖率（%）' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == ejjysyysl'>
      <el-table style='font-size: 15px' :data='ejjysyyslTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='hospital' label='二级及以上医院数量' align='center'></el-table-column>
        <el-table-column prop='bedNumber' label='人均床位数（张/千人）' align='center'></el-table-column>
        <el-table-column prop='hospitalRate' label='医院覆盖率（%）' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title='kjwhslTitle'
               :visible.sync='kjwhslFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='kjwhslDataRef' :model='kjwhslData' :rules='kjwhslDataRules' label-width='200px'>

        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='kjwhslData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='科技馆：' prop='science'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='kjwhslData.science'></el-input-number>
        </el-form-item>

        <el-form-item label='博物馆：' prop='museum'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='kjwhslData.museum'></el-input-number>
        </el-form-item>

        <el-form-item label='文化宫：' prop='culture'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='kjwhslData.culture'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='kjwhslData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("kjwhslDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='yxzzgTitle'
               :visible.sync='yxzzgFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='yxzzgDataRef' :model='yxzzgData' :rules='yxzzgDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='yxzzgData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='幼儿园：' prop='kindergarten'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='yxzzgData.kindergarten'></el-input-number>
        </el-form-item>

        <el-form-item label='小学：' prop='primarySchool'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='yxzzgData.primarySchool'></el-input-number>
        </el-form-item>

        <el-form-item label='中学：' prop='middleSchool'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='yxzzgData.middleSchool'></el-input-number>
        </el-form-item>

        <el-form-item label='职业技术学校：' prop='vti'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='yxzzgData.vti'></el-input-number>
        </el-form-item>

        <el-form-item label='高等院校：' prop='universities'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='yxzzgData.universities'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='yxzzgData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("yxzzgDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='ylssfglTitle'
               :visible.sync='ylssfglFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='ylssfglDataRef' :model='ylssfglData' :rules='ylssfglDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='ylssfglData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='养老设施覆盖率：' prop='value'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='ylssfglData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='ylssfglData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("ylssfglDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='gyldfglTitle'
               :visible.sync='gyldfglFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='gyldfglDataRef' :model='gyldfglData' :rules='gyldfglDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='gyldfglData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='公园绿地覆盖率：' prop='value'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='gyldfglData.value'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='gyldfglData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("gyldfglDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='ejjysyyslTitle'
               :visible.sync='ejjysyyslFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='ejjysyyslDataRef' :model='ejjysyyslData' :rules='ejjysyyslDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='ejjysyyslData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='二级及以上医院数量：' prop='hospital'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='ejjysyyslData.hospital'></el-input-number>
        </el-form-item>

        <el-form-item label='人均床位数（张/千人）：' prop='bedNumber'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='ejjysyyslData.bedNumber'></el-input-number>
        </el-form-item>

        <el-form-item label='医院覆盖率：' prop='hospitalRate'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='ejjysyyslData.hospitalRate'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='ejjysyyslData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("ejjysyyslDataRef")'>确 定</el-button>
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
      code: 'ggfw',
      type: '城市建设-公共服务-科教文化数量',
      kjwhsl: '城市建设-公共服务-科教文化数量',
      yxzzg: '城市建设-公共服务-幼小中职高',
      ylssfgl: '城市建设-公共服务-养老设施覆盖率',
      gyldfgl: '城市建设-公共服务-公园绿地覆盖率',
      ejjysyysl: '城市建设-公共服务-二级及以上医院数量',

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

      kjwhslTableData: [],
      yxzzgTableData: [],
      ylssfglTableData: [],
      gyldfglTableData: [],
      ejjysyyslTableData: [],
      xzqNameList: [],

      kjwhslData: {
        serial: 0,
        areaName: undefined,
        science: 0,
        museum: 0,
        culture: 0
      },
      yxzzgData: {
        areaName: undefined,
        serial: 0,
        kindergarten: 0,
        primarySchool: 0,
        middleSchool: 0,
        vti: 0,
        universities: 0
      },
      ylssfglData: {
        areaName: undefined,
        serial: 0,
        value: 0
      },
      gyldfglData: {
        areaName: undefined,
        serial: 0,
        value: 0
      },
      ejjysyyslData: {
        areaName: undefined,
        serial: 0,
        hospital: 0,
        bedNumber: 0,
        hospitalRate: 0
      },
      kjwhslDataRules: {
        areaName: [{ required: true, message: '行政区名称数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        science: [{ required: true, message: '科技馆数量数据不能为空', trigger: 'blur' }],
        culture: [{ required: true, message: '文化宫数量数据不能为空', trigger: 'blur' }],
        museum: [{ required: true, message: '博物馆数量数据不能为空', trigger: 'blur' }]
      },
      yxzzgDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        kindergarten: [{ required: true, message: '幼儿园数量数据不能为空', trigger: 'blur' }],
        primarySchool: [{ required: true, message: '小学数量数据不能为空', trigger: 'blur' }],
        middleSchool: [{ required: true, message: '中学数量数据不能为空', trigger: 'blur' }],
        vti: [{ required: true, message: '职业技术学院数量数据不能为空', trigger: 'blur' }],
        universities: [{ required: true, message: '高等院校数量数据不能为空', trigger: 'blur' }]
      },
      ylssfglDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '养老设施覆盖率数据不能为空', trigger: 'blur' }]
      },
      gyldfglDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '公园绿地覆盖率数据不能为空', trigger: 'blur' }]
      },
      ejjysyyslDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        hospital: [{ required: true, message: '二级及以上医院数量数据不能为空', trigger: 'blur' }],
        bedNumber: [{ required: true, message: '人均床位数数据不能为空', trigger: 'blur' }],
        hospitalRate: [{ required: true, message: '医院覆盖率数据不能为空', trigger: 'blur' }]
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }]
      },
      kjwhslTitle: '新增数据',
      kjwhslFormFlag: false,
      yxzzgTitle: '新增数据',
      yxzzgFormFlag: false,
      ylssfglTitle: '新增数据',
      ylssfglFormFlag: false,
      gyldfglTitle: '新增数据',
      gyldfglFormFlag: false,
      ejjysyyslTitle: '新增数据',
      ejjysyyslFormFlag: false,
      copyData: {
        kjwhslData: {
          serial: 0,
          areaName: undefined,
          science: 0,
          museum: 0,
          culture: 0
        },
        yxzzgData: {
          areaName: undefined,
          serial: 0,
          kindergarten: 0,
          primarySchool: 0,
          middleSchool: 0,
          vti: 0,
          universities: 0
        },
        ylssfglData: {
          areaName: undefined,
          serial: 0,
          value: 0
        },
        gyldfglData: {
          areaName: undefined,
          serial: 0,
          value: 0
        },
        ejjysyyslData: {
          areaName: undefined,
          serial: 0,
          hospital: 0,
          bedNumber: 0,
          hospitalRate: 0
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
          // 存储json数据
          let params = {
            code: this.type,
            jsonValue: undefined,
            type: 1
          };
          if (this.type == this.yxzzg) {
            params.jsonValue = JSON.stringify(this.yxzzgData);
          } else if (this.type == this.ylssfgl) {
            params.jsonValue = JSON.stringify(this.ylssfglData);
          } else if (this.type == this.kjwhsl) {
            params.jsonValue = JSON.stringify(this.kjwhslData);
          } else if (this.type == this.gyldfgl) {
            params.jsonValue = JSON.stringify(this.gyldfglData);
          } else if (this.type == this.ejjysyysl) {
            params.jsonValue = JSON.stringify(this.ejjysyyslData);
          }
          saveJsonDataApi(params).then(res => {
            if (res.code == 200) {
              this.$message.success('操作成功！');
              this.yxzzgFormFlag = false;
              this.kjwhslFormFlag = false;
              this.ylssfglFormFlag = false;
              this.gyldfglFormFlag = false;
              this.ejjysyyslFormFlag = false;
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
          if (this.type == this.yxzzg) {
            if (res.data == '') {
              this.yxzzgTableData = [];
            } else {
              this.yxzzgTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.kjwhsl) {
            if (res.data == '') {
              this.kjwhslTableData = [];
            } else {
              this.kjwhslTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.ylssfgl) {
            if (res.data == '') {
              this.ylssfglTableData = [];
            } else {
              this.ylssfglTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.gyldfgl) {
            if (res.data == '') {
              this.gyldfglTableData = [];
            } else {
              this.gyldfglTableData = JSON.parse(res.data);
            }
          } else if (this.type == this.ejjysyysl) {
            if (res.data == '') {
              this.ejjysyyslTableData = [];
            } else {
              this.ejjysyyslTableData = JSON.parse(res.data);
            }
          }
        }
      });
    },
    handleClick() {
      this.getPageData();
    },
    addData() {
      if (this.type == this.kjwhsl) {
        this.kjwhslTitle = '新增数据';
        this.kjwhslFormFlag = true;
        this.kjwhslData.pid = undefined;
        Object.assign(this.kjwhslData, this.copyData.kjwhslData);
      } else if (this.type == this.yxzzg) {
        this.yxzzgTitle = '新增数据';
        this.yxzzgFormFlag = true;
        this.yxzzgData.pid = undefined;
        Object.assign(this.yxzzgData, this.copyData.yxzzgData);
      } else if (this.type == this.ylssfgl) {
        this.ylssfglTitle = '新增数据';
        this.ylssfglFormFlag = true;
        this.ylssfglData.pid = undefined;
        Object.assign(this.ylssfglData, this.copyData.ylssfglData);
      } else if (this.type == this.gyldfgl) {
        this.gyldfglTitle = '新增数据';
        this.gyldfglFormFlag = true;
        this.gyldfglData.pid = undefined;
        Object.assign(this.gyldfglData, this.copyData.gyldfglData);
      } else if (this.type == this.ejjysyysl) {
        this.ejjysyyslTitle = '新增数据';
        this.ejjysyyslFormFlag = true;
        this.ejjysyyslData.pid = undefined;
        Object.assign(this.ejjysyyslData, this.copyData.ejjysyyslData);
      }
    },
    handleEdit(row) {
      if (this.type == this.kjwhsl) {
        this.kjwhslTitle = '编辑数据';
        this.kjwhslFormFlag = true;
        Object.assign(this.kjwhslData, row);
      } else if (this.type == this.yxzzg) {
        this.yxzzgTitle = '编辑数据';
        this.yxzzgFormFlag = true;
        Object.assign(this.yxzzgData, row);
      } else if (this.type == this.ylssfgl) {
        this.ylssfglTitle = '编辑数据';
        this.ylssfglFormFlag = true;
        Object.assign(this.ylssfglData, row);
      } else if (this.type == this.gyldfgl) {
        this.gyldfglTitle = '编辑数据';
        this.gyldfglFormFlag = true;
        Object.assign(this.gyldfglData, row);
      } else if (this.type == this.ejjysyysl) {
        this.ejjysyyslTitle = '编辑数据';
        this.ejjysyyslFormFlag = true;
        Object.assign(this.ejjysyyslData, row);
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
      if (this.type == this.kjwhsl) {
        this.kjwhslFormFlag = false;
      } else if (this.type == this.yxzzg) {
        this.yxzzgFormFlag = false;
      } else if (this.type == this.ylssfgl) {
        this.ylssfglFormFlag = false;
      } else if (this.type == this.gyldfgl) {
        this.gyldfglFormFlag = false;
      } else if (this.type == this.ejjysyysl) {
        this.ejjysyyslFormFlag = false;
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