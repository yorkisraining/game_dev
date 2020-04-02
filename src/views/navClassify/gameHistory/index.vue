<!-- gameHistory 游戏记录 -->
<template>
    <div class="game_his_box">
        <div class="result_table">
            <div class="result_table_head">
                <div v-for="(item, index) in tableHeadList" :key="index">{{item}}</div>
            </div>
            <div class="non_result" v-if="tableResult.length == 0">没有游戏记录</div>
            <div class="result_table_items" v-for="item in tableResult" :key="item.id" v-else>
                <div>{{item.gameName}}</div>
                <div>{{item.beginTime}}</div>
                <div>{{item.endTime}}</div>
                <div>{{item.validStake}}</div>
                <div>{{item.walletName}}</div>
                <div class="to_game_btn"><span @click="getGameUrl(item.gameId)" style="cursor: pointer">快速进入</span></div>
            </div>
            <div class="page">
                <el-pagination
                    layout="prev, pager, next"
                    :total="totalCount"
                    @current-change="changePage">
                </el-pagination>
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
            tableHeadList: ['游戏名称', '开始时间','结束时间','金币结算', '所属钱包',  '操作'],
            tableResult: [],
            totalCount: 10, //总条目数
            page: 1,
            limit: 10,
        };
    },
    filters: {
        filterPrice(val) {
            return val.toFixed(2);
        }
    },
    created() {
        this.getTableList();
    },
    methods: {
        getTableList() {
            //获取游戏记录
            ajaxGet(apiUrl.getGameRecord, {
                page: this.page,
                limit: this.limit,
                //params: 
            }, res => {
                if (res.code != 500) {
                    this.tableResult = res.page.list;
                    this.totalCount = res.page.totalCount;
                }
            })
        },
        changePage(page) {
            this.page = page;
            this.getTableList();
        },
        getGameUrl(id) {
            ajaxGet(`${apiUrl.getGameUrl}${id}`, {}, res => {
                if (res.code != 500) {
                    this.$router.push({
                        path: 'playGame',
                        query: {
                            src: res.data,
                            id: id,
                            height: document.documentElement.clientHeight,
                            sessionId: res.sessionId
                        }
                    })                    
                }
            })
        },
    }
}

</script>
<style lang='less' scoped>
.game_his_box {
    margin-top: 26px;
    .result_table {
        overflow: hidden;
        margin: 10px;
        .non_result {
            text-align: center;
            padding: 26px;
            color: #9198AC;
        }
        .result_table_head {
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
        .result_table_items {
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
                &.to_game_btn {
                    text-decoration: underline;
                }
            }
        }
        .page {
            margin-top: 32px;
            float: right;
        }
    }
    
}
</style>