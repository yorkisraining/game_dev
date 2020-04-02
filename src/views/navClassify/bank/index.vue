<!-- bank 银行 -->
<template>
    <div class="bank_box">
        <div class="nav">
            <div v-for="item in navList" :key="item.id" class="nav_item" :class="{'cur': curNav == item.id}" @click="() => {curNav = item.id}">{{item.title}}</div>
        </div>
        <div class="bank_contain">
            <miaocun v-if="curNav == 0"></miaocun>
            <wangyin v-if="curNav == 1"></wangyin>
            <huzhuan v-if="curNav == 2"></huzhuan>
            <tibi v-if="curNav == 3" @toCardControl="toCardControl"></tibi>
            <cardManage v-if="curNav == 4"></cardManage>
            <transactionRecord v-if="curNav == 5"></transactionRecord>
        </div>
    </div>
</template>

<script>
import miaocun from './miaocun'
import wangyin from './wangyin'
import huzhuan from './huzhuan'
import tibi from './tibi'
import cardManage from './cardManage'
import transactionRecord from './transactionRecord'

export default {
    data () {
        return {
            navList: [
                {
                    id: 0,
                    title: '秒存通道'
                },{
                    id: 1,
                    title: '网银转账'
                },{
                    id: 2,
                    title: '金币互转'
                },{
                    id: 3,
                    title: '退币'
                },{
                    id: 4,
                    title: '银行卡管理'
                },{
                    id: 5,
                    title: '记录'
                }
            ],
            curNav: 0
        };
    },
    components: {miaocun, wangyin, huzhuan, tibi, cardManage, transactionRecord},
    created() {
        let query = this.$route.query;
        try {
            if (query.id) {
                this.curNav = Number(query.id);
                this.$router.push('/bank');
            }
        } catch (error) {
            
        }
    },
    watch: {
        $route() {
            let query = this.$route.query;
            try {
                if (query.id) {
                    this.curNav = Number(query.id);
                    this.$router.push('/bank');
                }
            } catch (error) {
                
            }
        }
    },
    methods: {
        toCardControl() {
            this.curNav = 4;
        }
    }
}

</script>
<style lang='less' scoped>
.bank_box {
    color: #fff;
    padding: 0 50px;
    .nav {
        height: 66px;
        line-height: 66px;
        text-align: center;
        font-size: 16px;
        color: #9198AC;
        display: flex;
        .nav_item {
            width: calc(100% / 6);
            cursor: pointer;
            border-bottom: 1px solid rgba(70,74,94,1);
            &.cur {
                color: #EBD6AC;
                border-bottom: 2px solid #EBD6AC;
            }
        }
    }
}
</style>