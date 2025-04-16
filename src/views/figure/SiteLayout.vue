<!--
 * @Author: TAO
 * @Date: 2023-11-22 14:00:00
 * @FilePath: \fjsy-web\src\views\figure\DemographicPortraits.vue
 * @Description: 人口画像
-->
<template>
  <div class="container">
    <div class="service-aside">
      <div class="add-service">
        <el-button type="success" @click="addService">新增模块</el-button>
      </div>
      <el-tree ref='layerTreeRef' :data="treeData" :expand-on-click-node="false" :node-key="'pid'" :props="treeProps"
               highlight-current @node-click="handleNodeClick">
                <span slot-scope="scope" class='layerSpan'>
                    {{ scope.data.name }}
                    <el-popover placement="bottom-start" popper-class="tree-popover" trigger="click"
                                v-if="scope.data.name != '人口流动'"
                    >
                        <i slot="reference" class="el-icon-set-up"></i>

                        <el-tooltip v-if="scope.data.parentId == '-1' && scope.data.isLock == 0" class="item"
                                    content="新增服务" effect="dark"
                                    placement="bottom">
                            <i class="el-icon-circle-plus-outline" @click="addLayer(scope.data)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" content="编辑" effect="dark" placement="bottom">
                            <i class="el-icon-edit" @click="editTree(scope.data)"></i>
                        </el-tooltip>
                        <el-tooltip v-if="scope.data.isLock == 0" class="item" content="删除" effect="dark"
                                    placement="bottom">
                            <i class="el-icon-delete" @click="delTree(scope.data)"></i>
                        </el-tooltip>
                    </el-popover>
                </span>
      </el-tree>
    </div>
    <div class="service-main">

      <div v-if="groupForm.name != '人口流动'">
        <div class="search-box">
          <!--        仅当groupForm.parentId不等于-1的时候才展示配置公式配置按钮-->
          <div>
            <el-button v-if="groupForm.parentId == '-1'" type="success" @click="formulaList">公式配置</el-button>
            <el-button v-if="groupForm.parentId != '-1' && groupForm.parentId!=''" class="" size="small" type="primary" @click="handleAdd">新增图层</el-button>
          </div>
        </div>
        <el-table :data="tableData" border stripe style="font-size:15px">
          <el-table-column align="center" label="PID" min-width="80" prop="pid"></el-table-column>
          <el-table-column align="center" label="图层名称" min-width="130" prop="layerName"></el-table-column>
          <el-table-column align="center" label="图层id" min-width="80" prop="layerId"></el-table-column>
          <el-table-column align="center" label="数据库表名" min-width="200" prop="dbName"></el-table-column>
          <el-table-column align="center" label="表唯一字段" min-width="80" prop="dbOnlyField"></el-table-column>
          <el-table-column align="center" label="备注" min-width="80" prop="remark"></el-table-column>
          <el-table-column align="center" label="操作" min-width="100">
            <template v-slot="scope">
              <el-button class="blue" icon="el-icon-edit" size="mini" type="text" @click="handleEdit(scope.row)">编辑
              </el-button>
              <el-button class="blue" icon="el-icon-edit" size="mini" type="text" @click="getListByLayerId(scope.row)">
                查询条件
              </el-button>
              <el-button class="red" icon="el-icon-delete" size="mini" type="text" @click="handleDelete(scope.row)"
              >删除
              </el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :total="pageTotal"
              background
              layout="total, prev, pager, next, jumper"
              @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>
      <div v-if="groupForm.name == '人口流动'">
        <PeopleStream></PeopleStream>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="setVisible" custom-class="set-dialog" title="编辑"
               width="30%">
      <el-form ref="setForm" :model="setForm" :rules="setFormRules" class="set-form" label-width="auto"></el-form>
    </el-dialog>

    <!-- 图层弹窗 -->
    <el-dialog
        :close-on-click-modal="false"
        :title="groupTitle"
        :visible.sync="groupVisible"
        custom-class="set-dialog"
        width="30%"
        @closed="closedGroup"
    >
      <el-form ref="groupForm" :model="groupForm" :rules="groupFormRules" class="group-form" label-width="auto">
        <el-form-item label="名称" prop="name">
          <el-input v-model="groupForm.name"></el-input>
        </el-form-item>
        <el-form-item label="服务路径" prop="serverUrl">
          <el-input v-model="groupForm.serverUrl"></el-input>
        </el-form-item>
        <el-form-item label="服务类型" prop="searchControlType">
          <el-select v-model="groupForm.kind" placeholder="请选择">
            <el-option
                v-for="item in serverKindList"
                :key="item.pid"
                :label="item.name"
                :value="item.intnum">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="groupForm.sort" min="0" type="number"></el-input>
        </el-form-item>
        <el-form-item v-if="groupForm.parentId==='-1'" label="是否锁定" prop="isLock">
          <el-switch v-model="groupForm.isLock" :active-value="1" :inactive-value="0" active-text="是"
                     inactive-text="否">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="groupVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveGroupDialog">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 服务弹窗 -->
    <el-dialog
        :close-on-click-modal="false"
        :title="setServerDialogName"
        :visible.sync="serveVisible"
        custom-class="set-dialog"
        width="30%"
        @close="closeServeDialog"
    >
      <el-form ref="serveForm" :model="serveForm" :rules="serveFormRules" label-width="auto">
        <el-form-item label="服务" prop="modelTreeId">
          <el-cascader
              v-model="serveForm.modelTreeId"
              :options="treeData"
              :props="{
                            expandTrigger: 'hover',
                            value: 'pid',
                            label: 'name',
                            children: 'children',
                            checkStrictly: false,
                            emitPath: false
                        }"
              :show-all-levels="false"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="图层名称" prop="layerName">
          <el-input v-model="serveForm.layerName" aria-required="true" placeholder="请输入图层名称"></el-input>
        </el-form-item>
        <el-form-item label="图层id" prop="layerId">
          <el-input v-model="serveForm.layerId" min="0" placeholder="请输入图层id" type="number"></el-input>
        </el-form-item>
        <el-form-item label="数据表名" prop="dbName">
          <el-input v-model="serveForm.dbName" placeholder="请输入数据表名"></el-input>
        </el-form-item>
        <el-form-item label="唯一字段" prop="dbOnlyField">
          <el-input v-model="serveForm.dbOnlyField" placeholder="请输入唯一字段"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="serveForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item  label="是否栅格图层" prop="isGrid">
          <el-switch v-model="serveForm.isGrid" :active-value="1" :inactive-value="0" active-text="是"
                     inactive-text="否">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="serveVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveServeDialog">确 定</el-button>
            </span>
    </el-dialog>


    <!-- 查询、展示字段列表弹窗 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="setVisibleForSearch" custom-class="set-dialog"
               title="查询字段调整"
               width="60%">
      <el-tabs v-model='defaultLoadFlag' @tab-click='handleClick'>
        <el-tab-pane label='查询条件' name='查询条件'>
        </el-tab-pane>
        <el-tab-pane label='展示字段' name='展示字段'>
        </el-tab-pane>
        <el-tab-pane label='统计字段' name='统计字段' v-if="serveForm.isGrid === 1">
        </el-tab-pane>
      </el-tabs>
      <el-button v-if="serveForm.isGrid === 0" style='position: absolute;right:11%;top:3vmax;' type="success" @click="addSearch">新增查询条件
      </el-button>
      <el-button v-if="serveForm.isGrid === 0" style='position: absolute;right:1%;top:3vmax;' type="primary" @click="addShowField">新增展示字段
      </el-button>
      <el-button v-if="serveForm.isGrid === 1" style='position: absolute;right:21%;top:3vmax;' type="success" @click="addSearch">新增查询条件
      </el-button>
      <el-button v-if="serveForm.isGrid === 1" style='position: absolute;right:11%;top:3vmax;' type="primary" @click="addShowField">新增展示字段
      </el-button>
      <el-button v-if="serveForm.isGrid === 1" style='position: absolute;right:1%;top:3vmax;' type="warning" @click="addStatisticsField">新增统计字段
      </el-button>
      <div v-if="defaultLoadFlag === '查询条件'">
        <el-table ref='multipleTable' :data='searchTableData' :default-sort="{prop: 'sort'}" border class='table'
                  style='font-size: 15px'>
          <el-table-column align='center' label='查询字段' prop='searchField'></el-table-column>
          <el-table-column align='center' label='查询字段描述' prop='searchDesc'></el-table-column>
          <el-table-column align='center' label='控件类型' prop='searchControlType'></el-table-column>
          <el-table-column :sortable='true' align='center' label='排序' prop='sort'></el-table-column>
          <el-table-column align='center' label='操作' width="180">
            <template slot-scope='scope'>
              <!--              仅当控件类型为下拉框或者下拉框区间时展示-->
              <el-button v-if='scope.row.searchControlType == "下拉框" || scope.row.searchControlType == "下拉框区间"'
                         icon='el-icon-edit'
                         type='text'
                         @click='handleOptions(scope.row)'>下拉数据
              </el-button>
              <el-button icon='el-icon-edit' type='text' @click='handleEditSearch(scope.row)'>编辑</el-button>
              <el-button confirm icon='el-icon-delete' style='color:red' type='text'
                         @click='handleDeleteSearch(scope.row)'>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="defaultLoadFlag === '展示字段'">

        <el-table ref='multipleTable' :data='showTableData' :default-sort="{prop: 'pid'}" border
                  class='table'
                  style='font-size: 15px'>
          <el-table-column align='center' label='展示字段' prop='showField'></el-table-column>
          <el-table-column align='center' label='展示字段名称' prop='showDesc'></el-table-column>
          <!--          isUnitTransform为0无需单位换算，为1则拼接originUnit与targetUnit两个字段内容返回-->
          <el-table-column align='center' label='是否单位换算' prop='isUnitTransform'>
            <template slot-scope='scope'>
              <span v-if='scope.row.isUnitTransform == 0'>否</span>
              <span
                  v-if='scope.row.isUnitTransform == 1'>是:{{ scope.row.originUnit }}->{{ scope.row.targetUnit }}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label='操作' width="180">
            <template slot-scope='scope'>
              <el-button icon='el-icon-edit' type='text' @click='handleEditShow(scope.row)'>编辑</el-button>
              <el-button confirm icon='el-icon-delete' style='color:red' type='text'
                         @click='handleDeleteShow(scope.row)'>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="defaultLoadFlag === '统计字段'">

        <el-table ref='multipleTable' :data='statisticsTableData' :default-sort="{prop: 'pid'}" border
                  class='table'
                  style='font-size: 15px'>
          <el-table-column align='center' label='统计字段' prop='statisticsField'></el-table-column>
          <el-table-column align='center' label='统计字段名称' prop='statisticsDesc'></el-table-column>
          <el-table-column align='center' label='操作' width="180">
            <template slot-scope='scope'>
              <el-button icon='el-icon-edit' type='text' @click='handleEditStatistics(scope.row)'>编辑</el-button>
              <el-button confirm icon='el-icon-delete' style='color:red' type='text'
                         @click='handleDeleteStatistics(scope.row)'>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>


    <!--    查询条件新增、编辑弹窗-->
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="serveVisibleForSearch"
        custom-class="set-dialog"
        :title="titleForSearch"
        width="30%"
    >
      <el-form ref="searchField" :model="searchField" :rules="searchFieldRules" class="group-form" label-width="auto">
        <el-form-item label="查询字段" prop="name">
          <el-select v-model="searchField.searchField" placeholder="请选择">
            <el-option
                v-for="item in dbFields"
                :key="item.COLUMNNAME"
                :label="item.COMMENTS"
                :value="item.COLUMNNAME">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询字段描述" prop="serverUrl">
          <el-input v-model="searchField.searchDesc"></el-input>
        </el-form-item>
        <el-form-item label="控件类型" prop="searchControlType">
          <el-select v-model="searchField.searchControlType" placeholder="请选择">
            <el-option
                v-for="item in controlTypeList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="searchField.sort" min="0" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="serveVisibleForSearch = false">取 消</el-button>
                <el-button type="primary" @click="saveSearchDialog">确 定</el-button>
            </span>
    </el-dialog>


    <!--    展示字段新增、编辑弹窗-->
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="serveVisibleForShow"
        custom-class="set-dialog"
        :title="titleForShow"
        width="30%"
    >
      <el-form ref="showField" :model="showField" :rules="showFieldRules" class="group-form" label-width="auto">
        <el-form-item label="展示字段" prop="searchControlType">
          <el-select v-model="showField.showField" placeholder="请选择">
            <el-option
                v-for="item in dbFields"
                :key="item.COLUMNNAME"
                :label="item.COMMENTS"
                :value="item.COLUMNNAME">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示字段名称" prop="name">
          <el-input v-model="showField.showDesc"></el-input>
        </el-form-item>
        <el-form-item label="是否单位换算" prop="isLock">
          <el-switch v-model="showField.isUnitTransform" :active-value="1" :inactive-value="0" active-text="是"
                     inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="showField.isUnitTransform == 1" label="源单位" prop="name">
          <el-select v-model="showField.originUnit" placeholder="请选择" @change="changeValue($event)">
            <el-option
                v-for="item in conversionList"
                :key="item.value"
                :label="item.value"
                :sid="item.pid"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showField.isUnitTransform == 1" label="目标单位" prop="name">
          <el-select v-model="showField.targetUnit" placeholder="请选择">
            <el-option
                v-for="item in conversionChildrenList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="serveVisibleForShow = false">取 消</el-button>
                <el-button type="primary" @click="saveShowFieldDialog">确 定</el-button>
            </span>
    </el-dialog>

    <!--    统计字段新增、编辑弹窗-->
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="serveVisibleForStatistics"
        custom-class="set-dialog"
        :title="titleForStatistics"
        width="30%"
    >
      <el-form ref="statisticsField" :model="statisticsFields" :rules="statisticsFieldRules" class="group-form" label-width="auto">
        <el-form-item label="统计字段" prop="searchControlType">
          <el-select v-model="statisticsFields.statisticsField" placeholder="请选择">
            <!--            仅当为NUMBER时展示-->
            <el-option
                v-for="item in dbFields"
                v-if="item.DATATYPE == 'NUMBER'"
                :key="item.COLUMNNAME"
                :label="item.COMMENTS"
                :value="item.COLUMNNAME">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计字段名称" prop="name">
          <el-input v-model="statisticsFields.statisticsDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="serveVisibleForStatistics = false">取 消</el-button>
                <el-button type="primary" @click="saveStatisticsFieldDialog">确 定</el-button>
            </span>
    </el-dialog>


    <!-- 公式列表弹窗 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="setVisibleForFormula" custom-class="set-dialog"
               title="公式配置"
               width="60%">
      <el-button type="success" @click="addFormulaBtn">新增公式
      </el-button>

      <el-table ref='multipleTable' :data='formulaListData' class='table' style='font-size: 15px'>
        <el-table-column align='center' label='公式名称' prop='name'></el-table-column>
        <el-table-column align='center' label='公式表达式' prop='expression'></el-table-column>
        <el-table-column align='center' label='操作' width="200">
          <template slot-scope='scope'>
            <!--              仅当控件类型为下拉框或者下拉框区间时展示-->
            <el-button icon='el-icon-edit' type='text' @click='handleEditFormula(scope.row)'>编辑</el-button>
            <el-button icon='el-icon-edit' type='text' @click='handleListFormula(scope.row)'>查询/展示配置</el-button>
            <el-button confirm icon='el-icon-delete' style='color:red' type='text'
                       @click='handleDeleteFormula(scope.row)'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


    <!--    公式新增、编辑弹窗-->
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="setVisibleForFormulaUpdate"
        custom-class="set-dialog"
        :title="titleForFormula"
        width="40%"
    >
      <el-form ref="searchField" :model="formulaData" :rules="formulaDataRules" class="group-form" label-width="auto" style="display: flex;flex-wrap: wrap">
        <!--        如果formulaData-->
        <el-form-item label="公式名称" prop="name" style="width: 50%">
          <el-input v-model="formulaData.name"></el-input>
        </el-form-item>
        <el-form-item label="公式表达式" prop="expression" style="width: 50%">
          <el-input v-model="formulaData.expression"></el-input>
        </el-form-item>
        <el-form-item label="公式辅助" style="width: 100%">
          <el-radio-group v-model="radio3" size="small" @change="radioChange">
            <el-radio-button label="("></el-radio-button>
            <el-radio-button label=")"></el-radio-button>
            <el-radio-button label="+"></el-radio-button>
            <el-radio-button label="-"></el-radio-button>
            <el-radio-button label="*"></el-radio-button>
            <el-radio-button label="/"></el-radio-button>
            <el-radio-button label="%"></el-radio-button>
            <template v-for="(item, index) in formulaData.formulaConfigList">
              <el-radio-button :label="letterList[index]"></el-radio-button>
            </template>
          </el-radio-group>
        </el-form-item>
        <template v-for="(domain, index) in formulaData.formulaConfigList">
          <el-form-item :label="letterList[index]+'-图层选择'" prop="layerId"  style="width: 88%">
            <!--            <el-select v-model="domain.layerId" placeholder="请选择">-->
            <!--              <el-option-->
            <!--                  v-for="item in allLayersAndColumns"-->
            <!--                  :key="item.pid"-->
            <!--                  :label="item.layerName"-->
            <!--                  :value="item.pid">-->
            <!--              </el-option>-->
            <!--            </el-select>-->
            <el-cascader
                v-model="domain.fieldPathList"
                :change-on-select="true"
                :options="allLayersAndColumnsNumber"
                :props="defaultParams"
                :show-all-levels="true"
            >
            </el-cascader>
          </el-form-item>
          <!--          <el-form-item label="字段选择" prop="layerField"  style="width: 44%">-->
          <!--            <el-select v-model="domain.layerField" placeholder="请选择">-->
          <!--              <template v-if="domain.layerId != '' && domain.layerId != null">-->
          <!--                <el-option-->
          <!--                    v-for="item in dbFieldList[domain.layerId]"-->
          <!--                    v-if="item.DATATYPE == 'NUMBER'"-->
          <!--                    :key="item.COLUMNNAME"-->
          <!--                    :label="item.COLUMNNAME"-->
          <!--                    :value="item.COLUMNNAME">-->
          <!--                </el-option>-->
          <!--              </template>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-button type="primary" @click.prevent="removeDomain(domain)" style="margin-left: 1%;    height: fit-content;">删除</el-button>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addNewLayer">新增图层</el-button>
        <el-button @click="setVisibleForFormulaUpdate = false">取 消</el-button>
        <el-button type="primary" @click="saveFormulaDialog">确 定</el-button>
      </span>
    </el-dialog>


    <!--公式查询、展示列表-->
    <el-dialog :close-on-click-modal="false" :visible.sync="setVisibleForFormulaSearchAndShow" custom-class="set-dialog"
               title="公式字段调整"
               width="60%">
      <el-tabs v-model='defaultLoadFlagFormula' @tab-click='handleClick'>
        <el-tab-pane label='查询条件' name='查询条件'>
        </el-tab-pane>
        <el-tab-pane label='展示字段' name='展示字段'>
        </el-tab-pane>
      </el-tabs>
      <el-button style='position: absolute;right:11%;top:3vmax;' type="success" @click="addSearchFormula">新增查询条件
      </el-button>
      <el-button style='position: absolute;right:1%;top:3vmax;' type="primary" @click="addShowFieldFormula">新增展示字段
      </el-button>
      <div v-if="defaultLoadFlagFormula == '查询条件'">
        <el-table ref='multipleTable' :data='searchTableDataFormula' :default-sort="{prop: 'sort'}" border class='table'
                  style='font-size: 15px'>
          <el-table-column align='center' label='查询字段' prop='searchField'></el-table-column>
          <el-table-column align='center' label='查询字段描述' prop='searchDesc'></el-table-column>
          <el-table-column align='center' label='控件类型' prop='searchControlType'></el-table-column>
          <el-table-column :sortable='true' align='center' label='排序' prop='sort'></el-table-column>
          <el-table-column align='center' label='操作' width="180">
            <template slot-scope='scope'>
              <!--              仅当控件类型为下拉框或者下拉框区间时展示-->
              <el-button v-if='scope.row.searchControlType == "下拉框" || scope.row.searchControlType == "下拉框区间"'
                         icon='el-icon-edit'
                         type='text'
                         @click='handleOptionsFormula(scope.row)'>下拉数据
              </el-button>
              <el-button icon='el-icon-edit' type='text' @click='handleEditSearchFormula(scope.row)'>编辑</el-button>
              <el-button confirm icon='el-icon-delete' style='color:red' type='text'
                         @click='handleDeleteSearchFormula(scope.row)'>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="defaultLoadFlagFormula == '展示字段'">

        <el-table ref='multipleTable' :data='showTableDataFormula' :default-sort="{prop: 'isUnitTransform'}" border
                  class='table'
                  style='font-size: 15px'>
          <el-table-column align='center' label='是否公式计算' prop='isUnitTransform'>
            <template slot-scope='scope'>
              <span v-if='scope.row.isFormulaResult == 0'>否</span>
              <span
                  v-if='scope.row.isFormulaResult == 1'>是</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label='展示字段' prop='showField'></el-table-column>
          <el-table-column align='center' label='展示字段名称' prop='showDesc'></el-table-column>
          <el-table-column align='center' label='是否单位换算' prop='isUnitTransform'>
            <template slot-scope='scope'>
              <span v-if='scope.row.isUnitTransform == 0'>否</span>
              <span
                  v-if='scope.row.isUnitTransform == 1'>是:{{ scope.row.originUnit }}->{{ scope.row.targetUnit }}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label='操作' width="180">
            <template slot-scope='scope'>
              <el-button icon='el-icon-edit' type='text' @click='handleEditShowFormula(scope.row)'>编辑</el-button>
              <el-button confirm icon='el-icon-delete' style='color:red' type='text'
                         @click='handleDeleteShowFormula(scope.row)'>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!--    公式查询条件新增、编辑弹窗-->
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="serveVisibleForSearchFormula"
        custom-class="set-dialog"
        :title="titleForFormulaSearch"
        width="30%"
    >
      <el-form ref="searchFieldFormula" :model="searchFieldFormula" :rules="searchFieldRulesFormula" class="group-form" label-width="auto">
        <el-form-item label="查询字段" prop="fieldPathList">
          <el-cascader
              :change-on-select="true"
              :props="defaultParams"
              :options="allLayersAndColumnsByFormula"
              v-model="searchFieldFormula.fieldPathList"
              :clearable="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="查询字段描述" prop="searchDesc">
          <el-input v-model="searchFieldFormula.searchDesc"></el-input>
        </el-form-item>
        <el-form-item label="控件类型" prop="searchControlType">
          <el-select v-model="searchFieldFormula.searchControlType" placeholder="请选择">
            <el-option
                v-for="item in controlTypeList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="searchFieldFormula.sort" min="0" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="serveVisibleForSearchFormula = false">取 消</el-button>
                <el-button type="primary" @click="saveSearchDialogFormula">确 定</el-button>
            </span>
    </el-dialog>


    <!--    公式展示字段新增、编辑弹窗-->
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="serveVisibleForShowFormula"
        custom-class="set-dialog"
        :title="titleForFormulaShow"
        width="30%"
    >
      <el-form ref="showFieldFormula" :model="showFieldFormula" :rules="showFieldRulesFormula" class="group-form" label-width="auto">
        <!--        是否公式计算字段-->
        <el-form-item label="是否公式计算字段" prop="isFormulaResult">
          <el-switch v-model="showFieldFormula.isFormulaResult" :active-value="1" :inactive-value="0" active-text="是"
                     inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="showFieldFormula.isFormulaResult==0" label="展示字段" prop="fieldPathList">
          <el-cascader
              :change-on-select="true"
              :props="defaultParams"
              :options="allLayersAndColumnsByFormula"
              v-model="showFieldFormula.fieldPathList"
              :clearable="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="展示字段名称" prop="showDesc">
          <el-input v-model="showFieldFormula.showDesc"></el-input>
        </el-form-item>
        <el-form-item label="是否单位换算" prop="isLock">
          <el-switch v-model="showFieldFormula.isUnitTransform" :active-value="1" :inactive-value="0" active-text="是"
                     inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="showFieldFormula.isUnitTransform == 1" label="源单位" prop="name">
          <el-select v-model="showFieldFormula.originUnit" placeholder="请选择" @change="changeValue($event)">
            <el-option
                v-for="item in conversionList"
                :key="item.value"
                :label="item.value"
                :sid="item.pid"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showFieldFormula.isUnitTransform == 1" label="目标单位" prop="name">
          <el-select v-model="showFieldFormula.targetUnit" placeholder="请选择">
            <el-option
                v-for="item in conversionChildrenList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="serveVisibleForShowFormula = false">取 消</el-button>
                <el-button type="primary" @click="saveShowFieldDialogFormula">确 定</el-button>
            </span>
    </el-dialog>


    <!-- 查询字段列表项弹窗 -->
    <el-dialog
        title='数据列表'
        :visible.sync='listVisible'
        width='50%'
        custom-class='set-dialog'
        :close-on-click-modal='false'
    >
      <el-form ref='listForm' :inline='true' :model='listForm' label-width='auto' class='group-form'
               :rules='listFormRules' v-if="isAdmin == 'true'">
        <el-form-item label='控件名称' prop='name'>
          <el-input v-model.trim='listForm.name'></el-input>
        </el-form-item>
        <el-form-item label='控件值' prop='value'>
          <el-input v-model.trim='listForm.value'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size='mini' type='primary' @click='saveListDialog'>添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data='OptionsByFieldIdSearch' border stripe max-height='400'>
        <el-table-column label='id' prop='pid' align='center'></el-table-column>
        <el-table-column label='控件名称' prop='name' align='center'></el-table-column>
        <el-table-column label='控件值' prop='value' align='center'></el-table-column>

        <el-table-column label='操作' align='center' min-width='100' v-if="isAdmin == 'true'">
          <template v-slot='scope'>
            <el-button size='mini' type='danger' plain @click='listDelete(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


    <!-- 查询字段列表项弹窗 -->
    <el-dialog
        title='数据列表'
        :visible.sync='listVisibleFormula'
        width='50%'
        custom-class='set-dialog'
        :close-on-click-modal='false'
    >
      <el-form ref='listFormFormula' :inline='true' :model='listFormFormula' label-width='auto' class='group-form'
               :rules='listFormRulesFormula' v-if="isAdmin == 'true'">
        <el-form-item label='控件名称' prop='name'>
          <el-input v-model.trim='listFormFormula.name'></el-input>
        </el-form-item>
        <el-form-item label='控件值' prop='value'>
          <el-input v-model.trim='listFormFormula.value'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size='mini' type='primary' @click='saveListDialogFormula'>添加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data='OptionsByFieldIdFormulaSearch' border stripe max-height='400'>
        <el-table-column label='id' prop='pid' align='center'></el-table-column>
        <el-table-column label='控件名称' prop='name' align='center'></el-table-column>
        <el-table-column label='控件值' prop='value' align='center'></el-table-column>

        <el-table-column label='操作' align='center' min-width='100' v-if="isAdmin == 'true'">
          <template v-slot='scope'>
            <el-button size='mini' type='danger' plain @click='listDeleteFormula(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
  </div>
</template>

<script>
import {
  addLayer,
  addModole,
  delLayer,
  delModole,
  delSearch,
  delShow,
  getByModelTreeId,
  getDbListByLayerId,
  getDictByCode,
  getDictByParentId,
  getFormulaListByTreeId,
  getSearchListByLayerId,
  getShowListByLayerId,
  getStatisticsListByLayerId,
  saveSearch,
  saveShow,
  selectByModelCode,
  updateLayer,
  updateModole,
  updateSearch,
  updateShow,
  getFormulaConfigByPid,
  addOrUpdateFormula,
  getLayerAndFieldsByModelTreeId,
  delFormula,
  getFormulaSearchListByFormulaId,
  getFormulaShowListByFormulaId,
  saveFormulaSearch,
  updateFormulaSearch,
  delFormulaSearch,
  saveFormulaShow,
  updateFormulaShow,
  delFormulaShow,
  getOptionsByFieldIdSearch,
  saveSearchOptions,
  delSearchOptions,
  getOptionsByFieldIdFormulaSearch,
  saveFormulaSearchOptions,
  delFormulaSearchOptions,
  getAllLayerAndFields,
  getAllLayersFieldsByFormulaId,
  getServerType,
  saveStatistics,
  updateStatistics,
  delStatistics
} from '@/api/figure/demographicPortraits-api';
import PeopleStream from '@/views/figure/PeopleStream';


export default {
  name: '',
  props: {},
  components: {
    PeopleStream
  },
  data() {
    return {
      isAdmin: false,
      modelCode: "ydbj",
      setServerDialogName: '新增图层',
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'name'
      },
      radio3: '',
      tableData: [],
      searchTableData: [],  //查询字段
      searchTableDataFormula: [], //公式查询
      showTableData: [],  //展示字段
      statisticsTableData: [],  //统计字段
      showTableDataFormula: [], //公式展示
      controlTypeList: [],//控件类型
      serverKindList: [],//服务类型
      conversionList: [],//单位换算
      conversionChildrenList: [],//单位换算子集
      formulaListData: [],//公式列表
      layersAndColumns: [
        {
          pid: null,
          layerId: '',
          layerName: '',
          dbFieldList: [
            {
              COLUMNNAME: '',
              COMMENTS: '',
              DATATYPE: ''
            }
          ]
        }
      ],//图层与字段
      dbFieldList: [],//字段
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      groupID: 0,
      searchTXT: '',
      setVisible: false,
      setVisibleForSearch: false,
      serveVisibleForSearch: false,
      serveVisibleForSearchFormula: false,
      serveVisibleForShow: false,
      serveVisibleForStatistics: false,
      serveVisibleForShowFormula: false,
      setVisibleForFormula: false,
      setVisibleForFormulaUpdate: false,
      setVisibleForFormulaSearchAndShow: false,
      listVisible:false,
      listVisibleFormula:false,
      LoadmodelTreeId: '',
      defaultLoadFlag: '查询条件',
      defaultLoadFlagFormula: '查询条件',
      setForm: {},
      setFormRules: {},
      groupVisible: false,
      groupTitle: '',
      groupForm: {
        name: '',
        parentId: '',
        serverUrl: '',
        modelCode: 'ydbj',
        sort: 0,
        isLock: 0,
        pid: null,
        kind: 1,
      },
      searchField: {
        pid: null,
        searchField: '',
        searchDesc: '',
        searchControlType: "文本框",
        searchFieldType: '',
        layerId: '',
        sort: 0
      },
      searchFieldFormula: {
        pid: null,
        searchField: '',
        searchDesc: '',
        searchControlType: "文本框",
        layerId: '',
        formulaId : '',
        sort: 0,
        fieldPathList: []
      },
      showField: {
        pid: null,
        showField: '',
        showDesc: '',
        isUnitTransform: 0,
        layerId: '',
        originUnit: '',
        targetUnit: '',
      },
      statisticsFields: {
        pid: null,
        statisticsField: '',
        statisticsDesc: '',
        layerId: ''
      },
      showFieldFormula: {
        pid: null,
        showField: '',
        showDesc: '',
        isUnitTransform: 0,
        layerId: '',
        originUnit: '',
        targetUnit: '',
        sort: 0,
        isFormulaResult: 0,
        formulaId : '',
        fieldPathList: []
      },
      formulaData: {
        pid: null,
        name: '',
        expression: '',
        modelId: null,
        formulaConfigList: [
          {
            pid:null,
            formulaId: null,
            layerId: '',
            layerField: '',
            name: '',
            layerName: '',
            fieldPathList:[],
          }
        ]
      },
      groupFormRules: {
        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
        order: [{required: true, message: '排序不能为空', trigger: 'blur'}],
      },
      searchFieldRules: {
        searchField: [{required: true, message: '查询字段不能为空', trigger: 'change'}],
        searchDesc: [{required: true, message: '查询字段描述不能为空', trigger: 'blur'}],
        searchControlType: [{required: true, message: '控件类型不能为空', trigger: 'change'}],
        sort: [{required: true, message: '排序不能为空', trigger: 'blur'}],
      },
      searchFieldRulesFormula: {
        fieldPathList: [{required: true, message: '图层与字段不能为空', trigger: 'change'}],
        searchDesc: [{required: true, message: '查询字段描述不能为空', trigger: 'blur'}],
        searchControlType: [{required: true, message: '控件类型不能为空', trigger: 'change'}],
        sort: [{required: true, message: '排序不能为空', trigger: 'blur'}],
      },
      showFieldRules: {
        showField: [{required: true, message: '展示字段不能为空', trigger: 'blur'}],
        showDesc: [{required: true, message: '展示字段名称不能为空', trigger: 'blur'}],
        isUnitTransform: [{required: true, message: '是否单位换算不能为空', trigger: 'blur'}],
      },
      statisticsFieldRules: {
        statisticsField: [{required: true, message: '统计字段不能为空', trigger: 'blur'}],
        statisticsDesc: [{required: true, message: '统计字段名称不能为空', trigger: 'blur'}],
      },
      showFieldRulesFormula: {
        fieldPathList: [{required: true, message: '图层与字段不能为空', trigger: 'change'}],
        showDesc: [{required: true, message: '展示字段名称不能为空', trigger: 'blur'}],
        isUnitTransform: [{required: true, message: '是否单位换算不能为空', trigger: 'blur'}],
      },
      serveVisible: false,
      serveForm: {
        pid: null,
        layerId: 0,
        layerName: '',
        dbName: '',
        remark: '',
        dbOnlyField: '',
        isGrid: 0
      },
      dbFields: [],
      dataServers: [],
      serverNameList: [],
      // 服务选择
      serveUrl: '',
      serveTypeList: [],
      dataSourceList: [],
      serveFormRules: {
        layerId: [{required: true, message: '图层id', trigger: 'blur'}],
        layerName: [{required: true, message: '图层名称不能为空', trigger: 'blur'}],
        dbName: [{required: true, message: '数据库表名不能为空', trigger: 'blur'}],
        dbOnlyField: [{required: true, message: '表唯一字段不能为空', trigger: 'blur'}],
        modelTreeId: [{required: true, message: '服务类型不能为空', trigger: 'change'}],
      },
      formulaDataRules: {
        name: [{required: true, message: '公式名称不能为空', trigger: 'blur'}],
      },
      //  定义一个大写字母列表
      letterList:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
      defaultParams: {
        label: 'label',
        value: 'value',
        children: 'children',
        checkStrictly: false,
        expandTrigger: 'hover'
      },
      OptionsByFieldIdSearch:[],
      OptionsByFieldIdFormulaSearch:[],
      listFormRules: {
        name: [{ required: true, message: '控件名称不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '控件值不能为空', trigger: 'blur' }]
      },
      listForm: {
        name: '',
        value: ''
      },
      listFormRulesFormula: {
        name: [{ required: true, message: '控件名称不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '控件值不能为空', trigger: 'blur' }]
      },
      listFormFormula: {
        name: '',
        value: ''
      },
      allLayersAndColumns: [],
      allLayersAndColumnsNumber: [],
      allLayersAndColumnsByFormula: [],
      allLayersAndColumnsOnlyLayers: [],
      titleForSearch: '',
      titleForShow: '',
      titleForFormula: '',
      titleForFormulaSearch: '',
      titleForFormulaShow: '',
      titleForStatistics: ''
    };
  },
  computed: {
    // ...mapState(['isAdmin'])
  },
  watch: {
    $route: {
      handler(val) {
        //debugger;
        this.groupForm.GROUPTYPE = this.$route.query.type;
        if (this.$route.query.type == undefined || this.$route.query.type == '') {
          this.groupForm.GROUPTYPE = 1;
        }
        this.getTreeData(this.groupForm.GROUPTYPE);
      }
    }
  },
  created() {
  },
  mounted() {
    this.isAdmin = sessionStorage.getItem('isadmin');
    this.selectByModelCode();
    this.getServiceKind();
  },
  methods: {
    // 获取树级列表
    async selectByModelCode() {
      const res = await selectByModelCode({modelCode: this.modelCode});
      if (res.code === 200) {
        this.treeData = res.data;
      }
    },

    // 树级节点点击
    async handleNodeClick(obj, node, el) {
      let params = {
        modelTreeId: obj.pid
      };
      await this.getByModelTreeId(params);
      Object.assign(this.groupForm, obj);
      if (obj.parentId != '-1' && obj.parentId!='') {
        this.serveForm.modelTreeId = obj.pid;
      }

      this.LoadmodelTreeId = obj.pid;

    },

    // 新增
    handleAdd() {
      this.serveVisible = true;
      this.setServerDialogName = '新增图层';
      //初始化
      Object.assign(this.serveForm, {
        pid: null,
        layerId: 0,
        layerName: '',
        dbName: '',
        remark: '',
        dbOnlyField: '',
        isGrid: 0
      });
      Object.assign(this.serveForm, {modelTreeId: this.groupForm.pid});
    },

    // 搜索
    handleSearch() {
      this.setVisibleForSearch = true;
    },

    // 获取表格数据
    async getByModelTreeId(params) {
      const res = await getByModelTreeId(params);
      if (res.code === 200) {
        this.tableData = res.data;
      }
    },

    // 页数点击
    handlePageChange(val) {
      this.currentPage = val;
      this.getTableData();
    },

    // 新增图层组
    addService() {
      this.groupVisible = true;
      this.groupTitle = '新增模块';
      Object.assign(this.groupForm, {pid: null, parentId: '-1',name: '', serverUrl: '', sort: 0, isLock: 0,kind: 1});
    },

    // 保存图层组
    saveGroupDialog() {
      this.$refs.groupForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请输入必填项');
        //将childrens设置为[]
        Object.assign(this.groupForm, {childrens: []});
        //如果pid不为空则为编辑
        if (this.groupForm.pid != null) {
          const res = await updateModole(this.groupForm);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.groupVisible = false;
          }
        } else {
          const res = await addModole(this.groupForm);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.groupVisible = false;
          }
        }
        await this.selectByModelCode();
      });
    },

    // 添加图层
    addLayer(row) {
      this.groupVisible = true;
      this.groupTitle = "新增服务"
      Object.assign(this.groupForm, {parentId: row.pid, pid: null});
    },

    // 图层弹窗关闭
    closedGroup() {
      this.$refs.groupForm.resetFields();
    },

    // 编辑树分组
    editTree(row) {
      this.groupVisible = true;
      if(row.parentId == '-1'){
        this.groupTitle = '编辑模块';
      }else {
        this.groupTitle = '编辑服务';
      }

      Object.assign(this.groupForm, row);
    },

    // 删除分组
    async delTree(row) {
      //询问是否删除
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            const res = await delModole({pid: row.pid});
            if (res.code === 200) {
              this.$message.success('删除成功！');
              // 直接根据pid进行删除
              await this.selectByModelCode();
            } else {
              // 操作失败，需要重新加载数据
              await this.selectByModelCode();
            }
          })
          .catch(() => {
            console.log("节点 -> ", node);
            this.$message.info('已取消删除');
          });
    },


    changeServe(val) {
      this.serveForm.URL = val;
    },


    // 保存服务弹窗
    saveServeDialog() {
      this.$refs.serveForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        // 如果pid不为空则为编辑
        if (this.serveForm.pid != null) {
          const res = await updateLayer(this.serveForm);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisible = false;
            await this.getByModelTreeId(
                {
                  modelTreeId: this.LoadmodelTreeId
                }
            );
          }
        } else {
          const res = await addLayer(this.serveForm);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisible = false;
            await this.getByModelTreeId(
                {
                  modelTreeId: this.LoadmodelTreeId
                }
            );
          }
        }
      });
    },

    // 关闭服务弹窗
    closeServeDialog() {
      this.$refs.serveForm.resetFields();
      this.serveUrl = '';
      this.serverNameList = [];
    },

    // 删除图层
    async handleDelete(row) {
      this.$confirm('此操作将永久删除该图层, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delLayer({pid: row.pid});
        if (res.code === 200) {
          this.$message.success('删除成功！');
          await this.getByModelTreeId(
              {
                modelTreeId: this.LoadmodelTreeId
              }
          );
        }
      })
          .catch(() => {
            this.$message.info('已取消删除');
          });
    },

    // 编辑服务
    handleEdit(row) {
      this.serveVisible = true;
      this.setServerDialogName = '编辑图层';
      Object.assign(this.serveForm, row);
    },

    // 获取查询展示列表
    async getListByLayerId(row) {
      Object.assign(this.serveForm, row);
      this.setVisibleForSearch = true;
      this.defaultLoadFlag = '查询条件';
      await this.getSearchListByLayerId(row.pid);
      await this.getShowListByLayerId(row.pid);
      await this.getStatisticsListByLayerId(row.pid);
      await this.getDbListByLayerId(row.pid);
      await this.getDictByCode('SEARCH_CONTROL_TYPE');
      // await this.getConversionList();
      this.searchField.layerId = row.pid;
      this.showField.layerId = row.pid;
      this.statisticsFields.layerId = row.pid;
    },

    async getSearchListByLayerId(pid) {
      const res = await getSearchListByLayerId({layerId: pid});
      if (res.code === 200) {
        this.searchTableData = res.data;
      }
    },

    async getShowListByLayerId(pid) {
      const res = await getShowListByLayerId({layerId: pid});
      if (res.code === 200) {
        this.showTableData = res.data;
      }
    },
    async getStatisticsListByLayerId(pid) {
      const res = await getStatisticsListByLayerId({layerId: pid});
      if (res.code === 200) {
        this.statisticsTableData = res.data;
      }
    },

    //获取数据库字段列表
    async getDbListByLayerId(pid) {
      const res = await getDbListByLayerId({layerId: pid});
      if (res.code === 200) {
        this.dbFields = res.data;
      }
    },

    //获取单位换算列表
    async getConversionList() {
      const res = await getDictByCode({code: 'UNIT_CONVERSION_ROOT'});
      if (res.code === 200) {
        this.conversionList = res.data;
        if (this.showField.originUnit) {
          let pid = this.conversionList.find(item => item.value === this.showField.originUnit).pid;
          await this.getConversionChildrenList(pid);
        } else {
          let pid = this.conversionList[0].pid;
          await this.getConversionChildrenList(pid);
        }

      }
    },


    //获取单位换算子集列表
    async getConversionChildrenList(pid) {
      const res = await getDictByParentId({parentId: pid});
      if (res.code === 200) {
        this.conversionChildrenList = res.data;
      }
    },
    //获取字典列表
    async getDictByCode(code) {
      const res = await getDictByCode({code: code});
      if (res.code === 200) {
        this.controlTypeList = res.data;
      }
    },

    //获取子级字典列表
    async getDictByParentId(parentId) {
      const res = await getDictByParentId({parentId: parentId});
      if (res.code === 200) {
        this.dataSourceList = res.data;
      }
    },

    //新增查询条件
    addSearch() {
      this.serveVisibleForSearch = true;
      this.titleForSearch = '新增查询条件';
      Object.assign(this.searchField, {
        pid: null,
        searchField: '',
        searchDesc: '',
        searchControlType: "文本框",
        searchFieldType: '',
        sort: 0
      });
    },

    //新增展示字段
    addShowField() {
      this.serveVisibleForShow = true;
      this.titleForShow = '新增展示字段';
      Object.assign(this.showField, {
        pid: null,
        showField: '',
        showDesc: '',
        searchControlType: '文本框',
        isUnitTransform: 0,
        originUnit: '',
        targetUnit: ''
      });
      this.getConversionList()
    },

    //新增统计字段
    addStatisticsField(){
      this.serveVisibleForStatistics = true;
      this.titleForStatistics = '新增统计字段';
      Object.assign(this.statisticsFields, {
        pid: null,
        statisticsField: '',
        statisticsDesc: '',
      });
    },

    //保存展示条件
    saveShowFieldDialog() {
      this.$refs.showField.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        // 如果pid不为空则为编辑
        if (this.showField.pid != null) {
          const res = await updateShow(this.showField);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisibleForShow = false;
            await this.getShowListByLayerId(this.showField.layerId);
          }
        } else {
          const res = await saveShow(this.showField);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisibleForShow = false;
            this.defaultLoadFlag = '展示字段';
            await this.getShowListByLayerId(this.showField.layerId);
          }
        }
      });
    },

    //保存统计字段
    saveStatisticsFieldDialog() {
      this.$refs.statisticsField.validate(async (valid) => {
        console.log("保存的字段",this.statisticsFields)
        if (!valid) return this.$message.error('请补充必填项');
        // 如果pid不为空则为编辑
        if (this.statisticsFields.pid != null) {
          const res = await updateStatistics(this.statisticsFields);
          if (res.code === 200) {
            this.$message.success('保存成功');
            this.serveVisibleForStatistics = false;
            await this.getStatisticsListByLayerId(this.statisticsFields.layerId);
          }
        } else {
          const res = await saveStatistics(this.statisticsFields);
          if (res.code === 200) {
            this.$message.success('保存成功');
            this.serveVisibleForStatistics = false;
            this.defaultLoadFlag = '统计字段';
            await this.getStatisticsListByLayerId(this.statisticsFields.layerId);
          }
        }
      });
    },

    //保存查询条件
    saveSearchDialog() {
      this.$refs.searchField.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        // 如果pid不为空则为编辑
        if (this.searchField.pid != null) {
          const res = await updateSearch(this.searchField);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisibleForSearch = false;
            await this.getSearchListByLayerId(this.searchField.layerId);
          }
        } else {
          const res = await saveSearch(this.searchField);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisibleForSearch = false;
            this.defaultLoadFlag = '查询条件';
            await this.getSearchListByLayerId(this.searchField.layerId);
          }
        }
      });
    },

    //编辑查询条件
    handleEditSearch(row) {
      this.serveVisibleForSearch = true;
      this.titleForSearch = '编辑查询条件';
      Object.assign(this.searchField, row);
    },

    //编辑展示字段
    handleEditShow(row) {
      this.serveVisibleForShow = true;
      this.titleForShow = '编辑展示字段';
      Object.assign(this.showField, row);
      this.getConversionList()
    },

    //编辑统计字段
    handleEditStatistics(row) {
      this.serveVisibleForStatistics = true;
      this.titleForStatistics = '编辑统计字段';
      Object.assign(this.statisticsFields, row);
    },

    //删除查询条件
    async handleDeleteSearch(row) {
      this.$confirm('此操作将永久删除该查询条件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delSearch({pid: row.pid});
        if (res.code === 200) {
          this.$message.success('删除成功！');
          await this.getSearchListByLayerId(row.layerId);
        }
      })
          .catch(() => {
            this.$message.info('已取消删除');
          });
    },

    //删除展示字段
    async handleDeleteShow(row) {
      this.$confirm('此操作将永久删除该展示字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delShow({pid: row.pid});
        if (res.code === 200) {
          this.$message.success('删除成功！');
          await this.getShowListByLayerId(row.layerId);
        }
      })
          .catch(() => {
            this.$message.info('已取消删除');
          });
    },

    //删除统计字段
    async handleDeleteStatistics(row) {
      this.$confirm('此操作将永久删除该统计字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delStatistics({pid: row.pid});
        if (res.code === 200) {
          this.$message.success('删除成功！');
          await this.getStatisticsListByLayerId(row.layerId);
        }
      })
          .catch(() => {
            this.$message.info('已取消删除');
          });
    },

    changeValue(val) {
      //从conversionList中获取value为val的数据的pid
      let pid = this.conversionList.find(item => item.value === val).pid;
      this.getConversionChildrenList(pid);
      this.showField.targetUnit = ''

    },
    //头部点击动作
    handleClick(tab, event) {
      console.log(tab, event);
    },


    //公式
    //打开公式列表弹窗
    formulaList() {
      //如果this.groupForm.pid不为null继续
      if(this.groupForm.pid!=null){
        this.setVisibleForFormula = true;
        this.getFormulaListByTreeId();
        this.getLayerAndFieldsByModelTreeId();
        this.getAllLayerAndFields();
        this.getAllLayerAndFieldsNumber();
      }else {
        //弹窗提示请选择模块
        this.$message.error('请选择模块');
      }

    },

    //公式新增按钮
    addFormulaBtn(){
      this.setVisibleForFormulaUpdate = true;
      this.titleForFormula = '新增公式';
      this.formulaData = {
        pid: null,
        name: '',
        expression: '',
        modelId: this.groupForm.pid,
        formulaConfigList: [
          {
            pid:null,
            formulaId: null,
            layerId: '',
            layerField: '',
            name: '',
            layerName: '',
          }
        ]
      }
    },

    //公式编辑按钮
    handleEditFormula(row) {
      this.setVisibleForFormulaUpdate = true;
      this.titleForFormula = '编辑公式';
      this.getFormulaConfigByPid(row.pid);
    },

    //获取公式信息
    getFormulaConfigByPid(pid){
      getFormulaConfigByPid({pid: pid}).then(res => {
        if (res.code === 200) {
          this.formulaData = res.data;
        }
      })
    },

    //新增一个图层
    addNewLayer(){
      this.formulaData.formulaConfigList.push({
        pid:null,
        formulaId: this.formulaData.pid,
        layerId: '',
        layerField: '',
        name: '',
        layerName: '',
      })
    },

    //删除一个图层
    removeDomain(item) {
      //至少要保留一个图层
      if(this.formulaData.formulaConfigList.length === 1){
        this.$message.error('至少要保留一个图层');
        return
      }
      var index = this.formulaData.formulaConfigList.indexOf(item)
      if (index !== -1) {
        this.formulaData.formulaConfigList.splice(index, 1)
      }
    },

    //获取公式列表
    getFormulaListByTreeId() {
      getFormulaListByTreeId({modelTreeId: this.groupForm.pid}).then(res => {
        if (res.code === 200) {
          this.formulaListData = res.data;
        }
      })
    },

    //保存或更新公式
    saveFormulaDialog(){
      this.$refs.searchField.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        //循环遍历formulaConfigList，如果layerId为空或者layerField为空则提示
        // for(let i = 0; i < this.formulaData.formulaConfigList.length; i++){
        //   if(this.formulaData.formulaConfigList[i].layerId === '' || this.formulaData.formulaConfigList[i].layerField === ''){
        //     this.$message.error('当前新增的配置信息中存在图层或者字段为空的数据');
        //     return
        //   }
        // }
        // 如果pid不为空则为编辑
        const res = await addOrUpdateFormula(this.formulaData);
        if (res.code == 200) {
          this.$message.success('保存成功');
          this.setVisibleForFormulaUpdate = false;
          this.getFormulaListByTreeId();
        }
      });
    },

    //点击公式辅助
    radioChange(val){
      this.formulaData.expression += val;
    },

    //获取对应的图层及字段
    getLayerAndFieldsByModelTreeId(){
      getLayerAndFieldsByModelTreeId({modelTreeId: this.groupForm.pid}).then(res => {
        if (res.code === 200) {
          this.layersAndColumns = res.data;
          //循环取出dbFieldList放到dbFieldList中，key为pid
          this.layersAndColumns.forEach(item => {
            //以item的pid作为key，item下的dbFieldList作为value
            this.dbFieldList[item.pid] = item.dbFieldList;
          })
          console.log(this.dbFieldList);
        }
      })
    },

    //删除公式
    handleDeleteFormula(row){
      this.$confirm('此操作将永久删除该公式, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        delFormula({pid: row.pid}).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getFormulaListByTreeId();
          }
        })
      })

    },
    //展示公式的查询条件结果列表
    handleListFormula(row){
      this.setVisibleForFormulaSearchAndShow = true;
      this.getFormulaSearchListByFormulaId(row.pid);
      this.getFormulaShowListByFormulaId(row.pid);
      this.getFormulaConfigByPid(row.pid);
      this.getAllLayerAndFieldsByFormulaId(row.pid);
    },

    //根据公式id获取公式对应的图层及字段
    getAllLayerAndFieldsByFormulaId(pid){
      getAllLayersFieldsByFormulaId({onlyNumber:false,formulaId: pid}).then(res => {
        if (res.code === 200) {
          this.allLayersAndColumnsByFormula = res.data;
        }
      })
    },
    //展示公式的查询条件结果列表
    async getFormulaSearchListByFormulaId(pid) {
      const res = await getFormulaSearchListByFormulaId({formulaId: pid});
      if (res.code === 200) {
        this.searchTableDataFormula = res.data;
      }
    },
    //展示公式的展示字段结果列表
    async getFormulaShowListByFormulaId(pid) {
      const res = await getFormulaShowListByFormulaId({formulaId: pid});
      if (res.code === 200) {
        this.showTableDataFormula = res.data;
      }
    },
    //新增公式查询条件
    addSearchFormula() {
      this.serveVisibleForSearchFormula = true;
      this.titleForFormulaSearch = '新增查询条件';
      Object.assign(this.searchFieldFormula, {
        pid: null,
        searchField: '',
        searchDesc: '',
        searchControlType: "文本框",
        layerId: '',
        formulaId : this.formulaData.pid,
        sort: 0,
        fieldPathList: []
      });
      this.getDictByCode('SEARCH_CONTROL_TYPE');
    },

    //新增公式展示字段
    addShowFieldFormula() {
      this.serveVisibleForShowFormula = true;
      this.titleForFormulaShow = '新增展示字段';
      Object.assign(this.showFieldFormula, {
        pid: null,
        showField: '',
        showDesc: '',
        isUnitTransform: 0,
        layerId: '',
        originUnit: '',
        targetUnit: '',
        sort: 0,
        isFormulaResult: 0,
        formulaId : this.formulaData.pid,
        fieldPathList: []
      });
      this.getConversionList()
    },

    //编辑公式展示字段
    handleEditSearchFormula(row) {
      this.serveVisibleForSearchFormula = true;
      this.titleForFormulaSearch = '编辑查询条件';
      this.getDictByCode('SEARCH_CONTROL_TYPE');
      Object.assign(this.searchFieldFormula, row);

    },


    //保存公式查询条件
    saveSearchDialogFormula() {
      this.$refs.searchFieldFormula.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        // 如果pid不为空则为编辑
        if (this.searchFieldFormula.pid != null) {
          const res = await updateFormulaSearch(this.searchFieldFormula);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisibleForSearchFormula = false;
            await this.getFormulaSearchListByFormulaId(this.searchFieldFormula.formulaId);
          }
        } else {
          const res = await saveFormulaSearch(this.searchFieldFormula);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisibleForSearchFormula = false;
            await this.getFormulaSearchListByFormulaId(this.searchFieldFormula.formulaId);
          }
        }
      });
    },

    //删除公式查询条件
    handleDeleteSearchFormula(row) {
      this.$confirm('此操作将永久删除该查询条件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delFormulaSearch({pid: row.pid});
        if (res.code === 200) {
          this.$message.success('删除成功！');
          await this.getFormulaSearchListByFormulaId(row.formulaId);
        }
      })
          .catch(() => {
            this.$message.info('已取消删除');
          });
    },

    //编辑公式展示字段
    handleEditShowFormula(row) {
      this.serveVisibleForShowFormula = true;
      this.titleForFormulaShow = '编辑展示字段';
      Object.assign(this.showFieldFormula, row);
      this.getConversionList()
    },

    //保存公式展示字段
    saveShowFieldDialogFormula() {
      this.$refs.showFieldFormula.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        //如果showFieldFormula下的fieldPathList为""则重置为[]
        if(this.showFieldFormula.fieldPathList === ""){
          this.showFieldFormula.fieldPathList = [];
        }
        // 如果pid不为空则为编辑
        if (this.showFieldFormula.pid != null) {
          const res = await updateFormulaShow(this.showFieldFormula);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisibleForShowFormula = false;
            await this.getFormulaShowListByFormulaId(this.showFieldFormula.formulaId);
          }
        } else {
          const res = await saveFormulaShow(this.showFieldFormula);
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.serveVisibleForShowFormula = false;
            await this.getFormulaShowListByFormulaId(this.showFieldFormula.formulaId);
          }
        }
      });
    },


    //删除公式展示字段
    handleDeleteShowFormula(row) {
      this.$confirm('此操作将永久删除该展示字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delFormulaShow({pid: row.pid});
        if (res.code === 200) {
          this.$message.success('删除成功！');
          await this.getFormulaShowListByFormulaId(row.formulaId);
        }
      })
          .catch(() => {
            this.$message.info('已取消删除');
          });
    },

    //根据查询条件id获取查询条件数据的列表
    async getOptionsByFieldIdSearch(pid){
      await getOptionsByFieldIdSearch({fieldId: pid}).then(res => {
        if (res.code === 200) {
          this.OptionsByFieldIdSearch = res.data;
        }
      })
    },

    //根据公式查询条件id获取查询条件数据的列表
    async getOptionsByFieldIdFormulaSearch(pid){
      await getOptionsByFieldIdFormulaSearch({searchId: pid}).then(res => {
        if (res.code === 200) {
          this.OptionsByFieldIdFormulaSearch = res.data;
        }
      })
    },

    //下拉数据按钮点击
    handleOptions(row){
      this.getOptionsByFieldIdSearch(row.pid);
      Object.assign(this.listForm, { fieldId: row.pid });
      this.listVisible = true;
    },

    //下拉数据按钮点击
    handleOptionsFormula(row){
      this.getOptionsByFieldIdFormulaSearch(row.pid);
      Object.assign(this.listFormFormula, { formulaFieldId: row.pid });
      this.listVisibleFormula = true;
    },


    //删除数据列表
    async listDelete(row){
      this.$confirm('此操作将永久删除该数据列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delSearchOptions({pid: row.pid});
        if (res.code === 200) {
          this.$message.success('删除成功！');
          await this.getOptionsByFieldIdSearch(row.fieldId);
        }
      })
          .catch(() => {
            this.$message.info('已取消删除');
          });
    },


    //新增图层查询条件数据列表
    saveListDialog(){
      this.$refs.listForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        const res = await saveSearchOptions(this.listForm);
        if (res.code === 200) {
          this.$message.success(`添加成功`);
          await this.getOptionsByFieldIdSearch(this.listForm.fieldId);
          this.$refs.listForm.resetFields();
        }
      });
    },

    //新增公式查询条件数据列表
    saveListDialogFormula(){
      this.$refs.listFormFormula.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        const res = await saveFormulaSearchOptions(this.listFormFormula);
        if (res.code === 200) {
          this.$message.success(`添加成功`);
          await this.getOptionsByFieldIdFormulaSearch(this.listFormFormula.formulaFieldId);
          this.$refs.listFormFormula.resetFields();

        }
      });
    },

    //删除公式数据列表
    async listDeleteFormula(row){
      this.$confirm('此操作将永久删除该数据列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delFormulaSearchOptions({pid: row.pid});
        if (res.code === 200) {
          this.$message.success('删除成功！');
          await this.getOptionsByFieldIdFormulaSearch(row.formulaFieldId);
          this.$refs.listFormFormula.resetFields();
        }
      })
          .catch(() => {
            this.$message.info('已取消删除');
          });
    },

    //获取所有阶层图层字段
    getAllLayerAndFields(){
      getAllLayerAndFields().then(res => {
        if (res.code === 200) {
          this.allLayersAndColumns = res.data;
        }
      })
    },

    //获取所有阶层图层字段
    getAllLayerAndFieldsNumber(){
      getAllLayerAndFields({onlyNumber:true}).then(res => {
        if (res.code === 200) {
          this.allLayersAndColumnsNumber = res.data;
        }
      })
    },

    //获取字段，父级为图层
    getFieldsWithOnlyLayers(){
      getAllLayerAndFields({onlyLayers: true}).then(res => {
        if (res.code === 200) {
          this.allLayersAndColumnsOnlyLayers = res.data;
        }
      })
    },

    //根据关键字获取服务类型下拉数据
    getServiceKind(){
      getServerType().then(res => {
        if (res.code === 200) {
          this.serverKindList = res.data;
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.container {
  display: flex;
  min-height: 81vh;

  .service-aside {
    width: 300px;
    border: 1px solid #dcdfe6;
    margin-right: 10px;
    padding: 0 2px;
  }

  .service-main {
    flex: 1;
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .el-input {
      width: 200px;
    }
  }

  .mr {
    margin-right: 10px;
  }

  ::v-deep .el-tree-node__content {
    font-size: 16px;
    padding: 2px 0;
    align-items: start;
    height: 100%;
  }

  .add-service {
    text-align: center;
    margin: 5px 0;

  }

  .layerSpan {
    display: inline-block;
    width: 300px;
    word-break: break-all;
    white-space: normal;
  }

  .el-select,
  .el-cascader {
    width: 100%;
  }
}
</style>
