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
    <v-layout justify-space-around wrap v-else>
      <div class="wrapper_card">
        <div class="profile-card js-profile-card">
          <div class="profile-card__img">
            <img :src="ImgSource(userData.avatar)" alt="profile card" />
          </div>

          <div class="profile-card__cnt js-profile-cnt">
            <div class="profile-card__name">{{userData.username}}</div>
            <div class="profile-card__txt">{{userData.first_name}} {{userData.last_name}}</div>

            <div class="profile-card-ctr">
              <!-- <v-btn x-large class="white--text font-weight-medium subtitle-1" style="padding-left:30px;padding-right:20px;border-radius:20px;background: linear-gradient(45deg, #1da1f2, #0e71c8);" v-if="this.$route.params.id == undefined">
                Settings
              </v-btn> -->
              <div
                v-on:click="seen = !seen"
                class="profile-card__button button--blue js-message-btn"
              >Watched movies</div>
            </div>
          </div>
          <div v-if="seen" class="movies">
            <md-card>
              <md-card-media>
                <!-- swiper -->
                <swiper v-if="onResize" :options="swiperOption">
                  <swiper-slide v-for="(poster,index) in posterList" :key="index">
                    <img :src="poster" alt />
                  </swiper-slide>
                  <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
                <swiper v-else :options="swiperOption1">
                  <swiper-slide v-for="(poster,index) in posterList" :key="index">
                    <img :src="poster" alt />
                  </swiper-slide>
                  <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
              </md-card-media>
            </md-card>
          </div>
        </div>
      </div>

      <svg hidden="hidden">
        <defs />
      </svg>
    </v-layout>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  mounted() {
    this.loader = true;
    if (this.$store.getters.status == 'auth')
      this.init();
    else
    {
      this.$store.watch(
        (state, getters) => getters.status,
        (newValue, oldValue) => {
          if (newValue == 'auth')
            this.init();
        }
      )
    }
  },
  data() {
    return {
      loader: false,
      seen: false,
      snackbar: "",
      text: "",
      watchedList: null,
      posterList: [],
      userData: {
        username: "",
        first_name: "",
        last_name: "",
        avatar: ""
      },
      window: {
        width: 0,
        height: 0
      },
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      },
      swiperOption1: {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      }
    };
  },
  methods: {
    init()
    {
      const token = window.localStorage.getItem("token");
      if (token) Axios.defaults.headers.common["x-auth-token"] = token;
      else delete Axios.defaults.headers.common["x-auth-token"];
      function isNumeric(value) {
        return /^\d+$/.test(value);
      }

      if (this.$route.params.id == undefined || !isNumeric(this.$route.params.id)) 
      {
        this.getPosters(this.$store.state.userData.id);
        this.userData.username = this.$store.state.userData.username;
        this.userData.first_name = this.$store.state.userData.first_name;
        this.userData.last_name = this.$store.state.userData.last_name;
        this.userData.avatar = this.$store.state.userData.avatar;
      } 
      else if (this.$route.params.id != undefined && isNumeric(this.$route.params.id)) 
      {
        Axios.post("http://localhost:3001/profile/visit", {id: this.$route.params.id})
        .then(res => {
          if (res.data.status === "failure") {
            this.getPosters(this.$store.state.userData.id);
            this.userData.username = this.$store.state.userData.username;
            this.userData.first_name = this.$store.state.userData.first_name;
            this.userData.last_name = this.$store.state.userData.last_name;
            this.userData.avatar = this.$store.state.userData.avatar;
          } else {
            this.getPosters(this.$route.params.id);
            this.userData = res.data.msg;
          }
        })
        .catch(err => {
        });
      }
      this.loader = false;
    },
    getPosters(id) {
      Axios.post("http://localhost:3001/video/getHistory", {
        id: id
      })
        .then(res => {
          this.watchedList = res.data;
          this.watchedList.forEach(element => {
            Axios.post("http://localhost:3001/video/search/getimg", {
              imdb_id: element.movie_id
            })
              .then(resp => {
                this.posterList.push(resp.data.poster);
              })
              .catch(err => {
                this.$router.push({ name: "home" });
              });
          });
        })
        .catch(err => {
          if (err.response.status == 401) this.$router.push({ name: "login" });
          this.$router.push({ name: "home" });
        });
    },
    ImgSource(image) {
      if (image.includes("images/") == true)
        return require("../../public/" + image);
      else return image;
    },
    onResize() {
      if (window.innerWidth > 700) {
        if (this.swiperOption.slidesPerView == 1)
          this.seen = false;
        this.swiperOption.slidesPerView = 3;
      } else {
        if (this.swiperOption.slidesPerView == 3)
          this.seen = false;
        this.swiperOption.slidesPerView = 1;
      }
    },
  },
  computed: {
    swiperChange() {
      return this.swiperOption.slidesPerView;
    }
  },
  created() {
    window.addEventListener("resize", this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>
  <style>
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500,700&subset=latin-ext");

.profile-card__button a {
  text-decoration: none !important;
  color: white !important;
}
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
}
.wrapper_card {
  margin-top: 140px;
  width: 100%;
  height: auto;
  /* min-height: 100vh; */
  padding: 50px 20px;
  padding-top: 100px;
  display: flex;
}
@media screen and (max-width: 768px) {
  .wrapper_card {
    height: auto;
    padding-top: 100px;
  }
}
.profile-card {
  margin-top: 140px;
  width: 100%;
  /* min-height: 800px; */
  padding-left: 10px;
  padding-right: 16px;
  margin: auto;
  box-shadow: 0px 8px 60px -10px rgba(13, 28, 39, 0.6);
  /* background: #fff; */
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  max-width: 940px;
  position: relative;
}
.profile-card.active .profile-card__cnt {
  filter: blur(6px);
}
.profile-card.active .profile-card-message,
.profile-card.active .profile-card__overlay {
  opacity: 1;
  pointer-events: auto;
  transition-delay: 0.1s;
}
.profile-card.active .profile-card-form {
  transform: none;
  transition-delay: 0.1s;
}
.profile-card__img {
  object-fit: cover;
  width: 150px;
  height: 150px;
  margin-left: auto;
  margin-right: auto;
  transform: translateY(-50%);
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  z-index: 4;
}
@media screen and (max-width: 576px) {
  .profile-card__img {
    width: 120px;
    height: 120px;
  }
}
.profile-card__img img {
  display: block;
  width: 100%;
  height: 100% !important;
  object-fit: cover;
  border-radius: 50%;
}
.profile-card__cnt {
  margin-top: -50px;
  text-align: center;
  padding: 0 20px;
  padding-bottom: 40px;
  transition: all 0.3s;
}
.profile-card__name {
  color: white !important;
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 15px;
}
.profile-card__txt {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 15px;
}
.profile-card__txt strong {
  font-weight: 700;
}
.profile-card-loc {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}
.profile-card-loc__icon {
  display: inline-flex;
  font-size: 27px;
  margin-right: 10px;
}
.profile-card-inf {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-top: 35px;
}
.profile-card-inf__item {
  padding: 10px 35px;
  min-width: 150px;
}
@media screen and (max-width: 768px) {
  .profile-card-inf__item {
    padding: 10px 20px;
    min-width: 120px;
  }
}
.profile-card-inf__title {
  font-weight: 700;
  font-size: 27px;
  color: #324e63;
}
.profile-card-inf__txt {
  font-weight: 500;
  margin-top: 7px;
}
.profile-card-social {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.profile-card-social__item {
  display: inline-flex;
  width: 55px;
  height: 55px;
  margin: 15px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #405de6;
  box-shadow: 0px 7px 30px rgba(43, 98, 169, 0.5);
  position: relative;
  font-size: 21px;
  flex-shrink: 0;
  transition: all 0.3s;
}
@media screen and (max-width: 768px) {
  .profile-card-social__item {
    width: 50px;
    height: 50px;
    margin: 10px;
  }
}
@media screen and (min-width: 768px) {
  .profile-card-social__item:hover {
    transform: scale(1.2);
  }
}
.profile-card-social__item.facebook {
  background: linear-gradient(45deg, #3b5998, #0078d7);
  box-shadow: 0px 4px 30px rgba(43, 98, 169, 0.5);
}
.profile-card-social__item.twitter {
  background: linear-gradient(45deg, #1da1f2, #0e71c8);
  box-shadow: 0px 4px 30px rgba(19, 127, 212, 0.7);
}
.profile-card-social__item.instagram {
  background: linear-gradient(
    45deg,
    #405de6,
    #5851db,
    #833ab4,
    #c13584,
    #e1306c,
    #fd1d1d
  );
  box-shadow: 0px 4px 30px rgba(120, 64, 190, 0.6);
}
.profile-card-social__item.behance {
  background: linear-gradient(45deg, #1769ff, #213fca);
  box-shadow: 0px 4px 30px rgba(27, 86, 231, 0.7);
}
.profile-card-social__item.github {
  background: linear-gradient(45deg, #333333, #626b73);
  box-shadow: 0px 4px 30px rgba(63, 65, 67, 0.6);
}
.profile-card-social__item.codepen {
  background: linear-gradient(45deg, #324e63, #414447);
  box-shadow: 0px 4px 30px rgba(55, 75, 90, 0.6);
}
.profile-card-social__item.link {
  background: linear-gradient(45deg, #d5135a, #f05924);
  box-shadow: 0px 4px 30px rgba(223, 45, 70, 0.6);
}
.profile-card-social .icon-font {
  display: inline-flex;
}
.profile-card-ctr {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}
@media screen and (max-width: 576px) {
  .profile-card-ctr {
    flex-wrap: wrap;
  }
}
.profile-card__button {
  background: none;
  border: none;
  font-family: "Quicksand", sans-serif;
  font-weight: 700;
  font-size: 19px;
  margin: 15px 35px;
  padding: 15px 40px;
  min-width: 201px;
  border-radius: 50px;
  min-height: 55px;
  color: #fff;
  cursor: pointer;
  backface-visibility: hidden;
  transition: all 0.3s;
}
@media screen and (max-width: 768px) {
  .profile-card__button {
    min-width: 170px;
    margin: 15px 25px;
  }
}
@media screen and (max-width: 576px) {
  .profile-card__button {
    min-width: inherit;
    margin: 0;
    margin-bottom: 16px;
    width: 100%;
    max-width: 300px;
  }
  .profile-card__button:last-child {
    margin-bottom: 0;
  }
}
.profile-card__button:focus {
  outline: none !important;
}
@media screen and (min-width: 768px) {
  .profile-card__button:hover {
    transform: translateY(-5px);
  }
}
.profile-card__button:first-child {
  margin-left: 0;
}
.profile-card__button:last-child {
  margin-right: 0;
}
.profile-card__button.button--blue {
  background: linear-gradient(45deg, #1da1f2, #0e71c8);
  box-shadow: 0px 4px 30px rgba(19, 127, 212, 0.4);
}
.profile-card__button.button--blue:hover {
  box-shadow: 0px 7px 30px rgba(19, 127, 212, 0.75);
}
.profile-card__button.button--orange {
  background: linear-gradient(45deg, #d5135a, #f05924);
  box-shadow: 0px 4px 30px rgba(223, 45, 70, 0.35);
}
.profile-card__button.button--orange:hover {
  box-shadow: 0px 7px 30px rgba(223, 45, 70, 0.75);
}
.profile-card__button.button--gray {
  box-shadow: none;
  background: #dcdcdc;
  color: #142029;
}
.profile-card-message {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 130px;
  padding-bottom: 100px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
}
.profile-card-form {
  box-shadow: 0 4px 30px rgba(15, 22, 56, 0.35);
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 35px;
  transform: scale(0.8);
  position: relative;
  z-index: 3;
  transition: all 0.3s;
}
@media screen and (max-width: 768px) {
  .profile-card-form {
    max-width: 90%;
    height: auto;
  }
}
@media screen and (max-width: 576px) {
  .profile-card-form {
    padding: 20px;
  }
}
.profile-card-form__bottom {
  justify-content: space-between;
  display: flex;
}
@media screen and (max-width: 576px) {
  .profile-card-form__bottom {
    flex-wrap: wrap;
  }
}
.profile-card textarea {
  width: 100%;
  resize: none;
  height: 210px;
  margin-bottom: 20px;
  border: 2px solid #dcdcdc;
  border-radius: 10px;
  padding: 15px 20px;
  color: #324e63;
  font-weight: 500;
  font-family: "Quicksand", sans-serif;
  outline: none;
  transition: all 0.3s;
}
.profile-card textarea:focus {
  outline: none;
  border-color: #8a979e;
}
.profile-card__overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
  background: rgba(22, 33, 72, 0.35);
  border-radius: 12px;
  transition: all 0.3s;
}
.swiper-container {
  width: 100%;
  height: 400px;
}
.swiper-wrapper {
  transition-duration: 0ms;
  transform: translate3d(0px, 0px, 0px);
}
.swiper-slide {
  width: 213.333px;
  margin-right: 30px;
  text-align: center;
  font-size: 38px;
  font-weight: 700;
  /* background-color: #eee; */
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  text-align: center;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  height: 100%;
  position: relative;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  -o-transition-property: transform;
  transition-property: transform;
  transition-property: transform, -webkit-transform;
  cursor: pointer;
}
/* @media screen and (max-width: 698px) {
  .swiper-slide {
    width: 100% !important;
  }
} */
.swiper-pagination-bullet {
  background: #fff !important;
}
.swiper-pagination-bullet-active {
  background: #007aff !important;
}

.containers {
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    url("../../public/886533.jpg");
  background-size: cover;
}
</style>
