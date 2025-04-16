<template>
  <div>
    <el-row :gutter='20'>
      <el-col :span='3.5'>
        <el-select v-model='queryParam.year' @change='queryList()' placeholder='请选择数据年份'>
          <el-option
              v-for='(item, index) in yearList'
              :key='item'
              :label="item + '年数据'"
              :value='item'
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span='5'>
        <div class='grid-content bg-purple'>
          <div>
            <el-input v-model='queryParam.keyWord' placeholder='根据地市、项目类别或项目名称进行关键词搜索'></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span='12'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryList'>
              查询
            </el-button>
            <el-button type='primary' icon='el-icon-view' class='handle-del mr10' @click='showAllowFileSuffix'>
              允许预览的文件格式
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <div>
      <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='id' label='id' align='center' width='100'></el-table-column>
        <el-table-column prop='ds' label='地市' align='center'></el-table-column>
        <el-table-column prop='xmlb' label='项目类别' align='center'></el-table-column>
        <el-table-column prop='name' label='项目名称' align='center' show-overflow-tooltip></el-table-column>
        <el-table-column prop='jsnrjgm' height='150' label='建设内容及规模' align='center'
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop='nx' label='建设年限' align='center'></el-table-column>
        <el-table-column prop='jszt' label='建设状态' align='center' width='90'></el-table-column>
        <el-table-column prop='ztz' label='总投资（万元）' align='center'></el-table-column>
        <el-table-column prop='ndtze' label='年度投资额（万元）' align='center'></el-table-column>
        <el-table-column prop='ljwctze' label='累计完成投资（万元）' align='center'></el-table-column>
        <el-table-column prop='xmdz' label='项目地址' align='center' show-overflow-tooltip></el-table-column>
        <el-table-column prop='data' :formatter='formatPlanCompleteTime' label='计划完工时间'
                         align='center' show-overflow-tooltip></el-table-column>
        <el-table-column label='操作' align='center'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-edit' @click='fileEdit(scope.row)'>文件编辑</el-button>
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
        :title="'新增' + queryParam.year + '年城市体检指标数据'"
        :visible.sync='addFlag'
        width='40%'
        :destroy-on-close='true'
        :close-on-click-modal='false'
        :before-close='handleClose'>
      <el-form ref='addform' :model='addDataForm' :rules='addRules' label-width='150px'>

        <el-form-item label='城市名称：' prop='city'>
          <el-select v-model='addDataForm.city' placeholder='请选择城市名称'>
            <el-option
                v-for='(item, index) in cityList'
                :key='index.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='项目类别：' prop='projectType'>
          <el-input v-model='addDataForm.projectType' placeholder='请输入项目类别'></el-input>
        </el-form-item>
        <el-form-item label='项目名称：' prop='projectName'>
          <el-input v-model='addDataForm.projectName' placeholder='请输入项目名称'></el-input>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2021' label='建设内容及规模：' prop='content'>
          <el-input type='textarea' :rows='7' v-model='addDataForm.content' placeholder='请输入建设内容及规模'></el-input>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2021' label='建设年限：' prop='buildYear'>
          <el-input v-model='addDataForm.buildYear' placeholder='请输入建设年限'></el-input>
        </el-form-item>
        <el-form-item label='总投资：' prop='allInvest'>
          <el-input-number :min='0' size='medium' v-model='addDataForm.allInvest'
                           placeholder='请输入总投资'></el-input-number>
          <span>（万元）</span>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2022' label='累计完成投资：' prop='totalCompleteInvest'>
          <el-input-number :min='0' size='medium' v-model='addDataForm.totalCompleteInvest'
                           placeholder='请输入累计完成投资'></el-input-number>
          <span>（万元）</span>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2022' label='项目地址：' prop='projectAddress'>
          <el-input v-model='addDataForm.projectAddress' placeholder='请输入项目地址'></el-input>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2022' label='计划完工时间：' prop='planCompleteTime'>
          <el-date-picker
              v-model='addDataForm.planCompleteTime'
              type='month'
              value-format='yyyy-MM-dd'
              placeholder='请选择计划完工时间'>
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2021' label='请选择建设状态：' prop='buildState'>
          <el-select v-model='addDataForm.buildState' clearable placeholder='请选择建设状态'>
            <el-option
                v-for='(item, index) in buildStateList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='addFlag = false'>取 消</el-button>
                <el-button :loading='addLoding' type='primary' @click='add()'>确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog title='允许预览文件后缀列表' custom-class="my-dialog" :visible.sync='allowFileFlag' width='40%' :close-on-click-modal='false'
               :before-close='closeAllowFileSuffix'>

      <el-row :gutter='20'>
        <el-col :span='3.5'>
          <el-input v-model.trim='allowFileSuffixForm.suffixName' placeholder='请输入允许预览的后缀名'></el-input>
        </el-col>
        <el-col :span='3.5'>
          <el-button type='primary' @click='addAllowFileSuffix()'>添 加</el-button>
        </el-col>
      </el-row>
      <div class='my-dialog-content'>
        <el-table style='font-size: 15px; margin-top: 10px' :data='allowFileSuffixData' border class='table'
                  ref='multipleTable'
                  header-cell-class-name='table-header'>

          <el-table-column prop='suffixName' label='后缀名' align='center'></el-table-column>
          <el-table-column label='操作' align='center' width='150px'>
            <template slot-scope='scope'>
              <el-button type='text' icon='el-icon-delete' confirm @click='delAllowFileSuffix(scope.row)'
                         style='color:red'>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='allowFileFlag = false'>关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :title='fileEditTitle' :visible.sync='fileEditFlag' width='40%' :close-on-click-modal='false'
               :before-close='fileEditClose'>

      <el-upload class='upload-demo' :action='uploadFileURL' :on-preview='handlePreview'
                 :on-remove='handleRemove' :headers='headers' :before-remove='beforeRemove' multiple
                 :limit='1' :before-upload='beforeUpload' :on-exceed='handleExceed' :data='appendixParam' :show-file-list='false'
                 :on-success='fileOnSuccess'
                 :file-list='appendixFileList'>
        <el-button size='small' type='primary'>导入文件</el-button>
      </el-upload>

      <el-table style='font-size: 15px; margin-top: 10px' :data='fileTableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>

        <el-table-column prop='fileName' label='文件名称' align='center'></el-table-column>
        <el-table-column label='操作' align='center' width='180'>
          <template slot-scope='scope'>
            <el-button type='text' icon='el-icon-download' confirm @click='handleFileDownload(scope.row)'>下载
            </el-button>
            <el-button type='text' icon='el-icon-delete' confirm @click='handleFileDelete(scope.row)' style='color:red'>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='pagination'>
        <el-pagination @size-change='fileHandleSizeChange' @current-change='fileHandleCurrentChange'
                       :current-page='fileQueryParam.page'
                       :page-sizes='[10, 15]' :page-size='100' layout='total, sizes, prev, pager, next, jumper'
                       :total='fileTotal'>
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog :title="'编辑' + queryParam.year + '年城市体检指标数据'" :visible.sync='editEntityFlag' width='40%'
               :close-on-click-modal='false' :before-close='handleEditClose'>
      <el-form ref='editform' :model='editDataForm' :rules='editRules' label-width='150px'>
        <el-form-item label='城市名称：' prop='city'>
          <el-select v-model='editDataForm.city' placeholder='请选择城市名称'>
            <el-option
                v-for='(item, index) in cityList'
                :key='index.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='项目类别：' prop='projectType'>
          <el-input v-model='editDataForm.projectType' placeholder='请输入项目类别'></el-input>
        </el-form-item>
        <el-form-item label='项目名称：' prop='projectName'>
          <el-input v-model='editDataForm.projectName' placeholder='请输入项目名称'></el-input>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2021' label='建设内容及规模：' prop='content'>
          <el-input type='textarea' :rows='7' v-model='editDataForm.content' placeholder='请输入建设内容及规模'></el-input>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2021' label='建设年限：' prop='buildYear'>
          <el-input v-model='editDataForm.buildYear' placeholder='请输入建设年限'></el-input>
        </el-form-item>
        <el-form-item label='总投资：' prop='allInvest'>
          <el-input-number :min='0' size='medium' v-model='editDataForm.allInvest'
                           placeholder='请输入总投资'></el-input-number>
          <span>（万元）</span>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2022' label='累计完成投资：' prop='totalCompleteInvest'>
          <el-input-number :min='0' size='medium' v-model='editDataForm.totalCompleteInvest'
                           placeholder='请输入累计完成投资'></el-input-number>
          <span>（万元）</span>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2022' label='项目地址：' prop='projectAddress'>
          <el-input v-model='editDataForm.projectAddress' placeholder='请输入项目地址'></el-input>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2022' label='计划完工时间：' prop='planCompleteTime'>
          <el-date-picker
              v-model='editDataForm.planCompleteTime'
              type='month'
              value-format='yyyy-MM-dd'
              placeholder='请选择计划完工时间'>
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if='queryParam.year == 2021' label='请选择建设状态：' prop='buildState'>
          <el-select v-model='editDataForm.buildState' clearable placeholder='请选择建设状态'>
            <el-option
                v-for='(item, index) in buildStateList'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
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
  del,
  delFile,
  editEntity,
  exportExcel,
  getList,
  save,
  downloadImportTemplate,
  getFileList,
  downloadFile,
  download,
  yearList,
  suffixList,
  suffixDel,
  suffixAdd
} from '@/api/cityQualityPromote-api';
import { Loading } from 'element-ui';

export default {
  name: 'cityQualityPromoteData',
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
        year: undefined,
        buildState: undefined
      },
      type: 'data',
      yearList: [],
      total: 0,
      fileTotal: 0,
      addFlag: false,
      addLoding: false,
      // 添加数据表单
      addDataForm: {
        projectType: '',
        projectName: '',
        content: '',
        buildYear: '',
        allInvest: '',
        buildState: '',
        totalCompleteInvest: '',
        projectAddress: undefined,
        planCompleteTime: '',
        city: '',
        year: ''
      },
      addDataFormCopy: {
        projectType: '',
        projectName: '',
        content: '',
        buildYear: '',
        allInvest: '',
        buildState: '',
        totalCompleteInvest: '',
        projectAddress: undefined,
        planCompleteTime: '',
        city: '',
        year: ''
      },

      loading: null,

      editEntityFlag: false,
      editLoding: false,
      editDataForm: {
        projectType: '',
        projectName: '',
        content: '',
        buildYear: '',
        allInvest: '',
        buildState: '',
        totalCompleteInvest: '',
        projectAddress: undefined,
        planCompleteTime: '',
        city: '',
        year: '',
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
        projectType: [
          { required: true, message: '请输入项目类别', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入建设内容及规模', trigger: 'blur' }
        ],
        buildYear: [
          { required: true, message: '请输入建设年限', trigger: 'blur' }
        ],
        allInvest: [
          { required: true, message: '请输入总投资', trigger: 'blur' }
        ],
        totalCompleteInvest: [
          { required: true, message: '请输入累计完成投资', trigger: 'blur' }
        ],
        projectAddress: [
          { required: true, message: '请输入项目地址', trigger: 'blur' }
        ],
        planCompleteTime: [
          { required: true, message: '请选择计划完工时间', trigger: 'blur' }
        ],
        buildState: [
          { required: true, message: '请选择建设状态', trigger: 'blur' }
        ]
      },
      editRules: {
        projectType: [
          { required: true, message: '请输入项目类别', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入建设内容及规模', trigger: 'blur' }
        ],
        buildYear: [
          { required: true, message: '请输入建设年限', trigger: 'blur' }
        ],
        allInvest: [
          { required: true, message: '请输入总投资', trigger: 'blur' }
        ],
        totalCompleteInvest: [
          { required: true, message: '请输入累计完成投资', trigger: 'blur' }
        ],
        projectAddress: [
          { required: true, message: '请输入项目地址', trigger: 'blur' }
        ],
        planCompleteTime: [
          { required: true, message: '请选择计划完工时间', trigger: 'blur' }
        ],
        buildState: [
          { required: true, message: '请选择建设状态', trigger: 'blur' }
        ]
      },
      cityList: [
        {
          name: '福州'
        },
        {
          name: '平潭综合实验区'
        },
        {
          name: '宁德'
        },
        {
          name: '龙岩'
        },
        {
          name: '南平'
        },
        {
          name: '漳州'
        },
        {
          name: '泉州'
        },
        {
          name: '三明'
        },
        {
          name: '莆田'
        },
        {
          name: '厦门'
        }
      ],
      buildStateList: [
        '前期',
        '在建',
        '完工'
      ],
      allowFileFlag: false,
      allowFileSuffixData: [],
      allowFileSuffixForm: {
        suffixName: ''
      }
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
    getAllowFileSuffixList() {
      suffixList().then(res => {
        if (res.code == 200) {
          this.allowFileSuffixData = res.data;
        }
      });
    },
    delAllowFileSuffix(row) {
      suffixDel(row.pid).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功！");
          this.getAllowFileSuffixList();
        }
      });
    },
    addAllowFileSuffix() {
      if (this.allowFileSuffixForm.suffixName == '') {
        this.$message.warning("后缀不能为空！")
        return;
      }
      suffixAdd(this.allowFileSuffixForm).then(res => {
        if (res.code == 200) {
          this.$message.success("添加成功");
          this.getAllowFileSuffixList();
          this.allowFileSuffixForm.suffixName = "";
        }
      });
    },
    showAllowFileSuffix() {
      this.allowFileFlag = true;
      this.allowFileSuffixForm.suffixName = "";
      this.getAllowFileSuffixList();
    },
    closeAllowFileSuffix(done) {
      done();
    },
    queryYearList() {
      yearList().then(res => {
        if (res.code == 200) {
          this.yearList = res.data;
        }
      });
    },
    // 格式化计划完成时间
    formatPlanCompleteTime(row) {
      if (row == null || row == undefined) {
        return '';
      }
      if (row.data != null && row.data != '') {
        var split = row.data.split(' ');
        return split[0];
      }
      return '';
    },
    handleYear() {
      this.queryParam.page = 1;
      this.queryList();
    },
    // 查询列表数据
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
    // 分页参数回调
    fileHandleSizeChange(val) {
      this.fileQueryParam.pageSize = val;
      this.fileQueryList();
    },
    fileHandleCurrentChange(val) {
      this.fileQueryParam.page = val;
      this.fileQueryList();
    },
    fileQueryList() {
      this.fileQueryParam.pid = this.appendixParam.pid;
      getFileList(this.fileQueryParam).then(res => {
        if (res.code == 200) {
          this.fileTableData = res.data.records;
          this.fileTotal = res.data.total;
        }
      });
    },
    clearData() {
      this.$confirm('确认清空' + this.queryParam.year + '年全部数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(_ => {
            clearData(this.queryParam.year).then(res => {
              if (res.code == 200) {
                this.$message.success('清空成功！');
                this.queryList();
              }
            });
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
          this.addDataForm.year = this.queryParam.year;
          // 防止重复提交，进行按钮禁用
          save(this.addDataForm).then(res => {
            if (res.code == 200) {
              this.$message.success('保存成功！');
            } else {
            }
            this.addFlag = false;
            this.addLoding = false;
            this.queryList();
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
    handleFileDownload(row) {
      download(downloadFile(row.pid), row.fileName, sessionStorage.getItem('token'));
    },
    handleFileDelete(row) {
      this.$confirm('确认删除 ' + row.fileName + ' ？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        delFile(row.pid).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功！');
            this.fileQueryList();
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
    beforeUpload(file) {
      this.loading = Loading.service({
        // 动画中的文字
        text: '文件上传中，请勿刷新当前页面！请耐心等待！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)',
      })
      return true
    },
    onSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.$message.success(response.msg);
        // 关闭对话框，刷新列表
        this.importData = false;
        this.queryList();
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
    fileOnSuccess(response, file, fileList) {
      this.loading.close();

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
      this.importURL = window.apiURL + '/cityQualityPromote/manage/import';
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
.my-dialog-content {
  max-height: 500px; /* 对话框最大高度 */
  overflow-y: auto; /* 内容过长时添加滑轮滚动 */
}
.dialog-footer {
  text-align: right;
}
</style>