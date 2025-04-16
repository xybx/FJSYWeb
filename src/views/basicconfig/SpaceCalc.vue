<!--
 * @Author: WCL
 * @Date: 2022-02-08 14:27:25
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-10 15:35:37
 * @FilePath: \admin-service\src\views\basicconfig\SpaceCalc.vue
 * @Description: 空间计算引擎
-->
<template>
	<div class="container">
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType" v-if="isAdmin == 'true'">新增</el-button>
		</div>
		<el-table style="font-size:15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="PID" label="序号" width="80" align="center"></el-table-column>
			<el-table-column prop="MAPGEOMETRYSERVICEURL" label="URL" align="center"></el-table-column>

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
			width="35%"
			custom-class="set-dialog"
			@close="closedSetDialog"
			:close-on-click-modal="false"
		>
			<el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
				<el-form-item label="URL" prop="MAPGEOMETRYSERVICEURL">
					<el-input v-model.trim="setForm.MAPGEOMETRYSERVICEURL"></el-input>
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
import { getGeoServiceList, saveGeoService, delGeoService } from '@/api/spacecalc-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			isAdmin: false,
			// 表格
			tableData: [],
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			setVisible: false,
			setTitle: '',
			setForm: {
				PID: 0,
				RULEID: 0,
				MAPGEOMETRYSERVICEURL: ''
			},
			setFormRules: {
				MAPGEOMETRYSERVICEURL: [{ required: true, message: 'URL不能为空', trigger: 'blur' }]
			}
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {
		this.isAdmin = sessionStorage.getItem('isadmin');
		this.getGeoData();
	},
	methods: {
		// 新增
		addType() {
			this.setTitle = '新增';
			this.setVisible = true;
		},

		// 页面切换
		handlePageChange(val) {
			this.currentPage = val;
			this.getGeoData();
		},

		// 获取列表数据
		async getGeoData() {
			let params = {
				currentpage: this.currentPage,
				pagesize: this.pageSize
			};
			const res = await getGeoServiceList(params);
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
				const res = await saveGeoService(this.setForm);
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
			//询问是否删除
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(async () => {
					const res = await delGeoService({pid:row.PID});
					if (res.code === 200) {
						this.$message.success('删除成功！');
						this.getGeoData();
					}
				})
				.catch(() => {});
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
</style>