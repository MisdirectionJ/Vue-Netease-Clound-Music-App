<template>
  <div class="album_detil">
    <TopHeader>
      <template #left>
        <div class="left">
          <div
            ref="header"
            class="img_box"
            :style="'background-image: url(' + albumDetil.picUrl + ')'"
          ></div>
          <i class="iconfont iconleft" @click="$router.back()"></i
          ><span>{{ topMessage }}</span>
        </div>
      </template>
    </TopHeader>
    <div class="list_detil" ref="wrapper">
      <div class="list_box">
        <div class="bg">
          <div
            class="bg_img"
            :style="'background-image: url(' + albumDetil.picUrl + ')'"
          ></div>
        </div>
        <div ref="message" class="list_option">
          <div class="message">
            <div class="img_box">
              <img v-lazy="albumDetil.picUrl" alt="" />
            </div>
            <div class="list_name">
              <div class="list_name_box">
                <h5>{{ albumDetil.name }}</h5>
                <p class="actor_name">
                  歌手: {{ albumDetil.artlistName
                  }}<i class="iconfont iconyoujiantou"></i>
                </p>
              </div>
              <div class="little_message">
                <p>发行时间: {{ albumDetil.publishTime | saleTime }}</p>
                <p>{{ description }}<i class="iconfont iconyoujiantou"></i></p>
              </div>
            </div>
          </div>
          <div class="option">
            <ul>
              <li @click="toComment">
                <i class="iconfont iconcomment-s"></i>
                <span>{{ message.commentCount || "评论" }}</span>
              </li>
              <li>
                <i class="iconfont iconshare-m"></i>
                <span>{{ message.shareCount || "分享" }}</span>
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
            <div class="all_start">
              <i class="iconfont iconbofang"></i>
              <span @click="startAll(true, null)">播放全部</span
              ><span>(共{{ albumDetil.size }}首)</span>
            </div>
            <div class="collection">
              <span
                ><i class="iconfont iconadd"></i>收藏({{
                  message.subCount
                }})</span
              >
            </div>
          </header>
          <div class="song_box">
            <ul>
              <li v-for="(item, index) in songs" :key="item.id">
                <div class="left" @click="toStart(item.id, index)">
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
        </div>
      </div>
    </div>
    <Loading v-if="!songs.length"></Loading>
  </div>
</template>
<script>
import TopHeader from "components/TopHeader";
import { mapState, mapActions, mapMutations } from "vuex";
import Loading from "components/Loading";
export default {
  data() {
    return {
      songs: [],
      description: "",
      topMessage: "专辑",
      message: {},
      scrollY: null
    };
  },
  components: {
    TopHeader,
    Loading
  },
  created() {
    this.getAlbumDetil();
    this.getCount();
  },
  watch: {
    scrollY(val) {
      this.changeOpacity(Math.abs(val));
    }
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
    this.height = this.$refs.message.offsetHeight;
    this.header = this.$refs.header;
    this.headerHeight = this.header.offsetHeight;
  },
  methods: {
    ...mapMutations({ sendSongList: "SEND_ALLSONGS" }),
    ...mapActions(["getAudioSrcList", "checkSong"]),
    toComment() {
      this.$store.state.commentDetil = {
        type: "album",
        id: this.albumDetil.id,
        picUrl: this.albumDetil.picUrl,
        name: this.albumDetil.name,
        nickname: this.albumDetil.artlistName,
        numType: 3
      };
      this.$router.push("/home/comment");
    },
    toStart(id, _index) {
      if (this.songId === id) return (this.$store.state.audioBoxFlag = true);
      if (this.songList.length) {
        const index = this.songList.findIndex(item => item.id === id);
        if (index > -1) return this.checkSong(index);
        return this.startAll(false, _index);
      }
      this.startAll(true, _index);
    },
    startAll(_flag, _index) {
      this.sendSongList({
        songList: JSON.parse(JSON.stringify(this.songs)),
        _flag,
        _index
      });
      this.getAudioSrcList();
    },
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
    changeOpacity(val) {
      const rate = val / (this.height - this.headerHeight);
      if (rate > 1 && this.topMessage == this.albumDetil.name) return;
      this.topMessage = rate >= 1 ? this.albumDetil.name : "专辑";
      this.header.style.opacity = rate;
    },
    async getAlbumDetil() {
      try {
        const { songs, album } = await this.$getAxios(
          "/album?id=" + this.albumDetil.id
        );
        this.songs = songs;
        this.description = album.description;
      } catch {
        this.$router.back()
      }
    },
    async getCount() {
      const { commentCount, shareCount, subCount } = await this.$getAxios(
        "/album/detail/dynamic?id=" + this.albumDetil.id
      );
      this.message = {
        commentCount,
        shareCount,
        subCount
      };
    }
  },
  computed: {
    ...mapState(["albumDetil", "songId", "songList"])
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.album_detil {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .top_header {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
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
                height: 0.2rem;
                font-size: $best-small-font;
                color: $small-white-color;
                margin: 0.05rem 0 0 0;
                @include text-overflow-one;
                .iconfont {
                  font-size: $normal-font;
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
                @include text-overflow-one;
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
      }
    }
  }
  .loading_box {
    top: 60%;
  }
}
</style>
