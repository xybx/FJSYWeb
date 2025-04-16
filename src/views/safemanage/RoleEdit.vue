<!--
 * @Author: LJX
 * @Date: 2022-04-21 16:00:29
 * @LastEditors: LJX
 * @LastEditTime: 2022-04-21 16:18:33
 * @FilePath: \admin-service\src\views\safemanage\RoleEdit.vue
 * @Description: 角色编辑、新增
-->

<template>
    <div class="container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">
                <el-form ref="setForm" :model="setForm" label-width="auto" class="set-form" :rules="setFormRules">
                    <el-form-item label="角色名称" prop="NAME">
                        <el-input v-model.trim="setForm.NAME" placeholder="请输入角色名称"></el-input>
                    </el-form-item>
                    <el-form-item label="标签" prop="TAG">
                        <el-input v-model.trim="setForm.TAG" placeholder="请输入角色标签"></el-input>
                    </el-form-item>
                    <el-form-item label="是否管理员" prop="ISADMIN">
                        <el-switch
                            v-model="setForm.ISADMIN"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="排序" prop="SERIAL">
                        <el-input v-model.number="setForm.SERIAL" placeholder="请输入排序" type="number" min="0"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="save">保 存</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="菜单权限配置" name="second">
                <el-tree
                    :data="data"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[2, 3]"
                    :default-checked-keys="[5]"
                    :props="defaultProps"
                >
                </el-tree>
            </el-tab-pane>
            <el-tab-pane label="数据权限配置" name="threed"> 
                <el-tree
                    :data="data"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[2, 3]"
                    :default-checked-keys="[5]"
                    :props="defaultProps"
                >
                </el-tree>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    data() {
        return {
              data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
            activeName: 'first',
            setForm: {
                PID: 0,
                NAME: '',
                TAG: '',
                SERIAL: '',
                ISADMIN: 0
            },
            setFormRules: {
                NAME: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
            }
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>
