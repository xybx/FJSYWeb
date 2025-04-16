<!--功
 * @Author: WCL
 * @Date: 2022-02-11 13:37:52
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-02 17:23:22
 * @FilePath: \fjsy-web\src\views\onemap\LocateChild.vue
 * @Description: 统一平台 - 查询定位 - 子图层
-->
<template>
	<div class="container">
		<!-- 顶部表单 -->
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
		</div>

		<el-table style="font-size: 15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="PID" label="序号" width="80" align="center"></el-table-column>
			<el-table-column prop="CHILDID" label="查询的子图层id" align="center"></el-table-column>
			<el-table-column prop="FIELD" label="查询字段名" align="center"></el-table-column>
			<el-table-column prop="SHOWFIELD" label="显示结果字段别名" align="center"></el-table-column>
			<el-table-column label="操作" width="280" align="center">
				<template slot-scope="scope">
					<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

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
				<el-form-item label="子图层" prop="CHILDID">
					<el-select v-model="setForm.CHILDID" placeholder="请选择子图层" @change="changeChildID">
						<el-option v-for="item in childIdList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="查询字段" prop="FIELD">
					<el-select v-model="setForm.FIELD" no-data-text="请先选择子图层" placeholder="请选择查询字段">
						<el-option v-for="(item, index) in fieldList" :key="index" :label="`${item.name}:${item.alias}`" :value="item.name">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="结果字段别名" prop="SHOWFIELD">
					<el-select v-model="setForm.SHOWFIELD" no-data-text="请先选择子图层" placeholder="请选择结果字段">
						<el-option v-for="(item, index) in fieldList" :key="index" :label="item.alias" :value="item.alias"> </el-option>
					</el-select>
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
import { getChildLayer, saveChildLayer, delChildLayer, getChildServer, getChildField } from '@/api/onemap/querylocate-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			isAdmin: false,
			tableData: [],
			setVisible: false,
			setTitle: '',
			setForm: {
				PID: 0,
				CHILDID: '',
				FIELD: '',
				PARENTID: '',
				SHOWFIELD: ''
			},
			setFormRules: {
				CHILDID: [{ required: true, message: '子图层不能为空', trigger: 'change' }],
				FIELD: [{ required: true, message: '查询字段不能为空', trigger: 'change' }],
				SHOWFIELD: [{ required: true, message: '结果字段不能为空', trigger: 'change' }]
			},
			childIdList: [],
			fieldList: []
		};
	},
	computed: {},
	watch: {
		setVisible(boo) {
			if (boo) {
				this.getChildList();
				this.changeChildID();
			}
		}
	},
	created() {},
	mounted() {
		this.isAdmin = sessionStorage.getItem('isadmin');
		this.setForm.PARENTID = this.$route.query.id;
		this.getData();
	},
	methods: {
		// 获取子图层列表
		async getChildList() {
			let params = {
				querylocationpid: this.$route.query.id
			};
			const res = await getChildServer(params);
			if (res.code === 200) {
				this.childIdList = res.data;
			}
		},

		// 子图层列表选择
		async changeChildID() {
			let params = {
				querylocationpid: this.$route.query.id,
				childid: this.setForm.CHILDID == '' ? '0' : this.setForm.CHILDID
			};
			const res = await getChildField(params);
			if (res.code === 200) {
				this.fieldList = res.data;
			}
		},

		// 新增
		addType() {
			this.setTitle = '新增';
			this.setVisible = true;
		},

		// 获取列表数据
		async getData() {
			let params = {
				parentid: this.$route.query.id
			};
			const res = await getChildLayer(params);
			if (res.code === 200) {
				this.tableData = res.data;
			}
		},

		// 弹窗确定
		saveAdd() {
			this.$refs.setForm.validate(async (valid) => {
				if (!valid) return this.$message.error('请补充必填项');
				this.setForm.PARENTID = this.$route.query.id
				const res = await saveChildLayer(this.setForm);
				if (res.code == 200) {
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
			row.CHILDID = row.CHILDID;
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
						id: row.PID
					};
					const res = await delChildLayer(params);
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
.el-select {
	width: 100%;
}
</style>