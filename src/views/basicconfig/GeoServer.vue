<!--
 * @Author: WCL
 * @Date: 2022-02-08 16:04:14
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-21 15:44:24
 * @FilePath: \admin-service\src\views\basicconfig\GeoServer.vue
 * @Description: 地图服务器
-->
<template>
	<div class="container">
		<!-- 顶部表单 -->
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType" v-if="isAdmin == 'true'">新增</el-button>
			<el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
			<el-input v-model="queryname" placeholder="IP关键字" class="handle-input fr"></el-input>
		</div>

		<el-table style="font-size:15px":data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="PID" label="ID" width="55" align="center"></el-table-column>
			<el-table-column prop="IP" label="IP" align="center"></el-table-column>
			<el-table-column prop="REMARK" label="说明" align="center"> </el-table-column>
			<el-table-column prop="SERVERURL" label="URL" align="center"> </el-table-column>

			<el-table-column label="操作" width="180" align="center" v-if="isAdmin == 'true'">
				<template slot-scope="scope">
					<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
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
			width="30%"
			custom-class="set-dialog"
			@close="closedSetDialog"
			:close-on-click-modal="false"
		>
			<el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
				<el-form-item label="IP" prop="IP">
					<el-input v-model.trim="setForm.IP" placeholder="请输入IP"></el-input>
				</el-form-item>
				<el-form-item label="说明" prop="REMARK">
					<el-input v-model.trim="setForm.REMARK" placeholder="请输入说明"></el-input>
				</el-form-item>
				<el-form-item label="URL" prop="SERVERURL">
					<el-input v-model.trim="setForm.SERVERURL" placeholder="请输入URL"></el-input>
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
import { getList, saveServer, delServer } from '@/api/geoservice-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			isAdmin:false,
			// 查询关键字
			queryname: '',
			tableData: [],
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			setForm: {
				PID: 0,
				IP: '',
				REMARK: '',
				SERVERURL: ''
			},
			setFormRules: {
				IP: [{ required: true, message: 'IP不能为空', trigger: 'blur' }],
				REMARK: [{ required: true, message: '说明不能为空', trigger: 'blur' }],
				SERVERURL: [{ required: true, message: 'URL不能为空', trigger: 'blur' }]
			},
			setTitle: '',
			setVisible: false
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {
		this.isAdmin = sessionStorage.getItem('isadmin');
		this.getData();
	},
	methods: {
		// 新增
		addType() {
			this.setTitle = '新增';
			this.setVisible = true;
		},

		// 搜索
		handleSearch() {
			let form = {
				keyword: this.queryname
			};
			this.getData(form);
		},

		// 当前页点击
		handlePageChange(val) {
			this.currentPage = val;
			let form = {
				keyword: this.queryname
			};
			this.getData(form);
		},

		// 获取列表数据
		async getData(form) {
			let params = {
				keyword: '',
				currentpage: this.currentPage,
				pagesize: this.pageSize
			};
			if (form?.keyword) {
				Object.assign(params, form);
			}

			const res = await getList(params);
			if (res.code === 200) {
				this.tableData = res.data.list;
				this.pageTotal = res.data.total;
			}
		},

		// 弹窗确认
		saveAdd() {
			this.$refs.setForm.validate(async (valid) => {
				if (!valid) return this.$message.error('请补充必填项');
				const res = await saveServer(this.setForm);
				if (res.code === 200) {
					this.$message.success(`${this.setTitle}成功`);
					this.setVisible = false;
					this.getData();
				}
			});
		},

		// 弹窗关闭
		closedSetDialog() {
			this.$refs.setForm.resetFields();
			this.setForm = this.$options.data().setForm;
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
			//询问是否删除
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					const res = await delServer({ pid: row.PID });
					if (res.code === 200) {
						this.$message.success('删除成功！');
						this.getData();
					}
				})
				.catch(() => {
					this.$message.info('已取消删除');
				});
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
</style>