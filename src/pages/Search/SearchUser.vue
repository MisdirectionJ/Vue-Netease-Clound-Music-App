<template>
  <div class="user_box">
    <div class="user_list">
      <ul>
        <li v-for="(item, index) in userprofiles" :key="index">
          <div class="left_box" @click="$router.push({ name: 'user', params: { id: item.userId } })">
            <div class="img_box" >
              <img v-lazy="item.avatarUrl" alt="" />
              <div
                class="user_type"
                v-if="item.userType"
                :class="[
                  item.userType === 2 && 'super_singer',
                  item.userType === 4 && 'super_song',
                  item.userType === 200 && 'super_user'
                ]"
              ></div>
            </div>
            <div class="name">
              <p class="list_name">
                {{ item.nickname
                }}<i
                  :class="[
                    'iconfont',
                    [item.gender > 1 ? 'icongirl' : 'iconnan']
                  ]"
                ></i>
              </p>
              <p class="list_message">{{ item.signature }}</p>
            </div>
          </div>
          <div class="foloow">
            <p v-if="!item.followed" class="no_follow">
              <i class="iconfont iconadd"></i>
              关注
            </p>
            <p class="foloowed" v-else>
              <i class="iconfont iconfollow"></i>
              已关注
            </p>
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
      userprofiles: [],
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
    userFlag: Boolean
  },
  computed: {
    ...mapState(["word"])
  },
  created() {
    this.getuserprofiles();
  },
  activated() {
    this.$emit("initPullUp");
  },
  watch: {
    word() {
      this.getuserprofiles();
    },
    userFlag(val) {
      if (!this.offset) {
        this.$emit("initPullUp");
        return;
      }
      if (this.flag && val) {
        this.getuserprofilesList();
      }
    }
  },
  methods: {
    async getuserprofilesList() {
      if (!this.flag && !this.offset) return;
      this.isLoading = true;
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1002&offset=${this.offset * 30}`
      );
      if (!result || !result.userprofiles || !result.userprofiles.length) {
        this.flag = false;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.userprofiles = this.userprofiles.concat(result.userprofiles);
      this.offset++;
      this.$emit("initPullUp");
    },
    async getuserprofiles() {
      Object.assign(this.$data, this.$options.data());
      this.$emit("startLoading", true);
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1002`
      );
      if (result && result.userprofiles && result.userprofiles.length) {
        this.offset++;
        this.$emit("startLoading", false);
        this.userprofiles = result.userprofiles;
        this.canNotFind = false;
      } else {
        this.$emit("startLoading", false);
        this.canNotFind = true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.user_box {
  padding-top: 0.1rem;
  .user_list {
    ul > li {
      justify-content: space-between;
      margin-bottom: 0.1rem;
      @include small_artlist_box(0.5rem, 50%);
      @include play_list(0.1rem);
      .left_box {
        display: flex;
      }
      .img_box {
        position: relative;
        .user_type {
          width: 0.2rem;
          height: 0.2rem;
          background-repeat: no-repeat;
          position: absolute;
          right: -0.05rem;
          bottom: 0;
          border-radius: 50%;
          transform: scale(0.7);
        }
        .super_singer {
          background-position: -0.02rem -0.02rem;
          background-image: url("~common/images/usericn_2x.png");
        }
        .super_song {
          background-position: -0.42rem -0.02rem;
          background-image: url("~common/images/usericn_2x.png");
        }
        .super_user {
          background-position: -0.82rem -0.02rem;
          background-image: url("~common/images/usericn_2x.png");
        }
      }
      .name {
        width: calc(100vw - 1.5rem);
        .list_name {
          span {
            color: $noselect-color;
          }
          .iconfont {
            margin-left: 0.05rem;
            font-size: 0.12rem;
          }
          .icongirl {
            color: #f38cb5;
          }
          .iconnan {
            color: #6fcdff;
          }
        }
      }
      .foloow {
        margin-top: 0.15rem;
        p {
          transform: scale(0.8);
          margin: 0;
          border: 1px solid $main-background;
          color: $main-background;
          font-size: $best-small-font;
          border-radius: 0.1rem;
          .iconfont {
            font-size: $best-small-font;
          }
        }
        .no_follow {
          padding: 0.04rem 0.08rem;
        }
        .foloowed {
          padding: 0.04rem 0.05rem;
          border: 1px solid $border-color;
          color: $noselect-color;
        }
      }
    }
    @include loading_box;
  }
  @include not_find;
}
</style>
