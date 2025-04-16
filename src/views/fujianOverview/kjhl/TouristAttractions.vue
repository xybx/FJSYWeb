<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='全省风景名胜区' :name='qsfjq'>
      </el-tab-pane>
      <el-tab-pane label='全省风景名胜区数量' :name='qsfjqsl'>
      </el-tab-pane>
      <el-tab-pane label='人均酒店民宿数量' :name='rjjdmssl'>
      </el-tab-pane>
      <el-tab-pane label='酒店数量排名' :name='jdslpm'>
      </el-tab-pane>
      <el-tab-pane label='民宿数量排名' :name='msslpm'>
      </el-tab-pane>
      <el-tab-pane label='数据注释信息' :name='remark'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>

      <div v-if='type == qsfjq'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.type' clearable placeholder='请选择景区等级'>
            <el-option
                v-for='(item, index) in levelList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keyWord' placeholder='根据景区名称或地址搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>
      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if='type == qsfjq' type='primary' icon='el-icon-search' class='handle-del mr10'
                       @click='buttonGetPageData'>
              查询
            </el-button>
            <el-button v-if='type == qsfjq' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增全省风景名胜区数据
            </el-button>
            <el-button v-if='type == qsfjqsl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增全省风景名胜区数量数据
            </el-button>
            <el-button v-if='type == rjjdmssl' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增人均酒店民宿数量数据
            </el-button>
            <el-button v-if='type == jdslpm' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增酒店数量排名数据
            </el-button>
            <el-button v-if='type == msslpm' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增民宿数量排名数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>

            <el-button v-if='type == qsfjq && total != 0' type='danger' icon='el-icon-delete' class='handle-del mr10'
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

    <div v-if='type == qsfjq'>
      <el-table style='font-size: 15px' :data='qsfjqTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='name' label='景区名称' align='center'></el-table-column>
        <el-table-column prop='address' label='地址' align='center'></el-table-column>
        <el-table-column prop='level' label='等级' align='center'></el-table-column>
        <el-table-column prop='areaName' label='城市' align='center'></el-table-column>
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

    <div v-if='type == qsfjqsl'>
      <el-table style='font-size: 15px' :data='qsfjqslTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='towANumber' label='2A' align='center'></el-table-column>
        <el-table-column prop='threeANumber' label='3A' align='center'></el-table-column>
        <el-table-column prop='fourANumber' label='4A' align='center'></el-table-column>
        <el-table-column prop='fiveANumber' label='5A' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == rjjdmssl'>
      <el-table style='font-size: 15px' :data='rjjdmsslTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='peopleHotelAvg' label='人均酒店（万人/个）' align='center'></el-table-column>
        <el-table-column prop='peopleHomestayAvg' label='人均民宿（万人/个）' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == jdslpm'>
      <el-table style='font-size: 15px' :data='jdslpmTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='hotelTotal' label='酒店数量汇总（个）' align='center'></el-table-column>
        <el-table-column prop='rank' label='排名' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == msslpm'>
      <el-table style='font-size: 15px' :data='msslpmTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='行政区名称' align='center'></el-table-column>
        <el-table-column prop='homestayTotal' label='民宿数量汇总（个）' align='center'></el-table-column>
        <el-table-column prop='rank' label='排名' align='center'></el-table-column>
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
        <el-form-item label='全省风景区数据注释：' prop='qsfjqRemark'>
          <el-input class='input-width' v-model.trim='remarkData.qsfjqRemark'></el-input>
        </el-form-item>
        <el-form-item label='人均酒店民宿数量数据注释：' prop='rjjdmsslRemark'>
          <el-input class='input-width' v-model.trim='remarkData.rjjdmsslRemark'></el-input>
        </el-form-item>
        <el-form-item label='酒店排名数量数据注释：' prop='jdslpmRemark'>
          <el-input class='input-width' v-model.trim='remarkData.jdslpmRemark'></el-input>
        </el-form-item>
        <el-form-item label='民宿数量排名数据注释：' prop='msslpmRemark'>
          <el-input class='input-width' v-model.trim='remarkData.msslpmRemark'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="submit('remarkDataRef')">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :title='qsfjqTitle'
               :visible.sync='qsfjqFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='qsfjqDataRef' :model='qsfjqData' :rules='qsfjqDataRules' label-width='200px'>

        <el-form-item label='景区名称：' prop='name'>
          <el-input class='fjjdhl-input-width' v-model.trim='qsfjqData.name'></el-input>
        </el-form-item>

        <el-form-item label='地址：' prop='address'>
          <el-input class='fjjdhl-input-width' v-model.trim='qsfjqData.address'></el-input>
        </el-form-item>

        <el-form-item label='等级：' prop='level'>
          <el-select class='fjjdhl-input-width' v-model='qsfjqData.level' placeholder='请选择等级'>
            <el-option
                v-for='(item, index) in levelList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='城市：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model='qsfjqData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='qsfjqData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("qsfjqDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='qsfjqslTitle'
               :visible.sync='qsfjqslFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='qsfjqslDataRef' :model='qsfjqslData' :rules='qsfjqslDataRules' label-width='200px'>

        <el-form-item label='行政区名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='qsfjqslData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='2A：' prop='towANumber'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qsfjqslData.towANumber'></el-input-number>
        </el-form-item>

        <el-form-item label='3A：' prop='threeANumber'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qsfjqslData.threeANumber'></el-input-number>
        </el-form-item>

        <el-form-item label='4A：' prop='fourANumber'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qsfjqslData.fourANumber'></el-input-number>
        </el-form-item>

        <el-form-item label='5A：' prop='fiveANumber'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='qsfjqslData.fiveANumber'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='qsfjqslData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("qsfjqslDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='rjjdmsslTitle'
               :visible.sync='rjjdmsslFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='rjjdmsslDataRef' :model='rjjdmsslData' :rules='rjjdmsslDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='rjjdmsslData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='人均酒店(万人/个）：' prop='peopleHotelAvg'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='rjjdmsslData.peopleHotelAvg'></el-input-number>
        </el-form-item>

        <el-form-item label='人均民宿(万人/个）：' prop='peopleHomestayAvg'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='rjjdmsslData.peopleHomestayAvg'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='rjjdmsslData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("rjjdmsslDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='jdslpmTitle'
               :visible.sync='jdslpmFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='jdslpmDataRef' :model='jdslpmData' :rules='jdslpmDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='jdslpmData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='酒店数量汇总（个）：' prop='hotelTotal'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='jdslpmData.hotelTotal'></el-input-number>
        </el-form-item>

        <el-form-item label='排名：' prop='rank'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='jdslpmData.rank'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='jdslpmData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("jdslpmDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='msslpmTitle'
               :visible.sync='msslpmFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='msslpmDataRef' :model='msslpmData' :rules='msslpmDataRules' label-width='200px'>
        <el-form-item label='行政区划名称：' prop='areaName'>
          <el-select class='fjjdhl-input-width' v-model='msslpmData.areaName' placeholder='请选择行政区'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='民宿数量汇总（个）：' prop='homestayTotal'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='msslpmData.homestayTotal'></el-input-number>
        </el-form-item>

        <el-form-item label='排名：' prop='rank'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='msslpmData.rank'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='msslpmData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("msslpmDataRef")'>确 定</el-button>
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
  saveFjmsqDataApi
  , editFjmsqDataApi
  , delFjmsqDataApi
  , pageFjmsqDataApi
  , clearFjmsqDataApi
} from '../api/kjhl/TouristAttractionsApi';
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
  name: 'touristAttractions',
  data() {
    return {
      code: 'lyjd',
      type: '空间活力-旅游景点-全省风景区',
      qsfjq: '空间活力-旅游景点-全省风景区',
      qsfjqsl: '空间活力-旅游景点-风景区数量',
      rjjdmssl: '空间活力-旅游景点-人均酒店民宿数量',
      jdslpm: '空间活力-旅游景点-酒店数量排名',
      msslpm: '空间活力-旅游景点-民宿数量排名',
      remark: '空间活力-旅游景点-数据注释信息',

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

      qsfjqTableData: [],
      qsfjqslTableData: [],
      rjjdmsslTableData: [],
      jdslpmTableData: [],
      msslpmTableData: [],
      xzqNameList: [],

      qsfjqData: {
        serial: 0,
        name: undefined,
        address: undefined,
        level: undefined,
        areaName: undefined
      },
      qsfjqslData: {
        serial: 0,
        areaName: undefined,
        towANumber: 0,
        threeANumber: 0,
        fourANumber: 0,
        fiveANumber: 0
      },
      rjjdmsslData: {
        areaName: undefined,
        serial: 0,
        peopleHotelAvg: 0,
        peopleHomestayAvg: 0
      },
      jdslpmData: {
        areaName: undefined,
        serial: 0,
        hotelTotal: 0,
        rank: 0
      },
      msslpmData: {
        areaName: undefined,
        serial: 0,
        homestayTotal: 0,
        rank: 0
      },
      remarkData: {
        qsfjqRemark: undefined,
        rjjdmsslRemark: undefined,
        jdslpmRemark: undefined,
        msslpmRemark: undefined
      },
      qsfjqDataRules: {
        name: [{ required: true, message: '景区名称数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址数据不能为空', trigger: 'blur' }],
        level: [{ required: true, message: '等级数据不能为空', trigger: 'change' }],
        areaName: [{ required: true, message: '城市数据不能为空', trigger: 'blur' }]
      },
      qsfjqslDataRules: {
        areaName: [{ required: true, message: '行政区名称数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        towANumber: [{ required: true, message: '2A数据不能为空', trigger: 'blur' }],
        threeANumber: [{ required: true, message: '3A数据不能为空', trigger: 'blur' }],
        fourANumber: [{ required: true, message: '4A数据不能为空', trigger: 'blur' }],
        fiveANumber: [{ required: true, message: '5A数据不能为空', trigger: 'blur' }]
      },
      rjjdmsslDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        peopleHotelAvg: [{ required: true, message: '人均酒店数据不能为空', trigger: 'blur' }],
        peopleHomestayAvg: [{ required: true, message: '人均民宿数据不能为空', trigger: 'blur' }]
      },
      jdslpmDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        hotelTotal: [{ required: true, message: '酒店数量汇总数据不能为空', trigger: 'blur' }],
        rank: [{ required: true, message: '排名数据不能为空', trigger: 'blur' }]
      },
      msslpmDataRules: {
        areaName: [{ required: true, message: '行政区数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        homestayTotal: [{ required: true, message: '民宿数量汇总数据不能为空', trigger: 'blur' }],
        rank: [{ required: true, message: '影剧院数量数据不能为空', trigger: 'blur' }]
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }]
      },
      remarkDataRules: {},
      levelList: [
        {
          name: '2A'
        },
        {
          name: '3A'
        },
        {
          name: '4A'
        },
        {
          name: '5A'
        }
      ],
      queryParam: {
        page: 1,
        pageSize: 10,
        keyWord: undefined,
        type: undefined
      },
      total: 0,
      qsfjqTitle: '新增数据',
      qsfjqFormFlag: false,
      qsfjqslTitle: '新增数据',
      qsfjqslFormFlag: false,
      rjjdmsslTitle: '新增数据',
      rjjdmsslFormFlag: false,
      jdslpmTitle: '新增数据',
      jdslpmFormFlag: false,
      msslpmTitle: '新增数据',
      msslpmFormFlag: false,
      copyData: {
        qsfjqData: {
          serial: 0,
          name: undefined,
          address: undefined,
          level: undefined,
          areaName: undefined
        },
        qsfjqslData: {
          serial: 0,
          areaName: undefined,
          towANumber: 0,
          threeANumber: 0,
          fourANumber: 0,
          fiveANumber: 0
        },
        rjjdmsslData: {
          areaName: undefined,
          serial: 0,
          peopleHotelAvg: 0,
          peopleHomestayAvg: 0
        },
        jdslpmData: {
          areaName: undefined,
          serial: 0,
          hotelTotal: 0,
          rank: 0
        },
        msslpmData: {
          areaName: undefined,
          serial: 0,
          homestayTotal: 0,
          rank: 0
        },
        remarkData: {
          qsfjqRemark: undefined,
          rjjdmsslRemark: undefined,
          jdslpmRemark: undefined,
          msslpmRemark: undefined
        },
        queryParam: {
          page: 1,
          pageSize: 10,
          keyWord: undefined,
          type: undefined
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
            if (this.type == this.qsfjq) {
              clearFjmsqDataApi(this.queryParam).then(res => {
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
          if (this.type == this.qsfjq) {
            if (this.qsfjqData.pid) {
              // 更新
              editFjmsqDataApi(this.qsfjqData).then(res => {
                this.$message.success('编辑成功！');
                this.qsfjqFormFlag = false;
                this.getPageData();
              });
            } else {
              // 新增
              saveFjmsqDataApi(this.qsfjqData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.qsfjqFormFlag = false;
                  this.getPageData();
                }
              });
            }
          } else if (this.type != this.qsfjq) {
            // 存储json数据
            let params = {
              code: this.type,
              jsonValue: undefined,
              type: 1
            };
            if (this.type == this.rjjdmssl) {
              params.jsonValue = JSON.stringify(this.rjjdmsslData);
            } else if (this.type == this.jdslpm) {
              params.jsonValue = JSON.stringify(this.jdslpmData);
            } else if (this.type == this.qsfjqsl) {
              params.jsonValue = JSON.stringify(this.qsfjqslData);
            } else if (this.type == this.msslpm) {
              params.jsonValue = JSON.stringify(this.msslpmData);
            } else if (this.type == this.remark) {
              params.type = 0;
              params.jsonValue = JSON.stringify(this.remarkData);
            }
            saveJsonDataApi(params).then(res => {
              if (res.code == 200) {
                this.$message.success('操作成功！');
                this.rjjdmsslFormFlag = false;
                this.qsfjqslFormFlag = false;
                this.jdslpmFormFlag = false;
                this.msslpmFormFlag = false;
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
      if (this.type != this.qsfjq) {
        // json数据
        getJsonDataByCodeApi({ code: this.type }).then(res => {
          if (res.code == 200) {
            if (this.type == this.rjjdmssl) {
              if (res.data == '') {
                this.rjjdmsslTableData = [];
              } else {
                this.rjjdmsslTableData = JSON.parse(res.data);
              }
            } else if (this.type == this.qsfjqsl) {
              if (res.data == '') {
                this.qsfjqslTableData = [];
              } else {
                this.qsfjqslTableData = JSON.parse(res.data);
              }
            } else if (this.type == this.jdslpm) {
              if (res.data == '') {
                this.jdslpmTableData = [];
              } else {
                this.jdslpmTableData = JSON.parse(res.data);
              }
            } else if (this.type == this.msslpm) {
              if (res.data == '') {
                this.msslpmTableData = [];
              } else {
                this.msslpmTableData = JSON.parse(res.data);
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
      } else if (this.type == this.qsfjq) {
        pageFjmsqDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.qsfjqTableData = res.data.records;
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
      if (this.type == this.qsfjq) {
        this.qsfjqTitle = '新增数据';
        this.qsfjqFormFlag = true;
        this.qsfjqData.pid = undefined;
        Object.assign(this.qsfjqData, this.copyData.qsfjqData);
      } else if (this.type == this.qsfjqsl) {
        this.qsfjqslTitle = '新增数据';
        this.qsfjqslFormFlag = true;
        this.qsfjqslData.pid = undefined;
        Object.assign(this.qsfjqslData, this.copyData.qsfjqslData);
      } else if (this.type == this.rjjdmssl) {
        this.rjjdmsslTitle = '新增数据';
        this.rjjdmsslFormFlag = true;
        this.rjjdmsslData.pid = undefined;
        Object.assign(this.rjjdmsslData, this.copyData.rjjdmsslData);
      } else if (this.type == this.jdslpm) {
        this.jdslpmTitle = '新增数据';
        this.jdslpmFormFlag = true;
        this.jdslpmData.pid = undefined;
        Object.assign(this.jdslpmData, this.copyData.jdslpmData);
      } else if (this.type == this.msslpm) {
        this.msslpmTitle = '新增数据';
        this.msslpmFormFlag = true;
        this.msslpmData.pid = undefined;
        Object.assign(this.msslpmData, this.copyData.msslpmData);
      }
    },
    handleEdit(row) {
      if (this.type == this.qsfjq) {
        this.qsfjqTitle = '编辑数据';
        this.qsfjqFormFlag = true;
        Object.assign(this.qsfjqData, row);
      } else if (this.type == this.qsfjqsl) {
        this.qsfjqslTitle = '编辑数据';
        this.qsfjqslFormFlag = true;
        Object.assign(this.qsfjqslData, row);
      } else if (this.type == this.rjjdmssl) {
        this.rjjdmsslTitle = '编辑数据';
        this.rjjdmsslFormFlag = true;
        Object.assign(this.rjjdmsslData, row);
      } else if (this.type == this.jdslpm) {
        this.jdslpmTitle = '编辑数据';
        this.jdslpmFormFlag = true;
        Object.assign(this.jdslpmData, row);
      } else if (this.type == this.msslpm) {
        this.msslpmTitle = '编辑数据';
        this.msslpmFormFlag = true;
        Object.assign(this.msslpmData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type != this.qsfjq) {
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
        } else if (this.type == this.qsfjq) {
          delFjmsqDataApi(row.pid).then(res => {
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
      if (this.type == this.qsfjq) {
        this.qsfjqFormFlag = false;
      } else if (this.type == this.qsfjqsl) {
        this.qsfjqslFormFlag = false;
      } else if (this.type == this.rjjdmssl) {
        this.rjjdmsslFormFlag = false;
      } else if (this.type == this.jdslpm) {
        this.jdslpmFormFlag = false;
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