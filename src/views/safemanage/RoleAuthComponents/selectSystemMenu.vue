<!--
 * @Author: LJX
 * @Date: 2022-03-01 15:44:38
 * @LastEditors: WCL
 * @LastEditTime: 2022-03-09 13:56:38
 * @FilePath: \admin-service\src\views\safemanage\RoleAuthComponents\selectSystemMenu.vue
 * @Description: 选择运维系统的菜单
-->

<template>
    <el-dialog title="选择菜单列表" :visible.sync="isShow" width="60%"  custom-class="set-dialog" :close-on-click-modal="false">
        <div class="container">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                class="table"
                header-cell-class-name="table-header"
                row-key="PID"
                border
                :tree-props="{ children: 'CHILDREN' }"
                @selection-change="handleSelectionChange"
                stripe
            >
                <el-table-column  type="selection" prop="PID" label="PID" width="55" align="center"> </el-table-column>
                <el-table-column prop="TITLE" label="名称" width="200" align="center"> </el-table-column>
                <el-table-column prop="CODE" label="菜单编号" width="100" align="center"> </el-table-column>
                <el-table-column prop="PATH" label="路径" align="center"></el-table-column>
                <el-table-column prop="ICON" label="图标" align="center"></el-table-column>
                <el-table-column prop="ORDERNUM" label="排序" width="80" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="btnOk">确 定</el-button>
            </span>
        </div>
    </el-dialog>
</template>
<script>
import { getModuleList } from '@/api/systemmenu-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            isShow: false,
            keywords: '',
            tableData: [],
            setVisible: false
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.getModuleAllListData();
    },
    methods: {
        dialogShow() {
            this.isShow = true;
        },

        async getModuleAllListData() {
            let params = {
                title: this.keywords
            };
            const data = await getModuleList(params);
            this.tableData = data;
            console.log(this.treeData);
        },

        SaveModule(data) {
            this.$emit('save', data);
        },

        //确定
        btnOk() {},
        handleDelete() {},
        handleSelectionChange() {},

        // 关闭新增，编辑的弹窗
        closedSetDialog() {
            this.$refs.setForm.resetFields();
            this.setForm = this.$options.data().setForm;
        },
        // 设置角色权限
        setRoleAuths(row) {
            console.log(row);
            this.$router.push({
                path: '/setroleauth',
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
