<template>
  <div class="main_box">
    <div v-show="hotSongs.length">
      <div class="song_box" v-show="hotSongs.length">
        <header>
          <h5>
            <i class="iconfont iconbofang"></i
            ><span @click="startAll(true)">播放热门50</span>
          </h5>
        </header>
        <ul>
          <li v-for="(item, index) in hotSongs.slice(0, 5)" :key="item.id">
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
        <div class="footer">
          <span>更多热歌</span>
          <i class="iconfont iconyoujiantou"></i>
        </div>
      </div>
      <div class="bg"></div>
      <div class="message" v-if="artist.briefDesc">
        <header>
          <h5>{{ singerDetil.accountId ? "基本信息" : "歌手简介" }}</h5>
        </header>
        <div class="detil">
          <div v-if="singerDetil.accountId">
            <p>昵称: {{ profile.nickname }}</p>
            <p>
              性别:
              {{ profile.gender > 1 ? "女" : "男" }}
            </p>
          </div>
          <p>简介: {{ artist.briefDesc }}</p>
        </div>
        <footer class="footer">
          <span>更多信息</span>
          <i class="iconfont iconyoujiantou"></i>
        </footer>
      </div>
      <div class="bg" v-if="artistList.length"></div>
      <div class="about" v-show="artistList.length">
        <header>
          <h5>相似艺人</h5>
        </header>
        <div class="list" ref="wrapper">
          <ul>
            <li v-for="item in artistList" :key="item.id">
              <div class="img_box" @click="changeSinger(item)">
                <img v-lazy="item.img1v1Url" alt="" />
              </div>
              <p class="name">{{ item.name }}</p>
              <p class="count">866.7万粉丝</p>
              <div class="follow">
                <span class="nfollow" v-if="!item.followed">关注</span>
                <span class="followed" v-else>已关注</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  created() {
    this.getData(this.singerId);
  },
  computed: {
    ...mapState([
      "songId",
      "singerDetil",
      "songList",
      "singerId",
      "checkSingerArtlist"
    ])
  },
  props: {
    profile: Object
  },
  watch: {
    singerId(val) {
      if (!val) return;
      Object.assign(this.$data, this.$options.data());
      this.getData(val);
    }
  },
  data() {
    return {
      hotSongs: [],
      artist: {},
      artistList: []
    };
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper, "scroll", false, false);
  },
  methods: {
    ...mapMutations({
      sendSongList: "SEND_ALLSONGS",
      changeSingerId: "SET_SINGERID",
      clearArtlist: "SET_CHECKARTLIST"
    }),
    ...mapActions(["getAudioSrcList", "checkSong"]),
    getData(id) {
      this.getSingerMessage(id);
      this.getSameSinger(id);
    },
    async getSingerMessage(id) {
      this.$emit('changeLoading', true)
      if (!this.checkSingerArtlist) {
        const { hotSongs, artist } = await this.$getAxios("/artists?id=" + id);
        this.hotSongs = hotSongs;
        this.artist = artist;
      } else {
        this.hotSongs = this.checkSingerArtlist.hotSongs;
        this.artist = this.checkSingerArtlist.artist;
      }
      this.clearArtlist(null)
      this.$emit('changeLoading', false)
      this.$emit("getArtListDetil", this.artist);
    },
    async getSameSinger(id) {
      const { artists } = await this.$getAxios("/simi/artist?id=" + id);
      this.artistList = artists;
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
    },
    changeSinger({ id, picUrl, name, accountId }) {
      this.$store.state.singerDetil = {
        picUrl,
        name,
        accountId
      };
      this.changeSingerId(id);
      this.$router.replace({ name: "singer", params: { id } });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.main_box {
  .song_box {
    width: 100%;
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
    @include search_footer(0.4rem);
  }
  .bg {
    height: 0.05rem;
    background-color: #f5f5f5;
  }
  .message {
    padding: 0 0.1rem;

    @include search_header;
    @include search_footer(0.4rem);
    .detil {
      p {
        margin: 0;
        font-size: $best-small-font;
        color: #808080;
        margin-top: 0.05rem;
        line-height: 0.15rem;
      }
      p:last-child {
        @include text-overflow-clamp(3);
      }
    }
  }
  .about {
    padding: 0 0.1rem;
    @include search_header;
    .list {
      > ul {
        margin-top: 0.1rem;
        height: 1.5rem;
        display: inline-flex;
        justify-content: space-around;
        > li {
          white-space: nowrap;
          margin-right: 0.1rem;
          background-color: #f5f5f5;
          width: 0.95rem;
          .img_box {
            margin: 0.1rem auto 0;
            width: 0.4rem;
            height: 0.4rem;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          p {
            margin: 0;
            line-height: 0.25rem;
            font-size: $normal-font;
            text-align: center;
          }
          .count {
            color: $noselect-color;
            font-size: $best-small-font;
          }
          .follow {
            margin-top: 0.1rem;
            text-align: center;
            span {
              padding: 0.03rem 0.15rem;
              border-radius: 0.1rem;
              font-size: $best-small-font;
              color: #fff;
              background: $main-background;
            }
            .followed {
              background: #fff;
              border: 1px solid $border-color;
              color: $noselect-color;
            }
          }
        }
        li:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
