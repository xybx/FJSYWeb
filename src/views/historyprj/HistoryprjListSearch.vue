<template>
  <div class='container'>
    <div class='service-main'>
      <el-tabs v-model='tabValue' @tab-click='handleTabClick'>
        <el-tab-pane v-for='(item, index) in tabList' :key='index' :label='item.label' :name='item.name'></el-tab-pane>
      </el-tabs>

      <div>
        <el-row :gutter='24'>
          <el-col :span='6'>
            <div class='flex-container'>
            <span class='centered-div'>
              所属角色：
            </span>
              <el-select v-model='queryParam.ruleId' placeholder='请选择所属角色' @change='handleTabClick' clearable>
                <el-option style='width: 300px' v-for='item in ruleListData' :key='item.pid' :label='item.name'
                           :value='item.pid'></el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span='6'>
            <el-button type='primary' icon='el-icon-refresh' class='handle-del mr10' @click='dataSync'>
              数据同步
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 表格 -->
      <el-table style='font-size: 15px' :data='tableData' border stripe>
        <el-table-column
            v-for='(item, index) in tableCols'
            :key='index'
            :label='item.label'
            :prop='item.prop'
            :min-width='item.width'
            align='center'
        ></el-table-column>

        <el-table-column label='操作' align='center' min-width='170'>
          <template slot='header'>
            <!-- slot-scope="scope" -->
            <el-button size='mini' type='primary' @click='addItem' v-if="isAdmin == 'true'">新增</el-button>
          </template>
          <template v-slot='scope'>

            <el-button
                size='mini'
                type='warning'
                plain
                v-if="scope.row.controlType && scope.row.controlType == 'list'"
                @click='handleList(scope.row)'
            >{{ isAdmin == 'true' ? '编辑列表项' : '查看列表项' }}
            </el-button>

            <el-button size='mini' type='text' plain class='blue' icon='el-icon-edit' @click='handleEdit(scope.row)'>{{
                isAdmin == 'true' ? '编辑' : '查看'
              }}
            </el-button>
            <el-button
                v-if="isAdmin == 'true'"
                size='small'
                type='text'
                plain
                icon='el-icon-delete'
                class='red'
                @click='handleDelete(scope.row)'
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 结果不显示弹窗 -->
    <el-dialog
        :title='resTitle'
        :visible.sync='resVisible'
        width='25%'
        custom-class='set-dialog'
        :destroy-on-close='true'
        @closed='closedRes'
        :close-on-click-modal='false'
    >
      <el-form ref='resForm' :model='resForm' label-width='auto' class='group-form' :rules='resFormRules'>
        <el-form-item label='结果不展示字段名称' prop='fieldName'>
          <el-select v-model='resForm.fieldName' @change='changeResField' filterable placeholder='请选择不展示字段'>
            <el-option v-for='(item, index) in fieldList' :key='index' :label='`${item.fieldName}:${item.fieldDesc}`'
                       :value='item.fieldName'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='字段描述' prop='fieldDesc'>
          <el-input v-model.trim='resForm.fieldDesc' type='textarea'></el-input>
        </el-form-item>
        <el-form-item label='所属角色：' prop='ruleId'>
          <el-select v-model='resForm.ruleId' placeholder='请选择'>
            <el-option v-for='item in ruleListData' :key='item.pid' :label='item.name' :value='item.pid'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='resVisible = false'>取 消</el-button>
                <el-button type='primary' @click='saveResDialog'>确 定</el-button>
            </span>
    </el-dialog>

    <!-- 查询字段弹窗 -->
    <el-dialog
        :title='searchTitle'
        :visible.sync='searchVisible'
        width='25%'
        :destroy-on-close='true'
        custom-class='set-dialog'
        @closed='closedSearch'
        :close-on-click-modal='false'
    >
      <el-form ref='searchForm' :model='searchForm' label-width='auto' class='group-form' :rules='searchFormRules'>
        <el-form-item label='查询字段' prop='fieldName'>
          <el-select v-model='searchForm.fieldName' @change='changeField' filterable placeholder='请选择查询字段'>
            <el-option v-for='(item, index) in fieldList' :key='index' :label='`${item.fieldName}:${item.fieldDesc}`'
                       :value='item.fieldName'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='查询字段描述' prop='fieldDesc'>
          <el-input v-model.trim='searchForm.fieldDesc' maxlength='10' show-word-limit></el-input>
        </el-form-item>
        <el-form-item label='控件类型' prop='controlType'>
          <el-select v-model='searchForm.controlType'>
            <el-option
                v-for='(item, index) in ctrlTypeList'
                :key='index'
                :label='item.DICTNAME'
                :value='item.DICTVALUE'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='排序' prop='sort'>
          <el-input-number v-model='searchForm.sort'></el-input-number>
        </el-form-item>
        <el-form-item label='所属角色：' prop='ruleId'>
          <el-select v-model='searchForm.ruleId' placeholder='请选择'>
            <el-option v-for='item in ruleListData' :key='item.pid' :label='item.name' :value='item.pid'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='searchVisible = false'>取 消</el-button>
                <el-button type='primary' @click='saveSearchDialog'>确 定</el-button>
            </span>
    </el-dialog>

    <!-- 编辑列表项弹窗 -->
    <el-dialog
        :title='listTitle'
        :visible.sync='listVisible'
        width='50%'
        custom-class='set-dialog'
        :destroy-on-close='true'
        @closed='closedList'
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

      <el-table :data='listFieldData' border stripe max-height='400'>
        <el-table-column label='id' prop='pid' align='center'></el-table-column>
        <el-table-column label='控件名称' prop='name' align='center'></el-table-column>
        <el-table-column label='控件值' prop='value' align='center'></el-table-column>

        <el-table-column label='操作' align='center' min-width='100' v-if="isAdmin == 'true'">
          <template v-slot='scope'>
            <el-button size='mini' type='danger' plain @click='listDelete(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot='footer' class='dialog-footer'>
                <el-button @click='listVisible = false'>取 消</el-button>
                <el-button type='primary' @click='listVisible = false' v-if="isAdmin == 'true'">确 定</el-button>
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
               :rules='syncDataRules' v-if="isAdmin == 'true'">
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
</template>

<script>
import {
  editField,
  getResField,
  saveResField,
  editResField,
  delResField,
  getField,
  saveField,
  delField,
  getFieldType,
  getCtrlType,
  saveListField,
  getListField,
  delListField,
  getRuleListApi,
  syncDataApi,
  queryFieldListApi
} from '@/api/HistoryprjListSearch-api';
import { getWebGis, getServerLayers } from '@/api/onemap/hxdownload-api';

export default {
  name: 'historyprjListSearch',
  props: {},
  components: {},
  data() {
    return {
      queryParam: {
        ruleId: undefined
      },
      isAdmin: false,
      webgisLayers: [],
      webgisLayerId: '',
      sonlayers: [],
      fieldList: [

      ],
      treeData: [],
      tabList: [
        { label: '查询字段', name: '2' },
        { label: '结果不显示', name: '3' }
      ],
      tabValue: '2',
      currentPage: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData: [],
      layerlist: [],
      tableCols: [],
      tableColsTotal: {
        // 查询字段
        two: [
          { prop: 'pid', label: 'id', width: '80' },
          { prop: 'fieldName', label: '查询字段名', width: '200' },
          { prop: 'fieldDesc', label: '查询字段描述', width: '130' },
          { prop: 'controlType', label: '控件类型', width: '100' },
          { prop: 'sort', label: '排序', width: '80' },
          { prop: 'ruleName', label: '角色名称', width: '100' }
        ],
        // 结果字段
        three: [
          { prop: 'pid', label: 'id', width: '80' },
          { prop: 'fieldName', label: '字段名称', width: '130' },
          { prop: 'fieldDesc', label: '字段描述', width: '200' },
          { prop: 'ruleName', label: '角色名称', width: '100' }
        ]
      },
      currentPid: null,

      resTitle: '',
      resVisible: false,
      resForm: {
        fieldName: undefined,
        fieldType: undefined,
        fieldDesc: undefined,
        ruleId: undefined,
        sort: 0
      },
      resFormRules: {
        fieldName: [{ required: true, message: '不展示字段不能为空', trigger: 'blur' }],
        fieldDesc: [{ required: true, message: '字段描述不能为空', trigger: 'blur' }],
        ruleId: [{ required: true, message: '所属角色不能为空', trigger: 'change' }],
      },
      fieldTypeList: [], // 字段类型列表
      ctrlTypeList: [], // 控件类型列表

      searchTitle: '',
      searchVisible: false,
      searchForm: {
        fieldDesc: undefined,
        fieldName: undefined,
        fieldType: undefined,
        ruleId: undefined,
        controlType: undefined,
        sort: 0
      },
      searchFormRules: {
        fieldDesc: [{ required: true, message: '查询字段不能为空', trigger: 'blur' }],
        fieldName: [{ required: true, message: '字段名称不能为空', trigger: 'blur' }],
        controlType: [{ required: true, message: '控件类型不能为空', trigger: 'blur' }],
        ruleId: [{ required: true, message: '所属角色不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
      },

      listTitle: '编辑列表项',
      listVisible: false,
      listForm: {
        name: '',
        value: ''
      },
      listFormRules: {
        name: [{ required: true, message: '控件名称不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '控件值不能为空', trigger: 'blur' }]
      },
      listFieldData: [],
      listFileID: '',

      ruleListData: [],

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
  watch: {
    tabValue: {
      handler(val) {
        if (val == 2) {
          this.tableCols = this.tableColsTotal.two;
        } else if (val == 3) {
          this.tableCols = this.tableColsTotal.three;
        }
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.isAdmin = sessionStorage.getItem('isadmin');
    this.getSearchs();
    this.queryRuleList();
    this.initFieldList();
  },
  methods: {
    sync() {

      this.$refs.syncDataFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        syncDataApi(this.syncDataForm).then(res => {
          if (res.code == 200) {
            this.syncDataFlag = false;
            this.handleTabClick();
            this.$message.success('操作成功！');
          }
        });
      });

    },
    dataSync() {
      this.syncDataFlag = true;
    },
    queryRuleList() {
      getRuleListApi().then(res => {
        if (res.code == 200) {
          this.ruleListData = res.data;
        }
      });
    },
    // 获取地图服务列表
    async getWebGisData() {
      const res = await getWebGis();
      if (res.code === 200) {
        this.webgisLayers = res.data;
      }
    },

    // 选择地图服务
    async changeWebGis(val) {
      let arr = this.webgisLayers.filter((item) => {
        return item.NAME === val;
      });
      var webgispid = arr[0].ID;
      const res = await getServerLayers({ webgispid });
      if (res.code === 200) {
        this.sonlayers = res.data;
      }
    },

    //选择子图层
    changeSonLayer(val) {
      let arr = this.sonlayers.filter((item) => {
        return item.Id === val;
      });
      this.layerForm.LAYERNAME = arr[0].Name;
      this.layerForm.LAYERURL = arr[0].Url;
    },
    initFieldList() {
      queryFieldListApi().then(res => {
        if (res.code == 200) {
          this.fieldList = res.data;
        }
      })
    },
    //选择字段
    changeField(val) {
      let arr = this.fieldList.filter((item) => {
        return item.fieldName === val;
      });
      this.searchForm.fieldDesc = arr[0].fieldDesc;
      this.searchForm.fieldName = arr[0].fieldName;
      this.searchForm.fieldType = arr[0].fieldType;
    },

    changeResField(val) {
      let arr = this.fieldList.filter((item) => {
        return item.fieldName === val;
      });
      this.resForm.fieldDesc = arr[0].fieldDesc;
      this.resForm.fieldName = arr[0].fieldName;
      this.resForm.fieldType = arr[0].fieldType;
    },

    // 图层配置列表
    async getLayers(params) {
      // debugger;
      const res = await getLayerList(params);
      if (res.code === 200) {
        this.tableData = res.data;
        this.layerlist = res.data;
      }
    },

    // 查询字段列表
    async getSearchs() {

      const res = await getField(this.queryParam);
      if (res.code === 200) {
        this.tableData = res.data;
      }
    },

    // 结果字段列表
    async getRes() {

      const res = await getResField(this.queryParam);
      if (res.code === 200) {
        this.tableData = res.data;
      }
    },

    // 标签页切换
    handleTabClick(val) {
      // debugger;

      if (this.tabValue == 2) {
        this.getSearchs();
      } else if (this.tabValue == 3) {
        this.getRes();
      }
    },

    // 编辑
    handleEdit(row) {
      console.log(row);
      if (this.tabValue == 2) {

        this.getCtrlTypeList();
        this.layerVisible = false;
        this.resVisible = false;
        this.searchVisible = true;
        this.searchTitle = '编辑查询字段';
        Object.assign(this.searchForm, row);
      } else if (this.tabValue == 3) {
        this.getCtrlTypeList();
        this.layerVisible = false;
        this.resVisible = true;
        this.resTitle = '编辑结果不显示';
        Object.assign(this.resForm, row);
      }
    },

    // 删除
    async handleDelete(row) {

      //询问是否删除
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            if (this.tabValue == 2) {
              const res = await delField(row.pid);
              if (res.code === 200) {
                this.$message.success('删除成功！');
                this.getSearchs();
              }
            } else if (this.tabValue == 3) {
              const res = await delResField(row.pid);
              if (res.code === 200) {
                this.$message.success('删除成功！');
                this.getRes();
              }
            }
          })
          .catch(() => {

          });
    },

    // 图层配置弹窗关闭
    closedLayer() {
      this.$refs.layerForm.resetFields();
      this.webgisLayerId = '';
      this.sonlayers = [];
    },

    // 新增表格项
    addItem() {
      if (this.tabValue == 2) {

        this.getCtrlTypeList();
        this.layerVisible = false;
        this.resVisible = false;
        this.searchVisible = true;
        this.searchTitle = '新增查询字段';

        this.searchForm = {
          fieldDesc: undefined,
          fieldName: undefined,
          fieldType: undefined,
          controlType: undefined,
          ruleId: undefined,
          sort: 0
        };

      } else if (this.tabValue == 3) {

        this.layerVisible = false;
        this.searchVisible = false;
        this.resVisible = true;
        this.resTitle = '新增结果不显示';

        this.resForm = {
          fieldName: undefined,
          fieldType: undefined,
          fieldDesc: undefined,
          sort: 0,
          ruleId: undefined
        };
      }
    },

    // 结果不显示弹窗关闭
    closedRes() {
      this.$refs.resForm.resetFields();
    },

    // 保存结果不显示
    saveResDialog() {
      this.$refs.resForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        var res = null;
        if (this.resForm.pid == null || this.resForm.pid == undefined) {
          res = await saveResField(this.resForm);
        } else {
          res = await editResField(this.resForm);
        }
        if (res.code == 200) {
          this.$message.success(`${this.resTitle}成功`);
          this.resVisible = false;
          this.getRes();
        }
      });
    },

    // 获取控件类型列表
    async getCtrlTypeList() {
      if (this.ctrlTypeList.length > 0) {
        return;
      }
      const res = await getCtrlType();
      if (res.code === 200) {
        this.ctrlTypeList = res.data;
      }
    },

    // 查询字段弹窗关闭
    closedSearch() {
      this.$refs.searchForm.resetFields();
    },

    // 保存查询字段
    saveSearchDialog() {
      this.$refs.searchForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        var res = null;
        if (this.searchForm.pid == null || this.searchForm.pid == undefined) {
          res = await saveField(this.searchForm);
        } else {
          res = await editField(this.searchForm);
        }
        if (res.code === 200) {
          this.$message.success(`${this.searchTitle}成功`);
          this.searchVisible = false;
          this.getSearchs();
        }
      });
    },

    // 编辑列表项
    handleList(row) {
      console.log(row);
      this.listVisible = true;
      this.listFileID = row.pid;
      Object.assign(this.listForm, { pid: 0, fieldId: row.pid });
      this.getListFieldData();
    },

    async getListFieldData() {
      let params = {
        fieldId: this.listFileID
      };
      const res = await getListField(params);
      if (res.code === 200) {
        this.listFieldData = res.data;
      }
    },

    // 关闭列表项弹窗
    closedList() {
      this.$refs.listForm.resetFields();
    },

    // 保存列表项
    saveListDialog() {
      this.$refs.listForm.validate(async (valid) => {
        if (!valid) return this.$message.error('请补充必填项');
        const res = await saveListField(this.listForm);
        if (res.code === 200) {
          this.$message.success(`添加成功`);
          this.$refs.listForm.resetFields();
          this.getListFieldData();
        }
      });
    },

    // 列表项删除
    async listDelete(row) {

      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {

            const res = await delListField(row.pid);
            if (res.code === 200) {
              this.$message.success('删除成功！');
              this.getListFieldData();
            }
          })
          .catch(() => {
            this.$message.info('已取消删除');
          });

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
