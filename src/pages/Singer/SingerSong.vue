<template>
  <div class="song_box">
    <header v-show="hotSongs.length">
      <h5><i class="iconfont iconshoucang-m"></i><span>收藏热门50</span></h5>
    </header>
    <ul>
      <li v-for="(item, index) in hotSongs" :key="item.id">
        <div class="left">
          <div class="num">
            <span v-if="item.id !== songId">{{ index + 1 }}</span>
            <i v-else class="iconfont iconemptylaba"></i>
          </div>
          <div class="name" @click="toStart(item.id, index)">
            <p class="song_name">
              {{ item.name
              }}<i v-if="item.alia.length"> ({{ item.alia[0] }})</i>
            </p>
            <p class="artist_name">
              <i class="small"></i>
              {{
                item.ar.map(item => item.name).join("/") + " - " + item.al.name
              }}
            </p>
          </div>
        </div>
        <div class="option">
          <i v-if="item.mv" class="iconfont iconmv" @click="startMv(item)"></i>
          <i class="iconfont iconziyuan"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      hotSongs: [],
      id: null
    };
  },
  created() {
    this.getSongs();
  },
  computed: {
    ...mapState(["songId", "songList"])
  },
  activated() {
    if (this.$route.params.id === this.id) return;
    else {
      Object.assign(this.$data, this.$options.data());
      this.getSongs();
      this.$emit("initPullUp");
    }
  },
  methods: {
    ...mapMutations({ sendSongList: "SEND_ALLSONGS" }),
    ...mapActions(["getAudioSrcList", "checkSong"]),
    async getSongs() {
      this.$emit("changeLoading", true);
      this.id = this.$route.params.id;
      const { songs } = await this.$getAxios("/artist/top/song?id=" + this.id);
      this.hotSongs = songs;
      this.$emit("changeLoading", false);
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
        songList: JSON.parse(JSON.stringify(this.hotSongs)),
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.song_box {
  width: 100%;
  overflow: hidden;
  @include search_header;
  header {
    padding: 0 0.1rem;
    h5 {
      font-size: 0.14rem;
    }
    .iconfont {
      margin-right: 0.1rem;
    }
  }
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
            font-size: $best-small-font;
          }
        }
      }
      box-sizing: border-box;
      .small {
        width: $best-small-font;
        height: 0.08rem;
        display: inline-block;
        background: url(~common/images/index_icon_2x.png) no-repeat;
        background-size: 166px 97px;
      }
    }
  }
}
</style>
