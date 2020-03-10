<template>
  <div class="single_box">
    <header v-show="songs.length">
      <i class="iconfont iconbofang"></i
      ><span @click="sendAllSong(songs, true)">播放全部</span>
    </header>
    <div class="song_box">
      <ul>
        <li v-for="(item, index) in songs" :key="index">
          <div class="name" @click="startMusic(item)">
            <p class="song_name">
              {{ item.name
              }}<i v-if="item.alias.length"> ({{ item.alias[0] }})</i>
            </p>
            <p class="artist_name">
              <i class="small"></i>
              {{
                item.artists.map(item => item.name).join("/") +
                  " - " +
                  item.album.name
              }}
            </p>
          </div>
          <div class="option">
            <i v-if="item.mvid" class="iconfont iconmv" @click="startVideo(item)"></i>
            <i class="iconfont iconziyuan"></i>
          </div>
        </li>
      </ul>
      <Loading v-if="isLoading"></Loading>
    </div>
    <div class="not_find" v-if="canNotFind">未找到与"{{ word }}"相关的内容</div>
  </div>
</template>

<script>
import Loading from "components/Loading";

import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      songs: [],
      canNotFind: false,
      offset: 0,
      flag: true,
      isLoading: false
    };
  },
  components: {
    Loading
  },
  props: {
    singleFlag: Boolean
  },
  computed: {
    ...mapState(["word", "songList", "songId"])
  },
  created() {
    this.getSingleSong();
  },
  activated() {
    this.$emit("initPullUp");
  },
  watch: {
    word() {
      this.getSingleSong();
    },
    singleFlag(val) {
      if (!this.offset) {
        this.$emit("initPullUp");
        return;
      }
      if (this.flag && val) {
        this.getSongList();
      }
    }
  },

  methods: {
    ...mapMutations({
      sendSongList: "SEND_ALLSONGS"
    }),
    ...mapActions(["getAudioSrcList", "checkSong"]),
    startVideo({ mvid, name, artists }) {
      this.$store.state.mvDetil = {
        comType: 1,
        type: "mv",
        idStr: "mvid",
        creator: {userName: artists[0].name},
        title: name,
        vid: mvid
      };
      this.$router.push("/home/video");
    },
    async sendAllSong(arr, flag) {
      const { songs } = await this.$getAxios(
        "/song/detail?ids=" + arr.map(item => item.id).join(",")
      );
      this.sendSongList({
        songList: JSON.parse(JSON.stringify(songs)),
        _flag: flag
      });
      this.getAudioSrcList();
    },
    startMusic(songObj) {
      if (this.songId === songObj.id) {
        this.$store.state.audioBoxFlag = true;
        return;
      }
      if (this.songList.length) {
        const index = this.songList.findIndex(item => item.id === songObj.id);
        if (index > -1) return this.checkSong(index);
        return this.sendAllSong([songObj], false);
      }
      this.sendAllSong([songObj], true);
    },
    async getSongList() {
      if (!this.flag && !this.offset) return;
      this.isLoading = true;
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1&offset=${this.offset * 30}`
      );
      if (!result || !result.songs || !result.songs.length) {
        this.flag = false;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.songs = this.songs.concat(result.songs);
      this.offset++;
      this.$emit("initPullUp");
    },
    async getSingleSong() {
      Object.assign(this.$data, this.$options.data());
      this.$emit("startLoading", true);
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1&offset=${this.offset * 30}`
      );
      if (result && result.songs && result.songs.length) {
        this.offset++;
        this.$emit("startLoading", false);
        this.songs = result.songs;
        this.canNotFind = false;
      } else {
        this.$emit("startLoading", false);
        this.canNotFind = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.single_box {
  header {
    font-weight: 600;
    padding-top: 0.1rem;
    height: 0.3rem;
    font-size: 0.13rem;
    line-height: 0.3rem;
    .iconfont {
      font-size: 0.13rem;
      margin-right: 0.1rem;
    }
  }
  .song_box {
    ul > li {
      @include song_list;
      .small {
        width: 0.12rem;
        height: 0.08rem;
        display: inline-block;
        background: url(~common/images/index_icon_2x.png) no-repeat;
        background-size: 166px 97px;
      }
    }
    @include loading_box;
  }
  @include not_find;
}
</style>
