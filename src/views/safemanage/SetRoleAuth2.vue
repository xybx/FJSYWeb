<!--
 * @Author: ssq
 * @Date: 2022-11-04 10:53:11
 * @LastEditors: ssq
 * @LastEditTime: 2022-12-26 09:48:35
 * @FilePath: \fjsy-web\src\views\safemanage\SetRoleAuth2.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by hydp, All Rights Reserved. 
-->
<template>
    <div class="topPadding">
        <div class="container">
            <div class="top-radio">
                <div>
                    <span class="curr-role">当前角色：{{ $route.query.name }}</span>
                </div>
            </div>
        
            <el-tabs v-model="type" @tab-click="handleClick">
                <el-tab-pane label="运维权限" name="rule">
                </el-tab-pane>
                <el-tab-pane label="访问权限" name="show">
                </el-tab-pane>
                <el-tab-pane label="图层权限" name="layer">
                </el-tab-pane>
            </el-tabs>
        
            <div class="main" v-if="type == 'rule'">
                <el-tree  ref="ruleTree" :data="treeData" show-checkbox node-key="pid" 
                    :props="defaultProps" @check="currentCheck">
                </el-tree>
        
                <div>
                    <el-button type="primary" style="margin-left: 150px;" icon="el-icon-plus" class="handle-del mr10"
                        @click="editPopedom">保存</el-button>
                </div>
            </div>

            <div class="main" v-if="type == 'show'">
                <el-tree ref="showTree" :data="showTreeData" show-checkbox node-key="pid" 
                    :props="defaultProps" @check="showCurrentCheck">
                </el-tree>
                        
                <div>
                    <el-button type="primary" style="margin-left: 150px;" icon="el-icon-plus" class="handle-del mr10"
                        @click="editPopedom">保存</el-button>
                </div>
            </div>
<!-- :check-strictly="true" :default-checked-keys="tucengDefaultCheckedKeys" -->
            <div class="main" v-if="type == 'layer'">
                <el-tree ref="tucengTree" :data="tucengTreeData" show-checkbox node-key="pid"   :props="tucengDefaultProps"
                    @check="tucengCurrentCheck">
                </el-tree>
                
                <div>
                    <el-button type="primary" style="margin-left: 150px;" icon="el-icon-plus" class="handle-del mr10"
                        @click="tucengEditPopedom">保存</el-button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import {
    getPopedomTree, getPopedomByRule, editPopedomByRule,
    tucengGetPopedomTree, tucengGetPopedomByRule, tucengEditPopedomByRule
} from '@/api/safeadmin/role-api';
export default {
    data() {
        return {
            type: 'rule',
            treeData: [],
            defaultProps: {
                children: 'childList',
                label: 'name'
            },
            defaultCheckedKeys: [],
            checkedIds: [],

            tucengTreeData: [],
            tucengDefaultProps: {
                children: 'childList',
                label: 'name'
            },
            tucengDefaultCheckedKeys: [],
            tucengCheckedIds: [],

            showTreeData: [],
            showCheckedIds: [],
        };
    },
    mounted() { 
        this.ruleInit();
    },
    methods: { 
        handleClick() { 
            if (this.type == 'layer') {
                this.tucengInit();
            } else {
                this.ruleInit();
            }
        },
        ruleInit() {

            let requireType = {
                type: 0
            }
            // 获取当前权限树形结构
            getPopedomTree(requireType).then(res => {
                if (res.code == 200) {
                        this.treeData = res.data
                        let param = {
                ruleId: this.$route.query.id
            };
            // 获取当前角色拥有的权限
            getPopedomByRule(param).then(res => {
                if (res.code == 200) {
                    // this.defaultCheckedKeys = res.data;

                    let _this = this;
                    res.data.forEach(element => {
                        this.$nextTick(() => { 
                            let node = _this.$refs.ruleTree.getNode(element);
                            if (node.isLeaf) {
                                _this.$refs.ruleTree.setChecked(node, true);
                            }
                        })
                    });

                    this.checkedIds = res.data;
                    console.log("存储信息", this.defaultCheckedKeys)
                } else {
                    this.$message.error("获取当前角色权限失败，请刷新后重试！")
                }
            })
                } else {
                    this.$message.error(res.msg);
                    return;
                }
            })

            requireType.type = 2;
            // 获取当前权限树形结构
            getPopedomTree(requireType).then(res => {
                if (res.code == 200) {
                    this.showTreeData = res.data;
                    let param = {
                ruleId: this.$route.query.id
            };
            // 获取当前角色拥有的权限
            getPopedomByRule(param).then(res => {
                if (res.code == 200) {
                    // this.defaultCheckedKeys = res.data;

                    let _this = this;
                    res.data.forEach(element => {
                        this.$nextTick(() => { 
                            let node2 = _this.$refs.showTree.getNode(element);
                            if (node2.isLeaf) {
                                _this.$refs.showTree.setChecked(node2, true);
                            }
                        })
                    });

                    this.checkedIds = res.data;
                    console.log("存储信息", this.defaultCheckedKeys)
                } else {
                    this.$message.error("获取当前角色权限失败，请刷新后重试！")
                }
            })
                } else {
                    this.$message.error(res.msg);
                    return;
                }
            })
            
        },
        tucengInit() { 
            // 获取当前权限树形结构
            tucengGetPopedomTree().then(res => {
                if (res.code == 200) {
                    this.tucengTreeData = res.data;
                    let param = {
                ruleId: this.$route.query.id
            };
            // 获取当前角色拥有的权限
            tucengGetPopedomByRule(param).then(res => {
                if (res.code == 200) {
                    let _this = this;
                    res.data.forEach(element => {
                        let node = _this.$refs.tucengTree.getNode(element);
                        if (node.isLeaf) {
                            _this.$refs.tucengTree.setChecked(node, true);
                        }
                    });
                    // this.tucengDefaultCheckedKeys = res.data;
                    this.tucengCheckedIds = res.data;
                    console.log("图层存储信息", this.tucengDefaultCheckedKeys)
                } else {
                    this.$message.error("获取当前角色权限失败，请刷新后重试！")
                }
            })
                } else {
                    this.$message.error(res.msg);
                    return;
                }
            })
            
        },
        init() {

        },
        currentCheck(nodeObj, selectObj) { 
            this.checkedIds = selectObj.checkedKeys;
        },
        tucengCurrentCheck(nodeObj, selectObj) {
            this.tucengCheckedIds = selectObj.checkedKeys;
        },
       
        showCurrentCheck(nodeObj, selectObj) {
            this.showCheckedIds = selectObj.checkedKeys;
            console.log("当前选中的ids", this.showCheckedIds)
        },
        editPopedom() {
            let params = {
                rulePid: this.$route.query.id,
                
            }
            if (this.type == 'rule') {
                // 权限菜单
                params.type = 0;
                params.popedomIds = this.$refs.ruleTree.getCheckedKeys().concat(this.$refs.ruleTree.getHalfCheckedKeys());
            } else if (this.type == 'show') { 
                // 展示端权限
                params.type = 2;
                params.popedomIds = this.$refs.showTree.getCheckedKeys().concat(this.$refs.showTree.getHalfCheckedKeys());
            }
            editPopedomByRule(params).then(res => { 
                if (res.code == 200) {
                    this.$message.success("修改成功");
                    this.defaultCheckedKeys = [];
                    // this.init();
                } else { 
                    this.$message.error(res.msg);
                }
            })
        },
        tucengEditPopedom() {
            let params = {
                rulePid: this.$route.query.id,
                popedomIds: this.$refs.tucengTree.getCheckedKeys().concat(this.$refs.tucengTree.getHalfCheckedKeys())
            }
            tucengEditPopedomByRule(params).then(res => {
                if (res.code == 200) {
                    this.$message.success("修改成功");
                    
                } else {
                    this.$message.error(res.msg);
                }
            })
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