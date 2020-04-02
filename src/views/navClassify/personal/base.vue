<!-- personal/base 基本信息 -->
<template>
    <div class="base_box">
        <div class="base_controlls">
            <!-- <div class="controlls_items">
                <div class="item_title">账号: </div>
                <input type="text" v-model="userMsg.account" class="item_input" placeholder="">
            </div> -->
            <div class="controlls_items">
                <div class="item_title">姓名: </div>
                <input type="text" v-model="userMsg.username" class="item_input" placeholder="" :disabled="ifDisabled">
            </div>
            <div class="controlls_items">
                <div class="item_title">VIP级别: </div>
                <input type="text" disabled v-model="userMsg.level" class="item_input" placeholder="">
            </div>
            <div class="controlls_items">
                <div class="item_title">性别: </div>
                <el-select v-model="userMsg.gender" placeholder="" :disabled="ifDisabled">
                    <el-option label="男" value="0"></el-option>
                    <el-option label="女" value="1"></el-option>
                </el-select>
            </div>
            <div class="controlls_items">
                <div class="item_title">生日: </div>
                <el-date-picker
                    v-model="userMsg.birth"
                    type="date"
                    :disabled="ifDisabled"
                    class="item_input time">
                </el-date-picker>
            </div>
            <div class="controlls_items">
                <div class="item_title">邮箱: </div>
                <input type="text" v-model="userMsg.email" class="item_input" placeholder="" :disabled="ifDisabled">
            </div>
            <div class="controlls_items">
                <div class="item_title">电话: </div>
                <input type="text" v-model="userMsg.filterPhone" class="item_input" disabled placeholder="">
            </div>
            <div class="controlls_items">
                <div class="item_title">qq: </div>
                <input type="text" v-model="userMsg.qq" class="item_input" placeholder="" :disabled="ifDisabled">
            </div>
            <div class="controlls_items">
                <div class="item_title">微信: </div>
                <input type="text" v-model="userMsg.wechat" class="item_input" placeholder="" :disabled="ifDisabled">
            </div>
            <div class="tips controlls_items">
                以上信息请确保真实有效，后期方便提现和找回密码。如需修改，请联系客服。
            </div>
        </div>
        <div class="submit_btn" @click="submit" v-if="!ifDisabled">确&nbsp;&nbsp;&nbsp;认</div>

        <msgBox v-if="isShowMsgBox" :value="msgBox" @closeMsgBox="closeMsgBox"></msgBox>
        <msgBoxWithCancel v-if="isShowMsgBoxWithCancel" :value="msgBoxWithCancel" @closeMsgBoxWithCancel="closeMsgBoxWithCancel" @confirmMsgBoxWithCancel="confirmMsgBoxWithCancel"></msgBoxWithCancel>
    </div>
</template>

<script>
import { ajaxPost, ajaxGet } from '@/common/js/public'
import { apiUrl } from '@/common/js/api'
import msgBox from '@/components/msgBox'
import msgBoxWithCancel from '@/components/msgBoxWithCancel'

export default {
    data () {
        return {
            userMsg: {
                id: '',
                username: '',
                level: '',
                gender: '',
                birth: '',
                email: '',
                phone: '',
                filterPhone: '',
                wechat: '',
                qq: '',
            },
            isShowMsgBox: false,
            msgBox: '',
            isShowMsgBoxWithCancel: false,
            msgBoxWithCancel: '请确定所提交信息正确，将影响后期提现。如需修改个人信息，请联系客服',
            ifCancel: false,
            ifDisabled: false
        };
    },
    components: {msgBox, msgBoxWithCancel},
    created() {
        ajaxGet(apiUrl.userInfo, {}, res => {
            res = res.user;
            this.userMsg.phone = res.phone;
            let reg = /^(\d{3})\d{4}(\d{4})$/;
            this.userMsg.filterPhone =  String(res.phone).replace(reg, "$1****$2");
            if (res.vipName == null || !res.vipName) {
                this.userMsg.level = 'VIP1';
            } else {
                this.userMsg.level = 'VIP' + res.vipName
            }
            this.userMsg.id = res.id;
            if (res.birthday) {
                let nArr = res.name.split('');
                for (let i=0; i<nArr.length; i++) {
                    if (i != 0) {
                        nArr[i] = '*';
                    }
                }
                this.userMsg.username = nArr.join('');
                this.userMsg.gender = res.gender == 0 ? '0' : '1';
                this.userMsg.birth = res.birthday;
                this.userMsg.email = this.filterEmail(res.email);
                this.userMsg.wechat = res.weixin.substr(0,2) + '****' + res.weixin.substr(res.weixin.length - 2, res.weixin.length - 1)
                this.userMsg.qq = res.qq.substr(0,2) + '****' + res.qq.substr(res.qq.length - 2, res.qq.length - 1)

                this.ifDisabled = true;
            } else {
                let userObj = localStorage.getItem('userNoSaveMsg');
                if (userObj) {
                    JSON.parse(userObj);
                    this.userMsg.username = userObj.name;
                    this.userMsg.gender = userObj.gender == 0 ? '0' : '1';
                    this.userMsg.birth = userObj.birthday;
                    this.userMsg.email = userObj.email;
                    this.userMsg.qq = userObj.qq;
                    this.userMsg.wechat = userObj.weixin;
                }
            }
        })
    },
    methods: {
        filterEmail(val) {
            let arr = val.split('@'),
                arr2 = arr[0].split(''),
                newEmail = `${arr2[0]}****${arr2[arr2.length - 1]}@${arr[1]}`;
            return newEmail;
        },
        showMsgBox(val) {
            this.isShowMsgBox = true;
            this.msgBox = val;
        },
        closeMsgBox() {
            this.isShowMsgBox = false;
        },
        closeMsgBoxWithCancel() {
            this.isShowMsgBoxWithCancel = false;
            this.ifCancel = true;

            let msg = {
                'username': this.userMsg.username,
                'gender': this.userMsg.gender,
                'birth': this.userMsg.birth,
                'email': this.userMsg.email,
                'wechat': this.userMsg.wechat,
                'qq': this.userMsg.qq,
            };
            //保存信息
            localStorage.setItem('userNoSaveMsg', JSON.stringify(msg))
        },
        confirmMsgBoxWithCancel() {
            this.isShowMsgBoxWithCancel = false;
        },
        submit() {
            if (!this.userMsg.username || !this.userMsg.gender || !this.userMsg.birth || !this.userMsg.email || !this.userMsg.wechat || !this.userMsg.qq) {
                this.showMsgBox('请完善所有信息，否则无法提现');
                return false;
            }

            let mailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            if (!mailReg.test(this.userMsg.email) && this.userMsg.email != null && this.userMsg.email) {
                //提示邮箱不合理
                this.showMsgBox('请输入正确的邮箱地址')
                return false;
            }

            this.isShowMsgBoxWithCancel = true;

            if (!this.ifCancel) {
                ajaxPost(apiUrl.updateInfo, {
                    name: this.userMsg.username,
                    gender: this.userMsg.gender,
                    birthday: this.userMsg.birth,
                    email: this.userMsg.email,
                    phone: this.userMsg.phone,
                    qq: this.userMsg.qq,
                    weixin: this.userMsg.wechat,
                    id: this.userMsg.id
                }, res => {
                    //修改成功
                    if (res.code != 500) {
                        this.showMsgBox('修改成功');
                        localStorage.removeItem('userNoSaveMsg');
                    }
                })
            }
        }
    }
}

</script>
<style lang='less' scoped>
.base_box {
    margin-top: 16px;
    .base_controlls {
        padding: 0 50px;
        margin: 16px 0;
        border-bottom: 1px solid rgba(40, 43, 58, .6);
        .controlls_items {
            display: flex;
            font-size: 16px;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
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
                &.time {
                    border: none;
                    padding: 0;
                }
            }
            .can_use {
                color: #B53132;
                font-size: 14px;
                margin-left: 20px;
            }
            .refresh_money {
                color: #A95C36;
                cursor: pointer;
                font-size: 14px;
                margin-left: 20px;
                i {
                    margin-right: 5px;
                    font-weight: bold;
                }
            }
            .bind_card {
                color: #556fb7;
                text-decoration: underline;
                margin-left: 20px;
                cursor: pointer;
            }
            &.tips {
                margin: 16px;
                color: #b53132;
                font-size: 14px;
            }
        }
    }
    .submit_btn {
        width: 150px;
        height: 38px;
        line-height: 38px;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        color: #5B3A0C;
        background-image: url(../../../assets/btn_bg.png);
        margin: 20px auto;
    }
}
</style>