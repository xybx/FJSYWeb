<!--
 * @Author: WCL
 * @Date: 2022-03-02 09:24:39
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-21 16:44:50
 * @FilePath: \admin-service\src\views\safemanage\SetRoleAuth.vue
 * @Description: 
-->
<template>
	<div class="container">
		<div class="top-radio">
			<div>
				<span class="curr-role">当前角色：{{ $route.query.name }}</span>
				<el-popover
					placement="right"
					trigger="click"
					popper-class="role-popover"
					@show="showCascader"
					@hide="hideCascader"
					ref="popper"
				>
					<el-cascader :options="options" :props="notProps" collapse-tags clearable v-model="notRoleOptions"></el-cascader>
					<el-button type="primary" style="margin-left: 10px" @click="confirmRoles">确定</el-button>
					<el-button slot="reference" type="success">权限设置</el-button>
				</el-popover>
			</div>

			<!-- <el-radio-group v-model="radioTab" @change="radioTabClick">
				<el-radio-button label="1">运维权限</el-radio-button>
				<el-radio-button label="2">一张图权限</el-radio-button>
			</el-radio-group> -->
		</div>
		<div class="main">
			<el-tabs tab-position="left" v-if="radioTab == 2" v-model="onemapTab" @tab-click="onemapTabClick">
				<el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
			</el-tabs>
			<div class="table-box">
				<el-table :data="tableData" ref="tableData" row-key="SEQTYPE" :tree-props="{ children: 'CHILDREN' }" border stripe>
					<el-table-column
						v-for="(item, index) in tableCols"
						:key="index"
						:prop="item.prop"
						:label="item.label"
						:width="item.width ? item.width : ''"
						align="center"
					></el-table-column>
					<el-table-column label="操作">
						<template v-slot="scope">
							<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
import {
	getYWList,
	getOnemapModule,
	getOnemapWebGIS,
	getOnemapHX,
	getOnemapCond,
	getOnemapLocate,
	getOnemapFXPJ,
	getOnemapHGSC,
	saveYWList,
	delYWList,
	saveOnemap,
	saveOnemapModule,
	delOnemapModule,
	delOnemap,
	saveOnemapLocate,
	delOnemapLocate
} from '@/api/safeadmin/role-api';
import roleJSON from '@/assets/json/role.json';
export default {
	name: '',
	props: {},
	components: {},
	data() {
		return {
			tabList: [
				{ label: '系统菜单', name: '1' },
				{ label: '地图服务', name: '2' },
				{ label: '红线下载', name: '3' },
				{ label: '条件查询', name: '4' },
				{ label: '合规审查', name: '5' },
				// { label: '项目核查', name: '6' },
				// { label: '监测预警', name: '7' },
				{ label: '分析评价', name: '8' },
				{ label: '查询定位', name: '9' }
			],
			onemapTab: '1',
			radioTab: '2',
			tableData: [],
			notProps: {},
			options: [],
			tableCols: [],
			rowKey: '',
			notRoleOptions: []
		};
	},
	computed: {},
	watch: {
		radioTab: {
			handler(val) {
				if (val == 1) {
					this.tableCols = roleJSON.yw;
				} else if (val == 2) {
					this.switchOnemapTab(this.onemapTab);
				}
			},
			immediate: true
		}
	},
	created() {},
	mounted() {
		this.getYWMenu();
	},
	methods: {
		// 获取运维菜单
		async getYWMenu() {
			let params = {
				ruleid: this.$route.query.id,
				type: 1
			};
			const res = await getYWList(params);
			if (res.code === 1) {
				this.getSEQType(res.data);
				this.tableData = res.data;
			}
		},

		changeSwitch(val) {
			console.log(val);
		},

		changeInput(row) {
			console.log(row);
		},

		// 运维/一张图 tab切换
		radioTabClick(tab) {
			if (tab == 1) {
				this.getYWMenu();
			} else if (tab == 2) {
				console.log('切换到一张图');
				this.switchOnemapTab(this.onemapTab);
			}
		},

		// 一张图标签页切换
		onemapTabClick(tab) {
			this.switchOnemapTab(tab.name);
		},

		async switchOnemapTab(val) {
			let form = {
				ruleid: this.$route.query.id,
				type: 1
			};
			if (val == 1) {
				this.tableCols = roleJSON.xtcd;
				const res = await getOnemapModule(form);
				if (res.code === 1) {
					this.getSEQType(res.data);
					this.tableData = res.data;
				}
			} else if (val == 2) {
				this.tableCols = roleJSON.dtfw;
				const res = await getOnemapWebGIS(form);
				if (res.code === 1) {
					this.getSEQType(res.data);
					this.tableData = res.data;
				}
			} else if (val == 3) {
				this.tableCols = roleJSON.hxxz;
				const res = await getOnemapHX(form);
				if (res.code === 1) {
					this.getSEQType(res.data);
					this.tableData = res.data;
				}
			} else if (val == 4) {
				this.tableCols = roleJSON.tjcx;
				const res = await getOnemapCond(form);
				if (res.code === 1) {
					this.getSEQType(res.data);
					this.tableData = res.data;
				}
			} else if (val == 5) {
				this.tableCols = roleJSON.hgsc;
				const res = await getOnemapHGSC(form);
				if (res.code === 1) {
					this.getSEQType(res.data);
					this.tableData = res.data;
				}
			} else if (val == 8) {
				this.tableCols = roleJSON.fxpj;
				const res = await getOnemapFXPJ(form);
				if (res.code === 1) {
					this.getSEQType(res.data);
					this.tableData = res.data;
				}
			} else if (val == 9) {
				this.tableCols = roleJSON.cxdw;
				const res = await getOnemapLocate(form);
				if (res.code === 1) {
					this.getSEQType(res.data);
					this.tableData = res.data;
				}
			} else {
				this.tableData = [];
			}
		},

		// 递归
		getSEQType(arr, typeIndex = 1) {
			arr.map((item, index) => {
				this.$set(item, 'SEQTYPE', `${typeIndex}-${index}`);
				if (!!item.CHILDREN) {
					this.getSEQType(item.CHILDREN, `${item.SEQTYPE}-${index}`);
				}
			});
		},

		async showCascader() {
			if (this.radioTab == 1) {
				this.getYWNotMenu();
			} else {
				let form = {
					ruleid: this.$route.query.id,
					type: 0
				};
				// 系统菜单
				if (this.onemapTab == 1) {
					this.tableCols = roleJSON.xtcd;
					const res = await getOnemapModule(form);
					if (res.code === 1) {
						this.notProps = {
							multiple: true,
							expandTrigger: 'hover',
							label: 'TITLE',
							value: 'TITLE',
							children: 'CHILDREN'
						};
						this.options = res.data;
					}
				}
				// 地图服务
				else if (this.onemapTab == 2) {
					this.tableCols = roleJSON.dtfw;
					const res = await getOnemapWebGIS(form);
					if (res.code === 1) {
						this.notProps = {
							multiple: true,
							expandTrigger: 'hover',
							label: 'NAME',
							value: 'SEQID',
							children: 'CHILDREN'
						};
						this.options = res.data;
					}
				}
				// 红线下载
				else if (this.onemapTab == 3) {
					this.tableCols = roleJSON.hxxz;
					const res = await getOnemapHX(form);
					if (res.code === 1) {
						this.notProps = {
							multiple: true,
							expandTrigger: 'hover',
							label: 'SERVERNAME',
							value: 'PID',
							children: 'CHILDREN'
						};
						this.options = res.data;
					}
				}
				// 条件查询
				else if (this.onemapTab == 4) {
					this.tableCols = roleJSON.tjcx;
					const res = await getOnemapCond(form);
					if (res.code === 1) {
						this.notProps = {
							multiple: true,
							expandTrigger: 'hover',
							label: 'NAME',
							value: 'PID',
							children: 'CHILDREN'
						};
						this.options = res.data;
					}
				}
				// 合规审查
				else if (this.onemapTab == 5) {
					this.tableCols = roleJSON.hgsc;
					const res = await getOnemapHGSC(form);
					if (res.code === 1) {
						this.notProps = {
							multiple: true,
							expandTrigger: 'hover',
							label: 'LAYERNAME',
							value: 'ID',
							children: 'CHILDREN'
						};
						this.options = res.data;
					}
				}
				// 分析评价
				else if (this.onemapTab == 8) {
					this.tableCols = roleJSON.fxpj;
					const res = await getOnemapFXPJ(form);
					if (res.code === 1) {
						this.notProps = {
							multiple: true,
							expandTrigger: 'hover',
							label: 'NAME',
							value: 'PID',
							children: 'CHILDREN'
						};
						this.options = res.data;
					}
				}
				// 查询定位
				else if (this.onemapTab == 9) {
					this.tableCols = roleJSON.cxdw;
					const res = await getOnemapLocate(form);
					if (res.code === 1) {
						this.notProps = {
							multiple: true,
							expandTrigger: 'hover',
							label: 'LAYERNAME',
							value: 'ID',
							children: 'CHILDREN'
						};
						this.options = res.data;
					}
				} else {
					this.options = [];
				}
			}
		},

		hideCascader() {
			this.notRoleOptions = [];
		},

		// 获取运维未授权菜单
		async getYWNotMenu() {
			let params = {
				ruleid: this.$route.query.id,
				type: 0
			};
			const res = await getYWList(params);
			if (res.code === 1) {
				this.options = res.data;
				this.notProps = {
					multiple: true,
					expandTrigger: 'hover',
					label: 'TITLE',
					value: 'CODE',
					children: 'CHILDREN'
				};
			}
		},

		// 权限删除
		async handleDelete(row) {
			console.log(row);
			// 运维
			if (this.radioTab == 1) {
				let params = {
					ruleid: this.$route.query.id,
					modulecode: row.CODE
				};
				const res = await delYWList(params);
				if (res.code === 1) {
					this.$message.success('删除成功！');
					this.getYWMenu();
				}
			} else {
				// 系统菜单
				if (this.onemapTab == 1) {
					debugger;
					let params = {
						ruleid: this.$route.query.id,
						moduleid: row.ID,
						level: row.MLEVEL
					};
					console.log(params,"params");
					const res =await delOnemapModule(params);
					console.log(res,"res");
					if (res.code === 1) {
						this.$message.success('删除成功！');
						this.switchOnemapTab(this.onemapTab);
					}
				}
				// 地图服务
				else if (this.onemapTab == 2) {
					let params = {
						ruleid: this.$route.query.id,
						layerid: row.PID,
						type: 1,
						level: row.LEVEL
					};
					const res = await delOnemap(params);
					if (res.code === 1) {
						this.$message.success('删除成功！');
						this.switchOnemapTab(this.onemapTab);
					}
				}
				// 红线下载
				else if (this.onemapTab == 3) {
					let params = {
						ruleid: this.$route.query.id,
						layerid: row.PID,
						type: 2,
						level: 0
					};
					const res = await delOnemap(params);
					if (res.code === 1) {
						this.$message.success('删除成功！');
						this.switchOnemapTab(this.onemapTab);
					}
				}
				// 条件查询
				else if (this.onemapTab == 4) {
					let params = {
						ruleid: this.$route.query.id,
						layerid: row.PID,
						type: 5,
						level: row.LEVEL
					};
					const res = await delOnemap(params);
					if (res.code === 1) {
						this.$message.success('删除成功！');
						this.switchOnemapTab(this.onemapTab);
					}
				}
				// 合规审查
				else if (this.onemapTab == 5) {
					let params = {
						ruleid: this.$route.query.id,
						layerid: row.ID,
						type: 3,
						level: 0
					};
					const res = await delOnemap(params);
					if (res.code === 1) {
						this.$message.success('删除成功！');
						this.switchOnemapTab(this.onemapTab);
					}
				}
				// 分析评价
				else if (this.onemapTab == 8) {
					let params = {
						ruleid: this.$route.query.id,
						layerid: row.PID,
						type: 4,
						level: row.LEVEL
					};
					const res = await delOnemap(params);
					if (res.code === 1) {
						this.$message.success('删除成功！');
						this.switchOnemapTab(this.onemapTab);
					}
				}
				// 查询定位
				else if (this.onemapTab == 9) {
					let params = {
						pid: row.ID
					};
					const res = await delOnemapLocate(params);
					if (res.code === 1) {
						this.$message.success('删除成功！');
						this.switchOnemapTab(this.onemapTab);
					}
				}
			}
		},

		// 确定修改
		async confirmRoles() {
			console.log(this.notRoleOptions.length);
			if (this.notRoleOptions.length == 0) {
				this.$message.warning('暂无修改')
			} else {
				if (this.radioTab == 1) {
					const form = {
						ruleid: this.$route.query.id,
						modulecode: [...new Set(this.notRoleOptions.flat(Infinity))]
					};
					debugger;
					const res = await saveYWList(form);
					if (res.code === 1) {
						this.$message.success('修改成功');
						this.getYWMenu();
					}
				} else {
					// 系统菜单
					if (this.onemapTab == 1) {
						let formModule = [];
						let newArr = [...new Set(this.notRoleOptions.flat(Infinity))];
						let moreArr = this.flatten(this.options);
						moreArr.map((item) => {
							newArr.filter((newItem) => {
								if (newItem == item.TITLE) {
									formModule.push({ moduleid: item.ID, level: item.MLEVEL });
								}
							});
						});
						let form = {
							ruleid: this.$route.query.id,
							modules: formModule
						};
						const res = await saveOnemapModule(form);
						if (res.code === 1) {
							this.$message.success('修改成功');
							this.switchOnemapTab(this.onemapTab);
						}
					}
					// 地图服务
					else if (this.onemapTab == 2) {
						let formModule = [];
						let newArr = [...new Set(this.notRoleOptions.flat(Infinity))];
						let moreArr = this.flatten(this.options);

						moreArr.map((item) => {
							if (item.LEVELTYPE == 'server') {
								newArr.map((newItem) => {
									if (newItem == item.SEQID) {
										console.log(item);
										formModule.push(item.PID);
									}
								});
							}
						});
						let form = {
							type: 1,
							ruleid: this.$route.query.id,
							layerids: formModule
						};
						const res = await saveOnemap(form);
						if (res.code === 1) {
							this.$message.success('修改成功');
							this.switchOnemapTab(this.onemapTab);
						}
					}
					// 红线下载
					else if (this.onemapTab == 3) {
						let form = {
							type: 2,
							ruleid: this.$route.query.id,
							layerids: [...new Set(this.notRoleOptions.flat(Infinity))]
						};
						const res = await saveOnemap(form);
						if (res.code === 1) {
							this.$message.success('修改成功');
							this.switchOnemapTab(this.onemapTab);
						}
					}
					// 条件查询
					else if (this.onemapTab == 4) {
						console.log(this.notRoleOptions);
						this.notRoleOptions.map((item) => {
							item.splice(0, 1);
						});

						let form = {
							type: 5,
							ruleid: this.$route.query.id,
							layerids: this.notRoleOptions.flat(Infinity)
						};
						const res = await saveOnemap(form);
						if (res.code === 1) {
							this.$message.success('修改成功');
							this.switchOnemapTab(this.onemapTab);
						}
						this.$refs.popper.showPopover = false;
					}
					// 合规审查
					else if (this.onemapTab == 5) {
						let form = {
							type: 3,
							ruleid: this.$route.query.id,
							layerids: [...new Set(this.notRoleOptions.flat(Infinity))]
						};
						const res = await saveOnemap(form);
						if (res.code === 1) {
							this.$message.success('修改成功');
							this.switchOnemapTab(this.onemapTab);
						}
					}
					// 分析评价
					else if (this.onemapTab == 8) {
						let form = {
							type: 4,
							ruleid: this.$route.query.id,
							layerids: [...new Set(this.notRoleOptions.flat(Infinity))]
						};
						const res = await saveOnemap(form);
						if (res.code === 1) {
							this.$message.success('修改成功');
							this.switchOnemapTab(this.onemapTab);
						}
					}
					// 查询定位
					else if (this.onemapTab == 9) {
						let formModule = [];
						let newArr = [...new Set(this.notRoleOptions.flat(Infinity))];
						let moreArr = this.flatten(this.options);
						moreArr.map((item) => {
							newArr.filter((newItem) => {
								if (newItem == item.ID) {
									formModule.push({
										ID: item.ID,
										URL: item.URL,
										RULEID: this.$route.query.id,
										LAYERNAME: item.LAYERNAME
									});
								}
							});
						});

						let form = {
							ruleid: this.$route.query.id,
							urls: formModule
						};
						const res = await saveOnemapLocate(form);
						if (res.code === 1) {
							this.$message.success('修改成功');
							this.switchOnemapTab(this.onemapTab);
						}
					}
				}
			}

			this.$refs.popper.doClose();
		},

		// 多维数组对象转化为一维
		flatten(arr) {
			return [].concat(
				...arr.map((item) => {
					if (item.CHILDREN) {
						let arr = [].concat(item, ...this.flatten(item.CHILDREN));
						delete item.CHILDREN;
						return arr;
					}
					return [].concat(item);
				})
			);
		}
	}
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/common.scss';
.container {
	display: flex;
	flex-direction: column;
	min-height: 81vh;
	.top-radio {
		margin-bottom: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.el-radio-group {
			margin-right: 20px;
		}
		.curr-role {
			font-size: 16px;
			font-weight: 700;
			color: rgba($color: #324157, $alpha: 0.8);
		}
	}
	.main {
		flex: 1;
		display: flex;
		.table-box {
			flex: 1;
			width: 200px;
		}
	}
	.curr-role {
		margin-right: 6px;
	}
}
</style>