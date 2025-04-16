<template>
  <div>
    <el-row :gutter='24'>
      <el-col :span='16'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增数据
            </el-button>
            <el-button type='primary' icon='el-icon-refresh' class='handle-del mr10' @click='queryList'>
              刷新数据
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span='3'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-refresh-right' class='handle-del mr10' @click='syncAreaData'>
              同步行政区数据
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span='4'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-refresh-right' class='handle-del mr10' @click='constructTree'>
              构造行政区树形级联数据
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <div>
      <el-table style='font-size: 15px; margin-top: 10px' :data='tableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='dataName' label='人口流动数据名称' align='center'></el-table-column>
        <el-table-column prop='isNew' label='是否最新数据' :formatter='formatIsNew' align='center' width='140px'></el-table-column>
        <el-table-column prop='dataYear' label='数据年份' align='center' width='140px'></el-table-column>
        <el-table-column prop='isSync' :formatter='formatIsSync' label='数据是否同步中' align='center' width='140px'></el-table-column>
        <el-table-column prop='remark' label='备注' align='center'></el-table-column>
        <el-table-column prop='syncErrorDesc' label='同步失败原因信息' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-refresh' @click='handleSyncData(scope.row)'>同步数据</el-button>
            <el-button type='text' icon='el-icon-edit' @click='handleEdit(scope.row)'>编辑</el-button>
            <el-button type='text' icon='el-icon-upload2' @click='handleUpload(scope.row)'>上传csv文件</el-button>
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

    <el-dialog :title="title" :visible.sync='addOrEditFlag' :close-on-click-modal='false' width='30%' :destroy-on-close='true'
               :before-close='handleEditClose'>
      <el-form ref='addOrEditFormRef' :model='addOrEditForm' :rules='addOrEditFormRules' label-width='150px'>
        <el-form-item label='人口流动数据名称：' prop='dataName'>
          <el-input v-model='addOrEditForm.dataName' placeholder='请输入数据名称'></el-input>
        </el-form-item>
        <el-form-item label='数据年份' prop='dataYear'>
          <el-input-number :min='0' size='medium' v-model='addOrEditForm.dataYear'
                           placeholder='请输入数据年份'></el-input-number>
        </el-form-item>
        <el-form-item label='备注：' prop='remark'>
          <el-input type='textarea' v-model='addOrEditForm.remark' :rows='2' placeholder='请输入备注信息'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='addOrEditFlag = false'>取 消</el-button>
                <el-button type='primary' @click='submit()'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog title='csv文件列表' :visible.sync='csvUploadFlag' :close-on-click-modal='false' width='40%' :destroy-on-close='true' :before-close='handleEditClose'>
      <el-upload class='upload-demo' :timeout='0' :action='csvUploadUrl'
                 :headers='headers' accept='.csv' :data='datas' :multiple='false'
                 :limit='1' :on-exceed='handleExceed'
                 :on-success='onSuccess'
                 :file-list='csvFileList'>
        <el-button size='small' type='primary'>点击上传</el-button>
      </el-upload>
      <el-table style='font-size: 15px; margin-top: 10px' :data='csvTableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='fileName' label='文件名称' align='center'></el-table-column>
        <el-table-column prop='uploadDate' label='上传时间' align='center'></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-delete' style='color:red' @click='handleDelFile(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='pagination'>
        <el-pagination @size-change='handleCsvSizeChange' @current-change='handleCsvCurrentChange'
                       :current-page='csvQueryParam.page'
                       :page-sizes='[10, 15]' :page-size='100' layout='total, sizes, prev, pager, next, jumper'
                       :total='csvTotal'>
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryPageApi,
  saveOrEditApi,
  syncDataApi,
  syncAreaApi,
  constructTreeApi,
  uploadCsvApi,
  csvDelApi,
  csvPageApi,
} from '@/api/figure/PeopleStream-api'
import { Loading } from 'element-ui';

export default {
  name: 'peopleStream',
  data() {
    return {
      tableData: [],
      // 查询数据
      queryParam: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      addOrEditFlag: false,
      title: "新增",
      addOrEditForm: {
        dataName: undefined,
        dataYear: undefined,
        remark: undefined
      },
      addOrEditFormRules: {
        dataName: [
          { required: true, message: '请输入当前数据名称', trigger: 'blur' }
        ],
        dataYear: [
          { required: true, message: '请输入当前数据年份', trigger: 'blur' }
        ],
      },
      csvUploadFlag: false,
      csvTableData: [],
      csvQueryParam: {
        page: 1,
        pageSize: 10,
        pid: undefined
      },
      csvTotal: 0,
      csvUploadUrl: undefined,
      csvFileList: [],
      loading: null,
    };
  },
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
        pid: this.csvQueryParam.pid
      }
    }
  },
  mounted() {
    this.queryList();
    this.initUploadUrl();
  },
  created() {
  },
  methods: {
    constructTree() {
      this.$confirm('确认构造行政区树形级联数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            this.loading = Loading.service({
              // 动画中的文字
              text: '构造行政区树形级联数据中，请勿刷新或关闭当前页面！请耐心等待！',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.1)',
            })
            this.loading.close();
            constructTreeApi().then(res => {
              if (res.code == 200) {
                this.$message.success("构造成功！");
              }
            })
          })
          .catch(_ => {
          });
    },
    syncAreaData() {
      this.$confirm('确认同步行政区数据吗？在同步过程中人口流动模块将无法正常使用，建议在非工作时间进行数据同步！同步时间大概十分钟内完成！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            this.loading = Loading.service({
              // 动画中的文字
              text: '同步服务行政区数据中，请勿刷新或关闭当前页面！请耐心等待！',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.1)',
            })
            syncAreaApi().then(res => {
              this.loading.close();
              if (res.code == 200) {
                this.$message.success("同步成功！");
              }
            })
          })
          .catch(_ => {
          });
    },
    onSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.csvFileList = [];
        this.$message.success(response.msg);
        // 刷新列表
        this.queryCsvList();
      }  else {
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
    initUploadUrl() {
      this.csvUploadUrl = uploadCsvApi();
    },
    // 删除csv文件
    handleDelFile(row) {
      this.$confirm('确认删除当前csv文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            csvDelApi(row.pid).then(res => {
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.queryCsvList();
              }
            })
          })
          .catch(_ => {
          });
    },
    handleUpload(row) {
      this.csvUploadFlag = true;
      this.csvQueryParam.pid = row.pid;
      this.csvQueryParam.page = 1;
      this.queryCsvList();
    },
    submit() {
      this.$refs.addOrEditFormRef.validate((valid) => {
        if (valid) {
          saveOrEditApi(this.addOrEditForm).then(res => {
            if (res.code == 200) {
              this.$message.success("操作成功");
              this.addOrEditFlag = false;
              this.queryList();
            }
          })
        } else {
          return false;
        }
      });
    },
    addData() {
      this.addOrEditFlag = true;
      this.title = "新增";
      this.addOrEditForm.pid = undefined;
      this.addOrEditForm.dataName = undefined;
      this.addOrEditForm.dataYear = undefined;
      this.addOrEditForm.remark = undefined;
    },
    // 编辑数据
    handleEdit(row) {
      this.addOrEditForm.pid = row.pid;
      this.addOrEditForm.dataName = row.dataName;
      this.addOrEditForm.dataYear = row.dataYear;
      this.addOrEditForm.remark = row.remark;
      this.addOrEditFlag = true;
      this.title = "编辑";
    },
    // 同步数据
    handleSyncData(row) {
      this.$confirm('确认同步 ' + row.dataName + ' 数据吗？在同步过程中人口流动模块将无法正常使用，建议在非工作时间进行数据同步！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            syncDataApi(row.pid).then(res => {
              if (res.code == 200) {
                this.$message.success("数据同步中，请耐心等待！");
                this.queryList();
              }
            })
          })
          .catch(_ => {
          });
    },
    formatIsNew(row) {
      if (row == null || row == undefined) {
        return '';
      }
      if (row.isNew == 1) {
        return "是";
      }
      return '否';
    },
    formatIsSync(row) {
      if (row == null || row == undefined) {
        return '';
      }
      if (row.isSync == 1) {
        return "是";
      }
      return '否';
    },
    // 分页参数回调
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.queryParam.page = val;
      this.queryList();
    },
    // 分页参数回调
    handleCsvSizeChange(val) {
      this.csvQueryParam.pageSize = val;
      this.queryCsvList();
    },
    handleCsvCurrentChange(val) {
      this.csvQueryParam.page = val;
      this.queryCsvList();
    },
    queryCsvList() {
      csvPageApi(this.csvQueryParam).then(res => {
        if (res.code == 200) {
          this.csvTableData = res.data.records;
          this.csvTotal = res.data.total;
        }
      })
    },
    queryList() {
      queryPageApi(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      })
    },
    handleEditClose(done) {
      done();
    },
  }
};
</script>

<style>

</style>