
<template>
    <div>
        <el-table :data="treeData" border style="width: 100%; font-size: 15px;" row-key="PID">
            <el-table-column prop="PID" label="PID"  align="center"> </el-table-column>
            <el-table-column prop="TITLE" label="名称" align="center"> </el-table-column>
            <el-table-column prop="CODE" label="菜单编号" align="center"> </el-table-column>
            <el-table-column prop="PATH" label="路径" align="center"></el-table-column>
            <el-table-column prop="ICON" label="图标" align="center"></el-table-column>
            <el-table-column prop="ORDERNUM" label="排序" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="item">
                        <el-button type="text" icon="el-icon-postcard" class="green" @click="handleChild(item.row)">子菜单</el-button>
                        <el-button type="text" icon="el-icon-edit" class="blue" @click="SaveModule(item.row)" v-if='isAdmin'>编辑</el-button> 
                        <el-button type="text" icon="el-icon-delete" class="red" @click="DeleteModule(item.row)" v-if='isAdmin'>删除</el-button>
                   
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getModuleList ,deleteModule} from '@/api/systemmenu-api';
export default {
    props: ['searchTxt', 'keyword'],
    data() {
        return {
            isAdmin: false,
            treeData: [],
            childrenData: []
        };
    },
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.getModuleAllListData();
    },
    methods: {
        async getModuleAllListData() {
            let params = {
                title: ''
            };
            const res = await getModuleList(params);
            // await getModuleList(params).then(res=>{
            //     console.log(res);
            // });
            if(res.code==1){
                 this.treeData = res.data;
            }
        },
        SaveModule(data) {
            this.$emit('save', data);
        },
        // 删除
        DeleteModule(data) {
            this.$confirm('你确定要删除这条数据么?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(data);
                // const res= deleteModule({pid:data.PID});
                // console.log(res);
              
                   deleteModule({pid:data.PID}).then((res) => {
                        console.log(res);
                        if (res.code == 1) {
                            this.$message.success('删除成功！');
                            this.getModuleAllListData();
                        } else {
                            this.$message.error('删除失败');
                        }
                    });
            });
        },
        	// 子图层
		handleChild(row) {
			console.log(row);
			this.$router.push({
				path: '/sonmenu',
				query: {
					CODE: row.CODE
                    // data:row,
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