<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
        </div>

        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="PID" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="LAYERNAME" label="图层名称" width="150"></el-table-column>
            <el-table-column prop="URL" label="图层服务地址" width="200"></el-table-column>
            <el-table-column prop="TJFIELD" label="统计依据（字段名|别名|类型）" width="270"></el-table-column>
            <el-table-column prop="TJITEMFIELDS" label="统计项（字段名|别名|类型）">
                <template slot-scope="scope">
                    <div v-if="scope.row.TJITEMFIELDS != null">
                        <div v-for="(item, index) in scope.row.TJITEMFIELDS.split(',')" :key="index">
                            {{ item }}
                        </div>
                    </div>
                </template>
            </el-table-column>
			<el-table-column prop="CHILDTJITEM" label="子统计依据（字段名|别名|类型）" width="270"></el-table-column>
            <el-table-column prop="TABLEFIELDS" label="子统计统计项（字段名|别名|类型）">
                <template slot-scope="scope">
                    <div v-if="scope.row.TABLEFIELDS != null">
                        <div v-for="(item, index) in scope.row.TABLEFIELDS.split(',')" :key="index">
                            {{ item }}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
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
                <el-form-item label="图层名称" prop="LAYERNAME">
                    <el-input v-model="setForm.LAYERNAME"></el-input>
                </el-form-item>
                <el-form-item label="服务地址" prop="URL">
                    <el-input v-model="setForm.URL"></el-input>
                </el-form-item>

                <el-form-item label="统计依据" prop="TJFIELD">
                    <el-select v-model="setForm.TJFIELD" no-data-text="请选择统计依据字段" @focus="getChildList">
                        <el-option
                            v-for="(item, index) in fieldList"
                            :key="index"
                            :label="`${item.name}:${item.alias}:${item.type}`"
                            :value="`${item.name}|${item.alias}|${item.type}`"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="统计项" prop="TJITEMFIELDS">
                    <el-select
                        v-model="setForm.TJITEMFIELDS"
                        multiple
                        no-data-text="请选择统计项字段"
                        @focus="getChildList"
                        @change="changeVal"
                    >
                        <el-option
                            v-for="(item, index) in fieldList"
                            :key="index"
                            :label="`${item.name}:${item.alias}:${item.type}`"
                            :value="`${item.name}|${item.alias}|${item.type}`"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="子统计依据字段" prop="CHILDTJITEM">
                    <el-select v-model="setForm.CHILDTJITEM" no-data-text="请选择子统计依据字段" @focus="getFieldListChild">
                        <el-option
                            v-for="(item, index) in fieldListChild"
                            :key="index"
                            :label="`${item.name}:${item.alias}:${item.type}`"
                            :value="`${item.name}|${item.alias}|${item.type}`"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="子统计项" prop="TABLEFIELDS">
                    <el-select
                        v-model="setForm.TABLEFIELDS"
                        multiple
                        no-data-text="请选择子统计项字段"
                        @focus="getChildList"
                        @change="changeVal"
                    >
                        <el-option
                            v-for="(item, index) in fieldList"
                            :key="index"
                            :label="`${item.name}:${item.alias}:${item.type}`"
                            :value="`${item.name}|${item.alias}|${item.type}`"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="ORDERNUM">
                    <el-input v-model="setForm.ORDERNUM" type="number" min="0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getLayerList, saveLayer, DeleteLayer, getServerLayerFields } from '@/api/onemap/ledger-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            isAdmin: false,
            tableData: [],
            setVisible: false,
            setTitle: '',
            setForm: {
                PID: 0,
                LAYERNAME: '', //图层名称
                URL: '', //图层地址
                ORDERNUM: '', //排序
                TJFIELD: '', //统计自动
                TABLEFIELDS: '', //统计结果变革展示字段
                GROUPID: '', //分组ID,
                TJITEMFIELDS: '', //统计项字段
				CHILDTJITEM:''
            },
            setFormRules: {
                LAYERNAME: [{ required: true, message: '图层名称不能为空', trigger: 'blur' }],
                URL: [{ required: true, message: '服务地址不能为空', trigger: 'blur' }],
                TJFIELD: [{ required: true, message: '请选择统计依据字段', trigger: 'change' }],
                TJITEMFIELDS: [{ required: true, message: '请选择统计项字段', trigger: 'change' }],
                TABLEFIELDS: [{ required: true, message: '请选择子统计项字段', trigger: 'change' }],
				CHILDTJITEM: [{ required: true, message: '请选择子统计依据字段', trigger: 'change' }]
            },
            childIdList: [],
            fieldList: [],
            fieldListChild:[],
        };
    },
    computed: {},
    watch: {
        setVisible(boo) {
            if (boo) {
            }
        }
    },
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.setForm.GROUPID = this.$route.query.pid;
        this.getData();
    },
    methods: {
        // select数据没有自动更新
        changeVal(val) {
            console.log(val);
            this.$forceUpdate();
        },
        // 获取子图层列表
        async getChildList() {
            let params = {
                url: this.setForm.URL
            };
            const res = await getServerLayerFields(params);
            if (res.code === 1) {
                this.fieldList = res.data;
            }
        },

        // 子图层列表选择
        async changeChildID() {
            let params = {
                url: this.setForm.URL
            };
            const res = await getServerLayerFields(params);
            if (res.code === 1) {
                this.fieldList = res.data;
            }
        },

        // 新增
        addType() {
            this.setTitle = '新增';
            this.setVisible = true;
        },

        // 获取列表数据
        async getData() {
            let params = {
                groupid: this.$route.query.pid
            };
            const res = await getLayerList(params);
            if (res.code === 1) {
                this.tableData = res.data.datalist;
            }
        },
        // 获取子统计项列表
        getFieldListChild(){
            console.log(this.setForm.TJITEMFIELDS)
            console.log(this.fieldListChild,'这是子统计项')
            if(this.fieldList!=[]){
                this.fieldListChild=this.setForm.TJITEMFIELDS;
            const a= this.fieldListChild.map(item=>
                   item.split("|")
                   )
            const b=a.map(item=>{
                 console.log(item)
                   return {name:item[0],
                   alias:item[1],
                   type:item[2]}
                   })
                   console.log(b.name)
                   this.fieldListChild=b;

            }else{
                this.$message('error','请选择统计项')
            }
        },
        // 弹窗确定
        saveAdd() {
            console.log(this.setForm);

            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveLayer(this.setForm);
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
        handleEdit(row) {
            if (row.TABLEFIELDS != null && typeof row.TABLEFIELDS == 'string') {
                row.TABLEFIELDS = row.TABLEFIELDS.split(',');
            } else {
            }

            if (row.TJITEMFIELDS != null && typeof row.TJITEMFIELDS == 'string') {
                row.TJITEMFIELDS = row.TJITEMFIELDS.split(',');
            } else {
            }
            console.log(row.TABLEFIELDS);
            this.setTitle = '编辑';
            this.setVisible = true;
            console.log(this.setForm,"这是数据");
            this.setForm.CHILDTJITEM=row.TJITEMFIELDS;
            // console.log(this.fieldListChild);
            // console.log(this.setForm.TJITEMFIELDS);
            
            Object.assign(this.setForm, row);
        },

        // 删除
        async handleDelete(row) {
            let params = {
                pid: row.PID
            };
            const res = await DeleteLayer(params);
            if (res.code === 1) {
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
