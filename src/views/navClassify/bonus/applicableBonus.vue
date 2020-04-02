<!-- bonus/applicableBonus 可申请奖励 -->
<template>
    <div class="applicableBonus_box">
        <div class="table_box">
            <div class="table_header">
                <div v-for="(item, index) in tableHeadList" :key="index">{{item}}</div>
            </div>
            <div class="non_result" v-if="tableResult.length == 0">没有可申请的奖励</div>
            <div class="table_items" v-for="item in tableResult" :key="item.id" v-else>
                <div>{{item.rewardName}}</div>
                <div>{{item.rewardCoin}}</div>
                <div>{{item.times}}</div>
                <div>{{item.rewardCoin * item.times}}</div>
                <div class="btn-wrap"><div class="handle_btn" @click="apply(item.id)">领&nbsp;&nbsp;取</div></div>
            </div>
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
            tableHeadList: ['奖励名称', '奖励数量', '奖励倍数', '奖励条件', '操作'],
            tableResult: [],
            isShowMsgBox: false,
            msgBox: '',
        };
    },
    created() {
        this.getTable();
    },
    components: {msgBox},
    methods: {
        showMsgBox(val) {
            this.isShowMsgBox = true;
            this.msgBox = val;
        },
        closeMsgBox() {
            this.isShowMsgBox = false;
        },
        getTable() {
            //可领取奖励
            ajaxGet(apiUrl.receivableReward, {
                page: 1,
                limit: 100,
            }, res => {
                if (res.code != 500) {
                    this.tableResult = res.page.list;
                }
            })
        },
        apply(id) {
            //领取奖励
            ajaxGet(apiUrl.receiveReward, {
                id: id
            }, res => {
                if (res.code == 500) {
                    this.showMsgBox(res.msg);
                }
                this.cardList = res.list;
                this.getTable();
            })
        }
    }
}

</script>
<style lang='less' scoped>
.applicableBonus_box {
    margin: 50px 20px;
    .table_box {
        overflow: hidden;
        .non_result {
            text-align: center;
            padding: 26px;
            color: #9198AC;
        }
        .table_header {
            display: flex;
            div {
                flex: 1;
                height: 50px;
                line-height: 50px;
                padding-left: 10px;
                color: #9198AC;
                font-size: 16px;
                background-color: rgba(70, 74, 94, .13);
            }
        }
        .table_items {
            display: flex;
            text-align: left;
            color: #9198AC;
            font-size: 16px;
            div {
                flex: 1;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #464A5E;
                padding-left: 10px;
                background-image: linear-gradient(145deg,rgba(19,20,34,0.68),rgba(19,20,34,0) );
                &.btn-wrap {
                    display: flex;
                    align-items: center;
                }
            }
            .handle_btn {
                width: 120px;
                height: 38px;
                line-height: 38px;
                margin: 0 auto;
                border-radius: 4px;
                cursor: pointer;
                text-align: center;
                color: #5B3A0C;
                background-image: url(../../../assets/btn_bg.png);
            }
        }
    }
}
</style>