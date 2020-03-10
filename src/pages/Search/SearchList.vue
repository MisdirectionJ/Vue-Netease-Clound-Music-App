<template>
  <div class="search_list_box">
    <nav ref="wrapper">
      <ul>
        <li
          @click="componentId = item.name"
          v-for="item in navList"
          :key="item.type"
          :class="componentId === item.name && 'current'"
        >
          <span>{{ item.type }}</span>
        </li>
      </ul>
    </nav>
    <div ref="wrapperTwo" class="component_box">
      <div
        class="scroll_box"
        :style="{
          'padding-bottom':
            componentId !== 'SearchSnthesis'
              ? songId && componentId !== 'SearchSnthesis'
                ? '1.5rem'
                : '1rem'
              : '0.5rem'
        }"
      >
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component
              :is="componentId"
              @startLoading="startLoading"
              @initPullUp="initPullUp"
              :singleFlag="singleFlag"
              :videoFlag="videoFlag"
              :singerFlag="singerFlag"
              :albumFlag="albumFlag"
              :songListFlag="songListFlag"
              :djFlag="djFlag"
              :userFlag="userFlag"
            ></component>
          </keep-alive>
        </transition>
      </div>
    </div>
    <Loading v-show="loadingFlag"></Loading>
  </div>
</template>

<script>
import Loading from "components/Loading";
import SearchSnthesis from "pages/Search/SearchSnthesis";
import Searchsingle from "pages/Search/Searchsingle";
import SearchAlbum from "pages/Search/SearchAlbum";
import SearchMovie from "pages/Search/SearchMovie";
import SearchSinger from "pages/Search/SearchSinger";
import SearchSongList from "pages/Search/SearchSongList";
import SearchRadioStation from "pages/Search/SearchRadioStation";
import SearchUser from "pages/Search/SearchUser";
import { mapState } from "vuex";
export default {
  data() {
    return {
      navList: [
        { name: "SearchSnthesis", type: "综合" },
        { name: "Searchsingle", type: "单曲" },
        { name: "SearchMovie", type: "视频" },
        { name: "SearchSinger", type: "歌手" },
        { name: "SearchAlbum", type: "专辑" },
        { name: "SearchSongList", type: "歌单" },
        { name: "SearchRadioStation", type: "主播电台" },
        { name: "SearchUser", type: "用户" }
      ],
      componentId: "SearchSnthesis",
      loadingFlag: false,
      singleFlag: false,
      videoFlag: false,
      singerFlag: false,
      albumFlag: false,
      songListFlag: false,
      djFlag: false,
      userFlag: false
    };
  },
  components: {
    SearchSnthesis,
    Searchsingle,
    SearchAlbum,
    SearchMovie,
    SearchSinger,
    SearchSongList,
    SearchRadioStation,
    SearchUser,
    Loading
  },
  computed: {
    ...mapState(["songId"])
  },
  methods: {
    initPullUp() {
      if (this.scrollTwo) {
        this.scrollTwo.refresh();
        this.scrollTwo.finishPullUp();
      }
      this.singleFlag = false;
      this.videoFlag = false;
      this.singerFlag = false;
      this.albumFlag = false;
      this.songListFlag = false;
      this.djFlag = false;
      this.userFlag = false;
    },
    startLoading(flag) {
      this.loadingFlag = flag;
    }
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper, "scroll", true, false);
    this.$scroll(this, this.$refs.wrapperTwo, "scrollTwo", true, true);
    this.scrollTwo.on("pullingUp", () => {
      if (this.componentId === "SearchSnthesis") {
        this.scrollTwo.finishPullUp();
        return;
      }
      if (this.componentId === "Searchsingle") {
        this.singleFlag = true;
        return;
      }
      if (this.componentId === "SearchMovie") {
        this.videoFlag = true;
        return;
      }
      if (this.componentId === "SearchSinger") {
        this.singerFlag = true;
        return;
      }
      if (this.componentId === "SearchAlbum") {
        this.albumFlag = true;
        return;
      }
      if (this.componentId === "SearchSongList") {
        this.songListFlag = true;
        return;
      }
      if (this.componentId === "SearchRadioStation") {
        this.djFlag = true;
        return;
      }
      if (this.componentId === "SearchUser") {
        this.userFlag = true;
        return;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
.search_list_box {
  .loading_box {
    top: 1.5rem;
  }
  nav {
    background-color: $main-background;
    height: 0.3rem;
    line-height: 0.28rem;
    font-size: $normal-font;
    ul {
      display: inline-block;
      white-space: nowrap;
      > li {
        display: inline-block;
        // padding: 0 0.18rem;
        color: $font-color;
        span {
          display: block;
          margin: 0 0.15rem;
          padding: 0 0.04rem;
        }
      }
      .current {
        color: #fff;
        font-weight: 600;
        span {
          border-bottom: 2px solid #fff;
        }
      }
    }
  }
  .component_box {
    height: calc(100vh - 0.8rem);
    left: 0;
    top: 0.8rem;
    overflow: hidden;
    .scroll_box {
      box-sizing: border-box;
      padding: 0rem 0.1rem 0 0.1rem;
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.3s;
    }
    .fade-enter,
    .fade-leave-to {
      transform: translate3d(50%, 0, 0);
      opacity: 0;
    }
  }
}
</style>
