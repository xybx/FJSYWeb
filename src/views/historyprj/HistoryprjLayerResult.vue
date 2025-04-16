<template>
  <div class='container'>
    <div class='service-main'>
      <div>
        <el-row :gutter='24'>
          <el-col :span='6'>
            <div class='flex-container'>
            <span class='centered-div'>
              所属角色：
            </span>
              <el-select v-model='queryParam.ruleId' placeholder='请选择所属角色' @change='buttonQueryPage' clearable>
                <el-option style='width: 300px' v-for='item in ruleListData' :key='item.pid' :label='item.name'
                           :value='item.pid'></el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span='6'>
            <el-button type='primary' icon='el-icon-refresh' class='handle-del mr10' @click='dataSync'>
              数据同步
            </el-button>
            <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增数据
            </el-button>
          </el-col>

        </el-row>
      </div>

      <el-table style='font-size: 15px; margin-top: 10px' :data='tableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='pid' label='id' align='center'></el-table-column>
        <el-table-column prop='fieldName' label='字段名称' align='center'></el-table-column>
        <el-table-column prop='fieldDesc' label='字段描述' align='center'></el-table-column>
        <el-table-column prop='ruleName' label='角色名称' align='center'></el-table-column>
        <el-table-column prop='sort' label='排序' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='delLayerResult(scope.row)' style='color:red'>删除
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

      <el-dialog
          :title='title'
          :visible.sync='dataFlag'
          width='25%'
          :close-on-click-modal='false'
          :destroy-on-close='true'
          :before-close='handleClose'>
        <el-form ref='dataFormRef' :model='dataForm' :rules='dataFormRules' label-width='100px'>
          <el-form-item label='展示字段：' prop='fieldName'>
            <el-select v-model='dataForm.fieldName' placeholder='请选择' @change='selectChange'>
              <el-option v-for='item in fieldList' :key='item.name' :label="item.name + '::' + item.alias"
                         :value='item.name'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='字段描述：' prop='fieldDesc'>
            <el-input v-model='dataForm.fieldDesc'></el-input>
          </el-form-item>
          <el-form-item label='所属角色：' prop='ruleId'>
            <el-select v-model='dataForm.ruleId' placeholder='请选择'>
              <el-option v-for='item in ruleListData' :key='item.pid' :label='item.name' :value='item.pid'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='排序：' prop='sort'>
            <el-input-number :min='0' size='medium' v-model='dataForm.sort'></el-input-number>
          </el-form-item>
        </el-form>
        <span slot='footer' class='dialog-footer'>
                <el-button @click='dataFlag = false'>取 消</el-button>
                <el-button type='primary' @click='saveData()'>确 定</el-button>
            </span>
      </el-dialog>

      <el-dialog
          title='数据同步'
          :visible.sync='syncDataFlag'
          width='30%'
          custom-class='set-dialog'
          :destroy-on-close='true'
          :close-on-click-modal='false'>

        <el-form ref='syncDataFormRef' :inline='true' :model='syncDataForm' label-width='auto' class='group-form'
                 :rules='syncDataRules'>
          <el-form-item label='源数据角色：' prop='originDataId'>
            <el-select v-model='syncDataForm.originDataId' placeholder='请选择'>
              <el-option v-for='item in ruleListData' :key='item.pid' :label='item.name' :value='item.pid'></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label='目标数据角色' prop='targetDataId'>
            <el-select v-model='syncDataForm.targetDataId' placeholder='请选择'>
              <el-option v-for='item in ruleListData' :key='item.pid' :label='item.name' :value='item.pid'></el-option>
            </el-select>
          </el-form-item>

        </el-form>

        <span slot='footer' class='dialog-footer'>
          <el-button @click='syncDataFlag = false'>取 消</el-button>
          <el-button size='mini' type='primary' @click='sync'>同 步</el-button>
      </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {
  getLayerResultPageApi,
  saveLayerResultApi,
  delLayerResultApi,
  getRuleListApi,
  getFieldsListApi,
  syncDataApi
} from '@/api/HistoryprjLayerResult-api';

export default {
  name: 'historyLayerResult',
  props: {},
  components: {},
  data() {
    return {
      queryParam: {
        ruleId: undefined,
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      ruleListData: [],
      dataFlag: false,
      dataForm: {
        fieldName: undefined,
        fieldDesc: undefined,
        ruleId: undefined,
        sort: 0
      },
      copyDataForm: {
        fieldName: undefined,
        fieldDesc: undefined,
        ruleId: undefined,
        sort: 0
      },
      dataFormRules: {
        fieldName: [{ required: true, message: '展示字段不能为空', trigger: 'change' }],
        fieldDesc: [{ required: true, message: '字段描述不能为空', trigger: 'blur' }],
        ruleId: [{ required: true, message: '所属角色不能为空', trigger: 'change' }],
      },
      title: '新增展示字段',
      fieldList: [],
      syncDataFlag: false,
      syncDataForm: {
        originDataId: undefined,
        targetDataId: undefined
      },
      syncDataRules: {
        originDataId: [{ required: true, message: '源数据角色不能为空', trigger: 'change' }],
        targetDataId: [{ required: true, message: '目标数据角色不能为空', trigger: 'change' }]
      }
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.queryPage();
    this.queryRuleList();
  },
  methods: {
    handleEdit(row) {
      this.dataFlag = true;
      this.title = '编辑展示字段';
      this.getFieldsList();
      Object.assign(this.dataForm, row);
    },
    selectChange(data) {
      this.fieldList.forEach(item => {
        if (item.name == data) {
          this.dataForm.fieldDesc = item.alias;
        }
      })
    },
    saveData() {
      this.$refs.dataFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        saveLayerResultApi(this.dataForm).then(res => {
          if (res.code == 200) {
            this.$message.success("操作成功！");
            this.queryPage();
            this.dataFlag = false;
          }
        })
      });
    },
    getFieldsList() {
      getFieldsListApi().then(res => {
        if (res.code == 200) {
          this.fieldList = res.data;
        }
      });
    },
    addData() {
      this.dataFlag = true;
      this.getFieldsList();
      Object.assign(this.dataForm, this.copyDataForm);
    },
    handleClose(done) {
      done();
    },
    buttonQueryPage() {
      this.queryParam.page = 1;
      getLayerResultPageApi(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    queryPage() {
      getLayerResultPageApi(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    dataSync() {
      this.syncDataForm.originDataId = undefined;
      this.syncDataForm.targetDataId = undefined;
      this.syncDataFlag = true;
    },
    sync() {
      this.$refs.syncDataFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        syncDataApi(this.syncDataForm).then(res => {
          if (res.code == 200) {
            this.$message.success("操作成功！");
            this.queryPage();
            this.syncDataFlag = false;
          }
        })
      });
    },
    queryRuleList() {
      getRuleListApi().then(res => {
        if (res.code == 200) {
          this.ruleListData = res.data;
        }
      });
    },
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.queryPage();
    },
    handleCurrentChange(val) {
      this.queryParam.page = val;
      this.queryPage();
    },
    delLayerResult(row) {
      delLayerResultApi(row.pid).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功！");
          this.queryPage();
        }
      })
    }
  }
};
</script>

<style scoped lang='scss'>
@import '@/assets/scss/common.scss';

.container {
  display: flex;
  min-height: 81vh;


  .service-aside {
    width: 300px;
    border: 1px solid #dcdfe6;
    margin-right: 10px;
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
    font-size: 14px;
  }

  .add-service {
    text-align: center;
    margin: 5px 0;
  }
}

.el-select {
  width: 100%;
}

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
  width: 6.2555vw;
}
</style>
