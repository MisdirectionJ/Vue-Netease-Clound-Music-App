<template>
  <div class="home_container">
    <TopHeader v-if="homeTopBar">
      <template #left>
        <i class="iconfont iconzhankai" @click="userFlag = !userFlag"></i>
      </template>
      <template #center>
        <div class="center">
          <router-link to="/home/me">我的</router-link>
          <router-link to="/home/find">发现</router-link>
          <router-link to="/home/cloud">云村</router-link>
          <router-link to="/home/movie">视频</router-link>
        </div>
      </template>
      <template #right>
        <i
          class="iconfont iconsearch"
          @click="$router.push('/home/search')"
        ></i>
      </template>
    </TopHeader>
    <div ref="wrapper" class="container">
      <div
        :style="{ 'padding-bottom': songId ? '1rem' : '0.5rem' }"
        class="scroll_box"
      >
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
    <transition name="search">
      <keep-alive include="SearchDetil">
        <router-view name="search"></router-view>
      </keep-alive>
    </transition>
    <transition name="list">
      <keep-alive include="SingerDetil,UserDetil">
      <router-view name="list"></router-view>
      </keep-alive>
    </transition>
    <AudioBox></AudioBox>
    <transition name="user">
      <UserMessage v-show="userFlag" @hiddenUser="hiddenUser"></UserMessage>
    </transition>
    <RemoveAlert v-if="fullRemoveFlag"></RemoveAlert>
  </div>
</template>

<script>
import TopHeader from "components/TopHeader";
import UserMessage from "components/UserMessage";
import AudioBox from "components/AudioBox";
import RemoveAlert from "components/RemoveAlert";
import { mapState } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      userFlag: false
    };
  },
  components: {
    TopHeader,
    AudioBox,
    RemoveAlert,
    UserMessage
  },
  computed: {
    ...mapState(["homeTopBar", "audioBoxFlag", "songId", 'fullRemoveFlag'])
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
  },
  methods: {
    hiddenUser(flag) {
      this.userFlag = !this.userFlag;
      if (!flag) return;
      setTimeout(() => {
        this.$router.push(flag)
      }, 400);
    }
  }
};
</script>

<style lang="scss" scoped>
.home_container {
  width: 100%;
  .search-enter-active,
  .search-leave-active {
    transition: all 0.3s;
  }
  .user-enter-active,
  .user-leave-active {
    transition: transform 0.2s linear;
  }
  .user-enter,
  .user-leave-to {
    transform: translateX(-100%);
  }
  .search-enter,
  .search-leave-to {
    transform: translate3d(0, 10%, 0);
    opacity: 0;
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s;
  }
  .list-enter,
  .list-leave-to {
    transform: translate3d(50%, 0, 0);
    opacity: 0;
  }
  .top_header {
    justify-content: space-between;
    .center {
      width: 100%;
      box-sizing: border-box;
      padding: 0 0.2rem;
      display: flex;
      justify-content: space-around;
      a {
        color: rgba(255, 255, 255, 0.4);
      }
      .active-class {
        color: #fff;
        font-size: 0.15rem;
      }
    }
  }
  .container {
    height: calc(100vh - 0.5rem);
    overflow: hidden;
  }
}
</style>
