<!-- mail 站内信 -->
<template>
    <div class="mail_box">
        <div class="controlls_group">
            <div class="btn" @click="read">标记已读</div>
            <div class="btn" @click="del">删除</div>
        </div>
        <div class="result_table">
            <div class="result_table_head">
                <div class="all_checked"><el-checkbox v-model="allChecked"></el-checkbox></div>
                <div>名称</div>
                <div>发件人</div>
                <div>时间</div>
            </div>
            <div class="no_msg" v-if="tableResult.length == 0">{{tipsMsg}}</div>
            <div class="result_table_items" v-for="(item, index) in tableResult" :key="item.id" :class="{'noRead': item.status == 2}" v-else>
                <div><el-checkbox v-model="item.checked"></el-checkbox></div>
                <div><span @click.stop="toDetail(item.status, item.id, item.messContent, index)">{{item.messTitle}}</span></div>
                <div>{{item.updateUserName}}</div>
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
            allChecked: false, //全选
            tableResult: [],
            totalCount: 10,
            limit: 10,
            page: 1,
            tipsMsg: '加载中...',
        };
    },
    watch: {
        allChecked(newV, oldV) {
            if (newV) {
                this.tableResult.forEach(element => {
                    return element.checked = true;  
                });
            } else {
                this.tableResult.forEach(element => {
                    return element.checked = false;  
                });
            }
        }
    },
    created() {
        this.getTableList();
        /* 0作废；1已读；2未读 */
    },
    methods: {
        toDetail(status, id, detail, index) {
            this.$alert(`${detail}`, {
                dangerouslyUseHTMLString: true
            });
            if (status == 2) {
                ajaxPost(apiUrl.readMail, [id], res => {
                    let r = this.tableResult;
                    r[index].status = 1;
                    this.tableResult = r;

                    let noRead = Number(this.$store.state.aModule.emailUnread - 1);
                    this.$store.commit('aModule/changeNoReadMailData', noRead);
                })
            }
        },
        ifCheck() {
            let checkList = [];
            this.tableResult.forEach(val => {
                if (val.checked && val.status == 2) {
                    checkList.push(val.id);
                }
            });
            return checkList;
        },
        read() {
            let checkList = this.ifCheck();
            if (checkList.length > 0) {
                //发送请求标记已读
                ajaxPost(apiUrl.readMail, checkList, res => {
                    if (res.code != 500) {
                        this.$alert('操作成功');
                        this.getTableList();
                        let noRead = Number(this.$store.state.aModule.emailUnread - checkList.length);
                        this.$store.commit('aModule/changeNoReadMailData', noRead);
                    }
                })
            }
        },
        del() {
            let checkList = this.ifCheck();
            if (checkList.length > 0) {
                //发送请求删除
                ajaxGet(apiUrl, {
                    id: checkList
                }, res => {
                    //刷新列表

                })
            }
        },
        getTableList() {
            ajaxGet(apiUrl.mail, {
                page: this.page,
                limit: this.limit
            }, res => {
                if (res.code != 500) {
                    if (res.page.list.length == 0) {
                        this.tipsMsg = '没有站内信';
                    } else {
                        this.tipsMsg ='加载中...';
                    }
                    res.page.list.forEach(val => {
                        return val['checked'] = false;
                    })
                    this.tableResult = res.page.list;
                    this.totalCount = res.page.totalCount;
                }
                
            })
        },
        changePage(page) {
            this.page = page;
            this.getTableList();
        },
    }
}

</script>
<style lang='less' scoped>
.mail_box {
    margin: 32px;
    .controlls_group {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 32px;
        .btn {
            width: 150px;
            height: 38px;
            line-height: 38px;
            margin-right: 16px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            color: #5B3A0C;
            background-image: url(../../../assets/btn_bg.png);
        }
    }
    .result_table {
        overflow: hidden;
        .result_table_name {
            cursor: pointer;
        }
        .result_table_head {
            display: flex;
            div {
                width: 30%;
                height: 50px;
                line-height: 50px;
                padding-left: 10px;
                color: #9198AC;
                font-size: 16px;
                background-color: rgba(70, 74, 94, .13);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .all_checked {
                width: 10%;
            }
        }
        .no_msg {
            color: #9198AC;
            text-align: center;
            padding: 26px 0;
        }
        .result_table_items {
            display: flex;
            text-align: left;
            color: rgba(145, 152, 172, .5);
            font-size: 16px;
            &.noRead {
                font-weight: bolder;
                color: rgba(145, 152, 172, 1);
            }
            div {
                width: 30%;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #464A5E;
                padding-left: 10px;
                background-image: linear-gradient(145deg,rgba(19,20,34,0.68),rgba(19,20,34,0) );
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:first-child {
                    width: 10%;
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