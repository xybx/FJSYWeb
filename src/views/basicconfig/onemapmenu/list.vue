<template>
    <div>
        <!-- @row-click='goSecondeList' -->
        <el-table :data="treeData" border style="width: 100%; font-size: 15px;" row-key="pid" :tree-props="{ children: 'children' }" v-if="isParentList">
            <el-table-column prop="name" label="名称" align="center"> </el-table-column>
            <el-table-column prop="page" label="路径" align="center"></el-table-column>
            <!-- <el-table-column prop="BGCOLOR" label="背景颜色" align="center"></el-table-column> -->
            <!-- <el-table-column prop="BGIMG" label="背景图片" align="center"></el-table-column> -->
            <!-- <el-table-column prop="ICON" label="背景图标" align="center"></el-table-column> -->
            <!-- <el-table-column prop="levelcode" label="分类" align="center"></el-table-column> -->
            <el-table-column prop="powerName" label="权限"  align="center"></el-table-column>
            <el-table-column prop="groupname" label="分组名称" align="center"></el-table-column>
            <!-- <el-table-column prop="MID" label="MID" width="80" align="center"></el-table-column> -->
            <!-- <el-table-column prop="MODULEID" label="模型ID" width="80" align="center"></el-table-column> -->
            <el-table-column prop="serial" label="排序" align="center" type="number" min="0"></el-table-column>
            <!-- <el-table-column prop="RULEID" label="规则" width="80" align="center"></el-table-column> -->
            <el-table-column label="操作" align="center" >
                <template slot-scope="item">
                    <div>
                        <!-- <el-button type="text" icon="el-icon-tickets" @click="MenuAuth(item.row)" class="orange">菜单权限</el-button> -->
                        <el-button type="text" icon="el-icon-edit" @click="SaveModule(item.row)" class="blue" >编辑</el-button>

                        <!-- <el-button type="text" icon="el-icon-delete" class="red" @click="DeleteModule(item.row)">删除</el-button> -->
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { GetModuleAllList, DeleteModuleParent, DeleteModule, getModuleParentList, GetModuleList } from '@/api/moduleonemap-api';
export default {
    props: ['searchTxt', 'keyword', 'isParentList'],
    data() {
        return {
            isAdmin:false,
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
                //              children: [
                //                 {
                //                     BGCOLOR: '#387dce',
                //                     BGIMG: 'fj_1.png',
                //                     ICON: 'icon_1.png',
                //                     MID:4,
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
            childrenData: []
        };
    },
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.getModuleAllListData();
        // GetModuleList({ module_parent_id: 1, keyword: '' });
    },
    methods: {
        async getModuleAllListData() {
            // const keyword = '';
            const res = await getModuleParentList({keyword:this.keyword});
            if (res.code == 200) {
                this.treeData = [];
                this.treeData = res.data;
           
            }
           
        },
        
        SaveModule(data) {
            this.$emit('save', data);
        },
        // 删除
        DeleteModule(row) {
            this.$confirm('你确定要删除这条数据么?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log(data);
                DeleteModuleParent(row.pid).then((res) => {
                    console.log(res);
                    if (res.code == 200) {
                        this.$message.success('删除成功！');
                        this.getModuleAllListData();
                    } else {
                        this.$message.error('删除失败');
                    }
                });
            });
        },
        // 点击的时候显示二级列表
        goSecondeList(data) {
            console.log(data);
            this.$emit('goSecondeList', data);
        },
        // 跳转到添加子菜单的界面
        ChildSaveModule(id) {
            this.$router.push({
                path: '/menuchild',
                query: {
                    module_parent_id: id
                }
            });
        },
        //菜单权限
        MenuAuth(row) {
            this.$router.push({
                path: '/onemapmenuauth',
                query: {
                    moduleid: row.ID,
                    level:1
                }
            });
        }
    },
    watch: {
        // 监听是否点了保存
        '$store.state.isSave'(newval, olval) {
            this.getModuleAllListData();
            this.$store.commit('IS_SAVE', false);
        },
        // 搜索
        keyword(newval, olval) {
            console.log(newval);
            if (newval == '') {
                this.getModuleAllListData();
            }
            const keyword = newval;
            GetModuleAllList({ keyword }).then((res) => {
                console.log(res);
                let searchResult = res.find((item) => {
                    if (item.TITLE == newval) {
                        return (this.treeData = [item]);
                    } else {
                        item.CHILDREN.find((item) => {
                            if (item.TITLE == newval) {
                                console.log(item);
                                return (this.treeData = [item]);
                            } else {
                                item.CHILDREN.find((item) => {
                                    if (item.TITLE == newval) {
                                        console.log(item);
                                        return (this.treeData = [item]);
                                    }
                                });
                            }
                        });
                    }
                });
                console.log(searchResult, '这是搜索之后的结果');
                if (searchResult == undefined) {
                    this.$message.error('你输入的搜素内容有误哦，请按名称搜索');
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
