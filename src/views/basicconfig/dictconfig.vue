
<template>
	<div class="container">
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
			<el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
			<el-input v-model="queryname" placeholder="请输入关键字" class="handle-input fr"></el-input>
		</div>
		<el-table style="font-size: 15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="pid" label="PID" align="center"></el-table-column>
			<el-table-column prop="name" label="字典名称" align="center"></el-table-column>
			<el-table-column prop="code" label="code" align="center"></el-table-column>
			<el-table-column prop="stringnum" label="字符值" align="center"></el-table-column>
			<el-table-column prop="intnum" label="数字值" align="center"></el-table-column>
			<el-table-column prop="describe" label="描述" align="center"></el-table-column>

			<el-table-column label="操作" width="180" align="center">
				<template slot-scope="scope">
					<el-button type="text" icon="el-icon-edit" size="mini" class="blue" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination
				background
				layout="total, prev, pager, next, jumper"
				:current-page="pageNum"
				:page-size="pageSize"
				:total="pageTotal"
				@current-change="handlePageChange"
			></el-pagination>
		</div>

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
				<el-form-item label="字典名称" prop="name">
					<el-input v-model.trim="setForm.name"></el-input>
				</el-form-item>
				<el-form-item label="code" prop="code">
					<el-input v-model.trim="setForm.code"></el-input>
				</el-form-item>
				<el-form-item label="字符值" prop="stringnum">
					<el-input v-model.trim="setForm.stringnum"></el-input>
				</el-form-item>
				<el-form-item label="数字值" prop="intnum">
					<el-input v-model.trim="setForm.intnum"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="describe">
					<el-input v-model.trim="setForm.describe"></el-input>
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
import { getDICTList, saveDICTType, deleteDICTType } from '@/api/dictconfig-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			// 表格
			tableData: [],
			queryname: '',
			pageNum: 1,
			pageSize: 10,
			pageTotal: 0,
			setVisible: false,
			setTitle: '',
			setForm: {
				pid: 0,
				name: '',
				stringnum: '',
				code: '',
				intnum: '',
				describe: ''
			},
			setFormRules: {
				name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
				code: [{ required: true, message: 'code不能为空', trigger: 'blur' }],
			}
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {
		this.getGeoData();
	},
	methods: {
		// 搜索
		handleSearch() {
			this.pageNum = 1;
			this.getGeoData(this.queryname);
		},
		// 新增
		addType() {
			this.setTitle = '新增';
			this.setVisible = true;
		},

		// 页面切换
		handlePageChange(val) {
			this.pageNum = val;
			this.getGeoData();
		},

		// 获取列表数据
		async getGeoData(keyword) {
			let params;
			if (keyword) {
				params = {
					name: keyword,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				};
			} else {
				params = {
					name: '',
					pageNum: this.pageNum,
					pageSize: this.pageSize
				};
			}

			const res = await getDICTList(params);
			if (res.code === 200) {
				this.tableData = res.data.list;
				this.pageTotal = res.data.total;
			}
		},

		// 关闭窗口
		closedSetDialog() {
			this.$refs.setForm.resetFields();
			this.setForm = this.$options.data().setForm;
		},

		// 弹窗确定
		saveAdd() {
			this.$refs.setForm.validate(async (valid) => {
				if (!valid) return this.$message.error('请补充必填项');
				const res = await saveDICTType(this.setForm);
				if (res.code === 200) {
					this.$message.success(`${this.setTitle}成功`);
					this.setVisible = false;
					this.getGeoData();
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

			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					let params = {
						pid: row.pid
					};
					const res = await deleteDICTType(params.pid);
					if (res.code == 200) {
						this.$message.success('删除成功！');
						this.getGeoData();
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