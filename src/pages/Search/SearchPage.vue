<template>
  <div class="history_search" ref="wrapperTwo">
    <div
      class="scroll_box"
      :style="{ 'padding-bottom': songId ? '1rem' : '0.5rem' }"
    >
      <div
        class="search_small_box"
        v-show="historyWord.length && hotDetil.length"
      >
        <header>
          <h5>历史记录</h5>
          <i class="iconfont iconrubbish" @click="showRemoveAlert"></i>
        </header>
        <div ref="wrapper" class="history_list">
          <ul>
            <li
              v-for="(item, index) in historyWord"
              :key="index"
              @click="toSaveStroge(item.value)"
            >
              {{ item.value }}
            </li>
          </ul>
        </div>
      </div>
      <div class="search_top" v-if="hotDetil.length">
        <h5>热搜榜</h5>
        <ul>
          <li
            v-for="(item, index) in hotDetil"
            :key="index"
            @click="toSaveStroge(item.searchWord)"
          >
            <div class="left" :class="index < 3 && 'top_color'">
              <div class="num">
                {{ index + 1 }}
              </div>
              <div class="name">
                <p class="word_name">
                  {{ item.searchWord }}
                  <span
                    v-if="item.iconUrl"
                    :style="'background-image: url(' + item.iconUrl + ')'"
                  ></span>
                </p>
                <p class="artlist_name">{{ item.content }}</p>
              </div>
            </div>
            <div class="right">{{ item.score }}</div>
          </li>
        </ul>
      </div>
      <Loading v-if="!hotDetil.length"></Loading>
    </div>
  </div>
</template>
<script>
import Loading from "components/Loading";
import { mapMutations, mapState } from "vuex";
export default {
  name: "SearchPage",
  data() {
    return {
      hotDetil: [],
      historyWord: []
    };
  },
  computed: {
    ...mapState(["songId", 'removeSessionFlag'])
  },
  props: {
    searchComponentId: String,
  },
  watch: {
    removeSessionFlag (val) {
      if(val) this.remove()
    }
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper, "scroll", false, false);
    this.$scroll(this, this.$refs.wrapperTwo, "scrollTwo", true);
  },
  created() {
    this.historyWord =
      JSON.parse(window.localStorage.getItem("_search_")) || [];
    this.getHotDetil();
  },
  methods: {
    ...mapMutations({ changeWord: "SEARCH_WORD", changeRemoveFlag: 'SETREMOVE_ALERT_FLAG' }),
    showRemoveAlert () {
      this.$store.state.fullRemoveFlag = true
      this.$store.state.removeAlertMessage = {
        title: '确定要清空全部历史记录',
        remove: '清空',
        flag: 'removeSessionFlag'
      }
    },
    toSaveStroge(word) {
      this.changeWord(word); //初始化 state。word
      this.$emit("changeCmponentId");
    },
    remove() {
      window.localStorage.setItem("_search_", "[]");
      this.historyWord = [];
      this.changeRemoveFlag({el: 'removeSessionFlag', flag: false})
    },
    async getHotDetil() {
      const { data } = await this.$getAxios("/search/hot/detail");
      this.hotDetil = data;
    }
  },
  components: {
    Loading
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";

.history_search {
  box-sizing: border-box;
  height: calc(100vh - 0.5rem);
  overflow: hidden;
  .scroll_box {
    padding-bottom: 0.6rem;
  }
  .search_small_box {
    padding: 0.2rem 0.1rem 0;
    header {
      height: 0.3rem;
      line-height: 0.3rem;
      display: flex;
      justify-content: space-between;
      .iconfont {
        color: #b4b4b4;
        font-size: $normal-font;
      }
      h5 {
        margin: 0;
        font-size: $normal-font;
      }
    }
    .history_list {
      overflow: hidden;
      margin-top: 0.1rem;
    }
    ul {
      display: inline-block;
      white-space: nowrap;
      > li {
        height: 0.3rem;
        padding: 0 0.1rem;
        display: inline-block;
        margin-left: 0.1rem;
        border-radius: 0.1rem;
        line-height: 0.3rem;
        background-color: #f3f3f3;
        font-size: $best-small-font;
      }
      li:first-child {
        margin-left: 0;
      }
    }
  }
  .loading_box {
    top: 1.5rem;
  }
  .search_top {
    padding: 0.3rem 0.1rem 0 0;
    h5 {
      font-size: $normal-font;
      line-height: 0.3rem;
      margin: 0;
      margin-left: 0.1rem;
    }
    ul {
      > li {
        justify-content: space-between;
        display: flex;
        margin-top: 0.1rem;
        .left {
          display: flex;
          width: 85%;
        }
        .right {
          color: #ccc;
          line-height: 0.5rem;
          font-size: $best-small-font;
        }
        .num {
          width: 0.4rem;
          line-height: 0.5rem;
          text-align: center;
          color: $nofind-color;
        }
        .top_color {
          .num {
            color: $main-background;
          }
          .word_name {
            font-weight: 800;
          }
        }
        .name {
          width: 80%;
          p {
            margin: 0;
            line-height: 0.22rem;
            @include text-overflow-one;
          }
          .word_name {
            font-size: 0.13rem;
            span {
              display: inline-block;
              height: 0.14rem;
              width: 0.22rem;
              margin-left: 0.05rem;
              background-size: contain;
              background-repeat: no-repeat;
              background-position: left center;
            }
          }
          .artlist_name {
            font-size: $best-small-font;
            color: $noselect-color;
          }
        }
      }
    }
  }
}
</style>
