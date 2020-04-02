<!-- msgBoxWithCancel 公共弹窗 -->
<template>
<transition name="fade">
    <div class="msgBox_box">
        <p v-html="value"></p>
        <div class="btn_group">
            <div class="btn" @click="confirmMsgBox">确&nbsp;&nbsp;定</div>
            <div class="btn cancel" @click="closeMsgBox">取&nbsp;&nbsp;消</div>
        </div>
        <div class="close" @click="closeMsgBox">×</div>
    </div>
</transition>
</template>

<script>
export default {
    data () {
        return {
        };
    },
    props: ['value'],
    methods: {
        closeMsgBox() {
            this.$emit('closeMsgBoxWithCancel')
        },
        confirmMsgBox() {
            this.$emit('confirmMsgBoxWithCancel')
        }
    }
}

</script>
<style lang='less' scoped>
.msgBox_box {
    width: 376px;
    height: 235px;
    position: fixed;
    z-index: 19491001;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url(../assets/bg.png);
    color: #9198AC;
    font-size: 16px;
    .btn_group {
        position: absolute;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        display: flex;
    }
    .btn {
        width: 120px;
        height: 38px;
        line-height: 38px;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        color: #5B3A0C;
        background-image: url(../assets/btn_bg.png);
        margin-right: 15px;
        &.cancel {
            background-image: url(../assets/btn_bg_cancel.png);
            color: #ccc;
        }
    }
    .close {
        position: absolute;
        top: 10px;
        right: 5px;
        font-size: 20px;
        cursor: pointer;
    }
    p {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        line-height: 1.5;
        width: 80%;
    }
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

</style>