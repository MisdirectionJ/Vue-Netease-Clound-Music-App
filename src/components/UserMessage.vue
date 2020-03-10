<template>
  <div class="user" ref="userBox">
    <div class="bg" @click="$emit('hiddenUser')"></div>
    <div class="user_mes">
      <div class="user_box">
        <div v-if="isLogin">
          <div class="big_img">
            <img :src="profile.avatarUrl" alt="" />
          </div>
          <div class="img_box">
            <img v-lazy="profile.avatarUrl" alt="" />
          </div>
          <div class="user_message">
            <div
              class="user_name"
              @click="
                $emit('hiddenUser', {
                  name: 'user',
                  params: { id: profile.userId }
                })
              "
            >
              <span>{{ profile.nickname }}</span>
              <i class="iconfont iconyinle"></i>
              <i class="leave">Lv.{{ level }}</i>
            </div>
            <div @click="checkQiandao" class="qiandao" v-if="alreadyQianDao">
              <i class="iconfont iconqiandao_o"></i>
              <span>签到</span>
            </div>
            <div v-else class="already_qiandao">
              <span>已签到</span>
            </div>
          </div>
        </div>
        <div v-else class="need_login">
          <header>
            <p>登陆网易云音乐</p>
            <p>手机电脑多端同步，尽享海量高品质音乐</p>
          </header>
          <footer @click="$router.push('/login')">
            <span>需要登陆</span>
          </footer>
        </div>
      </div>

      <div class="select">
        <div>
          <i class="iconfont iconxinxi"></i>
          <span>我的消息</span>
          <span class="count" v-if="newMsgCount">{{ newMsgCount }}</span>
        </div>
        <div>
          <i class="iconfont iconwo"></i>
          <span>我的好友</span>
        </div>
        <div>
          <i class="iconfont icontouting"></i>
          <span>听歌识曲</span>
        </div>
        <div>
          <i class="iconfont icontheme"></i>
          <span>个性装扮</span>
        </div>
      </div>
      <div class="other">
        <ul>
          <li>
            <i class="iconfont iconmenpiao"></i>
            <span>演出</span>
          </li>
          <li>
            <i class="iconfont icongouwuche"></i>
            <span>商城</span>
          </li>
          <li>
            <i class="iconfont icondingwei"></i>
            <span>附近的人</span>
          </li>
          <li>
            <i class="iconfont icondingdan"></i>
            <span>我的订单</span>
          </li>
          <li>
            <i class="iconfont iconsaoyisao"></i>
            <span>扫一扫</span>
          </li>
          <li>
            <i class="iconfont iconclock"></i>
            <span>音乐闹钟</span>
          </li>
          <li @click="$emit('hiddenUser', '/home/cloudsong')">
            <i class="iconfont iconcloud"></i>
            <span>音乐云盘</span>
          </li>
        </ul>
      </div>
      <div class="log_out" @click="showRemoveAlert">
        <i class="iconfont icontuichu"></i>
        <span>退出</span>
      </div>
    </div>
    <SmallAlert v-if="requestFlag">{{ requestMessage }}</SmallAlert>
  </div>
</template>

<script>
import SmallAlert from "components/SmallAlert";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      isLogin: false,
      level: "",
      alreadyQianDao: true,
      profile: {},
      requestMessage: "",
      requestFlag: false,
      newMsgCount: ""
    };
  },
  created() {
    this.checkLogin();
  },
  watch: {
    toLoginOutFlag(val) {
      if (val) this.tologOut();
    }
  },
  components: {
    SmallAlert
  },
  computed: {
    ...mapState(["userId", "toLoginOutFlag"])
  },
  methods: {
    ...mapMutations({ hiddenAlert: "SETREMOVE_ALERT_FLAG" }),
    showRemoveAlert() {
      this.$store.state.removeAlertMessage = {
        title: "确定退出当前账号吗",
        remove: "退出",
        flag: "toLoginOutFlag"
      };
      this.$store.state.fullRemoveFlag = true;
    },
    async getLeave() {
      const { level } = await this.$getAxios("/user/detail?uid=" + this.userId);
      this.level = level;
    },
    async checkQiandao() {
      const { code } = await this.$getAxios("/daily_signin");
      if (code === 200) {
        this.requestFun("签到成功");
      } else if (code === 400) {
        this.requestFun("重复签到");
      }
      this.alreadyQianDao = false;
    },
    requestFun(message) {
      this.requestMessage = message;
      this.requestFlag = false;
      this.$nextTick(() => {
        this.requestFlag = true;
      });
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.requestFlag = false;
      }, 3000);
    },
    async checkLogin() {
      try {
        const { profile } = await this.$getAxios("/login/status");
        this.profile = profile;
        this.$store.state.userId = profile.userId;
        this.isLogin = true;
        this.getMessage();
        this.getLeave();
      } catch {
        this.isLogin = false;
      }
    },
    async getMessage() {
      const { newMsgCount } = await this.$getAxios("/msg/private");
      this.newMsgCount = newMsgCount;
    },
    async tologOut() {
      this.hiddenAlert({ el: "toLoginOutFlag", flag: false });
      const { code } = await this.$getAxios("/logout");
      if (code === 200) this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
.user {
  width: 80%;
  height: 100%;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  .bg {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .user_mes {
    padding: 0.2rem;
    width: 100%;
    height: 100vh;
    position: relative;
    box-sizing: border-box;
    background-color: #fff;

    .user_box {
      width: 100%;
      height: 1rem;
      box-sizing: border-box;
      overflow: hidden;
    }
    .need_login {
      font-size: $best-small-font;
      color: #5e5e5e;
      footer {
        margin-top: 0.1rem;
        span {
          width: 0.8rem;
          height: 0.2rem;
          border: 1px solid #eaeaea;
          box-sizing: border-box;
          display: block;
          text-align: center;
          padding: 0 0.1rem;
          margin: 0 auto;
          line-height: 0.2rem;
          border-radius: 0.1rem;
        }
      }
      header {
        margin-top: 0.2rem;
        text-align: center;
        p {
          padding: 0;
          margin: 0;
          margin-top: 0.05rem;
        }
      }
    }
    .log_out {
      font-size: $normal-font;
      margin-top: 0.2rem;
      .iconfont {
        font-size: $normal-font;
        margin-right: 0.1rem;
      }
    }
    .big_img {
      position: absolute;
      left: 0;
      top: 0;
      img {
        width: 100%;
        height: 1rem;
        filter: blur(0.8rem);
      }
    }
    .other {
      .iconfont {
        margin-right: 0.1rem;
        font-size: $normal-font;
      }
      border-bottom: 1px solid $border-color;
      padding: 0.1rem 0;
      font-size: $normal-font;
      li {
        padding: 0.1rem 0;
      }
    }
    .select {
      display: flex;
      justify-content: space-around;
      font-size: $normal-font;
      padding: 0.1rem 0;
      border-bottom: 1px solid $border-color;
      > div {
        height: 0.4rem;
        position: relative;
        > span {
          color: #000;
          font-size: $best-small-font;
        }
        color: $main-background;
        text-align: center;
        .iconfont {
          font-size: 0.2rem;
        }
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        .count {
          position: absolute;
          left: 0.32rem;
          top: -0.05rem;
          color: #fff;
          border-radius: 50%;
          background: $main-background;
          width: 0.2rem;
          height: 0.2rem;
          line-height: 0.2rem;
          transform: scale(0.8);
        }
      }
    }
    .user_message {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: $normal-font;
      margin-top: 0.1rem;
      position: relative;
      .user_name {
        line-height: 0.25rem;
        .iconyinle {
          color: #ccc;
          margin: 0 0.05rem;
          font-size: $best-small-font;
        }
        .leave {
          font-size: $best-small-font;
          background-color: #eee;
          display: inline-block;
          line-height: 0.2rem;
          padding: 0 0.08rem;
          border-radius: 0.08rem;
          color: #888;
        }
      }
      .already_qiandao {
        color: #666;
        width: 0.6rem;
        text-align: center;
        height: 0.25rem;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 0.2rem;
        line-height: 0.25rem;
        font-size: $best-small-font;
      }
      .qiandao {
        color: #fff;
        width: 0.6rem;
        text-align: center;
        height: 0.25rem;
        background-color: $main-background;
        border-radius: 0.2rem;
        line-height: 0.25rem;
        font-size: $best-small-font;
        .iconqiandao_o {
          font-size: $best-small-font;
          margin-right: 0.03rem;
        }
      }
    }
    .img_box {
      font-size: $normal-font;
      width: 100%;
      height: 0.5rem;
      img {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
      }
    }
  }
}
</style>
