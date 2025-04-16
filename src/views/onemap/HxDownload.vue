<!--
 * @Author: WCL
 * @Date: 2022-02-11 09:12:15
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-28 14:44:03
 * @FilePath: \admin-service\src\views\onemap\HxDownload.vue
 * @Description: 统一平台 - 红线下载
-->
<template>
	<div class="container">
		<!-- 顶部表单 -->
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType" v-if="isAdmin == 'true'">新增</el-button>
			<el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
			<el-input v-model="queryname" placeholder="请输入地图服务关键字" class="handle-input fr"></el-input>
		</div>

		<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="ORDERNUM" label="序号" width="80" align="center"></el-table-column>
			<el-table-column prop="SERVERNAME" label="地图服务"></el-table-column>
			<el-table-column prop="FEATURENAME" label="要素表名称"></el-table-column>
			<el-table-column prop="LAYERNAME" label="子图层"></el-table-column>
			<el-table-column prop="SDEID" label="空间数据库ID"></el-table-column>
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
				<el-form-item label="地图服务" prop="SERVERNAME">
					<el-select v-model="setForm.WEBGIS_LAYERID" @change="changeWebGis" placeholder="请选择地图服务">
						<el-option v-for="item in webgisList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="下载图层" prop="LAYERNAME">
					<el-select v-model="setForm.LAYERNAME" no-data-text="请先选择地图服务" placeholder="请选择下载图层">
						<el-option v-for="item in layerList" :key="item.Id" :label="item.Name" :value="item.Name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="SDE数据库" prop="SDEID">
					<el-select v-model="setForm.SDEID" placeholder="请选择SDE库">
						<el-option v-for="item in sdeList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="要素表名称" prop="FEATURENAME">
					<el-input v-model.trim="setForm.FEATURENAME" placeholder="请输入要素表名称"></el-input>
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
import { getList, saveData, delData, getWebGis, SdeList, getServerLayers } from '@/api/onemap/hxdownload-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			isAdmin: false,
			queryname: '',
			tableData: [],
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			setVisible: false,
			setTitle: '',
			setForm: {
				PID: 0,
				WEBGIS_LAYERID: '',
				SERVERNAME: '',
				SDEID: '',
				LAYERNAME: '',
				FEATURENAME: '',
				ORDERNUM: null
			},
			setFormRules: {
				SERVERNAME: [{ required: true, message: '地图服务不能为空', trigger: 'change' }],
				LAYERNAME: [{ required: true, message: '下载图层不能为空', trigger: 'change' }],
				SDEID: [{ required: true, message: 'SDE数据库不能为空', trigger: 'change' }],
				FEATURENAME: [{ required: true, message: '要素表名称不能为空', trigger: 'blur' }]
			},
			webgisList: [],
			layerList: [],
			sdeList: []
		};
	},
	computed: {},
	watch: {
		setVisible(boo) {
			if (boo) {
				this.getWebGisData();
				this.getSdeList();
			}
		}
	},
	created() {},
	mounted() {
		this.isAdmin = sessionStorage.getItem('isadmin');
		this.getData();
	},
	methods: {
		// 获取地图服务列表
		async getWebGisData() {
			const res = await getWebGis();
			if (res.code === 1) {
				this.webgisList = res.data;
			}
		},

		// 选择地图服务
		changeWebGis(val) {
			let arr = this.webgisList.filter((item) => {
				return item.ID === val;
			});
			this.setForm.SERVERNAME = arr[0].NAME;
			this.getLayer(this.setForm.WEBGIS_LAYERID);
		},

		// 获取图层
		async getLayer(webgispid) {
			let params = {
				webgispid
			};
			const res = await getServerLayers(params);
			if (res.code === 1) {
				this.layerList = res.data;
			}
		},

		// 获取SDE库
		async getSdeList() {
			const res = await SdeList();
			if (res.code === 1) {
				this.sdeList = res.data;
			}
		},

		// 新增
		addType() {
			this.setTitle = '新增';
			this.setVisible = true;
		},

		// 页码切换
		handlePageChange(val) {
			this.currentPage = val;
			let form = {
				keywords: this.queryname
			};
			this.getData(form);
		},

		// 搜索
		handleSearch() {
			let form = {
				keywords: this.queryname
			};
			this.currentPage = 1;
			this.getData(form);
		},

		// 获取列表数据
		async getData(form) {
			let params = {
				keywords: '',
				currentpage: this.currentPage,
				pagesize: this.pageSize
			};
			if (form?.keywords) {
				Object.assign(params, form);
			}
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
				const res = await saveData(this.setForm);
				if (res.code == 1) {
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
				id: row.PID
			};
			const res = await delData(params);
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
