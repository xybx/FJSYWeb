<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='生物多样性' :name='swdyx'>
      </el-tab-pane>
      <el-tab-pane label='海拔高度' :name='hbgd'>
      </el-tab-pane>
      <el-tab-pane label='三调地类面积' :name='sddlmj'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>

      <div v-if='type == sddlmj'>
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
            <el-button v-if='type == sddlmj' type='primary' icon='el-icon-search'
                       class='handle-del mr10' @click='buttonGetPageData'>
              查询
            </el-button>
            <el-button v-if="type == hbgd" type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增海拔高度数据
            </el-button>
            <el-button v-if="type == sddlmj" type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增三调地类面积数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button v-if='type == sddlmj && total != 0' type='danger' icon='el-icon-delete' class='handle-del mr10'
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

    <div v-if='type == swdyx' class='first-div'>
      <el-form :model='swdyxData' ref='swdyxDataRef' :rules='swdyxDataRule' label-width='300px'>
        <el-form-item label='国家重点保护陆生野生动物数量：' prop='ysdw'>
          <el-input-number class='input-width' :min='0' v-model.number='swdyxData.ysdw'></el-input-number>
        </el-form-item>
        <el-form-item label='国家重点保护野生植物及变种数量：' prop='zwjbz'>
          <el-input-number class='input-width' :min='0' v-model.number='swdyxData.zwjbz'></el-input-number>
        </el-form-item>
        <el-form-item label='哺乳动物数量：' prop='mammal'>
          <el-input-number class='input-width' :min='0' v-model.number='swdyxData.mammal'></el-input-number>
        </el-form-item>
        <el-form-item label='鸟类数量：' prop='bird'>
          <el-input-number class='input-width' :min='0' v-model.number='swdyxData.bird'></el-input-number>
        </el-form-item>
        <el-form-item label='爬行动物数量：' prop='reptile'>
          <el-input-number class='input-width' :min='0' v-model.number='swdyxData.reptile'></el-input-number>
        </el-form-item>
        <el-form-item label='两栖动物数量：' prop='amphibian'>
          <el-input-number class='input-width' :min='0' v-model.number='swdyxData.amphibian'></el-input-number>
        </el-form-item>
        <el-form-item label='兰科植物数量：' prop='orchid'>
          <el-input-number class='input-width' :min='0' v-model.number='swdyxData.orchid'></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="submitJson('swdyxDataRef')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if='type == hbgd'>
      <el-table style='font-size: 15px' :data='hbgdTableData' border class='table' ref='multipleTable' :default-sort = "{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='maxPeak' label='最高峰（米）' align='center' ></el-table-column>
        <el-table-column prop='avgAltitude' label='平均海拔（米）' align='center'></el-table-column>
        <el-table-column prop='maxPeakName' label='最高峰名称' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleJsonEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleJsonDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == sddlmj'>
      <el-table style='font-size: 15px' :data='sddlmjTableData' border class='table' ref='multipleTable' :default-sort = "{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='gd' label='耕地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='yd' label='园地面积（公顷）' align='center' ></el-table-column>
        <el-table-column prop='ld' label='林地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='cd' label='草地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='sfyd' label='商服用地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='gkccyd' label='工矿仓储用地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='zzyd' label='住宅用地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='ggglyggfwyd' label='公共管理与公共服务用地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='tsyd' label='特殊用地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='jtysyd' label='交通运输用地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='syjslssyd' label='水域及梳理设施用地面积（公顷）' align='center'></el-table-column>
        <el-table-column prop='qttd' label='其他土地面积（公顷）' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleJsonEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleJsonDelete(scope.row)' style='color:red'>删除
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

    <el-dialog :title="hbgdTitle"
               :visible.sync='hbgdFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='hbgdDataRef' :model='hbgdData' :rules='hbgdDataRules' label-width='150px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='jdhl-input-width' v-model='hbgdData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='最高峰（米）：' prop='maxPeak'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='hbgdData.maxPeak'></el-input-number>
        </el-form-item>

        <el-form-item label='平均海拔（米）：' prop='avgAltitude'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='hbgdData.avgAltitude'></el-input-number>
        </el-form-item>

        <el-form-item label='最高峰名称：' prop='maxPeakName'>
          <el-input class='jdhl-input-width' v-model='hbgdData.maxPeakName'></el-input>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='hbgdData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submitJson("hbgdDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title="sddlmjTitle"
               :visible.sync='sddlmjFormFlag'
               width='40%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='sddlmjDataRef' :model='sddlmjData' :rules='sddlmjDataRules' label-width='280px'>
        <el-form-item label='行政区名称：' prop='areaName'>
          <el-input class='jdhl-input-width' v-model.trim='sddlmjData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='耕地面积（公顷）：' prop='gd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.gd'></el-input-number>
        </el-form-item>

        <el-form-item label='园地面积（公顷）：' prop='yd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.yd'></el-input-number>
        </el-form-item>

        <el-form-item label='林地面积（公顷）：' prop='ld'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.ld'></el-input-number>
        </el-form-item>

        <el-form-item label='草地面积（公顷）：' prop='cd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.cd'></el-input-number>
        </el-form-item>

        <el-form-item label='商服用地面积（公顷）：' prop='sfyd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.sfyd'></el-input-number>
        </el-form-item>

        <el-form-item label='工矿仓储用地面积（公顷）：' prop='gkccyd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.gkccyd'></el-input-number>
        </el-form-item>

        <el-form-item label='住宅用地面积（公顷）：' prop='zzyd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.zzyd'></el-input-number>
        </el-form-item>

        <el-form-item label='公共管理与公共服务用地面积（公顷）：' prop='ggglyggfwyd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.ggglyggfwyd'></el-input-number>
        </el-form-item>

        <el-form-item label='特殊用地面积（公顷）：' prop='tsyd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.tsyd'></el-input-number>
        </el-form-item>

        <el-form-item label='交通运输用地面积（公顷）：' prop='jtysyd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.jtysyd'></el-input-number>
        </el-form-item>

        <el-form-item label='水域及水利设施用地面积（公顷）：' prop='syjslssyd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.syjslssyd'></el-input-number>
        </el-form-item>

        <el-form-item label='其他土地面积（公顷）：' prop='qttd'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.qttd'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='jdhl-input-width' :min='0' v-model.number='sddlmjData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submitJson("sddlmjDataRef")'>确 定</el-button>
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
import {
  saveSddlDataApi,
  editSddlDataApi,
  delSddlDataApi,
  pageSddlDataApi,
  clearSddlDataApi
} from '@/views/fujianOverview/api/zrxt/MountainWaterApi';
import { delCzgkDataApi } from '@/views/fujianOverview/api/zrxt/FarmResourceApi';
import { clearHscpclDataApi, clearHwttlDataApi } from '@/views/fujianOverview/api/zrxt/SeaSpaceApi';

export default {
  name: 'mountainWater',
  data() {
    return {
      code: "ssgj",
      type: '自然系统-山水格局-生物多样性',
      swdyx: '自然系统-山水格局-生物多样性',
      hbgd: '自然系统-山水格局-海拔高度',
      sddlmj: '自然系统-山水格局-三调地类面积',

      queryParam: {
        page: 1,
        pageSize: 10,
        areaName: undefined
      },
      total: 0,

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
      swdyxData: {
        ysdw: 0,
        zwjbz: 0,
        mammal: 0,
        bird: 0,
        reptile: 0,
        amphibian: 0,
        orchid: 0,
      },
      swdyxDataRule: {
        ysdw: [{ required: true, message: '国家重点保护陆生野生动物数量不能为空', trigger: 'blur' }, { type: 'number', message: '国家重点保护陆生野生动物数量必须为数字值' }],
        zwjbz: [{ required: true, message: '国家重点保护野生植物及变种数量不能为空', trigger: 'blur' }, { type: 'number', message: '国家重点保护野生植物及变种数量必须为数字值' }],
        mammal: [{ required: true, message: '哺乳动物数量不能为空', trigger: 'blur' }, { type: 'number', message: '哺乳动物数量必须为数字值' }],
        bird: [{ required: true, message: '鸟类数量不能为空', trigger: 'blur' }, { type: 'number', message: '鸟类数量必须为数字值' }],
        reptile: [{ required: true, message: '爬行动物数量不能为空', trigger: 'blur' }, { type: 'number', message: '爬行动物数量必须为数字值' }],
        amphibian: [{ required: true, message: '两栖动物数量不能为空', trigger: 'blur' }, { type: 'number', message: '两栖动物数量必须为数字值' }],
        orchid: [{ required: true, message: '兰科植物数量不能为空', trigger: 'blur' }, { type: 'number', message: '兰科植物数量必须为数字值' }],
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }],
      },
      hbgdTableData: [],
      hbgdData: {
        serial: 0,
        areaName: undefined,
        maxPeak: 0,
        avgAltitude: 0,
        maxPeakName: undefined
      },
      hbgdDataRules: {
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        areaName: [{ required: true, message: '行政区名称数据不能为空', trigger: 'change' }],
        maxPeak: [{ required: true, message: '最高峰数据不能为空', trigger: 'blur' }],
        maxPeakName: [{ required: true, message: '最高峰名称数据不能为空', trigger: 'blur' }],
        avgAltitude: [{ required: true, message: '平均海拔数据不能为空', trigger: 'blur' }],
      },
      sddlmjTableData: [],
      sddlmjData: {
        serial: 0,
        areaName: undefined,
        gd: 0,
        yd: 0,
        ld: 0,
        cd: 0,
        sfyd: 0,
        gkccyd: 0,
        zzyd: 0,
        ggglyggfwyd: 0,
        tsyd: 0,
        jtysyd: 0,
        syjslssyd: 0,
        qttd: 0,
      },
      sddlmjDataRules: {
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        areaName: [{ required: true, message: '行政区名称数据不能为空', trigger: 'change' }],
        gd: [{ required: true, message: '耕地数据不能为空', trigger: 'blur' }],
        yd: [{ required: true, message: '园地数据不能为空', trigger: 'blur' }],
        ld: [{ required: true, message: '林地数据不能为空', trigger: 'blur' }],
        cd: [{ required: true, message: '草地数据不能为空', trigger: 'blur' }],
        sfyd: [{ required: true, message: '商服用地数据不能为空', trigger: 'blur' }],
        gkccyd: [{ required: true, message: '工矿仓储用地数据不能为空', trigger: 'blur' }],
        zzyd: [{ required: true, message: '住宅用地数据不能为空', trigger: 'blur' }],
        ggglyggfwyd: [{ required: true, message: '公共管理与公共服务用地数据不能为空', trigger: 'blur' }],
        tsyd: [{ required: true, message: '特殊用地数据不能为空', trigger: 'blur' }],
        jtysyd: [{ required: true, message: '交通运输用地数据不能为空', trigger: 'blur' }],
        syjslssyd: [{ required: true, message: '水域及水利设施用地数据不能为空', trigger: 'blur' }],
        qttd: [{ required: true, message: '其他土地数据不能为空', trigger: 'blur' }],
      },
      hbgdTitle: '新增数据',
      sddlmjTitle: '新增数据',
      hbgdFormFlag: false,
      sddlmjFormFlag: false,
      dataCopy: {
        swdyxData: {
          ysdw: 0,
          zwjbz: 0,
          mammal: 0,
          bird: 0,
          reptile: 0,
          amphibian: 0,
          orchid: 0,
        },
        hbgdData: {
          serial: 0,
          areaName: undefined,
          maxPeak: 0,
          avgAltitude: 0,
          maxPeakName: undefined
        },
        sddlmjData: {
          serial: 0,
          areaName: undefined,
          gd: 0,
          yd: 0,
          ld: 0,
          cd: 0,
          sfyd: 0,
          gkccyd: 0,
          zzyd: 0,
          ggglyggfwyd: 0,
          tsyd: 0,
          jtysyd: 0,
          syjslssyd: 0,
          qttd: 0,
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
              if (this.type == this.sddlmj) {
                this.getPageData();
              } else {
                this.initJsonData();
              }
              this.initXzqNameList();
            }
          })
        }).catch(_ => {
          // 覆盖导入
          let data = {
            id: response.data.id,
            type: true
          }
          choseImportMode(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              // 关闭对话框，刷新列表
              this.importData = false;
              if (this.type == this.sddlmj) {
                this.getPageData();
              } else {
                this.initJsonData();
              }
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

    // 分页参数回调
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.getPageData();
    },
    handleCurrentChange(val) {
      this.queryParam.page = val;
      this.getPageData();
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
          if (this.type == this.sddlmj) {
            if (this.sddlmjData.pid) {
              // 更新
              editSddlDataApi(this.sddlmjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.sddlmjFormFlag = false;
                  this.getPageData();
                }
              });
            } else {
              // 新增
              saveSddlDataApi(this.sddlmjData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.sddlmjFormFlag = false;
                  this.getPageData();
                }
              });
            }
          } else {
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
          }
        } else {
          this.$message.error('请补充必填项');
          return false;
        }
      });
    },
    handleClick() {
      if (this.type == this.sddlmj) {
        this.getPageData();
      } else {
        this.initJsonData();
      }
    },
    addData() {
      if (this.type == this.hbgd) {
        this.hbgdFormFlag = true;
        this.hbgdTitle = '新增数据';
        Object.assign(this.hbgdData, this.dataCopy.hbgdData);
      } else if (this.type == this.sddlmj) {
        this.sddlmjFormFlag = true;
        this.sddlmjTitle = '新增数据';
        this.sddlmjData.pid = undefined;
        Object.assign(this.sddlmjData, this.dataCopy.sddlmjData);
      }
    },
    clearData() {
      this.$confirm('确认根据筛选条件清空全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
              clearSddlDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.dataCopy.queryParam);
                  this.getPageData();
                }
              });
          })
          .catch(_ => {
          });
    },
    handleJsonEdit(row) {
      if (this.type == this.hbgd) {
        this.hbgdFormFlag = true;
        this.hbgdTitle = '编辑数据';
        Object.assign(this.hbgdData, row);
      } else if (this.type == this.sddlmj) {
        this.sddlmjFormFlag = true;
        this.sddlmjTitle = '编辑数据';
        Object.assign(this.sddlmjData, row);
      }
    },
    handleJsonDelete(row) {

      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.sddlmj) {
          delSddlDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
            }
          });
        } else {
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
        }
      }).catch(_ => {
      });
    },
    handleClose() {
      if (this.type == this.hbgd) {
        this.hbgdData.pid = undefined;
        this.hbgdFormFlag = false;
      } else if (this.type == this.sddlmj) {
        this.sddlmjFormFlag = false;
        this.sddlmjData.pid = undefined;
      }
    },
    initParams() {
      let params = {
        code: this.type
      };
      if (this.type == this.swdyx) {
        params.jsonValue = JSON.stringify(this.swdyxData);
        params.type = 0;
      } if (this.type == this.hbgd) {
        params.jsonValue = JSON.stringify(this.hbgdData);
        params.type = 1;
      }
      return params;
    },
    initData(data) {
      if (this.type == this.swdyx) {
        if (data == '') {
          Object.assign(this.swdyxData, this.dataCopy.swdyxData);
        } else {
          this.swdyxData = JSON.parse(data);
        }
      } else if (this.type == this.hbgd) {
        if (data == '') {
          this.hbgdTableData = [];
        } else {
          this.hbgdTableData = JSON.parse(data);
        }
        this.hbgdFormFlag = false;
      }
    },
    initJsonData() {
      getJsonDataByCodeApi({ code: this.type }).then(res => {
        if (res.code == 200) {
          this.initData(res.data);
        }
      });

    },
    getPageData() {
      if (this.type == this.sddlmj) {
        pageSddlDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.sddlmjTableData = res.data.records;
            this.total = res.data.total;
          }
        })
      }
    },
    buttonGetPageData() {
      this.queryParam.page = 1;
      this.getPageData();
    },
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