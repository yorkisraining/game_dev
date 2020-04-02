<!-- integral 积分 -->
<template>
    <div class="integral_box">
        <div class="integral_controlls">
            <div class="controlls_items">
                <div class="item_title">可兑换积分: </div>
                <input type="text" v-model="canExchange" disabled class="item_input" placeholder="">
            </div>
            <div class="controlls_items">
                <div class="item_title">兑换积分: </div>
                <input type="text" v-model="willExchange" class="item_input" placeholder="">
            </div>
            <div class="controlls_items">
                <div class="item_title">兑换比例: </div>
                <input type="text" v-model="rate" disabled class="item_input" placeholder="">
            </div>
            <!-- <div class="controlls_items">
                <div class="item_title">交易密码: </div>
                <input type="password" v-model="password" class="item_input" placeholder="">
            </div> -->
        </div>
        <div class="submit_btn" @click="submit">确&nbsp;&nbsp;认</div>

        <msgBox v-if="isShowMsgBox" :value="msgBox" @closeMsgBox="closeMsgBox"></msgBox>
    </div>
</template>

<script>
import { ajaxPost, ajaxGet } from '@/common/js/public'
import { apiUrl } from '@/common/js/api'
import msgBox from '@/components/msgBox'

export default {
    data () {
        return {
            canExchange: 0,
            willExchange: '',
            rate: 1,
            password: '',
            isShowMsgBox: false,
            msgBox: ''
        };
    },
    components: {msgBox},
    created() {
        this.getCanExchange();
    },
    methods: {
        getCanExchange() {
            //获取可兑换积分
            ajaxGet(apiUrl.getUserScore, {}, res => {
                if (res.code == 500) {
                    this.showMsgBox(res.msg);
                    return false;
                }
                this.canExchange = res.dto.unusedScore == null ? 0 : res.dto.unusedScore;
                this.rate = res.dto.scoreRatio == null ? 1 : res.dto.scoreRatio;
            })
        },
        submit() {
             if (this.willExchange <= 0 || this.willExchange > 1000000000) {
                //提示输入合理兑换积分
                //this.showMsgBox('请输入合理的兑换积分');
                this.showMsgBox('兑换积分输入错误， 重新输入');
                return false;
            }
            if (this.canExchange == 0) {
                this.showMsgBox('可兑换积分为0，无法兑换');
                return false;
            }
            if (String(this.willExchange).indexOf(".")>-1) {
                this.showMsgBox('兑换积分输入错误， 重新输入');
                return false;
            }
            if (this.willExchange > this.canExchange) {
                //提示可用积分不足
                //this.showMsgBox('可兑换积分不足');
                this.showMsgBox('兑换积分输入错误， 重新输入');
                return false;
            }
            //兑换积分
            ajaxGet(apiUrl.exchangeScore, {
                scoreNum: this.willExchange,
            }, res => {
                if (res.code == 500) {
                    this.showMsgBox(res.msg);
                    return false;
                }
                this.showMsgBox('兑换成功');
                //刷新
                this.getCanExchange();
                this.willExchange = '';
            })
        },
        showMsgBox(val) {
            this.isShowMsgBox = true;
            this.msgBox = val;
        },
        closeMsgBox() {
            this.isShowMsgBox = false;
        },
    }
}

</script>
<style lang='less' scoped>
.integral_box {
    margin-top: 32px;
    .integral_controlls {
        padding: 0 50px 32px;
        margin: 16px 0;
        border-bottom: 1px solid rgba(40, 43, 58, .6);
        .controlls_items {
            display: flex;
            font-size: 16px;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            color: #9198AC;
            position: relative;
            .item_title {
                width: 100px;
            }
            .item_input {
                width: 350px;
                height: 38px;
                line-height: 38px;
                border: 1px solid rgba(40,43,58,1);
                border-radius: 4px;
                padding-left: 10px;
                background-color: transparent;
            }
        }
    }
    .submit_btn {
        width: 150px;
        height: 38px;
        line-height: 38px;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        color: #5B3A0C;
        background-image: url(../../../assets/btn_bg.png);
        margin: 20px auto;
    }
}
</style>