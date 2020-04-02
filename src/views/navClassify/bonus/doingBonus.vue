<!-- bonus/doingBonus 进行中奖励 -->
<template>
    <div class="doingBonus_box">
        <div class="table_box">
            <div class="table_header">
                <div v-for="(item, index) in tableHeadList" :key="index">{{item}}</div>
            </div>
            <div class="non_result" v-if="tableResult.length == 0">没有进行中的奖励</div>
            <div class="table_items" v-for="item in tableResult" :key="item.id" v-else>
                <div>{{item.rewardName}}</div>
                <div>{{item.rewardCoin}}</div>
                <div>{{item.times}}</div>
                <div>{{item.triggerCoin}}</div>
                <div>{{item.depositCoin}}</div>
                <div>{{item.lackCoin}}</div>
                <div>{{item.endTime}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { ajaxPost, ajaxGet } from '@/common/js/public'
import { apiUrl } from '@/common/js/api'

export default {
    data () {
        return {
            tableHeadList: ['奖励名称', '奖励数量', '奖励倍数', '目标数额', '已完成数额', '剩余数额', '截止时间'],
            tableResult: []
        };
    },
    components: {},
    created() {
        this.getTableList();
    },
    methods: {
        getTableList() {
            //获取进行中的奖励
            ajaxGet(apiUrl.rewarding, {
                page: 1,
                limit: 20
            }, res => {
                if (res.code != 500) {
                    this.tableResult = res.page.list;
                }
            })
        }
    }
}

</script>
<style lang='less' scoped>
.doingBonus_box {
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
            }
        }
    }
}
</style>