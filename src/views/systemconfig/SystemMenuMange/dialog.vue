<template>
    <div>
        <el-dialog :title="isAdd ? '新增' : '编辑'" :visible.sync="isShow" width="30%" :before-close="cancel" custom-class="set-dialog" 
        :close-on-click-modal="false">
            <el-form :model="menuInfo" ref="menu" label-width="100px">
                <!-- <el-form-item label="菜单级别" prop="ID" v-if="isAdd">
                    <el-select v-model="tier" placeholder="请选择菜单级别">
                        <el-option label="一级菜单" :value="0"></el-option>
                        <el-option label="子菜单" :value="1"></el-option>
                    </el-select>
                    <el-input v-model="menuInfo.ID"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="ID" prop="ID">
                    <el-input v-model="menuInfo.ID"></el-input>
                </el-form-item> -->
                <el-form-item label="模块标题" prop="TITLE">
                    <el-input v-model="menuInfo.TITLE"></el-input>
                </el-form-item>
                <el-form-item label="模块路径" prop="PATH">
                    <el-input v-model="menuInfo.PATH"></el-input>
                </el-form-item>
                <!-- <el-form-item label="图标" prop="ICON">
                   <el-upload
                        ref="upload"
                        multiple
                        action="#"
                        :show-file-list="false"
                        :http-request="uploadFile"
                        :file-list="uploadfilelist"
                        accept=".jpg,.png,"
                    >
                        <el-button size="samll" class="upload">{{fileNameList}}</el-button>
                    </el-upload>
                </el-form-item> -->
                <!-- <el-form-item label="菜单跳转类型" prop="LINKTYPE">
                    <el-select v-model="menuInfo.LINKTYPE">
                        <el-option label="没有动作" :value="0"></el-option>
                        <el-option label="路由" :value="1"></el-option>
                        <el-option label="弹窗" :value="2"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="模块唯一编码" prop="CODE">
                    <el-input v-model="menuInfo.CODE"></el-input>
                </el-form-item>
                <!-- <el-form-item label="菜单等级" prop="MODULELEVEL">
                    <el-input v-model="menuInfo.MODULELEVEL"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="上级菜单" prop="PARENTCODE" >
                    <el-input v-model="menuInfo.PARENTCODE"></el-input>
                </el-form-item> -->
                <el-form-item label="排序" prop="ORDERNUM">
                    <el-input v-model="menuInfo.ORDERNUM" type="number" min="0"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addMenu" v-if="isAdd">确定</el-button>
                <el-button type="primary" @click="saveMenu" v-else>保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import { SaveModuleParent, SaveModule } from '@/api/moduleonemap-api';
import { saveModule } from '@/api/systemmenu-api';
import { uploadfile } from '@/api/upload-api'
export default {
    props: ['isShow', 'isAdd', 'EditData'],
    data() {
        return {
            MLEVEL: '', //用于判断是否为一级菜单,保存时使用
            tier: 0, //判断新增菜单的层级
            uploadfilelist:[],
            fileNameList:'',
            menuInfo: {
                // ID: 0,
                // TITLE: '',
                // PATH: '',
                // ICON: '',
                // ORDERNUM: 0,
                // REMARK: '',
                // BGIMG: '',
                // BGCOLOR: '',
                PID: 0,
                TITLE: '',
                PATH: '',
                ICON: '',
                LINKTYPE: 0,
                CODE: '',
                MODULELEVEL: 0,
                PARENTCODE: 'TOP',
                ORDERNUM: 0
            },
            childMenuInfo: {
                PARENTID: 0,
                MODULEPID: 0,
                CODE: '',
                LINKTYPE: 0,
                STATUS: 0
            },
            rules: {
                ID: [{ required: true }]
            }
        };
    },
    mounted() {},
    computed: {},
    methods: {
        // 文件上传
        async uploadFile(params) {
            this.fileNameList = params.file.name;
            this.menuInfo.ICON =params.file.name;
            console.log(params.file.name, '文件名称');
            let form = new FormData();
            form.append('file', params.file);
            form.append('filepath', 'FXPJ');
            // form.append('typeid', this.$route.query.pid);
            const res = await uploadfile(form);
            if(res.code==1){
                this.$message.success('上传成功');
            }
         
            this.getData();
        },
        // 文件上传
        upload() {
            console.log('文件上传');
        },
        cancel() {
            this.$emit('cancel', false);
            this.reset();
        },
        // 新增
        addMenu() {
            // console.log(this.tier);
            console.log(1111111111111111)
            this.$refs.menu.validate((val) => {
                if (val) {
                    // let params = {
                    //     PID: 0,
                    //     TITLE: 'ssb',
                    //     PATH: 'aaa',
                    //     ICON: 'dd',
                    //     LINKTYPE: 1,
                    //     CODE: 'TOP11',
                    //     MODULELEVEL: 1,
                    //     PARENTCODE: 'TOP',
                    //     ORDERNUM: 0
                    // };
                    // this.menuInfo
                    saveModule(this.menuInfo).then((res) => {
                        // console.log(res);
                        if (res.code == 1) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.cancel();
                                this.$store.commit('IS_SAVE', true);
                            }
                    });

                    // console.log('111111');
                    // if (this.tier == 0) {
                    //     SaveModuleParent(this.menuInfo).then((res) => {
                    //         console.log(res);
                    //         if (res == 1) {
                    //             this.$message({
                    //                 message: '新增成功',
                    //                 type: 'success'
                    //             });
                    //             this.cancel();
                    //             this.$store.commit('IS_SAVE', true);
                    //         }
                    //     });
                    // } else {
                    //     const childMenuInfo = {
                    //         ID: 0,
                    //         TITLE: this.menuInfo.TITLE,
                    //         PATH: this.menuInfo.PATH,
                    //         PARENTID: this.childMenuInfo.PARENTID,
                    //         ICON: this.menuInfo.ICON,
                    //         MODULEPID: this.childMenuInfo.MODULEPID,
                    //         CODE: this.childMenuInfo.CODE,
                    //         LINKTYPE: this.childMenuInfo.LINKTYPE,
                    //         ORDERNUM: this.menuInfo.ORDERNUM
                    //     };
                    //     saveModule(this.menuInfo).then((res) => {
                    //         console.log(res);
                    //         if (res == 1) {
                    //             this.$message({
                    //                 message: '新增成功',
                    //                 type: 'success'
                    //             });
                    //             this.cancel();
                    //             this.$store.commit('IS_SAVE', true);
                    //         }
                    //     });
                    // }
                }
            });
        },
        // 保存
        saveMenu() {
            this.$refs.menu.validate((val) => {
                // console.log(val);
                if (val) {
                    console.log(this.MLEVEL);
                    if (this.MLEVEL == 1) {
                        SaveModuleParent(this.menuInfo).then((res) => {
                            console.log(res);
                            if (res.code == 1) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.cancel();
                                this.$store.commit('IS_SAVE', true);
                            }
                        });
                    } else {
                        saveModule(this.menuInfo).then((res) => {
                            console.log(res);
                            if (res.code == 1) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.cancel();
                                this.$store.commit('IS_SAVE', true);
                            }
                        });
                    }
                }
            });
        },
        // 清空表单数据
        reset() {
            this.menuInfo = {
                PID: 0,
                TITLE: '',
                PATH: '',
                ICON: '',
                LINKTYPE: 1,
                CODE: '',
                MODULELEVEL: 1,
                PARENTCODE: '',
                ORDERNUM: 0
            };
        },
        // 数据回显
        lookup({ PID, TITLE, PATH, ICON, LINKTYPE, CODE, MODULELEVEL, PARENTCODE, ORDERNUM }) {
            // console.log(data);
            // this.MLEVEL = MLEVEL;
            // console.log(MLEVEL, '这是层级');
            this.menuInfo = {
                PID,
                TITLE,
                PATH,
                ICON,
                LINKTYPE,
                CODE,
                MODULELEVEL,
                PARENTCODE,
                ORDERNUM
            };
        }
    }
};
</script>

<style scoped lang="scss">
.OneMap .el-dialog__header {
    text-align: center;
}
.OneMap .el-dialog__footer {
    text-align: center;
}
.OneMap .el-input,
.OneMap .el-select {
    width: 100%;
}
::v-deep .set-dialog {
    .el-dialog__header {
        padding: 6px !important;
        padding-left: 20px !important;
        border-bottom: 1px solid #d7d7d7;
        background: #324157;
        .el-dialog__title {
            color: #fff;
            letter-spacing: 2px;
        }
        .el-dialog__headerbtn {
            top: 10px !important;
            .el-dialog__close {
                color: #fff;
            }
        }
    }
    .el-dialog__body {
        padding: 15px !important;
    }
}
</style>