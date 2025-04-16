<!--
 * @Author: ssq
 * @Date: 2022-09-26 15:47:10
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-27 16:06:29
 * @FilePath: \fjsy-web\src\views\historyprj\CityHealth.vue
 * @Description:
 *
 * Copyright (c) 2022 by hydp, All Rights Reserved.
-->
<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='数据管理' name='data'>
      </el-tab-pane>
      <el-tab-pane label='列表展示配置' name='list'>
      </el-tab-pane>
    </el-tabs>

    <div v-if="type == 'data'">
      <el-row :gutter='24'>

        <el-col :span='6'>
          <div class='flex-container'>
          <span class='centered-div'>
            项目负责人：
          </span>
            <el-input style='width: 250px' v-model='listQueryParam.prjPrincipal' placeholder='请输入项目负责人模糊搜索'></el-input>
          </div>
        </el-col>

        <el-col :span='6'>
          <div class='flex-container'>
          <span class='centered-div'>
            项目主办所室：
          </span>
            <el-input style='width: 250px' v-model='listQueryParam.prjMainDepartment'
                      placeholder='请输入项目主办所室模糊搜索'></el-input>
          </div>
        </el-col>

        <el-col :span='6'>
          <div class='flex-container'>
          <span class='centered-div'>
            合同正式名称：
          </span>
            <el-input style='width: 250px' v-model='listQueryParam.contractName' placeholder='请输入合同正式名称模糊搜索'></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter='20'>
        <el-col :span='6'>
          <div class='flex-container'>
          <span class='centered-div'>
            协作部门：
          </span>
            <el-input style='width: 250px' v-model='listQueryParam.cooperationDepartment'
                      placeholder='请输入协作部门模糊搜索'></el-input>
          </div>
        </el-col>
        <el-col :span='6'>
          <div class='flex-container'>
          <span class='centered-div'>
            委托单位名称：
          </span>
            <el-input style='width: 250px' v-model='listQueryParam.clientName' placeholder='请输入委托单位名称模糊搜索'></el-input>
          </div>
        </el-col>
        <el-col :span='12'>
          <div class='grid-content bg-purple'>
            <div>
              <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryListData'>
                查询
              </el-button>
              <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downListTemplate'>
                下载导入数据模板
              </el-button>
              <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importListExcel'>导入数据
              </el-button>
              <el-button type='danger' icon='el-icon-delete' class='handle-del mr10' @click='clearData'>清空数据</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-table style='font-size: 15px' :data='listTableData' border class='table' ref='listTableDataRef'>
        <el-table-column label='操作' width='130' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='listHandleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='listHandleDelete(scope.row)' style='color:red'>
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop='dollar' label='金额' align='center'></el-table-column>
        <el-table-column prop='prjStreamNum' label='项目流水号' align='center'></el-table-column>
        <el-table-column prop='isImportant' label='重点项目筛选' align='center'></el-table-column>
        <el-table-column prop='contractName' label='合同正式名称' align='center' width='310'></el-table-column>
        <el-table-column prop='prjContractStreamNum' label='项目合同流水号' align='center'></el-table-column>
        <el-table-column prop='contractFileStreamNum' label='合同存档流水号' align='center'></el-table-column>
        <el-table-column prop='myContractPrice' label='我院合同金额' align='center'></el-table-column>
        <el-table-column prop='contractCode' label='合同编码' align='center'></el-table-column>
        <el-table-column prop='contractType' label='合同类型' align='center'></el-table-column>
        <el-table-column prop='signDate' label='签订日期' align='center'></el-table-column>
        <el-table-column prop='prjYear' label='项目年度' align='center'></el-table-column>
        <el-table-column prop='prjMonth' label='项目月份' align='center'></el-table-column>
        <el-table-column prop='isUploadContractAttachment' label='是否已上传合同附件' align='center'></el-table-column>
        <el-table-column prop='submitDepartment' label='提交科所' align='center'></el-table-column>
        <el-table-column prop='totalPrice' label='总金额' align='center'></el-table-column>
        <el-table-column prop='submitPerson' label='提交人' align='center'></el-table-column>
        <el-table-column prop='prjPrincipal' label='项目负责人' align='center'></el-table-column>
        <el-table-column prop='remark' label='备注' align='center'></el-table-column>
        <el-table-column prop='contractCodePrefix' label='合同编码前缀' align='center'></el-table-column>
        <el-table-column prop='contractCodeSuffix' label='合同编码后缀' align='center'></el-table-column>
        <el-table-column prop='isExistContractCode' label='是否已存在合同编码' align='center'></el-table-column>
        <el-table-column prop='prjMainDepartment' label='项目主办所室' align='center'></el-table-column>
        <el-table-column prop='cooperationDepartment' label='协作部门' align='center'></el-table-column>
        <el-table-column prop='contractPrice' label='合同总价' align='center'></el-table-column>
        <el-table-column prop='prjRangeNum' label='项目规模数值' align='center'></el-table-column>
        <el-table-column prop='myProportion' label='我院占比' align='center'></el-table-column>
        <el-table-column prop='prjRange' label='项目规模' align='center'></el-table-column>
        <el-table-column prop='payPriceTotal' label='付款金额合计' align='center'></el-table-column>
        <el-table-column prop='payPriceProportion' label='付款比例合计' align='center'></el-table-column>
        <el-table-column prop='clientName' label='委托单位名称' align='center'></el-table-column>
        <el-table-column prop='province' label='省' align='center'></el-table-column>
        <el-table-column prop='city' label='市' align='center'></el-table-column>
        <el-table-column prop='country' label='县' align='center'></el-table-column>
        <el-table-column prop='street' label='街道' align='center'></el-table-column>
        <el-table-column prop='prjPredictType' label='项目预类型' align='center'></el-table-column>
        <el-table-column prop='prjPredictCode' label='项目预类型编码' align='center'></el-table-column>
        <el-table-column prop='clientRelationName' label='委托单位联系人' align='center'></el-table-column>
        <el-table-column prop='clientRelationPhone' label='委托单位联系电话' align='center'></el-table-column>
        <el-table-column prop='contractNumSystem' label='合同编号-系统' align='center'></el-table-column>
        <el-table-column prop='isElectronicContract' label='是否为电子合同' align='center'></el-table-column>
        <el-table-column prop='myContractPriceWan' label='我院合同金额万元' align='center'></el-table-column>
        <el-table-column prop='isEmptyContract' label='是否是空壳合同' align='center'></el-table-column>
        <el-table-column prop='contractUpdateMode' label='勿改_合同触发更新方式_修改' align='center'></el-table-column>
        <el-table-column prop='contractDurationStatusHide' label='合同存续状态_隐' align='center'></el-table-column>
        <el-table-column prop='totalPaymentPrice' label='累计到款金额' align='center'></el-table-column>
        <el-table-column prop='totalInvoicePrice' label='累计开票金额' align='center'></el-table-column>
        <el-table-column prop='contractBalance' label='合同余额' align='center'></el-table-column>
        <el-table-column prop='contractPaymentPrice' label='合同到款金额' align='center'></el-table-column>
        <el-table-column prop='contractCheckEndDate' label='合同审批结束时间' align='center'></el-table-column>
        <el-table-column prop='contractDurationStatus' label='合同存续状态' align='center'></el-table-column>
        <el-table-column prop='prjProcessQualityControlPoint' label='项目过程质控点' align='center'></el-table-column>
        <el-table-column prop='isResubmitQualityManage' label='是否重新发起质量管理' align='center'></el-table-column>
        <el-table-column prop='contractArchiveDate' label='合同存档时间' align='center'></el-table-column>
        <el-table-column prop='creatorName' label='创建人' align='center'></el-table-column>
        <el-table-column prop='createDate' label='创建时间' align='center'></el-table-column>
        <el-table-column prop='editDate' label='修改时间' align='center'></el-table-column>
      </el-table>

      <div class='pagination'>
        <el-pagination @size-change='listHandleSizeChange' @current-change='listHandleCurrentChange'
                       :current-page='listQueryParam.page'
                       :page-sizes='[5, 10]' :page-size='listQueryParam.pageSize'
                       layout='total, sizes, prev, pager, next, jumper'
                       :total='listTotal'>
        </el-pagination>
      </div>

      <el-dialog
          title='导入模板数据'
          :visible.sync='listImportData'
          :destroy-on-close='true'
          width='30%'
          :close-on-click-modal='false'
          :before-close='handleImportDataClose'>
        <el-upload class='upload-demo' :action='importURL' :on-preview='handlePreview'
                   :on-remove='handleRemove' :headers='headers' accept='.xlsx' :before-remove='beforeRemove' multiple
                   :limit='1' :on-exceed='handleExceed'
                   :on-success='onSuccess'
                   :file-list='fileList'>
          <el-button size='small' type='primary'>点击导入</el-button>
          <div slot='tip' class='el-upload__tip'>只能导入下载后的模板文件</div>
        </el-upload>
        <span slot='footer' class='dialog-footer'>
                    <el-button @click='listImportData = false'>取 消</el-button>
                </span>
      </el-dialog>

      <el-dialog
          title='修改数据'
          :visible.sync='listEditDataFlag'
          :destroy-on-close='true'
          width='70%'
          :close-on-click-modal='false'
          :before-close='handleImportDataClose'>
        <el-form ref='editListDataRef' :model='listDataForm' label-width='150px'>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='金额：'>
                <el-input v-model.trim='listDataForm.dollar'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='项目流水号：'>
                <el-input v-model.trim='listDataForm.prjStreamNum'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='重点项目筛选：'>
                <el-input v-model.trim='listDataForm.isImportant'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='合同正式名称：'>
                <el-input v-model.trim='listDataForm.contractName'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='项目合同流水号：'>
                <el-input v-model.trim='listDataForm.prjContractStreamNum'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合同存档流水号：'>
                <el-input v-model.trim='listDataForm.contractFileStreamNum'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='我院合同金额：'>
                <el-input-number :min='0' v-model='listDataForm.myContractPrice'></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合同编码：'>
                <el-input v-model.trim='listDataForm.contractCode'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合同类型：'>
                <el-input v-model.trim='listDataForm.contractType'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='签订日期：'>
                <el-date-picker
                    value-format='yyyy-MM-dd'
                    v-model="listDataForm.signDate"
                    type="date"
                    placeholder="签订日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='项目年度：'>
                <el-input-number :min='1' v-model='listDataForm.prjYear'></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='项目月份：'>
                <el-input-number :min='1' v-model='listDataForm.prjMonth'></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='是否已上传合同附件：'>
                <el-input v-model.trim='listDataForm.isUploadContractAttachment'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='提交科所：'>
                <el-input v-model.trim='listDataForm.submitDepartment'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='总金额：'>
                <el-input-number :min='0' v-model='listDataForm.totalPrice'></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='项目负责人：'>
                <el-input v-model.trim='listDataForm.prjPrincipal'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='备注：'>
                <el-input v-model.trim='listDataForm.remark'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合同编码前缀：'>
                <el-input v-model.trim='listDataForm.contractCodePrefix'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='合同编码后缀：'>
                <el-input v-model.trim='listDataForm.contractCodeSuffix'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='是否已存在合同编码：'>
                <el-input v-model.trim='listDataForm.isExistContractCode'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='项目主办所室：'>
                <el-input v-model.trim='listDataForm.prjMainDepartment'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='协作部门：'>
                <el-input v-model.trim='listDataForm.cooperationDepartment'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合同总价：'>
                <el-input-number :min='0' v-model='listDataForm.contractPrice'></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='项目规模数值：'>
                <el-input-number :min='0' v-model='listDataForm.prjRangeNum'></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='我院占比：'>
                <el-input-number :min='0' v-model='listDataForm.myProportion'></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='项目规模：'>
                <el-input v-model.trim='listDataForm.prjRange'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='付款金额合计：'>
                <el-input-number :min='0' v-model='listDataForm.payPriceTotal'></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='付款比例合计：'>
                <el-input v-model.trim='listDataForm.payPriceProportion'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='委托单位名称：'>
                <el-input v-model.trim='listDataForm.clientName'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='省：'>
                <el-input v-model.trim='listDataForm.province'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='市：'>
                <el-input v-model.trim='listDataForm.city'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='县：'>
                <el-input v-model.trim='listDataForm.country'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='街道：'>
                <el-input v-model.trim='listDataForm.street'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='项目预类型：'>
                <el-input v-model.trim='listDataForm.prjPredictType'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='项目预类型编码：'>
                <el-input v-model.trim='listDataForm.prjPredictCode'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='委托单位联系人：'>
                <el-input v-model.trim='listDataForm.clientRelationName'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='委托单位联系电话：'>
                <el-input v-model.trim='listDataForm.clientRelationPhone'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合同编号-系统：'>
                <el-input v-model.trim='listDataForm.contractNumSystem'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='是否为电子合同：'>
                <el-input v-model.trim='listDataForm.isElectronicContract'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='我院合同金额万元：'>
                <el-input-number :min='0' v-model='listDataForm.myContractPriceWan'></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='是否是空壳合同：'>
                <el-input v-model.trim='listDataForm.isEmptyContract'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='勿改_合同触发更新方式_修改：'>
                <el-input v-model.trim='listDataForm.contractUpdateMode'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='合同存续状态_隐：'>
                <el-input v-model.trim='listDataForm.contractDurationStatusHide'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='累计到款金额：'>
                <el-input-number :min='0' v-model='listDataForm.totalPaymentPrice'></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='累计开票金额：'>
                <el-input-number :min='0' v-model='listDataForm.totalInvoicePrice'></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='合同余额：'>
                <el-input-number :min='0' v-model='listDataForm.contractBalance'></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合同到款金额：'>
                <el-input-number :min='0' v-model='listDataForm.contractPaymentPrice'></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='合同审批结束时间：'>
                <el-date-picker
                    value-format='yyyy-MM-dd'
                    v-model="listDataForm.contractCheckEndDate"
                    type="date"
                    placeholder="合同审批结束时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='合同存续状态：'>
                <el-input v-model.trim='listDataForm.contractDurationStatus'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='项目过程质控点：'>
                <el-input v-model.trim='listDataForm.prjProcessQualityControlPoint'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='是否重新发起质量管理：'>
                <el-input v-model.trim='listDataForm.isResubmitQualityManage'></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='合同存档时间：'>
                <el-date-picker
                    value-format='yyyy-MM-dd'
                    v-model="listDataForm.contractArchiveDate"
                    type="date"
                    placeholder="合同存档时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='创建人：'>
                <el-input v-model.trim='listDataForm.creatorName'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='8'>
              <el-form-item label='创建时间：'>
                <el-date-picker
                    value-format='yyyy-MM-dd'
                    v-model="listDataForm.createDate"
                    type="date"
                    placeholder="创建时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter='24'>
            <el-col :span='8'>
              <el-form-item label='修改时间：'>
                <el-date-picker
                    value-format='yyyy-MM-dd'
                    v-model="listDataForm.editDate"
                    type="date"
                    placeholder="修改时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <span slot='footer' class='dialog-footer'>
                <el-button @click='handleCloseDialog'>取 消</el-button>
                <el-button type='primary' @click='submitEditData()'>确 定</el-button>
            </span>
      </el-dialog>

    </div>

    <HistoryprjListSearch v-if="type == 'list'"></HistoryprjListSearch>
  </div>
</template>

<script>
import {
  queryPageApi,
  delPidApi,
  editApi,
  importDataUrlApi,
  downloadExcelApi,
  cleanApi
} from '@/api/HistoryprjList-api';
import HistoryprjListSearch from '@/views/historyprj/HistoryprjListSearch';

export default {
  name: 'historyprjList',
  data() {
    return {
      type: 'data',
      listTableData: [],
      // 查询数据
      listQueryParam: {
        page: 1,
        pageSize: 5,
        contractName: undefined,
        prjPrincipal: undefined,
        prjMainDepartment: undefined,
        cooperationDepartment: undefined,
        clientName: undefined
      },
      listTotal: 0,
      listDataForm: {
        dollar: undefined,
        prjStreamNum: undefined,
        isImportant: undefined,
        contractName: undefined,
        prjContractStreamNum: undefined,
        contractFileStreamNum: undefined,
        myContractPrice: undefined,
        contractCode: undefined,
        contractType: undefined,
        signDate: undefined,
        prjYear: undefined,
        prjMonth: undefined,
        isUploadContractAttachment: undefined,
        submitDepartment: undefined,
        totalPrice: undefined,
        prjPrincipal: undefined,
        remark: undefined,
        contractCodePrefix: undefined,
        contractCodeSuffix: undefined,
        isExistContractCode: undefined,
        prjMainDepartment: undefined,
        cooperationDepartment: undefined,
        contractPrice: undefined,
        prjRangeNum: undefined,
        myProportion: undefined,
        prjRange: undefined,
        payPriceTotal: undefined,
        payPriceProportion: undefined,
        clientName: undefined,
        province: undefined,
        city: undefined,
        country: undefined,
        street: undefined,
        prjPredictType: undefined,
        prjPredictCode: undefined,
        clientRelationName: undefined,
        clientRelationPhone: undefined,
        contractNumSystem: undefined,
        isElectronicContract: undefined,
        myContractPriceWan: undefined,
        isEmptyContract: undefined,
        contractUpdateMode: undefined,
        contractDurationStatusHide: undefined,
        totalPaymentPrice: undefined,
        totalInvoicePrice: undefined,
        contractBalance: undefined,
        contractPaymentPrice: undefined,
        contractCheckEndDate: undefined,
        contractDurationStatus: undefined,
        prjProcessQualityControlPoint: undefined,
        isResubmitQualityManage: undefined,
        contractArchiveDate: undefined,
        creatorName: undefined,
        createDate: undefined,
        editDate: undefined
      },
      dataCopy: {
        listQueryParam: {
          page: 1,
          pageSize: 5,
          contractName: undefined,
          prjPrincipal: undefined,
          prjMainDepartment: undefined,
          cooperationDepartment: undefined,
          clientName: undefined
        }
      },
      listImportData: false,
      fileList: [],
      importURL: undefined,
      listEditDataFlag: false,



    };
  },
  components: {
    HistoryprjListSearch
  },
  computed: {
    // 上传时需要的请求头
    headers() {
      const token = sessionStorage.getItem('token');
      return {
        Authorization: token,
        loginType: 'system'
      };
    }
  },
  mounted() {
    this.queryListData();
    this.initImportUrl();
  },
  created() {

  },
  methods: {
    submitEditData() {
      editApi(this.listDataForm).then(res => {
        if (res.code == 200) {
          this.listEditDataFlag = false;
          this.$message.success("操作成功！");
          this.queryListData();
        }
      });
    },
    handleCloseDialog() {
      if (this.type == 'data') {
        this.listEditDataFlag = false;
        this.listDataForm = {};
      }
    },
    handleClick() {
      this.listQueryParam.page = 1;
    },
    buttonQueryListData() {
      this.listQueryParam.page = 1;
      this.queryListData();
    },
    queryListData() {
      queryPageApi(this.listQueryParam).then(res => {
        if (res.code == 200) {
          this.listTableData = res.data.records;
          this.listTotal = res.data.total;
        }
      });
    },
    // 分页参数回调
    listHandleSizeChange(val) {
      this.listQueryParam.pageSize = val;
      this.queryListData();
    },
    listHandleCurrentChange(val) {
      this.listQueryParam.page = val;
      this.queryListData();
    },
    listHandleEdit(row) {
      this.listEditDataFlag = true;
      Object.assign(this.listDataForm, row);
    },
    listHandleDelete(row) {
      this.$confirm('确认删除数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        delPidApi(row.pid).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功！');
            this.queryListData();
          }
        });
      }).catch(_ => {
      });
    },
    downListTemplate() {
      downloadExcelApi();
    },
    clearData() {
      this.$confirm('确认根据筛选条件清空数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            cleanApi(this.listQueryParam).then(res => {
              if (res.code == 200) {
                this.$message.success('清空成功！');
                Object.assign(this.listQueryParam, this.dataCopy.listQueryParam);
                this.queryListData();
              }
            });
          })
          .catch(_ => {
          });
    },
    importListExcel() {
      this.listImportData = true;
      this.fileList = [];
    },
    // 文件上传
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制单次上传 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`);
    },
    onSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.$message.success(response.msg);
        // 关闭对话框，刷新列表
        this.listImportData = false;
        this.queryListData();
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
    initImportUrl() {
      this.importURL = importDataUrlApi();
    },
    // 关闭回调
    handleClose(done) {
      done();
    },
    handleImportDataClose(done) {
      done();
    }
  }
};
</script>
<style>
.flex-container {
  display: flex;
  flex-direction: row;
}

.centered-div {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: normal;
  overflow-wrap: normal;
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