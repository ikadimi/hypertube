<template>
    <div v-if="!loader">
    <v-toolbar short>
      <v-toolbar-title class="toolbar">
            <a href="/home" class="hyper">
            <v-icon class="mb-1">local_movies</v-icon>
            <span class="grey--text">HYPER</span>
                <span>TUBE</span>
            </a>
         
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-toolbar-items>

            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                      <v-icon style="padding-top:10px" slot="append">person</v-icon>
                    <v-text-field  autocomplete="off" class="mt-2" v-on="on" v-model="Searched"  @input="SearchChange">
                    </v-text-field>
                </template>
                <v-list v-if="this.Empty == ''">
                    <v-list-item v-for="user in users" :key="user.id"
                    @click="goToProfile(user.id)">
                    <v-list-item-avatar>
                        <v-img :src="ImgSource(user.avatar)"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-title>{{ user.username }}</v-list-item-title>
                    </v-list-item>
                </v-list>
                <v-list v-else>
                    <v-list-item>
                        <v-list-item-title>{{ Empty }}</v-list-item-title>
                    </v-list-item>
                </v-list>
        </v-menu>

        <v-menu class="outline" offset-y transition="slide-y-transition">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" text>
                <span >{{userData.username}}</span>
                <v-avatar size="40" class="ml-2">
                    <v-img v-if="userData" :src="ImgSource(userData.avatar)"></v-img>
                </v-avatar>
              </v-btn>
            </template>
            <v-list>
                <v-list-item>
                    <v-btn to="/profile" text >
                        <span class="body-2"> {{ $t('bar.profile') }}</span>
                    </v-btn> 
                </v-list-item>
                 <v-list-item>
                    <v-btn to="/home" text >
                        <span class="body-2">{{ $t('bar.home') }}</span>
                    </v-btn> 
                </v-list-item>
                <v-list-item>
                    <v-btn to="/list" text >
                        <span class="body-2">{{ $t('bar.list') }}</span>
                    </v-btn> 
                </v-list-item>
                <v-list-item>
                    <v-btn to="/settings" text >
                        <span class="body-2">{{ $t('bar.settings') }}</span>
                    </v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn @click="logoutUser" text >
                        <span class="body-2">{{ $t('bar.logout') }}</span>
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-menu>
            
      </v-toolbar-items>

    </v-toolbar>
    </div>
</template>

<script>
import Axios from 'axios'
import i18n from '../i18n'

export default {
    mounted() 
    {
        this.loader = true
        setTimeout(()=>{
        this.loader = false
        }, 700);
        const token = window.localStorage.getItem('token')
        if (token) Axios.defaults.headers.common['x-auth-token'] = token
        else delete Axios.defaults.headers.common['x-auth-token']

        Axios.get('http://localhost:3001/settings')
        .then(res => {
            if (res.data == "failure")
            {
                window.localStorage.removeItem('token')
                this.$router.push({path: `/${i18n.locale}/login`})
            }
            else
            {
                this.userData = res.data
                this.$store.dispatch('changeStatus', 'auth')
                this.$store.dispatch('userData', res.data)
                i18n.locale = res.data.lang
            }   
        })
        .catch(err => {
            if (err.response.status == 401)
            {
                window.localStorage.removeItem('token')
                this.$router.push({path: `/${i18n.locale}/login`})
            }
        })
    },
    data() {
        return {
            closeOnClick: true,
            Empty: 'No Users Found',
            Searched: '',
            loader: '',
            userData: {
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                avatar: '',
            },
            users: []
        }
    },
    methods: {
        logoutUser()
        {
            window.localStorage.removeItem('token');
            this.$store.dispatch('changeStatus', 'NaN')
            this.$router.push({path: `/${i18n.locale}/login`})
        },
        goToProfile(id)
        {
            this.$router.push({path: `/profile/${id}`})
            location.reload()
        },
        SearchChange()
        {
            const token = window.localStorage.getItem('token')
            if (token) Axios.defaults.headers.common['x-auth-token'] = token
            else delete Axios.defaults.headers.common['x-auth-token']

            if (this.Searched != '' && this.Searched.length > 0)
            {
                Axios.post("http://localhost:3001/profile/searchUser", {search: this.Searched})
                .then(res => {
                    if (res.data.status == "success")
                    {
                        if (res.data.users == "No Users Found")
                            this.Empty = "No users Found"
                        else
                        {
                            this.Empty = ''
                            this.users = res.data.users
                        }
                    }
                    else
                        this.Empty = "No users Found"
                })
                .catch(error => {
                    this.$router.push({ name: "home" });
                })
            }
            else
                this.Empty = "No users Found"
        },
        ImgSource(image)
        {
            if (image.includes("images/") == true)
                return require("../../public/" + image)
            else
                 return image
        }
    },
    computed: {
    }
}
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Orbitron");
.outline:focus{
    outline: none;
}
.hyper {
     text-decoration:none;
     background:#fff;
     font-family: 'Orbitron';
     font-size: 20px !important;
     font-weight: bold
}
.toolbar a{
    background: #fff !important;
    text-decoration:none !important;
}
a, a:hover {
  text-decoration: none !important;
}

</style>