/*
 * api接口统一管理
 */

// 环境配置
const environment = {
    onLine: 'http://www.build.com:8080/', //生产环境请求地址
    dev: 'http://45.116.164.104:8505/', //开发环境请求地址
}

// 接口前缀
let host = location.host,
    baseHost = '',
    baseURL = '';

if (host.indexOf('www.build.com') > -1) {
    // 线上环境
    baseHost = environment.onLine;
} else {
    // 1.1测试环境
    baseHost = environment.dev;
}

baseURL = baseHost;

// 接口集合
export const apiUrl = {
    baseURL: baseURL,
    //登录
    login: baseURL + 'app/login',
    //退出
    logout: baseURL + 'app/logout',
    //注册
    register: baseURL + 'app/register',
    //获取验证码
    registerCode: baseURL + 'app/registerCode',
    //banner
    banner: baseURL + 'app/banner/2',
    //获取一级分类
    firstCat: baseURL + 'app/getFirstCat',
    //获取二级分类
    secondList: baseURL + 'app/getSecondCat',
    //获取游戏分类
    gameList: baseURL + 'app/getGameList',
    //获取站内信
    mail: baseURL + 'app/getMail',
    //获取公告
    notice: baseURL + 'app/getNotice',
    //获取弹出框
    getPopup: baseURL + 'app/getPopup',
    //网银转账 post
    bankingChannel: baseURL + 'app/bankingChannel',
    //金币互转
    coinInterturn: baseURL + 'app/coinInterturn',
    //退币
    coinReturn: baseURL + 'app/coinReturn',
    //积分兑换
    exchangeScore: baseURL + 'app/exchangeScore',
    //当前余额
    getBalance: baseURL + 'app/getBalance',
    //金库记录
    getCoinRecord: baseURL + 'app/getCoinRecord',
    //奖励记录
    getRewardRecord: baseURL + 'app/getRewardRecord',
    //已添加银行卡
    getUserCard: baseURL + 'app/getUserCard',
    //用户积分
    getUserScore: baseURL + 'app/getUserScore',
    //用户各账户金币数
    getWalletCoin: baseURL + 'app/getWalletCoin',
    //可领取奖励
    receivableReward: baseURL + 'app/receivableReward',
    //领取奖励
    receiveReward: baseURL + 'app/receiveReward',
    //进行中奖励
    rewarding: baseURL + 'app/rewarding',
    //添加银行卡 post
    saveUserCard: baseURL + 'app/saveUserCard',
    //秒存初始化 post
    secondaryChannelInit: baseURL + 'app/secondaryChannel/init',
    //秒存通道 post
    secondaryChannelPay: baseURL + 'app/secondaryChannel/pay',
    //修改用户信息 post
    updateInfo: baseURL + 'app/updateInfo',
    //修改密码
    updatePsw: baseURL + 'app/updatePsw',
    //修改密码验证码
    modifyLoginPassCode: baseURL + 'app/modifyLoginPassCode',
    //修改二次校验密码
    updateSecondPsw: baseURL + 'app/updateSecondPsw',
    //修改二次校验密码验证码
    modifyPayPassCode: baseURL + 'app/modifyPayPassCode',
    //获取用户信息
    userInfo: baseURL + 'app/userInfo',
    //游戏记录
    getGameRecord: baseURL + 'app/getGameRecord',
    //网银初始化
    bankPayChannelInit: baseURL + 'app/bankPayChannel/init',
    //是否设置支付密码
    ifSetPayPass: baseURL + 'app/ifSetPayPass',
    //活动
    act: baseURL + 'app/act/list',
    //获得游戏url
    getGameUrl: baseURL + 'app/playGame/login/',
    //退出游戏
    logoutGame: baseURL + 'app/playGame/logout/',
    //已读站内信
    readMail: baseURL + 'app/mail/read',
}