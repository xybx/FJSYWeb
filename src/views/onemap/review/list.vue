<!--
 * @Author: LJX
 * @Date: 2022-03-10 08:58:54
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-31 14:33:13
 * @FilePath: \admin-service\src\views\onemap\review\list.vue
 * @Description: 请填写描述
-->
<template>
    <div>
        <el-table :data="reviewData" border>
            <el-table-column label="图层名称" prop="LAYERNAME" width="300"></el-table-column>
            <el-table-column label="图层服务地址" prop="LAYERURL"></el-table-column>
             <el-table-column label="子图层ID" prop="CHILDID" width="100"></el-table-column>
            <el-table-column label="规则" prop="REGULATION" width="200"></el-table-column>
            <el-table-column label="操作" align="center" width="200" v-if="isAdmin == 'true'">
                <template slot-scope="item">
                    <div>
                    
                              <el-button type="text" icon="el-icon-edit" 
                              class="blue" plain
                              @click="SaveModule(item.row)" >编辑</el-button>
                  
                          <el-button type="text" icon="el-icon-delete" 
                          class="red" plain
                          style="color:red"
                          @click="DeleteModule(item.row.ID)">删除</el-button>
                   
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getHGSCLayer,DeleteHGSCLayer } from '@/api/HGSC-api';
export default {
    data() {
        return {
            isAdmin: false,
            reviewData: [] //表格数据初始化
        };
    },
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.getHGSCLayerData();
    },
    methods: {
        async getHGSCLayerData() {
            const res = await getHGSCLayer();
            this.reviewData = res.data;
           
        },
       
        // 保存
        SaveModule(data) {
            this.$emit('save', data);
        },
        // 删除
        // DeleteModule({ PID }) {
        DeleteModule(id) {
            // console.log(item);
            this.$confirm('你确定要删除这条数据么？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // const res= DeleteHGSCLayer({ id:id });
                //  if(res.code==1){
                //        this.$message.success('删除成功！');
                //        this.getHGSCLayerData();
                //    }
                // console.log(data)
               DeleteHGSCLayer({ id:id }).then((res) => {
                   if(res.code==1){
                       this.$message.success('删除成功！');
                       this.getHGSCLayerData();
                   }
                    
                });
            });
        }
    }
};
</script>

<style>
</style>