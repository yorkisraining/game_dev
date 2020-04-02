<!-- bank/tibi 提币 -->
<template>
    <div class="tibi_box">
        <div class="tibi_controlls">
            <div class="controlls_items">
                <div class="item_title">退款卡号: </div>
                <el-select v-model="cardId" placeholder="请选择">
                    <el-option
                        v-for="item in cardList"
                        :key="item.id"
                        :label="item.cardNo"
                        :value="item.id">
                    </el-option>
                </el-select>
                <div class="bind_card" v-if="cardList.length == 0" @click="toCardControl">请至少添加一张银行卡</div>
            </div>
            <div class="controlls_items">
                <div class="item_title">退款金额: </div>
                <input type="text" v-model="price" class="item_input" placeholder="">
                <div class="can_use">当前余额：{{canPrice}}</div>
                <div class="refresh_money" @click="getCanUsePrice"><i class="el-icon-refresh" ></i>点击刷新</div>
            </div>
            <div class="controlls_items">
                <div class="item_title">交易密码: </div>
                <input type="password" v-model="password" class="item_input" placeholder=""  autocomplete="new-password">
            </div>
            <div class="submit_btn" @click="submit">提&nbsp;&nbsp;&nbsp;交</div>
        </div>
        <!-- <div class="tips">
            <p>友情提示：</p>
            <p>当天500元以下提币，第一笔免收手续费，第二笔开始收取10%的手续费。</p>
            <p>当天500元以上提币，无需任何手续费，提币无上限。</p>
        </div> -->

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
            cardList: [],
            cardId: '', //提币卡号
            price: '',
            password: '',
            canPrice: 0,
            isShowMsgBox: false,
            msgBox: '',
        };
    },
    components: {msgBox},
    created() {
        //获取交易密码,如果没设置，提示去设置交易密码，设置了再加载
        ajaxGet(apiUrl.ifSetPayPass, {}, res => {
            if (res.code != 500) {
                if (res.data != 1) {
                    this.showMsgBox('您还没有设置交易密码，请先设置交易密码');
                    setTimeout(()=> {
                        this.closeMsgBox();
                        this.$router.push('/personal?id=2&nav=0');
                    }, 2000)
                    return false;
                }
                //获取银行卡
                ajaxGet(apiUrl.getUserCard, {}, res => {
                    if (res.code == 500) {
                        return false;
                    }
                    this.cardList = res.list;
                    if (this.cardList.length > 0) {
                        this.cardId = this.cardList[0]['cardNo'];
                    }
                    /*  else {
                        //没有银行卡，提示去添加银行卡
                        this.showMsgBox('请至少绑定1张银行卡');
                        setTimeout(()=> {
                            this.closeMsgBox();
                            this.$router.push('/bank?id=5');
                        }, 2000)
                        return false;
                    } */
                })
                this.getCanUsePrice();
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
        toCardControl() {
            this.$emit('toCardControl');
        },
        getCanUsePrice() {
            //可提币金额
            ajaxGet(apiUrl.getBalance, {}, res => {
                if (res.code != 500) {
                    this.canPrice = res.balance;
                }
            })
        },
        submit() {
            if (this.cardList.length == 0) {
                //提示添加银行卡
                this.showMsgBox('请添加银行卡');
                return false;   
            }
            if (Number(this.price) <= 0 || Number(this.price) > this.canPrice) {
                //提示输入合理的提币金额
                this.showMsgBox('退币数额不正确，重新输入');
                return false;
            }
            /* if (Number(this.price) > this.canPrice) {
                //提示余额不足
                this.showMsgBox('余额不足');
                return false;
            } */
            ajaxGet(apiUrl.coinReturn, {
                userBankCardId: this.cardId,
                money: this.price,
                secondPsw: this.password
            }, res => {
                if (res.code == 500) {
                    //提示交易密码错误
                    if (res.msg == '验证密码错误') {
                        this.showMsgBox('交易密码不正确，重新输入');
                    } else {
                        this.showMsgBox(res.msg);
                    }
                    return false;
                }
                //提示成功
                this.showMsgBox('操作成功，请等待管理员审核');
                this.getCanUsePrice();
                this.price = '';
                this.password = '';
            })
        }
    }
}

</script>
<style lang='less' scoped>
.tibi_box {
    .tibi_controlls {
        padding: 0 50px;
        margin: 30px 0;
        border-bottom: 1px solid rgba(40, 43, 58, .6);
        .controlls_items {
            display: flex;
            font-size: 16px;
            align-items: center;
            margin-bottom: 20px;
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
            .can_use {
                color: #B53132;
                font-size: 14px;
                margin-left: 20px;
            }
            .refresh_money {
                color: #A95C36;
                cursor: pointer;
                font-size: 14px;
                margin-left: 20px;
                i {
                    margin-right: 5px;
                    font-weight: bold;
                }
            }
            .bind_card {
                color: #556fb7;
                text-decoration: underline;
                margin-left: 20px;
                cursor: pointer;
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
            margin: 30px 100px;
        }
    }
    
    .tips {
        padding: 0 50px;
        color: #A95C36;
        font-size: 14px;
        line-height: 2;
    }
}

</style>