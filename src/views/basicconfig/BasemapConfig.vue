<!--
 * @Author: WCL
 * @Date: 2022-02-09 10:15:49
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-22 16:12:44
 * @FilePath: \fjsy-web\src\views\basicconfig\BasemapConfig.vue
 * @Description: 底图配置
-->
<template>
	<div class="container">
		<!-- 顶部表单 -->
		<div class="handle-box">
			<el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType">新增</el-button>
			<el-button type="primary" icon="el-icon-search" @click="handleSearch" class="fr">搜索</el-button>
			<el-input v-model="queryname" placeholder="名称关键字" class="handle-input fr"></el-input>
		</div>

		<el-table style="font-size:15px" :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="PID" label="ID" width="55" align="center"></el-table-column>
			<el-table-column prop="MODULENAME" label="底图名称" align="center"> </el-table-column>
			<el-table-column prop="MODULETYPE" label="底图类型" align="center"> </el-table-column>
			<el-table-column prop="URL" label="地址" min-width="250" align="center"></el-table-column>
			<el-table-column prop="TYPE" label="类型" align="center"> </el-table-column>
			<el-table-column prop="MAPWKID" label="WKID"align="center"> </el-table-column>
			<el-table-column prop="XMIN" label="XMIN" align="center"> </el-table-column>
			<el-table-column prop="YMIN" label="YMIN" align="center"> </el-table-column>
			<el-table-column prop="XMAX" label="XMAX" align="center"> </el-table-column>
			<el-table-column prop="YMAX" label="YMAX" align="center"> </el-table-column>
			<el-table-column prop="SERVERURL" label="比例尺" align="center">
				<!-- <template v-slot="scope">
					<div v-if="scope.row.SERVERURL">
						<div v-for="(item, index) in scope.row.SERVERURL.split(',')" :key="index">{{ item }},</div>
					</div>
				</template> -->
			</el-table-column>
			<el-table-column prop="PROXYURL" label="跨域代理地址" align="center"> </el-table-column>
			<el-table-column prop="CENTERX" label="中心坐标X点" align="center"> </el-table-column>
			<el-table-column prop="CENTERY" label="中心坐标Y点" align="center"> </el-table-column>

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
			width="30%"
			custom-class="set-dialog"
			@close="closedSetDialog"
			:close-on-click-modal="false"
		>
			<el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
				<el-form-item label="地址" prop="URL">
					<el-input v-model.trim="setForm.URL" placeholder="请输入url地址"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="TYPE">
					<el-select v-model="setForm.TYPE" placeholder="请选择类型">
						<el-option
							v-for="(item, index) in typeList"
							:key="index"
							:label="item.DICTNAME"
							:value="item.DICTVALUE"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="坐标系WKID" prop="MAPWKID">
					<el-input v-model.trim="setForm.MAPWKID" placeholder="请输入坐标系WKID"></el-input>
				</el-form-item>
				<el-form-item label="XMIN" prop="XMIN">
					<el-input v-model.trim="setForm.XMIN" placeholder="请输入XMIN"></el-input>
				</el-form-item>
				<el-form-item label="YMIN" prop="YMIN">
					<el-input v-model.trim="setForm.YMIN" placeholder="请输入YMIN"></el-input>
				</el-form-item>
				<el-form-item label="XMAX" prop="XMAX">
					<el-input v-model.trim="setForm.XMAX" placeholder="请输入XMAX"></el-input>
				</el-form-item>
				<el-form-item label="YMAX" prop="YMAX">
					<el-input v-model.trim="setForm.YMAX" placeholder="请输入YMAX"></el-input>
				</el-form-item>
				<el-form-item label="比例尺" prop="SERVERURL">
					<el-input v-model.trim="setForm.SERVERURL" placeholder="请输入比例尺"></el-input>
				</el-form-item>
				<el-form-item label="跨域代理地址" prop="PROXYURL">
					<el-input v-model.trim="setForm.PROXYURL" placeholder="请输入跨域代理地址"></el-input>
				</el-form-item>
        <el-form-item label="底图类型" prop="MODULETYPE">
          <el-select v-model="setForm.MODULETYPE" placeholder="请选择底图类型">
            <el-option
                v-for="(item, index) in moduleTypeList"
                :key="index"
                :label="item.name"
                :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="底图名称" prop="MODULENAME">
					<el-input v-model.trim="setForm.MODULENAME" placeholder="请输入底图名称"></el-input>
				</el-form-item>
				<el-form-item label="中心坐标X点" prop="CENTERX">
					<el-input v-model.trim="setForm.CENTERX" placeholder="请输入中心坐标X点"></el-input>
				</el-form-item>
				<el-form-item label="中心坐标Y点" prop="CENTERY">
					<el-input v-model.trim="setForm.CENTERY" placeholder="请输入中心坐标Y点"></el-input>
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
import { getList, saveBaseMap, delBaseMap, getType, getModuleTypeList } from '@/api/basemapconfig-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			queryname: '',
			tableData: [],
			currentPage: 1,
			pageSize: 10,
			pageTotal: 0,
			setForm: {
				PID: 0,
				URL: '',
				TYPE: '',
				MAPWKID: '',
				XMIN: '',
				YMIN: '',
				XMAX: '',
				YMAX: '',
				SERVERURL: '',
				PROXYURL: '',
				MODULENAME: '',
        MODULETYPE: '',
				CENTERX: '',
				CENTERY: ''
			},
			setFormRules: {
				TYPE: [{ required: true, message: '类型不能为空', trigger: 'change' }],
				MAPWKID: [{ required: true, message: '坐标系WKID不能为空', trigger: 'blur' }],
				XMIN: [{ required: true, message: 'XMIN不能为空', trigger: 'blur' }],
				YMIN: [{ required: true, message: 'YMIN不能为空', trigger: 'blur' }],
				XMAX: [{ required: true, message: 'XMAX不能为空', trigger: 'blur' }],
				YMAX: [{ required: true, message: 'YMAX不能为空', trigger: 'blur' }],
				SERVERURL: [{ required: true, message: '比例尺不能为空', trigger: 'blur' }],
				PROXYURL: [{ required: true, message: '跨域代理地址不能为空', trigger: 'blur' }],
				MODULETYPE: [{ required: true, message: '底图类型不能为空', trigger: 'change' }],
				MODULENAME: [{ required: true, message: '底图名称不能为空', trigger: 'blur' }],
				CENTERX: [{ required: true, message: '中心坐标X点不能为空', trigger: 'blur' }],
				CENTERY: [{ required: true, message: '中心坐标Y点不能为空', trigger: 'blur' }]
			},
			setTitle: '',
			setVisible: false,
			typeList: [
				{ label: 'Tile', value: 'Tile' },
				{ label: 'Image', value: 'Image' }
			],
      moduleTypeList: []
		};
	},
	computed: {},
	watch: {
		setVisible: {
			handler(boo) {
				if (boo) {
					this.getLayerType();
				}
			}
		}
	},
	created() {},
	mounted() {
		this.getData();
		this.initModuleTypeList();
	},
	methods: {
	  // 获取字典配置的底图类型
    initModuleTypeList() {
      getModuleTypeList({code: "module_type"}).then(res => {
        if (res.code == 200) {
          this.moduleTypeList = res.data;
        }
      })
    },
		// 获取图层类型
		async getLayerType() {
			const res = await getType();
			if (res.code === 200) {
				this.typeList = res.data;
			}
		},

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
				this.tableData = res.data.datas;
				this.pageTotal = res.data.total;
			}
		},

		// 弹窗确认
		saveAdd() {
			this.$refs.setForm.validate(async (valid) => {
				if (!valid) return this.$message.error('请补充必填项');
				console.log("添加", this.setForm)
				const res = await saveBaseMap(this.setForm);
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
						pid: row.PID
					};
					const res = await delBaseMap(params);
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