<template>
  <div>
    <el-row :gutter='5'>
      <el-col :span='3.5'>
        <el-select v-model='queryParam.year' clearable placeholder='请选择数据年份'>
          <el-option
              v-for='(item, index) in yearList'
              :key='item'
              :label="item + '年数据'"
              :value='item'
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span='3.5'>
        <el-select v-model='queryParam.city' clearable placeholder='请选择地区'>
          <el-option
              v-for='(item, index) in cityList'
              :key='item.name'
              :label="item.name"
              :value='item.name'
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span='5'>
        <div class='grid-content bg-purple'>
          <div>
            <el-input v-model='queryParam.keyWord' placeholder='根据项目类别进行关键词搜索'></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span='10'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryList'>
              查询
            </el-button>
            <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>
              新增数据
            </el-button>
            <el-button type='primary' icon='el-icon-download' class='handle-del mr10' @click='downTemplate'>下载导入数据模板
            </el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>导入数据
            </el-button>
            <el-button type='danger' icon='el-icon-delete' class='handle-del mr10' @click='clearData'>
              清空{{queryParam.year}}数据
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <div>
      <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='pid' label='id' align='center' width='90'></el-table-column>
        <el-table-column prop='year' label='年份' align='center'></el-table-column>
        <el-table-column prop='firstProjectType' label='一级项目类别' align='center' ></el-table-column>
        <el-table-column prop='secondProjectType' label='二级项目类别' align='center'></el-table-column>
        <el-table-column prop='city' label='市区' align='center'></el-table-column>
        <el-table-column prop='allInvest' label='总投资额（亿元）' align='center'></el-table-column>
        <el-table-column prop='annualInvest' label='年度投资额（亿元）' align='center'></el-table-column>
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

    <el-dialog
        :title="'新增数据'"
        :visible.sync='addFlag'
        width='30%'
        :destroy-on-close='true'
        :close-on-click-modal='false'
        :before-close='handleClose'>
      <el-form ref='addform' :model='addDataForm' :rules='addRules' label-width='150px'>
        <el-form-item label='年份' prop='year'>
          <el-input-number :min='2000' size='medium' v-model='addDataForm.year'
                           placeholder='请输入年份'></el-input-number>
        </el-form-item>
        <el-form-item label='市区：' prop='city'>
          <el-select v-model='addDataForm.city' placeholder='请选择市区'>
            <el-option
                v-for='(item, index) in cityList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='一级项目类别：' prop='firstProjectType'>
          <el-input v-model='addDataForm.firstProjectType' placeholder='请输入一级项目类别'></el-input>
        </el-form-item>
        <el-form-item label='二级项目类别：' prop='secondProjectType'>
          <el-input v-model='addDataForm.secondProjectType' placeholder='请输入二级项目类别'></el-input>
        </el-form-item>
        <el-form-item label='总投资额（亿元）' prop='allInvest'>
          <el-input-number :min='0' size='medium' v-model='addDataForm.allInvest'
                           placeholder='请输入总投资额'></el-input-number>
        </el-form-item>
        <el-form-item label='年度投资额（亿元）' prop='annualInvest'>
          <el-input-number :min='0' size='medium' v-model='addDataForm.annualInvest'
                           placeholder='请输入年度投资额'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='addFlag = false'>取 消</el-button>
                <el-button :loading='addLoding' type='primary' @click='add()'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :title="'编辑数据'" :visible.sync='editEntityFlag' :close-on-click-modal='false' width='30%'
               :before-close='handleEditClose'>
      <el-form ref='editform' :model='editDataForm' :rules='editRules' label-width='150px'>
        <el-form-item label='年份' prop='year'>
          <el-input-number :min='2000' size='medium' v-model='editDataForm.year'
                           placeholder='请输入年份'></el-input-number>
        </el-form-item>
        <el-form-item label='市区：' prop='city'>
          <el-select v-model='editDataForm.city' placeholder='请选择市区'>
            <el-option
                v-for='(item, index) in cityList'
                :key='item.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='一级项目类别：' prop='firstProjectType'>
          <el-input v-model='editDataForm.firstProjectType' placeholder='请输入一级项目类别'></el-input>
        </el-form-item>
        <el-form-item label='二级项目类别：' prop='secondProjectType'>
          <el-input v-model='editDataForm.secondProjectType' placeholder='请输入二级项目类别'></el-input>
        </el-form-item>
        <el-form-item label='总投资额（亿元）' prop='allInvest'>
          <el-input-number :min='0' size='medium' v-model='editDataForm.allInvest'
                           placeholder='请输入总投资额'></el-input-number>
        </el-form-item>
        <el-form-item label='年度投资额（亿元）' prop='annualInvest'>
          <el-input-number :min='0' size='medium' v-model='editDataForm.annualInvest'
                           placeholder='请输入年度投资额'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='editEntityFlag = false'>取 消</el-button>
                <el-button :loading='editLoding' type='primary' @click='edit()'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog
        title='导入模板数据'
        :visible.sync='importData'
        width='30%'
        :close-on-click-modal='false'
        :before-close='handleImportDataClose'>
        <el-upload class='upload-demo' :action='importURL' :on-preview='handlePreview'
                   :on-remove='handleRemove' :headers='headers' accept='.xlsx' :before-remove='beforeRemove' multiple
                   :limit='1' :on-exceed='handleExceed' :show-file-list='false'
                   :on-success='onSuccess'
                   :file-list='fileList'>
          <el-button size='small' type='primary'>点击导入</el-button>
          <div slot='tip' class='el-upload__tip'>请导入下载的模板！<br><span style='color: red'>如果不先清空数据就是增量导入！如需覆盖导入请先清空数据！</span><br>导入后展示端地图数据可能第一时间不同步，等待5分钟左右即可。
          </div>
        </el-upload>
        <span slot='footer' class='dialog-footer'>
                    <el-button @click='importData = false'>取 消</el-button>
                </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  clearData,
  clearDataByYear,
  del,
  editEntity,
  exportExcel,
  getList,
  save,
  downloadImportTemplate,
  yearList
} from '@/api/cityQualityPromoteOverview-api';

export default {
  name: 'cityQualityPromoteOverview',
  data() {
    return {
      tableData: [],
      fileTableData: [],
      fileQueryParam: {
        page: 1,
        pageSize: 10,
        pid: undefined
      },
      // 查询数据
      queryParam: {
        keyWord: undefined,
        page: 1,
        pageSize: 10,
        year: '',
        city: undefined
      },
      type: 'data',
      yearList: [
      ],
      total: 0,
      fileTotal: 0,
      addFlag: false,
      addLoding: false,
      // 添加数据表单
      addDataForm: {
        year: undefined,
        firstProjectType: '',
        secondProjectType: '',
        city: '',
        allInvest: undefined,
        annualInvest: undefined
      },
      addDataFormCopy: {
        year: undefined,
        firstProjectType: '',
        secondProjectType: '',
        city: '',
        allInvest: undefined,
        annualInvest: undefined
      },
      editEntityFlag: false,
      editLoding: false,
      editDataForm: {
        year: '',
        firstProjectType: '',
        secondProjectType: '',
        city: '',
        allInvest: 0,
        annualInvest: 0,
        pid: 0
      },
      importData: false,
      importURL: '',
      uploadFileURL: '',
      fileEditFlag: false,
      fileEditTitle: '修改文件列表',
      fileList: [],
      appendixFileList: [],
      appendixParam: {
        pid: '',
        objectId: ''
      },
      options: [],
      addRules: {
        year: [
          { required: true, message: '请输入年份', trigger: 'blur' }
        ],
        firstProjectType: [
          { required: true, message: '请输入项目类别', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择市区', trigger: 'change' }
        ],
        annualInvest: [
          { required: true, message: '请输入年度投资额', trigger: 'blur' }
        ],
        allInvest: [
          { required: true, message: '请输入总投资额', trigger: 'blur' }
        ],
      },
      editRules: {
        year: [
          { required: true, message: '请输入年份', trigger: 'blur' }
        ],
        firstProjectType: [
          { required: true, message: '请输入项目类别', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择市区', trigger: 'change' }
        ],
        annualInvest: [
          { required: true, message: '请输入年度投资额', trigger: 'blur' }
        ],
        allInvest: [
          { required: true, message: '请输入总投资额', trigger: 'blur' }
        ],
      },
      cityList: [
        {
          name: "全省"
        },
        {
          name: '福州市'
        },
        {
          name: '平潭综合实验区'
        },
        {
          name: '宁德市'
        },
        {
          name: '龙岩市'
        },
        {
          name: '南平市'
        },
        {
          name: '漳州市'
        },
        {
          name: '泉州市'
        },
        {
          name: '三明市'
        },
        {
          name: '莆田市'
        },
        {
          name: '厦门市'
        }
      ]
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
    }
  },
  mounted() {
    this.queryList();
    this.initImportUrl();
    this.initUploadFileURL();
    this.queryYearList();
  },
  created() {
  },
  methods: {
    queryYearList() {
      yearList().then(res => {
        if (res.code == 200) {
          this.yearList = res.data
        }
      })
    },
    // 格式化计划完成时间
    formatPlanCompleteTime(row) {
      if (row == null || row == undefined) {
        return '';
      }
      if (row.data != null && row.data != '') {
        var split = row.planCompleteTime.split('-');
        return split[0] + '-' + split[1];
      }
      return '';
    },
    handleYear() {
      this.queryParam.page = 1;
      this.queryList();
    },
    queryList() {
      getList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    buttonQueryList() {
      this.queryParam.page = 1;
      getList(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      });
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
    clearData() {
      this.$confirm('确认清空' + this.queryParam.year + '全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            if (this.queryParam.year == '') {
              clearData().then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  this.queryList();
                  this.queryYearList();
                }
              });
            } else {
              clearDataByYear(this.queryParam.year).then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  this.queryParam.year = '';
                  this.queryList();
                  this.queryYearList();
                }
              });
            }
          })
          .catch(_ => {
          });
    },
    // 修改当前数据文件列表
    fileEdit(row) {
      this.fileEditFlag = true;
      this.appendixParam.pid = row.id;
      this.appendixParam.objectId = row.objectid;
      this.fileQueryParam.page = 1;
      this.fileQueryList();
    },
    // 修改数据
    handleEdit(row) {

      this.editEntityFlag = true;
      Object.assign(this.editDataForm, row);
    },
    // 添加数据
    addData() {
      this.addDataForm = JSON.parse(JSON.stringify(this.addDataFormCopy));
      this.addFlag = true;
    },
    handleEditClose(done) {
      done();
    },
    fileEditClose(done) {
      done();
    },
    // 关闭回调
    handleClose(done) {
      done();
    },
    handleImportDataClose(done) {
      done();
    },
    // 新增历史项目数据
    add() {
      this.$refs.addform.validate((valid) => {
        if (valid) {
          if (this.addLoding) {
            this.$message.warning('请勿重复点击提交！');
            return;
          }
          this.addLoding = true;
          // 防止重复提交，进行按钮禁用
          save(this.addDataForm).then(res => {
            if (res.code == 200) {
              this.$message.success('保存成功！');
            } else {
            }
            this.addFlag = false;
            this.addLoding = false;
            this.queryList();
            this.queryYearList();
          });
        } else {
          return false;
        }
      });
    },
    // 编辑历史项目数据
    edit() {
      this.$refs.editform.validate((valid) => {
        if (valid) {
          if (this.editLoding) {
            this.$message.warning('请勿重复点击提交！');
            return;
          }
          this.editLoding = true;
          editEntity(this.editDataForm).then(res => {
            if (res.code == 200) {
              this.$message.success('修改成功！');
            }
            this.editEntityFlag = false;
            this.editLoding = false;
            this.queryList();
            this.queryYearList();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 下载模板数据
    downTemplate() {
      exportExcel(downloadImportTemplate(), sessionStorage.getItem('token'));
    },
    // 删除数据
    handleDelete(row) {
      this.$confirm('确认删除id为 ' + row.pid + ' 的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        del(row.pid).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功！');
            this.queryList();
          }
        });
      }).catch(_ => {
      });
    },
    importExcel() {
      this.importData = true;
      this.fileList = [];
    },
    // 文件上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
        this.importData = false;
        this.queryList();
        this.queryYearList();
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
      this.loadingVisible = false;
    },
    fileOnSuccess(response, file, fileList) {
      // 删除当前数据
      let index = -1;
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].name == file.name) {
          index = i;
        }
      }
      fileList.splice(index, 1);
      if (response.code == 200) {
        this.$message.success(response.msg);
        // 关闭对话框，刷新列表
        this.fileQueryList();
      } else {
        this.$message.warning(response.msg);
      }
    },
    initImportUrl() {
      this.importURL = window.apiURL + '/cityQualityPromote/overview/manage/import';
    },
    initUploadFileURL() {
      this.uploadFileURL = window.apiURL + '/cityQualityPromote/file/manage/upload';
    }
  }
};
</script>

<style>
.el-tooltip__popper {
  max-width: 450px;
}
</style>