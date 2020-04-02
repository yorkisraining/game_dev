<!--  -->
<template>
    <div class="user_protocol_popup">
        <div class="user_protocol_title">用户协议标题</div>
        <div class="overflow_wrap">
            <p>用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议用户协议</p>
        </div>
        <div class="btn" @click="close">确&nbsp;&nbsp;定</div>
        <div class="close" @click="close">×</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
        };
    },
    methods: {
        close() {
            this.$emit('closeProtocol')
        }
    }
}

</script>
<style lang='less' scoped>
.user_protocol_popup {
    width: 376px;
    position: fixed;
    z-index: 19491001;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url(../assets/bg.png);
    color: #9198AC;
    font-size: 16px;
    border-radius: 4px;
    .overflow_wrap {
        height: 300px;
        overflow: auto;
        margin-bottom: 32px;
        &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            background-color: #F5F5F5;
        }

        &::-webkit-scrollbar {
            width: 6px;
            background-color: #F5F5F5;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #B53132;
            border-radius: 10px;
        }

        p {
            text-indent: 2rem;
            line-height: 1.5;
            margin: 16px;
        }
    }
    .user_protocol_title {
        text-align: center;
        font-size: 18px;
        margin: 16px;
    }
    .btn {
        margin: 0 auto 16px;
        width: 150px;
        height: 38px;
        line-height: 38px;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        color: #5B3A0C;
        background-image: url(../assets/btn_bg.png);
    }
    .close {
        position: absolute;
        top: 0;
        right: 5px;
        font-size: 20px;
        cursor: pointer;
    }
}
</style>