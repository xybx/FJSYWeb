<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='历史文化名城镇村' :name='lswhmczc'>
      </el-tab-pane>
      <el-tab-pane label='传统村落' :name='ctcl'>
      </el-tab-pane>
      <el-tab-pane label='非遗、非物质文化遗产' :name='fywzwhyc'>
      </el-tab-pane>
      <el-tab-pane label='世界文化遗产' :name='sjwhyc'>
      </el-tab-pane>
      <el-tab-pane label='博物馆数量及类型' :name='bwgsljlx'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='5'>
      <div v-if='type == lswhmczc'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.type' clearable placeholder='请选择批次'>
            <el-option
                v-for='(item, index) in queryBatchList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span='3.5'>
          <el-select v-model='queryParam.areaName' clearable placeholder='请选择类型'>
            <el-option
                v-for='(item, index) in typeList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keyWord' placeholder='根据名称模糊搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>

      <div v-if='type == ctcl'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.areaName' clearable placeholder='请选择地市'>
            <el-option
                v-for='(item, index) in queryCityList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keyWord' placeholder='根据县、镇街、村落搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>

      <div v-if='type == fywzwhyc'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.type' clearable placeholder='请选择类别'>
            <el-option
                v-for='(item, index) in queryTypeList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keyWord' placeholder='根据名称、地址模糊搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>

      <div v-if='type == bwgsljlx'>
        <el-col :span='3.5'>
          <el-select v-model='queryParam.type' clearable placeholder='请质量等级'>
            <el-option
                v-for='(item, index) in queryLevelList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span='3.5'>
          <div class='grid-content bg-purple'>
            <div>
              <el-input v-model='queryParam.keyWord' placeholder='根据收藏单位名模糊搜索'></el-input>
            </div>
          </div>
        </el-col>
      </div>

      <el-col :span='15'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button v-if='type != sjwhyc' type='primary' icon='el-icon-search' class='handle-del mr10'
                       @click='buttonGetPageData'>
              查询
            </el-button>

            <el-button v-if='type == lswhmczc' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增历史文化名称镇村数据
            </el-button>
            <el-button v-if='type == ctcl' type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增传统村落数据
            </el-button>
            <el-button v-if='type == fywzwhyc' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增非遗、物质文化遗产数据
            </el-button>
            <el-button v-if='type == sjwhyc' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增世界文化遗产数据
            </el-button>
            <el-button v-if='type == bwgsljlx' type='primary' icon='el-icon-plus' class='handle-del mr10'
                       @click='addData'>
              新增博物馆数量及类型数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button v-if='type != sjwhyc && total != 0' type='danger' icon='el-icon-delete' class='handle-del mr10'
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

    <div v-if='type == lswhmczc'>
      <el-table style='font-size: 15px' :data='lswhmczcTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='name' label='名称' align='center'></el-table-column>
        <el-table-column prop='type' label='类型' align='center'></el-table-column>
        <el-table-column prop='batch' label='批次' align='center'></el-table-column>
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

    <div v-if='type == ctcl'>
      <el-table style='font-size: 15px' :data='ctclTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='city' label='市' align='center'></el-table-column>
        <el-table-column prop='county' label='县' align='center'></el-table-column>
        <el-table-column prop='townStreet' label='镇街' align='center'></el-table-column>
        <el-table-column prop='village' label='村落' align='center'></el-table-column>
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

    <div v-if='type == fywzwhyc'>
      <el-table style='font-size: 15px' :data='fywzwhycTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='name' label='非物质文化遗产名称' align='center'></el-table-column>
        <el-table-column prop='type' label='类别' align='center'></el-table-column>
        <el-table-column prop='address' label='地址' align='center' show-overflow-tooltip></el-table-column>
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

    <div v-if='type == sjwhyc'>
      <el-table style='font-size: 15px' :data='sjwhycTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='areaName' label='世界文化遗产名称' align='center'></el-table-column>
        <el-table-column prop='year' label='列入时间' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleDelete(scope.row)' style='color:red'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if='type == bwgsljlx'>
      <el-table style='font-size: 15px' :data='bwgsljlxTableData' border class='table' ref='multipleTable'
                :default-sort="{prop: 'serial'}">
        <el-table-column prop='serial' label='序号' align='center' :sortable='true' width='90'></el-table-column>
        <el-table-column prop='unitName' label='收藏单位名' align='center'></el-table-column>
        <el-table-column prop='type' label='性质' align='center'></el-table-column>
        <el-table-column prop='qualityLevel' label='质量等级' align='center'></el-table-column>
        <el-table-column prop='isFree' label='是否免费开放' align='center'></el-table-column>
        <el-table-column prop='collectionCount' label='藏品数（件）' align='center'></el-table-column>
        <el-table-column prop='preciousRelics' label='珍贵文物（件）' align='center'></el-table-column>
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

    <el-dialog :title='lswhmczcTitle'
               :visible.sync='lswhmczcFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='lswhmczcDataRef' :model='lswhmczcData' :rules='lswhmczcDataRules' label-width='200px'>

        <el-form-item label='类型：' prop='type'>
          <el-select class='fjjdhl-input-width' v-model='lswhmczcData.type' placeholder='请选类型'>
            <el-option
                v-for='(item, index) in typeList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='名称：' prop='name'>
          <el-input class='fjjdhl-input-width' v-model.trim='lswhmczcData.name'></el-input>
        </el-form-item>

        <el-form-item label='批次：' prop='batch'>
          <el-select class='fjjdhl-input-width' v-model='lswhmczcData.batch' placeholder='请选批次'>
            <el-option
                v-for='(item, index) in batchList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='lswhmczcData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("lswhmczcDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='ctclTitle'
               :visible.sync='ctclFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='ctclDataRef' :model='ctclData' :rules='ctclDataRules' label-width='150px'>

        <el-form-item label='地市：' prop='city'>
          <el-select class='fjjdhl-input-width' v-model='ctclData.city' placeholder='请选地市'>
            <el-option
                v-for='(item, index) in xzqNameList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='县区：' prop='county'>
          <el-input class='fjjdhl-input-width' v-model.trim='ctclData.county'></el-input>
        </el-form-item>

        <el-form-item label='镇街：' prop='townStreet'>
          <el-input class='fjjdhl-input-width' v-model.trim='ctclData.townStreet'></el-input>
        </el-form-item>

        <el-form-item label='村落：' prop='village'>
          <el-input class='fjjdhl-input-width' v-model.trim='ctclData.village'></el-input>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='ctclData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("ctclDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='fywzwhycTitle'
               :visible.sync='fywzwhycFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='fywzwhycDataRef' :model='fywzwhycData' :rules='fywzwhycDataRules' label-width='200px'>
        <el-form-item label='非物质文化遗产名称：' prop='name'>
          <el-input class='fjjdhl-input-width' v-model.trim='fywzwhycData.name'></el-input>
        </el-form-item>

        <el-form-item label='类别：' prop='type'>
          <el-select class='fjjdhl-input-width' v-model='fywzwhycData.type' placeholder='请选类别'>
            <el-option
                v-for='(item, index) in whyclxList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='地址：' prop='address'>
          <el-input class='fjjdhl-input-width' v-model.trim='fywzwhycData.address'></el-input>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='fywzwhycData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("fywzwhycDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='sjwhycTitle'
               :visible.sync='sjwhycFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='sjwhycDataRef' :model='sjwhycData' :rules='sjwhycDataRules' label-width='200px'>
        <el-form-item label='世界文化遗产名称：' prop='areaName'>
          <el-input class='fjjdhl-input-width' v-model.trim='sjwhycData.areaName'></el-input>
        </el-form-item>

        <el-form-item label='列入时间：' prop='year'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='sjwhycData.year'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='sjwhycData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("sjwhycDataRef")'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title='bwgsljlxTitle'
               :visible.sync='bwgsljlxFormFlag'
               width='30%'
               :destroy-on-close='true'
               :close-on-click-modal='false'
               :before-close='handleClose'>
      <el-form ref='bwgsljlxDataRef' :model='bwgsljlxData' :rules='bwgsljlxDataRules' label-width='200px'>
        <el-form-item label='收藏单位名：' prop='unitName'>
          <el-input class='fjjdhl-input-width' v-model.trim='bwgsljlxData.unitName'></el-input>
        </el-form-item>

        <el-form-item label='性质：' prop='type'>
          <el-select class='fjjdhl-input-width' v-model='bwgsljlxData.type' placeholder='请选性质'>
            <el-option
                v-for='(item, index) in bwgxzList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='质量等级：' prop='qualityLevel'>
          <el-select class='fjjdhl-input-width' v-model='bwgsljlxData.qualityLevel' placeholder='请选质量等级'>
            <el-option
                v-for='(item, index) in levelList'
                :key='item.stringnum'
                :label='item.stringnum'
                :value='item.stringnum'
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='是否免费开放：' prop='isFree'>
          <el-switch
              v-model='bwgsljlxData.isFree'
              active-value='是'
              active-text='是'
              inactive-value='否'
              inactive-text='否'>
          </el-switch>
        </el-form-item>

        <el-form-item label='藏品数（件）：' prop='collectionCount'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='bwgsljlxData.collectionCount'></el-input-number>
        </el-form-item>

        <el-form-item label='珍贵文物（件）：' prop='preciousRelics'>
          <el-input-number class='fjjdhl-input-width' :min='0'
                           v-model.number='bwgsljlxData.preciousRelics'></el-input-number>
        </el-form-item>

        <el-form-item label='序号：' prop='serial'>
          <el-input-number class='fjjdhl-input-width' :min='0' v-model.number='bwgsljlxData.serial'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='handleClose'>取 消</el-button>
                <el-button type='primary' @click='submit("bwgsljlxDataRef")'>确 定</el-button>
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
  saveLswhmczcDataApi
  , editLswhmczcDataApi
  , delLswhmczcDataApi
  , pageLswhmczcDataApi
  , queryLswhmczcGroupListApi
  , saveCtclDataApi
  , editCtclDataApi
  , delCtclDataApi
  , pageCtclDataApi
  , queryCtclGroupListApi
  , saveFywzwhycDataApi
  , editFywzwhycDataApi
  , delFywzwhycDataApi
  , pageFywzwhycDataApi
  , queryFywzwhycGroupListApi
  , saveBwgsljlxDataApi
  , editBwgsljlxDataApi
  , delBwgsljlxDataApi
  , pageBwgsljlxDataApi
  , queryBwgsljlxGroupListApi
  , clearLswhmczcDataApi
  , clearCtclDataApi
  , clearFywzwhycDataApi
  , clearBwgsljlxDataApi
} from '../api/csjs/HistoryCultureApi';
import {
  delJsonDataApi,
  getDictByCodeApi,
  getJsonDataByCodeApi,
  saveJsonDataApi,
  getImportUrl,
  exportExcel,
  saveBaseMapApi,
  getBaseMapListApi,
  delBaseMapApi,
  editBaseMapApi,
  getServerTypeApi, choseImportMode
} from '@/views/fujianOverview/api/FjoPublicApi';
import {
  clearLsqyssclDataApi,
  clearQxjszjcssDataApi,
  clearQxjszxczsDataApi
} from '@/views/fujianOverview/api/kjcx/InnovationIndexApi';

export default {
  name: 'historyCulture',
  data() {
    return {
      code: 'lswh',
      type: '城市建设-历史文化-历史文化名称镇村',
      lswhmczc: '城市建设-历史文化-历史文化名称镇村',
      ctcl: '城市建设-历史文化-传统村落',
      fywzwhyc: '城市建设-历史文化-非遗、物质文化遗产',
      sjwhyc: '城市建设-历史文化-世界文化遗产',
      bwgsljlx: '城市建设-历史文化-博物馆数量及类型',

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

      lswhmczcTableData: [],
      fywzwhycTableData: [],
      sjwhycTableData: [],
      ctclTableData: [],
      bwgsljlxTableData: [],
      yearList: [],
      batchList: [],
      queryBatchList: [],
      queryCityList: [],
      queryTypeList: [],
      queryLevelList: [],
      whyclxList: [],
      bwgxzList: [],
      levelList: [],
      xzqNameList: [],
      typeList: [
        {
          name: '历史文化名城'
        },
        {
          name: '历史文化名镇'
        },
        {
          name: '历史文化名街'
        },
        {
          name: '历史文化名村'
        }
      ],

      lswhmczcData: {
        batch: undefined,
        serial: 0,
        type: undefined,
        name: undefined
      },
      ctclData: {
        serial: 0,
        city: undefined,
        county: undefined,
        townStreet: undefined,
        village: undefined
      },
      fywzwhycData: {
        name: undefined,
        serial: 0,
        type: undefined,
        address: undefined
      },
      bwgsljlxData: {
        unitName: undefined,
        serial: 0,
        type: 0,
        qualityLevel: undefined,
        isFree: '是',
        collectionCount: 0,
        preciousRelics: 0
      },
      sjwhycData: {
        serial: 0,
        areaName: undefined,
        year: undefined
      },
      lswhmczcDataRules: {
        batch: [{ required: true, message: '批次数据不能为空', trigger: 'change' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型数据不能为空', trigger: 'change' }],
        name: [{ required: true, message: '名称数据不能为空', trigger: 'blur' }]
      },
      ctclDataRules: {
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        city: [{ required: true, message: '地市数据不能为空', trigger: 'change' }],
        county: [{ required: true, message: '县区数据不能为空', trigger: 'blur' }],
        townStreet: [{ required: true, message: '镇街数据不能为空', trigger: 'blur' }],
        village: [{ required: true, message: '村落数据不能为空', trigger: 'blur' }]
      },
      fywzwhycDataRules: {
        name: [{ required: true, message: '非物质文化遗产名称数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类别数据不能为空', trigger: 'change' }],
        address: [{ required: true, message: '地址数据不能为空', trigger: 'blur' }]
      },
      bwgsljlxDataRules: {
        unitName: [{ required: true, message: '收藏单位名数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '性质数据不能为空', trigger: 'change' }],
        qualityLevel: [{ required: true, message: '质量等级数据不能为空', trigger: 'change' }],
        isFree: [{ required: true, message: '乡是否免费开放数据不能为空', trigger: 'blur' }],
        collectionCount: [{ required: true, message: '藏品数数据不能为空', trigger: 'blur' }],
        preciousRelics: [{ required: true, message: '珍贵文物数据不能为空', trigger: 'blur' }]
      },
      sjwhycDataRules: {
        areaName: [{ required: true, message: '世界文化遗产名称数据不能为空', trigger: 'blur' }],
        serial: [{ required: true, message: '序号数据不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '列入时间数据不能为空', trigger: 'blur' }]
      },
      baseMapFormRules: {
        name: [{ required: true, message: '底图名称数据不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '底图地址数据不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '底图类型数据不能为空', trigger: 'blur' }]
      },
      queryParam: {
        page: 1,
        pageSize: 10,
        areaName: undefined,
        keyWord: undefined,
        type: undefined
      },
      total: 0,
      lswhmczcTitle: '新增数据',
      lswhmczcFormFlag: false,
      fywzwhycTitle: '新增数据',
      fywzwhycFormFlag: false,
      ctclTitle: '新增数据',
      ctclFormFlag: false,
      bwgsljlxTitle: '新增数据',
      bwgsljlxFormFlag: false,
      sjwhycTitle: '新增数据',
      sjwhycFormFlag: false,
      copyData: {
        lswhmczcData: {
          batch: undefined,
          serial: 0,
          type: undefined,
          name: undefined
        },
        ctclData: {
          serial: 0,
          city: undefined,
          county: undefined,
          townStreet: undefined,
          village: undefined
        },
        fywzwhycData: {
          name: undefined,
          serial: 0,
          type: undefined,
          address: undefined
        },
        bwgsljlxData: {
          unitName: undefined,
          serial: 0,
          type: undefined,
          qualityLevel: undefined,
          isFree: '是',
          collectionCount: 0,
          preciousRelics: 0
        },
        sjwhycData: {
          serial: 0,
          areaName: undefined,
          year: undefined
        },
        queryParam: {
          page: 1,
          pageSize: 10,
          areaName: undefined,
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
    this.initBatchList();
    this.initQueryGroupList();
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
        this.initBatchList();
        this.initQueryGroupList();
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
              this.initBatchList();
              this.initQueryGroupList();
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
              this.initBatchList();
              this.initQueryGroupList();
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
    clearData() {
      this.$confirm('确认根据筛选条件清空全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            if (this.type == this.lswhmczc) {
              clearLswhmczcDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            } else if (this.type == this.ctcl) {
              clearCtclDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            } else if (this.type == this.fywzwhyc) {
              clearFywzwhycDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            } else if (this.type == this.bwgsljlx) {
              clearBwgsljlxDataApi(this.queryParam).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  Object.assign(this.queryParam, this.copyData.queryParam);
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            }
          })
          .catch(_ => {
          });
    },
    initXzqNameList() {
      getDictByCodeApi({ code: 'xzq' }).then(res => {
        if (res.code == 200) {
          this.xzqNameList = res.data;
          this.xzqNameList = this.xzqNameList.sort((a, b) => a.pid - b.pid);
        }
      });
    },
    initBwglxList() {
      getDictByCodeApi({ code: 'bwgxz' }).then(res => {
        if (res.code == 200) {
          this.bwgxzList = res.data;
          this.bwgxzList = this.bwgxzList.sort((a, b) => a.pid - b.pid);
        }
      });
    },
    initLevelList() {
      getDictByCodeApi({ code: 'level' }).then(res => {
        if (res.code == 200) {
          this.levelList = res.data;
          this.levelList = this.levelList.sort((a, b) => a.pid - b.pid);
        }
      });
    },
    initTypeList() {
      getDictByCodeApi({ code: 'whyclx' }).then(res => {
        if (res.code == 200) {
          this.whyclxList = res.data;
          this.whyclxList = this.whyclxList.sort((a, b) => a.pid - b.pid);
        }
      });
    },
    initBatchList() {
      getDictByCodeApi({ code: 'batch' }).then(res => {
        if (res.code == 200) {
          this.batchList = res.data;
          this.batchList = this.batchList.sort((a, b) => a.pid - b.pid);
        }
      });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 存储数据
          if (this.type == this.lswhmczc) {
            if (this.lswhmczcData.pid) {
              // 更新
              editLswhmczcDataApi(this.lswhmczcData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.lswhmczcFormFlag = false;
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            } else {
              // 新增
              saveLswhmczcDataApi(this.lswhmczcData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.lswhmczcFormFlag = false;
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            }
          } else if (this.type == this.ctcl) {
            if (this.ctclData.pid) {
              // 更新
              editCtclDataApi(this.ctclData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.ctclFormFlag = false;
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            } else {
              // 新增
              saveCtclDataApi(this.ctclData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.ctclFormFlag = false;
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            }
          } else if (this.type == this.fywzwhyc) {
            if (this.fywzwhycData.pid) {
              // 更新
              editFywzwhycDataApi(this.fywzwhycData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.fywzwhycFormFlag = false;
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            } else {
              // 新增
              saveFywzwhycDataApi(this.fywzwhycData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.fywzwhycFormFlag = false;
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            }
          } else if (this.type == this.bwgsljlx) {
            if (this.bwgsljlxData.pid) {
              // 更新
              editBwgsljlxDataApi(this.bwgsljlxData).then(res => {
                if (res.code == 200) {
                  this.$message.success('编辑成功！');
                  this.bwgsljlxFormFlag = false;
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            } else {
              // 新增
              saveBwgsljlxDataApi(this.bwgsljlxData).then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功！');
                  this.bwgsljlxFormFlag = false;
                  this.getPageData();
                  this.initQueryGroupList();
                }
              });
            }
          } else {
            // 存储json数据
            let params = {
              code: this.type,
              jsonValue: JSON.stringify(this.sjwhycData),
              type: 1
            };
            saveJsonDataApi(params).then(res => {
              if (res.code == 200) {
                this.$message.success('操作成功！');
                this.sjwhycFormFlag = false;
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
    initQueryGroupList() {
      if (this.type == this.lswhmczc) {
        queryLswhmczcGroupListApi().then(res => {
          if (res.code == 200) {
            this.queryBatchList = res.data;
          }
        });
      } else if (this.type == this.ctcl) {
        queryCtclGroupListApi().then(res => {
          if (res.code == 200) {
            this.queryCityList = res.data;
          }
        });
      } else if (this.type == this.fywzwhyc) {
        queryFywzwhycGroupListApi().then(res => {
          if (res.code == 200) {
            this.queryTypeList = res.data;
          }
        });
      } else if (this.type == this.bwgsljlx) {
        queryBwgsljlxGroupListApi().then(res => {
          if (res.code == 200) {
            this.queryLevelList = res.data;
          }
        });
      }
    },
    buttonGetPageData() {
      this.queryParam.page = 1;
      this.getPageData();
    },
    getPageData() {
      if (this.type == this.lswhmczc) {
        pageLswhmczcDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.lswhmczcTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.ctcl) {
        pageCtclDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.ctclTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.fywzwhyc) {
        pageFywzwhycDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.fywzwhycTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else if (this.type == this.bwgsljlx) {
        pageBwgsljlxDataApi(this.queryParam).then(res => {
          if (res.code == 200) {
            this.bwgsljlxTableData = res.data.records;
            this.total = res.data.total;
          }
        });
      } else {
        getJsonDataByCodeApi({ code: this.type }).then(res => {
          if (res.code == 200) {
            if (res.data == '') {
              this.sjwhycTableData = [];
            } else {
              this.sjwhycTableData = JSON.parse(res.data);
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
      this.initQueryGroupList();
      if (this.type == this.lswhmczc) {
        this.initBatchList();
      } else if (this.type == this.fywzwhyc) {
        this.initTypeList();
      } else if (this.type == this.bwgsljlx) {
        this.initLevelList();
        this.initBwglxList();
      } else if (this.type == this.ctcl) {
        this.initXzqNameList();
      }
    },
    addData() {
      if (this.type == this.lswhmczc) {
        this.lswhmczcTitle = '新增数据';
        this.lswhmczcFormFlag = true;
        this.lswhmczcData.pid = undefined;
        Object.assign(this.lswhmczcData, this.copyData.lswhmczcData);
      } else if (this.type == this.ctcl) {
        this.ctclTitle = '新增数据';
        this.ctclFormFlag = true;
        this.ctclData.pid = undefined;
        Object.assign(this.ctclData, this.copyData.ctclData);
      } else if (this.type == this.fywzwhyc) {
        this.fywzwhycTitle = '新增数据';
        this.fywzwhycFormFlag = true;
        this.fywzwhycData.pid = undefined;
        Object.assign(this.fywzwhycData, this.copyData.fywzwhycData);
      } else if (this.type == this.bwgsljlx) {
        this.bwgsljlxTitle = '新增数据';
        this.bwgsljlxFormFlag = true;
        this.bwgsljlxData.pid = undefined;
        Object.assign(this.bwgsljlxData, this.copyData.bwgsljlxData);
      } else {
        this.sjwhycTitle = '新增数据';
        this.sjwhycFormFlag = true;
        this.sjwhycData.pid = undefined;
        Object.assign(this.sjwhycData, this.copyData.sjwhycData);
      }
    },
    handleEdit(row) {
      if (this.type == this.lswhmczc) {
        this.lswhmczcTitle = '编辑数据';
        this.lswhmczcFormFlag = true;
        Object.assign(this.lswhmczcData, row);
      } else if (this.type == this.ctcl) {
        this.ctclTitle = '编辑数据';
        this.ctclFormFlag = true;
        Object.assign(this.ctclData, row);
      } else if (this.type == this.fywzwhyc) {
        this.fywzwhycTitle = '编辑数据';
        this.fywzwhycFormFlag = true;
        Object.assign(this.fywzwhycData, row);
      } else if (this.type == this.bwgsljlx) {
        this.bwgsljlxTitle = '编辑数据';
        this.bwgsljlxFormFlag = true;
        Object.assign(this.bwgsljlxData, row);
      } else {
        this.sjwhycTitle = '编辑数据';
        this.sjwhycFormFlag = true;
        Object.assign(this.sjwhycData, row);
      }
    },
    handleDelete(row) {
      this.$confirm('确认删除序号为 ' + row.serial + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        if (this.type == this.lswhmczc) {
          delLswhmczcDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initQueryGroupList();
            }
          });
        } else if (this.type == this.ctcl) {
          delCtclDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initQueryGroupList();
            }
          });
        } else if (this.type == this.fywzwhyc) {
          delFywzwhycDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initQueryGroupList();
            }
          });
        } else if (this.type == this.bwgsljlx) {
          delBwgsljlxDataApi(row.pid).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功！');
              this.getPageData();
              this.initQueryGroupList();
            }
          });
        } else {
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
      if (this.type == this.lswhmczc) {
        this.lswhmczcFormFlag = false;
      } else if (this.type == this.ctcl) {
        this.ctclFormFlag = false;
      } else if (this.type == this.fywzwhyc) {
        this.fywzwhycFormFlag = false;
      } else if (this.type == this.bwgsljlx) {
        this.bwgsljlxFormFlag = false;
      } else {
        this.sjwhycFormFlag = false;
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