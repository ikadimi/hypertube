<template>
    <v-container>
        <v-form v-model="valid" ref="form" lazy-validation class="mx-3 mt-3">
                <v-card class="pa-2" id="uploads" v-if="isDragging != 'success'"
                @dragenter="onDragEnter" @dragleave="onDragLeave" @drop="onDrop"
                @dragover.prevent :color="uploadColor">
                    <v-layout row wrap  justify-space-between>
                        <v-flex class="mt-1" xs-4>
                            <v-icon  color="white" class="mx-2 mb-1">cloud_upload</v-icon>
                            <span class="white--text subtitle-1"> {{ $t('Signup.drag') }}</span>
                        </v-flex>
                        <v-flex class="mt-1" xs-4>
                            
                            <span class="white--text title ml-3">{{ $t('Signup.or') }}</span>
                        </v-flex>

                        <v-flex xs-4>
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
                <v-text-field class="mt-2" outlined  v-model="credentials.first_name" :counter="20" :rules="firstNameRules" label="First name" required/>

                <v-text-field outlined v-model="credentials.last_name" :counter="20" :rules="lastNameRules" label="Last name" required class="purple-input"/>
                
                <v-text-field outlined class="purple-input" v-model="credentials.username" :counter="20" :rules="nameRules" label="Username" required />
                
                <v-text-field outlined v-model="credentials.email" :counter="50" :rules="emailRules" label="Email Address" required/>
                
                <v-text-field  outlined v-model="credentials.password" :rules="passwordRules" label="Password" :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1" :append-icon="show1 ? 'visibility' : 'visibility_off'" :counter="20" required/>
                
                <v-btn block :disabled="!valid || !isEmpty" @click="registerUser" class="my-2 font-weight-light"  color="blue lighten-2">
                {{ $t('Signup.signup') }}
                </v-btn>
        </v-form>
    </v-container>
</template>
