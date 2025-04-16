<!--
 * @Author: LJX
 * @Date: 2022-04-11 15:52:44
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-21 13:36:15
 * @FilePath: \admin-service\src\views\logmanage\logmanage.vue
 * @Description: 日志管理
-->
<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
            <el-input
                v-model="queryname"
                placeholder="请输入关键字(用户名,日志内容,ip,异常信息,所属系统)"
                class="handle-input fr"
            ></el-input>

            <el-date-picker
                class="fr"
                v-model="date"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
            >
            </el-date-picker>
            <span class="fr">日志记录日期：</span>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
            <el-table-column prop="NO" label="序号" width="60"></el-table-column>
            <el-table-column prop="USERNAME" label="用户名(用户id)" width="100"></el-table-column>
            <el-table-column prop="IP" label="IP" width="140"></el-table-column>
            <el-table-column prop="LOG_LEVEL" label="日志类型" width="80"> </el-table-column>
            <el-table-column prop="LOG_THREAD" label="线程ID" width="80"> </el-table-column>
            <el-table-column prop="LOG_MESSAGE" label="日志内容"></el-table-column>
            <el-table-column prop="LOG_LOCATION" label="记录日志的位置"></el-table-column>
            <el-table-column prop="SYSTEM_ID" label="所属系统" width="180"></el-table-column>
            <el-table-column prop="LOGDATE" label="记录日期" width="160"></el-table-column>

            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="mini" class="blue" @click="handleEdit(scope.row)">查看详细</el-button>
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
                <el-form-item label="用户名" prop="USERNAME">
                    <el-input readonly v-model.trim="setForm.USERNAME"></el-input>
                </el-form-item>
                <el-form-item label="IP" prop="IP">
                    <el-input readonly v-model.trim="setForm.IP"></el-input>
                </el-form-item>
                <el-form-item label="日志类型" prop="LOG_LEVEL">
                    <el-input readonly v-model.trim="setForm.LOG_LEVEL"></el-input>
                </el-form-item>
                <el-form-item label="线程ID" prop="LOG_THREAD">
                    <el-input readonly v-model.trim="setForm.LOG_THREAD"></el-input>
                </el-form-item>
                <el-form-item label="日志内容" prop="LOG_MESSAGE">
                    <el-input readonly v-model.trim="setForm.LOG_MESSAGE" type="textarea" autosize></el-input>
                </el-form-item>
                <el-form-item label="记录日志的位置" prop="LOG_LOCATION">
                    <el-input readonly v-model.trim="setForm.LOG_LOCATION"></el-input>
                </el-form-item>
                <el-form-item label="异常日志" prop="LOG_EXCEPTION">
                    <el-input readonly v-model.trim="setForm.LOG_EXCEPTION" type="textarea" autosize></el-input>
                </el-form-item>
                <el-form-item label="所属系统" prop="SYSTEM_ID">
                    <el-input readonly v-model.trim="setForm.SYSTEM_ID" type="textarea" autosize></el-input>
                </el-form-item>
                <el-form-item label="记录日期" prop="LOGDATE">
                    <el-input readonly v-model.trim="setForm.LOGDATE"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setVisible = false">关闭</el-button>
                <!-- <el-button type="primary" @click="setVisible = false">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getlist } from '@/api/logmanage-api';
import SpaceCalc from '../basicconfig/SpaceCalc.vue';
export default {
    name: '',
    props: {},
    components: { SpaceCalc },
    data() {
        return {
            // 表格
            tableData: [],
            queryname: '',
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            setVisible: false,
            setTitle: '',
            setForm: {
                USERNAME: '',
                IP: '',
                LOG_LEVEL: '',
                LOG_THREAD: '',
                LOG_MESSAGE: '',
                LOG_LOCATION: '',
                LOG_EXCEPTION: '',
                SYSTEM_ID: '',
                LOGDATE: ''
            },
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            date: ''
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.getData('');
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
            var _sdate = '';
            var _edate = '';
            if (this.date != null && this.date != '') {
                _sdate = this.date[0].getFullYear() + '-' + (this.date[0].getMonth() + 1) + '-' + this.date[0].getDate();
                _edate = this.date[1].getFullYear() + '-' + (this.date[1].getMonth() + 1) + '-' + this.date[1].getDate();
                if (_sdate == _edate) {
                    _edate=this.date[1].getFullYear() + '-' + (this.date[1].getMonth() + 1) + '-' + (this.date[1].getDate()+1);
                }
            }

            debugger;
            let params;
            if (keyword) {
                params = {
                    keyword,
                    sdate: _sdate,
                    edate: _edate,
                    currentpage: this.currentPage,
                    pagesize: this.pageSize
                };
            } else {
                params = {
                    keyword: '',
                    sdate: _sdate,
                    edate: _edate,
                    currentpage: this.currentPage,
                    pagesize: this.pageSize
                };
            }
            // todo
            const res = await getlist(params);
            if (res.code === 1) {
                this.tableData = res.data.datas;
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
            });
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
