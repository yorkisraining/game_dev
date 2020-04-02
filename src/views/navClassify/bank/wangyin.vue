<!-- bank/wangyin 网银转账 -->
<template>
    <div class="wangyin_box">
        <div class="wangyin_block">
            <div class="wangyin_item">
                <div class="item_title">存款到钱包</div>
                <el-select v-model="account" @change="changeDiscountList">
                    <el-option
                        v-for="item in accountList"
                        :key="'account' + item.id"
                        :label="item.walletName"
                        :value="item.id"
                        >
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="wangyin_block">
            <div class="wangyin_item">
                <div class="item_title">收款银行：</div>
                <!-- <el-select v-model="recipientBank" placeholder="工商银行">
                    <el-option
                        v-for="item in recipientBankList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select> -->
                <div class="item_div_with_border">{{receive.bankName}}</div>
            </div>
            <div class="wangyin_item">
                <div class="item_title">收款人姓名：</div>
                <div class="item_div_with_border">{{receive.recipientName}}</div>
                <div class="item_copy" @click="copy(receive.recipientName)">复制</div>
            </div>
            <div class="wangyin_item">
                <div class="item_title">开户银行地址：</div>
                <div class="item_div_with_border">{{receive.openBankAddress}}</div>
                <div class="item_copy" @click="copy(receive.openBankAddress)">复制</div>
            </div>
            <div class="wangyin_item">
                <div class="item_title">卡号：</div>
                <div class="item_div_with_border">{{receive.cardNo}}</div>
                <div class="item_copy" @click="copy(receive.cardNo)">复制</div>
            </div>
        </div>
        <div class="wangyin_block">
            <div class="wangyin_item">
                <div class="item_title red">历史银行：</div>
                <el-select v-model="send.hisBank" @change="autoFillSendMsg">
                    <el-option
                        v-for="item in send.hisBankList"
                        :key="'bank' + item.id"
                        :label="item.bankName"
                        :value="item.id"
                        >
                    </el-option>
                </el-select>
            </div>
            <div class="wangyin_item">
                <div class="item_title">汇款方式：</div>
                <!-- <el-select v-model="send.methods" placeholder="请选择">
                    <el-option
                        v-for="item in send.methodsList"
                        :key="'methods' + item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select> -->
                <input type="text" value="网银转账" class="item_input item_div_with_border" disabled>
            </div>
            <div class="wangyin_item">
                <div class="item_title">汇款人姓名：</div>
                <input type="text" v-model="send.name" class="item_input item_div_with_border" placeholder="">
                <div class="item_remark">* 请与所填银行卡开户人姓名一致</div>
            </div>
            <div class="wangyin_item">
                <div class="item_title">汇款银行：</div>
                <input type="text" v-model="send.bank" class="item_input item_div_with_border" placeholder="">
                <!-- <el-select v-model="send.bank" placeholder="工商">
                    <el-option
                        v-for="item in send.bankList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select> -->
            </div>
            <div class="wangyin_item">
                <div class="item_title">汇款人银行卡：</div>
                <input type="text" v-model="send.cardId" class="item_input item_div_with_border" placeholder="">
                <div class="item_remark">* 请输入您使用的汇款银行卡账号</div>
            </div>
            <div class="wangyin_item">
                <div class="item_title">银行开户省份：</div>
                <v-distpicker @selected="onSelectedArea" hide-area></v-distpicker>
            </div>
            <div class="wangyin_item">
                <div class="item_title">汇款金额：</div>
                <input type="text" v-model="send.price" class="item_input item_div_with_border" placeholder="">
                <div class="item_remark">* 最低汇款限额8元</div>
            </div>
            <div class="wangyin_item">
                <div class="item_title">汇款附言：</div>
                <input type="text" v-model="send.remark" class="item_input item_div_with_border" placeholder="">
            </div>
            <div class="wangyin_item">
                <div class="item_title">选择优惠：</div>
                <div class="item_discount">
                    <el-radio v-model="send.discount" label="0">不申请优惠</el-radio>
                    <el-radio v-model="send.discount" :label="item.id" v-for="item in send.discountList" :key="'discount' + item.id">{{item.rewardName}}</el-radio>
                </div>
            </div>
        </div>
        <div class="submit_btn" @click="submit">提&nbsp;&nbsp;&nbsp;交</div>

        <msgBox v-if="isShowMsgBox" :value="msgBox" @closeMsgBox="closeMsgBox"></msgBox>
    </div>
</template>

<script>
import { ajaxPost, ajaxGet } from '@/common/js/public'
import { apiUrl } from '@/common/js/api'
import msgBox from '@/components/msgBox'
import VDistpicker from 'v-distpicker'

export default {
    data () {
        return {
            account: '', //账户
            accountList: [],
            recipientBank: '', //收款银行
            recipientBankList: [],
            receive: {
                id: '',
                recipientName: '', //收款人姓名
                openBankAddress: '', //开户行地址
                cardId: '', //卡号
                bankName: '', //收款银行
                cardNo: ''
            },
            send: {
                hisBankList: [], //历史银行
                hisBank: '',
                methodsList: [],  //汇款方式
                methods: 1,
                name: '', //汇款人姓名
                /* bankList: [], //汇款银行 */
                bank: '', //银行名称
                cardId: '', //汇款人银行卡号
                price: '', //汇款金额
                remark: '', //汇款附言
                discount: '0', //优惠
                discountList: [],//优惠信息
                area: {
                    province: '',
                    city: ''
                }, //区域
            }, //汇款人信息
            isShowMsgBox: false,
            msgBox: '',
        };
    },
    components: {msgBox, VDistpicker},
    created() {
        this.init();
    },
    methods: {
        init() {
            ajaxPost(apiUrl.bankPayChannelInit, {}, res => {
                if (res.code != 500) {
                    res = res.data;
                    this.accountList = res.acctList;
                    //this.account = this.accountList[0].id;
                    this.changeMainWalletName();
                    this.changeDiscountList();
                    this.recipientBank = res.platformBankcard == null ? '' : res.platformBankcard.bankName;
                    this.autoFillRecieveMsg(res.platformBankcard);
                    this.send.hisBankList = res.userBankcards;
                    if (this.send.hisBankList.length > 0) {
                        this.send.hisBank = this.send.hisBankList[0].id;
                    }
                    console.log(this.send.hisBankList)
                    this.autoFillSendMsg(this.send.hisBank);
                }
            })
        },
        changeMainWalletName() {
            for (let i=0; i<this.accountList.length; i++) {
                if (this.accountList[i].mainFlag == 1) {
                    this.accountList[i].walletName = '主金库';
                    this.account = this.accountList[i].id;
                }
            }
        },
        changeDiscountList() {
            for (let i=0; i<this.accountList.length; i++) {
                if (this.accountList[i].id == this.account) {
                    this.send.discountList = this.accountList[i].rewardRuleList;
                }
            }
        },
        onSelectedArea(data) {
            //获取城市
            this.send.area.province = data.province.value;
            this.send.area.city = data.city.value;
        },
        autoFillRecieveMsg(arr) {
            //改变收款人信息
            if (arr != null) {
                this.receive.id = arr.id
                this.receive.recipientName = arr.cardOwner;
                this.receive.openBankAddress = arr.openBankName;
                this.receive.cardNo = arr.cardNo;
                this.receive.cardId = arr.id;
                this.receive.bankName = arr.bankName;
            }
        },
        autoFillSendMsg(id) {
            for (let i=0; i<this.send.hisBankList.length; i++) {
                if (this.send.hisBankList[i].id == id) {
                    let arr = this.send.hisBankList[i];
                    this.send.bank = arr.bankName;
                    this.send.name = arr.cardOwner;
                    this.send.cardId = arr.cardNo;
                }
            }
        },
        submit() {
            if (!this.account) {
                //提示选择收款银行
                this.showMsgBox('请选择收款银行');
                return false;
            }
            if (!this.send.methods || !this.send.name || !this.send.bank || !this.send.cardId || !this.send.price) {
                //提示完整填写汇款信息
                this.showMsgBox('请整填写汇款信息');
                return false;
            }
            ajaxPost(apiUrl.bankingChannel, {
                "acctId": this.account, //账户id
                "bankName": this.send.bank,
                "cardNo": this.send.cardId,
                "cardOwner": this.send.name,
                "money": this.send.price,
                "openCity": this.send.area.province,
                "openProvince": this.send.area.city,
                "platformBankcardId": this.receive.id, //收款卡id
                "remark": this.send.remark,
                "remitId": 1,
                "rewardRuleIds": this.send.discount == 0 ? [] : [this.send.discount],
            }, res => {
                if (res.code == 500) {
                    this.showMsgBox(res.msg);
                    return false;
                }
                this.showMsgBox('操作成功');
                this.$router.push(`/bank?id=5`);
            })
        },
        copy(val) {
            this.copyToClipboard(String(val));
        },
        showMsgBox(val) {
            this.isShowMsgBox = true;
            this.msgBox = val;
        },
        closeMsgBox() {
            this.isShowMsgBox = false;
        },
        copyToClipboard (text) {
            if(text.indexOf('-') !== -1) {
                let arr = text.split('-');
                text = arr[0] + arr[1];
            }
            var textArea = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
            alert(msg);
            } catch (err) {
                alert('该浏览器不支持点击复制到剪贴板');
            }
            document.body.removeChild(textArea);
        }
    }
}

</script>
<style lang='less' scoped>
.wangyin_box {
    margin: 42px 0;
    overflow: hidden;
    .wangyin_block {
        border-bottom: 2px dotted rgba(70, 74, 94, .7);
        margin-bottom: 20px;
        padding: 0 50px;
        &:last-child {
            border: none;
        }
        .wangyin_item {
            display: inline-flex;
            align-items: center;
            font-size: 16px;
            margin-bottom: 20px;
            width: calc((100% - 5px) / 2);
            color: #5C6376;
            .item_title {
                width: 120px;
                margin-right: 14px;
                color: #9198AC;
                flex-shrink: 0;
                &.red {
                    color: #B53132;
                }
            }
            .item_div_with_border {
                width: 180px;
                height: 38px;
                line-height: 38px;
                border: 1px solid rgba(40,43,58,1);
                border-radius: 4px;
                padding-left: 10px;
                margin-right: 18px;
            }
            .item_copy {
                width: 80px;
                height: 38px;
                line-height: 38px;
                border: 1px solid rgba(92,79,64,1);
                border-radius: 4px;
                color: #5C4F40;
                text-align: center;
                cursor: pointer;
            }
            .item_input {
                background-color: transparent;
            }
            .item_remark {
                font-size: 14px;
                color: #B53132;
                max-width: 120px;
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
