<template>
    <div>
        <el-dialog :title="isAdd ? '新增' : '编辑'" :visible.sync="isShow" width="30%" :before-close="cancel" :close-on-click-modal="false"
           custom-class="set-dialog"
        >
            <el-form :model="mode" ref="form" label-width="100px" :rules="rules">
                <el-form-item label="图层名称" prop="LAYERNAME">
                    <el-input v-model="mode.LAYERNAME"></el-input>
                </el-form-item>
                <el-form-item label="图层地址" prop="LAYERURL">
                    <el-input v-model="mode.LAYERURL"></el-input>
                </el-form-item>
                <el-form-item label="子图层" prop="CHILDID">
                    <el-select v-model="mode.CHILDID" placeholder="请选择子图层" @visible-change='getServerLayersList'>
                        <el-option v-for="item in childData" :key="item.Id" :label="item.Name" :value="item.Id">{{item.Name}}</el-option>
                        <!-- <el-option label="规划制作" :value="1"></el-option>
                        <el-option label="土地制作" :value="2"></el-option>
                        <el-option label="现状制作" :value="3"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="规则" prop="REGULATION">
                    <!-- <el-input v-model.number="mode.REGULATION"></el-input> -->
                     <el-select v-model="mode.REGULATION" placeholder="请选择审查规则">
                        <el-option label="禁止占用" value="禁止占用"></el-option>
                        <!-- <el-option label="土地制作" :value="2"></el-option>
                        <el-option label="现状制作" :value="3"></el-option> -->
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="地图类型" prop="MAPTYPE">
                    <el-input v-model="mode.MAPTYPE"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="addMenu" v-if="isAdd">新增</el-button>
                <el-button type="primary" @click="saveMenu" v-else>保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { SaveHGSCLayer , } from '@/api/HGSC-api';
import { getServerLayers } from '@/api/csjy-api'
export default {
    data() {
        // urlL验证
        function IsURL(str_url) {
            var strRegex =
                '^((https|http|ftp|rtsp|mms)?://)' +
                "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" +
                '(([0-9]{1,3}.){3}[0-9]{1,3}' +
                '|' +
                "([0-9a-z_!~*'()-]+.)*" +
                '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' +
                '[a-z]{2,6})' +
                '(:[0-9]{1,4})?' +
                '((/?)|' +
                "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);
            if (re.test(str_url)) {
                return true;
            } else {
                return false;
            }
        }
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入正确的url'));
            } else {
                if (!IsURL(value)) {
                    console.log('验证成功');
                    getServerLayers({ serverurl: value }).then((res) => {
                        console.log(res);
                        // this.FXLAYER = res;
                        console.log(this);
                        callback();
                    });
                } else {
                    callback(new Error('请输入正确的url'));
                    console.log('验证失败');
                }
            }
        };
        return {
            mode: {
                // pID: 0, //主键
                LAYERNAME: '', //专题图名称
                LAYERURL: '', //图层服务
                CHILDID: '', // 1：规划制作 2：土规制作 3：现状制作 ,
                REGULATION: '', //规则
                // MAPTYPE: '' //服务类型Image,tile
            },
            childData: [], //childID的下拉数据
            saveData: {}, //存储数据回显时的数据
            rules: {
                LAYERURL: [{ required: true, message: '请输入正确的url', trigger: 'blur', type: 'url' }],
                CHILDID: [{ required: true, message: '请选择子图层', trigger: 'change' }],
                REGULATION: [
                    {
                        required: true,
                        // required: true,
                        message: '请输入审查规则',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    props: ['isShow', 'isAdd', 'EditData'],
    methods: {
        // 根据图层服务地址获取列表
       async getServerLayersList(){

            const  res = await getServerLayers({serverurl:this.mode.LAYERURL});
            this.childData =res.data;
        },
        // 清空表单数据
        reset() {
            this.mode = {
                // pID: 0, //主键
                LAYERNAME: '', //专题图名称
                LAYERURL: '', //图层服务
                TYPE: 1, //1：单元检测 2：开发评估
                REGULATION: '', //排序
                MAPTYPE: '' //服务类型Image,tile
                // RULEID: '' //0
            };
        },
        //    数据回显
        lookup(data) {
            console.log(data);
            this.saveData = data;
            this.mode = {
                ...data
            };
             this.getServerLayersList();
        },
        cancel() {
            this.$emit('cancel', false);
            this.reset();
        },
        addMenu() {
            this.$refs.form.validate((val) => {
                if (val) {
                    console.log(11111);
                    const params = {
                        ...this.mode
                        // ID: 0,
                        // LAYERNAME: 'sdfds',
                        // LAYERURL: 'http://www.baidu.com',
                        // CHILDID: '3',
                        // REGULATION: '7'
                    };
                    SaveHGSCLayer(params).then((res) => {
                        if (res.code == 1) {
                            this.$message.success('添加成功');
                            this.cancel();
                            this.$emit('refresh');
                        }
                    });
                }
            });
        },
        saveMenu() {
            const params = {
                ...this.mode,
                PID: this.saveData.PID
            };
            SaveHGSCLayer(params).then((res) => {
                console.log(res);
                if (res.code == 1) {
                    this.$message.success('保存成功');
                    this.cancel();
                    this.$emit('refresh');
                }
            });
        }
    },
    mounted() {
       
    }
};
</script>

<style scoped lang="scss">
::v-deep .set-dialog {
    .el-dialog__header {
        text-align: center;
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