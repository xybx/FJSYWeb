<template>
    <div>
        <el-dialog :title="isAdd ? '新增' : '编辑'" :visible.sync="isShow" width="30%" :before-close="cancel" :close-on-click-modal="false" 
        custom-class="set-dialog"
        >
            <el-form :model="mode" ref="form" label-width="100px" :rules="rules" 
             
            >
                <!-- <el-form-item label="主键" prop="pID">
                    <el-input v-model="mode.pID"></el-input>
                </el-form-item> -->
                <el-form-item label="图层名称" prop="LAYERNAME">
                    <el-input v-model="mode.LAYERNAME"></el-input>
                </el-form-item>
                <el-form-item label="服务地址" prop="LAYERURL">
                    <el-input v-model="mode.LAYERURL"></el-input>
                </el-form-item>
                <el-form-item label="子图层" prop="FXLAYERID">
                    <el-select v-model="mode.FXLAYERID" placeholder="请选择类型">
                        <el-option v-for="item in FXLAYER" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
               
                <el-form-item label="分类" prop="TYPE">
                    <el-select v-model="mode.TYPE" placeholder="请选择类型">
                        <el-option label="单元检测" :value="1"></el-option>
                        <el-option label="开发评估" :value="2"></el-option>
                    </el-select>
                </el-form-item>
              
                 <el-form-item label="是否分析图层" prop="ISFX">
                    <!-- <el-input v-model="mode.fXLAYERID"></el-input> -->
                    <el-radio-group v-model="mode.ISFX">
						<el-radio label="1" :value="1">是</el-radio>
						<el-radio label="0" :value="0">否</el-radio>
					</el-radio-group>
                </el-form-item>
                <el-form-item label="地图服务类型" prop="MAPTYPE">
					<el-radio-group v-model.number="mode.MAPTYPE">
						<el-radio label="tile">静态服务</el-radio>
						<el-radio label="image">动态服务</el-radio>
					</el-radio-group>
				</el-form-item>
                  <el-form-item label="排序" prop="ORDERNUM" >
                    <el-input v-model.number="mode.ORDERNUM"  type="number" min="0"></el-input>
                </el-form-item>
                <!-- <el-form-item label="服务类型" prop="MAPTYPE">
                    <el-input v-model="mode.MAPTYPE"></el-input>
                </el-form-item> -->
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
import { SaveCSJYLayer, getServerLayers } from '@/api/csjy-api';
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
                        if(res.code==1){
                            this.FXLAYER = res.data;
                            console.log(this);
                            callback();
                        }
                        
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
                LAYERNAME: '', //图层名称
                LAYERURL: '', //图层服务
                TYPE: 1, //1：单元检测 2：开发评估
                ORDERNUM: '', //排序
                MAPTYPE: '', //服务类型Image,tile
                ISFX: '', //是否分析图层数据 0：否， 1：是
                FXLAYERID: ''
                // FXLAYERID:data,
            },
            FXLAYER: [],
            rules: {
                LAYERURL: [{ required: true, message: '请输入正确的url', trigger: 'blur', type: 'url', validator: validatePass }],
                TYPE: [
                    {
                        type: 'number',
                        required: true,
                        message: '请输入类型',
                        trigger: 'change'
                    }
                ],
                ISFX: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                ORDERNUM: [{
                    type:'number',
                    // required: true,
                    message: '类型不正确,应为数值型',
                    trigger:'blur'
                }]
            }
        };
    },
    props: ['isShow', 'isAdd', 'EditData'],
    methods: {
        // 清空表单数据
        reset() {
            this.mode = {
                // pID: 0, //主键
                LAYERNAME: '', //图层名称
                LAYERURL: '', //图层服务
                TYPE: 1, //1：单元检测 2：开发评估
                ORDERNUM: '', //排序
                MAPTYPE: '', //服务类型Image,tile
                ISFX: '', //是否分析图层数据 0：否， 1：是
                FXLAYERID: ''
            };
        },
        //    数据回显
        lookup(data) {
            this.mode = {
                ...data
            };
        },
        cancel() {
            this.$emit('cancel', false);
            this.reset();
        },
        addMenu() {
            console.log("这是添加按钮")
            this.$refs.form.validate((val) => {
                if (val) {
                    const params = {
                        ...this.mode
                    };
                    console.log(55555555555);
                    SaveCSJYLayer(params).then((res) => {
                        if (res.code == 1) {
                            this.$message.success('添加成功');
                            // this.$emit('cancel', false);
                            this.cancel();
                            this.$emit('refresh');
                        }
                    });
                }
            });
        },
        saveMenu() {
            SaveCSJYLayer(this.mode).then((res) => {
              
                if (res.code == 1) {
                    this.$message.success('保存成功');
                    this.cancel();
                    this.$emit('refresh');
                }
            });
        }
    },
    mounted() {}
};
</script>

<style  scoped lang="scss">
@import '@/assets/scss/common.scss';
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
    .el-select{
       width: 100%;
    }
}
</style>