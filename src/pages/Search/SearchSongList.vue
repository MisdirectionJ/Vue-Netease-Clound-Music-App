<template>
  <div class="play_list_box">
    <div class="play_list">
      <ul>
        <li v-for="(item, index) in playlists" :key="index" @click="toSongList(item)">
          <div class="img_box">
            <img v-lazy="item.coverImgUrl" alt="" />
          </div>
          <div class="name">
            <p class="list_name">
              {{ item.name }}
            </p>
            <p class="list_message">
              {{ item.trackCount + "首 by " + item.creator.nickname + ", 播放"
              }}{{ item.playCount | playcount(true) }}次
            </p>
          </div>
        </li>
      </ul>
      <Loading v-show="isLoading"></Loading>
    </div>
    <div class="not_find" v-if="canNotFind">未找到与"{{ word }}"相关的内容</div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import Loading from "components/Loading";
export default {
  created() {
    this.getSongList();
  },
  computed: {
    ...mapState(["word"])
  },
  props: {
    songListFlag: Boolean
  },
  activated() {
    this.$emit("initPullUp");
  },
  watch: {
    word() {
      this.getSongList();
    },
    songListFlag(val) {
      if (!this.offset) {
        this.$emit("initPullUp");
        return;
      }
      if (this.flag && val) {
        this.getAllSongList();
      }
    }
  },
  components: {
    Loading
  },
  data() {
    return {
      playlists: [],
      canNotFind: false,
      offset: 0,
      isLoading: false,
      flag: true
    };
  },
  methods: {
    ...mapMutations({setPlayList: 'SET_PLAYLIST'}),
    toSongList (detil) {
      this.setPlayList(detil)
      this.$router.push({name: 'songlist', params: {id: detil.id}})
    },
    async getAllSongList() {
      if (!this.flag) return;
      this.isLoading = true;
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1000&offset=${this.offset * 30}`
      );
      if (!result || !result.playlists || !result.playlists.length) {
        this.flag = false;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.playlists = this.playlists.concat(result.playlists);
      this.offset++;
      this.$emit("initPullUp");
    },
    async getSongList() {
      Object.assign(this.$data, this.$options.data());
      this.$emit("startLoading", true);
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1000`
      );
      if (result && result.playlists && result.playlists.length) {
        this.offset++;
        this.$emit("startLoading", false);
        this.playlists = result.playlists;
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
@import "~common/scss/mixin.scss";
@import "~common/scss/variable.scss";

.play_list_box {
  .play_list {
    ul > li {
      padding-top: 0.1rem;
      .name {
        width: calc(100vw - 0.8rem);
        .artist_name {
          font-size: $best-small-font;
        }
      }
      @include small_artlist_box(0.5rem, 0.03rem);

      @include play_list(0.1rem);
    }
    @include loading_box;
  }
  @include not_find;

}
</style>
