<template>
  <div class="dj_box">
    <div class="dj_list" v-if="djRadios.length">
      <header>
        <h5>电台</h5>
      </header>
      <ul>
        <li v-for="item in djRadios" :key="item.id">
          <div class="img_box">
            <img v-lazy="item.picUrl" alt="" />
          </div>
          <div class="name">
            <p class="list_name">{{ item.name }}</p>
            <p class="list_message">{{ item.dj.nickname }}</p>
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
import { mapState } from "vuex";
export default {
  data() {
    return {
      djRadios: [],
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
    djFlag: Boolean
  },
  computed: {
    ...mapState(["word"])
  },
  created() {
    this.getdjRadios();
  },
  activated() {
    this.$emit("initPullUp");
  },
  watch: {
    word() {
      this.getdjRadios();
    },
    djFlag(val) {
      if (!this.offset) {
        this.$emit("initPullUp");
        return;
      }
      if (this.flag && val) {
        this.getdjRadiosList();
      }
    }
  },
  methods: {
    async getdjRadiosList() {
      if (!this.flag && !this.offset) return;
      this.isLoading = true;
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1009&offset=${this.offset * 30}`
      );
      if (!result || !result.djRadios || !result.djRadios.length) {
        this.flag = false;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.djRadios = this.djRadios.concat(result.djRadios);
      this.offset++;
      this.$emit("initPullUp");
    },
    async getdjRadios() {
      Object.assign(this.$data, this.$options.data());
      this.$emit("startLoading", true);
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1009`
      );
      if (result && result.djRadios && result.djRadios.length) {
        this.offset++;
        this.$emit("startLoading", false);
        this.djRadios = result.djRadios;
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
.dj_box {
  .dj_list {
    @include search_header;
    header {
        h5 {
            font-size: 0.13rem;
        }
    }
    ul > li {
      @include small_artlist_box(0.5rem, 0.03rem);
      @include play_list(0.1rem);
      margin-bottom: 0.1rem;
      .name {
        width: calc(100vw - 0.8rem);
        .list_name {
          span {
            color: $noselect-color;
          }
        }
      }
    }
    @include loading_box;
  }
  @include not_find;
}
</style>
