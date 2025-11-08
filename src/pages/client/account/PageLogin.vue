<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/use-user-store.js'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()

const userStore = useUserStore()

if (userStore.isLoggedIn) {
    router.push({ name: 'home' })
}

const errors = ref({})
const loadingSubmit = ref(false)

const formLogin = reactive({
    email: '',
    password: '',
})

const handleLogin = () => {
    loadingSubmit.value = true
    axios.post(`${API_URL}/login`, formLogin)
        .then((response) => {
            message.success(`Đăng nhập thành công!`);
            localStorage.setItem('token', response.data.access_token);

            // Gọi fetchProfile để cập nhật tên user ngay
            userStore.fetchProfile()
            router.push({ name: 'home' });
        })
        .catch((error) => {
            if (error.response && error.response.status === 422) {
                message.error('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
                errors.value = error.response.data.errors;
            } else {
                message.error('Email hoặc mật khẩu không đúng.');
            }
        })
        .finally(() => {
            loadingSubmit.value = false
        });
}
</script>

<template>
    <a-form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="row mb-3">
            <div class="col-12 col-sm-3 text-lg-end text-start">
                <label for="">
                    <span :class="{ 'text-danger': errors.email }">Email</span>
                </label>
            </div>
            <div class="col-12 col-sm-8">
                <a-input v-model:value="formLogin.email" type="email" placeholder="Nhập email" allow-clear
                    :class="{ 'input-danger': errors.email }" />
                <div class="w-100"></div>
                <small v-if="errors.email" class="text-danger">{{ errors.email[0] }}</small>
            </div>
        </div>
        <!-- Mật khẩu -->
        <div class="row mb-3">
            <div class="col-12 col-sm-3 text-lg-end text-start">
                <label for="">
                    <span :class="{ 'text-danger': errors.password }">Mật khẩu</span>
                </label>
            </div>
            <div class="col-12 col-sm-8">
                <a-input-password v-model:value="formLogin.password" placeholder="Nhập mật khẩu"
                    :class="{ 'input-danger': errors.password }" />
                <div class="w-100"></div>
                <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
            </div>
        </div>
        <!-- Form-footer -->
        <div class="row mb-3 align-items-center">
            <div class="col-12 col-lg-4 col-md-4 text-lg-end text-start">
                <a-button type="primary" html-type="submit" :loading="loadingSubmit">Đăng nhập</a-button>
            </div>
            <div class="col-12 col-lg-8 col-md-8 text-lg-start text-start">
                <router-link :to="{ name: 'account-register' }">
                    <a-button type="link" class="pe-0 ps-0">Đăng kí</a-button>
                </router-link>
                hoặc
                <router-link :to="{ name: 'account-forgot-password' }">
                    <a-button type="link" class="ps-0">quên mật khẩu</a-button>
                </router-link>
            </div>
        </div>
    </a-form>
</template>

<style scoped>
.input-danger {
    border-color: red;
}
</style>