<!-- bonus/bonusHis 奖励记录 -->
<template>
    <div class="bonusHis_box">
        <div class="search_box">
            <div class="search_conditions_box">
                <div class="conditions_item">
                    <div class="item_title">奖励名称：</div>
                    <input type="text" v-model="bonusName" class="item_input" placeholder="">
                </div>
                <!-- <div class="conditions_item">
                    <div class="item_title">奖励额度：</div>
                    <el-select v-model="bonusQuota" placeholder="">
                        <el-option
                            v-for="item in bonusQuotaList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>      -->
                <div class="conditions_item">
                    <div class="item_title">时间：</div>
                    <el-date-picker
                        v-model="bonusTime"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </div>   
                <div class="conditions_item">
                    <div class="item_title">状态：</div>
                    <el-select v-model="bonusStatus" placeholder="">
                        <el-option
                            v-for="item in bonusStatusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>            
            </div>
            <div class="search_btn" @click="search">搜&nbsp;&nbsp;&nbsp;索</div>
        </div>
        <div class="result_table">
            <div class="result_table_head">
                <div v-for="(item, index) in tableHeadList" :key="index">{{item}}</div>
            </div>
            <div class="non_result" v-if="tableResult.length == 0">没有奖励记录</div>
            <div class="result_table_items" v-for="item in tableResult" :key="item.id" v-else>
                <div>{{item.rewardName}}</div>
                <div>{{item.rewardCoin}}</div>
                <div>{{item.times}}</div>
                <div>{{item.rewardCoin * item.times}}</div>
                <div>{{item.rewardFlag | filterStatus}}</div>
                <div>{{item.updateTime}}</div>
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
            bonusName: '', //名称
            bonusTime: '',
            bonusStatus: '',
            bonusStatusList: [{
                    id: 0,
                    label: '未完成',
                    value: 0
                },
                {
                    id: 1,
                    label: '已领取',
                    value: 1
                },
                {
                    id: 2,
                    label: '未领取',
                    value: 2
                }],
            tableHeadList: ['奖励名称', '奖励额度', '奖励倍数', '目标数额', '状态', '时间'],
            tableResult: [],
            totalCount: 100,
            page: 1,
            limit: 10,
        };
    },
    filters: {
        filterPrice(val) {
            return val.toFixed(2);
        },
        filterStatus(val) {
            //0未完成；1已完成；2未领取
            switch (Number(val)) {
                case 0:
                    return '未完成';
                case 1:
                    return '已领取';
                case 2:
                    return '未领取';
            }
            return status;
        }
    },
    components: {},
    created() {
        this.getTableList();
    },
    methods: {
        timestampToTime(timestamp) {
            var date = new Date(parseInt(timestamp)),
                Y = date.getFullYear() + '-',
                M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
                D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
            return Y + M + D ;
        },
        getTableList(param) {
            if (param) {
                param['page'] = this.page;
                param['limit'] = this.limit;
            } else {
                param = {
                    page: this.page,
                    limit: this.limit
                }
            }
            //奖励记录
            ajaxGet(apiUrl.getRewardRecord, param, res => {
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
        search() {
            this.getTableList({
                rewardName: this.bonusName,
                beginTime: this.bonusTime != '' ? this.timestampToTime(new Date(this.bonusTime).getTime()) : '',
                rewardFlag: this.bonusStatus,
            });
        }
    }
}

</script>
<style lang='less' scoped>
.bonusHis_box {
    margin-top: 10px;
    .search_box {
        display: flex;
        align-items: flex-end;
        margin-bottom: 30px;
        .search_conditions_box {
            color: #9198AC;
            font-size: 16px;
            width: calc(100% - 150px - 20px);
            .conditions_item {
                display: flex;
                align-items: center;
                margin-right: 20px;
                margin-top: 20px;
                .item_title {
                    width: 100px;
                }
            }
            .item_input {
                width: 220px;
                height: 38px;
                line-height: 38px;
                border: 1px solid rgba(40,43,58,1);
                border-radius: 4px;
                padding-left: 10px;
                background-color: transparent;
            }
        }
        .search_btn {
            width: 150px;
            height: 38px;
            line-height: 38px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            color: #5B3A0C;
            background-image: url(../../../assets/btn_bg.png);
        }
    }

    .result_table {
        overflow: hidden;
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
            }
        }
        .page {
            margin-top: 32px;
            float: right;
        }
    }
    
}
</style>