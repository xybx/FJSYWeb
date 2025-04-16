<template>
  <div class='container'>

    <el-tabs v-model='type' @tab-click='handleClick'>
      <el-tab-pane label='提升概况数据运维' name='overview'>
      </el-tab-pane>
      <el-tab-pane label='项目概况数据运维' name='data'>
      </el-tab-pane>
      <el-tab-pane label='底图查询配置' name='search'>
      </el-tab-pane>
      <el-tab-pane label='列表查询配置' name='list'>
      </el-tab-pane>
    </el-tabs>

    <!--  提升概况数据运维  -->
    <CityQualityPromoteOverview v-if="type == 'overview'"></CityQualityPromoteOverview>
    <!--  项目概况数据运维页面  -->
    <CityQualityPromoteData v-if="type == 'data'"></CityQualityPromoteData>
    <!--  底图查询配置  -->
    <LayerSearch v-if="type == 'search'"></LayerSearch>
    <!--  列表查询配置  -->
    <ListSearch v-if="type == 'list'"></ListSearch>

  </div>
</template>

<script>
import CityQualityPromoteData from '@/views/spaceAdjust/cityQualityPromote/data/CityQualityPromoteData';
import LayerSearch from '@/views/spaceAdjust/cityQualityPromote/search/LayerSearch';
import ListSearch from '@/views/spaceAdjust/cityQualityPromote/list/ListSearch';
import CityQualityPromoteOverview from '@/views/spaceAdjust/cityQualityPromote/overview/CityQualityPromoteOverview';

export default {
  name: 'cityQualityPromote',
  data() {
    return {
      type: 'overview'
    };
  },
  components: {
    CityQualityPromoteData,
    LayerSearch,
    ListSearch,
    CityQualityPromoteOverview
  },
  computed: {
    // 上传时需要的请求头
    headers() {
      const token = sessionStorage.getItem('token');
      return {
        Authorization: token,
        loginType: 'system'
      };
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    handleClick() {

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