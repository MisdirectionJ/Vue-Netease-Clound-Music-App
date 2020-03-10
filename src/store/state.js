export default {
  word: null, //搜索关键词
  homeTopBar: true, //为了美观点
  userId: null,
  audioBoxFlag: false,
  fullRemoveFlag: false,
  songList: [],
  audioList: [],
  songId: null,
  songUrl: "",
  smalllistFlag: false,
  lrcFlag: false,
  songIndex: 0,
  audio: null,
  playListDetil: null,
  playListPic: "",
  pattern: {
    icon: "iconxunhuan",
    method: "repeat",
    message: "循环播放"
  },
  mvDetil: null,
  commentDetil: null,
  singerDetil: null,
  albumDetil: null,
  singerId: null,
  otherUserId: null,
  checkSingerArtlist: null,
  removeAlertMessage: {
    title: '',
    remove: '',
    flag: null
  },
  removeSessionFlag: false,
  removePlayListFlag: false,
  toLoginOutFlag: false,
  removeDynamicFlag: false,
};
