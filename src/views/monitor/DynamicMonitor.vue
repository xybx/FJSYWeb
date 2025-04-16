<!--
 * @Author: WCL
 * @Date: 2022-02-25 09:53:47
 * @LastEditors: ssq
 * @LastEditTime: 2022-11-14 16:53:04
 * @FilePath: \fjsy-web\src\views\monitor\DynamicMonitor.vue
 * @Description: 实施监督-动态监测
-->
<template>
	<div class="container">
		<!-- 顶部表单 -->
		<div class="handle-box" v-if="isAdmin == 'true'">
			<!-- <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addType" :disabled="moreDisabled">新增</el-button> -->
			<span style="color:red;">注：此模块数据不提供新增，目前提供8项统计模块，如有不同请针对当前存在的数据做修改</span>
		</div>

		<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
			<el-table-column prop="PID" label="ID" width="55" align="center"></el-table-column>
			<el-table-column prop="MODULENAME" label="模块名称"></el-table-column>
			<el-table-column prop="LAYERURL" label="地图服务地址"> </el-table-column>
			<el-table-column prop="MAPTYPE" label="图层类型">
				<template v-slot="scope">
					<span v-if="scope.row.MAPTYPE === 'image'">动态服务</span>
					<span v-else-if="scope.row.MAPTYPE === 'tile'">静态服务</span>
				</template>
			</el-table-column>

			<el-table-column label="操作" width="180" align="center" v-if="isAdmin == 'true'">
				<template slot-scope="scope">
					<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="text" icon="el-icon-s-data" @click="handleTJ(scope.row)">统计数据查看</el-button>
					<!-- <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<!-- 新增/编辑弹窗 -->
		<el-dialog :title="setTitle" :visible.sync="setVisible" width="45%" custom-class="set-dialog" @close="closedSetDialog" :close-on-click-modal="false">
			<el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
				<el-form-item label="模块名称" prop="MODULENAME">
					<el-input v-model.trim="setForm.MODULENAME" placeholder="请输入模块名称"></el-input>
				</el-form-item>
				<el-form-item label="地图服务地址" prop="LAYERURL">
					<el-input v-model.trim="setForm.LAYERURL" placeholder="请输入地图服务地址"></el-input>
				</el-form-item>
				<el-form-item label="地图服务类型" prop="MAPTYPE">
					<el-radio-group v-model="setForm.MAPTYPE">
						<el-radio label="tile">静态服务</el-radio>
						<el-radio label="image">动态服务</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="setVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveAdd" v-if="isAdmin == 'true'">确 定</el-button>
			</span>
		</el-dialog>

        <!--统计图表数据导入/查看-->
		<el-dialog title="统计数据列表" :visible.sync="setTJVisible" width="45%" custom-class="set-dialog" :close-on-click-modal="false">
			<div class="import-box">
				<div class="import-title">
					<i class="el-icon-caret-right"></i>
					选择文件上传
					<div style="float:right;color:red;">
								注意事项：支持导入 .xls,.xlsx（<span
									class="link-template"
									@click="downTemplate"
									>图表统计数据模板下载</span
								>）文件
							</div>
				</div>
				<el-upload
					class="upload"
					ref="upload"
					action="action"
					:show-file-list="false"
					:http-request="handleUpload"
					accept=".xls,.xlsx"
				>
					<el-button slot="trigger" size="mini" type="success"
						>导入文件</el-button
					>
				</el-upload>
				<el-table :data="tjTableData" border stripe size="mini">
					<el-table-column prop="TJTYPE" label="统计依据项(基本单元)" align="center" v-if="currentModuleId==2">
					</el-table-column>
					<el-table-column prop="TJTYPE" label="统计依据项(行政区编号)" align="center" v-if="currentModuleId==3">
					</el-table-column>
					<el-table-column prop="TJTYPE" label="统计依据项(年份)" align="center" v-if="currentModuleId==1 || currentModuleId==5 || currentModuleId==6 || currentModuleId==7|| currentModuleId==8">
					</el-table-column>
					<el-table-column
						prop="ITEMNAME"
						label="统计项"
						align="center"
					>
					</el-table-column>
					<el-table-column
						prop="SONITEMNAME"
						label="二级统计项"
						align="center"
						v-if="currentModuleId==1"
					>
					</el-table-column>
					<el-table-column
						prop="VALUE"
						label="统计项值"
						align="center"
					>
					</el-table-column>
					<el-table-column
						prop="XZQNAME"
						label="行政区【行政区编号】"
						align="center"
					>
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
		</el-dialog>
	</div>
</template>

<script>
import { getModule, saveModule,getTJDataList,importData} from '@/api/monitor/dynamicmonitor-api';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			isAdmin: false,
			tableData: [],
			tjTableData:[],
			currentModuleId:0,//当前编辑的模块id
			setForm: {
				MODULENAME: '',
				LAYERURL: '',
				MAPTYPE: ''
			},
			setFormRules: {
				MODULENAME: [{ required: true, message: '模块名称不能为空', trigger: 'blur' }],
				LAYERURL: [{ required: true, message: '地图服务地址不能为空', trigger: 'blur' }],
				MAPTYPE: [{ required: true, message: '地图服务类型不能为空', trigger: 'change' }]
			},
			setTitle: '',
			setVisible: false,
			setTJVisible:false,
			 currentPage: 1,
            pageSize: 20,
            pageTotal: 0,
		};
	},
	computed: {
		moreDisabled() {
			return this.tableData.length >= 8 ? true : false;
		}
	},
	watch: {},
	created() {},
	mounted() {
		 this.isAdmin = sessionStorage.getItem('isadmin');
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
			const res = await getModule();
			if (res.code === 1) {
				this.tableData = res.data;
			}
		},

		// 获取列表数据
		async getTJData(mid) {
			debugger;
			const res = await getTJDataList({moduleid:mid,currentpage:this.currentPage,pagesize:this.pageSize});
			if (res.code === 1) {
				this.tjTableData = res.data.datalist;
				this.pageTotal=res.data.total;
			}
		},

		// 弹窗确认
		saveAdd() {
			this.$refs.setForm.validate(async (valid) => {
				if (!valid) return this.$message.error('请补充必填项');
				const res = await saveModule(this.setForm);
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
		},
 
        //统计数据弹框
		handleTJ(row) {
			debugger;
			console.log(row);
			this.setTJVisible = true;
			this.currentModuleId=row.PID;
			this.getTJData(row.PID);
			Object.assign(this.setForm, row);
		},
		  // 页面切换
        handlePageChange(val) {
            this.currentPage = val;
            this.getTJData(this.currentModuleId);
        },

		// 删除
		async handleDelete(row) {
			let params = {
				pid: row.PID
			};
			const res = await delServer(params);
			if (res.code === 1) {
				this.$message.success('删除成功！');
				this.getData();
			}
		},
		// 模板下载
        downTemplate() {
            // window.open(
            //     `${apiURL_file}/FileResources/JCYJ/Template/统计数据图表模板.xlsx`
            // );
			  window.location.href =
                apiURL_file +
                '/FileResources/JCYJ/Template/统计数据图表模板.xlsx';
        },


		  // 自定义上传事件
        async handleUpload(params) {
            let upLoading = this.$message({
                iconClass: 'el-icon-loading',
                message: '上传中...',
                duration: 0,
                customClass: 'prop-search',
            });
            let form = new FormData();
            form.append('file', params.file);
            form.append('moduleid', this.currentModuleId);
             const res = await importData(form);
			 console.log(res);
            if (res.code === 1) {
				debugger;
				upLoading.close();
				this.$message.success(res.msg);
				this.getTJData(this.currentModuleId);
			}
             else {
				 debugger;
				 upLoading.close();
                 this.$message.error(res.msg);
             }
        },
	}
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
@import '@/assets/scss/uploadfile.scss'
</style>