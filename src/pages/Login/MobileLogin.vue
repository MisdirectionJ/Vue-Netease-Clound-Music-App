<template>
  <div class="mobile_box" @keyup.enter="sendPassword">
    <TopHeader>
      <template #left>
        <i class="iconfont iconleft"></i>
        <span>手机号登陆</span>
      </template>
    </TopHeader>
    <p class="title">未注册手机号登陆后将自动创建</p>
    <div class="option">
      <span class="count" :style="{ color: number.length ? '#000' : '#808080' }"
        >+86</span
      >
      <input
        type="number"
        v-model.trim="number"
        v-focus
        ref="input"
        placeholder="请输入手机号"
      />
      <i
        v-show="number.length"
        @click="removenumber"
        class="iconfont iconcha_big"
      ></i>
    </div>
    <div class="option">
      <input v-model.trim="password" type="password" placeholder="请输入密码" />
    </div>
    <button class="btn" @click="sendPassword">登陆</button>
    <SmallAlert v-if="alertFlag">{{ errorMessage }}</SmallAlert>
    <VideoLoading v-if="isLoading"></VideoLoading>
  </div>
</template>

<script>
import TopHeader from "components/TopHeader";
import SmallAlert from "components/SmallAlert";
import VideoLoading from "components/VideoLoading";
export default {
  data() {
    return {
      number: "",
      password: "",
      errorMessage: "",
      alertFlag: false,
      isLoading: false
    };
  },
  components: {
    TopHeader,
    VideoLoading,
    SmallAlert
  },
  watch: {
    number() {
      if (this.number.length >= 11) this.number = this.number.substring(0, 11);
    }
  },
  methods: {
    removenumber() {
      this.number = "";
      this.$refs.input.focus();
    },
    async sendPassword() {
      if (this.number.length < 11)
        return this.requestFun("请输入11位数字的手机号");
      if (!this.password.length) return this.requestFun("请输入密码");
      try {
        this.isLoading = true;
        const { code, msg } = await this.$getAxios(
          `/login/cellphone?phone=${this.number}&password=${this.password}`
        );
        this.isLoading = false;
        if(code === 200) return this.$router.push('/home/find')
        this.requestFun(msg);
      } catch {
        this.isLoading = false;
        this.requestFun("账户不存在");
      }
    },
    requestFun(message) {
      this.errorMessage = message;
      this.alertFlag = false;
      this.$nextTick(() => {
        this.alertFlag = true;
      });
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.alertFlag = false;
      }, 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
.mobile_box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .title {
    font-size: 0.12rem;
    color: #999;
    margin: 0;
    padding: 0.2rem 0.1rem 0.1rem;
  }
  .video_loading {
    color: #ccc;
  }
  .option {
    margin: 0.1rem 0.1rem 0;
    padding-bottom: 0.05rem;
    position: relative;
    font-size: 0.13rem;
    border-bottom: 1px solid #eaeaea;
    input {
      border: none;
      outline: none;
      width: 85%;
      caret-color: #d63c32;
    }
    .count {
      margin-right: 0.1rem;
    }
    .iconfont {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 0.12rem;
      color: #808080;
    }
  }
  .password {
    display: block;
    border: none;
    outline: none;
    width: 85%;
    caret-color: #d63c32;
  }
  .btn {
    margin: 0.25rem 0.1rem 0;
    border: none;
    font-size: 0.13rem;
    color: #fff;
    padding: 0.1rem 0;
    border-radius: 0.2rem;
    background-color: $main-background;
    outline: none;
    width: calc(100vw - 0.2rem);
  }
}
</style>
