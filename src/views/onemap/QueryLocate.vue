<!--
 * @Author: WCL
 * @Date: 2022-02-11 11:30:15
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-03 15:48:11
 * @FilePath: \fjsy-web\src\views\onemap\QueryLocate.vue
 * @Description: 统一平台 - 查询定位
-->
<template>
    <div class="container">
        <!-- 顶部表单 -->
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType" v-if="isAdmin == 'true'">新增</el-button>
        </div>

        <el-table style="font-size:15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="PID" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="LAYERNAME" label="服务名称" min-width="150" align="center"></el-table-column>
            <el-table-column prop="URL" label="图层服务" min-width="300" align="center"></el-table-column>
            <el-table-column label="操作" min-width="280" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-postcard" class="green" @click="handleChild(scope.row)">子图层</el-button>
                    <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" v-if="isAdmin == 'true'">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)" v-if="isAdmin == 'true'"
                        >删除</el-button
                    >
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
                <el-form-item label="选择地图服务">
                    <el-select v-model="setForm.LAYERNAME" @change="changeWebGis" placeholder="请选择地图服务">
                        <el-option v-for="item in webgisLayers" :key="item.NAME" :label="item.NAME" :value="item.NAME"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务名称" prop="LAYERNAME">
                    <el-input v-model="setForm.LAYERNAME"></el-input>
                </el-form-item>
                <el-form-item label="服务地址" prop="URL">
                    <el-input v-model="setForm.URL"></el-input>
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
import { getLocateLayers, saveLocateLayer, delLocateLayer } from '@/api/onemap/querylocate-api';
import { getWebGis } from '@/api/onemap/hxdownload-api';
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
                URL: '',
                LAYERNAME: '',
                MODULETYPE: '1'
            },
            setFormRules: {
                LAYERNAME: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
                URL: [{ required: true, message: '服务地址不能为空', trigger: 'blur' }]
            },

            webgisLayers: [],
            webgisLayerId: ''
        };
    },
    computed: {},
    watch: {
        $route: {
            handler(val) {
                this.setForm.MODULETYPE = this.$route.query.type;
                this.getData();
            }
        },
        setVisible(boo) {
            if (boo) {
                this.getWebGisData();
            }
        }
    },
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.setForm.MODULETYPE = this.$route.query.type;
        if (this.$route.query.type == undefined || this.$route.query.type == '') {
            this.setForm.MODULETYPE = 1;
        }
        this.getData();
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
        changeWebGis(val) {
            let arr = this.webgisLayers.filter((item) => {
                return item.NAME === val;
            });
            this.setForm.LAYERNAME = arr[0].NAME;
            this.setForm.URL = arr[0].URL;
        },

        // 新增
        addType() {
            this.setTitle = '新增';
            this.setVisible = true;
        },

        // 获取列表数据
        async getData() {
            const res = await getLocateLayers({ moduletype: this.setForm.MODULETYPE });
            if (res.code === 200) {
                this.tableData = res.data;
            }
        },

        // 弹窗确定
        saveAdd() {
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveLocateLayer(this.setForm);
                if (res.code === 200) {
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
            console.log(row);
            this.setTitle = '编辑';
            this.setVisible = true;
            Object.assign(this.setForm, row);
        },

        // 删除
        async handleDelete(row) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    let params = {
                        id: row.PID
                    };
                    const res = await delLocateLayer(params);
                    if (res.code === 200) {
                        this.$message.success('删除成功！');
                        this.getData();
                    }
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });

            
        },

        // 子图层
        handleChild(row) {
            console.log(row);
            this.$router.push({
                path: '/locatechild',
                query: {
                    id: row.PID
                }
            });
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
