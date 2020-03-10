<template>
  <div class="user_collection">
    <div class="opation" ref="wrapper">
      <ul>
        <li>
          <div class="icon_box">
            <i class="iconfont iconicon-fm"></i>
          </div>
          <span>私人FM</span>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconicon-fm"></i>
          </div>
          <span>最嗨电音</span>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconicon-fm"></i>
          </div>
          <span>Sati空间</span>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconicon-fm"></i>
          </div>
          <span>ACG专区</span>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconicon-fm"></i>
          </div>
          <span>ACG专区</span>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconicon-fm"></i>
          </div>
          <span>ACG专区</span>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconicon-fm"></i>
          </div>
          <span>ACG专区</span>
        </li>
      </ul>
    </div>
    <div class="collection">
      <ul>
        <li>
          <i class="iconfont iconbofang-s"></i>
          <p>
            最近播放<span>({{ historyMusic.length }})</span>
          </p>
        </li>
        <li>
          <i class="iconfont icondiantai"></i>
          <p>
            我的电台<span>({{ userMessage.djRadioCount || 0}})</span>
          </p>
        </li>

        <li>
          <i class="iconfont iconwo"></i>
          <p>
            我的收藏<span
              >({{ (userMessage.mvCount + userMessage.artistCount) || 0 }})</span
            >
          </p>
        </li>
      </ul>
    </div>
    <div class="bg"></div>
    <div class="create_list">
      <header>
        <div class="list_num" @click="creList = !creList">
          <i
            :class="[!creList ? 'back' : 'rotate']"
            class="iconfont iconyoujiantou"
          ></i>
          <h5>
            创建的歌单<span>({{ userMessage.createdPlaylistCount || 0 }})</span>
          </h5>
        </div>
        <div class="select">
          <i class="iconfont iconadd"></i>
          <i class="iconfont iconziyuan"></i>
        </div>
      </header>
      <transition name="fade">
        <ul class="user" v-show="creList">
          <li
            @click="toPlayList(item)"
            :key="item.id"
            v-for="(item, index) in playList.slice(
              0,
              userMessage.createdPlaylistCount
            )"
          >
            <div class="item_box">
              <div class="img_box">
                <img v-lazy="item.coverImgUrl" alt="" />
              </div>
              <div class="name">
                <p>
                  {{
                    index === 0 && item.creator.userId === userId
                      ? "我喜欢的音乐"
                      : item.name
                  }}
                </p>
                <p class="list_message">{{ item.trackCount }}首</p>
              </div>
            </div>
            <div class="mode" v-if="index === 0">
              <i class="iconfont iconlove"></i>
              <span> 心动模式</span>
            </div>
            <i v-else class="iconfont iconziyuan"></i>
          </li>
        </ul>
      </transition>
    </div>
    <div class="collention_list">
      <header class="header">
        <div class="list_num" @click="colList = !colList">
          <i
            :class="[!colList ? 'back' : 'rotate']"
            class="iconfont iconyoujiantou"
          ></i>
          <h5>
            收藏的歌单<span
              >({{ (playList.length - userMessage.createdPlaylistCount) || 0 }})</span
            >
          </h5>
        </div>
        <div>
          <i class="iconfont iconziyuan"></i>
        </div>
      </header>
      <transition name="fade">
        <ul v-show="colList">
          <li
            v-for="item in playList.slice(userMessage.createdPlaylistCount)"
            :key="item.id"
            @click="toPlayList(item)"
          >
            <div class="item_box">
              <div class="img_box">
                <img v-lazy="item.coverImgUrl" alt="" />
              </div>
              <div class="name">
                <p>{{ item.name }}</p>
                <p class="list_message">
                  {{ item.trackCount }}首 by {{ item.creator.nickname }}
                </p>
              </div>
            </div>
            <i class="iconfont iconziyuan"></i>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      userMessage: {},
      historyMusic: [],
      playList: [],
      colList: true,
      creList: true
    };
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper, "scroll", true, false);
  },
  created() {
    if (this.userId) {
      this.getAllCount();
      this.getHistoryMusic();
    }
  },
  computed: {
    ...mapState(["userId"])
  },
  methods: {
    ...mapMutations({ setPlayList: "SET_PLAYLIST" }),
    toPlayList(detil) {
      this.setPlayList(detil);
      this.$router.push({ name: "songlist", params: { id: detil.id } });
    },
    async getAllCount() {
      const data = await this.$getAxios("/user/subcount");
      this.userMessage = data;
      this.getPlayList();
    },
    async getPlayList() {
      const { playlist } = await this.$getAxios(
        "/user/playlist?uid=" + this.userId
      );
      this.playList = playlist;
    },
    async getHistoryMusic() {
      const { allData } = await this.$getAxios(
        `/user/record?uid=${this.userId}&type=0`
      );
      this.historyMusic = allData;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.user_collection {
  .opation {
    width: 100%;
    ul {
      display: inline-flex;
      border-bottom: 1px solid #eaeaea;
      > li {
        width: 0.6rem;
        text-align: center;
        padding: 0.15rem 0.05rem;
        font-size: $best-small-font;
        span {
          color: #999;
        }
        .icon_box {
          margin: 0 auto;
          width: 0.4rem;
          height: 0.4rem;
          background-color: $main-background;
          border-radius: 50%;
          margin-bottom: 0.08rem;
          .iconfont {
            line-height: 0.4rem;
            font-size: 0.25rem;
            color: #eee;
          }
        }
      }
    }
  }
  .collection {
    ul {
      padding-left: $normal-font;
      > li {
        display: flex;
        line-height: 0.5rem;
        .iconfont {
          font-size: 0.2rem;
          color: #4d4d4d;
        }
        p {
          margin: 0;
          width: 100%;
          font-size: $normal-font;
          margin-left: 0.15rem;
          border-bottom: 1px solid #eaeaea;
          span {
            margin-left: 0.05rem;
            color: #999;
          }
        }
      }
      li:last-child p {
        border: none;
      }
    }
  }
  .bg {
    width: 100%;
    height: 0.05rem;
    background-color: #f5f5f5;
  }
  .create_list,
  .collention_list {
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s linear;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
    padding: 0 0.1rem;
    header {
      display: flex;
      justify-content: space-between;
      height: 0.4rem;
      line-height: 0.4rem;
      .list_num {
        display: flex;
        h5 {
          margin: 0;
          font-size: $normal-font;
          span {
            color: #999;
            font-weight: normal;
            margin-left: 0.05rem;
          }
        }
        .iconfont {
          display: block;
          margin-right: 0.05rem;
        }
        .rotate {
          animation: icon_rotate 0.3s linear forwards;
        }
        .back {
          animation: icon_back 0.3s linear forwards;
        }
        @keyframes icon_rotate {
          to {
            transform: rotate(90deg);
          }
        }
        @keyframes icon_back {
          from {
            transform: rotate(90deg);
          }
          to {
            transform: rotate(0);
          }
        }
      }
      .iconziyuan {
        margin-left: 0.05rem;
      }
    }
    ul {
      > li {
        height: 0.5rem;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding-left: 0.05rem;
        margin-bottom: 0.1rem;
        line-height: 0.5rem;
        .iconfont {
          color: #999;
        }
        .item_box {
          @include small_artlist_box(0.5rem, 0.05rem);
          width: 100%;
          @include play_list(0.1rem);
          .name {
            width: calc(100vw - 1.1rem);
          }
        }
      }
    }
    .user li:first-child {
      .item_box {
        width: 70%;
        .name {
          width: calc(100vw - 1.8rem);
        }
      }
      .mode {
        width: 0.8rem;
        height: 0.25rem;
        transform: scale(0.9);
        margin-top: 0.125rem;
        text-align: center;
        line-height: 0.25rem;
        border-radius: 0.15rem;
        border: 1px solid #eaeaea;
        font-size: $best-small-font;
        .iconfont {
          font-size: $best-small-font;
        }
      }
    }
  }
}
</style>
