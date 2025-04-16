<!--
 * @Author: LJX
 * @Date: 2022-03-09 09:32:38
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-10 15:29:38
 * @FilePath: \admin-service\src\views\onemap\review\review.vue
 * @Description: 请填写描述
-->
<template>
    <div class="review">
        <!-- 添加按钮-->
        <div class="add">
            <el-button type="primary" size="small" class="add" @click="addmenu" v-if="isAdmin == 'true'">新增</el-button>
        </div>
        <!-- 数据渲染 -->
        <div>
            <TableList @save="save" ref="listInfo"></TableList>
        </div>
        <!-- 对话框 -->
        <div>
            <Dialog :isShow="isShow" :isAdd="isAdd" @cancel="cancel" @refresh="refresh" ref="dialogInfo"></Dialog>
        </div>
    </div>
</template>

<script>
import Dialog from './dialog.vue';
import TableList from './list.vue';
export default {
    data() {
        return {
            isAdmin: false,
            isShow: false,
            isAdd: true
        };
    },
    components: {
        Dialog,
        TableList
    },
     mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
    },
    methods: {
        addmenu() {
            this.isShow = true;
            this.isAdd = true;
        },
        cancel(e) {
            this.isShow = e;
            console.log(e);
            
        },
        // 保存
        save(data) {
            this.isShow = true;
            this.isAdd = false;
            this.$refs.dialogInfo.lookup(data);
        },
        // 刷新列表
        refresh() {
            console.log(11111);
            this.$refs.listInfo.getHGSCLayerData();
        }
    }
};
</script>

<style>
.review {
    background: #fff;
    padding: 20px;
}
.review .add {
    margin-bottom: 20px;
}
.review .el-dialog__header {
    text-align: center;
}
.review .el-dialog__footer {
    text-align: center;
}
.review .el-select {
    width: 100%;
}
</style>
