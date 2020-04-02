<!-- transactionRecord -->
<template>
    <div class="transactionRecord_box">
        <div class="search_box">
            <div class="search_conditions_box">
                <div class="conditions_item">
                    <div class="item_title">支付方式：</div>
                    <el-select v-model="payMethod" placeholder="">
                        <el-option
                            v-for="item in payMethodsList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="conditions_item">
                    <div class="item_title">交易方式：</div>
                    <el-select v-model="dealMethod" placeholder="">
                        <el-option
                            v-for="item in dealMethodsList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>     
                <div class="conditions_item">
                    <div class="item_title">交易时间：</div>
                    <el-date-picker
                        v-model="dealTime"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </div>   
                <div class="conditions_item">
                    <div class="item_title">交易状态：</div>
                    <el-select v-model="dealStatus" placeholder="">
                        <el-option
                            v-for="item in dealStatusList"
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
            <div class="non_result" v-if="tableResult.length == 0">没有交易记录</div>
            <div class="result_table_items" v-for="item in tableResult" :key="item.id" v-else>
                <div>{{item.rechargeWay | filterPayway}}</div>
                <div>{{item.operateType | filterRechargeWay}}</div>
                <div>{{item | filterStatus}}</div>
                <div>{{item.orderCoin | filterPrice}}</div>
                <div>{{item.outWalletName}}</div>
                <div>{{item.inWalletName}}</div>
                <div>{{item.createTime}}</div>
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
            payMethodsList: [
                {
                    id: 0,
                    label: '请选择',
                    value: ''
                },
                {
                    id: 1,
                    label: '第三方充值',
                    value: 1
                },
                {
                    id: 2,
                    label: '银行卡转账',
                    value: 2
                },
                {
                    id: 3,
                    label: '手动',
                    value: 3
                },
            ], //支付方式
            payMethod: '',
            dealMethodsList: [
                {
                    id: 0,
                    label: '请选择',
                    value: ''
                },
                {
                    id: 1,
                    label: '充值',
                    value: 1
                },
                {
                    id: 2,
                    label: '转账',
                    value: 2
                },
                {
                    id: 3,
                    label: '奖励',
                    value: 3
                },
                {
                    id: 3,
                    label: '兑换',
                    value: 4
                },
                {
                    id: 3,
                    label: '提现',
                    value: 5
                },
                {
                    id: 3,
                    label: '扣减',
                    value: 6
                }
            ], //交易方式
            dealMethod: '',
            dealTime: '',
            dealStatus: '',
            dealStatusList: [
                {
                    id: 0,
                    label: '请选择',
                    value: ''
                },
                {
                    id: 1,
                    label: '失败',
                    value: 0
                },
                {
                    id: 2,
                    label: '成功',
                    value: 1
                },
                {
                    id: 3,
                    label: '交易中',
                    value: 2
                },
                {
                    id: 4,
                    label: '待支付',
                    value: 4
                }],
            tableHeadList: ['支付方式', '交易方式', '状态', '数量', '转出', '转入', '时间'],
            tableResult: [],
            totalCount: 100,
            page: 1,
            limit: 10,
        };
    },
    filters: {
        filterPrice(val) {
            if (val != null) {
                return val.toFixed(2);
            }
        },
        filterStatus(val) {
            if (val.operateType == 1 && val.status == 2) {
                return '待支付';
            }
            switch (Number(val.status)) {
                case 0:
                    return '失败'
                case 1:
                    return '成功'
                case 2:
                    return '交易中'
            }
        },
        filterRechargeWay(val) {
            if(val != null) {
                switch (Number(val)) {
                    case 1:
                        return '充值'
                    case 2:
                        return '转账'
                    case 3:
                        return '奖励'
                    case 4:
                        return '兑换'
                    case 5:
                        return '提取'
                    case 6:
                        return '扣减'
                }
            }
            return '';
        },
        filterPayway(val) {
            if(val != null) {
                switch (Number(val)) {
                    case 1:
                        return '第三方充值'
                    case 2:
                        return '银行卡转账'
                    case 3:
                        return '手动'
                }
            }
            return '';
        }
    },
    created() {
        this.getTableList();
    },
    methods: {
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
            ajaxGet(apiUrl.getCoinRecord, param, res => {
                if (res.code != 500) {
                    this.tableResult = res.page.list;
                    this.totalCount = res.totalCount;
                }
               
            })
        },
        changePage(page) {
            this.page = page;
            this.getTableList();
        },
        timestampToTime(timestamp) {
            try {
                var date = timestamp,
                    Y = date.getFullYear() + '-',
                    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
                    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ',
                    h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':',
                    m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':',
                    s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + '';
                return Y + M + D + h + m + s;
            } catch (error) {
                return ''
            }
        },
        search() {
            let status = this.dealStatus,
                operateType = this.dealMethod;
            if (status == 4) {
                status = 2;
                operateType = 1;
            }
            this.getTableList({
                rechargeWay: this.payMethod,
                operateType: operateType,
                createTime: this.dealTime,
                status: this.dealStatus,
            });
        }
    }
}

</script>
<style lang='less' scoped>
.transactionRecord_box {
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
                display: inline-flex;
                align-items: center;
                margin-right: 20px;
                margin-top: 20px;
                .item_title {
                    width: 100px;
                }
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
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .page {
            margin-top: 32px;
            float: right;
        }
    }
    
}
</style>