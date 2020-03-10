<template>
  <div class="user_box">
    <TopHeader>
      <template #left>
        <div class="left">
          <div
            ref="header"
            class="img_box"
            :style="'background-image: url(' + profile.backgroundUrl + ')'"
          ></div>
          <i class="iconfont iconleft" @click="$router.back()"></i>
          <span>{{ listName }}</span>
        </div>
      </template>
      <template #right>
        <i class="iconfont iconshare"></i>
      </template>
    </TopHeader>
    <div class="wrapper" ref="wrapper">
      <div class="scroll_box">
        <div
          class="user_message"
          :style="'background-image: url(' + profile.backgroundUrl + ')'"
        >
          <div class="user">
            <div class="img_box">
              <img :src="profile.avatarUrl" alt="" />
            </div>
            <p class="user_name">{{ profile.nickname }}</p>
            <div class="other">
              <div>
                <p class="follow">
                  <span>关注 {{ profile.follows }}</span>
                  <span>粉丝 {{ profile.followeds | playcount }}</span>
                </p>
                <p class="age_box">
                  <span
                    :class="['iconfont', [profile.gender > 1 ? 'girl' : 'boy']]"
                    ><i
                      :class="[profile.gender > 1 ? 'icongirl' : 'iconnan']"
                    ></i>
                    {{
                      new Date(profile.birthday)
                        .getFullYear()
                        .toString()
                        .substring(2)
                    }}后</span
                  >
                  <i class="level">lv.{{ level }}</i>
                </p>
              </div>
              <div class="option" v-if="userId !== profile.userId">
                <span v-if="!profile.followed" class="follow"
                  ><i class="iconfont iconadd"></i>关注</span
                >
                <span v-else class="foloowed"
                  ><i class="iconfont iconfollow"></i>已关注</span
                >
                <span>发私信</span>
              </div>
              <div v-else class="option">
                <span>编辑</span>
                <span>更换背景</span>
              </div>
            </div>
          </div>
        </div>
        <div ref="message" class="detil_message">
          <header>
            <div @click="componentId = 'UserSomeDetil'">
              <span :class="componentId === 'UserSomeDetil' && 'current'"
                >主页</span
              >
            </div>
            <div @click="componentId = 'UserDynamic'">
              <span :class="componentId === 'UserDynamic' && 'current'"
                >动态</span
              ><span v-if="profile.eventCount" class="small">{{
                profile.eventCount
              }}</span>
            </div>
          </header>
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component
                :is="componentId"
                :profile="profile"
                :listenSongs="listenSongs"
                :createTime="createTime"
                :createDays="createDays"
                @changeLoading="changeLoading"
              ></component>
            </keep-alive>
          </transition>
        </div>
      </div>
    </div>
    <Loading v-if="isLoading"></Loading>
  </div>
</template>
<script>
import Loading from "components/Loading";
import TopHeader from "components/TopHeader";
import UserSomeDetil from "components/UserSomeDetil";
import UserDynamic from "components/UserDynamic";
import { mapState, mapMutations } from "vuex";
export default {
  name: "UserDetil",
  components: {
    TopHeader,
    UserSomeDetil,
    Loading,
    UserDynamic
  },
  data() {
    return {
      profile: {},
      level: 0,
      componentId: "UserSomeDetil",
      scrollY: null,
      listName: null,
      listenSongs: 0,
      createTime: 0,
      createDays: 0,
      isLoading: false
    };
  },
  computed: {
    ...mapState(["userId", "otherUserId"])
  },
  activated() {
      this.scroll.scrollTo(0, 0);
    this.setUserId(this.$route.params.id);
  },
  watch: {
    scrollY(val) {
      this.changeOpacity(Math.abs(val));
    },
    otherUserId() {
      Object.assign(this.$data, this.$options.data());
      this.getUserDetil();
    }
  },
  created() {
    this.setUserId(this.$route.params.id);
    this.getUserDetil();
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
    this.height = this.$refs.message.offsetTop;
    this.header = this.$refs.header;
    this.headerHeight = this.header.offsetHeight;
  },
  methods: {
    ...mapMutations({
      setUserId: "SET_USERID"
    }),
    changeLoading(flag) {
      this.isLoading = flag;
    },
    async getUserDetil() {
      const {
        profile,
        signature,
        level,
        listenSongs,
        createTime,
        createDays
      } = await this.$getAxios(`/user/detail?uid=${this.otherUserId}`);
      this.profile = profile;
      this.level = level;
      this.listenSongs = listenSongs;
      this.signature = signature;
      this.createTime = createTime;
      this.createDays = createDays;
    },
    changeOpacity(val) {
      const rate = val / (this.height - this.headerHeight);
      if (rate > 1 && this.listName) return;
      this.listName = rate >= 1 ? this.profile.nickname : null;
      this.header.style.opacity = rate;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.user_box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    transform: translate3d(50%, 0, 0);
    opacity: 0;
  }
  .top_header {
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    background-color: transparent;
    justify-content: space-between;
    z-index: 1;
    overflow: hidden;
    .img_box {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      opacity: 0;
      filter: blur(0.06rem);
      height: 0.5rem;
    }
    .iconfont,
    span {
      position: relative;
    }
  }
  .wrapper {
    overflow: hidden;
    width: 100%;
    height: 100vh;
    .scroll_box {
      padding-bottom: 0.5rem;
      .user_message {
        height: 2.2rem;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        .user {
          height: 2rem;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 0 0.15rem;
          box-sizing: border-box;
          .img_box {
            margin-top: 0.6rem;
            width: 0.5rem;
            height: 0.5rem;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .user_name {
            margin: 0.15rem 0 0 0;
            color: #fff;
            font-size: $normal-font;
          }
          .other {
            display: flex;
            justify-content: space-between;
            .follow {
              margin: 0;
              color: rgba(255, 255, 255, 0.8);
              font-size: $best-small-font;
              margin-top: 0.1rem;
              span:first-child {
                margin-right: 0.1rem;
              }
            }
            .age_box {
              display: flex;
              margin: 0.1rem 0 0 0;
              color: #fff;
              font-size: $best-small-font;
              span,
              .level {
                padding: 0.02rem 0.1rem;
                margin-right: 0.1rem;
                border-radius: 0.1rem;
                .iconfont {
                  font-size: $best-small-font;
                }
              }
              .boy {
                font-size: $best-small-font;
                background-color: rgba(111, 205, 255, 0.5);
                .iconnan {
                  color: #6fcdff;
                }
              }
              .girl {
                font-size: $best-small-font;
                background-color: rgba(243, 140, 181, 0.5);
                .icongirl {
                  font-size: $best-small-font;
                  color: #f38cb5;
                }
              }
              .level {
                background-color: $placeholder-color;
              }
            }
            .option {
              font-size: $best-small-font;
              color: #fff;
              padding-top: 0.25rem;
              span {
                margin-left: 0.1rem;
                padding: 0.05rem 0.1rem;
                border-radius: 0.1rem;
                background-color: $placeholder-color;
                .iconfont {
                  font-size: $best-small-font;
                  margin-right: 0.05rem;
                }
              }
              .follow {
                background-color: $main-background;
              }
              .foloowed {
                background: $noselect-color;
              }
            }
          }
        }
      }
      .detil_message {
        position: relative;
        background: #fff;
        border-top-left-radius: 0.2rem;
        border-top-right-radius: 0.2rem;
        header {
          margin-top: -0.2rem;
          height: 0.3rem;
          line-height: 0.3rem;
          font-size: $normal-font;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eaeaea;
          > div {
            text-align: center;
            width: 50%;
            position: relative;
            span {
              display: inline-block;
            }
            .small {
              position: absolute;
              left: 0.95rem;
              top: 0.02rem;
              transform: scale(0.8);
              color: #808080;
            }
            .current {
              border-bottom: 2px solid $main-background;
              color: $main-background;
            }
          }
        }
      }
    }
  }
}
</style>
