<!-- personal 个人信息 -->
<template>
    <div class="personal_box">
        <div class="nav">
            <div v-for="item in navList" :key="item.id" class="nav_item" :class="{'cur': curNav == item.id}" @click="() => {curNav = item.id}">{{item.title}}</div>
        </div>
        <div class="personal_contain">
            <baseMsg v-if="curNav == 0"></baseMsg>
            <loginPIN v-if="curNav == 1"></loginPIN>
            <TransactionPin v-if="curNav == 2"></TransactionPin>
        </div>
    </div>
</template>

<script>
import baseMsg from './base'
import loginPIN from './loginPIN'
import TransactionPin from './TransactionPin'

export default {
    data () {
        return {
            navList: [
                {
                    id: 0,
                    title: '基本信息'
                },{
                    id: 1,
                    title: '登录密码管理'
                },{
                    id: 2,
                    title: '交易密码管理'
                }
            ],
            curNav: 0
        };
    },
    created() {
        let query = this.$route.query;
        try {
            if (query.id) {
                this.curNav = Number(query.id);
            }            
        } catch (error) {
            
        }
    },
    components: {baseMsg, loginPIN, TransactionPin},
    methods: {
    }
}

</script>
<style lang='less' scoped>
.personal_box {
    color: #fff;
    padding: 0 50px;
    .nav {
        height: 66px;
        line-height: 66px;
        text-align: center;
        font-size: 16px;
        color: #9198AC;
        display: flex;
        border-bottom: 1px solid rgba(70,74,94,1);
        .nav_item {
            width: 150px;
            cursor: pointer;
            &.cur {
                color: #EBD6AC;
                border-bottom: 2px solid #EBD6AC;
            }
        }
    }
}
</style>