<!--
 * @Author: LJX
 * @Date: 2022-02-22 15:16:22
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-10 15:31:38
 * @FilePath: \admin-service\src\views\onemap\citymanage\list.vue
 * @Description: 请填写描述
-->
<template>
    <div>
        <el-table :data="cityManageData" border>
            <el-table-column label="图层名称" prop="LAYERNAME"></el-table-column>
            <el-table-column label="图层服务地址" prop="LAYERURL" width="300"></el-table-column>
            <el-table-column label="子图层id" prop="FXLAYERID"></el-table-column>
            <el-table-column label="地图服务类型" prop="MAPTYPE">
                	<template v-slot="scope">
					<span v-if="scope.row.MAPTYPE === 'image'">动态服务</span>
					<span v-else-if="scope.row.MAPTYPE === 'tile'">静态服务</span>
				</template>
            </el-table-column>
            <el-table-column label="是否分析图层数据" prop="ISFX">
                <template v-slot="scope">
                    <span v-if="scope.row.ISFX === 1">是</span>
                    <span v-else-if="scope.row.ISFX ===0">否</span>
                </template>
            </el-table-column>
           
             <el-table-column label="排序" prop="ORDERNUM"></el-table-column>
            <el-table-column label="操作" align="center" width="200" v-if="isAdmin == 'true'">
                <template slot-scope="item">
                    <div>
                            <el-button type="text" icon="el-icon-edit" 
                            class="blue" plain
                            @click="SaveModule(item.row)">编辑</el-button>
                            <el-button type="text"
                            class="red" plain
                            style="color:red"
                             icon="el-icon-delete" @click="DeleteModule(item.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getCSJYLayers, DeleteCSJYLayer } from '@/api/csjy-api';
export default {
    data() {
        return {
            isAdmin: false,
            cityManageData: [] //表格数据初始化
        };
    },
    mounted() {
         this.isAdmin = sessionStorage.getItem('isadmin');
        this.getCSJYLayers();
    },
    methods: {
        async getCSJYLayers() {
            const res = await getCSJYLayers();
            // this.treeData = data;
            if(res.code==1){
                 this.cityManageData = res.data;
            }
           
        },
        // 保存
        SaveModule(data) {
            this.$emit('save', data);
        },
        // 删除
        DeleteModule({ PID }) {
            this.$confirm('你确定要删除这条数据么？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log(data)
                DeleteCSJYLayer({ id: PID }).then((res) => {
                    if(res.code==1){
                         this.$message.success('删除成功！');
                        this.getCSJYLayers();
                    }
                });
            });
        }
    }
};
</script>

<style></style>
