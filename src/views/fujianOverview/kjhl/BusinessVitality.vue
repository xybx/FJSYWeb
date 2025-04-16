<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='区县人均各类POI数量' :name='poi'>
      </el-tab-pane>
      <el-tab-pane label='餐饮、咖啡厅、甜品店数量及人均' :name='cykfttpdsljrj'>
      </el-tab-pane>
      <el-tab-pane label='商场、便利店数量' :name='scbld'>
      </el-tab-pane>
      <el-tab-pane label='特色商业街、娱乐场所数量' :name='tssyjylcs'>
      </el-tab-pane>
      <el-tab-pane label='数据注释信息' :name='remark'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>

      <div v-if='type == poi'>
        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.areaName' placeholder='根据行政区名称模糊搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>
      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if='type == poi' type='primary' icon='el-icon-search' class='handle-del mr10'
                       @click='buttonGetPageData'>
              查询
            </el-button>
            <el-button v-if='type == poi' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增区县人均各类POI数量数据
            </el-button>
            <el-button v-if='type == cykfttpdsljrj' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增餐饮、咖啡厅、甜品店数量及人均数据
            </el-button>
            <el-button v-if='type == scbld' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增商场、便利店数据
            </el-button>
            <el-button v-if='type == tssyjylcs' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增特色商业街、娱乐场所数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button v-if='type == poi && total != 0' type='danger' icon='el-icon-delete' class='handle-del mr10'
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

    <div v-if='type == poi'>
      <el-table style='font-size: 15px' :data='poiTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='cateringValue' label='每万人餐饮服务设施保有量（个/万人）' align='center'></el-table-column>
        <el-table-column prop='shoppingValue' label='每万人购物休闲服务设施保有量（个/万人）' align='center'></el-table-column>
        <el-table-column prop='accommodationValue' label='每万人住宿服务设施保有量（个/万人）' align='center'></el-table-column>
        <el-table-column prop='financeValue' label='每万人金融保险服务设施保有量（个/万人）' align='center'></el-table-column>
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

    <div v-if='type == cykfttpdsljrj'>
      <el-table style='font-size: 15px' :data='cykfttpdsljrjTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='cy' label='餐饮相关场所数量（人/个）' align='center'></el-table-column>
        <el-table-column prop='cyg' label='茶艺馆数量（人/个）' align='center'></el-table-column>
        <el-table-column prop='gbd' label='糕饼店（人/个）' align='center'></el-table-column>
        <el-table-column prop='kft' label='咖啡厅数量（人/个）' align='center'></el-table-column>
        <el-table-column prop='kcd' label='快餐店数量（人/个）' align='center'></el-table-column>
        <el-table-column prop='lyd' label='冷饮店数量（人/个）' align='center'></el-table-column>
        <el-table-column prop='tpd' label='甜品店数量（人/个）' align='center'></el-table-column>
        <el-table-column prop='wgct' label='外国餐厅数量（人/个）' align='center'></el-table-column>
        <el-table-column prop='rjxxcy' label='人均休闲餐饮场所数量/个' align='center'></el-table-column>
        <el-table-column prop='rjzct' label='人均中餐厅数量/个' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == scbld'>
      <el-table style='font-size: 15px' :data='scbldTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='shop' label='便民商店/便利店' align='center'></el-table-column>
        <el-table-column prop='market' label='商场' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == tssyjylcs'>
      <el-table style='font-size: 15px' :data='tssyjylcsTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='地区' align='center'></el-table-column>
        <el-table-column prop='specialStreet' label='特色商业街' align='center'></el-table-column>
        <el-table-column prop='theater' label='影剧院' align='center'></el-table-column>
        <el-table-column prop='amusePlace' label='娱乐场所' align='center'></el-table-column>
        <el-table-column prop='exercisePlace' label='运动场馆' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == remark'>
      <el-form :model='remarkData' ref='remarkDataRef' :rules='remarkDataRules' label-width='300px'>
        <el-form-item label='区县人均各类POI数据注释：' prop='poiRemark'>
          <el-input class='input-width' v-model.trim='remarkData.poiRemark'></el-input>
        </el-form-item>
        <el-form-item label='餐饮、咖啡厅、甜品店数量及人均数据注释：' prop='cykfttpdsljrjRemark'>
          <el-input class='input-width' v-model.trim='remarkData.cykfttpdsljrjRemark'></el-input>
        </el-form-item>
        <el-form-item label='商场、便利店数据注释：' prop='scbldRemark'>
          <el-input class='input-width' v-model.trim='remarkData.scbldRemark'></el-input>
        </el-form-item>
        <el-form-item label='特色商业街、娱乐场所数量数据注释：' prop='tssyjylcsRemark'>
          <el-input class='input-width' v-model.trim='remarkData.tssyjylcsRemark'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="submit('remarkDataRef')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title='poiTitle'
               :visible.sync='poiFormFlag'
               width='40%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='poiDataRef' :model='poiData' :rules='poiDataRules' label-width='400px'>
        <el-form-item label='区县名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='poiData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='每万人餐饮服务设施保有量（个/万人）：' prop='cateringValue'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='poiData.cateringValue'></el-input-number>
        </el-form-item>

        <el-form-item label='每万人购物休闲服务设施保有量（个/万人）：' prop='shoppingValue'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='poiData.shoppingValue'></el-input-number>
        </el-form-item>

        <el-form-item label='每万人住宿服务设施保有量（个/万人）：' prop='accommodationValue'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='poiData.accommodationValue'></el-input-number>
        </el-form-item>

        <el-form-item label='每万人金融保险服务设施保有量（个/万人）：' prop='financeValue'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='poiData.financeValue'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='poiData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("poiDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='cykfttpdsljrjTitle'
               :visible.sync='cykfttpdsljrjFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='cykfttpdsljrjDataRef' :model='cykfttpdsljrjData' :rules='cykfttpdsljrjDataRules'
               label-width='250px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='cykfttpdsljrjData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='餐饮相关场所数量（人/个）：' prop='cy'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='cykfttpdsljrjData.cy'></el-input-number>
        </el-form-item>

        <el-form-item label='茶艺馆数量（人/个）：' prop='cyg'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='cykfttpdsljrjData.cyg'></el-input-number>
        </el-form-item>

        <el-form-item label='糕饼店（人/个）：' prop='gbd'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='cykfttpdsljrjData.gbd'></el-input-number>
        </el-form-item>

        <el-form-item label='咖啡厅数量（人/个）：' prop='kft'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='cykfttpdsljrjData.kft'></el-input-number>
        </el-form-item>

        <el-form-item label='快餐店数量（人/个）：' prop='kcd'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='cykfttpdsljrjData.kcd'></el-input-number>
        </el-form-item>

        <el-form-item label='冷饮店数量（人/个）：' prop='lyd'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='cykfttpdsljrjData.lyd'></el-input-number>
        </el-form-item>

        <el-form-item label='甜品店数量（人/个）：' prop='tpd'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='cykfttpdsljrjData.tpd'></el-input-number>
        </el-form-item>

        <el-form-item label='外国餐厅数量（人/个）：' prop='wgct'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='cykfttpdsljrjData.wgct'></el-input-number>
        </el-form-item>

        <el-form-item label='人均休闲餐饮场所数量/个：' prop='rjxxcy'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='cykfttpdsljrjData.rjxxcy'></el-input-number>
        </el-form-item>

        <el-form-item label='人均中餐厅数量/个：' prop='rjzct'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='cykfttpdsljrjData.rjzct'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='cykfttpdsljrjData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("cykfttpdsljrjDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='scbldTitle'
               :visible.sync='scbldFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='scbldDataRef' :model='scbldData' :rules='scbldDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='scbldData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='便民商店/便利店：' prop='shop'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='scbldData.shop'></el-input-number>
        </el-form-item>

        <el-form-item label='商场：' prop='market'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='scbldData.market'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='scbldData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("scbldDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='tssyjylcsTitle'
               :visible.sync='tssyjylcsFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='tssyjylcsDataRef' :model='tssyjylcsData' :rules='tssyjylcsDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='tssyjylcsData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='特色商业街：' prop='specialStreet'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='tssyjylcsData.specialStreet'></el-input-number>
        </el-form-item>

        <el-form-item label='影剧院：' prop='theater'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='tssyjylcsData.theater'></el-input-number>
        </el-form-item>

        <el-form-item label='娱乐场所：' prop='amusePlace'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='tssyjylcsData.amusePlace'></el-input-number>
        </el-form-item>

        <el-form-item label='运动场馆：' prop='exercisePlace'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='tssyjylcsData.exercisePlace'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='tssyjylcsData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("tssyjylcsDataRef")'>确 定</el-button>
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
  savePoiDataApi
  , editPoiDataApi
  , delPoiDataApi
  , pagePoiDataApi
  , clearPoiDataApi
} from '../api/kjhl/BusinessVitalityApi';
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
  name: 'businessVitality',
  data() {
    return {
      code: 'syhl',
      type: '空间活力-商业活力-区县人均各类poi数量',
      poi: '空间活力-商业活力-区县人均各类poi数量',
      cykfttpdsljrj: '空间活力-商业活力、餐饮、咖啡厅、甜品店数量及人均',
      scbld: '空间活力-商业活力-商场、便利店数量',
      tssyjylcs: '空间活力-商业活力-特色商业街、娱乐场所数量',
      remark: '空间活力-商业活力-数据注释信息',

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

      poiTableData: [],
      cykfttpdsljrjTableData: [],
      scbldTableData: [],
      tssyjylcsTableData: [],
      xzqNameList: [],
      poiData: {
        areaName: undefined,
        serial: 0,
        cateringValue: 0,
        shoppingValue: 0,
        accommodationValue: 0,
        financeValue: 0
      },
      cykfttpdsljrjData: {
        areaName: undefined,
        serial: 0,
        cy: 0,
        cyg: 0,
        gbd: 0,
        kft: 0,
        kcd: 0,
        lyd: 0,
        tpd: 0,
        wgct: 0,
        rjxxcy: 0,
        rjzct: 0
      },
      scbldData: {
        areaName: undefined,
        serial: 0,
        shop: 0,
        market: 0
      },
      tssyjylcsData: {
        areaName: undefined,
        serial: 0,
        specialStreet: 0,
        theater: 0,
        amusePlace: 0,
        exercisePlace: 0
      },
      remarkData: {
        poiRemark: undefined,
        cykfttpdsljrjRemark: undefined,
        scbldRemark: undefined,
        tssyjylcsRemark: undefined
      },
      poiDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        cateringValue: [{ required: true, message: '餐饮服务设施保有量数据不能为空', trigger: 'blur' }],
        shoppingValue: [{ required: true, message: '购物休闲服务设施保有量数据不能为空', trigger: 'blur' }],
        accommodationValue: [{ required: true, message: '住宿服务设施保有量数据不能为空', trigger: 'blur' }],
        financeValue: [{ required: true, message: '金融保险服务设施保有量数据不能为空', trigger: 'blur' }]
      },
      cykfttpdsljrjDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        cy: [{ required: true, message: '餐饮相关场所数量数据不能为空', trigger: 'blur' }],
        cyg: [{ required: true, message: '茶艺馆数量数据不能为空', trigger: 'blur' }],
        gbd: [{ required: true, message: '糕饼店数据不能为空', trigger: 'blur' }],
        kft: [{ required: true, message: '咖啡厅数量数据不能为空', trigger: 'blur' }],
        kcd: [{ required: true, message: '快餐店数量数据不能为空', trigger: 'blur' }],
        lyd: [{ required: true, message: '冷饮店数量数据不能为空', trigger: 'blur' }],
        tpd: [{ required: true, message: '甜品店数量数据不能为空', trigger: 'blur' }],
        wgct: [{ required: true, message: '外国餐厅数量数据不能为空', trigger: 'blur' }],
        rjxxcy: [{ required: true, message: '人均休闲餐饮场所数量数据不能为空', trigger: 'blur' }],
        rjzct: [{ required: true, message: '人均中餐厅数量数据不能为空', trigger: 'blur' }]
      },
      scbldDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        shop: [{ required: true, message: '便民商店/便利店数量数据不能为空', trigger: 'blur' }],
        market: [{ required: true, message: '商场数量数据不能为空', trigger: 'blur' }]
      },
      tssyjylcsDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        specialStreet: [{ required: true, message: '特色商业街数量数据不能为空', trigger: 'blur' }],
        theater: [{ required: true, message: '影剧院数量数据不能为空', trigger: 'blur' }],
        amusePlace: [{ required: true, message: '娱乐场所数量数据不能为空', trigger: 'blur' }],
        exercisePlace: [{ required: true, message: '运动场馆数量数据不能为空', trigger: 'blur' }]
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }]
      },
      remarkDataRules: {},
      queryParam: {
        page: 1,
        pageSize: 10,
        areaName: undefined
      },
      total: 0,
      poiTitle: '新增数据',
      poiFormFlag: false,
      cykfttpdsljrjTitle: '新增数据',
      cykfttpdsljrjFormFlag: false,
      scbldTitle: '新增数据',
      scbldFormFlag: false,
      tssyjylcsTitle: '新增数据',
      tssyjylcsFormFlag: false,
      copyData: {
        poiData: {
          areaName: undefined,
          serial: 0,
          cateringValue: 0,
          shoppingValue: 0,
          accommodationValue: 0,
          financeValue: 0
        },
        cykfttpdsljrjData: {
          areaName: undefined,
          serial: 0,
          cy: 0,
          cyg: 0,
          gbd: 0,
          kft: 0,
          kcd: 0,
          lyd: 0,
          tpd: 0,
          wgct: 0,
          rjxxcy: 0,
          rjzct: 0
        },
        scbldData: {
          areaName: undefined,
          serial: 0,
          shop: 0,
          market: 0
        },
        tssyjylcsData: {
          areaName: undefined,
          serial: 0,
          specialStreet: 0,
          theater: 0,
          amusePlace: 0,
          exercisePlace: 0
        },
        remarkData: {
          poiRemark: undefined,
          cykfttpdsljrjRemark: undefined,
          scbldRemark: undefined,
          tssyjylcsRemark: undefined
        },
        queryParam: {
          page: 1,
          pageSize: 10,
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
    clearData() {
      this.$confirm('确认根据筛选条件清空全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            if (this.type == this.poi) {
              clearPoiDataApi(this.queryParam).then(res => {
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
          if (this.type == this.poi) {
            if (this.poiData.pid) {
              // 更新
              editPoiDataApi(this.poiData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.poiFormFlag = false;
                  this.getPageData();
                }
              });
            } else {
              // 新增
              savePoiDataApi(this.poiData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.poiFormFlag = false;
                  this.getPageData();
                }
              });
            }
          } else if (this.type != this.poi) {
            // 存储json数据
            let params = {
              code: this.type,
              jsonValue: undefined,
              type: 1
            };
            if (this.type == this.cykfttpdsljrj) {
              params.jsonValue = JSON.stringify(this.cykfttpdsljrjData);
            } else if (this.type == this.scbld) {
              params.jsonValue = JSON.stringify(this.scbldData);
            } else if (this.type == this.tssyjylcs) {
              params.jsonValue = JSON.stringify(this.tssyjylcsData);
            } else if (this.type == this.remark) {
              params.type = 0;
              params.jsonValue = JSON.stringify(this.remarkData);
            }
            saveJsonDataApi(params).then(res => {
              if (res.code == 200) {
                this.$message.success('操作成功！');
                this.cykfttpdsljrjFormFlag = false;
                this.scbldFormFlag = false;
                this.tssyjylcsFormFlag = false;
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
      if (this.type != this.poi) {
        // json数据
        getJsonDataByCodeApi({ code: this.type }).then(res => {
          if (res.code == 200) {
            if (this.type == this.cykfttpdsljrj) {
              if (res.data == '') {
                this.cykfttpdsljrjTableData = [];
              } else {
                this.cykfttpdsljrjTableData = JSON.parse(res.data);
              }
            } else if (this.type == this.scbld) {
              if (res.data == '') {
                this.scbldTableData = [];
              } else {
                this.scbldTableData = JSON.parse(res.data);
              }
            } else if (this.type == this.tssyjylcs) {
              if (res.data == '') {
                this.tssyjylcsTableData = [];
              } else {
                this.tssyjylcsTableData = JSON.parse(res.data);
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
      } else if (this.type == this.poi) {
        pagePoiDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.poiTableData = res.data.records;
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
    },
    addData() {
      if (this.type == this.poi) {
        this.poiTitle = '新增数据';
        this.poiFormFlag = true;
        this.poiData.pid = undefined;
        Object.assign(this.poiData, this.copyData.poiData);
      } else if (this.type == this.cykfttpdsljrj) {
        this.cykfttpdsljrjTitle = '新增数据';
        this.cykfttpdsljrjFormFlag = true;
        this.cykfttpdsljrjData.pid = undefined;
        Object.assign(this.cykfttpdsljrjData, this.copyData.cykfttpdsljrjData);
      } else if (this.type == this.scbld) {
        this.scbldTitle = '新增数据';
        this.scbldFormFlag = true;
        this.scbldData.pid = undefined;
        Object.assign(this.scbldData, this.copyData.scbldData);
      } else if (this.type == this.tssyjylcs) {
        this.tssyjylcsTitle = '新增数据';
        this.tssyjylcsFormFlag = true;
        this.tssyjylcsData.pid = undefined;
        Object.assign(this.tssyjylcsData, this.copyData.tssyjylcsData);
      }
    },
    handleEdit(row) {
      if (this.type == this.poi) {
        this.poiTitle = '编辑数据';
        this.poiFormFlag = true;
        Object.assign(this.poiData, row);
      } else if (this.type == this.cykfttpdsljrj) {
        this.cykfttpdsljrjTitle = '编辑数据';
        this.cykfttpdsljrjFormFlag = true;
        Object.assign(this.cykfttpdsljrjData, row);
      } else if (this.type == this.scbld) {
        this.scbldTitle = '编辑数据';
        this.scbldFormFlag = true;
        Object.assign(this.scbldData, row);
      } else if (this.type == this.tssyjylcs) {
        this.tssyjylcsTitle = '编辑数据';
        this.tssyjylcsFormFlag = true;
        Object.assign(this.tssyjylcsData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type != this.poi) {
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
        } else if (this.type == this.poi) {
          delPoiDataApi(row.pid).then(res => {
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
      if (this.type == this.poi) {
        this.poiFormFlag = false;
      } else if (this.type == this.cykfttpdsljrj) {
        this.cykfttpdsljrjFormFlag = false;
      } else if (this.type == this.scbld) {
        this.scbldFormFlag = false;
      } else if (this.type == this.tssyjylcs) {
        this.tssyjylcsFormFlag = false;
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