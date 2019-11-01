<template>
 <div class="view">
          <!-- Mask & flexbox options-->
   <div class="mask rgba-container d-flex justify-content-center align-items-center">
    <div class="container">
        <v-layout justify-space-around wrap>
        <v-flex xs12 md7>
            <v-card max-width="600" dark style="background:rgba(0, 0, 0, 0.7);">
                <v-toolbar height="50px" dark style="background:rgba(0, 0, 0, 0.5);">
                <v-icon color="white" class="mx-1">autorenew</v-icon>
                <v-toolbar-title>{{ $t('Login.resset') }}</v-toolbar-title>
                </v-toolbar>
                <v-form onSubmit="return false;" v-model="valid" ref="form" lazy-validation class="mx-3 mt-3">
                    <v-text-field  class="purple-input" v-model="email" :rules="emailRules" label="Email Address" required v-if="cardLang == 'en'"/>
                    <v-text-field  class="purple-input" v-model="email" :rules="frEmailRules" label="Adresse Email" required v-else/>

                    <v-btn :disabled="!valid || !isEmpty" @click="registerUser" class="ma-2 font-weight-light"  color="blue lighten-2">
                        <span> SUBMIT </span>
                    </v-btn>
            </v-form>
        </v-card>
        </v-flex>
        </v-layout>
        <v-snackbar v-model="snackbar" :timeout="5000" color="error" right top class="mt-4">
        <v-icon color="white">error</v-icon>
        <span>{{ $t(`Forgot.err_${this.error}`) }}</span>
        <v-btn color="white" text  @click="snackbar = false">
            Close
        </v-btn>
        </v-snackbar>
        <v-snackbar v-model="snackbar2" :timeout="5000" color="success" right top class="mt-4">
            <v-icon color="white">done</v-icon>
            <span>{{ $t('Forgot.success') }}</span>
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
    data() {
        return {
            error: "1",
            valid: true,
            snackbar: false,
            snackbar2: false,
            timeout: 5000,
            text: '',  
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid'
            ],
            frEmailRules: [
                v => !!v || 'E-mail est requis',
                v => /^(?!.{50})(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail doit être valide'
            ],
        }
    },
    
    methods: {
        registerUser() {
            Axios.post("http://localhost:3001/forgot", {email: this.email, lang: i18n.locale})
            .then(response => {
                if (response.data.status === "failure"){
                    this.error = response.data.msg
                    this.snackbar = true
                } else {
                    this.snackbar2 = true
                }
            })
            .catch(error => {
                this.error = "3"
                this.snackbar = true
            })
        },
        removeDiv() {
            this.status = 0
        }
    },
    computed: {
        isEmpty() {
            return  this.email
        },
        cardLang()
        {
            return (i18n.locale)
        }
    }
}
</script>
