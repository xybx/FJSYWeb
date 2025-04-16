
<template>
	<div class="container">
		<!-- 顶部表单 -->
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType" v-if="isAdmin == 'true'">新增</el-button>
		</div>

		<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="PID" label="序号" width="80" align="center"></el-table-column>
			<el-table-column prop="GROUPNAME" label="分组名称" min-width="300" align="center"></el-table-column>
			<el-table-column prop="ORDERNUM" label="排序" max-width="100"></el-table-column>
			<el-table-column label="操作" max-width="280" align="center">
				<template slot-scope="scope">
					<el-button type="text" icon="el-icon-postcard" class="green" @click="handleChild(scope.row)">图层服务列表</el-button>
					<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" v-if="isAdmin == 'true'">编辑</el-button>
					<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)" v-if="isAdmin == 'true'"
						>删除</el-button
					>
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
				<el-form-item label="分组名称" prop="GROUPNAME">
					<el-input v-model="setForm.GROUPNAME"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="ORDERNUM">
					<el-input v-model="setForm.ORDERNUM" type="number" min="0"></el-input>
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
import { getGroupList, saveGroup, DeleteGroup } from '@/api/onemap/ledger-api';

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
				// ID: 0,
				// URL: '',
				// LAYERNAME: ''
                PID:0,
                GROUPNAME:'',
                ORDERNUM:'',
			},
			setFormRules: {
				GROUPNAME: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }],
				
			},

			webgisLayers: [],
			webgisLayerId: ''
		};
	},
	computed: {},
	watch: {
		setVisible(boo) {
			if (boo) {
				this.getWebGisData();
			}
		}
	},
	created() {},
	mounted() {
		this.isAdmin = sessionStorage.getItem('isadmin');
		this.getData();
        // getGroupList()
	},
	methods: {
		// 获取地图服务列表
		async getWebGisData() {
			// const res = await getWebGis();
			const res = await getGroupList();
			if (res.code === 1) {
				this.webgisLayers = res.data;
			}
		},
		// 选择地图服务
		changeWebGis(val) {
			let arr = this.webgisLayers.filter((item) => {
				return item.NAME === val;
			});
			this.setForm.LAYERNAME = arr[0].NAME;
			this.setForm.URL = arr[0].URL;
		},

		// 新增
		addType() {
			this.setTitle = '新增';
			this.setVisible = true;
		},

		// 获取列表数据
		async getData() {
			const res = await getGroupList();
			if (res.code === 1) {
				this.tableData = res.data.datalist;
			}
		},

		// 弹窗确定
		saveAdd() {
			this.$refs.setForm.validate(async (valid) => {
				if (!valid) return this.$message.error('请补充必填项');
				const res = await saveGroup(this.setForm);
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
			console.log(row);
			this.setTitle = '编辑';
			this.setVisible = true;
			Object.assign(this.setForm, row);
		},

		// 删除
		async handleDelete(row) {
			let params = {
				pid: row.PID
			};
			const res = await DeleteGroup(params);
			if (res.code === 1) {
				this.$message.success('删除成功！');
				this.getData();
			}
		},

		// 子图层
		handleChild(row) {
			console.log(row);
			this.$router.push({
				path: '/ledgerChild',
				query: {
					pid: row.PID
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
