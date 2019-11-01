<template>
 <div class="view">
          <!-- Mask & flexbox options-->
   <div class="mask rgba-container d-flex justify-content-center align-items-center">
  <div class="container">
            <v-layout justify-space-around wrap>
            <v-flex xs12>
                <v-card max-width="600px" class="ma-auto" dark style="background:rgba(0, 0, 0, 0.7);">
                    <v-toolbar height="50px"  dark style="background:rgba(0, 0, 0, 0.5);">
                    <v-toolbar-title class="ml-2 white--text">{{ $t('Signup.signup') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-form v-model="valid" ref="form" lazy-validation class="mx-3 mt-3">
                        <v-card class="pa-2" id="uploads" v-if="isDragging != 'success'"
                        @dragenter="onDragEnter" @dragleave="onDragLeave" @drop="onDrop"
                        @dragover.prevent :color="uploadColor">
                            <v-layout row wrap  justify-space-around>
                                <v-flex class="mt-1 ml-1" hidden-xs-only md-4>
                                    <v-icon  color="white" class="mx-2 mb-1">cloud_upload</v-icon>
                                    <span class="white--text subtitle-1"> {{ $t('Signup.drag') }}</span>
                                </v-flex>
                                <v-flex class="mt-1 ml-1" hidden-sm-and-up>
                                    <v-icon  color="white" class="mx-2 mb-1">cloud_upload</v-icon>
                                </v-flex>
                                <v-flex class="mt-1" hidden-xs-only md-4>
                                    
                                    <span class="white--text title ml-3">{{ $t('Signup.or') }}</span>
                                </v-flex>

                                <v-flex md-4>
                                    <v-btn color="white" @click="imageLoad">
                                        <span class="black--text subtitle-1">{{ $t('Signup.select') }}</span>
                                        <v-icon color="black">arrow_drop_down</v-icon>
                                    </v-btn>
                                    <input type="file" name="myImage" id="profile-upload" style="display:none" @change="onFileChange">
                                </v-flex>
                                
                            </v-layout>
                        </v-card>
                        <v-card v-else class="pa-2" color="success">
                            <v-layout row wrap justify-space-between>

                                <v-flex class="mt-1" xs-4>
                                    <v-icon  color="white" class="mx-2 mb-1">done_all</v-icon>
                                    <span class="white--text subtitle-1">{{ file }}</span>
                                </v-flex>
                                
                                <v-flex class="mt-1" xs-4>
                                    
                                    <span class="white--text subtitle-1 ml-3">{{getImageSize(imgData.size)}}</span>
                                </v-flex>

                                <v-flex xs-4 class="ml-5">
                                    <v-btn color="white" @click="deleteImg">
                                        <span class="black--text subtitle-1">{{ $t('Signup.del') }}</span>
                                        <v-icon color="black" class="ml-1">delete</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card>
                           
                            <v-card class="mt-2" v-if="cardLang == 'fr'" style="background:rgba(0, 0, 0, 0);">
                                <v-text-field  outlined  v-model="credentials.first_name" :counter="20" :rules="frFirstRules" label="Prénom" required/>
                                <v-text-field outlined v-model="credentials.last_name" :counter="20" :rules="frLastRules" label="Nom de famille" required class="purple-input"/>
                                <v-text-field outlined class="purple-input" v-model="credentials.username" :counter="20" :rules="frNameRules" label="Nom d'utilisateur" required />
                                <v-text-field outlined v-model="credentials.email" :rules="frEmailRules" label="Adresse Email" required/>
                                <v-text-field  outlined v-model="credentials.password" :rules="frPasswordRules" label="Mot de passe" :type="show1 ? 'text' : 'password'"
                                @click:append="show1 = !show1" :append-icon="show1 ? 'visibility' : 'visibility_off'" :counter="20" required/>
                                <v-btn block :disabled="!valid || !isEmpty" @click="registerUser" class="my-2 font-weight-light"  color="blue lighten-2">
                                {{ $t('Signup.signup') }}
                                </v-btn>
                            </v-card>

                            <v-card class="mt-2" v-else style="background:rgba(0, 0, 0, 0);">
                                <v-text-field  outlined  v-model="credentials.first_name" :counter="20" :rules="firstNameRules" label="First name" required/>
                                <v-text-field outlined v-model="credentials.last_name" :counter="20" :rules="lastNameRules" label="Last name" required class="purple-input"/>
                                <v-text-field outlined class="purple-input" v-model="credentials.username" :counter="20" :rules="nameRules" label="Username" required />
                                <v-text-field outlined v-model="credentials.email" :rules="emailRules" label="Email Address" required/>
                                <v-text-field  outlined v-model="credentials.password" :rules="passwordRules" label="Password" :type="show1 ? 'text' : 'password'"
                                @click:append="show1 = !show1" :append-icon="show1 ? 'visibility' : 'visibility_off'" :counter="20" required/>
                                <v-btn block :disabled="!valid || !isEmpty" @click="registerUser" class="my-2 font-weight-light"  color="blue lighten-2">
                                {{ $t('Signup.signup') }}
                                </v-btn>
                            </v-card>
                        
                </v-form>
                <v-snackbar v-model="snackbar" :timeout="5000" color="error" right top class="mt-4">
                    <v-icon color="white">error</v-icon>
                    <span> {{ $t(`RegistreError.err_${text}`) }} </span>
                <v-btn color="white" text  @click="snackbar = false">
                    Close
                </v-btn>
                </v-snackbar>
        </v-card>
            </v-flex>
    </v-layout>
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
            lang: false,
            isDragging: 'blue lighten-2',
            imgData: '',
            image: '',
            file: '',
            valid: true,
            show1: false,
            snackbar: false,
            text: '1',
            credentials: {
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
            },
            frFirstRules: [
                v => !!v || 'Le prénom est requis',
                v => /^[a-zA-Z]{3,20}$/.test(v) || 'A-z et doit comporter entre 3 et 20 caractères'
            ],
            frLastRules: [
                v => !!v || 'Le nom est requis',
                v => /^[a-zA-Z]{3,20}$/.test(v) || 'A-z et doit comporter entre 3 et 20 caractères'
            ],
            frNameRules: [
                v => !!v || "Nom d'utilisateur est nécessaire",
                v => /^[a-zA-Z0-9]{3,20}$/.test(v) || 'A-9 et doit comporter entre 3 et 20 caractères'
            ],
            frEmailRules: [
                v => !!v || 'E-mail est requis',
                v => /^(?!.{254})(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail doit être valide'
            ],
            frPasswordRules: [
                v => !!v || 'Mot de passe est requis',
                v => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,20}$/.test(v) || 'Le mot de passe nécessite 1 lettre minuscule minuscule et 1 chiffre et entre 5 et 20'
            ],
            firstNameRules: [
                v => !!v || 'First name is required',
                v => /^[a-zA-Z]{3,20}$/.test(v) || 'A-z and must be between 3 and 20 characters',
            ],
            lastNameRules: [
                v => !!v || 'Last name is required',
                v => /^[a-zA-Z]{3,20}$/.test(v) || 'A-z and must be between 3 and 20 characters',
            ],
            nameRules: [
                v => !!v || 'Username is required',
                v => /^[a-zA-Z0-9]{3,20}$/.test(v) || 'A-9 and must be between 3 and 20 characters',
            ],
            emailRules: [
                v => (!!v || i18n.locale == 'fr') || 'E-mail is required',
                v => /^(?!.{254})(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,20}$/.test(v) || 'Password requires 1 lower 1 upper case letter and 1 digit and between 5 and 20'
            ],
            status: 0,
        }
    },
    
    methods: {
        deleteImg() {
            this.isDragging = "blue lighten-2";
            this.image = '';
            this.file = '';
            this.imgData = '';
        },
        onDragEnter(e) {
            e.preventDefault();
            this.isDragging = 'green';
        },
        onDragLeave(e) {
            e.preventDefault();
            this.isDragging = 'blue lighten-2';
        },
        onDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const files = e.dataTransfer.files[0];
            this.addImg(files);
        },
        onFileChange(e) {
            const files = e.target.files[0];
            this.addImg(files);
        },
        addImg(file) {
            if (!file.type.match('image/jpeg|image/jpg|image/png'))
            {
                this.snackbar = true;
                this.isDragging = 'error';
                this.text = `8`
                return;
            }
            else
            {
                this.imgData = file; 
                this.file = file.name;
                this.isDragging = 'success';
                const reader = new FileReader();
                reader.onload = (i) => this.image = i.target.result;
                reader.readAsDataURL(file);
            }
        },
        imageLoad() {
            document.getElementById('profile-upload').click();
        },
        registerUser() {
            if (this.imgData == '')
            {
                this.snackbar = true;
                this.text = '9'
                return ;
            }
            const formData = new FormData();
            const options = {
                headers: {'Credentials-Header': JSON.stringify(this.credentials)}
            };
            formData.append('myImage', this.imgData);
            Axios.post('http://localhost:3001/signup', formData, options)
            .then(res => {
                if (res.data.status === "success")
                {
                    this.$router.push({name: 'login', params: {status: 'success', text: res.data.msg}})
                }
                else
                {
                    this.snackbar = true;
                    this.text = res.data.msg
                } 
            })
            .catch(err => {
                this.$router.push({path: `/${i18n.locale}/login`})
            })
        },
        getImageSize(size)
        {
            const stype = ['Bytes', 'KB', 'MB', 'GB'];
            let i = 0;

            while (size > 900)
            {
                size /= 1024;
                i++;
            }
            return `${(Math.round(size * 100) / 100)} ${stype[i]}`
        },
        removeDiv() {
            this.status = 0
        }
    },
    computed: {
        isEmpty() {
            return this.credentials.first_name && this.credentials.last_name && this.credentials.username 
            && this.credentials.email && this.credentials.password
        },
        uploadColor()
        {
            return this.isDragging;
        },
        cardLang()
        {
            return (i18n.locale)
        }
    }
}
</script>
<style>

.view {
  height: 100% !;
}

@media (max-width: 740px) {
  
  .view {
    height: 100% ;
  }
}
@media (min-width: 800px) and (max-width: 850px) {
  .view {
    height: 100% ;
  }
}

/* .flex-registre{
    margin-top: 250px !important;
} */

.view{
    background-image: url('../../public/iron-man-3-wallpapers-29651-2000185.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
}

.rgba-container {
  background: -webkit-linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.7) 100%);
  height: 100%;
}
</style>
