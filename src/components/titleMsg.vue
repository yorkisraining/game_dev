<!-- 上标题下内容 -->
<template>
    <div class="title_msg_box">
        <div class="title">◆{{title}}</div>
        <div class="value">{{value}}</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
        };
    },
    props: ['title', 'value']
}

</script>
<style lang='less' scoped>
.title_msg_box {
    font-size: 14px;
    .title {
        color: #C7AB90;
        margin-bottom: 20px;
    }
    .value {
        color: #575F75;
        line-height: 1.5;
    }
}
</style>