export const comment = {
methods: {
    readyreplay() {
        this.input.placeholder = "回复: " + this.otherUserComment.user.nickname;
        this.toggleAlertOption();
        this.input.focus();
      },
      setOtherUser(item) {
        this.otherUserComment = item;
        this.toggleAlertOption();
      },
      toggleAlertOption(flag) {
        //flag true 取消回复 清理用户
        if (flag) this.removeUser();
        this.aletOptionFlag = !this.aletOptionFlag;
        this.input.blur();
      },
      //清理用户
      removeUser() {
        if (!this.otherUserComment) return;
        this.input.placeholder = "写评论...";
        this.otherUserComment = null;
      },
      requestFun(message) {
        this.requestMessage = message;
        this.requestFlag = false;
        this.$nextTick(() => {
          this.requestFlag = true;
        });
        clearTimeout(this.time);
        this.time = setTimeout(() => {
          this.requestFlag = false;
        }, 3000);
      }
},
};
