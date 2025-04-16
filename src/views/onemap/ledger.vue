<template>
  <h1>统计台账</h1>
</template>

<script>
import {getGroupList,saveGroup,DeleteGroup,getLayerList,saveLayer,DeleteLayer} from "@/api/onemap/ledger-api";
export default {
  mounted(){
    getGroupList();
  }
}
</script>

<style>

</style>