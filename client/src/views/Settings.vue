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
      <v-card
        max-width="650px"
        class="mx-auto mb-auto"
        dark
        style="background:rgba(0, 0, 0, 0.7);margin-top: 150px"
        elevation="15"
      >
        <v-form class="ma-auto" ref="form" v-model="valid" lazy-validation>
          <v-layout justify-space-around wrap class="ma-1">
            <v-flex xs12>
              <v-avatar
                v-if="this.Imgswitch == false"
                @click="imageLoad"
                class="ma-auto d-block avatar"
                size="120px"
              >
                <v-img :src="ImgSource(this.userData.avatar)"></v-img>
              </v-avatar>

              <v-avatar v-else @click="imageLoad" class="ma-auto d-block avatar" size="120px">
                <v-img :src="this.image2"></v-img>
              </v-avatar>
              <input
                type="file"
                name="myImage"
                id="profile-upload"
                style="display:none"
                @change="onFileChange"
              />
            </v-flex>

            <v-flex class="z7am" xs12 md5>
              <v-text-field
                class="ma-0 pa-0"
                :rules="nameRules"
                v-model="userData.username"
                :counter="20"
                :label="username"
                required
              />
            </v-flex>
            <v-flex class="z7am" xs12 md5>
              <v-text-field
                class="ma-0 pa-0"
                v-model="userData.email"
                :rules="emailRules"
                :label="Email"
                required
              />
            </v-flex>

            <v-flex class="z7am" xs12 md5>
              <v-text-field
                class="ma-0 pa-0"
                v-model="userData.first_name"
                :counter="20"
                :rules="firstNameRules"
                :label="FirstName"
                required
              />
            </v-flex>
            <v-flex class="z7am" xs12 md5>
              <v-text-field
                class="ma-0 pa-0"
                v-model="userData.last_name"
                :counter="20"
                :rules="lastNameRules"
                :label="LastName"
                required
              />
            </v-flex>
            <v-flex class="z7am" xs12 md10 v-if="outsource === false">
              <v-text-field
                class="ma-0 pa-0"
                :label="password"
                v-model="userData.password"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
                :append-icon="show ? 'visibility' : 'visibility_off'"
                :counter="20"
                required
              />
            </v-flex>
            <v-flex class="z7am" xs12 text-xs-right>
              <v-btn
                block
                :disabled="!valid"
                @click="updateUser"
                class="ma-0 font-weight-light white--text"
                color="blue lighten-2"
              >{{ $t('Settings.update') }}</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-layout>
    <v-snackbar v-model="snackbar" :timeout="5000" color="error" right top class="mt-4">
      <v-icon color="white">error</v-icon>
      <span>{{ $t(`RegistreError.err_${text2}`) }}</span>
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbar2" :timeout="5000" color="success" right top class="mt-4">
      <v-icon color="white">done</v-icon>
      <span>{{ $t(`Settings.success_${this.text}`) }}</span>
      <v-btn color="white" text @click="snackbar2 = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Axios from "axios";
import i18n from "../i18n";

export default {
  mounted() {
    const token = window.localStorage.getItem("token");
    if (token) Axios.defaults.headers.common["x-auth-token"] = token;
    else delete Axios.defaults.headers.common["x-auth-token"];
  
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
      this.userData = this.$store.state.userData;
      if (this.userData.password === "1") this.outsource = true;
    }, 700);
  },
  data() {
    return {
      text2: "8",
      loader: false,
      dialog: false,
      show: false,
      snackbar: false,
      snackbar2: false,
      valid: true,
      text: "1",
      outsource: false,
      userData: {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        avatar: ""
      },
      Imgswitch: false,
      firstNameRules: [
        v => !!v || i18n.locale == "fr" || "First name is required",
        v => !!v || "Le prénom est requis",
        v =>
          /^[a-zA-Z]{3,20}$/.test(v) ||
          i18n.locale == "fr" ||
          "A-z and must be between 3 and 20 characters",
        v =>
          /^[a-zA-Z]{3,20}$/.test(v) ||
          "A-z et doit comporter entre 3 et 20 caractères"
      ],
      lastNameRules: [
        v => !!v || i18n.locale == "fr" || "Last name is required",
        v => !!v || "Le nom est requis",
        v =>
          /^[a-zA-Z]{3,20}$/.test(v) ||
          i18n.locale == "fr" ||
          "A-z and must be between 3 and 20 characters",
        v =>
          /^[a-zA-Z]{3,20}$/.test(v) ||
          "A-z et doit comporter entre 3 et 20 caractères"
      ],
      nameRules: [
        v => !!v || i18n.locale == "fr" || "Username is required",
        v => !!v || "Nom d'utilisateur est nécessaire",
        v =>
          /^[a-zA-Z0-9]{3,20}$/.test(v) ||
          i18n.locale == "fr" ||
          "A-9 and must be between 3 and 20 characters",
        v =>
          /^[a-zA-Z0-9]{3,20}$/.test(v) ||
          "A-9 et doit comporter entre 3 et 20 caractères"
      ],
      emailRules: [
        v => !!v || i18n.locale == "fr" || "E-mail is required",
        v => !!v || "E-mail est requis",
        v =>
          /^(?!.{50})(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) ||
          i18n.locale == "fr" ||
          "E-mail must be valid",
        v =>
          /^(?!.{50})(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "E-mail doit être valide"
      ]
    };
  },
  methods: {
    onFileChange(e) {
      const files = e.target.files[0];
      if (files != undefined) this.addImg(files);
    },
    addImg(file) {
      if (!file.type.match("image/jpeg|image/jpg|image/png")) {
        this.snackbar = true;
        this.isDragging = "error";
        this.text2 = `8`;
        return;
      } else {

        const formData = new FormData();
        formData.append("myImage", file);
        Axios.post("http://localhost:3001/settings/updateImg", formData)
        .then(res => {
          if (res.data.status == "success") {
            this.snackbar2 = true;
            this.text = "1";
          } else {
            this.snackbar = true;
            this.text2 = "8";
          }
        })
        .catch(err => {
          this.$router.push({ name: "home" });
        });
      }

    },
    imageLoad() {
      document.getElementById("profile-upload").click();
    },
    updateUser() {
      Axios.post("http://localhost:3001/settings/updateData", this.userData)
        .then(res => {
          if (res.data.status === "success") {
            this.snackbar2 = true;
            this.text = "2";
          } else {
            this.snackbar = true;
            this.text2 = res.data.msg;
          }
        })
        .catch(err => {
           this.$router.push({ name: "home" });
        });
    },
    ImgSource(image) {
      
      if (image.includes("images/") == true)
        return require("../../public/" + image);
      else return image;
    }
  },
  computed: {
    username() {
      if (i18n.locale == "fr") return "Nom d'utilisateur";
      else return "Username";
    },
    FirstName() {
      if (i18n.locale == "fr") return "Prénom";
      else return "First name";
    },
    LastName() {
      if (i18n.locale == "fr") return "Nom de famille";
      else return "Last name";
    },
    Email() {
      if (i18n.locale == "fr") return "Adresse Email";
      else return "Email Address";
    },
    password() {
      if (i18n.locale == "fr") return "Mot de passe";
      else return "Password";
    }
  }
};
</script>

<style>
 .z7am{
     margin-top: 35px;
 }

.avatar:hover {
  cursor: pointer;
  opacity: 0.9;
}
.containers {
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    url("../../public/886533.jpg");
}
</style>
