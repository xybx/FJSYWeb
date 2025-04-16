
<!--
 * @Author: WCL
 * @Date: 2022-04-11 15:51:06
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-14 14:01:06
 * @FilePath: \admin-service\src\views\pulicservice\typelist.vue
 * @Description: 类型管理
-->
<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input v-model="queryname" placeholder="请输入关键字" class="handle-input fr"></el-input>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
             <el-table-column prop="PID" label="序号" width="100"></el-table-column>
             <el-table-column prop="TYPENAME" label="类型名称"></el-table-column>
            <el-table-column prop="FUNTYPE" label="所属模块"  width="200">
                 <template v-slot="scope">
                    <span v-if="scope.row.FUNTYPE == 1">公开公示</span>
                    <span v-else-if="scope.row.FUNTYPE ==2">意见征询</span>
                    <span v-else-if="scope.row.FUNTYPE ==3">公众监督</span>
                </template>
            </el-table-column>
             <el-table-column prop="ORDERNUM" label="排序"></el-table-column>
            <el-table-column prop="STATUS" label="状态" width="60">
                <template v-slot="scope">
                    <span v-if="scope.row.STATUS == 0">删除</span>
                    <span v-else-if="scope.row.STATUS == 1">正常</span>
                    <!-- <span v-else="scope.row.STATUS == 0">暂无状态</span> -->
                </template>
            </el-table-column>

            <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="mini" class="blue" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)" v-if="scope.row.STATUS==1">删除</el-button>
                <el-button type="text" icon="el-icon-setting" class="green" @click="handleDelete(scope.row)" v-if="scope.row.STATUS==0">恢复</el-button>
               
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="pageTotal"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>

        <!-- 新增/编辑弹窗 -->
        <el-dialog
            :title="setTitle"
            :visible.sync="setVisible"
            width="40%"
            custom-class="set-dialog"
            @close="closedSetDialog"
            :close-on-click-modal="false"
        >
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                <el-form-item label="分类模块" prop="FUNTYPE">
                    <el-select v-model="setForm.FUNTYPE" placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型名称" prop="TYPENAME">
                    <el-input v-model.trim="setForm.TYPENAME"></el-input>
                </el-form-item>
                 <el-form-item label="排序" prop="ORDERNUM">
                    <el-input v-model.number="setForm.ORDERNUM"></el-input>
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
import {getDictList,saveDict,deleteDict} from '@/api/publicservice/publicservice-api'
export default {
    name: '',
    props: {},
    components: {  },
    data() {
        return {
            // 表格
            tableData: [],
            queryname: '',
            currentPage: 1,
            pageSize: 20,
            pageTotal: 0,
            setVisible: false,
            setTitle: '',
            setForm: {
                PID: 0,
                TYPENAME: '',
                FUNTYPE: null,
                STATUS: '',
                ORDERNUM:0,
            },
            setFormRules: {
                FUNTYPE: [{ required: true, message: '请选择分类', trigger: 'change' }],
                TYPENAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
            },
            typeOptions: [
                { label: '公开公示', value: 1 },
                // { label: '意见征询', value: 2 },
                // { label: '公众监督', value: 3 }
            ],
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.getData("");
    },
    methods: {
        // 搜索
        handleSearch() {
            this.currentPage = 1;
            this.getData(this.queryname);
        },
        // 新增
        addType() {
            this.setTitle = '新增';
            this.setVisible = true;
        },

        // 页面切换
        handlePageChange(val) {
            this.currentPage = val;
            this.getData();
        },

        // 获取列表数据
        async getData(keyword) {
            let params;
            if (keyword) {
                params = {
                    keyword,
                    currentpage: this.currentPage,
                    pagesize: this.pageSize
                };
            } else {
                params = {
                    keyword: '',
                    currentpage: this.currentPage,
                    pagesize: this.pageSize
                };
            }
            // todo
            const res = await getDictList(params);
			if (res.code === 1) {
				this.tableData = res.data.datalist;
				this.pageTotal=res.data.total;
			}
        },

        // 关闭窗口
        closedSetDialog() {
            this.$refs.setForm.resetFields();
            this.setForm = this.$options.data().setForm;
        },

        // 弹窗确定
        saveAdd() {
            console.log(this.setForm, 'setForm');
            this.$refs.setForm.validate(async (valid) => {
                if (!valid) return this.$message.error('请补充必填项');
                // todo
                 const res=await saveDict(this.setForm);
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
        },

        // 删除
        async handleDelete(row) {
            // todo
              var _status=row.STATUS==0?1:0;
             const res=await deleteDict({pid:row.PID,status:_status});
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
