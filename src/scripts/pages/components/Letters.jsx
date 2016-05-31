import React from "react";
import ReactDom from "react-dom";
import * as AppConstants from "../../constants/AppConstants";

export default class Letters extends React.Component {

  getData() {
    return {
      letters: this.props.letters,
      // author: this.props.author,
      // admin: this.props.admin,
    }
  }

  genLetters() {
    var data = this.getData();
    console.log(data.letters);
    console.log("sb",data);
    return data.letters.map(function(letter,index) {
      data.author = letter.from;
      var username;
      if(letter.fromType == 1){
        username = (!data.author.nickName || data.author.nickName === "null") ? "匿名用户" : data.author.nickName;
      }else{
        username = (!data.author.nickName || data.author.nickName === "null") ? "老爷爷" : data.author.nickName;
      }
      // var title = letter.fromId == data.author._id? ("写信: "+username):("回信: "+data.admin.name);
      var title = "From:" + username;
      return (
        <div className="letterWrap" key={index}>
          <Letters.Letter
            letter={letter}
            title={title}
          />
        </div>
      );
    });
  }

  render() {
    var style = {
      root: {

      }
    };

    var letters = this.genLetters();

    return (
      <div style={style.root}>
        {letters}
      </div>
    )
  }
}

Letters.Letter = class Letter extends React.Component {
  setContent() {
    return {
      __html: this.props.letter.content
    };
  }

  render() {
    var content = this.props.letter.type == AppConstants.LETTER_TYPE_AUDIO ? (
      <Letters.Letter.Audios
        letter = {this.props.letter}
        />
    )
    : (
      <div dangerouslySetInnerHTML={this.setContent()} className="content"></div>
    );

    var time = new Date(this.props.letter.lastModified);
    var timeStr = time.getFullYear()
                + "-" + (time.getMonth()+1)
                + "-" + time.getDate()
                + " " + time.getHours()
                + ":" + (time.getMinutes()>9?time.getMinutes():"0" + time.getMinutes())
                + ":" + (time.getSeconds()>9?time.getSeconds():"0"+time.getSeconds());

    return (
      <div>
        <div className="titleWrap textWrap">
          <span className="admin">
            {this.props.title}
          </span>
          <br/>
          <span className="time">
            {timeStr}
          </span>
        </div>
        <div className="letterContent textWrap">
          {content}
        </div>
      </div>
    )
  }
}

Letters.Letter.Audios = class Audios extends React.Component {

  constructor() {
    super();
    this.state = {
      audios: {}
    };
    this.playingAudio = null;
  }

  audioEnded(audioId) {
    var lastState = this.state;

    lastState.audios[audioId] = {
      playing: false
    }

    this.setState(lastState);
  }

  /*
  * audio对象属性提示:
  * audio.play()触发audio.ended赋值为false，无论此audio之前是否播放过
  * audio.pause()触发audio.paused赋值为true，若此时尚未播放完毕则audio.ended保持false不变
  * audio有ended事件触发audio.ended赋值为true
  */
  audioClicked(audio, index) {
    var windowAudios = window.audios
        ,audioItem = windowAudios[audio._id]
        ,lastState = this.state
        ,audioTemp = null;

    for (var key in windowAudios) {
      audioTemp = windowAudios[key];
      if (!audioTemp.ended && !audioTemp.paused && key != audio._id) {
        audioTemp.pause();
      }

      lastState.audios[key] = {
        playing: false
      };
    }

    if (audioItem) {
      if (!audioItem.played.length) {
        audioItem.play();
      } else if (!audioItem.ended && !audioItem.paused){
        audioItem.pause();
      } else {
        audioItem.play();
      }
    }

    lastState.audios[audio._id] = {
      playing: !audioItem.paused
    };

    this.setState(lastState);
  }

  initAudio(audio) {
    var audioItem = null;
    window.audios = window.audios || {};
    if (!window.audios[audio._id]) {
      audioItem = document.createElement("audio");
      audioItem.src = AppConstants.AUDIO_URL + audio._id + "?type=mp3";
      audioItem.controls = "controls";
      audioItem.onended = this.audioEnded.bind(this,audio._id);

      window.audios[audio._id] = audioItem;

      this.state.audios[audio._id] = {
        playing: false
      }
    }
  }

  audiosFilter() {
    var result = this.props.letter.attachment || [];
    result = result.map(function(item){
      if (/([0-9a-f]{24}$)/.test(item._id)) {
        var id = item._id.match(/[0-9a-f]{24}/g)[0];
        item._id = id;
      }

      return item;
    }.bind(this));

    return result;
  }

  genAudiosRect() {
    var audios = this.audiosFilter();
    return audios.map(function(audio,index) {
      this.initAudio(audio);

      var width = Math.round(3*audio.duration/10000) + 60;
      width = width>240?240:width;

      var style = {
        bar: {
          width: width+"px"
        }
      };

      var barClassName = this.state.audios[audio._id] && this.state.audios[audio._id].playing ? "audioBar playing" : "audioBar";

      return (
        <div key={index} className="audioWrap">
          <div style={style.bar} className={barClassName} onClick={this.audioClicked.bind(this, audio, index)}></div>
          <span className="audioLength"></span>
        </div>
      );
    }.bind(this));
  }

  render() {
    var audiosReact = this.genAudiosRect();

    return (
      <div>
        {audiosReact}
      </div>
    );
  }
}
