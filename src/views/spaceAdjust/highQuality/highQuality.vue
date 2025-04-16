<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='市辖区数据' name='city'>
      </el-tab-pane>
      <el-tab-pane label='区县数据' name='county'>
      </el-tab-pane>
    </el-tabs>

    <el-row :gutter='20'>
      <el-col :span='4'>
        <div class='grid-content bg-purple'>
          <div>
            <el-input v-model='queryParam.keyWord' placeholder='根据关键词搜索'></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span='13'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryList'>
              查询
            </el-button>
            <el-button type='primary' icon='el-icon-plus' class='handle-del mr10' @click='addData'>{{addTitle}}</el-button>
            <el-button type='primary' icon='el-icon-upload2' class='handle-del mr10' @click='importExcel'>
              {{importTitle}}
            </el-button>
            <el-button type='danger' icon='el-icon-delete' class='handle-del mr10' @click='clearData'>
              {{clearTitle}}
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col style='margin-left: 16%' :span='3'>
        <el-button type='primary' icon='el-icon-refresh-left' class='handle-del mr10' @click='syncLayerId'>
          同步指标对应的图层id
        </el-button>
      </el-col>
    </el-row>

    <div v-if="type == 'city'">
      <el-table style='font-size: 15px; margin-top: 10px' :data='tableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='pid' label='id' align='center' width='100'></el-table-column>
        <el-table-column prop='firstTypeName' label='分类' align='center'></el-table-column>
        <el-table-column prop='secondTypeName' label='指标' align='center'></el-table-column>
        <el-table-column prop='city' label='市辖区' align='center'></el-table-column>
        <el-table-column prop='value' label='指标值' align='center'></el-table-column>
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

    <div v-if="type == 'county'">
      <el-table style='font-size: 15px; margin-top: 10px' :data='tableData' border class='table' ref='multipleTable'
                header-cell-class-name='table-header'>
        <el-table-column prop='pid' label='id' align='center' width='100'></el-table-column>
        <el-table-column prop='secondTypeName' label='指标' align='center'></el-table-column>
        <el-table-column prop='county' label='区县' align='center'></el-table-column>
        <el-table-column prop='value' label='指标值' align='center'></el-table-column>
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

    <el-dialog :title='addTitleName' :visible.sync='addFlag' :destroy-on-close='true' :close-on-click-modal='false' width='32%' :before-close='handleAddClose'>
      <el-form ref='addform' :model='addDataForm' :rules='addRules' label-width='120px'>

        <el-form-item v-if='addDataForm.type == 0' label='分类名称：' prop='firstTypeName'>
          <el-select v-model='addDataForm.firstTypeName' placeholder='请选择分类名称'>
            <el-option
                v-for='(item, index) in firstTypeList'
                :key='index.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='指标名称：' prop='secondTypeName'>
          <el-input v-model='addDataForm.secondTypeName' show-word-limit placeholder="请输入指标名称"></el-input>
        </el-form-item>
        <el-form-item v-if='addDataForm.type == 0' label='市辖区名称：' prop='city'>
          <el-input v-model='addDataForm.city' show-word-limit placeholder="请输入市辖区名称"></el-input>
        </el-form-item>
        <el-form-item v-if='addDataForm.type != 0' label='区县名称：' prop='county'>
          <el-input v-model='addDataForm.county' show-word-limit placeholder="请输入区县名称"></el-input>
        </el-form-item>
        <el-form-item label='指标值：' prop='value'>
          <el-input-number :min='0' size='medium' v-model='addDataForm.value'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='addFlag = false'>取 消</el-button>
                <el-button :loading='addLoading' type='primary' @click='add()'>确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title='修改数据' :visible.sync='editFlag' width='32%' :close-on-click-modal='false' :before-close='handleEditClose'>
      <el-form ref='editform' :model='editDataForm' :rules='editRules' label-width='120px'>
        <el-form-item v-if='editDataForm.type == 0' label='分类名称：' prop='firstTypeName'>
          <el-select v-model='editDataForm.firstTypeName' placeholder="请选择分类名称">
            <el-option
                v-for='(item, index) in firstTypeList'
                :key='index.name'
                :label='item.name'
                :value='item.name'
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='指标名称：' prop='secondTypeName'>
          <el-input v-model='editDataForm.secondTypeName' show-word-limit placeholder="请输入指标名称"></el-input>
        </el-form-item>
        <el-form-item v-if='editDataForm.type == 0' label='市辖区名称：' prop='city'>
          <el-input v-model='editDataForm.city' show-word-limit placeholder="请输入市辖区名称"></el-input>
        </el-form-item>
        <el-form-item v-if='editDataForm.type != 0' label='区县名称：' prop='county'>
          <el-input v-model='editDataForm.county' show-word-limit placeholder="请输入区县名称"></el-input>
        </el-form-item>
        <el-form-item label='指标值：' prop='value'>
          <el-input-number :min='0' size='medium' v-model='editDataForm.value'></el-input-number>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='editFlag = false'>取 消</el-button>
                <el-button :loading='editLoading' type='primary' @click='edit()'>确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title='importTitle' :visible.sync='importData' width='20%' :close-on-click-modal='false' :before-close='handleImportDataClose'>
      <el-upload class='upload-demo' :timeout='0' :action='importURL' :on-preview='handlePreview' :on-remove='handleRemove' :before-upload='beforeUpload'
                 :headers='headers' accept='.xlsx' :before-remove='beforeRemove' multiple :limit='1'
                 :on-exceed='handleExceed'
                 :on-success='onSuccess' :file-list='fileList'>
        <el-button size='small' type='primary'>点击导入</el-button>
        <div slot='tip' class='el-upload__tip'>请导入下载的模板！<br><span style='color: red'>如果不先清空数据就是增量导入！如需覆盖导入请先清空数据！</span><br>导入后展示端地图数据可能第一时间不同步，等待5分钟左右即可。</div>
      </el-upload>
      <span slot='footer' class='dialog-footer'>
                <el-button @click='importData = false'>取 消</el-button>
            </span>
    </el-dialog>

    <el-dialog title='同步指标对应的图层id' :visible.sync='syncLayer' :destroy-on-close='true' :close-on-click-modal='false' width='30' :before-close='handleSyncClose'>
      <el-form ref='syncform' :model='syncDataForm' :rules='syncRules' label-width='140px'>
        <el-form-item label='市辖区图层地址：' prop='cityUrl'>
          <el-input v-model='syncDataForm.cityUrl' show-word-limit placeholder="请输入市辖区图层地址"></el-input>
        </el-form-item>
        <el-form-item label='区县图层地址：' prop='countyUrl'>
          <el-input v-model='syncDataForm.countyUrl' show-word-limit placeholder="请输入区县图层地址"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <span style='margin-left: 110px'>示例：http://xxx.xxx.xxx.xxx/mapServer/city/layer?f=pjson</span>
        <br>
        <span style='margin-left: 110px; color: red'>请联系图层发布人员确认各个指标是否存在对应已发布的图层！</span>
      </div>

      <span slot='footer' class='dialog-footer'>
                <el-button @click='syncLayer = false'>取 消</el-button>
                <el-button :loading='syncLoading' type='primary' @click='sync()'>同 步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delCity, delCounty, getAll, delById, editData, save, syncArcgisLayerId } from '@/api/highQuality-api';
import { Loading } from 'element-ui';

export default {
  name: 'highQuality',
  data() {
    return {
      queryParam: {
        page: 1,
        pageSize: 10,
        keyWord: '',
        type: 0
      },
      editDataForm: {
        type: 0,
        county: '',
        city: '',
        pid: 0,
        value: 0,
        firstTypeName: '',
        secondTypeName: ''
      },
      firstTypeList: [
        {
          name: '宜居生活'
        },
        {
          name: '历史人文'
        },
        {
          name: '绿色低碳'
        },
        {
          name: '韧性安全'
        },
        {
          name: '智慧治理'
        }
      ],
      typeList: [
        {
          name: '市辖区指标数据',
          type: 0
        }, {
          name: '区县指标数据',
          type: 1
        }
      ],
      loading: null,
      editRules: {
        type: [
          { required: true, message: '请选择当前指标类型', trigger: 'blur' }
        ],
        firstTypeName: [
          { required: true, message: '请选择当前指标分类', trigger: 'blur' }
        ],
        secondTypeName: [
          { required: true, message: '请输入当前指标名称', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入当前市辖区名称', trigger: 'blur' }
        ],
        county: [
          { required: true, message: '请输入当前区县名称', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入当前指标值', trigger: 'blur' }
        ]
      },
      editLoading: false,
      editFlag: false,
      addFlag: false,
      addTitleName: '添加数据',
      addDataForm: {
        county: '',
        city: '',
        value: 0,
        firstTypeName: '',
        secondTypeName: '',
        type: 0
      },
      addRules: {
        type: [
          { required: true, message: '请选择当前指标类型', trigger: 'blur' }
        ],
        firstTypeName: [
          { required: true, message: '请选择当前指标分类', trigger: 'blur' }
        ],
        secondTypeName: [
          { required: true, message: '请输入当前指标名称', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入当前市辖区名称', trigger: 'blur' }
        ],
        county: [
          { required: true, message: '请输入当前区县名称', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入当前指标值', trigger: 'blur' }
        ]
      },
      addLoading: false,
      type: 'city',
      total: 0,
      tableData: [],
      importData: false,
      importTitle: '导入市辖区数据',
      importURL: '',
      fileList: [],
      clearTitle: '清空市辖区数据',
      addTitle: '新增市辖区数据',
      syncLayer: false,
      syncDataForm: {
        cityUrl: undefined,
        countyUrl: undefined
      },
      syncRules: {
        cityUrl: { required: true, message: '请输入当前市辖区图层地址', trigger: 'blur' },
        countyUrl: { required: true, message: '请输入当前区县图层地址', trigger: 'blur' }
      },
      syncLoading: false
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
  },
  created() {
    this.initImportUrl();
    this.queryList();
  },
  methods: {
    sync() {

      this.$refs.syncform.validate((valid) => {
        if (valid) {
          this.$confirm('此操作会同步发布的服务图层id，如果存在未发布的指标图层将会导致展示端地图悬浮框中无数据与颜色渐变！', '提示', {
            confirmButtonText: '同步',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(_ => {
            if (this.syncLoading) {
              this.$message.warning('请勿重复点击提交！');
              return;
            }
            this.syncLoading = true;
            syncArcgisLayerId(this.syncDataForm).then(res => {
              if (res.code == 200) {
                this.$message.success("同步成功！");
              }
              this.syncLoading = false;
            })
          }).catch(_ => {
          });
        } else {
          return false;
        }
      });
    },
    handleSyncClose() {
      this.syncLayer = false;
    },
    syncLayerId() {
      this.syncDataForm = {
        cityUrl: '',
        countyUrl: ''
      }
      this.syncLayer = true;
    },
    add() {
      this.$refs.addform.validate((valid) => {
        if (valid) {
          if (this.addLoading) {
            this.$message.warning('请勿重复点击提交！');
            return;
          }
          this.addLoading = true;
          save(this.addDataForm).then(res => {
            if (res.code == 200) {
              this.$message.success('添加成功！');
            }
            this.addFlag = false;
            this.addLoading = false;
            this.queryList();
          });
        } else {
          return false;
        }
      });
    },
    addData() {
      this. addDataForm = {
        county: '',
        city: '',
        value: 0,
        firstTypeName: '',
        secondTypeName: '',
        type: 0
      };
      if (this.type == 'city') {
        this.addTitleName = '添加市辖区数据';
        this.addDataForm.type = 0;
      } else {
        this.addTitleName = '添加区县数据';
        this.addDataForm.type = 1;
      }
      this.addFlag = true;
    },
    handleClick() {
      this.queryParam.page = 1;
      if (this.type == 'city') {
        this.queryParam.type = 0;
        this.clearTitle = '清空市辖区数据';
        this.importTitle = '导入市辖区数据';
        this.addTitle = '新增市辖区数据';
      } else {
        this.queryParam.type = 1;
        this.clearTitle = '清空区县数据';
        this.importTitle = '导入区县数据';
        this.addTitle = '新增区县数据';
      }
      this.queryList();
    },
    edit() {
      this.$refs.editform.validate((valid) => {
        if (valid) {
          if (this.editLoding) {
            this.$message.warning('请勿重复点击提交！');
            return;
          }
          this.editLoding = true;
          editData(this.editDataForm).then(res => {
            if (res.code == 200) {
              this.$message.success('修改成功！');
            }
            this.editFlag = false;
            this.editLoding = false;
            this.queryList();
          });
        } else {
          return false;
        }
      });
    },
    handleEditClose() {
      this.editFlag = false;
    },
    handleAddClose() {
      this.addFlag = false;
    },
    handleEdit(row) {

      Object.assign(this.editDataForm, row);
      if (this.type == 'city') {
        this.editDataForm.type = 0;
      } else {
        this.editDataForm.type = 1;
      }
      this.editFlag = true;
    },
    handleDelete(row) {
      this.$confirm('确认删除id为 ' + row.pid + ' 的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        delById(row.pid).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功！');
            this.queryList();
          }
        });
      })
          .catch(_ => {
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
    buttonQueryList() {
      this.queryParam.page = 1;
      this.queryList();
    },
    queryList() {
      getAll(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    clearData() {
      this.$confirm('此操作将清空全部数据，将会导致展示页面部分时间内无数据！建议在非工作时间清空！', '提示', {
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            if (this.type == 'city') {
              delCity().then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  this.queryList();
                }
              });
            } else {
              delCounty().then(res => {
                if (res.code == 200) {
                  this.$message.success('清空成功！');
                  this.queryList();
                }
              });
            }

          })
          .catch(() => {
            this.$message.info('已取消清空');
          });
    },
    importExcel() {
      this.importData = true;
      if (this.type == 'city') {
        this.importTitle = "导入市辖区数据";
        this.importURL = window.apiURL + '/highQuality/import/city';
      } else {
        this.importTitle = "导入区县数据";
        this.importURL = window.apiURL + '/highQuality/import/county';
      }
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
        text: '数据同步sde库中，请勿刷新当前页面！请耐心等待！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)',
      })
    },
    onSuccess(response, file, fileList) {
      this.loading.close();
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
    initImportUrl() {
      this.importURl = window.apiURL + '/highQuality/import';
    },
    handleImportDataClose(done) {
      done();
    }
  }
};
</script>