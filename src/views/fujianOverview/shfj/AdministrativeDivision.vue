<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='行政区数量' :name='xzqsl'>
      </el-tab-pane>
      <el-tab-pane label='福建几大河流' :name='fjjdhl'>
      </el-tab-pane>
      <el-tab-pane label='陆海情况' :name='lhqk'>
      </el-tab-pane>
      <el-tab-pane label='山峰、海峡海湾及岛屿' :name='sfhxhwjdy'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>
      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if="type == lhqk" type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增陆海情况数据
            </el-button>
            <el-button v-if="type == sfhxhwjdy" type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增山峰、海峡海湾及岛屿数据
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

    <div v-if='type == xzqsl' class='first-div'>
      <el-form :model='xzqslData' ref='xzqslDataRef' :rules='xzqslDataRule' label-width='100px'>
        <el-form-item label='地市：' prop='city'>
          <el-input-number class='input-width' :min='0' v-model.number='xzqslData.city'></el-input-number>
        </el-form-item>
        <el-form-item label='区县：' prop='county'>
          <el-input-number class='input-width' :min='0' v-model.number='xzqslData.county'></el-input-number>
        </el-form-item>
        <el-form-item label='镇街：' prop='street'>
          <el-input-number class='input-width' :min='0' v-model.number='xzqslData.street'></el-input-number>
        </el-form-item>
        <el-form-item label='社区村庄：' prop='village'>
          <el-input-number class='input-width' :min='0' v-model.number='xzqslData.village'></el-input-number>
        </el-form-item>
        <el-form-item label='社区：' prop='community'>
          <el-input-number class='input-width' :min='0' v-model.number='xzqslData.community'></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="submitJson('xzqslDataRef')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if='type == fjjdhl'>
      <el-row style='margin-left: 110px'>
        <el-col :span='5'>
          流域面积：平方千米
        </el-col>
        <el-col :span='7'>
          水系长度：km
        </el-col>
      </el-row>
      <el-form :model='fjjdhlData' ref='fjjdhlDataRef' :rules='fjjdhlDataRule' label-width='100px'>

        <el-row :gutter='20' type='flex'>
          <el-col :span='4'>
            <el-form-item label='闽江：' prop='mjlymj'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.mjlymj'></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item prop='mjsxcd'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.mjsxcd'></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row :gutter='20' type='flex'>
          <el-col :span='4'>
            <el-form-item label='九龙江：' prop='jljlymj'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.jljlymj'></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item prop='jljsxcd'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.jljsxcd'></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20' type='flex'>
          <el-col :span='4'>
            <el-form-item label='汀江：' prop='tjlymj'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.tjlymj'></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item prop='tjsxcd'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.tjsxcd'></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20' type='flex'>
          <el-col :span='4'>
            <el-form-item label='晋江：' prop='jjlymj'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.jjlymj'></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item prop='jjsxcd'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.jjsxcd'></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20' type='flex'>
          <el-col :span='4'>
            <el-form-item label='赛江：' prop='sjlymj'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.sjlymj'></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item prop='sjsxcd'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.sjsxcd'></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter='20' type='flex'>
          <el-col :span='4'>
            <el-form-item label='木兰溪：' prop='mlxlymj'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.mlxlymj'></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item prop='mlxsxcd'>
              <el-input-number class='jdhl-input-width' :min='0' v-model.number='fjjdhlData.mlxsxcd'></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type='primary' @click="submitJson('fjjdhlDataRef')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if='type == lhqk'>
      <el-table style='font-size: 15px' :data='lhqkTableData' border class='table' ref='multipleTable' :default-sort = "{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='landArea' label='陆地面积' align='center' ></el-table-column>
        <el-table-column prop='seaArea' label='海域面积' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleJsonEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleJsonDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == sfhxhwjdy'>
      <el-table style='font-size: 15px' :data='sfhxhwjdyTableData' border class='table' ref='multipleTable' :default-sort = "{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='peakNumber' label='山峰数量' align='center'></el-table-column>
        <el-table-column prop='straitNumber' label='海峡海湾数量' align='center' ></el-table-column>
        <el-table-column prop='landNumber' label='岛屿数量' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleJsonEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleJsonDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="lhqkTitle"
               :visible.sync='lhqkFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='lhqkDataRef' :model='lhqkData' :rules='lhqkDataRules' label-width='150px'>
          <el-form-item label='行政区名称：' prop='areaName'>
              <el-select class='jdhl-input-width' v-model='lhqkData.areaName' placeholder='请选择行政区'>
                <el-option
                    v-for='(item, index) in xzqNameList'
                    :key='item.stringnum'
                    :label='item.stringnum'
                    :value='item.stringnum'
                ></el-option>
              </el-select>
          </el-form-item>

          <el-form-item label='陆地面积：' prop='landArea'>
            <el-input-number class='jdhl-input-width' :min='0' v-model.number='lhqkData.landArea'></el-input-number>
          </el-form-item>

          <el-form-item label='海域面积：' prop='seaArea'>
            <el-input-number class='jdhl-input-width' :min='0' v-model.number='lhqkData.seaArea'></el-input-number>
          </el-form-item>

          <el-form-item label='序号：' prop='serial'>
            <el-input-number class='jdhl-input-width' :min='0' v-model.number='lhqkData.serial'></el-input-number>
          </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submitJson("lhqkDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title="sfhxhwjdyTitle"
               :visible.sync='sfhxhwjdyFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='sfhxhwjdyDataRef' :model='sfhxhwjdyData' :rules='sfhxhwjdyDataRules' label-width='150px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='jdhl-input-width' v-model='sfhxhwjdyData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='山峰数量：' prop='peakNumber'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sfhxhwjdyData.peakNumber'></el-input-number>
        </el-form-item>

        <el-form-item label='海峡海湾数量：' prop='straitNumber'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sfhxhwjdyData.straitNumber'></el-input-number>
        </el-form-item>

        <el-form-item label='岛屿数量：' prop='landNumber'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sfhxhwjdyData.landNumber'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sfhxhwjdyData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submitJson("sfhxhwjdyDataRef")'>确 定</el-button>
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

    <el-dialog title='底图配置' custom-class="my-dialog" :visible.sync='baseMap' width='50%' :close-on-click-modal='false'
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

    <el-dialog title='添加底图配置' custom-class="my-dialog" :visible.sync='baseMapData' width='30%' :close-on-click-modal='false'
               :before-close='handleImportDataClose'>


      <el-form ref='baseMapFormRef' :model='baseMapForm' :rules='baseMapFormRules' label-width='150px'>
        <el-form-item label='底图名称：' prop='name'>
          <el-input class='jdhl-input-width' v-model.trim='baseMapForm.name'></el-input>
        </el-form-item>

        <el-form-item label='底图地址：' prop='url'>
          <el-input class='jdhl-input-width' v-model.trim='baseMapForm.url'></el-input>
        </el-form-item>

        <el-form-item label='底图类型：' prop='type'>
          <el-select v-model="baseMapForm.type" placeholder="请选择类型">
            <el-option
                v-for="(item, index) in baseMapTypeList"
                :key="index"
                :label="item.DICTNAME"
                :value="item.DICTVALUE"
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
  , saveJsonDataApi
  , delJsonDataApi
  , getDictByCodeApi
  , exportExcel
  , getImportUrl, saveBaseMapApi, getBaseMapListApi, delBaseMapApi, editBaseMapApi, getServerTypeApi, choseImportMode
} from '@/views/fujianOverview/api/FjoPublicApi';

export default {
  name: 'administrativeDivision',
  data() {
    return {
      code: "xzqh",
      type: '山海福建-行政区划-行政区数量',
      xzqsl: '山海福建-行政区划-行政区数量',
      fjjdhl: '山海福建-行政区划-福建几大河流',
      lhqk: '山海福建-行政区划-陆海情况',
      sfhxhwjdy: '山海福建-行政区划-山峰、海峡海湾及岛屿',

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

      xzqNameList: [],
      xzqslData: {
        city: 0,
        county: 0,
        street: 0,
        village: 0,
        community: 0
      },
      xzqslDataRule: {
        city: [{ required: true, message: '地市数据不能为空', trigger: 'blur' }, { type: 'number', message: '地市数据必须为数字值' }],
        county: [{ required: true, message: '区县数据不能为空', trigger: 'blur' }, { type: 'number', message: '区县数据必须为数字值' }],
        street: [{ required: true, message: '镇街数据不能为空', trigger: 'blur' }, { type: 'number', message: '镇街数据必须为数字值' }],
        village: [{ required: true, message: '社区村庄数据不能为空', trigger: 'blur' }, { type: 'number', message: '村庄数据必须为数字值' }],
        community: [{ required: true, message: '社区数据不能为空', trigger: 'blur' }, { type: 'number', message: '村庄数据必须为数字值' }],
      },
      fjjdhlData: {
        mjlymj: 0,
        mjsxcd: 0,
        jljlymj: 0,
        jljsxcd: 0,
        tjlymj: 0,
        tjsxcd: 0,
        jjlymj: 0,
        jjsxcd: 0,
        sjlymj: 0,
        sjsxcd: 0,
        mlxlymj: 0,
        mlxsxcd: 0,
      },
      fjjdhlDataRule: {
        mjlymj: [{ required: true, message: '闽江流域面积数据不能为空', trigger: 'blur' }, { type: 'number', message: '闽江流域面积数据必须为数字值' }],
        mjsxcd: [{ required: true, message: '闽江水系长度数据不能为空', trigger: 'blur' }, { type: 'number', message: '闽江水系长度数据必须为数字值' }],
        jljlymj: [{ required: true, message: '九龙江流域面积数据不能为空', trigger: 'blur' }, { type: 'number', message: '九龙江流域面积数据必须为数字值' }],
        jljsxcd: [{ required: true, message: '九龙江水系长度数据不能为空', trigger: 'blur' }, { type: 'number', message: '九龙江水系长度数据必须为数字值' }],
        tjlymj: [{ required: true, message: '汀江流域面积数据不能为空', trigger: 'blur' }, { type: 'number', message: '汀江流域面积数据必须为数字值' }],
        tjsxcd: [{ required: true, message: '汀江水系长度数据不能为空', trigger: 'blur' }, { type: 'number', message: '汀江水系长度数据必须为数字值' }],
        jjlymj: [{ required: true, message: '晋江流域面积数据不能为空', trigger: 'blur' }, { type: 'number', message: '晋江流域面积数据必须为数字值' }],
        jjsxcd: [{ required: true, message: '晋江水系长度数据不能为空', trigger: 'blur' }, { type: 'number', message: '晋江水系长度数据必须为数字值' }],
        sjlymj: [{ required: true, message: '赛江流域面积数据不能为空', trigger: 'blur' }, { type: 'number', message: '赛江流域面积数据必须为数字值' }],
        sjsxcd: [{ required: true, message: '赛江水系长度数据不能为空', trigger: 'blur' }, { type: 'number', message: '赛江水系长度数据必须为数字值' }],
        mlxlymj: [{ required: true, message: '木兰溪流域面积数据不能为空', trigger: 'blur' }, { type: 'number', message: '木兰溪流域面积数据必须为数字值' }],
        mlxsxcd: [{ required: true, message: '木兰溪水系长度数据不能为空', trigger: 'blur' }, { type: 'number', message: '木兰溪水系长度数据必须为数字值' }],
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }],
      },
      lhqkTableData: [],
      lhqkData: {
        serial: 0,
        areaName: undefined,
        landArea: 0,
        seaArea: 0
      },
      lhqkDataRules: {
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        landArea: [{ required: true, message: '陆地面积数据不能为空', trigger: 'blur' }],
        seaArea: [{ required: true, message: '海域面积数据不能为空', trigger: 'blur' }],
        areaName: [{ required: true, message: '行政区名称数据不能为空', trigger: 'change' }],
      },
      sfhxhwjdyTableData: [],
      sfhxhwjdyData: {
        serial: 0,
        areaName: undefined,
        peakNumber: 0,
        straitNumber: 0,
        landNumber: 0
      },
      sfhxhwjdyDataRules: {
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        areaName: [{ required: true, message: '行政区名称数据不能为空', trigger: 'change' }],
        peakNumber: [{ required: true, message: '山峰数量数据不能为空', trigger: 'blur' }],
        straitNumber: [{ required: true, message: '海峡海湾数量数据不能为空', trigger: 'blur' }],
        landNumber: [{ required: true, message: '岛屿数量数据不能为空', trigger: 'blur' }],
      },
      lhqkTitle: '新增数据',
      sfhxhwjdyTitle: '新增数据',
      lhqkFormFlag: false,
      sfhxhwjdyFormFlag: false,
      dataCopy: {
        xzqslData: {
          city: 0,
          county: 0,
          street: 0,
          village: 0
        },
        fjjdhlData: {
          mjlymj: 0,
          mjsxcd: 0,
          jljlymj: 0,
          jljsxcd: 0,
          tjlymj: 0,
          tjsxcd: 0,
          jjlymj: 0,
          jjsxcd: 0,
          sjlymj: 0,
          sjsxcd: 0,
          mlxlymj: 0,
          mlxsxcd: 0,
        },
        lhqkData: {
          serial: 0,
          areaName: undefined,
          landArea: 0,
          seaArea: 0
        },
        sfhxhwjdyData: {
          serial: 0,
          areaName: undefined,
          peakNumber: 0,
          straitNumber: 0,
          landNumber: 0
        },
        baseMapForm: {
          name: undefined,
          url: undefined,
          type: undefined,
          code: undefined
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
      }
    }
  },
  mounted() {
    this.initJsonData();
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
      })
    },
    getBaseMapList() {
      getBaseMapListApi({code: this.code}).then(res => {
        if (res.code == 200) {
          this.baseMapList = res.data;
        }
      })
    },
    submitBaseMap(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          if (this.baseMapForm.pid != null || this.baseMapForm.pid != undefined) {
            editBaseMapApi(this.baseMapForm).then(res => {
              if (res.code == 200) {
                this.$message.success("修改成功！");
                this.baseMapData = false;
                this.getBaseMapList();
              }
            })
          } else {
            this.baseMapForm.code = this.code;
            saveBaseMapApi(this.baseMapForm).then(res => {
              if (res.code == 200) {
                this.$message.success("添加成功！");
                this.baseMapData = false;
                this.getBaseMapList();
              }
            })
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
          this.$message.success("删除成功！");
          this.getBaseMapList();
        }
      })
    },
    addBaseMapData() {
      this.baseMapData = true;
      this.baseMapForm.pid = undefined;
      Object.assign(this.baseMapForm, this.dataCopy.baseMapForm);
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
        this.initJsonData();
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
              this.initJsonData();
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
              this.initJsonData();
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
      getDictByCodeApi({code:"xzq"}).then(res => {
        if (res.code == 200) {
          this.xzqNameList = res.data;
          this.xzqNameList = this.xzqNameList.sort((a, b) => a.pid - b.pid);
        }
      })
    },
    submitJson(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 存储json数据
          let params = this.initParams();
          saveJsonDataApi(params).then(res => {
            if (res.code == 200) {
              this.$message.success('操作成功！');
              this.initJsonData();
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
    handleClick() {
      this.initJsonData();
    },
    addData() {
      if (this.type == this.lhqk) {
        this.lhqkFormFlag = true;
        this.lhqkTitle = '新增数据';
        Object.assign(this.lhqkData, this.dataCopy.lhqkData);
      } else if (this.type == this.sfhxhwjdy) {
        this.sfhxhwjdyFormFlag = true;
        this.sfhxhwjdyTitle = '新增数据';
        Object.assign(this.sfhxhwjdyData, this.dataCopy.sfhxhwjdyData);
      }
    },
    handleJsonEdit(row) {
      if (this.type == this.lhqk) {
        this.lhqkFormFlag = true;
        this.lhqkTitle = '编辑数据';
        Object.assign(this.lhqkData, row);
      } else if (this.type == this.sfhxhwjdy) {
        this.sfhxhwjdyFormFlag = true;
        this.sfhxhwjdyTitle = '编辑数据';
        Object.assign(this.sfhxhwjdyData, row);
      }
    },
    handleJsonDelete(row) {

      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        let params = {
          code: this.type,
          pid: row.pid
        }
        delJsonDataApi(params).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功！");
            this.initJsonData(res.data);
          }
        })
      }).catch(_ => {
      });
    },
    handleClose() {
      if (this.type == this.lhqk) {
        this.lhqkData.pid = undefined;
        this.lhqkFormFlag = false;
      } else if (this.type == this.sfhxhwjdy) {
        this.sfhxhwjdyFormFlag = false;
        this.sfhxhwjdyData.pid = undefined;
      }
    },
    initParams() {
      let params = {
        code: this.type
      };
      if (this.type == this.xzqsl) {
        params.jsonValue = JSON.stringify(this.xzqslData);
        params.type = 0;
      } else if (this.type == this.fjjdhl) {
        params.jsonValue = JSON.stringify(this.fjjdhlData);
        params.type = 0;
      } else if (this.type == this.lhqk) {
        params.jsonValue = JSON.stringify(this.lhqkData);
        params.type = 1;
      } else if (this.type == this.sfhxhwjdy) {
        params.jsonValue = JSON.stringify(this.sfhxhwjdyData);
        params.type = 1;
      }
      return params;
    },
    initData(data) {
      if (this.type == this.xzqsl) {
        if (data == '') {
          Object.assign(this.xzqslData, this.dataCopy.xzqslData);
        } else {
          this.xzqslData = JSON.parse(data);
        }
      } else if (this.type == this.fjjdhl) {
        if (data == '') {
          Object.assign(this.fjjdhlData, this.dataCopy.fjjdhlData);
        } else {
          this.fjjdhlData = JSON.parse(data);
        }
      } else if (this.type == this.lhqk) {
        if (data == '') {
          this.lhqkTableData = [];
        } else {
          this.lhqkTableData = JSON.parse(data);
        }
        this.lhqkFormFlag = false;
      } else if (this.type == this.sfhxhwjdy) {
        if (data == '') {
          this.sfhxhwjdyTableData = [];
        } else {
          this.sfhxhwjdyTableData = JSON.parse(data);
        }
        this.sfhxhwjdyFormFlag = false;
      }
    },
    initJsonData() {
      getJsonDataByCodeApi({ code: this.type }).then(res => {
        if (res.code == 200) {
          this.initData(res.data);
        } else {

        }
      });

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

.jdhl-input-width {
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