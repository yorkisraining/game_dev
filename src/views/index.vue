<!-- index -->
<template>
    <div class="index" @click="globalClick" :style="{'min-height': clientH}">
        <div class="index_header contain_1200" @click="returnToIndex">
            <div class="logo_box">
                <img src="@/assets/logo.png" alt="" class="logo_img">
            </div>
            <div class="controlls_box" v-if="!ifLogin">
                <div class="controlls_lock"></div>
                <div class="controlls_input">
                    <input type="text" v-model="username" :placeholder="userNamePlaceHolder" @focus="() => {userNamePlaceHolder = ''}" @blur="() => {userNamePlaceHolder = '用户名或手机号'}">
                    <img class="captcha_img" :src="captchaPath" @click="getCaptcha()" alt="">
                </div>
                <div class="controlls_input">
                    <input type="password" v-model="password" :placeholder="passwordPlaceHolder" @focus="() => {passwordPlaceHolder = ''}" @blur="() => {passwordPlaceHolder = '密码'}">
                    <input type="text" class="captcha" v-model="captcha" :placeholder="captchaPlaceHolder" @keyup.enter="login" @focus="() => {captchaPlaceHolder = ''}" @blur="() => {captchaPlaceHolder = '验证码'}">
                </div>
                <div class="login_and_signup">
                    <div class="login" @click.stop="login">登录</div>
                    <div class="forget_psw" @click="() => {showMsgBox('请联系客服</br>电话：400900879')}">忘记密码</div>
                    <div @click="() => {ifShowHelpDetail = true}" class="online_open"><img src="@/assets/livechat.png" /></div> 
                </div>
            </div>
            <div class="controlls_box" v-else>
                <div class="controlls_item_left">
                    <div class="controlls_item_top">
                        <div class="user_count" @click="openPopup('')">我的账户</div>
                        <div class="username" @click="openPopup('')">{{username}}</div>
                    </div>
                    <div class="controlls_item_bottom">
                        <div class="ele_with_border money">
                            <div @mouseover.stop="() => {ifShowMoneyDetail = true}" @mouseout.stop="() => {ifShowMoneyDetail = false}">余额：{{totalMoney}}</div>
                            <div class="money_detail" v-show="ifShowMoneyDetail" @mouseover.stop="() => {ifShowMoneyDetail = true}" @mouseout.stop="() => {ifShowMoneyDetail = false}">
                                <div class="money_detail_item" v-if="moneyList.length == 0">无</div>
                                <div class="money_detail_item" v-for="item in moneyList" :key="'money' + item.id">{{item.walletName}}: {{item.unusedCoin}}</div>
                            </div>
                        </div>
                        <div class="ele_with_border" @click="toBank">银行</div>
                    </div>
                </div>
                <div class="login_and_signup">
                    <div class="exit" @click="exit">退出</div>
                    <el-badge :value="emailUnread">
                        <div class="email" @click="toMail">站内信</div>
                    </el-badge>
                    <div @click="() => {ifShowHelpDetail = true}" class="online_open"><img src="@/assets/livechat.png" /></div>
                </div>
            </div>
        </div>
        <!-- 轮播图 -->
        <div class="carousel_box" @mouseout="() => {noticeBar.ifShow = false}">
            <div class="notice_bar" @mousemove="changeNoticeDetail">
                <transition name="slide">
                    <p class="notice_bar_item no_break" :key="noticeBarText.id">{{noticeBarText.val}}</p>
                </transition>
            </div>
            <div class="all_notice" @mouseout="() => {noticeBar.ifShow = false}" @mousemove="() => {noticeBar.ifShow = true}" v-if="noticeBar.ifShow">
                <transition name="fade">
                    <div class="notice_detail" v-html="noticeBar.nowDetail"></div>
                </transition>
            </div>
            <el-carousel height="350px">
                <el-carousel-item v-for="item in bannerImgList" :key="'banner' + item.id">
                    <img :src="item.url" class="banner_img">
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="main_contain">
            <div class="play_game_holder_img" v-if="!ifLogin" @click="toLoginMsgBox">
                <img src="@/assets/index_game_holder.gif" />
            </div>
            <div class="play_game_box" id="completeDiv" v-else>
                <iframe id="google_ads_frame2" name="google_ads_frame2" width="100%" :height="gameFrames.minH" frameborder="0" :src="gameFrames.gameSrc" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="auto" allowfullscreen="true"></iframe>
            </div>
        </div>

        <!-- 在线帮助 -->
        <!-- <transition name="helpFade"> -->
        <div class="help_box_wrap" @mouseover.stop="() => {ifShowHelpDetail = true}" @mouseout.stop="() => {ifShowHelpDetail = false}" :class="{'show_more': ifShowHelpDetail}">
            <!-- <div class="help_box" v-if="ifLogin && !ifShowHelpDetail"> -->
            <div class="help_box" v-if="!ifShowHelpDetail">
                <div class="no_read" v-if="emailUnread > 0">{{emailUnread}}</div>
                <div class="title">在线帮助</div>
            </div>
            <!-- 在线帮助详细 -->
            <div class="help_detail_box">
                <div class="help_detail_with_border">
                    <div class="help_detail_item">
                        <p>客服站内信</p>
                        <div @click.stop="toMail">未读消息 <span class="red" v-if="emailUnread > 0"> ({{emailUnread}})</span></div>
                    </div>
                    <div class="help_detail_item">
                        <div @click="showOnlineHelp">
                            <img src="@/assets/kefu.png" class="kefu" :class="{'bigIcon': enlargeHelpIcon}" @mouseenter="() => {enlargeHelpIcon = true}" @mouseleave="() => {enlargeHelpIcon = false}" />
                            <p>在线客服</p>
                        </div>
                    </div>
                    <div class="help_detail_item">
                        <p>qq</p>
                        <div class="kefu_phone">客服1：84871-21947</div>
                        <div class="kefu_phone">客服2：84871-21947</div>
                    </div>
                    <div class="help_detail_item">
                        <p>微信客服</p>
                        <img src="@/assets/qrCode.png" />
                    </div>
                    <div class="help_detail_item">
                        <p>邮箱</p>
                        <div>kefu@gmail.com</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- </transition> -->

        <!-- 个人中心弹弹窗 -->
        <transition name="fade">
            <div class="personal_popup" v-show="ifShowPopup">
                <div class="personal_popup_nav">
                    <div class="nav_item" v-for="item in personalNavList" :key="'person' + item.id" :class="{'cur': personalNavCur == item.id}" @click="toThisPopupRoute(item.name, item.id)">{{item.title}}</div>
                </div>
                <div class="person_popup_contain">
                    <router-view />
                </div>
                <div class="close_popup" @click="closePopup">×</div>
            </div>
        </transition>

        <!-- 公告弹窗 -->
        <transition name="fade">
            <div class="notice_popup" v-if="ifShowNotice">
                <div class="notice_main_contain_box">
                    <el-carousel height="300px" :autoplay="false">
                        <el-carousel-item v-for="item in noticeList" :key="'no' + item.id">
                            <div class="contain_title">{{item.messTitle}}</div>
                            <div class="contain_text" v-html="item.messContent"></div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="notice_controlls">
                    <div class="notice_btn" @click="closeNotice">关闭</div>
                    <div class="notice_btn" @click="closeNotice(true)">不再提醒</div>
                </div>
            </div>
        </transition>
        
        <div class="footer">
            <div class="contain_1200">
                <ul class="link_list">
                    <li @click="newWindows('privacy')">隐私政策</li>
                    <li @click="newWindows('response')">负责任博彩</li>
                    <li>联系我们</li>
                    <li @click="newWindows('about')">关于我们</li>
                    <li @click="newWindows('helpCenter')">帮助中心</li>
                </ul>
                <div class="copyright">CopyrightC2019版权所有</div>
            </div>
        </div>

        <!-- 遮罩 -->
        <div class="shade" v-show="ifShowShade" :style="{height: clientH}"></div>
        <div class="shadeForMsgBox" v-show="ifShowShadeForShade" :style="{height: clientH}"></div>
        <div id="circle_loading" v-if="ifShowLoading"></div>

        <msgBox v-if="isShowMsgBox" :value="msgBox" @closeMsgBox="closeMsgBox"></msgBox>

    </div>
</template>

<script>
import { ajaxPost, ajaxGet } from '@/common/js/public'
import { apiUrl } from '@/common/js/api'
import http from '@/common/js/httpRequest'
import userProtocol from '@/components/userProtocol'
import msgBox from '@/components/msgBox'
import titleMsg from '@/components/titleMsg'

export default {
    data () {
        return {
            clientH: 0,
            ifLogin: false, //是否登录
            username: '', //登录和登录完成后用
            userNamePlaceHolder: '用户名或手机号',
            password: '',
            passwordPlaceHolder: '密码',
            uuid: '', //验证码uuid
            captchaPath: '', //验证码图片
            captcha: '', //验证码
            captchaPlaceHolder: '验证码',
            totalMoney: 0, //金币
            //emailUnread: '', //站内信未读
            bannerImgList: [{
                id: 'imglb1',
                url: require('@/assets/banner.png')
            }], //轮播图
            moneyList: [], //钱包列表
            ifShowMoneyDetail: false, //是否显示钱包列表
            personalNavList: [
                {
                    id: 0,
                    name: 'personal',
                    title: '个人信息'
                },{
                    id: 1,
                    name: 'bank',
                    title: '银行'
                },{
                    id: 2,
                    name: 'bonus',
                    title: '奖金'
                },{
                    id: 3,
                    name: 'integral',
                    title: '积分'
                },{
                    id: 4,
                    name: 'gameHistory',
                    title: '游戏记录'
                },{
                    id: 5,
                    name: 'mail',
                    title: '站内信'
                },
            ],
            personalNavCur: 0, //个人中心导航索引
            ifShowPopup: false, //个人中心弹窗
            noticeList: [], //通知列表
            ifShowNotice: false, //通知弹窗
            isShowMsgBox: false,
            msgBox: '',
            noticeBar: {
                list: [],//['1 第一条公告', '2 第二条公告第二条公告', '3 第三条公告第三条公告第三条公告'], //公告栏
                number: 0,
                timer: null,
                ifShow: false,
                nowDetail: '',
                detailList: [],
            },
            ifShowShade: false, //遮罩
            ifShowShadeForShade: false, //遮罩
            ifShowHelpDetail: false, //在线帮助详情展开
            overNavOffsetTop: false, //是否把导航黏住
            gameFrames: {
                gameSrc: '',
                minH: '',
                id: 900,
                sessionId: '',
            },
            enlargeHelpIcon: false,
            ifShowLoading: false,
        };
    },
    created() {

        if (localStorage.getItem('tokenExpire') > new Date().getTime() || sessionStorage.getItem('tokenExpire') > new Date().getTime()) {
            if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
                this.ifLogin = true;
                ajaxGet(apiUrl.userInfo, {}, res => {
                    if (res.code != 500) {
                        this.username = res.user.name;
                    }
                })
            }
        }
        
        //获取验证码
        if (!this.ifLogin) {
            this.getCaptcha(); 
        }

        if (this.ifLogin) {
            this.getGameUrl();
            //公告
            this.getNotice();
            //弹出公告
            this.getPopupList();
            //金币
            this.getMoneyList();
            //站内信
            this.getUnreadMail();

            if (this.$route.path == '/') {
                if (localStorage.getItem('ifOpenNotice') !== 'false' || sessionStorage.getItem('ifOpenNotice') !== 'false') {
                    //打开通知弹窗
                    this.openNotice();
                }
            }
            if (this.$route.path != '/') {
                let p = this.$route.path.split('/')[1],
                    query = this.$route.query,
                    id = query.id != undefined ? query.id : 0;
                this.$router.push(`${this.$route.path}?id=${id}`);
                switch (p) {
                    case 'personal':
                        this.personalNavCur = 0;
                        break;
                    case 'bank':
                        this.personalNavCur = 1;
                        break;
                    case 'bonus':
                        this.personalNavCur = 2;
                        break;
                    case 'integral':
                        this.personalNavCur = 3;
                        break;
                    case 'gameHistory':
                        this.personalNavCur = 4;
                        break;
                    case 'mail':
                        this.personalNavCur = 5;
                        break;
                    default:
                        this.personalNavCur = 0;
                        break;
                }
                this.ifShowPopup = true;
                this.stopMove();
                this.ifShowShade = true;
            }
            
        }

        this.clientH = document.documentElement.clientHeight + 'px';    
        
        // 获取轮播图
        ajaxGet(apiUrl.banner, {}, res => {
            this.bannerImgList = res.list;
        })

    },
    mounted() {
        document.querySelector('.lim_float_icon').style.display = 'none';
        setTimeout(() => {
            document.querySelector('#lim_mini').style.display = 'none';
        }, 1000)

        this.startMove();

        const _this = this;
        function logoutGameAsyncFalse() {
            if (_this.ifLogin) {
                var oAjax = new XMLHttpRequest();

                oAjax.open('GET', `${apiUrl.logoutGame}${_this.gameFrames.id}?sessionId=${_this.gameFrames.sessionId}`, false);//false表示同步请求
                let token = localStorage.getItem('token') || sessionStorage.getItem('token');
                oAjax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                oAjax.setRequestHeader("appToken", token);

                oAjax.onreadystatechange = function() {
                    if (oAjax.readyState == 4 && oAjax.status == 200) {
                    }
                };

                oAjax.send();
            }
        }

        window.addEventListener('unload', logoutGameAsyncFalse);

    },
    beforeDestroy() {
        this.logoutGame();
    },
    computed: {
        noticeBarText () {
            return {
                id: this.noticeBar.number,
                val: this.noticeBar.list[this.noticeBar.number]
            }
        },
        emailUnread: {
            get: function() {
                return this.$store.state.aModule.emailUnread;
            },
        }
    },
    watch: {
        $route() {
            let query = this.$route.query;
            try {
                if (query.nav) {
                    this.personalNavCur = Number(query.nav);
                }
            } catch (error) {
                
            }
        }
    },
    components: {msgBox, userProtocol, titleMsg},
    methods: {
        returnToIndex() {
            //回到主页
            this.$router.push('/');
        },
        toLoginMsgBox() {
            this.showMsgBox('请先登录');
        },
        logoutGame() {
            if (this.ifLogin) {
                ajaxGet(`${apiUrl.logoutGame}${this.gameFrames.id}?sessionId=${this.gameFrames.sessionId}`, {}, res => {
                    console.log('logout===', res);
                })
            }
           
        },
        getGameUrl() {
            ajaxGet(`${apiUrl.getGameUrl}${this.gameFrames.id}`, {}, res => {
                if (res.code != 500) {
                    this.gameFrames.gameSrc = res.data;
                    this.gameFrames.minH = document.documentElement.clientHeight;
                    this.gameFrames.sessionId = res.sessionId;
                }
            })
        },
        showOnlineHelp() {
            document.querySelector('.lim_float_icon').style.display = 'block';
            document.querySelector('.lim_float_icon').style.visibility = 'visible';
        },
        getUnreadMail() {
            ajaxGet(apiUrl.mail, {
                status: 2,
                page: 1,
                limit: 100
            }, res => {
                if (res.code != 500) {
                    let emailUnread = res.page.list.length > 0 ? res.page.list.length : '';
                    this.$store.commit('aModule/changeNoReadMailData', emailUnread)
                }
            })
        },
        formatActiveTime(val) {
            let t = val.split(' ')[0].split('-');
            return `${t[0]}</br>${t[1]}-${t[2]}`;
        },
        // 获取验证码
        getCaptcha() {
            this.uuid = this.getUUID()
            this.captchaPath = http.adornUrl(`${apiUrl.baseURL}/captcha.jpg?uuid=${this.uuid}`);
            this.captcha = '';
        },
        getUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
            })
        },
        getMoneyList() {
            //各账户金币数
            ajaxGet(apiUrl.getWalletCoin, {}, res => {
                if (res.code != 500) {
                    this.moneyList = res.acctInfoDto.acctInfoList;
                    this.totalMoney = res.acctInfoDto.totalCoin;
                    for (let i=0; i<this.moneyList.length; i++) {
                        try {
                            if (this.moneyList[i].mainFlag == 1) {
                                this.moneyList[i].walletName = '中心钱包';
                                throw Error('break loop;;');
                            }
                        } catch (error) {
                            
                        }
                    }
                }
            })
        },
        startMove () {
            //公告滚动
            if (this.noticeBar.list.length > 1) {
                this.noticeBar.timer = setTimeout(() => {
                    if (this.noticeBar.number === this.noticeBar.list.length - 1) {
                        this.noticeBar.number = 0;
                    } else {
                        this.noticeBar.number += 1;
                    }
                    this.startMove();
                }, 2000); // 滚动不需要停顿则将2000改成动画持续时间
            }
        },
        getNotice() {
            ajaxGet(apiUrl.notice, {}, res => {
                if (res.code != 500) {
                    for (let i=0; i<res.list.length; i++) {
                        this.noticeBar.list.push(`${res.list[i].messTitle}`);
                        this.noticeBar.detailList.push(`${res.list[i].messContent}`);
                    }
                    
                }
            })
        },
        changeNoticeDetail() {
            this.noticeBar.nowDetail = this.noticeBar.detailList[this.noticeBar.number];
            this.noticeBar.ifShow = true;
        },
        stopMove() {
            clearTimeout(this.noticeBar.timer);
        },
        globalClick() {
            this.ifShowMoneyDetail = false;
            //this.ifShowHelpDetail = false;
        },
        login() {
            if (this.username == '') {
                //提示输入用户名
                this.showMsgBox('请输入用户名');
                return false;
            }
            if (this.password == '') {
                //提示输入密码
                this.showMsgBox('请输入密码');
                return false;
            }
            if (this.captcha == '') {
                //提示输入密码
                this.showMsgBox('请输入验证码');
                return false;
            }
            ajaxPost(apiUrl.login, {
                userCode: this.username,
                password: this.password,
                code: this.captcha,
                uuid: this.uuid,
            }, res => {
                if (res.code == 500) {
                    //提示密码错误
                    this.getCaptcha();
                    this.showMsgBox(res.msg);
                    return false;
                }
                //登录成功，切换状态，存一堆东西
                /* this.showMsgBox('登录成功'); */
                ajaxGet(apiUrl.userInfo, {}, res => {
                    if (res.code != 500) {
                        this.username = res.user.name;
                    }
                })
                localStorage.setItem('token', res.token);
                sessionStorage.setItem('token', res.token);
                let expire = new Date().getTime() + res.expire * 1000;
                localStorage.setItem('tokenExpire', expire);
                sessionStorage.setItem('tokenExpire', expire);
                this.ifLogin = true;
                this.getGameUrl();
                //公告
                this.getNotice();
                //弹出公告
                this.getPopupList();
                //金币
                this.getMoneyList();
                //站内信
                this.getUnreadMail();
                this.ifShowShade = true;
                this.ifShowLoading = true;
                setTimeout(() => {
                    this.ifShowShade = false;
                    this.ifShowLoading = false;
                }, 2000);
            })
        },
        showMsgBox(val) {
            this.isShowMsgBox = true;
            this.msgBox = val;
            this.ifShowShadeForShade = true;
        },
        closeMsgBox() {
            this.isShowMsgBox = false;
            this.ifShowShadeForShade = false;
        },
        exit() {
            ajaxGet(`${apiUrl.logoutGame}${this.gameFrames.id}?sessionId=${this.gameFrames.sessionId}`, {}, res => {
                ajaxGet(apiUrl.logout, {}, res => {})
            })
            setTimeout(() => {
                //清空状态
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                localStorage.removeItem('tokenExpire');
                sessionStorage.removeItem('tokenExpire');
                localStorage.removeItem('ifOpenNotice');
                sessionStorage.removeItem('ifOpenNotice');
                this.getCaptcha();
                this.username = '';
                this.password = '';
                this.captcha = '';
                this.ifLogin = false;
            }, 500);
        },
        closeProtocol() {
            //关闭用户协议
            this.isShowProtocol = false;
        },
        toThisUrl(url) {
            this.$router.push(url);
        },
        toAccount() {
            //去我的账户
            this.openPopup('bank', 1);
        },
        toBank() {
            //去银行
            this.openPopup('bank', 1);
        },
        toMail() {
            if (this.ifLogin) {
                //去站内信
                this.ifShowHelpDetail = false; //关掉在线帮助
                this.openPopup('mail', 5);
            }
        },
        getPopupList() {
            //获取公告弹窗
            ajaxGet(apiUrl.getPopup, {
            }, res => {
                if (res.code != 500) {
                    this.noticeList = res.list;
                }
            })
        },
        closePopup() {
            //关闭弹窗
            this.$router.push('/');
            this.ifShowPopup = false;
            this.canMove();
            this.ifShowShade = false;
        },
        openPopup(name, id) {
            if (name != '') {
                this.$router.push(`/${name}`);
                this.personalNavCur = id;
            } else {
                this.$router.push(`/personal`);
                this.personalNavCur = 0;
            }
            this.ifShowPopup = true;
            this.stopMove();
            this.ifShowShade = true;
        },
        toThisPopupRoute(name, id) {
            this.$router.push(`/${name}`);
            this.personalNavCur = id
        },
        stopMove() {
            document.body.style.overflow = 'hidden';
            document.addEventListener("touchmove", e => {
                e.preventDefault();
            }, false);
        },
        canMove() {
            document.body.style.overflow = '';
            document.removeEventListener("touchmove", e => {
                e.preventDefault();
            }, false);
        },
        openNotice() {
            this.ifShowNotice = true;
            this.ifShowShade = true;
        },
        closeNotice(flag) {
            this.ifShowNotice = false;
            this.ifShowShade = false;

            if (flag) {
                //flag 为true时不再弹出
                localStorage.setItem('ifOpenNotice', 'false');
                sessionStorage.setItem('ifOpenNotice', 'false');
            }
        },
        newWindows(path) {
            const { href } = this.$router.resolve({
                name: path,
            });
            window.open(href, '_blank');
        }
    }
}

</script>
<style lang='less' scoped>
    .index {
        height: 100%;
        font-size: 18px;
        &.hidden {
            overflow: hidden;
        }
        .index_header {
            height: 100px;
            display: flex;
            justify-content: space-between;
            .captcha_img {
                width: 172px;
                height: 38px;
                border: 1px solid transparent;
                border-radius: 4px;
                margin-top: 10px;
            }
            .logo_box {
                width: 200px;
                height: 100%;
                padding: 15px 0;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .controlls_box {
                display: flex;
                color: #50576C;
                font-size: 16px;
                .controlls_input {
                    width: 172px;
                    height: 38px;
                    border: 1px solid rgba(48,53,79,1);
                    margin-right: 20px;
                    margin-top: 10px;
                    color: #50576C; 
                    .captcha {
                        width: 172px;
                        height: 38px;
                        border: 1px solid #30354f;
                        margin-right: 20px;
                        margin-top: 10px;
                        color: #50576C;
                    }
                    input {
                        background-color: transparent;
                        border: none;
                        width: 100%;
                        height: 100%;
                        text-align: left;
                        padding-left: 10px;
                        &::-webkit-input-placeholder {
                            font-size: 14px;
                        }
                    }

                }
                .login_and_signup {
                    display: flex;
                    margin-left: 16px;
                    height: 38px;
                    line-height: 38px;
                    margin-top: 10px;
                    position: relative;
                    padding-right: 20px;
                    cursor: pointer;
                    .login {
                        color: rgba(255, 216, 165, 1);
                        padding-right: 0 16px;
                        position: relative;
                        &:hover {
                            background-color: rgba(99, 104, 135, .8);
                        }
                    }
                    .forget_psw {
                        position: absolute;
                        text-decoration: underline;
                        color: rgba(85, 111, 183, 1);
                        margin-top: 16px;
                        text-align: center;
                        cursor: pointer;
                        top: 30px;
                        font-size: 12px;
                        &:hover {
                            background-color: rgba(99, 104, 135, .8);
                        }
                    }
                    .online_open {
                        position: absolute;
                        top: 30px;
                        left: 55px;
                        font-size: 12px;
                        margin-top: 16px;
                        img {
                            width: 60px;
                            height: 100%;
                        }
                    }
                    .exit {
                        margin-right: 26px;
                        padding-right: 26px;
                        position: relative;
                        color: #7e869c;
                        &::after {
                            content: "";
                            width: 2px;
                            height: 20px;
                            background-color: rgba(99,104,135,1);
                            position: absolute;
                            right: 0;
                            top: 50%;
                            transform: translateY(-50%)
                        }
                    }
                    .email {
                        position: relative;
                        color: #7e869c;
                        .unread {
                            position: absolute;
                            top: 0;
                            right: -16px;
                            width: 20px;
                            height: 20px;
                            line-height: 20px;
                            text-align: center;
                            border-radius: 50%;
                            background-color: #f32626;
                            color: #fff;
                            font-size: 14px;
                        }
                        background-color: transparent;
                    }
                }
                
                .controlls_item_left {
                    text-align: center;
                    margin-top: 15px;
                    cursor: pointer;
                    .controlls_item_top {
                        overflow: hidden;
                        div {
                            float: right;
                            min-width: 130px;
                            text-align: center;
                        }
                        .username {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 24px;
                            color: #7e869c;
                            vertical-align: middle;
                        }
                        .user_count {
                            text-decoration: underline;
                            color: #7e869c;
                        }
                    }
                    .controlls_item_bottom {
                        .ele_with_border {
                            float: right;
                            border: 1px solid rgba(48,53,79,1);
                            border-radius: 4px;
                            color: #ffd8a5;
                            margin-top: 10px;
                            height: 38px;
                            line-height: 38px;
                            width: 130px;
                            margin-left: 10px;
                            &.money {
                                text-decoration: underline;
                                position: relative;
                                .money_detail {
                                    position: absolute;
                                    z-index: 1995;
                                    color: #C7AB90;
                                    font-size: 18px;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    background-color: rgba(48, 53, 79, .8);
                                    .money_detail_item {
                                        padding: 0 10px;
                                        height: 30px;
                                        line-height: 30px;
                                        width: 170px;
                                        border: 1px solid rgba(48,53,79,1);
                                        text-align: left;
                                        padding-left: 4px;
                                        margin-bottom: 4px;
                                        &:last-child {
                                            margin: 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .signup {
                    color:rgba(226,148,113,1);
                }
            }
        }
        .main_contain {
            .play_game_holder_img {
                padding: 0 50px;
                img {
                    width: 100%;
                }
            }
        }
        .carousel_box {
            min-width: 1200px;
            position: relative;
            .banner_img {
                width: 100%;
                height: 100%;
            }

            .notice_bar {
                width: 100%;
                height: 30px;
                line-height: 30px;
                margin: 0 auto;
                overflow: hidden;
                position: absolute;
                top: 0;
                z-index: 888;
                text-align: center;
                background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,.6), rgba(0,0,0,0));
                color: #B53132;
                font-size: 16px;
                cursor: pointer;
                .notice_bar_item {
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                }
                .no_break {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                }
            }

            .all_notice {
                width: 100%;
                margin: 0 auto;
                position: absolute;
                top: 30px;
                z-index: 888;
                text-align: center;
                background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,.6), rgba(0,0,0,0));
                color: #B53132;
                font-size: 16px;
                cursor: pointer;
                .notice_detail {
                    line-height: 1.5;
                }
            }
            
            .slide-enter-active, .slide-leave-active {
                transition: all 0.5s linear;
            }
            .slide-enter{
                transform: translateY(20px);
                opacity: 1;
            }
            .slide-leave-to {
                transform: translateY(-50px);
                opacity: 0;
            }
        }

        .personal_popup {
            position: fixed;
            top: 10%;
            left: 50%;
            z-index: 1994;
            transform: translateX(-50%);
            max-width: 1200px;
            min-width: 1000px;
            width: 80%;
            .personal_popup_nav {
                display: flex;
                border-top: 1px solid #232433;
                .nav_item {
                    width: calc(100% / 6);
                    height: 66px;
                    background-color: #131422;
                    text-align: center;
                    line-height: 66px;
                    font-size: 18px;
                    color: #FDD6A3;
                    cursor: pointer;
                    &.cur {
                        background-color: #040304;
                    }
                }
            }
            .person_popup_contain {
                height: 80vh;
                max-height: 860px;
                overflow-y: auto;
                background-image: url(../assets/bg.png);
                background-size: 100%;
            }
            .close_popup {
                position: absolute;
                top: 10px;
                right: 10px;
                color: #fff;
                cursor: pointer;
            }
        }
        .shade {
            background-color: rgba(0, 0, 0, .7);
            width: 100%;
            z-index: 1992;
            position: fixed;
            top: 0;
        }
        .shadeForMsgBox {
            background-color: rgba(0, 0, 0, .7);
            width: 100%;
            z-index: 19490930;
            position: fixed;
            top: 0;
        }

        .notice_popup {
            width: 410px;
            background-image: url(../assets/bg.png);
            background-size: cover;
            position: fixed;
            z-index: 199506;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .notice_img {
                width: 100%;
                height: 163px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .notice_main_contain_box {
                margin: 32px 16px;
                border-bottom: 1px solid rgba(40, 43, 58, .36);
                overflow-x: auto;
                .contain_title {
                    font-size: 22px;
                    color: #EBD6AC;
                    text-align: center;
                    padding-bottom: 16px;
                    border-bottom: 2px solid #EBD6AC;
                    margin-bottom: 20px;
                }
                .contain_text {
                    font-size: 16px;
                    color: #949BB0;
                    line-height: 1.5;
                }
            }
            .notice_controlls {
                display: flex;
                justify-content: center;
                margin-bottom: 16px;
                .notice_btn {
                    width: 120px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border-radius: 4px;
                    color: #5C3925;
                    border: 1px solid #5C3925;
                    margin-left: 70px;
                    cursor: pointer;
                    &:first-child {
                        margin: 0;
                    }
                }
            }
        }
        .fade-enter-active, .fade-leave-active {
            transition: opacity .4s;
        }
        .fade-enter, .fade-leave-to {
            opacity: 0;
        }

        .help_box_wrap {
            position: fixed;
            right: -190px;
            top: 15%;
            /* transform: translateY(-50%); */
            z-index: 1991;
            width: 190px;
            transition: right .4s;
            &.show_more {
                right: 0;
            }
        }
        .help_box {
            width: 50px;
            height: 110px;
            background-color: rgba(164, 136, 96, 1);
            padding: 7px;
            text-align: center;
            position: absolute;
            left: -50px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 666;
            border-radius: 4px 0 0 4px;
            cursor: pointer;
            .no_read {
                position: absolute;
                top: -15px;
                left: -15px;
                height: 30px;
                width: 30px;
                text-align: center;
                line-height: 30px;
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .6);
                border-radius: 50%;
                background-color: #F32626;
                color: rgba(255, 227, 116, 1);
            }
            .title {
                color: rgba(255, 227, 116, 1);
                border: 1px solid rgba(255, 255, 255, .3)
            }
        }

        .help_detail_box {
            width: 190px;
            background-image: linear-gradient(to bottom, rgba(172, 145, 105, 1), rgba(185, 151, 105, 1));
            background-color: rgba(164, 136, 96, 1);
            padding: 5px;
            border-radius: 4px 0 0 4px;
            cursor: pointer;
            text-align: center;
            line-height: 1.5;
            .help_detail_with_border {
                border: 1px solid rgb(154, 127, 89);
                border-radius: 5px;
                .help_detail_item {
                    padding: 8px 0;
                    border-top: 1px solid rgb(154, 127, 89);
                    &:first-child {
                        border: none;
                        padding-top: 0;
                    }
                    .kefu_phone {
                        color: rgba(64, 42, 11, 1);
                        &:hover {
                            color: rgba(179, 56, 40, 1);
                        }
                    }
                    .kefu {
                        width: 120px;
                        height: 100%;
                        transition: all .3s;
                        &.bigIcon {
                            transform: scale(1.1);
                        }
                    }
                    p {
                        color: rgba(255, 227, 116, 1);
                        font-size: 18px;
                        margin-bottom: 5px;
                    }
                    div {
                        color: #040304;
                        font-size: 16px
                    }
                    .red {
                        color: #B53132;
                    }
                    img {
                        width: 90px;
                        height: 90px;
                    }
                }
            }
        }
        .helpFade-enter-active, .helpFade-leave-active {
            transition: right .2s linear;
        }
        .helpFade-enter, .helpFade-leave-to {
            right: 0;
        }
        
        .footer {
            widows: 100%;
            background-color: rgba(0, 0, 0, 1);
            opacity: .8;
            color: #575F75;
            font-size: 16px;
            padding: 20px 0;
            margin-top: 32px;
            .contain_1200 {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .link_list {
                    display: flex;
                    li {
                        padding: 0 5px;
                        border-right: 1px solid #575F75;
                        cursor: pointer;
                        &:last-child {
                            border: none;
                        }
                        &:hover {
                            color: rgba(190, 202, 236, 1);
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    }

    #circle_loading {
        margin: 20px auto;
        width: 100px;
        height: 100px;
        border: 5px white solid;
        border-left-color: #ff5500;
        border-right-color:#0c80fe;
        border-radius: 100%;
        animation: loading 1s infinite linear;
        position: fixed;
        top: 50%;
        right: 50%;
        transform: translate(-50%, -50%);
        z-index: 99999999;
    }

    @keyframes loading {
        from {
            transform: rotate(0deg)
        }
        to {
            transform: rotate(360deg)
        }
    }

</style>