<!--
 * @Author: LJX
 * @Date: 2022-02-28 13:37:58
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-07 12:58:10
 * @FilePath: \admin-service\src\views\systemconfig\SystemMenuMange\SystemMenuMange.vue
 * @Description: 请填写描述
-->
<template>
    <div class="OneMap">
        <!-- 添加按钮 -->
        <div class="search">
            <el-button type="primary" size="small" class="add" @click="addmenu" v-if='isAdmin'>新增</el-button>
            <!-- <div>
                <el-input v-model="searchTxt" placeholder="请输入关键字"></el-input>
                <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
            </div> -->
        </div>
        <!-- 表格数据渲染 -->
        <div>
            <TableList @save="save" :searchTxt='searchTxt' :keyword='keyword'></TableList>
        </div>
        <!-- 对话框 -->
        <div>
            <Dialog :isShow="isShow" @cancel="cancel" :isAdd="isAdd" ref="dialogInfo"></Dialog>
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
            keyword:'',
            searchTxt:'',
            isShow: false, //将对话框初始设置为隐藏
            isAdd: true, //用于判断是添加还是编辑
            EditData: {}
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
        // 添加
        addmenu() {
            (this.isShow = true), (this.isAdd = true);
            console.log(this.isShow);
        },
        // 取消
        cancel(e) {
            this.isShow = e;
            console.log(e);
        },
        // 编辑保存
        save(data) {
            // console.log(data);
            this.isShow = true;
            this.isAdd = false;
            this.$refs.dialogInfo.lookup(data);
        },
        // 搜索
        handleSearch(){
            this.keyword=this.searchTxt;
            let params ={
                keyword:this.searchTxt,
            };
            console.log(params)
        }
    }
};
</script>

<style scoped>
.OneMap {
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
}
.OneMap .add {
    margin-bottom: 20px;
}
/* .OneMap .search{
       height: 50px;
       background: #fff;
   } */
.OneMap .search {
    display: flex;
   justify-content: space-between;

}
.OneMap .search .el-input {
    width: 200px;
    margin-right: 20px;
}
</style>>

