<template>
	<div class="container">
		<!-- 顶部表单 -->
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType" v-if="isAdmin == 'true'">新增</el-button>
		</div>
		<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="SHOWFIELD" label="行政区级别" width="150"></el-table-column>
			<el-table-column prop="CITYURL" label="行政区图层服务地址"></el-table-column>
			<el-table-column prop="CITYFIELD" label="显示字段"></el-table-column>
			<el-table-column label="操作" width="180" align="center" v-if="isAdmin == 'true'">
				<template slot-scope="scope">
					<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="text" icon="el-icon-edit" class="red" @click="handleDelete(scope.row)">删除</el-button>
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
				<el-form-item label="行政区级别" prop="SHOWFIELD">
					<el-select @change="changexzqjb" v-model="setForm.SHOWFIELD" placeholder="请选择行政区级别">
						<el-option
							v-for="item in xzqjblist"
							:key="item.DICTVALUE"
							:label="item.DICTNAME"
							:value="item.DICTVALUE"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="图层服务地址" prop="CITYURL">
					<el-input v-model.number="setForm.CITYURL" placeholder="请输入图层服务地址"></el-input>
				</el-form-item>
				<el-form-item label="显示字段" prop="CITYFIELD">
					<el-input v-model.number="setForm.CITYFIELD" placeholder="请输入显示字段"></el-input>
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
import { getCityLayers, saveCityLayer, deleteCityLayer, getXZQJBList } from '@/api/onemap/city-api';
import { getWebGis } from '@/api/onemap/hxdownload-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			isAdmin: false,
			queryname: '',
			tableData: [],
			setVisible: false,
			setTitle: '',
			setForm: {
				ID: 0,
				CITYURL: '',
				CITYFIELD: '',
				PARENTID: 0,
				KEY_ID: '',
				KEY_NAME: '',
				SHOWFIELD: ''
			},
			setFormRules: {
				CITYURL: [{ required: true, message: '服务地址不能为空', trigger: 'blur' }],
				CITYFIELD: [{ required: true, message: '显示字段不能为空' ,trigger: 'blur'}],
				SHOWFIELD: [{ required: true, message: '请选择行政区级别', trigger: 'change' }]
			},
			webgisLayers: [],
			webgisLayerId: '',
			xzqjblist: []
		};
	},
	computed: {},
	watch: {
		setVisible(boo) {
			if (boo) {
				this.getxzqjblist();
			}
		}
	},
	created() {},
	mounted() {
		this.isAdmin = sessionStorage.getItem('isadmin');
		this.getData();
	},
	methods: {
		// 选择行政区劫镖
		changexzqjb(val) {
			let arr = this.xzqjblist.filter((item) => {
				return item.DICTVALUE === val;
			});
			this.setForm.SHOWFIELD = arr[0].DICTNAME;
			this.setForm.PARENTID = arr[0].DICTVALUE;
		},

		// 行政区界别列表
		async getxzqjblist() {
			const res = await getXZQJBList();
			if (res.code === 1) {
				this.xzqjblist = res.data;
			}
		},

		// 新增
		addType() {
			this.setTitle = '新增';
			this.setVisible = true;
		},

		// 获取列表数据
		async getData(from) {
			const res = await getCityLayers(from);
			if (res.code === 1) {
				this.tableData = res.data;
			}
		},

		// 弹窗确定
		saveAdd() {
			this.$refs.setForm.validate(async (valid) => {
				if (!valid) return this.$message.error('请补充必填项');
				const res = await saveCityLayer(this.setForm);
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
				id: row.ID
			};
			const res = await deleteCityLayer(params);
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
.el-select {
	width: 100%;
}
</style>
