<!--
 * @Author: WCL
 * @Date: 2022-02-09 09:36:37
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-22 10:42:48
 * @FilePath: \admin-service\src\views\basicconfig\SdeDatabase.vue
 * @Description: 空间数据库
-->
<template>
	<div class="container">
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
		</div>
		<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="ID" label="序号" width="80" align="center"></el-table-column>
			<el-table-column prop="NAME" label="名称"></el-table-column>
			<el-table-column prop="SERVER" label="IP地址"></el-table-column>
			<el-table-column prop="USERNAME" label="用户名"></el-table-column>
			<el-table-column prop="PASSWORD" label="密码"></el-table-column>
			<el-table-column prop="DATABASE" label="数据库名称"></el-table-column>
			<el-table-column prop="INSTANCE" label="数据库实例"></el-table-column>
			<el-table-column label="操作" width="180" align="center">
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
				<el-form-item label="名称" prop="NAME">
					<el-input v-model.trim="setForm.NAME" placeholder="请输入名称"></el-input>
				</el-form-item>
				<el-form-item label="IP地址" prop="SERVER">
					<el-input v-model.trim="setForm.SERVER" placeholder="请输入服务地址"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="USERNAME">
					<el-input v-model.trim="setForm.USERNAME" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="PASSWORD">
					<el-input v-model.trim="setForm.PASSWORD" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-form-item label="数据库名称" prop="DATABASE">
					<el-input v-model.trim="setForm.DATABASE" placeholder="请输入数据库名称"></el-input>
				</el-form-item>
				<el-form-item label="数据库实例" prop="INSTANCE">
					<el-input v-model.trim="setForm.INSTANCE" placeholder="请输入数据库实例(例如：sde:oracle11g:system)"></el-input>
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
import { getList, saveSdeData, delSdeData } from '@/api/sdedatabase-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			tableData: [],
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			setVisible: false,
			setTitle: '',
			setForm: {
				ID: 0,
				NAME: '',
				SERVER: '',
				USERNAME: '',
				PASSWORD: '',
				DATABASE: '',
				INSTANCE:''
			},
			setFormRules: {
				NAME: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
				SERVER: [{ required: true, message: '服务地址不能为空', trigger: 'blur' }],
				USERNAME: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
				PASSWORD: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
				DATABASE: [{ required: true, message: '数据库名称不能为空', trigger: 'blur' }],
				INSTANCE: [{ required: true, message: '数据库实例不能为空', trigger: 'blur' }]
			}
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {
		this.getData();
	},
	methods: {
		// 新增
		addType() {
			this.setTitle = '新增';
			this.setVisible = true;
		},

		// 页码切换
		handlePageChange() {},

		// 获取列表数据
		async getData() {
			let params = {
				currentpage: this.currentPage,
				pagesize: this.pageSize
			};
			const res = await getList(params);
			if (res.code === 1) {
				this.tableData = res.data.datas;
				this.pageTotal = res.data.total;
			}
		},

		// 弹窗确定
		saveAdd() {
			this.$refs.setForm.validate(async (valid) => {
				if (!valid) return this.$message.error('请补充必填项');
				const res = await saveSdeData(this.setForm);
				if (res.code === 1) {
					this.$message.success(`${this.setTitle}成功`);
					this.setVisible = false;
					this.getData();
				}
			});
		},

		// 关闭窗口
		closedSetDialog() {
			this.$refs.setForm.resetFields();
			this.setForm = this.$options.data().setForm;
		},

		// 编辑
		handleEdit(row) {
			this.setTitle = '编辑';
			this.setVisible = true;
			Object.assign(this.setForm, row);
		},

		// 删除
		async handleDelete(row) {
			let params = {
				pid: row.ID
			};
			const res = await delSdeData(params);
			if (res.code === 1) {
				this.$message.success('删除成功！');
				this.getData();
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
</style>