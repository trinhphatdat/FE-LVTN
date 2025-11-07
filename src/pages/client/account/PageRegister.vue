<script setup>
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()

const formRegister = reactive({
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    password: '',
    password_confirmation: '',
})

const errors = ref({})
const loadingSubmit = ref(false)


const handleRegister = () => {
    loadingSubmit.value = true

    axios.post(`${API_URL}/register`, formRegister)
        .then((response) => {
            message.success(response.data.message);
            router.push({ name: 'account-login' });
        })
        .catch((error) => {
            if (error.response && error.response.status === 422) {
                errors.value = error.response.data.errors;
                message.error('Vui lòng kiểm tra lại thông tin đăng ký.');
            } else {
                console.error('Lỗi không xác định:', error);
            }
        })
        .finally(() => {
            loadingSubmit.value = false;
        });
}
</script>

<template>
    <a-form @submit.prevent="handleRegister">
        <!-- Họ và tên -->
        <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
                <label for="">
                    <span class="text-danger me-1">*</span>
                    <span :class="{ 'text-danger': errors.fullname }">Họ và tên</span>
                </label>
            </div>
            <div class="col-12 col-sm-8">
                <a-input placeholder="Họ và tên" allow-clear v-model:value="formRegister.fullname"
                    :class="{ 'input-danger': errors.fullname }" />
                <div class="w-100"></div>
                <small v-if="errors.fullname" class="text-danger">{{ errors.fullname[0] }}</small>
            </div>
        </div>
        <!-- Email -->
        <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
                <label for="">
                    <span class="text-danger me-1">*</span>
                    <span :class="{ 'text-danger': errors.email }">Email</span>
                </label>
            </div>
            <div class="col-12 col-sm-8">
                <a-input placeholder="Email" allow-clear v-model:value="formRegister.email"
                    :class="{ 'input-danger': errors.email }" />
                <div class="w-100"></div>
                <small v-if="errors.email" class="text-danger">{{ errors.email[0] }}</small>
            </div>
        </div>
        <!-- Số điện thoại -->
        <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
                <label for="">
                    <span class="text-danger me-1">*</span>
                    <span :class="{ 'text-danger': errors.phone_number }">Số điện thoại</span>
                </label>
            </div>
            <div class="col-12 col-sm-8">
                <a-input placeholder="Số điện thoại" allow-clear v-model:value="formRegister.phone_number"
                    :class="{ 'input-danger': errors.phone_number }" />
                <div class="w-100"></div>
                <small v-if="errors.phone_number" class="text-danger">{{ errors.phone_number[0] }}</small>
            </div>
        </div>
        <!-- Begin: Địa chỉ -->
        <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
                <label for="">
                    <span class="text-danger me-1">*</span>
                    <span :class="{ 'text-danger': errors.address }">Địa chỉ</span>
                </label>
            </div>
            <div class="col-12 col-sm-8">
                <a-input placeholder="Địa chỉ" allow-clear v-model:value="formRegister.address"
                    :class="{ 'input-danger': errors.address }" />
                <div class="w-100"></div>
                <small v-if="errors.address" class="text-danger">{{ errors.address[0] }}</small>
            </div>
        </div>
        <!-- End: Địa chỉ -->

        <!-- Begin: Mật khẩu -->
        <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
                <label for="">
                    <span class="text-danger me-1">*</span>
                    <span :class="{ 'text-danger': errors.password }">Mật khẩu</span>
                </label>
            </div>
            <div class="col-12 col-sm-8">
                <a-input-password v-model:value="formRegister.password" placeholder="Nhập mật khẩu"
                    :class="{ 'input-danger': errors.password }" />
                <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
            </div>
        </div>
        <!-- End: Mật khẩu -->

        <!-- Begin: Nhập lại mật khẩu -->
        <div class="row mb-3">
            <div class="col-12 col-sm-3 text-start text-sm-end">
                <label for="">
                    <span class="text-danger me-1">*</span>
                    <span :class="{ 'text-danger': errors.password }">Nhập lại mật
                        khẩu</span>
                </label>
            </div>
            <div class="col-12 col-sm-8">
                <a-input-password v-model:value="formRegister.password_confirmation" placeholder="Nhập lại mật khẩu"
                    :class="{ 'input-danger': errors.password }" />
                <div class="w-100"></div>
                <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
            </div>
        </div>
        <!-- End: Nhập lại mật khẩu -->

        <!-- Button: đăng kí -->
        <a-button type="primary" html-type="submit" :loading="loadingSubmit">Đăng kí</a-button>
        <router-link :to="{ name: 'home' }">
            <a-button type="link" class="mt-3">Quay lại trang chủ</a-button>
        </router-link>
        <router-link :to="{ name: 'account-login' }">
            <a-button type="link" class="mt-3">Quay lại trang đăng nhập</a-button>
        </router-link>
        <!-- End button -->
    </a-form>
</template>

<style scoped>
.input-danger {
    border-color: red;
}

.select-danger {
    border: 1px solid red;
    border-radius: 7px;
}
</style>