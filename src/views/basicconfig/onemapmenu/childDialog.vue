<template>
    <div>
        <el-dialog title="添加" :visible.sync="isChildDialog" width="30%" :before-close="cancel" :close-on-click-modal="false">
            <el-form :model="menuInfo" ref="menu" label-width="100px">
                <el-form-item label="菜单级别">
                    <el-select placeholder="请选择菜单类型" v-model="childMenu">
                        <el-option label="二级菜单" :value="2"></el-option>
                        <el-option label="三级级菜单" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="TITLE">
                    <el-input v-model="menuInfo.TITLE"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="PATH">
                    <el-input v-model="menuInfo.PATH"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="ICON">
                    <el-input v-model="menuInfo.ICON"></el-input>
                </el-form-item>
                <el-form-item label="菜单编号" prop="CODE">
                    <el-input v-model="menuInfo.CODE"></el-input>
                </el-form-item>
                <el-form-item label="链接类型" prop="LINKTYPE">
                    <el-input v-model="menuInfo.LINKTYPE"></el-input>
                </el-form-item>
                <!-- <el-form-item label="状态" prop="STATUS" v-if="MLEVEL == ''">
                    <el-input v-model="childMenuInfo.STATUS"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addMenu">添加</el-button>
                <!-- <el-button type="primary" @click="saveMenu" v-else>保存</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { SaveModule } from '@/api/moduleonemap-api';
export default {
    props: ['isChildDialog'],
    data() {
        return {
            // isChildDialog:'',
            childMenu: '',
            menuInfo: {
                TITLE: '',
                PATH: '',
                ICON: '',
                CODE: '',
                LINKTYPE: ''
            }
        };
    },
    methods: {
        cancel() {},
        addMenu() {
            const params = {
                ID: 0,
                TITLE: 'string',
                PATH: 'string',
                PARENTID: 0,
                ICON: 'string',
                MODULEPID: 0,
                CODE: 'string',
                LINKTYPE: 0,
                STATUS: 0,
                ORDERNUM: 0,
                MLEVEL: 0
            };
            SaveModule(params).then(res=>{
                console.log(res);
            })

        }
    }
};
</script>

<style>
</style>