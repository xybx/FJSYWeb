<!--
 * @Author: LJX
 * @Date: 2022-02-22 15:16:22
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-02 13:51:15
 * @FilePath: \fjsy-web\src\views\onemap\topicmap\list.vue
 * @Description: 请填写描述
-->
<template>
    <div>
        <el-table style="font-size:15px" :data="topicMapData" border>
            <el-table-column label="专题图名称" prop="ZTTNAME" width="200" align='center'></el-table-column>
            <el-table-column label="图层服务地址" prop="LAYERURL" align='center'></el-table-column>
            <el-table-column label="地图服务类型" prop="MAPTYPE" align='center'>
                  <template v-slot="scope">
                    <span v-if="scope.row.MAPTYPE === 'image'">动态服务</span>
                    <span v-else-if="scope.row.MAPTYPE === 'tile'">静态服务</span>
                </template>
            </el-table-column>
             <el-table-column label="排序" prop="ORDERNUM" width="100" align='center'></el-table-column>
            <el-table-column label="操作" align="center" width="200" v-if="isAdmin == 'true'">
                <template slot-scope="item">
                    <div>
                              <el-button type="text" 
                              class="blue" plain
                              icon="el-icon-edit" @click="SaveModule(item.row)" >编辑</el-button>
                          <el-button type="text" 
                           size="mimi" plain
                           icon="el-icon-delete"
                          style="color:red"
                           @click="DeleteModule(item.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getZTTLayers,DeleteZTTLayer } from '@/api/ZTT-api';
export default {
    data() {
        return {
            isAdmin:false,
            topicMapData: [] //表格数据初始化
        };
    },
    mounted() {
        this.isAdmin = sessionStorage.getItem('isadmin');
        this.getZTTLayersData();
    },
    methods: {
        async getZTTLayersData() {
            const res = await getZTTLayers();
            if(res.code==200){
                  this.topicMapData = res.data;
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
               DeleteZTTLayer({ id: PID }).then((res) => {
                   if(res.code==200){
                        this.$message.success('删除成功！');
                        this.getZTTLayersData();
                   }
                   
                });
            });
        }
    }
};
</script>

<style>
</style>