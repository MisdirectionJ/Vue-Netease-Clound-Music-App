<template>
  <div class="commend_list">
    <TopHeader>
      <template #left>
        <i class="iconfont iconleft" @click="$router.back()"></i>
        每日推荐
      </template>
    </TopHeader>
    <div class="bg"></div>
    <div class="container">
      <header>
        <div class="left" @click="startAll(true, null)">
          <i class="iconfont iconbofang"></i>
          <span>播放全部</span>
        </div>
        <div class="right">
          <i class="iconfont iconzhankai"></i>
          <span> 多选</span>
        </div>
      </header>
      <div class="center" ref="wrapper">
        <ul>
          <li v-for="(item, index) in recommendList" :key="item.id">
            <div class="left" @click="toStart(item.id, index)">
              <img v-lazy="item.al.picUrl" alt="" />
              <div class="name">
                <div class="songname">
                  <p>
                    {{ item.name }}
                    <span v-if="item.alia.length">({{ item.alia[0] }})</span>
                  </p>
                </div>
                <div class="songz">
                  <p>
                    {{ item.ar.map(item => item.name).join("/") }} -
                    {{ item.al.name }}
                  </p>
                </div>
              </div>
            </div>
            <div class="right">
              <i v-if="item.mv" class="iconfont iconbofangshu"></i>
              <i class="iconfont iconziyuan"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Loading v-if="!recommendList.length"></Loading>
  </div>
</template>
<script>
import TopHeader from "components/TopHeader";
import Loading from "components/Loading";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      recommendList: []
    };
  },
  components: {
    TopHeader,
    Loading
  },
  created() {
    this.getCommend();
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
  },
  computed: {
    ...mapState(["songId", "songList"])
  },
  methods: {
    ...mapMutations({ sendSongList: "SEND_ALLSONGS" }),
    ...mapActions(["getAudioSrcList", "checkSong"]),
    startAll(_flag, _index) {
      this.sendSongList({
        songList: JSON.parse(JSON.stringify(this.recommendList)),
        _flag,
        _index
      });
      this.getAudioSrcList();
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
    async getCommend() {
      const { recommend } = await this.$getAxios("/recommend/songs");
      this.getCommendDetil(recommend.map(item => item.id));
    },
    async getCommendDetil(ids) {
      const { songs } = await this.$getAxios(
        "/song/detail?ids=" + ids.join(",")
      );
      this.recommendList = songs;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.commend_list {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .bg {
    background-color: $main-background;
    height: 0.2rem;
  }
  .container {
    padding: 0 0.1rem;
    border-top-left-radius: 0.2rem;
    border-top-right-radius: 0.2rem;
    margin-top: -0.2rem;
    background: #fff;
    height: 100%;
    > header {
      display: flex;
      justify-content: space-between;
      height: 0.4rem;
      line-height: 0.4rem;
      width: 100%;
      .right {
        font-size: $normal-font;
        .iconfont {
          font-size: $normal-font;
        }
      }
      .left {
        font-size: $normal-font;
        .iconfont {
          font-size: $normal-font;
          margin-right: 0.05rem;
        }
      }
    }
    .center {
      height: calc(100vh - 0.9rem);
      overflow: hidden;
      ul {
        padding-bottom: 0.5rem;
        > li {
          display: flex;
          width: 100%;
          justify-content: space-between;
          height: 0.4rem;
          font-size: $normal-font;
          margin-bottom: 0.1rem;
          .right {
            .iconfont {
              font-size: 0.2rem;
              line-height: 0.4rem;
              color: $noselect-color;
            }
          }
          .left {
            display: flex;
            width: 80%;
            img {
              width: 0.4rem;
              height: 0.4rem;
              border-radius: 0.03rem;
              margin-right: 0.1rem;
            }
            .name {
              width: 80%;
              font-size: $best-small-font;
              height: 0.4rem;
              p {
                @include text-overflow-one;
                margin: 0;
                line-height: 0.2rem;
                span {
                  color: $noselect-color;
                }
              }
              .songz {
                color: $noselect-color;
                font-size: $best-small-font;
              }
            }
          }
        }
      }
    }
  }
}
</style>
