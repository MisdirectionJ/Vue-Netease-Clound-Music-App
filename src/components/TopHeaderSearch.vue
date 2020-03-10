<template>
  <TopHeader class="top_header">
    <template #left>
      <i class="iconfont iconleft" @click="toBackHome"></i>
    </template>
    <template #center>
      <div
        class="input_box"
        :class="searchComponentId === 'SearchList' && 'new_class'"
        ref="wrapper"
      >
        <input
          ref="input"
          v-focus
          type="text"
          v-model.trim="searchWord"
          :placeholder="defaultWord"
          @input="showKeyWord"
          @blur="blurEvent"
          @focus="focusEvent"
          @keyup.enter="toSetSession"
        />
        <i
          class="iconfont iconcha_big"
          v-show="searchWord.length"
          @click="removeSearchWord"
        ></i>
        <ul class="small_box" v-show="smallFlag">
          <li @touchstart="toSetSession(searchWord)">
            搜索 "{{ searchWord }}"
          </li>
          <li
            v-for="item in allMatch"
            :key="item.keyword"
            @touchstart="toSetSession(item.keyword)"
          >
            <i class="iconfont iconsearch"></i>
            {{ item.keyword }}
          </li>
        </ul>
      </div>
    </template>
    <template #right>
      <i v-if="searchComponentId === 'SearchPage'" class="iconfont iconwo" @click="$router.push('/home/singerlist')"></i>
    </template>
  </TopHeader>
</template>

<script>
import TopHeader from "components/TopHeader";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      searchWord: "",
      defaultWord: "",
      allMatch: [],
      smallFlag: false
    };
  },
  props: {
    searchComponentId: String
  },
  components: {
    TopHeader
  },
  computed: {
    ...mapState(["word"])
  },
  watch: {
    word(val) {
      if (!val) return;
      this.searchWord = val;
      this.$saveStroge("_search_", val);
    },
    searchComponentId(val) {
      if (val === 'SearchList') {
        this.$refs.input.blur()
        this.searchWord = this.word
      }
    }
  },
  created() {
    this.getDefaultWord();
  },
  methods: {
    ...mapMutations({ changeWord: "SEARCH_WORD" }),
    removeSearchWord() {
      this.searchWord = "";
      this.$refs.input.focus();
    },
    blurEvent() {
      this.smallFlag = false;
    },
    focusEvent() {
      if (!this.searchWord.length) {
        this.smallFlag = false;
        this.allMatch = [];
      } else {
        this.smallFlag = true;
      }
    },
    toBackHome() {
      if (this.searchComponentId === "SearchList") {
         this.$emit("changeCmponentId");
         return this.searchWord = ''
      }
      this.$router.back();
    },
    //搜索
    toSetSession(word) {
      if (this.searchComponentId === "SearchPage") {
        this.$emit("changeCmponentId");
      }
      this.$refs.input.blur();
      this.blurEvent();
      if (typeof word !== "string") {
        word = this.searchWord ? this.searchWord : this.defaultWord;
      }
      this.searchWord = word;
      if (this.word === word) return;
      this.changeWord(word); //修改 state.word
    },
    //获取 默认关键词
    async getDefaultWord() {
      const { data } = await this.$getAxios("/search/default");
      this.defaultWord = data.realkeyword;
    },
    // 显示 简略搜索
    async showKeyWord() {
      if (!this.searchWord.length) {
        this.smallFlag = false;
        return;
      }
      this.smallFlag = true;
      const { result = {} } = await this.$getAxios(
        `/search/suggest?keywords=${this.searchWord}&type=mobile`
      );
      this.allMatch = result.allMatch ? result.allMatch : [];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.top_header {
  .iconwo {
    margin-left: 0.1rem;
  }

  .input_box {
    width: 85%;
    .small_box {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0.5rem;
      width: 78%;
      overflow: hidden;
      background-color: #fff;
      box-shadow: 0 0 0.1rem #ccc;
      border-top: none;
      z-index: 1;
      li {
        @include text-overflow-one;
        line-height: 0.3rem;
        width: 100%;
        box-sizing: border-box;
        padding-left: 0.1rem;
        border-bottom: 1px solid #f5f5f5;
        color: $noselect-color;
        overflow: hidden;
        white-space: nowrap;
        font-size: $normal-font;
        .iconsearch {
          color: #bcbdbf;
          margin-right: 0.05rem;
          font-size: $normal-font;
        }
        &:first-child {
          color: $keyword-color;
        }
        &:last-child {
          border: none;
        }
      }
    }
    input {
      border: none;
      width: 100%;
      background-color: $main-background;
      color: $font-color;
      outline: none;
      border-bottom: 1px solid $placeholder-color;
      box-sizing: border-box;
      padding: 0 0.25rem 0.07rem 0;
      caret-color: #fff;
    }
    input::-webkit-input-placeholder {
      color: $placeholder-color;
    }
    .iconcha_big {
      position: absolute;
      right: 0.35rem;
      top: 0;
      font-size: 0.12rem;
    }
    .iconsearch {
      color: #bcbdbf;
      font-size: 0.14rem;
      margin-right: 0.05rem;
    }
  }
  .new_class {
    width: 100%;
    .small_box {
      width: 90%;
    }
    .iconcha_big {
      right: 0.15rem;
      font-size: 0.12rem;
    }
  }
}
</style>
