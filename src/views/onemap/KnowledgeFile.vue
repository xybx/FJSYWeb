<!--
 * @Author: WCL
 * @Date: 2022-02-24 13:05:33
 * @LastEditors: LJX
 * @LastEditTime: 2022-03-30 16:14:31
 * @FilePath: \admin-service\src\views\onemap\KnowledgeFile.vue
 * @Description: 知识库-文件列表
-->
<template>
	<div class="container">
		<!-- 顶部表单 -->
		<div class="handle-box">
			<div class="upload-box">
				<el-upload
					ref="uploadMul"
					multiple
					action="#"
					:http-request="uploadFile"
					:auto-upload="false"
					:file-list="mulFileList"
					class="upload-mulimg-btn"
					accept=".txt,.xls,.xlsx,.pdf,.docx"
				>
					<el-button slot="trigger" size="small" type="warning" icon="el-icon-folder-opened">选择文件</el-button>
					<el-button style="margin-left: 10px" size="small" type="success" icon="el-icon-upload" @click="submitUpload"
						>批量上传</el-button
					>
				</el-upload>
			</div>

			<el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
			<el-input v-model="queryname" placeholder="请输入关键字" class="handle-input fr mr10"></el-input>
		</div>

		<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="PID" label="序号" width="80" align="center"></el-table-column>
			<el-table-column prop="FILENAME" label="文件名称"></el-table-column>
			<el-table-column prop="FILEPATH" label="文件路径"></el-table-column>
			<!-- <el-table-column prop="ORDERNUM" label="排序 "></el-table-column> -->
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
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
	</div>
</template>

<script>
import { getFileList, saveFile, delFile, uploadKnowFile } from '@/api/onemap/knowledge-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			queryname: '',
			tableData: [],
			setVisible: false,
			setTitle: '',
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,

			fileData: '',
			mulFileList: []
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

		// 搜索
		handleSearch() {
			let form = {
				keyword: this.queryname
			};
			this.currentPage = 1;
			this.getData(form);
		},

		// 分页点击
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
				typeid: this.$route.query.pid,
				currentpage: this.currentPage,
				pagesize: this.pageSize
			};
			if (form?.keyword) {
				Object.assign(params, form);
			}
			const res = await getFileList(params);
			if (res.code === 1) {
				this.tableData = res.data.datas;
				this.pageTotal = res.data.total;
			}
		},

		// 编辑
		// handleEdit(row) {},

		// 删除
		async handleDelete(row) {
			let params = {
				id: row.PID
			};
			const res = await delFile(params);
			if (res.code === 1) {
				this.$message.success('删除成功！');
				this.getData();
			}
		},

		// 文件上传
		uploadFile(params) {
			this.fileData.append('file', params.file);
		},

		async submitUpload() {
			this.fileData = new FormData();
			this.$refs.uploadMul.submit();
			this.fileData.append('filename', '');
			this.fileData.append('typeid', this.$route.query.pid);
			let hasFile = this.fileData.get('file');
			if (!Boolean(hasFile)) return this.$message.error('请先选择图片后再进行上传');
			const res = await uploadKnowFile(this.fileData);
			if (res.code === 1) {
				this.$message.success('上传成功');
				this.$refs.uploadMul.clearFiles();
				this.getData();
			} else {
				this.$message.error(res.msg);
				this.$refs.uploadMul.clearFiles();
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
.upload-box {
	display: inline-block;
}
::v-deep .upload-mulimg-btn {
	display: inline-block;
	position: relative;
	.el-upload-list {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		position: absolute;
		width: 100%;
		z-index: 99;
		margin-top: 10px;
		background-color: #fff;
		border-radius: 4px;
		.el-upload-list__item {
			margin: 5px 0 !important;
		}
	}
}
</style>