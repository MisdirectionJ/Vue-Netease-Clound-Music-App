<template>
  <div class="play_list">
    <TopHeader>
      <template #left>
        <div class="left">
          <div
            ref="header"
            class="img_box"
            :style="
              'background-image: url(' +
                (playListDetil.picUrl || playListDetil.coverImgUrl) +
                ')'
            "
          ></div>
          <i class="iconfont iconleft" @click="$router.back()"></i>
          <div class="name">
            <p class="list_name">{{ listName || "歌单" }}</p>
            <p class="list_message" v-if="playListDetil.copywriter">
              {{ playListDetil.copywriter }}
            </p>
          </div>
        </div>
      </template>
      <template #right>
        <i class="iconfont iconsearch"></i>
      </template>
    </TopHeader>
    <div class="list_detil" ref="wrapper">
      <div
        class="list_box"
        :style="{ 'padding-bottom': songId ? '1rem' : '0.5rem' }"
      >
        <div class="bg">
          <div
            class="bg_img"
            :style="
              'background-image: url(' +
                (playListDetil.picUrl || playListDetil.coverImgUrl) +
                ')'
            "
          ></div>
        </div>
        <div ref="message" class="list_option">
          <div class="message">
            <div class="img_box">
              <img
                v-lazy="playListDetil.picUrl || playListDetil.coverImgUrl"
                alt=""
              />
              <div class="small_title">
                <i class="iconfont iconsanjiao"></i>
                <span>{{ playList.playCount | playcount }}</span>
              </div>
            </div>
            <div class="list_name">
              <div class="list_name_box">
                <h5>{{ playListDetil.name }}</h5>
                <div class="actor_name">
                  <div class="actor_img">
                    <img v-lazy="playList.creator.avatarUrl" alt="" />
                  </div>
                  <p>
                    {{ playList.creator.nickname
                    }}<i class="iconfont iconyoujiantou"></i>
                  </p>
                </div>
              </div>
              <div class="little_message">
                <p>
                  {{playList.description || (playList.creator.userId === userId ? '编辑信息' :  "介绍: 无")  
                  }}<i class="iconfont iconyoujiantou"></i>
                </p>
              </div>
            </div>
          </div>
          <div class="option">
            <ul>
              <li @click="toComment">
                <i class="iconfont iconcomment-s"></i>
                <span>{{ playList.commentCount || "评论" }}</span>
              </li>
              <li>
                <i class="iconfont iconshare-m"></i>
                <span>{{ playList.shareCount || "分享" }}</span>
              </li>
              <li>
                <i class="iconfont icondownload"></i>
                <span>下载</span>
              </li>
              <li>
                <i class="iconfont iconmore_select"></i>
                <span>多选</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="song_list">
          <header>
            <div class="all_start" @click="toStartAll(true, null)">
              <i class="iconfont iconbofang"></i>
              <span>播放全部</span
              ><span>(共{{ playList.tracks.length }}首)</span>
            </div>
            <div class="collection" v-if="playList.creator.userId !== userId">
              <span
                ><i class="iconfont iconadd"></i>收藏({{
                  playList.subscribedCount
                }})</span
              >
            </div>
          </header>
          <div class="song_box">
            <ul>
              <li v-for="(item, index) in playList.tracks" :key="item.id">
                <div class="left" @click="startMusic(item.id, index)">
                  <div class="num">
                    <span v-if="item.id !== songId">{{ index + 1 }}</span>
                    <i v-else class="iconfont iconemptylaba"></i>
                  </div>
                  <div class="name">
                    <p class="song_name">
                      {{ item.name
                      }}<i v-if="item.alia.length"> ({{ item.alia[0] }})</i>
                    </p>
                    <p class="artist_name">
                      <i class="small"></i>
                      {{
                        item.ar.map(item => item.name).join("/") +
                          " - " +
                          item.al.name
                      }}
                    </p>
                  </div>
                </div>
                <div class="option">
                  <i
                    v-if="item.mv"
                    class="iconfont iconmv"
                    @click="startMv(item)"
                  ></i>
                  <i class="iconfont iconziyuan"></i>
                </div>
              </li>
            </ul>
          </div>
          <footer v-if="playList.subscribers.length || playList.creator.userId !== userId">
            <ul>
              <li
                v-for="item in playList.subscribers.slice(0, 5)"
                :key="item.userId"
              >
                <img v-lazy="item.avatarUrl" alt="" />
              </li>
            </ul>
            <span v-show="playList.tracks.length"
              >{{ playList.subscribedCount }}人收藏</span
            >
          </footer>
        </div>
      </div>
    </div>
    <Loading v-if="!playList.tracks.length"></Loading>
  </div>
</template>
<script>
import TopHeader from "components/TopHeader";
import Loading from "components/Loading";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  components: {
    TopHeader,
    Loading
  },
  data() {
    return {
      listName: null,
      playList: {
        shareCount: "",
        commentCount: "",
        description: "",
        creator: {},
        tracks: [],
        subscribers: []
      },
      scrollY: null,
      commentFlag: false
    };
  },
  created() {
    this.getPlayList();
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
    this.height = this.$refs.message.offsetHeight;
    this.header = this.$refs.header;
    this.headerHeight = this.header.offsetHeight;
  },
  computed: {
    ...mapState(["playListDetil", "songId", "songList", 'userId'])
  },
  watch: {
    scrollY(val) {
      this.changeOpacity(Math.abs(val));
    }
  },
  methods: {
    ...mapMutations({ setAllSong: "SEND_ALLSONGS" }),
    ...mapActions(["getAudioSrcList", "checkSong"]),
    startMv({ mv, name, ar }) {
      this.$store.state.mvDetil = {
        comType: 1,
        type: "mv",
        idStr: "mvid",
        creator: { userName: ar[0].name },
        title: name,
        vid: mv
      };
      this.$router.push("/home/video");
    },
    async getPlayList() {
      const { playlist } = await this.$getAxios(
        `/playlist/detail?id=${this.$route.params.id}`
      );
      this.playList = playlist;
    },
    changeOpacity(val) {
      const rate = val / (this.height - this.headerHeight);
      if (rate > 1 && this.listName) return;
      this.listName = rate >= 1 ? this.playListDetil.name : null;
      this.header.style.opacity = rate;
    },
    toStartAll(flag, index) {
      this.setAllSong({
        songList: JSON.parse(JSON.stringify(this.playList.tracks)),
        _flag: flag,
        _index: index
      });
      this.getAudioSrcList();
    },
    startMusic(id, i) {
      if (this.songId === id) return (this.$store.state.audioBoxFlag = true);
      if (this.songList.length) {
        const index = this.songList.findIndex(item => item.id === id);
        if (index > -1) return this.checkSong(index);
        return this.toStartAll(false, i);
      }
      this.toStartAll(true, i);
    },
    toComment() {
      this.$store.state.commentDetil = {
        type: "playlist",
        id: this.playListDetil.id,
        picUrl: this.playListDetil.picUrl || this.playListDetil.coverImgUrl,
        name: this.playListDetil.name,
        nickname: this.playList.creator.nickname,
        numType: 2
      };
      this.$router.push("/home/comment");
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.play_list {
  width: 100vw;
  position: fixed;
  left: 0;
  top: 0;
  .top_header {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    overflow: hidden;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      width: calc(100% - 0.2rem);
      .img_box {
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
      .name {
        display: flex;
        position: relative;
        justify-content: center;
        flex-direction: column;
        width: calc(100% - 0.3rem);
        box-sizing: border-box;
        p {
          margin: 0;
          line-height: 0.2rem;
          @include text-overflow-one;
        }
        .list_name {
          font-size: $normal-font;
          color: #fff;
        }
        .list_message {
          font-size: $best-small-font;
          color: $small-white-color;
        }
      }
    }
    .iconfont {
      position: relative;
    }
    .img_box {
      width: 100%;
      height: 0.5rem;
      position: absolute;
      background: top center/cover no-repeat;
      opacity: 0;
      filter: blur(0.06rem);
      left: 0;
      top: 0;
    }
  }
  .list_detil {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    .list_box {
      position: relative;
      .bg {
        position: absolute;
        left: 0;
        width: 100%;
        height: 2.5rem;
        top: 0;
        overflow: hidden;
        .bg_img {
          position: absolute;
          left: 0;
          width: 100%;
          background: top center / cover no-repeat;
          height: 2.5rem;
          top: 0;
          filter: blur(0.2rem);
        }
      }

      .list_option {
        box-sizing: border-box;
        width: 100%;
        padding: 0.7rem 0.1rem 0 0.1rem;
        height: 2.4rem;
        position: relative;
        .message {
          @include small_artlist_box(1rem, 0.03rem);
          .img_box {
            position: relative;
            @include small_count;
          }
          .list_name {
            width: calc(100vw - 1.3rem);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .list_name_box {
              @include text-overflow-clamp;
              h5 {
                line-height: 0.2rem;
                overflow: hidden;
                margin: 0;
                font-size: $best-big-font;
                color: #fff;
              }
              .actor_name {
                line-height: 0.2rem;
                display: flex;
                height: 0.2rem;
                font-size: $normal-font;
                color: #fff;
                margin-top: 0.05rem;
                .actor_img {
                  margin-right: 0.05rem;
                  img {
                    width: 0.2rem;
                    height: 0.2rem;
                    border-radius: 50%;
                  }
                }

                p {
                  margin: 0;
                  @include text-overflow-one;
                  .iconfont {
                    font-size: $normal-font;
                  }
                }
              }
            }
            .little_message {
              font-size: $best-small-font;
              height: 0.3rem;
              line-height: 0.16rem;
              overflow: hidden;
              color: $small-white-color;
              p {
                margin: 0;
                @include text-overflow-clamp;
                .iconfont {
                  font-size: $best-small-font;
                }
              }
            }
          }
        }
        .option {
          ul {
            margin-top: 0.2rem;
            display: flex;
            > li {
              text-align: center;
              width: 25%;
              height: 0.5rem;
              display: flex;
              flex-flow: column;
              .iconfont {
                font-size: 0.2rem;
                color: $small-white-color;
                margin-bottom: 0.05rem;
              }
              span {
                font-size: $best-small-font;
                color: $small-white-color;
              }
            }
          }
        }
      }
      .song_list {
        position: relative;
        header {
          width: 100%;
          height: 0.5rem;
          border-top-left-radius: 0.2rem;
          box-sizing: border-box;
          padding: 0 0.1rem;
          line-height: 0.5rem;
          border-top-right-radius: 0.2rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.14rem;
          background-color: #fff;
          .collection {
            span {
              background-color: $main-background;
              padding: 0.1rem;
              color: #fff;
              font-size: 0.12rem;
              border-radius: 0.15rem;
              .iconfont {
                font-size: 0.12rem;
                margin-right: 0.05rem;
              }
            }
          }
          .all_start {
            .iconfont {
              margin-right: 0.1rem;
            }
            font-size: 0.13rem;
            span:last-child {
              color: $noselect-color;
              font-size: 0.12rem;
            }
          }
        }
        .song_box {
          width: 100%;
          overflow: hidden;
          ul {
            padding-right: 0.1rem;
            > li {
              @include song_list;
              .left {
                display: flex;
                width: 80%;
                .num {
                  width: 0.35rem;
                  line-height: 0.5rem;
                  text-align: center;
                  color: $noselect-color;
                  .iconemptylaba {
                    color: $main-background;
                    font-size: 0.12rem;
                  }
                }
              }
              box-sizing: border-box;
              .small {
                width: 0.12rem;
                height: 0.08rem;
                display: inline-block;
                background: url(~common/images/index_icon_2x.png) no-repeat;
                background-size: 166px 97px;
              }
            }
          }
        }
        footer {
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 0 0.1rem;
          ul {
            display: flex;
            > li {
              padding: 0.1rem 0;
              img {
                width: 0.3rem;
                height: 0.3rem;
                border-radius: 50%;
                margin-right: 0.05rem;
              }
            }
          }
          span {
            line-height: 0.5rem;
            color: #808080;
            font-size: 0.12rem;
          }
        }
      }
    }
  }
  .loading_box {
    top: 60%;
  }
  .comment_fade-enter-active,
  .comment_fade-leave-active {
    transition: all 0.3s;
  }
  .comment_fade-enter,
  .comment_fade-leave-to {
    transform: translate3d(0, 10%, 0);
    opacity: 0;
  }
}
</style>
