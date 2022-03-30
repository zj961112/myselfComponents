<template>
<div>
  <svg-icon  iconClass="danxuan-weixuan" v-if="!selected"></svg-icon>
  <svg-icon  iconClass="danxuan-xuanzhong" v-else></svg-icon>
</div>
</template>

<script>
export default {
  name: 'circleSelect',
  props: {
    selected: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style scoped>

</style>
