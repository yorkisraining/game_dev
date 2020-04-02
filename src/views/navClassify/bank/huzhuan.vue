<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-01 17:50:30
 * @LastEditTime: 2019-08-14 14:43:58
 * @LastEditors: Please set LastEditors
 -->
<!-- bank/huzhuan 金币互转 -->
<template>
    <div class="huzhuan_box">
        <div class="huzhuan_title">
            各平台金箔（RMB）
            <div class="refresh_money" @click="refresh"><i class="el-icon-refresh" ></i>刷新金币</div>
        </div>
        <div class="huzhuan_account_wrap" >
            <div class="huzhuan_account" :style="{'width': accountWidth}">
                <div class="account_item"  v-for="item in accountList" :key="'a' + item.id">
                    <div>{{item.walletName}}</div>
                    <div>{{item.unusedCoin | filterMoney}}</div>
                </div>
            </div>
        </div>
        <div class="huzhuan_controlls">
            <div class="controlls_items">
                <div class="item_title">转出平台</div>
                <el-select v-model="outBank" :placeholder="holderIn">
                    <el-option
                        v-for="item in accountList"
                        :key="'b' + item.id"
                        :label="item.walletName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="controlls_items">
                <div class="item_title">转入平台</div>
                <el-select v-model="inBank" :placeholder="holderOut">
                    <el-option
                        v-for="item in accountList"
                        :key="'c' + item.id"
                        :label="item.walletName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="controlls_items">
                <div class="item_title">金额</div>
                <input type="text" v-model="price" class="item_input" placeholder="">
                <div class="limit_price">转账金额：1~999,999元</div>
            </div>
            <!-- <div class="controlls_items">
                <div class="item_title">交易密码</div>
                <input type="password" v-model="password" class="item_input" placeholder=""  autocomplete="new-password">
            </div> -->
        </div>
        <div class="btn">
            <div class="submit_btn" @click="submit">提&nbsp;&nbsp;&nbsp;交</div>
            <div class="all_btn">一键转入中心钱包</div>
        </div>

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
            accountList: [],
            inBank: '', //转入平台
            outBank: '', //转出平台
            holderIn: '',
            holderOut: '',
            price: '', //金额
            password: '',
            isShowMsgBox: false,
            msgBox: '',
            accountWidth: 0,
        };
    },
    filters: {
        filterMoney(val) {
            return val.toFixed(2);
        }
    },
    components: {msgBox},
    created() {
        //获取交易密码,如果没设置，提示去设置交易密码，设置了再加载
        /* ajaxGet(apiUrl.ifSetPayPass, {}, res => {
            if (res.code != 500) {
                if (res.data != 1) {
                    this.showMsgBox('您还没有设置交易密码，请先设置交易密码');
                    setTimeout(()=> {
                        this.closeMsgBox();
                        this.$router.push('/personal?id=2&nav=0');
                    }, 2000)
                } else {
                    this.getAccount();
                }
            }
        }) */
        this.getAccount();
    },
    methods: {
        refresh() {
            this.getAccount();
        },
        findWallet(id) {
            for (let i=0; i<this.accountList.length; i++) {
                if (this.accountList[i].id == id) {
                    return this.accountList[i];
                }
            }
        },
        changeMainWalletName(arr) {
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
        getAccount() {
            //获取各个账户信息
            ajaxGet(apiUrl.getWalletCoin, {}, res => {
                if (res.code != 500) {
                    this.accountList = res.acctInfoDto.acctInfoList;
                    this.changeMainWalletName();
                    //初始化inbank outbank,holderIn,holderOut为第一个账户
                    if (this.accountList.length > 8) {
                        this.inBank = this.outBank = this.accountList[0].id;
                        this.holderIn = this.holderOut = this.accountList[0].walletName;
                        this.accountWidth = this.accountList.length * 120 + 'px';
                        return false;
                    }
                    this.accountWidth = '100%';
                }
            })
        },
        showMsgBox(val) {
            this.isShowMsgBox = true;
            this.msgBox = val;
        },
        closeMsgBox() {
            this.isShowMsgBox = false;
        },
        submit() {
            //确认
            if (this.outBank != this.inBank) {
                if (Number(this.price) > 0 && Number(this.price) < 999999) {
                    //查找转出账户是否有那么多钱
                    if (Number(this.findWallet(this.outBank).unusedCoin) >= Number(this.price)) {
                        ajaxGet(apiUrl.coinInterturn, {
                            money: this.price,
                            //secondPsw: this.password,
                            acctInfoInId: this.inBank,
                            acctInfoOutId: this.outBank,
                        }, res => {
                            if (res.code == 500) {
                                this.showMsgBox(res.msg);
                                return false;   
                            }
                            this.price = '';
                            this.password = '';
                            //提示转入成功，刷新列表
                            this.showMsgBox('操作成功');
                            this.refresh();
                        })
                    } else {
                        //提示转出账户钱不足
                        this.showMsgBox('金币数量不正确，重新输入');
                    }
                } else {
                    //提示错误金额
                    this.showMsgBox('金币数量不正确，重新输入');
                }
            } else {
                //提示不能选择相同账户
                this.showMsgBox('不能选择相同账户');
            }
        }
    }
}

</script>
<style lang='less' scoped>
.huzhuan_box {
    margin-top: 30px;
    .huzhuan_title {
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #9198AC;
        font-size: 22px;
        position: relative;
        background-color: rgba(15,15,17,1);
        .refresh_money {
            color: #A95C36;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            i {
                margin-right: 5px;
                font-weight: bold;
            }
        }
    }
    .huzhuan_account_wrap {
        width: 100%;
        overflow-x: auto;
        .huzhuan_account {
            display: flex;
            .account_item {
                flex: 1;
                text-align: center;
                background-image: linear-gradient(145deg,rgba(19,20,34,0.68),rgba(19,20,34,0) );
                color: #9198AC;
                font-size: 16px;
                width: 120px;
                div {
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 1px solid #464A5E;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        &::-webkit-scrollbar{
            width: 5px;
            height: 5px;
        }
        &::-webkit-scrollbar-track{
            background: #f6f6f6;
            border-radius:2px;
        }
        &::-webkit-scrollbar-thumb{
            background: #aaa;
            border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb:hover{
            background: #747474;
        }
        &::-webkit-scrollbar-corner{
            background: #f6f6f6;
        }

    }
    
    .huzhuan_controlls {
        margin: 30px 0;
        border-bottom: 1px solid rgba(40, 43, 58, .6);
        .controlls_items {
            display: flex;
            font-size: 16px;
            align-items: center;
            justify-content: center;
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
            .limit_price {
                position: absolute;
                left: 76%;
                font-size: 14px;
                color: #556FB7;
            }
            .tips {
                color: #B53132;
                position: absolute;
                left: 76%;
                font-size: 14px;
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
            background-image: url(../../../assets/btn_bg.png);
        }
        .all_btn {
            position: absolute;
            left: 62%;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #B53132;
            text-decoration: underline;
        }
    }
    
}
</style>