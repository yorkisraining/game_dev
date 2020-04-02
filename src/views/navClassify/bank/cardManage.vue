<!-- bank/cardManage 银行卡管理 -->
<template>
    <div class="cardManage_box">
        <div class="all_card_list" v-if="cardList.length > 0">
            <div class="card_list_item" v-for="item in cardList" :key="item.id">
                <div>{{item.bankName}}</div>
                <div>{{item.cardNo | filterCardNo}}</div>
            </div>
        </div>
        <div class="cardManage_controlls">
            <div class="controlls_items">
                <div class="item_title">持卡人: </div>
                <input type="text" v-model="cardUser" class="item_input" placeholder="" disabled>
            </div>
            <div class="controlls_items">
                <div class="item_title">银行卡号: </div>
                <input type="text" v-model="cardId" class="item_input" placeholder="" @blur="getBankBinFn">
            </div>
            <div class="controlls_items">
                <div class="item_title">银行名称: </div>
                <input type="text" v-model="cardBankName" class="item_input" placeholder="自动识别银行">
            </div>
            <div class="controlls_items">
                <div class="item_title">开户支行</div>
                <input type="text" v-model="cardBankSm" class="item_input" placeholder="">
            </div>
            <div class="controlls_items">
                <div class="item_title">已绑定手机: </div>
                <input type="text" v-model="phone" class="item_input" placeholder="">
            </div>
            <!-- <div class="controlls_items">
                <div class="item_title">验证码</div>
                <input type="text" v-model="sms" class="item_input sms_input" placeholder="">
                <div class="get_sms_btn" @click="getSms" :class="{'disabled': !ifCanGetSms}"><span v-if="ifCanGetSms">获取验证码</span><span v-if="!ifCanGetSms">{{countdown}}s后重发</span></div>
            </div> -->
        </div>
        <div class="btn">
            <div class="submit_btn" @click="submit">添&nbsp;&nbsp;&nbsp;加</div>
            <div class="all_btn">如想修改绑定银行卡信息，请联系客服</div>
        </div>
        
        <msgBox v-if="isShowMsgBox" :value="msgBox" @closeMsgBox="closeMsgBox"></msgBox>
    </div>
</template>

<script>
import { ajaxPost, ajaxGet } from '@/common/js/public'
import { apiUrl } from '@/common/js/api'
import msgBox from '@/components/msgBox'
import BIN from 'bankcardinfo';

export default {
    data () {
        return {
            cardList: [], //已绑定银行卡
            cardUser: '', //持卡人,
            cardId: '', //银行卡号
            cardBankName: '', //银行名称
            cardBankSm: '', //开户支行
            phone: '', //已绑定手机
            sms: '', //验证码
            smsMsg: {
                phone: '',
                sms: ''
            }, //获取验证码的消息
            countdown: 60,
            ifCanGetSms: true,
            isShowMsgBox: false,
            msgBox: '',
            sub: false,
        };
    },
    components: {msgBox},
    created() {
        this.getCard();
        ajaxGet(apiUrl.userInfo, {}, res => {
            res = res.user;
            this.cardUser = res.name;
        })
    },
    filters: {
        filterCardNo(val) {
            if (val) {
                return '**** **** **** ' + val.substr(val.length - 4, val.length -1);
            }
        }
    },
    methods: {
        getBankBinFn() {
            BIN.getBankBin(this.cardId)
            .then(data => {
                this.cardBankName = data.bankName;
            })
            .catch(err => {
                this.showMsgBox('无法识别银行卡');
            })
        },
        submit() {
            if (this.cardList.length >= 5) {
                this.showMsgBox('最多添加5张银行卡，如需修改，请联系在线客服');
                return false;
            }
            if (!this.cardUser || !this.cardId || !this.cardBankName || !this.phone || !this.cardBankSm) {
                this.showMsgBox('请完成填写');
                return false;
            }
            let reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
            if (!reg.test(this.phone)) {
                //提示手机号不正确
                this.showMsgBox('请输入正确的手机号');
                return false;
            }
            /* if (this.smsMsg.sms != this.sms) {
                this.showMsgBox('验证码错误');
            } */
            //提交
            this.showMsgBox('提交后不可修改，请确认信息准确，如需修改，请联系在线客服');

            this.sub = true;
        },
        getCard() {
            //请求银行卡
            ajaxGet(apiUrl.getUserCard, {}, res => {
                if (res.code != 500) {
                    this.cardList = res.list;
                }
            })
        },
        initData() {
            this.cardId = ''; //银行卡号
            this.cardBankName = ''; //银行名称
            this.cardBankSm = ''; //开户支行
            this.phone = ''; //已绑定手机
            this.sms = ''; //验证码
            this.smsMsg = {
                phone: '',
                sms: ''
            };
        },
        showMsgBox(val) {
            this.isShowMsgBox = true;
            this.msgBox = val;
            this.sub = false;
        },
        closeMsgBox() {
            this.isShowMsgBox = false;
            if (this.sub) {
                ajaxPost(apiUrl.saveUserCard, {
                    "bankName": this.cardBankName,
                    "bindPhone": this.phone,
                    "cardNo": this.cardId,
                    "cardOwner": this.cardUser,
                    "openBankName": this.cardBankSm
                }, res => {
                    this.sub = false;
                    if (res.code == 500) {
                        this.showMsgBox(res.msg);
                        return false;
                    }
                    //添加成功，重新请求银行卡信息
                    this.getCard();
                    this.initData();
                })
            }
        },
        getSms() {
            if (this.ifCanGetSms) {
                if (this.verticalPhone()) {
                    this.count();
                    this.ifCanGetSms = false;
                    //send sms
                    ajaxGet(apiUrl.getSms, {
                        phone: this.phone
                    }, res => {
                        this.smsMsg.sms = res.sms;
                    })
                }
            }
        },
        verticalPhone() {
            let reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
            if (this.phone.length == 0) {
                //提示手机号为空
                this.showMsgBox('请输入手机号');
                return false;
            } else {
                if (!reg.test(this.phone)) {
                    //提示手机号不正确
                    this.showMsgBox('请输入正确的手机号');
                    return false;
                }
            }
            return true;
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
        }
    }
}

</script>
<style lang='less' scoped>
.cardManage_box {
    margin-top: 30px;
    .all_card_list {
        border-bottom: 1px solid rgba(70, 74, 94, 1);
        padding-bottom: 30px;
        margin-bottom: 20px;
        .card_list_item {
            width: 175px;
            height: 100px;
            background-color: #a68f77;
            border-radius: 10px;
            color: #654E33;
            font-size: 14px;
            padding: 20px 10px;
            line-height: 2;
            margin-right: 15px;
            margin-bottom: 15px;
            display: inline-block;
        }
    }
    
    .cardManage_controlls {
        margin: 30px 0;
        border-bottom: 1px solid rgba(40, 43, 58, .6);
        padding-bottom: 15px;
        .controlls_items {
            display: flex;
            font-size: 16px;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            color: #9198AC;
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
        }
    }
    .btn {
        position: relative;
        margin-bottom: 20px;
        .submit_btn {
            margin: 0 auto;
            width: 150px;
            height: 38px;
            line-height: 38px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            color: #5B3A0C;
            background-image: url(../../../assets/btn_bg.png)
        }
        .all_btn {
            position: absolute;
            left: 62%;
            top: 50%;
            transform: translateY(-50%);
            color: #B53132;
            text-decoration: underline;
            font-size: 14px;
        }
    }
    
}
</style>