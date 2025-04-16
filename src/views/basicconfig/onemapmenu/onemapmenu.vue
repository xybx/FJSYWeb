<template>
    <div class="OneMap">
        <!-- 添加按钮 -->
        <div class="search menu-search">
            <!-- <el-button type="primary" size="small" class="add" @click="addmenu" v-if="isAdmin == 'true'">新增</el-button> -->
            <!-- <el-button type="primary" size="small" class="add" @click="addchildmenu" v-if="isShowTableList && isAdmin == 'true'"
				>添加子菜单</el-button
			>
			<el-button type="primary" size="small" class="goBack add" @click="goBack" v-if="isShowTableList">返回</el-button>
			 -->
            <div>
<!--                <el-input v-model="searchTxt" placeholder="请输入关键字"></el-input>-->
<!--                <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>-->
            </div>
        </div>
        <br />
        <!-- 一级表格数据渲染 -->
        <div>
            <TableList
                ref="parentMenu"
                @save="save"
                :searchTxt="searchTxt"
                :keyword="keyword"
                @saveChild="saveChild"
                @goSecondeList="goSecondeList"
                :isParentList="isParentList"
            ></TableList>
        </div>
        <!-- 二级表格渲染 -->
        <div>
            <SecondeList :isShowTableList="isShowTableList" :parentData="parentData" ref="SecondeList" @saveChild="saveChild"></SecondeList>
        </div>
        <!-- 对话框 -->
        <div>
            <Dialog
                :isShow="isShow"
                @cancel="cancel"
                :isAdd="isAdd"
                ref="dialogInfo"
                :MLEVEL="MLEVEL"
                :parentData="parentData"
                @refresh="refreshchildList"
            ></Dialog>
        </div>
        <!--添加子菜单的对话框 -->
        <div>
            <ChildDialog :isChildDialog="isChildDialog"></ChildDialog>
        </div>
    </div>
</template>

<script>
import Dialog from './dialog.vue';
import TableList from './list.vue';
import SecondeList from './SecondeList.vue';
import ChildDialog from './childDialog.vue';
export default {
    data() {
        return {
            isAdmin: false,
            keyword: '',
            searchTxt: '',
            isShow: false, //将对话框初始设置为隐藏
            isAdd: true, //用于判断是添加还是编辑
            EditData: {},
            isShowTableList: false, //二级数据
            isChildDialog: false, //添加二级菜单的对话画框
            parentData: {}, //父元素的数据
            isParentList: true, //父级列表数据
            MLEVEL: 0 //判断是一级还是二级添加
        };
    },
    components: {
        Dialog,
        TableList,
        SecondeList,
        ChildDialog
    },
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        //console.log(this.isAdmin,"isadmin");
    },
    methods: {
        // 添加
        addmenu() {
            this.isShow = true;
            this.isAdd = true;
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
        handleSearch() {
            this.keyword = this.searchTxt;
            let params = {
                keyword: this.searchTxt
            };
            this.$refs.parentMenu.getModuleAllListData();
            console.log(params);
        },
        // 添加子菜单
        saveChild(data) {
            this.isShow = true;
            this.isAdd = true;
            this.$refs.dialogInfo.addChildMenu(data);
            this.parentData = data;
            console.log(data);
        },
        // 显示二级子菜单
        goSecondeList(data) {
            this.MLEVEL = 1;
            this.parentID = data.ID;
            console.log(data.ID, '这是主页面');
            this.isShowTableList = true;
            this.isParentList = false;
            this.parentData = data;
            this.$refs.SecondeList.getModuleAllListData(data.ID);
        },
        // 返回一级列表
        goBack() {
            this.MLEVEL = 0;
            this.isShowTableList = false;
            this.isParentList = true;
        },
        // 刷新二级列表
        refreshchildList() {
            console.log(this.parentData.ID, '这是二级刷新之后的数据');
            this.$refs.SecondeList.getModuleAllListData(this.parentID);
        },
        // 添加子菜单
        addchildmenu() {
            this.isChildDialog = true;
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
    /* justify-content: space-between; */
	justify-content: end;
}
.OneMap .search .el-input {
    width: 200px;
    margin-right: 20px;
}
.el-dialog__header {
    background: black;
}
</style>
>
