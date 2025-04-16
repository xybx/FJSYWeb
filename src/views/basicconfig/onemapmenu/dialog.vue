<template>
    <div>
        <el-dialog
            :title="isAdd ? '添加' : '编辑'"
            :visible.sync="isShow"
            width="30%"
            :before-close="cancel"
            custom-class="set-dialog"
            :close-on-click-modal="false"
        >
            <el-form :model="menuInfo" ref="menu" label-width="100px" :rules="rules">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="menuInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="page">
                    <el-input v-model="menuInfo.page"></el-input>
                </el-form-item>
                <!-- <el-form-item label="图标" prop="ICON">
                    <el-upload
                        action="#"
                        list-type="picture-card"
                        :on-preview="onPreview"
                        :on-remove="onRemove"
                        :on-change="onChange"
                        :auto-upload="false"
                        :file-list="uploadfilelist"
                        :before-upload=" beforeUpload"
                        
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="" />
                    </el-dialog>
                </el-form-item> -->
                <!-- <el-form-item label="分类" prop="levelcode">
                    <el-input v-model="menuInfo.levelcode"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="背景图片" prop="BGIMG" v-if="MLEVEL == 0">
                     <el-upload
                        action="#"
                        list-type="picture-card"
                        :on-preview="onBackgroundPreview"
                        :on-remove="onBackgroundRemove"
                        :on-change="onBackgroundChange"
                        :auto-upload="false"
                        :file-list="uploadbgfilelist"
                        :before-upload=" beforeUpload"
                        
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogBackgroundVisible">
  <img width="100%" :src="dialogBackgroundImageUrl" alt="">
</el-dialog>
                </el-form-item> -->
                <el-form-item label="权限" prop="power" >
                    <!-- <el-input v-model="menuInfo.power"></el-input> -->
                    <el-select v-model="menuInfo.power" placeholder="请选择">
                        <el-option v-for="item in popedomList" :key="item.pidString" :label="item.name" :value="item.pidString">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分组名称" prop="groupname" >
                    <el-input v-model="menuInfo.groupname"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="serial">
                    <el-input v-model="menuInfo.serial"></el-input>
                </el-form-item>
              <el-form-item v-if="menuInfo.popedomid != 21" label="父级菜单" prop="serial">
<!--                <el-input v-model="menuInfo.popedomid"></el-input>-->
                <el-select v-model="menuInfo.popedomid" placeholder="请选择">
                  <el-option v-for="item in parentMenuList" :key="item.pid" :label="item.name" :value="item.pid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addMenu" v-if="isAdd">添加</el-button>
                <el-button type="primary" @click="saveMenu" v-else>保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { SaveModuleParent, SaveModule, getParentMenuList } from '@/api/moduleonemap-api';
import { uploadfile } from '@/api/upload-api';
import { queryPopedomList } from '@/api/safeadmin/role-api';
export default {
    props: ['isShow', 'isAdd', 'EditData', 'MLEVEL', 'parentData'],
    data() {
        return {
            dialogVisible: false,
            dialogImageUrl: '',
            dialogBackgroundVisible: false,
            dialogBackgroundImageUrl: '',
            uploadfilelist: [],
            uploadbgfilelist: [],
            fileNameList: '',
            fileNamebgList: '',

            parentmodule: {}, //父级菜单信息
            // MLEVEL: 0, //用于判断是否为一级菜单,保存时使用
            tier: 0, //判断添加菜单的层级
            PARENTID: '', //父级菜单的id
            MODULEPID: '', //父级MODULEPID
            ORDERNUM: '', //父级的排序
            ID: '', //父级id
            menuInfo: {
                pid: 0, //菜单本身的id
                name: '',
                page: '',
                levelcode: '',
                power: 0,
                groupname: '',
                serial: '',
                popedomid: 0
            },
            childMenuInfo: {
                PARENTID: 0,
                MODULEPID: 0,
                CODE: '',
                LINKTYPE: 0,
                STATUS: 0,
                MLEVEL: 0
            },
            rules: {
                name: [{ required: true, message: '标题不能为空哦' }]
            },
            popedomList: [],
            parentMenuList: []
        };
    },
    mounted() {
        this.initPopedomList();
        this.initParentMenuList();
    },
    computed: {},
    methods: {
        initParentMenuList() {
          getParentMenuList().then(res => {
              if (res.code == 200) {
                  this.parentMenuList = res.data;
              }
          })
        },
        initPopedomList() { 
            queryPopedomList().then(res => { 
                if (res.code == 200) {
                    this.popedomList = res.data;
                    for (let i = 0; i < this.popedomList.length; i++) { 
                        this.popedomList[i].pidString = String(this.popedomList[i].pid);
                    }
                } else {
                    this.$message.error("获取权限列表失败，请刷新后重试！");
                }
            })
        },
        // 文件上传
        async uploadFile(file) {
            // this.fileNameList = params.file.name;
            // this.menuInfo.ICON = params.file.name;
            this.menuInfo.ICON = file.name;
            this.fileNameList = file.name;
            console.log(file.name, '文件名称');
            let form = new FormData();
            // form.append('file', params.file);
            form.append('file', file);
            form.append('filepath', 'XTCD');
            // form.append('typeid', this.$route.query.pid);
            const res = await uploadfile(form);
            if (res.code == 1) {
                this.$message.success('上传成功');
            }

            // this.getData();
        },
        // uploadFileBackground
        async uploadFileBackground(file) {
            // this.fileNamebgList = params.file.name;
            // this.menuInfo.BGIMG = params.file.name;
            this.fileNamebgList = file.name;
            this.menuInfo.BGIMG = file.name;

            let form = new FormData();
            form.append('file', file);
            form.append('filepath', 'XTCD');
            // form.append('typeid', this.$route.query.pid);
            const res = await uploadfile(form);
            if (res.code == 1) {
                this.$message.success('上传成功');
            }

            // this.getData();
        },
        cancel() {
            this.$emit('cancel', false);
            this.reset();
        },
        // 添加
        addMenu() {
            this.$refs.menu.validate((val) => {
                if (val) {
                    console.log('hello');

                    // //一级菜单
                    if (this.MLEVEL == 0) {
                        SaveModuleParent(this.menuInfo).then((res) => {
                            // console.log(res);
                            if (res.code == 200) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.cancel();
                                this.$store.commit('IS_SAVE', true);
                            }
                        });
                    } else {
                        //二三级菜单
                        const childMenuInfo = {
                            ID: 0,
                            // ID:this.parentData.ID,
                            TITLE: this.menuInfo.TITLE,
                            PATH: this.menuInfo.PATH,
                            // // PARENTID: this.MLEVEL==1?this.parentmodule.ID:this.parentmodule.PARENTID,
                            PARENTID: this.parentData.ID,
                            ICON: this.menuInfo.ICON,
                            CODE: this.childMenuInfo.CODE,
                            LINKTYPE: this.childMenuInfo.LINKTYPE,
                            ORDERNUM: this.menuInfo.ORDERNUM,
                            MLEVEL: this.parentmodule.MLEVEL + 1
                        };
                        SaveModule(childMenuInfo).then((res) => {
                            console.log(res);
                            if (res.code == 200) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.cancel();
                                this.$store.commit('IS_SAVE', true);
                                this.$emit('refresh', this.parentmodule.ID);
                            }
                        });
                    }
                }
            });
        },
        // 保存
        saveMenu() {
            this.$refs.menu.validate((val) => {
                // console.log(val);
                if (val) {
                    console.log(this.MLEVEL);
                    SaveModuleParent(this.menuInfo).then((res) => {
                        console.log(res);
                        if (res.code == 200) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            this.cancel();
                            this.$store.commit('IS_SAVE', true);
                        }
                    });
                    // if (this.MLEVEL == 1) {
                    //     SaveModuleParent(this.menuInfo).then((res) => {
                    //         console.log(res);
                    //         if (res == 1) {
                    //             this.$message({
                    //                 message: '保存成功',
                    //                 type: 'success'
                    //             });
                    //             this.cancel();
                    //             this.$store.commit('IS_SAVE', true);
                    //         }
                    //     });
                    // } else {
                    //     SaveModule(this.menuInfo).then((res) => {
                    //         if (res == 1) {
                    //             this.$message({
                    //                 message: '保存成功',
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
        // 清空表单数据
        reset() {
            this.menuInfo = {
                ID: 0,
                TITLE: '',
                PATH: '',
                ICON: '',
                ORDERNUM: 0,
                REMARK: '',
                BGIMG: '',
                BGCOLOR: ''
            };
            this.childMenuInfo = {
                PARENTID: 0,
                MODULEPID: 0,
                CODE: '',
                LINKTYPE: 0,
                STATUS: 0
            };
            this.MLEVEL = '';
        },
        // 数据回显
        lookup({ pid, name, page, levelcode, power, groupname, serial, popedomid }) {
            // console.log(ID,'这是ID');
            // this.MLEVEL = MLEVEL;
            // this.MLEVEL = '';
            // this.ID = ID;
            // console.log(MLEVEL, '这是层级');
            // this.fileNameList = ICON;
            // this.fileNamebgList = BGIMG;
            this.menuInfo = {
                pid,
                name,
                page,
                levelcode,
                power,
                groupname,
                serial,
                popedomid,
            };
        },
        addChildMenu(data) {
            this.parentmodule = data;
            this.MLEVEL = data.MLEVEL;
            this.ID = data.ID;
            console.log(data.MLEVEL);
            console.log(data);
        },
        // 图标文件上传的方法
        // 文件上传方法
        onRemove(file) {},
        // 图片下载方法
        handleDownload(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 当图片改变是的事件
        onChange(file, filelist) {
            console.log(file.raw);
            this.uploadFile(file.raw);
        },
        // 图片展示
        onPreview(file) {
            //  this.uploadFile(file);
            // this.dialogImageUrl=file.url;
            // this.dialogVisible=true;
            // console.log(file);
        },

        // 背景图片文件上传的方法
        // 文件上传方法
        onBackgroundRemove(file) {},
        // 图片下载方法
        handleDownload(file) {
            this.dialogBackgroundImageUrl = file.url;
            this.dialogBackgroundVisible = true;
        },
        // 当图片改变是的事件
        onBackgroundChange(file, filelist) {
            console.log(file.raw);
            this.uploadFileBackground(file.raw);
        },
        // 图片展示
        onBackgroundPreview(file) {
            //  this.uploadFile(file);
            // this.dialogImageUrl=file.url;
            // this.dialogVisible=true;
            // console.log(file);
        },
        // 设置上传类型
        beforeUpload(file) {
            var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            const extension = testmsg === 'txt';
            const extension2 = testmsg === 'xls';
            const extension3 = testmsg === 'xlsx';
            const extension4 = testmsg === 'pdf';
            const extension5 = testmsg === 'docx';

            if (!extension && !extension2 && !extension3 && !extension4 && !extension5) {
                this.$message({
                    message: '上传文件只能是txt,xls,xlsx,pdf,docx格式!',
                    type: 'warning'
                });
            }
            return extension;
        }
    }
};
</script>

<style scoped lang="scss">
.OneMap .el-dialog__header {
    text-align: left;
    background: black;
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
