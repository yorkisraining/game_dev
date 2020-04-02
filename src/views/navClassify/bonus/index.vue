<!-- bonus 奖金 -->
<template>
    <div class="bonus_box">
        <div class="nav">
            <div v-for="item in navList" :key="item.id" class="nav_item" :class="{'cur': curNav == item.id}" @click="() => {curNav = item.id}">{{item.title}}</div>
        </div>
        <div class="bonus_contain">
            <applicableBonus v-if="curNav == 0"></applicableBonus>
            <doingBonus v-if="curNav == 1"></doingBonus>
            <bonusHis v-if="curNav == 2"></bonusHis>
        </div>
    </div>
</template>

<script>
import applicableBonus from './applicableBonus'
import doingBonus from './doingBonus'
import bonusHis from './bonusHis'

export default {
    data () {
        return {
            navList: [
                {
                    id: 0,
                    title: '可申请奖励'
                },{
                    id: 1,
                    title: '进行中奖励'
                },{
                    id: 2,
                    title: '奖励记录'
                }
            ],
            curNav: 0
        };
    },
    components: {applicableBonus, doingBonus, bonusHis},
    methods: {
    }
}

</script>
<style lang='less' scoped>
.bonus_box {
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