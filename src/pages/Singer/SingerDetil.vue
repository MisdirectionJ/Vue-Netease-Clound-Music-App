<template>
  <div class="singer_box">
    <TopHeader>
      <template #left>
        <div class="left">
          <div
            ref="header"
            :style="'background-image: url(' + singerDetil.picUrl + ')'"
            class="img_box"
          ></div>
          <i class="iconfont iconleft" @click="$router.back()"></i
          ><span>{{ listName }}</span>
        </div>
      </template>
      <template #right>
        <i class="iconfont iconshare"></i>
      </template>
    </TopHeader>
    <div class="wrapper" ref="wrapper">
      <div class="scroll_box">
        <div
          class="singer_message"
          :style="'background-image: url(' + singerDetil.picUrl + ')'"
        >
          <div class="singer_name">
            <h5>{{ singerDetil.name }}</h5>
            <div class="detil">
              <div class="num">
                <span v-if="profile.follows >= 0"
                  >关注 {{ profile.follows }}</span
                >
                <span
                  >粉丝
                  {{
                    profile.followeds >= 0
                      ? profile.followeds
                      : singerDetil.fansSize
                      ? singerDetil.fansSize
                      : "未知" | playcount(true)
                  }}</span
                >
                <p v-if="singerDetil.accountId">入驻艺人</p>
                <p v-else>歌手</p>
              </div>
              <div class="option">
                <span v-if="!artist.followed" class="follow"
                  ><i class="iconfont iconadd"></i>关注</span
                >
                <span v-else class="foloowed"
                  ><i class="iconfont iconfollow"></i>已关注</span
                >
                <span v-if="singerDetil.accountId">发私信</span>
              </div>
            </div>
          </div>
        </div>
        <div ref="message" class="detil_message">
          <header>
            <div
              v-for="item in singerDetil.accountId
                ? navList
                : navList.slice(0, 4)"
              :key="item.name"
              @click="componentId = item.component"
            >
              <span :class="[item.component === componentId && 'current']"
                >{{ item.name }}
                <span class="small" v-if="item.count">{{ item.count }}</span>
              </span>
            </div>
          </header>
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component
                :is="componentId"
                @getArtListDetil="getArtListDetil"
                @initPullUp="initPullUp"
                @changeLoading="changeLoading"
                :albumFlag="albumFlag"
                :profile="profile"
                :mvSize="mvSize"
                :videoFlag="videoFlag"
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
import TopHeader from "components/TopHeader";
import Loading from "components/Loading";
import SingerMain from "pages/Singer/SingerMain";
import SingerSong from "pages/Singer/SingerSong";
import SingerAlbum from "pages/Singer/SingerAlbum";
import SingerVideo from "pages/Singer/SingerVideo";
import UserDynamic from "components/UserDynamic";
import { mapState } from "vuex";
export default {
  name: "SingerDetil",
  components: {
    TopHeader,
    SingerMain,
    SingerSong,
    SingerAlbum,
    SingerVideo,
    UserDynamic,
    Loading,
  },
  data() {
    return {
      componentId: "SingerMain",
      artist: {},
      profile: {},
      hotSongs: [],
      scrollY: null,
      listName: null,
      isLoading: false,      
      albumFlag: false,
      videoFlag: false,
      mvSize: 0,
      navList: [
        { name: "主页", component: "SingerMain" },
        { name: "歌曲", component: "SingerSong", count: "" },
        { name: "专辑", component: "SingerAlbum", count: "" },
        { name: "视频", component: "SingerVideo", count: "" },
        { name: "动态", component: "UserDynamic", count: "" }
      ]
    };
  },
  activated() {
    this.scroll.scrollTo(0, 0);
    this.initPullUp();
  },
  created() {
    if (this.singerDetil.accountId)
      this.getFansFollow(this.singerDetil.accountId);
  },
  watch: {
    scrollY(val) {
      this.changeOpacity(Math.abs(val));
    },
    singerId(val) {
      if (!val) return;
      Object.assign(this.$data, this.$options.data());

      if (this.singerDetil.accountId)
        this.getFansFollow(this.singerDetil.accountId);
    }
  },
  computed: {
    ...mapState(["singerDetil", "singerId"])
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
    this.height = this.$refs.message.offsetTop;
    this.header = this.$refs.header;
    this.headerHeight = this.header.offsetHeight;
    this.scroll.on("pullingUp", () => {
      if (this.componentId === "SingerAlbum") return (this.albumFlag = true);
      if (this.componentId === "SingerVideo") return (this.videoFlag = true);
    });
  },
  methods: {
    changeLoading(flag) {
      this.isLoading = flag
    },
    initPullUp() {
      if (this.scroll) {
        this.scroll.refresh();
        this.scroll.finishPullUp();
      }
      this.albumFlag = false;
      this.videoFlag = false;
    },
    getArtListDetil(artist) {
      this.artist = artist;
      this.navList[1].count = artist.musicSize;
      this.navList[2].count = artist.albumSize;
      this.navList[3].count = artist.mvSize;
      this.mvSize = artist.mvSize;
    },
    async getFansFollow(id) {
      const { profile } = await this.$getAxios("/user/detail?uid=" + id);
      this.profile = profile;
      this.navList[4].count = profile.eventCount;
    },
    changeOpacity(val) {
      const rate = val / (this.height - this.headerHeight);
      if (rate > 1 && this.listName) return;
      this.listName = rate >= 1 ? this.singerDetil.name : null;
      this.header.style.opacity = rate;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.singer_box {
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
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    z-index: 1;
    justify-content: space-between;
    background-color: transparent;
    overflow: hidden;
    .left {
      .img_box {
        position: absolute;
        left: 0;
        width: 100%;
        height: 0.5rem;
        background-repeat: no-repeat;
        background-position: left top;
        filter: blur(0.05rem);
        top: 0;
        opacity: 0;
      }
    }
    i,
    span {
      position: relative;
    }
  }
  .wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
    .scroll_box {
      padding-bottom: 0.5rem;
      .singer_message {
        height: 2.3rem;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        .singer_name {
          width: 100%;
          box-sizing: border-box;
          position: absolute;
          padding: 0 0.1rem;
          left: 0;
          top: 1.2rem;
          h5 {
            margin: 0;
            line-height: 0.3rem;
            font-size: 0.14rem;
            color: #fff;
          }
          .detil {
            display: flex;
            line-height: 0.2rem;
            justify-content: space-between;
            .num {
              font-size: $best-small-font;
              color: $small-white-color;
              span:first-child {
                margin-right: 0.1rem;
              }
              p {
                margin: 0;
              }
            }
            .option {
              font-size: $best-small-font;
              color: #fff;
              padding-top: 0.2rem;
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
          justify-content: space-around;
          border-bottom: 1px solid $border-color;
          > div {
            text-align: center;
            span {
              display: inline-block;
              position: relative;
              .small {
                position: absolute;
                left: 0.26rem;
                color: $noselect-color;
                top: 0.03rem;
                transform: scale(0.8);
                font-size: $best-small-font;
              }
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
