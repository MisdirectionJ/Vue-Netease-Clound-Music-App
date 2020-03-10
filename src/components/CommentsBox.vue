<template>
  <div class="comment_box">
    <TopHeader>
      <template #left>
        <div>
          <i @click="$router.back()" class="iconfont iconleft"></i
          ><span
            >评论<span v-if="total">({{ total }})</span></span
          >
        </div>
      </template>
      <template #right>
        <i class="iconfont iconshare-m"></i>
      </template>
    </TopHeader>
    <div
      ref="wrapper"
      class="container_box"
      v-show="flag"
      @touchstart="removeUser"
    >
      <div class="container">
        <div class="title_name" @click="$router.back()">
          <div class="left">
            <div class="img_box">
              <img v-lazy="commentDetil.picUrl" alt="" />
            </div>
            <div class="name">
              <p class="list_name">{{ commentDetil.name }}</p>
              <p class="list_message">
                {{ commentDetil.type === "playlist" ? "by " : "" }}
                <span class="artlist_name">{{ commentDetil.nickname }}</span>
              </p>
            </div>
          </div>
          <i class="iconfont iconyoujiantou"></i>
        </div>
        <div class="bg"></div>
        <div class="hot_comment" v-if="hotComments.length">
          <header>
            <h5>精彩评论</h5>
          </header>
          <ul class="comment_list" :class="moreHot && 'remove_border'">
            <li v-for="item in hotComments" :key="item.id">
              <div class="img_box" @click="toUserDetil(item.user.userId)">
                <img v-lazy="item.user.avatarUrl" alt="" />
              </div>
              <div class="comment_small_box" @click="setOtherUser(item)">
                <header>
                  <div class="user_name">
                    <p class="name">
                      {{ item.user.nickname }}
                      <span
                        v-if="item.user.vipRights"
                        :style="
                          'background-image: url(' +
                            (item.user.vipRights.redVipAnnualCount == 1
                              ? 'https://p1.music.126.net/OeOahPin96CFyHmEnH2grA==/109951163446555771.png'
                              : 'https://p1.music.126.net/y4OeNm5rXOfqWF4f8VuhUw==/109951163703946326.png') +
                            ')'
                        "
                        class="vip"
                      ></span>
                    </p>
                    <p class="time">{{ item.time | timeComment }}</p>
                  </div>
                  <div
                    class="zan"
                    @click.stop="toLike(item.commentId, item.liked)"
                  >
                    <span v-if="item.likedCount">{{ item.likedCount }} </span>
                    <i
                      :class="[
                        'iconfont',
                        item.liked ? 'iconliked' : 'iconzan'
                      ]"
                    ></i>
                  </div>
                </header>
                <p class="container">
                  {{ item.content }}
                </p>
              </div>
            </li>
            <li class="more_component" v-if="moreHot">
              <p>全部精彩评论<i class="iconfont iconyoujiantou"></i></p>
            </li>
          </ul>
        </div>
        <div class="new_comment">
          <header>
            <h5>
              最新评论 <span class="num">{{ total }}</span>
            </h5>
          </header>
          <ul class="comment_list" :style="!comments.length && 'border: none;'">
            <li v-for="(item, index) in comments" :key="index">
              <div class="img_box" @click="toUserDetil(item.user.userId)">
                <img v-lazy="item.user.avatarUrl" alt="" />
              </div>
              <div class="comment_small_box" @click="setOtherUser(item)">
                <header>
                  <div class="user_name">
                    <p class="name">
                      {{ item.user.nickname }}
                      <span
                        v-if="item.user.vipRights"
                        :style="
                          'background-image: url(' +
                            (item.user.vipRights.redVipAnnualCount == 1
                              ? 'https://p1.music.126.net/OeOahPin96CFyHmEnH2grA==/109951163446555771.png'
                              : 'https://p1.music.126.net/y4OeNm5rXOfqWF4f8VuhUw==/109951163703946326.png') +
                            ')'
                        "
                        class="vip"
                      ></span>
                    </p>
                    <p class="time">{{ item.time | timeComment }}</p>
                  </div>
                  <div
                    class="zan"
                    @click.stop="toLike(item.commentId, item.liked)"
                  >
                    <span v-if="item.likedCount">{{ item.likedCount }} </span>
                    <i
                      :class="[
                        'iconfont',
                        item.liked ? 'iconliked' : 'iconzan'
                      ]"
                    ></i>
                  </div>
                </header>
                <p class="replay" v-if="item.beReplied.length">
                  {{ item.content }}
                </p>
                <p
                  class="container"
                  :class="item.beReplied.length && 'replay_container'"
                >
                  <span class="replay_user" v-if="item.beReplied.length">{{
                    item.beReplied.length
                      ? "@" + item.beReplied[0].user.nickname
                      : ""
                  }}</span
                  >{{
                    item.beReplied.length
                      ? ": " + (item.beReplied[0].content || "该用户已删除评论")
                      : item.content
                  }}
                </p>
              </div>
            </li>
          </ul>
          <div
            class="no_comment"
            v-if="!comments.length && !hotComments.length"
          >
            <span>暂无评论, 欢迎抢沙发</span>
          </div>
          <Loading v-if="isLoading"></Loading>
        </div>
      </div>
    </div>
    <div class="comment_input">
      <input
        ref="comInput"
        v-model.trim="message"
        type="text"
        placeholder="写评论..."
        @keyup.enter="sendMessage"
      />
      <div
        :class="['send', message.length && 'send_color']"
        @click="sendMessage"
      >
        发送
      </div>
    </div>
    <AlertOption
      v-if="aletOptionFlag"
      :otherUserId="otherUserComment.user.userId"
      @toggleAlertOption="toggleAlertOption"
      @removeMessage="removeMessage"
      @readyreplay="readyreplay"
    ></AlertOption>
    <SmallAlert v-if="requestFlag">
      {{ requestMessage }}
    </SmallAlert>
    <Loading v-if="!flag"></Loading>
  </div>
</template>

<script>
import TopHeader from "components/TopHeader";
import Loading from "components/Loading";
import SmallAlert from "components/SmallAlert";
import AlertOption from "components/AlertOption";
import { mapState } from "vuex";
import { comment } from "common/js/mixin.js";
export default {
  name: "CommentsBox",
  data() {
    return {
      hotComments: [],
      moreHot: false,
      comments: [],
      total: "",
      more: false,
      offset: 0,
      isLoading: false,
      aletOptionFlag: false,
      flag: false,
      message: "",
      otherUserComment: null,
      requestFlag: false,
      requestMessage: ""
    };
  },
  components: {
    TopHeader,
    Loading,
    SmallAlert,
    AlertOption
  },
  created() {
    this.getComment();
  },
  computed: {
    ...mapState(["commentDetil"])
  },
  mounted() {
    this.input = this.$refs.comInput;
    this.$scroll(this, this.$refs.wrapper);
    this.scroll.on("pullingUp", () => {
      this.getOtherComment();
    });
  },
  mixins: [comment],
  methods: {
    toUserDetil(id) {
      this.$store.state.audioBoxFlag = false
      this.$router.push({ name: "user", params: { id } });
    },
    //点赞
    async toLike(id, liked) {
      await this.$getAxios(
        `/comment/like?id=${this.commentDetil.id}&cid=${id}&t=${
          liked ? 0 : 1
        }&type=${this.commentDetil.numType}`
      );
    },
    //删除评论
    async removeMessage() {
      this.toggleAlertOption();
      try {
        await this.$getAxios(
          `/comment?t=0&type=${this.commentDetil.numType}&id=${this.commentDetil.id}&commentId=${this.otherUserComment.commentId}`
        );
        this.requestFun("删除成功");
      } catch {
        this.requestFun("删除失败");
      }
      this.removeUser();
      this.message = "";
    },
    //回复+发表
    async sendMessage() {
      if (!this.message) return;
      try {
        await this.$getAxios(
          `/comment?t=${this.otherUserComment ? 2 : 1}&type=${
            this.commentDetil.numType
          }&id=${this.commentDetil.id}${
            this.otherUserComment
              ? "&commentId=" + this.otherUserComment.commentId
              : ""
          }&content=${this.message}`
        );
        this.requestFun(this.otherUserComment ? "回复成功" : "发表成功");
      } catch {
        this.requestFun(this.otherUserComment ? "回复失败" : "发表失败");
      }
      this.removeUser();
      this.message = "";
      this.input.blur();
    },
    //获取评论
    async getOtherComment() {
      this.isLoading = true;
      const { comments, more } = await this.$getAxios(
        `/comment/${this.commentDetil.type}?id=${
          this.commentDetil.id
        }&offset=${this.offset * 20}`
      );
      if (comments.length) {
        this.comments = this.comments.concat(comments);
        this.more = more;
        if (this.more) {
          this.offset++;
          this.scroll.finishPullUp();
        }
      }
      this.isLoading = false;
    },
    async getComment() {
      const {
        hotComments,
        total,
        moreHot,
        comments,
        more
      } = await this.$getAxios(
        `/comment/${this.commentDetil.type}?id=${this.commentDetil.id}`
      );
      this.hotComments = hotComments;
      this.comments = comments;
      this.flag = true;
      this.more = more;
      this.total = total;
      this.moreHot = moreHot;
      this.offset++;
    }
  }
};
</script>

.<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.comment_box {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  position: fixed;
  left: 0;
  z-index: 1;
  top: 0;
  .top_header {
    color: #fff;
    display: flex;
    justify-content: space-between;
  }
  .container_box {
    height: calc(100vh - 0.5rem);
    overflow: hidden;
    .container {
      padding-bottom: 1rem;
      .title_name {
        box-sizing: border-box;
        height: 1rem;
        padding: 0.15rem 0.1rem;
        display: flex;
        justify-content: space-between;
        line-height: 0.7rem;
        .left {
          @include small_artlist_box(0.7rem, 0.05rem);
          @include play_list;
          .name {
            width: calc(100vw - 1.3rem);
            .list_name {
              font-size: $normal-font;
            }
          }
          .artlist_name {
            color: $keyword-color;
          }
        }
      }
      .bg {
        height: 0.05rem;
        width: 100%;
        background-color: #f5f5f5;
      }
      .hot_comment,
      .new_comment {
        padding-left: 0.1rem;
        header {
          h5 {
            margin: 0;
            font-size: $best-small-font;
            font-weight: 800;
          }
          height: 0.3rem;
          line-height: 0.3rem;
        }
        .comment_list {
          border-bottom: 1px solid #eee;
          margin-top: 0.1rem;
          > li {
            display: flex;
            font-size: $best-small-font;
            margin-bottom: 0.1rem;
            padding-right: 0.1rem;
            .img_box {
              width: 0.3rem;
              height: 0.3rem;
              margin-right: 0.1rem;
              position: relative;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .comment_small_box {
              width: calc(100vw - 0.6rem);
              .container {
                border-bottom: 1px solid #eee;
                padding-bottom: 0.05rem;
                line-height: 0.2rem;
                margin: 0.05rem 0 0 0;
              }
              header {
                display: flex;
                justify-content: space-between;
                height: 0.4rem;
                .user_name {
                  line-height: 0.2rem;

                  p {
                    margin: 0;
                    @include text-overflow-one;
                    width: calc(100vw - 1.2rem);
                  }
                  .name {
                    color: #666666;
                    font-size: $normal-font;
                    .vip {
                      width: 0.3rem;
                      height: 0.1rem;
                      display: inline-block;
                      margin-left: 0.02rem;
                      background-repeat: no-repeat;
                      background-size: contain;
                      background-position: left center;
                    }
                  }
                  .time {
                    color: $nofind-color;
                  }
                }
                .zan {
                  color: $nofind-color;
                  font-size: $best-small-font;
                  line-height: 0.4rem;
                  .iconliked {
                    color: $main-background;
                  }
                }
              }
            }
          }
          li:last-child .container {
            border: none;
          }
          .more_component {
            p {
              font-size: $best-small-font;
              color: $noselect-color;
              margin: 0;
              border: 1px solid $border-color;
              padding: 0.05rem 0.1rem;
              margin: 0 auto;
              border-radius: 0.2rem;
              .iconfont {
                font-size: $best-small-font;
              }
            }
          }
        }
        .remove_border {
          li:nth-last-child(2) .container {
            border: none;
          }
        }
      }
      .new_comment {
        .num {
          font-size: $best-small-font;
          color: $noselect-color;
          font-weight: normal;
        }
        .replay {
          margin: 0.05rem 0 0 0;
          line-height: 0.2rem;
        }
        .replay_container {
          border-left: 2px solid $border-color;
          color: $nofind-color;
          padding-left: 0.05rem;
        }
        .replay_user {
          color: $keyword-color;
        }
        @include loading_box;
        .loading_box {
          top: 0.1rem;
        }
        .no_comment {
          height: 0.3rem;
          margin-top: 0.5rem;
          font-size: $best-small-font;
          line-height: 0.3rem;
          color: $noselect-color;
          text-align: center;
          box-sizing: border-box;
          padding-right: 0.1rem;
        }
      }
    }
  }
  .comment_input {
    border-top: 1px solid #f5f5f5;
    height: 0.4rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    font-size: $best-small-font;
    input {
      width: 90%;
      height: 0.4rem;
      box-sizing: border-box;
      border: none;
      outline: none;
      padding-left: 0.1rem;
      font-size: $normal-font;
      background: rgba(255, 255, 255, 0.9);
      &::-webkit-input-placeholder {
        color: #cccccc;
      }
    }
    .send {
      background: rgba(255, 255, 255, 0.9);
      color: #cccccc;
      width: 0.4rem;
      height: 0.4rem;
      font-size: $normal-font;
      text-align: center;
      line-height: 0.4rem;
    }
    .send_color {
      color: #000;
    }
  }
  .loading_box {
    top: 1.5rem;
  }
}
</style>
