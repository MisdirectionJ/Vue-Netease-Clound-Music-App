<template>
  <div class="cloud_song">
    <TopHeader>
      <template #left>
        <div class="left">
          <i class="iconfont iconleft" @click="$router.back()"></i>
          <div class="title">
            <p class="">音乐云盘</p>
            <p class="weight">{{ size }}G / {{ maxSize }}G</p>
          </div>
        </div>
      </template>
    </TopHeader>
    <div class="container" ref="wrapper">
      <div class="scroll_box" v-show="songs.length">
        <header>
          <i class="iconfont iconbofang"></i
          ><span @click="startAll(true, null)" class="all">播放全部</span
          ><span class="num">(共{{ count }}首)</span>
        </header>
        <div class="song_box">
          <ul>
            <li v-for="(item, index) in songs" :key="index">
              <div class="num">
                <span v-if="item.id !== songId">{{ index + 1 }}</span>
                <i v-else class="iconfont iconemptylaba"></i>
              </div>
              <div class="right">
                <div class="name" @click="toStart(item.id, index)">
                  <p class="song_name">
                    {{ item.name
                    }}<i v-if="item.alia && item.alia.length">
                      ({{ item.alia[0] }})</i
                    >
                  </p>
                  <p class="artist_name">
                    <i class="small"></i>
                    {{
                      item.ar
                        ? item.ar.map(item => item.name).join("/") +
                          " - " +
                          item.al.name
                        : "未知"
                    }}
                  </p>
                </div>
                <div class="option">
                  <i
                    v-if="item.mv"
                    class="iconfont iconmv"
                    @click="startMv(item)"
                  ></i>
                  <i class="iconfont iconziyuan"></i>
                </div>
              </div>
            </li>
          </ul>
          <Loading v-if="isLoading"></Loading>
        </div>
      </div>
    </div>
    <Loading v-if="!songs.length"></Loading>
  </div>
</template>
<script>
import TopHeader from "components/TopHeader";
import Loading from "components/Loading";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
      songs: [],
      maxSize: 0,
      size: 0,
      count: 0,
      offset: 0,
      hasMore: false
    };
  },
  created() {
    this.getSongs();
  },
  computed: {
    ...mapState(["songId", "songList"])
  },
  methods: {
    ...mapMutations({ sendSongList: "SEND_ALLSONGS" }),
    ...mapActions(["getAudioSrcList", "checkSong"]),
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
    async getSongs() {
      if (this.offset > 0) this.isLoading = true;
      const { data, size, maxSize, count, hasMore } = await this.$getAxios(
        `/user/cloud/?&offset=${this.offset * 30}`
      );
      this.isLoading = false;
      this.hasMore = hasMore;
      if (!this.hasMore) return;
      this.songs = this.songs.concat(
        data.map(item => {
          return item.simpleSong;
        })
      );
      this.offset++;
      this.scroll.finishPullUp();
      if (this.offset === 1) {
        this.size = (size / 1024 ** 3).toFixed(1);
        this.maxSize = maxSize / 1024 ** 3;
        this.count = count;
        return;
      }
    }
  },

  mounted() {
    this.$scroll(this, this.$refs.wrapper);
    this.scroll.on("pullingUp", () => {
      this.getSongs();
    });
  },
  components: {
    TopHeader,
    Loading
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.cloud_song {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .top_header {
    .left {
      display: flex;
      .title {
        padding-top: 0.08rem;
        p {
          margin: 0;
          line-height: 0.2rem;
        }
        .weight {
          font-size: $best-small-font;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
  .container {
    height: calc(100vh - 0.5rem);
    overflow: hidden;
    .scroll_box {
      padding-bottom: 0.5rem;
      header {
        padding-left: 0.1rem;
        height: 0.3rem;
        line-height: 0.3rem;
        .all {
          font-size: $normal-font;
        }
        .iconfont {
          margin-right: 0.1rem;
          font-size: $normal-font;
        }
        .num {
          color: $noselect-color;
          font-size: $best-small-font;
        }
      }
      .song_box {
        ul > li {
          box-sizing: border-box;
          display: flex;
          padding-right: 0.1rem;
          .right {
            @include song_list;
            width: calc(100vw - 0.5rem);
          }
          .small {
            width: $best-small-font;
            height: 0.08rem;
            display: inline-block;
            background: url(~common/images/index_icon_2x.png) no-repeat;
            background-size: 166px 97px;
          }
          .num {
            width: 0.4rem;
            height: 0.5rem;
            line-height: 0.5rem;
            text-align: center;
            font-size: $normal-font;
            color: $noselect-color;
            .iconemptylaba {
              color: $main-background;
              font-size: $best-small-font;
            }
          }
        }
        @include loading_box;
      }
    }
  }
}
</style>
