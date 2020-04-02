<!-- personal/TransactionPin 交易密码 -->
<template>
    <div class="TransactionPin_box">
        <div class="TransactionPin_controlls">
            <div>
                <div class="yellow_tips" v-if="!hasOrigin">
                    温馨提示：为了确保您的资金安全，请牢记您的交易密码
                </div>
                <div class="yellow_tips" v-if="hasOrigin">
                    请妥善保存交易密码，若要找回，请联系在线客服
                </div>
                <div class="controlls_items">
                    <div class="item_title">交易密码: </div>
                    <input type="password" v-model="newPassword" class="item_input" :disabled="hasOrigin" :placeholder="placeHolder"  autocomplete="new-password">
                    <div class="tips">提示：密码为6位数字</div>
                </div>
                <div class="controlls_items" v-if="!hasOrigin">
                    <div class="item_title">确认交易密码: </div>
                    <input type="password" v-model="newPasswordAgain" class="item_input" :disabled="hasOrigin" placeholder="请输入再次输入密码"  autocomplete="new-password">
                </div>
                <div class="controlls_items" v-if="!hasOrigin">
                    <div class="item_title">验证码</div>
                    <input type="text" v-model="sms" class="item_input sms_input" placeholder="">
                    <div class="get_sms_btn" @click="getSms" :class="{'disabled': !ifCanGetSms}"><span v-if="ifCanGetSms">获取验证码</span><span v-if="!ifCanGetSms">{{countdown}}s后重发</span></div>
                </div>
            </div>
        </div>
        <div class="submit_btn" @click="submit" v-if="!hasOrigin">确&nbsp;&nbsp;&nbsp;认</div>
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
            hasOrigin: true, //是否有原始交易密码
            //oldPassword: '',
            newPassword: '',
            newPasswordAgain: '',
            sms: '', //验证码
            smsMsg: {
                phone: '',
                sms: ''
            }, //获取验证码的消息
            countdown: 60,
            ifCanGetSms: true,
            isShowMsgBox: false,
            msgBox: '',
            placeHolder: '******'
        };
    },
    components: {msgBox},
    created() {
        //获取手机号
        ajaxGet(apiUrl.userInfo, {}, res => {
            this.smsMsg.phone = res.phone;
        })

        ajaxGet(apiUrl.ifSetPayPass, {}, res => {
            if (res.code != 500) {
                if (res.data != 1) {
                    this.hasOrigin = false;
                    this.placeHolder = '请输入交易密码';
                }
            }
        })
    },
    methods: {
        showMsgBox(val) {
            this.isShowMsgBox = true;
            this.msgBox = val;
        },
        closeMsgBox() {
            this.isShowMsgBox = false;
        },
        getSms() {
            if (!this.newPassword) {
                //提示新密码不能为空
                this.showMsgBox('新密码不能为空');
                return false;
            }
            let reg = /^[0-9A]{6}$/;
            if (!reg.test(this.newPassword)) {
                //提示密码不合理
                this.showMsgBox('交易密码必须为6位数字，请重新输入');
                return false;
            }
            if (this.newPassword != this.newPasswordAgain) {
                //提示两次密码输入不一致
                this.showMsgBox('两次密码输入不一致');
                return false;
            }

            if (this.ifCanGetSms) {
                //send sms
                ajaxGet(apiUrl.modifyPayPassCode, {
                    phone: this.smsMsg.phone,
                    password: this.newPassword
                }, res => {
                    if (res.code == 500) {
                        this.showMsgBox(res.msg);
                        return false;
                    }
                    this.count();
                    this.ifCanGetSms = false;
                    this.smsMsg.sms = res.sms;
                })
            }
        },
        count() {
            if (this.countdown == 0) {
                this.ifCanGetSms = true;
                this.countdown = 60;
            } else {
                setTimeout(() => {
                    this.countdown--;
                    this.count();
                }, 1000)
            }
        },
        submit() {
            /* if (this.hasOrigin) {
                if (!this.oldPassword) {
                    //提示旧密码不能为空
                    this.showMsgBox('旧密码不能为空');
                    return false;
                }
            } */
            if (!this.newPassword) {
                //提示新密码不能为空
                this.showMsgBox('新密码不能为空');
                return false;
            }
            let reg = /^[0-9A]{6}$/;
            if (!reg.test(this.newPassword)) {
                //提示密码不合理
                this.showMsgBox('交易密码必须为6位数字，请重新输入');
                return false;
            }
            if (this.newPassword != this.newPasswordAgain) {
                //提示两次密码输入不一致
                this.showMsgBox('两次密码输入不一致');
                return false;
            }
            if (!this.sms) {
                //提示验证码不能为空
                this.showMsgBox('验证码不能为空');
                return false;
            }
            ajaxGet(apiUrl.updateSecondPsw, {
                //oldPassword: this.hasOrigin == true ? this.oldPassword : undefined,
                password: this.newPassword,
                code: this.sms,
            }, res => {
                if (res.code == 500) {
                    this.showMsgBox(res.msg);
                    return false;
                }
                //修改成功
                this.showMsgBox('设置成功');
                this.newPassword = '';
                this.newPasswordAgain = '';
                this.sms = '';
                this.hasOrigin = true;
                this.placeHolder = '******';
            })
        }
    }
}

</script>
<style lang='less' scoped>
.TransactionPin_box {
    margin-top: 32px;
    overflow: hidden;
    .TransactionPin_controlls {
        padding: 0 50px 16px;
        margin: 16px 0;
        min-height: 500px;
        border-bottom: 1px solid rgba(40, 43, 58, .6);
        .controlls_items {
            display: flex;
            font-size: 16px;
            align-items: center;
            margin-bottom: 16px;
            color: #9198AC;
            position: relative;
            .item_title {
                width: 140px;
            }
            .item_input {
                width: 350px;
                height: 38px;
                line-height: 38px;
                border: 1px solid rgba(40,43,58,1);
                border-radius: 4px;
                padding-left: 10px;
                background-color: transparent;
                &.sms_input {
                    width: calc(350px / 2);
                }
            }
            .get_sms_btn {
                width: calc(350px / 2 - 20px);
                margin-left: 20px;
                height: 38px;
                line-height: 38px;
                border: 1px solid rgba(93, 80, 64, 1);
                border-radius: 4px;
                text-align: center;
                color: #5D5040;
                cursor: pointer;
                &.disabled {
                    cursor: not-allowed;
                }
            }
            .tips {
                color: #b53132;
                font-size: 12px;
                margin-left: 16px;
            }
        }
        .yellow_tips {
            color: #a95c36;
            margin: 32px 0 50px;
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
        margin: 20px 0;
        float: right;
    }
}
</style>