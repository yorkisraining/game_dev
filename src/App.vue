<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
    name: 'App',
    data() {
      return  {
      }
    },
}
</script>
<style scoped lang="less">
#app {
  background-image: url(./assets/bg.png);
  background-size: cover;
}
</style>
