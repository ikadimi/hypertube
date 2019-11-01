<template>
  <div class="containers fill-height fluid grid-list-xl">
    <v-layout v-if="loader == true">
      <v-progress-circular
        class="mx-auto my-3"
        :size="60"
        :width="7"
        color="blue lighten-2"
        v-show="loader"
        indeterminate
      ></v-progress-circular>
    </v-layout>
    <v-layout justify-space-around v-else wrap>
      <div class="embed-responsive embed-responsive-21by9">
        <video width="320" height="240" autoplay controls intrinsicsize controlslist="nodownload">
          <source :src="'http://localhost:3001/video/'+this.hash" type="video/mp4" />
          <track
            v-for="(subtitle,index) in SubTitles"
            :key="index"
            :src="'/subtitles/' + id + '/' + subtitle.lang + '.vtt'"
            kind="subtitles"
            :srclang="subtitle.langcode"
            :label="subtitle.lang"
            :default="prefLang(subtitle.langcode)"
          />
        </video>
      </div>
      <div class="comments-container">
        <h1>{{ $t('Video.comment') }}</h1>
        <v-text-field
          label="Add Comment"
          v-model="comment"
          class="mt-5"
          dark
          v-on:keyup.enter="AddComment"
        ></v-text-field>
        <ul id="comments-list" class="comments-list">
          <li v-for="(comment,index) in Comments" :key="index">
            <div class="comment-main-level">
              <div class="comment-avatar">
                <img :src="comment.avatar" alt v-if="comment.avatar.match(/https?:\/\/[^\s]+/g)" />
                <img :src="'/' + comment.avatar" alt v-else />
              </div>
              <div class="comment-box mr-2">
                <div class="comment-head">
                  <h6 class="comment-name">
                    <a :href="'/profile/' + comment.user_id">{{comment.username}}</a>
                  </h6>
                  <span>{{comment.created_at | moment("dddd, MMMM Do YYYY")}}</span>
                  <v-btn
                    text
                    icon
                    style="
    float: right;"
                    v-on:click="AddReply(index,comment.id)"
                  >
                    <v-icon>{{ svgPath }}</v-icon>
                  </v-btn>
                </div>
                <div class="comment-content">{{comment.comment}}</div>
              </div>
            </div>
            <ul class="comments-list reply-list" style="height: auto;">
              <v-text-field
                v-if="seen"
                v-model="reply"
                label="Add Reply"
                dark
                v-on:keyup.enter="AddReply(index,comment.id)"
              ></v-text-field>
              <li v-for="(reply,index) in comment.replys" :key="index">
                <div class="comment-avatar">
                  <img :src="reply.avatar" alt v-if="reply.avatar.match(/https?:\/\/[^\s]+/g)" />
                  <img :src="'/' + reply.avatar" alt v-else />
                </div>
                <div class="comment-box">
                  <div class="comment-head">
                    <h6 class="comment-name">
                      <a href="http://creaticode.com/blog">{{reply.username}}</a>
                    </h6>
                    <span>{{reply.created_at | moment("dddd, MMMM Do YYYY")}}</span>
                  </div>
                  <div class="comment-content">{{reply.reply}}</div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
import i18n from "../i18n";
import { truncate } from "fs";
import { mdiReply } from "@mdi/js";
export default {
  name: "Streaming",
  mounted() {
    this.id = this.$route.params.id;
    this.hash = this.$route.params.hash;
    if (this.$store.getters.status == "auth") this.init();
    else {
      this.$store.watch(
        (state, getters) => getters.status,
        (newValue, oldValue) => {
          if (newValue == "auth") this.init();
        }
      );
    }
  },
  data: () => ({
    id: "",
    hash: "",
    seen: false,
    SubTitles: null,
    Comments: [],
    Replys: [],
    comment: "",
    reply: "",
    listHashes: [],
    loader: true,
    svgPath: mdiReply
  }),
  methods: {
    init() {
      const token = window.localStorage.getItem("token");
      if (token) axios.defaults.headers.common["x-auth-token"] = token;
      else delete axios.defaults.headers.common["x-auth-token"];

      ///////////////

      delete axios.defaults.headers.common["x-auth-token"];
      axios
        .get(
          "https://yts.unblocked4u.net/api/v2/list_movies.json?query_term=" +
            this.id
        )
        .then(resp => {
          this.listHashes = JSON.stringify(resp.data.data.movies[0].torrents);
          axios.defaults.headers.common["x-auth-token"] = token;
          axios
            .post("http://localhost:3001/video/extraApi", { imdb_id: this.id })
            .then(res => {
              this.listHashes += JSON.stringify(res.data.slice(0, 5));
              if (
                this.hash.length == 40 &&
                (this.listHashes.includes(this.hash + '",') ||
                  this.listHashes.includes(this.hash + "&dn"))
              )
                this.loader = false;
              else this.$router.push({ name: "home" });
            })
            .catch(err => {
              this.$router.push({ path: `/${i18n.locale}/login` });
            });
        })
        .catch(err => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });

      //////////////

      axios.defaults.headers.common["x-auth-token"] = token;
      axios
        .get("http://localhost:3001/video/checkHash/" + this.hash)
        .then(res => {
          if (res.data == "ERROR")
            this.$router.push({ path: `/${i18n.locale}/login` });
        })
        .catch(err => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
      delete axios.defaults.headers.common["x-auth-token"];
      axios
        .get(
          "https://yts.unblocked4u.net/api/v2/list_movies.json?query_term=" +
            this.id
        )
        .then(res => {
          const token = window.localStorage.getItem("token");
          if (token) axios.defaults.headers.common["x-auth-token"] = token;
          else delete axios.defaults.headers.common["x-auth-token"];

          axios
            .post("http://localhost:3001/video/getComments", {
              imdb_id: this.id
            })
            .then(resp => {
              resp.data.forEach(element => {
                var obj = {
                  id: element.id,
                  comment: element.comment,
                  username: element.username,
                  avatar: element.avatar,
                  user_id: element.user_id,
                  created_at: element.created_at,
                  replys: []
                };
                axios
                  .post("http://localhost:3001/video/getReplys", {
                    comment_id: element.id
                  })
                  .then(resp => {
                    obj.replys = resp.data;
                  });
                this.Comments.push(obj);
              });
            });
          axios.post("http://localhost:3001/video/saveHistory", {
            imdb_id: this.id
          });

          axios
            .post("http://localhost:3001/video/getSubt", { imdb_id: this.id })
            .then(resp => {
              if (resp) this.SubTitles = resp.data;
            })
            .catch(err => {
              this.$router.push({ path: `/${i18n.locale}/login` });
            });
        })
        .catch(err => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
    },
    AddComment: function() {
      if (this.comment.trim() !== "") {
        axios
          .post("http://localhost:3001/video/saveComment", {
            imdb_id: this.id,
            comment: this.comment
          })
          .then(res => {
            var obj = {
              id: res.data.insertId,
              comment: this.comment,
              username: this.$store.state.userData.username,
              avatar: this.$store.state.userData.avatar,
              user_id: this.$store.state.userData.id,
              created_at: new Date(),
              replys: []
            };
            this.Comments.unshift(obj);
            this.comment = "";
          });
      } else this.comment = "";
    },
    AddReply: function(index, commentId) {
      if (this.reply.trim() !== "") {
        axios.post("http://localhost:3001/video/saveReply", {
          comment_id: commentId,
          imdb_id: this.id,
          reply: this.reply
        });
        var obj = {
          reply: this.reply,
          username: this.$store.state.userData.username,
          avatar: this.$store.state.userData.avatar,
          user_id: this.$store.state.userData.id,
          created_at: new Date()
        };
        this.Comments[index].replys.unshift(obj);
        this.Replys.unshift(obj);
        this.reply = "";
      } else this.reply = "";
      this.seen = !this.seen;
    },
    prefLang(lang)
    {
      if (lang == this.$store.state.userData.lang)
        return true;
      else
        return false;
    }
  }
};
</script>
<style scoped>
a {
  color: #03658c;
  text-decoration: none;
}

.comments-list {
  list-style-type: none;
  height: 400px;
  overflow: auto;
}

/** ====================
 * Lista de Comentarios
 =======================*/
.comments-container {
  margin: 10px auto 14px;
  width: 768px;
  height: 600px;
}

.comments-container h1 {
  font-size: 31px;
  font-weight: 400;
}

.comments-container h1 a {
  font-size: 18px;
  font-weight: 700;
}
/* .bg {
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    url(https://i.pinimg.com/originals/fe/9a/fb/fe9afbe8b357c2f0068b50626fb1e840.jpg);
} */
.comments-list {
  /* margin-top: 30px; */
  position: relative;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
/**
 * Lineas / Detalles
 -----------------------*/
.comments-list:before {
  content: "";
  width: 2px;
  height: 100%;
  position: absolute;
  left: 32px;
  top: 0;
}

.comments-list:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 27px;
  width: 7px;
  height: 7px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

.reply-list:before,
.reply-list:after {
  display: none;
}
.reply-list li:before {
  content: "";
  width: 60px;
  height: 2px;
  position: absolute;
  top: 25px;
  left: -55px;
}

.comments-list li {
  margin-bottom: 15px;
  display: block;
  position: relative;
}

.comments-list li:after {
  content: "";
  display: block;
  clear: both;
  height: 0;
  width: 0;
}

.reply-list {
  padding-left: 88px;
  padding-right: 10px;
  clear: both;
  margin-top: 15px;
}
/**
 * Avatar
 ---------------------------*/
.comments-list .comment-avatar {
  width: 65px;
  height: 65px;
  position: relative;
  z-index: 99;
  float: left;
  border: 3px solid #fff;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.comments-list .comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reply-list .comment-avatar {
  width: 50px;
  height: 50px;
}

.comment-main-level:after {
  content: "";
  width: 0;
  height: 0;
  display: block;
  clear: both;
}
/**
 * Caja del Comentario
 ---------------------------*/
.comments-list .comment-box {
  width: 640px;
  float: right;
  position: relative;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}

.comments-list .comment-box:before,
.comments-list .comment-box:after {
  content: "";
  height: 0;
  width: 0;
  position: absolute;
  display: block;
  border-width: 10px 12px 10px 0;
  border-style: solid;
  border-color: transparent #fcfcfc;
  top: 8px;
  left: -11px;
}

.comments-list .comment-box:before {
  border-width: 11px 13px 11px 0;
  border-color: transparent rgba(0, 0, 0, 0.05);
  left: -12px;
}

.reply-list .comment-box {
  width: 550px;
}
.comment-box .comment-head {
  background: #fcfcfc;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e5e5;
  overflow: hidden;
  -webkit-border-radius: 4px 4px 0 0;
  -moz-border-radius: 4px 4px 0 0;
  border-radius: 4px 4px 0 0;
}

.comment-box .comment-head i {
  float: right;
  margin-left: 14px;
  position: relative;
  top: 2px;
  color: #a6a6a6;
  cursor: pointer;
  -webkit-transition: color 0.3s ease;
  -o-transition: color 0.3s ease;
  transition: color 0.3s ease;
}

.comment-box .comment-head i:hover {
  color: #03658c;
}

.comment-box .comment-name {
  color: #283035;
  font-size: 14px;
  font-weight: 700;
  float: left;
  margin-right: 10px;
}

.comment-box .comment-name a {
  color: #283035;
}

.comment-box .comment-head span {
  float: left;
  color: #999;
  font-size: 13px;
  position: relative;
  top: 1px;
}

.comment-box .comment-content {
  background: #fff;
  padding: 12px;
  font-size: 15px;
  color: #595959;
  -webkit-border-radius: 0 0 4px 4px;
  -moz-border-radius: 0 0 4px 4px;
  border-radius: 0 0 4px 4px;
}

.comment-box .comment-name.by-author,
.comment-box .comment-name.by-author a {
  color: #03658c;
}
.comment-box .comment-name.by-author:after {
  content: "autor";
  background: #03658c;
  color: #fff;
  font-size: 12px;
  padding: 3px 5px;
  font-weight: 700;
  margin-left: 10px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}

/** =====================
 * Responsive
 ========================*/
@media only screen and (max-width: 766px) {
  .comments-container {
    width: 480px;
  }
  .comments-list .comment-box {
    width: 240px;
    float: left;
    left: 20px;
  }
  .reply-list .comment-box {
    width: 150px;
  }
  .comments-list .comment-avatar {
    width: 40px;
    height: 40px;
    position: relative;
    z-index: 99;
    float: left;
    border: 2px solid #fff;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
}
.containers {
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    url("../../public/886533.jpg");
  background-position: top !important;
}
</style>