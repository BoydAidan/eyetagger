<template>
    <div class="section" id="app">
        <b-navbar>
            <template slot="start">
                <h1 class="title is-3">EyeTagger</h1>
            </template>
            <template slot="end">
                <b-navbar-item><router-link :to="{ name: 'home' }">
                    Home
                </router-link></b-navbar-item>
                <b-navbar-item v-if="is_authenticated"><router-link :to="{ name: 'annotation' }">
                    Annotation Demo
                </router-link></b-navbar-item>
                <!-- <b-navbar-item><router-link :to="{ name: 'visualization' }">
                    Visualization Demo
                </router-link></b-navbar-item> -->
                <b-navbar-item v-if="is_authenticated">
                    <router-link :to="{ name: 'login', params: { logout: true } }">Logout
                </router-link></b-navbar-item>
                <b-navbar-item v-else>
                    <router-link :to="{ name: 'login' }">Login
                </router-link></b-navbar-item>
            </template>
        </b-navbar>
        <router-view />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
    name: "App",
    computed: {
        ...mapState('toasts', [
            'errors',
            'successes',
        ]),
        ...mapState('auth', [
            'is_authenticated',
            'auth_token',
        ]),
    },
    created() {
        // get available images once app is created
        if (this.is_authenticated) {
            axios.defaults.headers.common = { 'Authorization': `Token ${this.auth_token}` }
            this.fetch_images()
        }
    },
    methods: {
        fetch_images() {
            if (this.is_authenticated) {
                this.$store.dispatch('images/getImages')
            }
            else {
                console.log("User not authenticated. Redirected to login.");
                this.$router.push({ name: 'login' })
            }
        },
        toast_errors() {
            this.errors.map(msg => this.$awn.alert(msg))
            if (this.errors.length > 0) {
                this.$store.dispatch('toasts/clearErrors')
            }
        },
        toast_successes() {
            this.successes.map(msg => this.$awn.success(msg))
            if (this.successes.length > 0) {
                this.$store.dispatch('toasts/clearSuccesses')
            }
        },
    },
    watch: {
        is_authenticated: {
            handler: 'fetch_images',
        },
        errors: {
            handler: 'toast_errors',
            deep: true,
        },
        successes: {
            handler: 'toast_successes',
            deep: true,
        },
    }
    // computed: mapState({
    //     images: state => state.images.images
    // }),
    // methods: mapActions('messages', [
    //     'addMessage',
    //     'deleteMessage'
    // ]),
}
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-width: 1600px;
    min-height: 900px;
    color: #2c3e50;
    margin-top: 60px;
    margin-top: 1em;
    padding-top: 0;
}
[tabindex] {
   outline: none !important;
}
</style>
