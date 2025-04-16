<!--
 * @Author: WCL
 * @Date: 2022-04-11 15:52:02
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-14 13:14:58
 * @FilePath: \admin-service\src\views\pulicservice\PublicityLayers.vue
 * @Description: 公开公示地图服务
-->
<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button> 
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="LAYERNAME" label="地图服务名称"></el-table-column>
            <el-table-column prop="LAYERURL" label="地图服务地址"></el-table-column>
            <el-table-column prop="LAYERIDS" label="子图层id列表"></el-table-column>
            <!-- <el-table-column prop="CONTENT" label="文本内容"></el-table-column> -->
            <el-table-column prop="LAYERTYPE" label="服务类型"  width="160">
                 <template v-slot="scope">
                    <span v-if="scope.row.LAYERTYPE == 'Tile'">静态服务</span>
                    <span v-else-if="scope.row.LAYERTYPE =='Image'">动态服务</span>
                </template>
            </el-table-column>
            <el-table-column prop="STATUS" label="状态"  width="60">
                <template v-slot="scope">
                    <span v-if="scope.row.STATUS == 0">删除</span>
                    <span v-else-if="scope.row.STATUS == 1">正常</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="220" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="mini" class="blue" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            :title="setTitle"
            :visible.sync="setVisible"
            width="35%"
            custom-class="set-dialog"
            @close="closedSetDialog"
            :close-on-click-modal="false"
        >
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                <el-form-item label="地图服务名称" prop="LAYERNAME">
                    <el-input v-model.trim="setForm.LAYERNAME"></el-input>
                </el-form-item>
                <el-form-item label="地图服务地址" prop="LAYERURL">
                    <el-input v-model.trim="setForm.LAYERURL"></el-input>
                </el-form-item>
                   <el-form-item label="子图层列表" prop="LAYERIDS">
                    <el-select
                        v-model="setForm.LAYERIDS"
                        multiple
                        no-data-text="请选择子图层"
                        @focus="getSonLayers"
                        @change="changeVal"
                    >
                        <el-option
                            v-for="item in sonlayerlist"
                            :key="item.Id"
                            :label="item.Name"
                            :value="item.Id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="地图服务类型" prop="LAYERTYPE">
					<el-radio-group v-model="setForm.LAYERTYPE">
						<el-radio label="Tile">静态服务</el-radio>
						<el-radio label="Image">动态服务</el-radio>
					</el-radio-group>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getGKGSLayerList,saveGKGSLayer,deleteGKGSLayer} from '@/api/publicservice/publicservice-api'
import { getServerLayers} from '@/api/csjy-api'
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            // 表格
            tableData: [],
            sonlayerlist:[],
            setVisible: false,
            setTitle: '',
            setForm: {
                PID: 0,
                LAYERNAME: '',
                LAYERURL: '',
                LAYERIDS: '',
                LAYERTYPE: '',
                GKGSID:0,
            },
            setFormRules: {
                LAYERNAME: [{ required: true, message: '地图服务名称不能为空', trigger: 'blur' }],
                LAYERURL: [{ required: true, message: '地图服务地址不能为空', trigger: 'blur' }],
                LAYERIDS: [{ required: true, message: '请选择子图层', trigger: 'change' }],
                LAYERTYPE: [{ required: true, message: '请选择地图服务类型', trigger: 'change' }],
            },
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.setForm.GKGSID=this.$route.query.id;
        this.getData("");
    },
    methods: {
        // select数据没有自动更新
        changeVal(val) {
            console.log(val);
            this.$forceUpdate();
        },
        // 搜索
        handleSearch() {
            this.currentPage = 1;
            this.getData();
        },
        // 新增
        addType() {
            this.setTitle = '新增';
            this.setVisible = true;
        },
        //获取子图层列表
        async getSonLayers()
        {
            if (this.setForm.LAYERURL=="") {
                this.$message.error('请输入地图服务地址');
                return;
            }
            const res=await getServerLayers({ serverurl: this.setForm.LAYERURL });
                            if (res.code==1) {
                                this.sonlayerlist=res.data;
                            }
        },

        // 获取列表数据
        async getData() {
            debugger;
            // todo
             const res = await getGKGSLayerList({gkgsid:this.setForm.GKGSID});
			if (res.code === 1) {
				this.tableData = res.data
            }
        },

        // 关闭窗口
        closedSetDialog() {
            this.$refs.setForm.resetFields();
            this.setForm = this.$options.data().setForm;
        },

        // 弹窗确定
       async saveAdd() {
            console.log(this.setForm, 'setForm');
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                // todo
                this.setForm.LAYERIDS=this.setForm.LAYERIDS.join(',');
                const res=await saveGKGSLayer(this.setForm);
                if (res.code==1) {
                    this.$message.success(res.msg);
                    this.setVisible = false;
                    this.getData();
                }
                else
                {
                    this.$message.error(res.msg);
                }
            });
       },

        // 编辑
        handleEdit(row) {
            console.log(row);
            this.setTitle = '编辑';
            this.setVisible = true;
            Object.assign(this.setForm, row);
             this.setForm.LAYERIDS=this.setForm.LAYERIDS.split(',');
            this.getSonLayers();
           
        },

        // 删除
        async handleDelete(row) {
            // todo
             const res=await deleteGKGSLayer({pid:row.PID});
              if (res.code==1) {
                    this.$message.success("操作成功");
                    this.getData();
                }
                else
                {
                    this.$message.error("操作失败");
                }
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
.el-select {
    width: 100%;
}
::v-deep .quill-editor {
    padding: 0;
    .ql-container {
        height: 200px;
        min-height: auto;
    }
    .ql-picker.ql-size .ql-picker-label::before,
    .ql-picker.ql-size .ql-picker-item::before {
        content: '14px';
    }
    .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
    .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
        content: '10px';
    }
    .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
    .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
        content: '18px';
    }
    .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
    .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
        content: '32px';
    }

    .ql-picker.ql-header .ql-picker-label::before,
    .ql-picker.ql-header .ql-picker-item::before {
        content: '文本';
    }
    .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
    .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
        content: '标题1';
    }
    .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
    .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
        content: '标题2';
    }
    .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
    .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
        content: '标题3';
    }
    .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
    .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
        content: '标题4';
    }
    .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
    .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
        content: '标题5';
    }
    .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
    .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
        content: '标题6';
    }
}
</style>
