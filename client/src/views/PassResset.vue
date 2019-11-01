<template>
 <div class="view">
          <!-- Mask & flexbox options-->
   <div class="mask rgba-container d-flex justify-content-center align-items-center">
    <div class="container">
        <v-layout justify-space-around wrap>
        <v-flex xs12 md7>
            <v-card max-width="600" dark style="background:rgba(0, 0, 0, 0.7);">
                <v-toolbar height="50px" dark style="background:rgba(0, 0, 0, 0.5);">
                <v-toolbar-title>{{ $t('Login.resset') }}</v-toolbar-title>
                </v-toolbar>
                <v-form v-model="valid" ref="form" lazy-validation class="mx-3 mt-3">
                    <v-text-field  class="purple-input" v-model="password" :rules="passwordRules" label="New password" :type="show ? 'text' : 'password'"
                                @click:append="show = !show" :append-icon="show ? 'visibility' : 'visibility_off'" :counter="20" required v-if="cardLang == 'en'"/>
                    <v-text-field  class="purple-input" v-model="password" :rules="frPasswordRules" label="Nouveau mot de passe" :type="show ? 'text' : 'password'"
                                @click:append="show = !show" :append-icon="show ? 'visibility' : 'visibility_off'" :counter="20" required v-else/>
                    <v-text-field  class="purple-input" v-model="passwordConf" :rules="passwordRules" label="Password Confirmation" :type="show ? 'text' : 'password'"
                                @click:append="show = !show" :append-icon="show ? 'visibility' : 'visibility_off'" :counter="20" required v-if="cardLang == 'en'"/>
                    <v-text-field  class="purple-input" v-model="passwordConf" :rules="frPasswordRules" label="Mot de passe confirmation" :type="show ? 'text' : 'password'"
                                @click:append="show = !show" :append-icon="show ? 'visibility' : 'visibility_off'" :counter="20" required v-else/>

                    <v-btn :disabled="!valid || !isEmpty" @click="ressetPass" class="ma-2 font-weight-light"  color="blue lighten-2">
                        <span> SUBMIT </span>
                    </v-btn>
            </v-form>
        </v-card>
        </v-flex>
        </v-layout>
        <v-snackbar v-model="snackbar" :timeout="5000" color="error" right top class="mt-4">
        <v-icon color="white">error</v-icon>
        <span>{{ $t(`Forgot.err_${this.text}`) }}</span>
        <v-btn color="white" text  @click="snackbar = false">
            Close
        </v-btn>
        </v-snackbar>
        <v-snackbar v-model="snackbar2" :timeout="5000" color="success" right top class="mt-4">
            <v-icon color="white">done</v-icon>
            <span>{{ $t('Forgot.success_2') }}</span>
        <v-btn color="white" text  @click="snackbar2 = false">
            Close
        </v-btn>
        </v-snackbar>
    </div>
   </div>
        <main>
        <div class="container">
          <!--Grid row-->
          <div class="row py-5">
            <!--Grid column-->
            <div class="col-md-12 text-center">
              <p><strong>2019 &copy; Hypertube | 1337 </strong> </p>
            </div>
            <!--Grid column-->
          </div>
          <!--Grid row-->
        </div>
      </main>
 </div>
</template>

<script>
import Axios from 'axios'
import i18n from '../i18n'

export default {
    mounted() {
        if (this.$route.query.key == undefined)
            this.$router.push({path: `/${i18n.locale}/login`})
    },
    data() {
        return {
            valid: true,
            snackbar: false,
            snackbar2: false,
            timeout: 5000,
            text: '1',
            show: false,
            password: '',
            passwordConf: '',
            frPasswordRules: [
                v => !!v || 'Mot de passe est requis',
                v => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,20}$/.test(v) || 'Le mot de passe nécessite 1 lettre minuscule minuscule et 1 chiffre et entre 5 et 20'
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,20}$/.test(v) || 'Password requires 1 lower 1 upper case letter and 1 digit and between 5 and 20'
            ],
        }
    },
    
    methods: {
        ressetPass() {
            if (this.password != this.passwordConf)
            {
                this.text = "4"
                this.snackbar = true
            }
            else
            {
                Axios.post("http://localhost:3001/forgot/resset", {key: this.$route.query.key, password: this.password, passwordConf: this.passwordConf})
                .then(response => {
                    if (response.data.status === "failure"){
                        this.text = response.data.msg
                        this.snackbar = true
                    } else {
                        snackbar2 = true
                    }
                })
                .catch(error => {
                    this.$router.push({ name: "home" });
                })
            }
        },
        removeDiv() {
            this.status = 0
        }
    },
    computed: {
        isEmpty() {
            return  this.password && this.passwordConf
        },
        cardLang()
        {
            return (i18n.locale)
        }
    }
}
</script>
