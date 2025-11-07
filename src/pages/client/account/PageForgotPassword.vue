<script setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
// import { useUserStore } from '@/stores/use-user-store.js'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const errors = ref({})

const formForgotPassword = reactive({
    email: '',
})
const handleForgotPassword = () => {
    axios.post(`${API_URL}/forgot-password`, formForgotPassword)
        .then((response) => {
            message.success(response.data.message || 'Vui lòng kiểm tra email để đặt lại mật khẩu!');
            errors.value = {};
        })
        .catch((error) => {
            if (error.response && error.response.status === 422) {
                errors.value = error.response.data.errors;
                message.error('Email không hợp lệ hoặc không tồn tại!');
            } else {
                message.error('Có lỗi xảy ra, vui lòng thử lại!');
            }
        });
}
</script>
<template>
    <a-form @submit.prevent="handleForgotPassword">
        <!-- Email -->
        <div class="row mb-3">
            <div class="col-12 col-sm-3 text-lg-end text-start">
                <label for="">
                    <span :class="{ 'text-danger': errors.email }">Email</span>
                </label>
            </div>
            <div class="col-12 col-sm-8">
                <a-input v-model:value="formForgotPassword.email" type="email" placeholder="Nhập email" allow-clear
                    :class="{ 'input-danger': errors.email }" />
                <div class="w-100"></div>
                <small v-if="errors.email" class="text-danger">{{ errors.email[0] }}</small>
            </div>
        </div>
        <!-- Form-footer -->
        <div class="row mb-3 align-items-center">
            <div class="col-12 col-sm-3 text-lg-end text-start">
                <a-button type="primary" html-type="submit">Gửi</a-button>
            </div>
            <div class="col-12 col-sm-9 text-start">
                <router-link :to="{ name: 'account-login' }">
                    <a-button type="link" class="pe-0 ps-0">Trở về trang đăng nhập</a-button>
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