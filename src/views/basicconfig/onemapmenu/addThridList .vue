<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
        </div>

        <el-table :data="treeData" border style="width: 100%" row-key="PATH">
            <el-table-column prop="TITLE" label="名称" width="230" align="center"> </el-table-column>
            <!-- <el-table-column prop="BGCOLOR" label="背景颜色" align="center"></el-table-column> -->
            <!-- <el-table-column prop="BGIMG" label="背景图片" align="center"></el-table-column> -->
            <el-table-column prop="ICON" label="背景图标" align="center"></el-table-column>
            <el-table-column prop="PATH" label="路径" align="center"></el-table-column>
            <el-table-column prop="ORDERNUM" label="排序" width="80" align="center"  type="number" min="0"></el-table-column>
            <!-- <el-table-column prop="RULEID" label="规则" width="80" align="center"></el-table-column> -->
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="item">
                    <div>
                        <el-tooltip effect="dark" content=" 编辑" placement="top-start">
                            <el-button type="primary" icon="el-icon-edit" @click="handelSaveModule(item.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start">
                            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(item.row.ID)"></el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            :title="setTitle"
            :visible.sync="setVisible"
            width="30%"
            custom-class="set-dialog"
            @close="closedSetDialog"
            :close-on-click-modal="false"
        >
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                <el-form-item label="标题" prop="TITLE">
                  <el-input v-model="setForm.TITLE" />
                </el-form-item>
				<el-form-item label="路径" prop="PATH">
					 <el-input v-model="setForm.PATH" />
				</el-form-item>
				<!-- <el-form-item label="图标" prop="ICON">
                      <el-upload
                        ref="upload"
                        multiple
                        action="#"
                        :show-file-list="false"
                        :http-request="uploadFile"
                        :file-list="uploadfilelist"
                        accept=".jpg,.png,"
                    >
                        <el-button size="samll" class="upload">{{fileNameList}}</el-button>
                    </el-upload>
				</el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import { getChildLayer, saveChildLayer, delChildLayer, getChildServer, getChildField } from '@/api/onemap/querylocate-api';
import { GetModuleList, DeleteModule,SaveModule} from '@/api/moduleonemap-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
              uploadfilelist:[],
            fileNameList:'',
            treeData: [
                // {
                //     BGCOLOR: '#387dce',
                //     BGIMG: 'fj_1.png',
                //     ICON: 'icon_1.png',
                //     MID: 2,
                //     MLEVEL: 1,
                //     MODULEID: 1,
                //     ORDERNUM: 1,
                //     PATH: 'onemap',
                //     REMARK: '基于基础现状、规划成果、规划实施、规划监督数据、城市设计和城市信息模型(CIM)，实现二三维一体化深层应用。',
                //     RULEID: 3,
                //     TITLE: '统一平台',
                //     children: [
                //         {
                //             BGCOLOR: '#387dce',
                //             BGIMG: 'fj_1.png',
                //             ICON: 'icon_1.png',
                //             MID: 3,
                //             MLEVEL: 1,
                //             MODULEID: 1,
                //             ORDERNUM: 1,
                //             PATH: 'onemap',
                //             REMARK: '基于基础现状、规划成果、规划实施、规划监督数据、城市设计和城市信息模型(CIM)，实现二三维一体化深层应用。',
                //             RULEID: 3,
                //             TITLE: '统一平台',
                //             children: [
                //                 {
                //                     BGCOLOR: '#387dce',
                //                     BGIMG: 'fj_1.png',
                //                     ICON: 'icon_1.png',
                //                     MID: 4,
                //                     MLEVEL: 1,
                //                     MODULEID: 1,
                //                     ORDERNUM: 1,
                //                     PATH: 'onemap',
                //                     REMARK: '基于基础现状、规划成果、规划实施、规划监督数据、城市设计和城市信息模型(CIM)，实现二三维一体化深层应用。',
                //                     RULEID: 3,
                //                     TITLE: '统一平台'
                //                 }
                //             ]
                //         }
                //     ]
                // }
            ],
            // tableData: [],
			
            setVisible: false,
            setTitle: '',
            setForm: {
				ID:0,
                TITLE:'',
			    PATH:'',
			    ICON:'',
				MLEVEL:2,
            },
            // setFormRules: {
            //     CHILDID: [{ required: true, message: '子图层不能为空', trigger: 'change' }],
            //     FIELD: [{ required: true, message: '查询字段不能为空', trigger: 'change' }],
            //     SHOWFIELD: [{ required: true, message: '结果字段不能为空', trigger: 'change' }]
            // },
            // childIdList: [],
            setFormRules: {
                TITLE: [{ required: true ,message:'标题不能为空哦' }],
                PATH:[{type:'url',required:true,message:'你输入的地址格式不正确'}],
                 ICON:[{ required: true ,message:'图标不能为空哦' }],
            }
        };
    },
    computed: {},
    watch: {
        setVisible(boo) {
            if (boo) {
                this.getChildList();
                // this.changeChildID();
            }
        }
    },
    created() {},
    mounted() {
        this.setForm.PARENTID = this.$route.query.id;
        this.getData();
    },
    methods: {
        // 文件上传
              async uploadFile(params) {
            this.fileNameList = params.file.name;
            this.setForm.ICON =params.file.name;
            console.log(params.file.name, '文件名称');
            let form = new FormData();
            form.append('file', params.file);
            form.append('filepath', 'XTCD');
            // form.append('typeid', this.$route.query.pid);
            const data = await uploadfile(form);
            this.$message.success('上传成功');
            this.getData();
        },
		 ChildSaveModule(id){
            this.$router.push({
                path:'/menuchild',
                query:{
                   module_parent_id:id,
                }
            })
        },
        // 获取子图层列表
        async getChildList() {
            // let params = {
            //     : this.$route.query.module_parent_id
            // };
            // const data = await getChildServer(params);
            // this.childIdList = data;
        
        },

        // 子图层列表选择
        // async changeChildID() {
        //     let params = {
        //         querylocationpid: this.$route.query.id,
        //         childid: this.setForm.CHILDID
        //     };
        //     const data = await getChildField(params);
        //     this.fieldList = data;
        // },

        // 新增
        addType() {
            this.setTitle = '新增';
            this.setVisible = true;
        },

        // 获取列表数据
        async getData() {
            let params = {
                module_parent_id: this.$route.query.module_parent_id,
				keyword:''
            };
            // const data = await getChildLayer(params);
            // this.tableData = data;
		   const res = await GetModuleList(params);
            this.treeData = res.data.datas;
           console.log(this.treeData);
        },

        // 弹窗确定
        saveAdd() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await SaveModule({
					...this.setForm,
					PARENTID:this.$route.query.module_parent_id,
				});
                console.log(data);
                if (res.code == 1) {
                    this.$message.success(`${this.setTitle}成功`);
                    this.setVisible = false;
                    this.getData();
                }
            });
        },

        // 关闭窗口
        closedSetDialog() {
            this.$refs.setForm.resetFields();
            this.setForm = this.$options.data().setForm;
        },

        // 编辑
       handelSaveModule(row) {
            row.CHILDID = String(row.CHILDID);
            this.setTitle = '编辑';
            this.setVisible = true;
            Object.assign(this.setForm, row);
        },

        // 删除
        async handleDelete(ID) {
            let params = {
                pid: ID
            };
            const res = await DeleteModule(params);
            if(res.code==1){
              this.$message.success('删除成功！');
              this.getData();
            }
           
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
.el-select {
    width: 100%;
}
</style>