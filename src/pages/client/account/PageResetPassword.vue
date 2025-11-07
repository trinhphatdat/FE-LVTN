<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { message } from 'ant-design-vue'

const API_URL = import.meta.env.VITE_API_URL
const route = useRoute()
const router = useRouter()
const errors = ref({})
const loadingSubmit = ref(false)

const form = reactive({
    email: route.query.email || '',
    token: route.query.token || '',
    password: '',
    password_confirmation: ''
})

const handleResetPassword = () => {
    loadingSubmit.value = true
    axios.post(`${API_URL}/reset-password`, form)
        .then((respone) => {
            message.success(respone.data.message || 'Đặt lại mật khẩu thành công!')
            router.push({ name: 'account-login' })
        })
        .catch((error) => {
            if (error.response && error.response.status === 422) {
                errors.value = error.response.data.errors
                message.error('Vui lòng kiểm tra lại thông tin!')
            } else {
                message.error('Có lỗi xảy ra, vui lòng thử lại!')
            }
        })
        .finally(() => loadingSubmit.value = false)
}
</script>

<template>
    <div style="height: 50px;"></div>
    <a-form @submit.prevent="handleResetPassword">
        <a-card class="w-100" style="width: 100%;" title="">
            <div class="row mb-3">
                <div class="col-12 col-lg-3 col-md-3 text-lg-end text-start">
                    <label>
                        <span class="text-danger me-1">*</span>
                        <span :class="{ 'text-danger': errors.password }">Mật khẩu mới</span>
                    </label>
                </div>
                <div class="col-12 col-lg-9 col-md-9">
                    <a-input-password v-model:value="form.password" :class="{ 'input-danger': errors.password }"
                        placeholder="Nhập mật khẩu mới" />
                    <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12 col-lg-3 col-md-3 text-lg-end text-start">
                    <label>
                        <span class="text-danger me-1">*</span>
                        <span :class="{ 'text-danger': errors.password }">Xác nhận mật khẩu</span>
                    </label>
                </div>
                <div class="col-12 col-lg-9 col-md-9">
                    <a-input-password v-model:value="form.password_confirmation"
                        :class="{ 'input-danger': errors.password }" placeholder="Nhập lại mật khẩu mới" />
                    <small v-if="errors.password" class="text-danger">{{ errors.password[0]
                    }}</small>
                </div>
            </div>
            <div class="row mb-3 align-items-center">
                <div class="col-12 col-sm-3 text-lg-end text-start">
                    <a-button type="primary" html-type="submit" :loading="loadingSubmit">Đặt lại mật khẩu</a-button>
                </div>
            </div>
        </a-card>
    </a-form>
    <div style="height: 50px;"></div>
</template>
<style scoped>
.input-danger {
    border-color: red;
}
</style>