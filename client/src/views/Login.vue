<template>
  <div class="view">
    <!-- Mask & flexbox options-->
    <div class="mask rgba-container d-flex justify-content-center align-items-center">
      <div class="container">
        <v-layout v-if="dialog">
          <v-card flat class="ma-auto" color="rgb(255, 0, 0, 0)">
            <v-img
              :src="providerLogo"
              height="120px"
              width="120px"
              style="position:absolute;border-radius:50%"
            ></v-img>
            <v-progress-circular
              class="mx-auto"
              :size="120"
              :width="7"
              color="blue lighten-2"
              indeterminate
            ></v-progress-circular>
          </v-card>
        </v-layout>
        <v-layout justify-space-around wrap style="z-index:20;background-color=black" v-else>
          <v-flex xs12>
            <v-card
              max-width="450px"
              elevation="15"
              class="ma-auto"
              height="500px"
              dark
              style="background:rgba(0, 0, 0, 0.7);"
            >
              <v-toolbar flat height="50px" style="background:rgba(0, 0, 0, 0.5);">
                <v-icon color="white" class="mx-1">lock_open</v-icon>
                <v-toolbar-title class="white--text">{{ $t('Login.login') }}</v-toolbar-title>
              </v-toolbar>
              <v-form v-model="valid" ref="form" lazy-validation class="mx-3 mt-4">
                <v-text-field
                  outlined
                  class="purple-input"
                  v-model="username"
                  :counter="20"
                  :rules="nameRules"
                  label="Username"
                  required
                  v-if="cardLang == 'en'"
                />
                <v-text-field
                  outlined
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :counter="20"
                  required
                  v-if="cardLang == 'en'"
                />
                <v-text-field
                  outlined
                  class="purple-input"
                  v-model="username"
                  :counter="20"
                  :rules="nameRules"
                  label="Nom d'utilisateur"
                  required
                  v-if="cardLang == 'fr'"
                />
                <v-text-field
                  outlined
                  v-model="password"
                  :rules="passwordRules"
                  label="Mot de passe"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :counter="20"
                  required
                  v-if="cardLang == 'fr'"
                />
                <v-btn
                  block
                  :disabled="!valid || !isEmpty"
                  @click="LoginUser"
                  class="ma-1 font-weight-light"
                  color="blue lighteb-2"
                >
                  <span class="white--text">{{ $t('Login.login') }}</span>
                </v-btn>
                <span>{{ $t('Login.with') }}</span>
                <v-btn @click="githubLogin" icon fab>
                  <v-avatar size="30">
                    <v-img src="/github_white.png"></v-img>
                  </v-avatar>
                </v-btn>
                <v-btn @click="schoolLogin" icon fab>
                  <v-avatar size="30">
                    <v-img src="/42_white.png"></v-img>
                  </v-avatar>
                </v-btn>
                <v-btn @click="googleLogin" icon fab>
                  <v-avatar size="30">
                    <v-img src="/google_white.png"></v-img>
                  </v-avatar>
                </v-btn>
                <v-btn class="ma-1 white--text" to="forgot" color="white" absolute bottom left text>
                  <span>{{ $t('Login.forgot') }}</span>
                </v-btn>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
        <v-snackbar v-model="snackbar" :timeout="5000" color="error" right top class="mt-4">
          <v-icon color="white">error</v-icon>
          <span>{{ $t(`LoginError.err_${text}`) }}</span>
          <v-btn color="white" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-snackbar v-model="snackbar2" :timeout="5000" color="success" right top class="mt-4">
          <v-icon color="white">done</v-icon>
          <span>{{ $t("Login.success") }}</span>
          <v-btn color="white" text @click="snackbar2 = false">Close</v-btn>
        </v-snackbar>
      </div>
    </div>
    <main>
      <div class="container">
        <!--Grid row-->
        <div class="row py-5">
          <!--Grid column-->
          <div class="col-md-12 text-center">
            <p>
              <strong>2019 &copy; Hypertube | 1337</strong>
            </p>
          </div>
          <!--Grid column-->
        </div>
        <!--Grid row-->
      </div>
    </main>
  </div>
</template>

<script>
import Axios from "axios";
import i18n from "../i18n";
import { setInterval } from "timers";

export default {
  mounted() {
    if (this.$route.params.status == "success") {
      this.snackbar2 = true;
    }
    if ((this.$route.params.provider == "github" || this.$route.params.provider == "google") && !window.localStorage.token)
    {
      this.provider = this.$route.params.provider;
      this.dialog = true;
      let path = this.$route.fullPath;
      Axios.get(`http://localhost:3001${path}`)
        .then(res => {
          if (res.data.status == "success") {
            window.localStorage.setItem("token", res.data.msg);
            this.$router.push({ name: "home" });
          } else {
            this.snackbar = true;
            this.text = res.data.msg;
            setTimeout(() => {
              this.$router.push({ path: `/${i18n.locale}/login` });
            }, 2500);
          }
        })
        .catch(error => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
    }
    if (this.$route.params.provider == "42") {
      this.provider = "42";
      this.dialog = true;
      let path = this.$route.query.code;
      var data = {
        grant_type: "authorization_code",
        client_id:
          "6a8ef9439cdba2ee20ac0de6b9cdbe3296f0f24fe0480d0b924ecb1dfb3d7745",
        client_secret:
          "d5b672599193d4e50eda1791609611c0d0e8f488348d8235fafc138537afb04d",
        code: path,
        redirect_uri: "http://localhost:8080/login/42"
      };
      Axios.post(`https://api.intra.42.fr/oauth/token`, data)
        .then(res => {
          this.GetSchoolData(res.data.access_token);
        })
        .catch(error => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
    }
  },
  data() {
    return {
      provider: "hyper",
      dialog: false,
      valid: true,
      show1: false,
      snackbar2: false,
      snackbar: false,
      timeout: 5000,
      text: "1",
      username: "",
      nameRules: [
        v => !!v || "Username is required",
        v => (v && v.length <= 20) || "Userame must be less than 10 characters"
      ],
      password: "",
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length <= 20) || "Name must be less than 12 characters"
      ]
    };
  },

  methods: {
    GetSchoolData(token) {
      Axios.post("http://localhost:3001/login/42", { token: token })
        .then(res => {
          if (res.data.status == "success") {
            window.localStorage.setItem("token", res.data.msg);
            this.$router.push({ name: "home" });
          } else {
            this.snackbar = true;
            this.text = res.data.msg;
            setTimeout(() => {
              this.$router.push({ path: `/${i18n.locale}/login` });
            }, 2500);
          }
        })
        .catch(error => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
    },
    githubLogin() {
      window.location =
        "https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin%2Fgithub&scope=user%3Aemail&client_id=27a9974ecf7cb9a53415";
    },
    googleLogin() {
      window.location =
        "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin%2Fgoogle&scope=profile%20email&client_id=720391957482-1jhj256krm792l7l8qb3at7jf5qv5ep4.apps.googleusercontent.com";
    },
    schoolLogin() {
      window.location =
        "https://api.intra.42.fr/oauth/authorize?client_id=6a8ef9439cdba2ee20ac0de6b9cdbe3296f0f24fe0480d0b924ecb1dfb3d7745&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin%2F42&response_type=code";
    },
    LoginUser() {
      Axios.post("http://localhost:3001/login", {
        username: this.username,
        password: this.password
      })
        .then(response => {
          if (response.data.status == "failure") {
            this.snackbar = true;
            this.text = response.data.msg;
          } else if (response.data.status == "success") {
            window.localStorage.setItem("token", response.data.Token);
            this.$router.push({ name: "home" });
          }
        })
        .catch(error => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
    },
    removeDiv() {
      this.status = 0;
    }
  },
  computed: {
    providerLogo() {
      return require("../../public/" + this.provider + "_white.png");
    },
    isEmpty() {
      return this.username && this.password;
    },
    title() {
      return this.$store.state.title;
    },
    cardLang() {
      return i18n.locale;
    }
  }
};
</script>

