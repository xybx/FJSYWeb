<!--
 * @Author: WCL
 * @Date: 2022-04-11 15:52:44
 * @LastEditors: LJX
 * @LastEditTime: 2022-05-10 17:08:00
 * @FilePath: \admin-service\src\views\pulicservice\Illegal.vue
 * @Description: 违法举报
-->
<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input v-model="queryname" placeholder="请输入关键字" class="handle-input fr"></el-input>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="JBUSERNAME" label="投诉人姓名"></el-table-column>
            <!-- <el-table-column prop="JBRTYPE" label="投诉人类型">
                <template v-slot="scope">
                    <span v-if="scope.row.JBRTYPE == 1">实名举报</span>
                    <span v-else-if="scope.row.JBRTYPE == 2">匿名举报</span>
                    <span v-else>暂无</span>
                </template>
            </el-table-column> -->
            <el-table-column prop="JBOBJECT" label="投诉对象"></el-table-column>
            <el-table-column prop="DESCRIPTION" label="问题描述"></el-table-column>
            <el-table-column prop="CREATETIME" label="投诉时间"></el-table-column>
            <el-table-column prop="STATUS" label="受理状态">
                <template v-slot="scope">
                    <span v-if="scope.row.STATUS == 0">未受理</span>
                    <span v-else-if="scope.row.STATUS == 1">已受理</span>
                </template>
            </el-table-column>
            <el-table-column prop="PROCESSTIME" label="受理时间"></el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="mini" class="blue" @click="handleEdit(scope.row)">查看详细</el-button>
                    <el-button
                        type="text"
                        icon="el-icon-edit"
                        size="mini"
                        class="green"
                        v-if="scope.row.STATUS == 0"
                        @click="handleChangeStatus(scope.row)"
                        >受理</el-button
                    >
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

        <!-- 详细信息弹窗 -->
        <el-dialog
            title="详细信息"
            :visible.sync="setVisible"
            width="45%"
            custom-class="set-dialog"
            @close="closedSetDialog"
            :close-on-click-modal="false"
        >
            <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form">
                <el-form-item label="行政区编码" prop="XZQCODE">
                    <el-input readonly v-model.trim="setForm.XZQCODE"></el-input>
                </el-form-item>
                <el-form-item></el-form-item>
                <el-form-item label="投诉人姓名" prop="JBUSERNAME">
                    <el-input readonly v-model.trim="setForm.JBUSERNAME"></el-input>
                </el-form-item>
                <!-- <el-form-item label="投诉人类型" prop="JBRTYPE">
                    <el-input readonly v-model.trim="setForm.JBRTYPE"></el-input>
                    <template>
                        <el-input readonly v-if="setForm.JBRTYPE == 1" value="实名举报"></el-input>
                        <el-input readonly v-else-if="setForm.JBRTYPE == 2" value="匿名举报"></el-input>
                        <el-input readonly v-else value="暂无"></el-input>
                    </template>
                </el-form-item> -->
                <el-form-item label="投诉人邮箱" prop="EMAIL">
                    <el-input readonly v-model.trim="setForm.EMAIL"></el-input>
                </el-form-item>
                <el-form-item label="投诉人电话" prop="TELEPHONE">
                    <el-input readonly v-model.trim="setForm.TELEPHONE"></el-input>
                </el-form-item>
                <el-form-item label="投诉人身份证" prop="JBRCARDNO">
                    <el-input readonly v-model.trim="setForm.JBRCARDNO"></el-input>
                </el-form-item>
                <el-form-item label="投诉人联系地址" prop="JBRADDRESS">
                    <el-input readonly v-model.trim="setForm.JBRADDRESS" type="textarea" autosize></el-input>
                </el-form-item>
                <el-form-item> </el-form-item>
                <el-form-item label="投诉对象" prop="JBOBJECT">
                    <el-input readonly v-model.trim="setForm.JBOBJECT"></el-input>
                </el-form-item>

                <el-form-item label="问题描述" prop="DESCRIPTION">
                    <el-input readonly v-model.trim="setForm.DESCRIPTION" type="textarea" autosize></el-input>
                </el-form-item>
                <!-- <el-form-item label="投诉问题类型" prop="JBTYPEID">
                    <el-input readonly v-model.trim="setForm.JBTYPEID"></el-input>
                </el-form-item> -->
                <el-form-item label="投诉详细地址" prop="DETAILADDRESS">
                    <el-input readonly v-model.trim="setForm.DETAILADDRESS" type="textarea" autosize></el-input>
                </el-form-item>
                <el-form-item label="投诉位置坐标" prop="POINTS">
                    <el-input readonly v-model.trim="setForm.POINTS" type="textarea" autosize></el-input>
                </el-form-item>

                <el-form-item label="举报时间" prop="CREATETIME">
                    <el-input readonly v-model.trim="setForm.CREATETIME"></el-input>
                </el-form-item>
                <el-form-item label="证据图片" prop="IMAGELIST">
                    <div>
                        <el-image
                            style="width: 100px"
                            :src="imageDomain + item.IMGURL"
                            :preview-src-list="imageurlList"
                            v-for="item in setForm.IMAGELIST"
                            :key="item.PID"
                        >
                        </el-image>
                    </div>
                </el-form-item>
                <el-form-item label="受理时间" prop="PROCESSTIME">
                    <el-input readonly v-model.trim="setForm.PROCESSTIME"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">取 消</el-button>
                <el-button type="primary" @click="setVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getWFJBList, changestatusWFJB } from '@/api/publicservice/publicservice-api';
export default {
    name: '',
    props: {},
    components: {},
    data() {
        return {
            imageDomain: '',
            imageurlList: [],
            // 表格
            tableData: [],
            queryname: '',
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            setVisible: false,
            setTitle: '',
            setForm: {
                JBUSERNAME: '',
                JBRTYPE: '',
                EMAIL: '',
                TELEPHONE: '',
                JBOBJECT: '',
                DESCRIPTION: '',
                JBTYPEID: '',
                DETAILADDRESS: '',
                POINTS: '',
                JBRCARDNO: '',
                JBRADDRESS: '',
                XZQCODE: '',
                CREATETIME: '',
                IMAGELIST: [],
                PROCESSTIME: ''
            }
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.imageDomain = apiURL_file_PublicService;
        this.getData();
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
            const res = await getWFJBList(params);
            if (res.code === 1) {
                this.tableData = res.data.datalist;
                this.pageTotal = res.data.total;
            }
        },

        // 关闭窗口
        closedSetDialog() {
            this.setForm = this.$options.data().setForm;
        },

        // 详细信息
        handleEdit(row) {
            console.log(row);
            this.setVisible = true;
            this.$nextTick(() => {
                Object.assign(this.setForm, row);
                if (this.setForm.IMAGELIST != null && this.setForm.IMAGELIST.length > 0) {
                    this.setForm.IMAGELIST.forEach((image) => {
                        this.imageurlList.push(this.imageDomain + image.IMGURL);
                    });
                }
            });
        },

        async handleChangeStatus(row) {
            console.log(row);
            const res = await changestatusWFJB({ pid: row.PID, status: 1 });
            if (res.code === 1) {
                this.getData(this.queryname);
                this.$message.success('操作成功');
            }
        },

        // 删除
        async handleDelete(row) {
            // todo
        }
    }
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
::v-deep .set-dialog {
    .el-input__inner:hover {
        cursor: default;
    }
    .set-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
            width: 50%;
        }
        textarea {
            resize: none;
        }
    }
}
.handle-input {
    margin-bottom: 10px;
    margin-right: 10px;
}
</style>
