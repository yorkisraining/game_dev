<!-- bank/miaocun 秒存通道 -->
<template>
    <div class="miaocun_box">

        <div class="item_box">
            <div class="item_title">存款到钱包：</div>
            <div class="item_contain saving_account">
                <el-select v-model="account">
                    <el-option
                        v-for="item in accountList"
                        :key="item.id"
                        :label="item.walletName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="item_box">
            <div class="item_title">存款金额：</div>
            <div class="item_contain saving_account">
                <input type="text" v-model="inputMoney" class="money_input" placeholder="请输入存款金额" @input="focusMoneyInput" />
                <div class="money_item" @click="changeMoney(100, 0)" :class="{'cur': moneyIndex == 0}">100</div>
                <div class="money_item" @click="changeMoney(500, 1)" :class="{'cur': moneyIndex == 1}">500</div>
                <div class="money_item" @click="changeMoney(1000, 2)" :class="{'cur': moneyIndex == 2}">1000</div>
                <div class="money_item" @click="changeMoney(2000, 3)" :class="{'cur': moneyIndex == 3}">2000</div>
            </div>
        </div>
        <div class="item_box">
            <div class="item_title">支付方式：</div>
            <div class="item_contain pay_methods">
                <el-radio v-for="(item,index) in payMethodList" @change="changePayPine(index)" :key="item.payway" v-model="payMethod" :label="item.payway">{{item.paywayName}}</el-radio>
            </div>
        </div>
        <div class="item_box">
            <div class="item_title">支付通道：</div>
            <div class="item_contain pay_pine">
                <div v-for="(item,index) in payPineList" :key="item.id"><el-radio v-model="payPine" :label="item.id" @change="changePriceLimit(index)"><div class="pine_item">通道{{index | filterIndex}}：{{item.name}}</div></el-radio></div>
                <div v-if="payPineList == null">无支付通道</div>
            </div>
        </div>
        <div class="item_box">
            <div class="item_title">选择优惠：</div>
            <div class="item_contain pay_discount">
                <el-radio v-model="discount" label="0">不申请优惠</el-radio>
                <el-radio v-for="item in discountList" :key="item.id" v-model="discount" :label="item.id">{{item.rewardName}}</el-radio>
            </div>
        </div>
        <div class="submit_btn" @click="submit">下&nbsp;&nbsp;一&nbsp;&nbsp;步</div>

        <form v-show="false" :action="url" method="post">
            <input v-for="item in dataForm" :key="item.name" :name="item.name" :value="item.value" type="text">
            <input type="submit" value="提交" ref="submitFormBtn">
        </form>

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
            account: '',
            accountList: [], //钱包列表
            moneyIndex: -1, //点击的选择框的钱则为选择框的index，否则为-1
            inputMoney: '', //输入的钱
            chooseMoney: '', //点击选择的钱
            payMethod: 0,
            payMethodList: [], //支付方式
            payPine: '1', //秒存通道
            payPineList: [],
            discount: '0', //优惠
            discountList: [],
            isShowMsgBox: false,
            msgBox: '',
            dataForm: [],
            url: '',
            minPrice: 100,
            maxPrice: 5000,
        };
    },
    components: {msgBox},
    created() {
        //初始化
        this.getInit();
    },
    watch: {
        account(newV) {
            this.changeDiscountList(newV);
        },
    },
    filters: {
        filterIndex(val) {
            switch (Number(val)) {
                case 0:
                    return '一';
                case 1:
                    return '二';
                case 2:
                    return '三';
                case 3:
                    return '四';
                case 4:
                    return '五';
                case 5:
                    return '六';
                case 6:
                    return '七';
                case 7:
                    return '八';
                case 8:
                    return '九';
            }
        }
    },
    methods: {
        changePayPine(index) {
            //change pay pine
            this.payPineList = this.payMethodList[index].channelList;
            if (this.payPineList != null) {
                this.payPine = this.payPineList[0].id;
            } else {
                this.payPine = undefined;
            }
            this.changePriceLimit(0);
        },
        changePriceLimit(index) {
            console.log(index, this.payPineList[index])
            this.minPrice = this.payPineList[index].minDeposit;
            this.maxPrice = this.payPineList[index].maxDeposit;
        },
        getInit() {
            //秒存通道初始化信息
            ajaxPost(apiUrl.secondaryChannelInit, {}, res => {
                res = res.data;
                this.accountList = res.acctList;
                this.changeMainWalletName();
                this.account = this.accountList[0].id;
                this.discountList = res.acctList[0].rewardRuleList;
                this.payMethodList = res.payway; // payway充值方式标识 ，paywayName充值方式名称
                this.payMethod = res.payway[0].payway;
                this.changePayPine(0);
            })
        },
        changeDiscountList(id) {
            for (let i=0; i<this.accountList.length; i++) {
                if (this.accountList[i].id == id) {
                    this.discountList = this.accountList[i].rewardRuleList;
                }
            }
        },
        changeMainWalletName() {
            for (let i=0; i<this.accountList.length; i++) {
                try {
                    if (this.accountList[i].mainFlag == 1) {
                        this.accountList[i].walletName = '主金库';
                        throw Error('break loop;;');
                    }
                } catch (error) {
                    
                }
            }
        },
        showMsgBox(val) {
            this.isShowMsgBox = true;
            this.msgBox = val;
        },
        closeMsgBox() {
            this.isShowMsgBox = false;
        },
        changeMoney(val, index) {
            this.chooseMoney = val;
            this.moneyIndex = index;
            this.inputMoney = val;
        },
        focusMoneyInput() {
            this.moneyIndex = -1;
        },
        submit() {
            // 判断充值金额
            let money = '';
            if (this.moneyIndex == -1) {
                //要输入框里的
                if (!this.inputMoney) {
                    // 提示输入价格
                    this.showMsgBox('请输入充值金额');
                    return false;
                }
                if (Number(this.inputMoney) < this.minPrice || Number(this.inputMoney) > this.maxPrice) {
                    this.showMsgBox(`充值金额范围在${this.minPrice}-${this.maxPrice}，请重新输入充值金额`);
                    return false;
                }
                money = this.inputMoney;
            } else {
                //要点击选择的
                money = this.chooseMoney;
            }
            
            //发起支付
            let dis = this.discount == 0 ? undefined : [this.discount];
            ajaxPost(apiUrl.secondaryChannelPay, {
                "acctId": this.account,
                "money": money,
                "payway": this.payMethod,
                "rewardRuleIds": dis, 
                "thirdpayId": this.payPine
            }, res => {
                if (res.code == 500) {
                    this.showMsgBox(res.msg);
                    return false;
                }
                let url = res.payUrl,
                    method = res.method,
                    data = res.data;
                this.url = url;
                if ('GET'===method) {
                  window.open(url)
                  return;
                }
                const _this = this
                function doIt() {
                    for (let key in data) {
                        _this.dataForm.push({
                            name: key,
                            value: data[key]
                        })
                    }
                }

                async function toIt() {
                    await doIt();
                    _this.$refs.submitFormBtn.click();
                }

                toIt();
            })
        },
    }
}

</script>
<style lang='less' scoped>
.miaocun_box {
    margin: 42px 0 0 50px;
    overflow: hidden;
    .item_box {
        display: flex;
        margin-bottom: 20px;
        .item_title {
            flex-shrink: 0;
            width: 120px;
            font-size: 16px;
            color: #9198AC;
        }
        .item_contain {
            font-size: 16px;
            color: #5C6376;
            &.saving_account {
                display: flex;
                .money_item {
                    width: 120px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border: 2px solid rgba(40,43,58,1);
                    border-radius: 4px;
                    margin-left: 18px;
                    cursor: pointer;
                    &.cur {
                        color: #EBD6AC;
                        border-color: #EBD6AC;
                    }
                }
                .money_input {
                    background-color: transparent;
                    border: 2px solid rgba(40,43,58,1);
                    border-radius: 4px;
                    padding-left: 20px;
                }
            }
            
            &.pay_methods {
                display: flex;
                .pay_icon {
                    height: 70px;
                }
            }

            &.pay_pine {
                div {
                   display: flex; 
                   .pine_item {
                        width: 450px;
                        height: 45px;
                        line-height: 45px;
                        padding-left: 20px;
                        border: 2px solid rgba(40,43,58,1);
                        border-radius: 4px;
                        margin-bottom: 18px;
                        display: inline-block;
                    }
                }
                
            }
        }
    }
    .submit_btn {
        float: right;
        width: 150px;
        height: 38px;
        line-height: 38px;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        color: #5B3A0C;
        background-image: url(../../../assets/btn_bg.png)
    }
}
</style>