<template>
  <div class='container'>
    <el-row :gutter='20'>
      <el-col :span='5.5'>
        <div class='grid-content bg-purple'>
          <el-date-picker
              v-model='dateValue'
              type='datetimerange'
              value-format='yyyy-MM-dd HH:mm:ss'
              range-separator='至'
              start-placeholder='起始时间'
              end-placeholder='结束时间'>
          </el-date-picker>
        </div>
      </el-col>

      <el-col :span='3'>
        <div class='grid-content bg-purple'>
          <el-select v-model='queryParam.firstModuleName' @change='firstChange' @clear='firstClear' :disabled='firstDisabled' clearable placeholder='请选择一级模块'>
            <el-option
                v-for='(item, index) in firstOptions'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </div>
      </el-col>

      <el-col :span='3'>
        <div class='grid-content bg-purple'>
          <el-select v-model='queryParam.secondModuleName' @change='secondChange' @clear='secondClear' clearable :disabled='secondDisabled' placeholder='请选择二级模块'>
            <el-option
                v-for='(item, index) in secondOptions'
                :key='item'
                :label='item'
                :value='item'
            ></el-option>
          </el-select>
        </div>
      </el-col>

      <el-col :span='3'>
        <div class='grid-content bg-purple'>
          <el-select v-model='queryParam.officeId' clearable placeholder='请选择所属部门'>
            <el-option
                v-for='(item, index) in officeList'
                :key='item.pid'
                :label='item.name'
                :value='item.pid'
            ></el-option>
          </el-select>
        </div>
      </el-col>

      <el-col :span='3'>
        <div class='grid-content bg-purple'>
          <el-input v-model='queryParam.userName' placeholder='根据用户名称模糊搜索'></el-input>
        </div>
      </el-col>

      <el-col :span='5'>
        <div class='grid-content bg-purple'>
          <div>
            <el-button type='primary' icon='el-icon-search' class='handle-del mr10' @click='buttonQueryUseDurationListList'>
              查询
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-table style='font-size: 15px' :data='tableData' border class='table' ref='multipleTable'
              v-loading="loading"

              header-cell-class-name='table-header'>
      <el-table-column type='index' :index='indexMethod' label='序号' align='center' width='100px'></el-table-column>
      <el-table-column prop='officeName' label='部门' align='center'></el-table-column>
      <el-table-column prop='userName' label='用户' align='center'></el-table-column>
      <el-table-column prop='firstModule' label='一级模块' align='center'></el-table-column>
      <el-table-column prop='secondModule' label='二级模块' align='center'></el-table-column>
      <el-table-column prop='thirdModule' label='三级模块' align='center'></el-table-column>
      <el-table-column prop='createTime' label='起始时间' align='center'></el-table-column>
      <el-table-column prop='endTime' label='结束时间' align='center'></el-table-column>
      <el-table-column prop='useDurationSecond' label='使用时长' align='center' :formatter='durationFormat'></el-table-column>
    </el-table>
    <div class='pagination'>
      <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChange'
                     :current-page='queryParam.page'
                     :page-sizes='[15, 20]' :page-size='100' layout='total, sizes, prev, pager, next, jumper'
                     :total='total'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { queryPageApi } from '@/api/systemMonitor/UseDuration';
import { getAllOfficeList } from '@/api/safeadmin/depart-api';

export default {
  name: 'useDuration',
  data() {
    return {
      tableData: [],
      // 查询数据
      queryParam: {
        userName: undefined,
        page: 1,
        pageSize: 15,
        firstModuleName: undefined,
        secondModuleName: undefined,
        thirdModuleName: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      dateValue: [],
      total: 0,
      firstOptions: [
        '系统使用时长'
      ],
      secondOptions: [
        '八闽概况',
        '业绩画像',
        '数据底座',
        '数字赋能',
        '空间治理'
      ],
      officeList: [],
      firstDisabled: false,
      secondDisabled: false,
      loading: false
    };
  },
  computed: {},
  mounted() {
  },
  created() {
    this.queryUseDurationList();
    this.initOfficeList();
  },
  methods: {
    firstClear() {
      this.secondDisabled = false;
    },
    secondClear() {
      this.firstDisabled = false;
    },
    firstChange(data) {
      this.queryParam.secondModuleName = undefined;
      this.secondDisabled = true;
    },
    secondChange(data) {
      this.queryParam.firstModuleName = undefined;
      this.firstDisabled = true;
    },
    durationFormat(row, column) {
      if (row.useDurationSecond != undefined || row.useDurationSecond != null) {
        let hours = Math.floor(row.useDurationSecond / 3600);
        let minutes = Math.floor((row.useDurationSecond % 3600) / 60);
        let seconds = row.useDurationSecond % 60;

        let formattedTime = "";
        if (hours > 0) {
          formattedTime += hours + "小时";
        }
        if (minutes > 0) {
          formattedTime += minutes + "分钟";
        }
        if (seconds > 0) {
          formattedTime += seconds + "秒";
        }

        return formattedTime;
      }
    },
    indexMethod(index) {
      return index + 1;
    },
    // 查询列表数据
    queryUseDurationList() {
      this.loading = true;
      if (this.dateValue != null) {
        if (this.dateValue.length > 0) {
          this.queryParam.startTime = this.dateValue[0];
          this.queryParam.endTime = this.dateValue[1];
        }
      } else {
        this.queryParam.startTime = undefined;
        this.queryParam.endTime = undefined;
      }

      queryPageApi(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
        this.loading = false;
      });
    },
    buttonQueryUseDurationListList() {
      this.loading = true;
      this.queryParam.page = 1;
      if (this.dateValue != null) {
        if (this.dateValue.length > 0) {
          this.queryParam.startTime = this.dateValue[0];
          this.queryParam.endTime = this.dateValue[1];
        }
      } else {
        this.queryParam.startTime = undefined;
        this.queryParam.endTime = undefined;
      }
      queryPageApi(this.queryParam).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
        this.loading = false;
      });
    },
    // 分页参数回调
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.queryUseDurationList();
    },
    handleCurrentChange(val) {
      this.queryParam.page = val;
      this.queryUseDurationList();
    },
    initOfficeList() {
      getAllOfficeList().then(res => {
        if (res.code == 200) {
          this.officeList = res.data;
        }
      });
    }
  }
};
</script>
<style>
.el-row {
  margin-bottom: 20px;

&
:last-child {
  margin-bottom: 0;
}

}
.el-col {
  border-radius: 4px;
}

.background {
  background-color: white;
}

.el-cascader {
  width: 350px;
}
</style>