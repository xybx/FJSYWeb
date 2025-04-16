<!--
 * @Author: WCL
 * @Date: 2022-02-25 11:56:32
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-28 09:55:45
 * @FilePath: \admin-service\src\views\monitor\RegularAssess.vue
 * @Description: 实施监督 - 定期评估
-->
<template>
	<div class="container">
		<!-- 顶部表单 -->
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
		</div>

		<el-table
			:data="tableData"
			border
			class="table"
			ref="multipleTable"
			header-cell-class-name="table-header"
			row-key="PID"
			:tree-props="{ children: 'CHILDREN' }"
			stripe
		>
			<el-table-column prop="PID" label="ID" width="120" align="center"></el-table-column>
			<el-table-column prop="NAME" label="名称"></el-table-column>
			<el-table-column prop="STYLE" label="指标类型">
				<template v-slot="scope">
					<span v-if="scope.row.STYLE === 1">基本指标</span>
					<span v-else-if="scope.row.STYLE === 2">推荐指标</span>
				</template>
			</el-table-column>
			<el-table-column prop="ORDERNUM" label="排序" width="100" align="center"> </el-table-column>

			<el-table-column label="操作" align="center">
				<template v-slot="scope">
					<span>
						<el-button type="text" icon="el-icon-tickets" class="green" v-if="scope.row.CHILDREN==0 || !scope.row.CHILDREN" @click="handleList(scope.row)">编辑列表项</el-button>
					</span>
					
					<el-button type="text" icon="el-icon-edit"  @click="handleEdit(scope.row)" >编辑</el-button>
					<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)" >删除</el-button>
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
				<el-form-item label="指标名称" prop="NAME">
					<el-input v-model.trim="setForm.NAME" placeholder="请输入指标名称"></el-input>
				</el-form-item>
				<el-form-item label="指标层级" prop="LEVEL">
					<el-radio-group v-model="setForm.LEVEL">
						<el-radio :label="1">一级</el-radio>
						<el-radio :label="2">二级</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="一级列表" v-if="setForm.LEVEL == 2" prop="PARENTID">
					<el-select v-model="setForm.PARENTID" placeholder="请选择一级列表">
						<el-option v-for="(item, index) in tableData" :key="index" :label="item.NAME" :value="item.PID"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="指标类型" prop="STYLE">
					<el-radio-group v-model="setForm.STYLE">
						<el-radio :label="1">基本指标</el-radio>
						<el-radio :label="2">推荐指标</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="排序" prop="ORDERNUM">
					<el-input v-model.number="setForm.ORDERNUM" placeholder="请输入排序" type="number" min="0"></el-input>
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
import { getList, saveList, delList } from '@/api/monitor/regularassess-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			isAdmin: false,
			tableData: [],
			setForm: {
				NAME: '',
				PARENTID: null,
				STYLE: '',
				ORDERNUM: null,
				LEVEL: ''
			},
			setFormRules: {
				NAME: [{ required: true, message: '指标名称不能为空', trigger: 'blur' }],
				PARENTID: [{ required: true, message: '层级不能为空', trigger: 'change' }],
				STYLE: [{ required: true, message: '指标类型不能为空', trigger: 'change' }],
				LEVEL: [{ required: true, message: '层级不能为空', trigger: 'change' }],
				ORDERNUM: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
			},
			setTitle: '',
			setVisible: false,
			indexLevel: ''
		};
	},
	computed: {},
	watch: {
		'setForm.LEVEL': {
			handler(val) {
				if (val == 1 && this.setTitle == '新增') {
					this.setForm.PARENTID = 0;
				} else if (val != 1 && this.setTitle == '新增') {
					this.setForm.PARENTID = '';
				}
			}
		}
	},
	created() {},
	mounted() {
		//this.isAdmin = sessionStorage.getItem('isadmin');
		this.getData();
	},
	methods: {
		// 新增
		addType() {
			this.setTitle = '新增';
			this.setVisible = true;
			Object.assign(this.setForm, { PID: 0 });
		},

		// 获取列表数据
		async getData() {
			const res = await getList();
			if (res.code === 1) {
				
				this.tableData = res.data;
				console.log(this.tableData ,"tableData");
				console.log(this.tableData[0],"0")
			}
		},

		// 弹窗确认
		saveAdd() {
			this.$refs.setForm.validate(async (valid) => {
				if (!valid) return this.$message.error('请补充必填项');
				let { LEVEL, ...form } = this.setForm;

				const res = await saveList(form);
				if (res.code === 1) {
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
			if (this.setForm.PARENTID == 0) {
				Object.assign(this.setForm, { LEVEL: 1 });
			} else {
				Object.assign(this.setForm, { LEVEL: 2 });
			}
		},

		// 删除
		async handleDelete(row) {
			let params = {
				pid: row.PID
			};
			const res = await delList(params);
			if (res.code === 1) {
				this.$message.success('删除成功！');
				this.getData();
			}
		},

		// 编辑列表项
		handleList(row) {
			console.log(row);
			this.$router.push({
				path: '/assesslist',
				query: {
					typeid: row.PID
				}
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