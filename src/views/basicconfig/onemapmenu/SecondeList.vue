<template>
    <div>
        <el-table :data="treeData" border style="width: 100%" row-key="pid" :tree-props="{ children: 'children' }" v-if="isShowTableList">
            <el-table-column prop="TITLE" label="名称" width="230" align="center"> </el-table-column>
            <el-table-column prop="PATH" label="路径" align="center"></el-table-column>
            <el-table-column prop="ICON" label="背景图标" align="center"></el-table-column>
            <el-table-column prop="ORDERNUM" label="排序" width="80" align="center" type="number" min="0"></el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="item">
                    <div>
                         <el-button type="text" icon="el-icon-tickets" @click="ChildSaveModule(item.row.ID)" class="green">子菜单</el-button>
                        <el-button type="text" icon="el-icon-tickets" @click="MenuAuth(item.row)" class="orange">菜单权限</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="SaveModule(item.row)" class="blue">编辑</el-button>

                        <el-button type="text" icon="el-icon-delete" class="red" @click="DeleteModule(item.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { GetModuleAllList, DeleteModuleParent, DeleteModule ,getModuleParentList ,GetModuleList} from '@/api/moduleonemap-api';
export default {
    props: ['searchTxt', 'keyword','isShowTableList' ,'parentData'],
    data() {
      
        return {
            isAdmin: false,
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
            ParentID:'',
            childrenData: []
        };
    },
    mounted() {
        // this.getModuleAllListData();
        this.isAdmin = sessionStorage.getItem('isadmin');
    },
    methods: {
        getModuleAllListData(ID) {
            getModuleParentList().then(res => { 
                this.treeData = res.datas;
                this.ParentID = ID;
            })
            GetModuleList({ module_parent_id: ID, keyword: '' }).then(res => {
                console.log(res, '这是二级子菜单');
                this.treeData = res.datas;
                this.ParentID = ID;
            });

            //  this.treeData =data;
            // const keyword = '';
            // const data =  GetModuleList({PID:this.parentData.ID}).then(res=>{console.log(res)});
            // this.treeData = data;
            // this.treeData.map((item) => {
            //     item.children = [
            //         {
            //             BGCOLOR: '#387dce',
            //             BGIMG: 'fj_1.png',
            //             ICON: 'icon_1.png',
            //             MID: 2,
            //             MLEVEL: 1,
            //             MODULEID: 1,
            //             ORDERNUM: 1,
            //             PATH: 'onemap',
            //             REMARK: '基于基础现状、规划成果、规划实施、规划监督数据、城市设计和城市信息模型(CIM)，实现二三维一体化深层应用。',
            //             RULEID: 3,
            //             TITLE: '统一平台'
            //         }
            //     ];
            // });
            // this.$store.commit('isSave',false);
            console.log(this.treeData);
        },
        // 保存一级菜单列表
        // SaveModule({ MID, TITLE, PATH, ICON, ORDERNUM, BGIMG, BGCOLOR, REMARK }) {
        //     const data = {
        //         ID: MID,
        //         TITLE,
        //         PATH,
        //         ICON,
        //         ORDERNUM,
        //         REMARK,
        //         BGIMG,
        //         BGCOLOR
        //     };
        //     SaveModuleParent(data).then((res) => {
        //         console.log(res);
        //         if (res == 1) {
        //             this.$message({
        //                 message: '保存成功',
        //                 type: 'success'
        //             });
        //         }
        //     });
        // }
        SaveModule(data) {
            this.$emit('save', data);
        },
        ChildSaveModule(data) {
            this.$emit('saveChild', data);
        },
        // 删除
        // DeleteModule({ MID, MLEVEL }) {
        DeleteModule(data) {
            console.log(data);
            this.$confirm('你确定要删除这条数据么?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                 DeleteModule({
                        pid: data.ID
                    
                    }).then((res) => {
                        console.log(res.code);
                        if(res.code==1){
                              this.$message.success('删除成功！');
                        this.getModuleAllListData(this.ParentID);
                        }
                      
                    });
                // console.log(data);
                // if (MLEVEL == 1) {
                //     DeleteModuleParent({
                //         pid: MID
                //     }).then((res) => {
                //         console.log(res);
                //         if (res == 1) {
                //             this.$message.success('删除成功！');
                //             this.getModuleAllListData();
                //         } else {
                //             this.$message.error('删除失败');
                //         }
                //     });
                // } else {
                   
                // }
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
                console.log(res,"这是二级列表");
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

<style scoped>
</style>