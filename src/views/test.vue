<template>
  <div>
      <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :auto-upload='false'
      :file-list="filelist"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt=""/>
      </el-dialog>
  </div>
</template>


<script>
  export default {
    data() {
       
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        cateInfo:{
            img:'',

        }
      };
    },
    methods: {
        // 文件上传方法
        onRemove(file){},
        // 图片下载方法
        handleDownload(file){

        },
        // 当图片改变是的事件
        onChange(file,filelist){
            console.log(file.raw);
            
        },
        // 图片展示
        onPreview(file){
            this.dialogImageUrl=file.url;
         
        }

    }
  }
</script>



