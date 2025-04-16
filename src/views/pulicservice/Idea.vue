<!--
 * @Author: WCL
 * @Date: 2022-04-11 15:51:06
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-13 17:33:36
 * @FilePath: \admin-service\src\views\pulicservice\Idea.vue
 * @Description: 意见征集
-->
<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input v-model="queryname" placeholder="请输入关键字" class="handle-input fr"></el-input>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
             <el-table-column prop="TITLE" label="标题" width="400"></el-table-column>
             <!-- <el-table-column prop="TYPENAME" label="类型"></el-table-column> -->
            <el-table-column prop="PROOF" label="文号"  width="200"></el-table-column>
            <!-- <el-table-column prop="CONTENT" label="内容"></el-table-column> -->
            <el-table-column prop="DEPTNAME" label="发布机关" width="160"></el-table-column>
            <el-table-column prop="CREATETIME" label="创建时间" width="160"></el-table-column>
            <el-table-column prop="UPDATETIME" label="更新时间" width="160"></el-table-column>
            <el-table-column prop="TAGS" label="主题词"></el-table-column>
            <el-table-column prop="READNUM" label="阅读次数" width="80"></el-table-column>
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
                    <!-- <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
                 -->
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
                <!-- <el-form-item label="类型ID" prop="TYPEID">
                    <el-select v-model="setForm.TYPEID" placeholder="请选择">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="标题" prop="TITLE">
                    <el-input v-model.trim="setForm.TITLE"></el-input>
                </el-form-item>
                <el-form-item label="文号" prop="PROOF">
                    <el-input v-model.trim="setForm.PROOF"></el-input>
                </el-form-item>
                <el-form-item label="主题词" prop="TAGS">
                    <el-input v-model.trim="setForm.TAGS"></el-input>
                </el-form-item>
                <el-form-item label="发布机关" prop="DEPTNAME">
                    <el-input v-model.trim="setForm.DEPTNAME"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="CONTENT">
                    <quill-editor class="ql-editor" v-model="setForm.CONTENT" ref="myQuillEditor" :options="editorOption"> </quill-editor>
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
import {getOpinionList,saveOpinion,deleteOpinion} from '@/api/publicservice/publicservice-api'
import { quillEditor } from 'vue-quill-editor';
export default {
    name: '',
    props: {},
    components: { quillEditor },
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
                TITLE: '',
                TYPEID: null,
                PROOF: '',
                DEPTNAME: '',
                TAGS: '',
                CONTENT: ''
            },
            setFormRules: {
                TYPEID: [{ required: true, message: '类型ID不能为空', trigger: 'change' }],
                TITLE: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
                PROOF: [{ required: true, message: '文号不能为空', trigger: 'blur' }],
                TAGS: [{ required: true, message: '主题词不能为空', trigger: 'blur' }],
                DEPTNAME: [{ required: true, message: '发布机关不能为空', trigger: 'blur' }],
                CONTENT: [{ required: true, message: '文本内容不能为空', trigger: 'blur' }]
            },
            typeOptions: [
                { label: '类型1', value: 1 },
                { label: '类型2', value: 2 },
                { label: '类型3', value: 3 }
            ],
            editorOption: {
                placeholder: '请输入文本内容',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ header: 1 }, { header: 2 }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ indent: '-1' }, { indent: '+1' }],
                        [{ size: ['small', false, 'large', 'huge'] }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        ['clean']
                    ]
                }
            },
            titleConfig: {
                'ql-bold': '加粗',
                'ql-color': '颜色',
                'ql-font': '字体',
                'ql-code': '插入代码',
                'ql-italic': '斜体',
                'ql-link': '添加链接',
                'ql-background': '背景颜色',
                'ql-size': '字体大小',
                'ql-strike': '删除线',
                'ql-script': '上标/下标',
                'ql-underline': '下划线',
                'ql-blockquote': '引用',
                'ql-header': '标题',
                'ql-indent': '缩进',
                'ql-list': '列表',
                'ql-align': '文本对齐',
                'ql-direction': '文本方向',
                'ql-code-block': '代码块',
                'ql-formula': '公式',
                'ql-image': '图片',
                'ql-video': '视频',
                'ql-clean': '清除字体样式',
                'ql-upload': '文件'
            }
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
                    typeid:0,
                    keyword,
                    currentpage: this.currentPage,
                    pagesize: this.pageSize
                };
            } else {
                params = {
                    typeid:0,
                    keyword: '',
                    currentpage: this.currentPage,
                    pagesize: this.pageSize
                };
            }
            // todo
            const res = await getOpinionList(params);
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
                const res=await saveOpinion(this.setForm);
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
             const res=await deleteOpinion({pid:row.PID,status:_status});
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
