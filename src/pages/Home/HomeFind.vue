<template>
  <div class="find_box">
    <div class="swiper_container">
      <swiper :options="swiperOption" class="m_swiper" v-if="banners.length">
        <div class="swiper-pagination" slot="pagination"></div>
        <swiper-slide
          class="swiper_slide"
          v-for="item in banners"
          :key="item.bannerId"
        >
          <img :src="item.pic" @click="showOther(item)" />
        </swiper-slide>
      </swiper>
    </div>
    <nav>
      <ul>
        <li @click="$router.push('/home/commend')">
          <div class="icon_box">
            <i class="iconfont iconcommend"></i>
          </div>
          <p>每日推荐</p>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconsonglist"></i>
          </div>
          <p>歌单</p>
        </li>
        <li @click="$router.push('/home/top')">
          <div class="icon_box">
            <i class="iconfont icontop"></i>
          </div>
          <p>排行榜</p>
        </li>
        <li @click="$router.push('/home/dj')">
          <div class="icon_box">
            <i class="iconfont icondiantai"></i>
          </div>
          <p>电台</p>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconzhibo"></i>
          </div>
          <p>直播</p>
        </li>
      </ul>
    </nav>
    <div class="commend_list">
      <header v-show="songList.length">
        <h5>推荐歌单</h5>
        <div class="list_space"><span>歌单广场</span></div>
      </header>
      <div class="list_box">
        <ul>
          <SongListBox
            v-for="item in homeSongList"
            :key="item.id"
            :item="item"
          ></SongListBox>
        </ul>
      </div>
    </div>
    <div class="commend_list">
      <header v-show="homeSongList.length">
        <div class="left">
          <h5 @click="selectDieOrSong" :class="selectDieOrSongFlag && 'normal'">
            新碟
          </h5>
          <span>|</span>
          <h5
            @click="selectDieOrSong"
            :class="[!selectDieOrSongFlag && 'normal']"
          >
            新歌
          </h5>
        </div>
        <div class="list_space">
          <span>{{ message }}</span>
        </div>
      </header>
      <div class="list_box">
        <keep-alive>
          <component
            :is="componBox"
            :albums="albums"
            :commendSongList="commendSongList"
          ></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import SongListBox from "components/SongListBox";
import NewDieBox from "components/NewDieBox";
import NewSongBox from "components/NewSongBox";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "HomeFind",
  data() {
    return {
      componBox: "NewDieBox",
      message: "更多新碟",
      selectDieOrSongFlag: false,
      albums: [],
      banners: [],
      homeSongList: [],
      commendSongList: [],
      swiperOption: {
        pagination: { el: ".swiper-pagination", clickable: true },
        loop: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        autoplay: {
          disableOnInteraction: false
        },
        speed: 1000
      }
    };
  },
  computed: {
    ...mapState(["songIndex", "songList", "songId"])
  },
  methods: {
    ...mapMutations({ setSongList: "SEND_ALLSONGS" }),
    ...mapActions(["getOneAudio", "getAudioSrcList", 'checkSong']),
    showOther(item) {
      if (item.url) window.open(item.url);
      if (!item.song) return;
      this.$store.state.audioBoxFlag = true;
      if (item.song.id === this.songId) return;
      if (this.songList.length) {
        const index = this.songList.findIndex(ite => ite.id === item.song.id);
        if (index > -1) return this.checkSong(index);
        this.$store.state.songList.splice(
          this.songIndex + 1,
          0,
          JSON.parse(JSON.stringify(item.song))
        );
        this.getOneAudio({
          id: item.song.id,
          _index: this.songIndex + 1,
          _flag: true
        });
        return;
      }
      this.setSongList({
        songList: JSON.parse(JSON.stringify([item.song])),
        _flag: true
      });
      this.getAudioSrcList();
    },
    selectDieOrSong() {
      if (this.selectDieOrSongFlag) {
        this.message = "更多新碟";
        this.componBox = "NewDieBox";
      } else {
        this.message = "新歌推荐";
        this.componBox = "NewSongBox";
      }

      this.selectDieOrSongFlag = !this.selectDieOrSongFlag;
    },
    async getBannerS() {
      try {
        const { banners } = await this.$getAxios("/banner?type=2");
        this.banners = banners;
      } catch {
        return;
      }
    },
    async getSongList() {
      const { result } = await this.$getAxios("/personalized/?limit=6");
      this.homeSongList = result;
    },
    async getNewDieList() {
      const { albums } = await this.$getAxios("/top/album?limit=3");
      this.albums = albums;
    },
    async getNewSongList() {
      const { result } = await this.$getAxios("/personalized/newsong?limit=3");
      this.commendSongList = result;
    }
  },
  created() {
    this.getBannerS();
    this.getSongList();
    this.getNewDieList();
    this.getNewSongList();
  },
  components: {
    swiper,
    swiperSlide,
    SongListBox,
    NewDieBox,
    NewSongBox
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
.swiper_container {
  width: 100%;
  height: 1rem;
  background-color: $main-background;
  padding-top: 0.06rem;
  box-sizing: border-box;
  .m_swiper {
    z-index: 0;
    img {
      width: 3rem;
      height: 1.2rem;
      border-radius: 0.05rem;
      margin-left: 0.1rem;
    }
    /deep/ .swiper-pagination-bullet {
      background-color: rgba(255, 255, 255, 0.9);
    }
    /deep/ .swiper-pagination-bullet-active {
      background: $main-background;
    }
  }
}
nav {
  width: 100%;
  padding-top: 0.4rem;
  ul {
    height: 100%;
    display: flex;
    padding-bottom: 0.1rem;
    border-bottom: 1px solid $border-color;
    > li {
      width: 20%;
      .icon_box {
        width: 0.4rem;
        height: 0.4rem;
        background-color: $main-background;
        border-radius: 50%;
        text-align: center;
        line-height: 0.4rem;
        color: #fff;
        margin: 0 auto;
        .iconfont {
          font-size: 0.2rem;
        }
      }
      p {
        margin: 0;
        text-align: center;
        transform: scale(0.8);
        padding: 0.05rem 0;
      }
    }
  }
}
.commend_list {
  padding: 0.1rem 0.1rem 0 0.1rem;
  header {
    height: 0.3rem;
    display: flex;
    line-height: 0.3rem;
    justify-content: space-between;
    h5 {
      margin: 0;
      font-size: 0.14rem;
    }
    .left {
      display: flex;
      h5 {
        width: 0.3rem;
      }
      span {
        color: #ededed;
        margin: 0 0.05rem;
      }
      .normal {
        font-size: $best-small-font;
        color: $noselect-color;
        font-weight: normal;
      }
    }
    .list_space {
      font-size: $best-small-font;
      line-height: 0.3rem;
      span {
        border: 1px solid #eee;
        padding: 0.03rem 0.08rem;
        border-radius: $best-big-font;
      }
    }
  }
  .list_box {
    padding-top: 0.1rem;
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
}
</style>
