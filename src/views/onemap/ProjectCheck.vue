<!--
 * @Author: WCL
 * @Date: 2022-02-24 13:58:03
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-30 15:21:52
 * @FilePath: \admin-service\src\views\onemap\ProjectCheck.vue
 * @Description: 项目核查
-->
<template>
    <div class="container">
        <el-tabs v-model="tabValue" @tab-click="handleTabClick">
            <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>

        <!-- 图层列表表单 -->
        <el-form ref="layerForm" :model="layerForm" :rules="layerFormRules" label-width="auto" v-if="tabValue == 1" class="layer-form">
            <el-form-item label="图层名称" prop="LAYERNAME">
                <el-input v-model="layerForm.LAYERNAME" placeholder="请输入图层名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="图层地址" prop="LAYERURL">
                <el-input v-model="layerForm.LAYERURL" placeholder="请输入图层地址"></el-input>
            </el-form-item> -->
            <el-form-item label="SDE数据库" prop="SDEID">
                <el-select v-model="layerForm.SDEID">
                    <el-option v-for="(item, index) in SDEData" :key="index" :label="item.NAME" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="要素表名称" prop="FEATURE">
                <el-input v-model="layerForm.FEATURE" placeholder="请输入要素表名称"></el-input>
            </el-form-item>
            <el-form-item label="数据阶段类型" prop="LAYERTYPE">
                <el-select v-model="layerForm.LAYERTYPE">
                    <el-option v-for="(item, index) in stageData" :key="index" :label="item.DICTNAME" :value="item.DICTVALUE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveLayerForm" v-if="isAdmin == 'true'">保存</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格 -->
        <div v-else-if="tabValue == 2">
            <!-- <div>
                <el-button size="mini" type="primary" @click="importFile">导入</el-button>
                <el-button size="mini" type="warning" @click="clearTable">清空</el-button>
            </div> -->
			<br/>
            <el-table :data="tableData" border stripe row-key="PID" :tree-props="{ children: 'CHILDREN' }">
                <el-table-column
                    v-for="(item, index) in tableCols"
                    :key="index"
                    :label="item.label"
                    :prop="item.prop"
                    :min-width="item.width"
                    align="center"
                ></el-table-column>
                <!-- <el-table-column label="操作" align="center" min-width="170">
				<template slot="header" slot-scope="scope">
					<el-button size="mini" type="primary" @click="importFile">导入</el-button>
					<el-button size="mini" type="warning" @click="clearTable">清空</el-button>
				</template>
				<template v-slot="scope">
					<el-button size="mini" type="danger" plain @click="handleDelete(scope.row)" v-if="isAdmin == 'true'">删除</el-button>
				</template>
			</el-table-column> -->
            </el-table>
        </div>
    </div>
</template>

<script>
import {
    getLayerList,
    saveLayer,
    delLayer,
    getResList,
    saveRes,
    delRes,
    emptyRes,
    exportRes,
    getMapStage
} from '@/api/onemap/projectcheck-api';
import { SdeList } from '@/api/onemap/hxdownload-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            isAdmin: false,
            tabValue: '1',
            tabList: [
                { label: '图层列表', name: '1' },
                { label: '结果字段', name: '2' }
            ],
            tableData: [],
            tableCols: [
                { prop: 'PID', label: 'PID', width: '80' },
                { prop: 'LABEL', label: '字段名称', width: '130' },
                { prop: 'PROP', label: '字段值', width: '200' }
            ],
            layerForm: { LAYERNAME: '', LAYERURL: '', SDEID: '', LAYERTYPE: '', FEATURE: '' },
            layerFormRules: {
                 LAYERNAME: [{ required: true, message: '图层名称不能为空', trigger: 'blur' }],
                // LAYERURL: [{ required: true, message: '图层地址不能为空', trigger: 'blur' }],
                SDEID: [{ required: true, message: 'SDE数据库不能为空', trigger: 'change' }],
                LAYERTYPE: [{ required: true, message: '数据阶段类型不能为空', trigger: 'change' }],
                FEATURE: [{ required: true, message: '要素表名称不能为空', trigger: 'blur' }]
            },
            SDEData: [],
            stageData: []
        };
    },
    computed: {},
    watch: {
        tabValue: {
            handler(val) {
                if (val == 1) {
                    this.getSdeList();
                    this.getDataStage();
                    this.getLayers();
                } else if (val == 2) {
                }
            },
            immediate: true
        }
    },
    created() {},
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
    },
    methods: {
        // TAB切换
        handleTabClick() {
            if (this.tabValue == 1) {
                this.getLayers();
            } else if (this.tabValue == 2) {
                this.getRes();
            }
        },

        // 图层列表
        async getLayers() {
            const res = await getLayerList();
            if (res.code === 1) {
                Object.assign(this.layerForm, res.data[0]);
            }
        },

        // 结果字段列表
        async getRes() {
            const res = await getResList();
            if (res.code === 1) {
                this.tableData = res.data;
            }
        },

        // 获取SDE库
        async getSdeList() {
            const res = await SdeList();
            if (res.code === 1) {
                this.SDEData = res.data;
            }
        },

        // 获取数据阶段类型
        async getDataStage() {
            const res = await getMapStage();
            if (res.code === 1) {
                this.stageData = res.data;
            }
        },

        // 保存图层列表
        saveLayerForm() {
            this.$refs.layerForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                const res = await saveLayer(this.layerForm);
                if (res.code === 1) {
                    this.$message.success('保存成功');
                }
            });
        },

        // 导入文件
        // todo 等刘静霞补充
        importFile() {
            console.log('导入');
        },

        // 清空表格
        async clearTable() {
            console.log('清空');
            const res = await emptyRes();
            if (res.code === 1) {
                this.$message.success('清空成功');
                this.getRes();
            }
        },

        // 删除表格项
        async handleDelete(row) {
            console.log(row);
            let params = {
                pid: row.PID
            };
            const res = await delRes(params);
            if (res.code === 1) {
                this.$message.success('删除成功！');
                this.getRes();
            }
        }
    }
};
</script>

<style scoped lang="scss">
.layer-form {
    width: 600px;
    .el-select {
        width: 100%;
    }
}
</style>
