<template>
  <transition name="small">
    <div class="small_list">
      <div class="interface" @click="hiddenSmallList"></div>
      <div class="list">
        <div class="option">
          <div class="left" @click="changeModel">
            <i :class="['iconfont', pattern.icon]"></i>
            <span>{{ pattern.message }} ({{ songList.length }})</span>
          </div>
          <div class="right">
            <i class="iconfont iconshoucang"></i>
            收藏全部
            <i class="iconfont iconrubbish" @click="showOrHidenAlert(true)"></i>
          </div>
        </div>
        <div class="container" ref="wrapper">
          <ul>
            <li v-for="(item, index) in songList" :key="index">
              <div
                class="name"
                :class="[item.id === songId && 'current']"
                @click="selectSong(index, item.id)"
              >
                <i v-if="item.id === songId" class="iconfont iconemptylaba"></i>
                <span class="song_name"
                  >{{ item.name }}
                  {{
                    item.alia && item.alia.length
                      ? "(" + item.alia[0] + ")"
                      : ""
                  }}</span
                ><span class="artlist_name"
                  >-
                  {{
                    item.ar
                      ? item.ar.map(items => items.name).join("/")
                      : "暂无"
                  }}</span
                >
              </div>
              <i
                class="iconfont iconcha_big"
                @click="removeOneSong(index, item.id)"
              ></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  computed: {
    ...mapState([
      "songList",
      "songId",
      "smalllistFlag",
      "pattern",
      "removePlayListFlag"
    ])
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
  },
  watch: {
    smalllistFlag() {
      this.scroll.refresh();
    },
    removePlayListFlag(val) {
      if (val) this.removeSongList();
    }
  },
  methods: {
    ...mapMutations({
      removeSongList: "REMOVE_SONG_LIST",
      changeModel: "PLAY_MEHODS",
      getSongIndex: "REMOVE_ONG_SONG",
      hiddenSmallList: "CHANGE_SONG_LIST_FLAG"
    }),
    ...mapActions(["checkSong"]),
    showOrHidenAlert() {
      this.$store.state.removeAlertMessage = {
        title: "确定要清空播放列表",
        remove: "清空",
        flag: "removePlayListFlag"
      };
      this.$store.state.fullRemoveFlag = true;
    },
    selectSong(index, id) {
      if (this.songId === id) return;
      this.checkSong(index);
    },
    removeOneSong(index, id) {
      if (this.songList.length === 1) return this.removeSongList();
      this.songList.splice(index, 1);
      if (this.songId !== id) return this.getSongIndex();
      if (this.songList.length === index) this.checkSong(index - 1);
      else this.checkSong(index);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.small-enter-active,
.small-leave-active {
  transition: transform 0.3s;
}
.small-enter,
.small-leave-to {
  transform: translateY(100%);
}
.small_list {
  width: 100%;
  height: 3.5rem;
  position: fixed;
  left: 0;
  bottom: 0;
  .interface {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .list {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-top-right-radius: 0.15rem;
    border-top-left-radius: 0.15rem;
    .option {
      display: flex;
      height: 0.3rem;
      line-height: 0.3rem;
      padding: 0 0.1rem;
      font-size: $best-small-font;
      justify-content: space-between;
      border-bottom: 1px solid $border-color;
      font-size: 0.12rem;
      .right {
        .iconfont {
          display: inline-block;
          font-size: 0.12rem;
          color: $nofind-color;
        }
        .iconshoucang {
          padding-right: 0.05rem;
        }
        .iconrubbish {
          padding-left: 0.1rem;
        }
      }
      .left {
        .iconfont {
          color: $nofind-color;
          font-size: 0.12rem;
          padding-right: 0.05rem;
        }
      }
    }
    .container {
      overflow: hidden;
      height: 3.2rem;
      ul {
        padding-bottom: 0.2rem;
        > li {
          display: flex;
          box-sizing: border-box;
          padding: 0 0.1rem;
          justify-content: space-between;
          height: 0.4rem;
          line-height: 0.4rem;
          .name {
            width: calc(100vw - 0.4rem);
            @include text-overflow-one;
            .song_name {
              font-size: $best-small-font;
            }
            .artlist_name {
              font-size: $best-small-font;
              color: $noselect-color;
            }
            .iconemptylaba {
              font-size: $normal-font;
              margin-right: 0.05rem;
            }
          }
          .current {
            color: $main-background;
            .artlist_name {
              color: $main-background;
            }
          }
          .iconcha_big {
            font-size: 0.12rem;
            color: $nofind-color;
          }
        }
      }
    }
  }
}
</style>
