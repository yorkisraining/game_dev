<!-- helps -->
<template>
    <div class="helps" :style="{minHeight: minH + 'px'}">
        <div class="index_header contain_1200">
            <div class="logo_box" @click="backToHome">
                <img src="@/assets/logo.png" alt="" class="logo_img">
            </div>
        </div>
        <div class="containt_main">
            <router-view />
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            minH: 0
        };
    },
    created() {
        this.minH = document.documentElement.clientHeight;
    },
    methods: {
        backToHome() {
            this.$router.push('/');
        }
    }
}

</script>
<style lang='less' scoped>
.index_header {
    height: 100px;
    display: flex;
    justify-content: space-between;
    .logo_box {
        width: 200px;
        height: 100%;
        padding: 15px 0;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>