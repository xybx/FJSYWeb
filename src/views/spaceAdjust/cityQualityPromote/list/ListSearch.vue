<template>
  <div class='container'>
    <div class='service-main'>
      <el-tabs v-model='tabValue' @tab-click='handleTabClick'>
        <el-tab-pane v-for='(item, index) in tabList' :key='index' :label='item.label' :name='item.name'></el-tab-pane>
      </el-tabs>
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
                size="mini"
                type="warning"
                plain
                v-if="scope.row.controlType && scope.row.controlType == 'list'"
                @click="handleList(scope.row)"
            >{{ isAdmin=='true'?'编辑列表项':'查看列表项'}}
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

    <!-- 结果显示弹窗 -->
    <el-dialog
        :title='resTitle'
        :visible.sync='resVisible'
        width='25%'
        custom-class='set-dialog'
        @closed='closedRes'
        :close-on-click-modal='false'
    >
      <el-form ref='resForm' :model='resForm' label-width='auto' class='group-form' :rules='resFormRules'>
        <el-form-item label='结果字段名称' prop='fieldName'>
          <el-select v-model='resForm.fieldName' @change='changeResField' placeholder='请选择查询字段'>
            <el-option v-for='(item, index) in fieldList' :key='index' :label='`${item.name}:${item.alias}`'
                       :value='item.name'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='字段描述' prop='fieldDesc'>
          <el-input v-model.trim='resForm.fieldDesc' type='textarea'></el-input>
        </el-form-item>
        <el-form-item label='排序' >
          <el-input-number v-model='resForm.sort'></el-input-number>
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
        custom-class='set-dialog'
        @closed='closedSearch'
        :close-on-click-modal='false'
    >
      <el-form ref='searchForm' :model='searchForm' label-width='auto' class='group-form' :rules='searchFormRules'>
        <el-form-item label='查询字段' prop='fieldName'>
          <el-select v-model='searchForm.fieldName' @change='changeField' placeholder='请选择查询字段'>
            <el-option v-for='(item, index) in fieldList' :key='index' :label='`${item.name}:${item.alias}`'
                       :value='item.name'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='查询字段描述' prop='displayName'>
          <el-input v-model.trim='searchForm.displayName' maxlength="10" show-word-limit></el-input>
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
  delListField
} from '@/api/ListSearch-api';
import { getWebGis, getServerLayers } from '@/api/onemap/hxdownload-api';

export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {
      isAdmin: false,
      webgisLayers: [],
      webgisLayerId: '',
      sonlayers: [],
      fieldList: [
        {
          name: "ID",
          alias: "ID",
          type: "number"
        },
        {
          name: "NAME",
          alias: "项目名称",
          type: "string"
        },
        {
          name: "XMLB",
          alias: "项目类别",
          type: "string"
        },
        {
          name: "DS",
          alias: "地市",
          type: "string"
        },
        {
          name: "JSNRJGM",
          alias: "建设内容及规模",
          type: "string"
        },
        {
          name: "JSZT",
          alias: "建设状态",
          type: "string"
        },
        {
          name: "NX",
          alias: "年限",
          type: "string"
        },
        {
          name: "NF",
          alias: "年份",
          type: "number"
        },
        {
          name: "XMDZ",
          alias: "项目地址",
          type: "string"
        },
        {
          name: "ZTZ",
          alias: "总投资",
          type: "number"
        },
        {
          name: "NDTZE",
          alias: "年度投资额",
          type: "number"
        },
        {
          name: "DATA",
          alias: "DATE",
          type: "string"
        },
        {
          name: "LJWCTZE",
          alias: "累计完成投资额",
          type: "number"
        },
      ],
      treeData: [],
      tabList: [
        { label: '查询字段', name: '2' },
        { label: '结果显示', name: '3' }
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
          { prop: 'displayName', label: '查询字段描述', width: '130' },
          { prop: 'controlType', label: '控件类型', width: '100' }
          // { prop: 'STATUS', label: '状态', width: '100' }
        ],
        // 结果字段
        three: [
          { prop: 'pid', label: 'id', width: '80' },
          { prop: 'fieldName', label: '字段名称', width: '130' },
          { prop: 'fieldDesc', label: '字段描述', width: '200' },
          { prop: 'sort', label: '排序', width: '80' },
        ]
      },
      currentPid: null,

      resTitle: '',
      resVisible: false,
      resForm: {
        fieldName: '',
        fieldType: '',
        fieldDesc: '',
        sort: 0
      },
      resFormRules: {
        fieldName: [{ required: true, message: '字段名称不能为空', trigger: 'blur' }],
        fieldDesc: [{ required: true, message: '字段描述不能为空', trigger: 'blur' }]
      },
      fieldTypeList: [], // 字段类型列表
      ctrlTypeList: [], // 控件类型列表

      searchTitle: '',
      searchVisible: false,
      searchForm: {
        displayName: '',
        fieldName: '',
        fieldType: '',
        controlType: ''
      },
      searchFormRules: {
        displayName: [{ required: true, message: '查询字段不能为空', trigger: 'blur' }],
        fieldName: [{ required: true, message: '字段名称不能为空', trigger: 'blur' }],
        controlType: [{ required: true, message: '控件类型不能为空', trigger: 'blur' }]
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
      listFileID: ''
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
  },
  methods: {
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

    //选择字段
    changeField(val) {
      let arr = this.fieldList.filter((item) => {
        return item.name === val;
      });
      this.searchForm.displayName = arr[0].alias;
      this.searchForm.fieldName = arr[0].name;
      this.searchForm.fieldType = arr[0].type;
    },

    changeResField(val) {
      let arr = this.fieldList.filter((item) => {
        return item.name === val;
      });
      this.resForm.fieldDesc = arr[0].alias;
      this.resForm.fieldName = arr[0].name;
      this.resForm.fieldType = arr[0].type;
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

      const res = await getField();
      if (res.code === 200) {
        this.tableData = res.data;
      }
    },

    // 结果字段列表
    async getRes() {

      const res = await getResField();
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
        this.resTitle = '编辑结果显示';
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
          displayName: '',
          fieldName: '',
          fieldType: '',
          controlType: ''
        }

      } else if (this.tabValue == 3) {

        this.layerVisible = false;
        this.searchVisible = false;
        this.resVisible = true;
        this.resTitle = '新增结果显示';

        this.resForm = {
          fieldName: '',
          fieldType: '',
          fieldDesc: '',
          sort: 0
        }
      }
    },

    // 结果显示弹窗关闭
    closedRes() {
      this.$refs.resForm.resetFields();
    },

    // 保存结果显示
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
</style>
