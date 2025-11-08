<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/use-user-store.js'
import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';
// import dayjs from 'dayjs';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const router = useRouter()

const userStore = useUserStore()

const formUpdate = reactive({
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    current_password: '',
    password: '',
    password_confirmation: '',
    change_password: false,
    // login_at: '',
    // change_password_at: '',
})
const errors = ref({})
const componentDisabled = ref(true)
const isLoading = ref(false)


// Lấy danh sách tỉnh khi component mount
onMounted(() => {
    formUpdate.fullname = userStore.user.fullname
    formUpdate.email = userStore.user.email
    formUpdate.phone_number = userStore.user.phone_number
    formUpdate.address = userStore.user.address

})

//Begin: Cập nhật thông tin người dùng
const handleUpdateUser = () => {
    const payLoad = {
        fullname: formUpdate.fullname,
        change_password: formUpdate.change_password,
        email: formUpdate.email,
        phone_number: formUpdate.phone_number,
        address: formUpdate.address,
    }
    // Chỉ gửi request đổi mật khẩu nếu checkbox được chọn
    if (formUpdate.change_password) {
        payLoad.password = formUpdate.password
        payLoad.password_confirmation = formUpdate.password_confirmation
        payLoad.current_password = formUpdate.current_password
    }

    axios.put(`${API_URL}/edit-user`, payLoad, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            message.success('Cập nhật thông tin thành công!');
            console.log(response.data);
            userStore.fetchProfile(); // Refresh user data
            router.push({ name: 'account-profile' });
        })
        .catch(error => {
            if (error.response && error.response.status === 422) {
                errors.value = error.response.data.errors;
                message.error(error.response.data.message);
            } else {
                message.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        });
}
//End: Cập nhật thông tin người dùng
</script>
<template>
    <TheLoadingSpinner v-if="isLoading" />
    <a-checkbox :checked="componentDisabled" @change="e => (componentDisabled = e.target.checked)">
        {{ componentDisabled ? 'Chỉnh sửa thông tin' : 'Khóa chỉnh sửa' }}
    </a-checkbox>
    <div class="mt-2"></div>
    <a-card class="w-100" style="width: 100%;" title="">
        <a-form @submit.prevent="handleUpdateUser" :disabled="componentDisabled">
            <!-- Tên người dùng -->
            <div class="row mb-3">
                <div class="col-12 col-lg-3 text-lg-end text-start">
                    <label for="input-fullname">
                        <span class="text-danger me-1">*</span>
                        <span :class="{ 'text-danger': errors.fullname }">Tên người dùng</span>
                    </label>
                </div>
                <div class="col-12 col-lg-7">
                    <a-input id="input-fullname" placeholder="Họ và tên" allow-clear v-model:value="formUpdate.fullname"
                        :class="{ 'input-danger': errors.fullname }" />
                    <div class=" w-100"></div>
                    <small v-if="errors.fullname" class="text-danger">{{ errors.fullname[0] }}</small>
                </div>
            </div>
            <!-- Email -->
            <div class="row mb-3">
                <div class="col-12 col-lg-3 text-lg-end text-start">
                    <label for="input-email">
                        <span class="text-danger me-1">*</span>
                        <span :class="{ 'text-danger': errors.email }">Email</span>
                    </label>
                </div>
                <div class="col-12 col-lg-7">
                    <a-input id="input-email" placeholder="Email" allow-clear v-model:value="formUpdate.email"
                        :class="{ 'input-danger': errors.email }" />
                    <div class=" w-100"></div>
                    <small v-if="errors.email" class="text-danger">{{ errors.email[0] }}</small>
                </div>
            </div>
            <!-- Số điện thoại -->
            <div class="row mb-3">
                <div class="col-12 col-lg-3 text-lg-end text-start">
                    <label for="input-phone_number">
                        <span class="text-danger me-1">*</span>
                        <span :class="{ 'text-danger': errors.phone_number }">Số điện thoại</span>
                    </label>
                </div>
                <div class="col-12 col-lg-7">
                    <a-input id="input-phone_number" placeholder="Họ và tên" allow-clear
                        v-model:value="formUpdate.phone_number" :class="{ 'input-danger': errors.phone_number }" />
                    <div class=" w-100"></div>
                    <small v-if="errors.phone_number" class="text-danger">{{ errors.phone_number[0] }}</small>
                </div>
            </div>

            <!-- Địa chỉ -->
            <div class="row mb-3">
                <div class="col-12 col-lg-3 text-lg-end text-start">
                    <label for="">
                        <span class="text-danger me-1">*</span>
                        <span :class="{ 'text-danger': errors.address }">Địa chỉ</span>
                    </label>
                </div>
                <div class="col-12 col-lg-7">
                    <a-input placeholder="Địa chỉ" allow-clear v-model:value="formUpdate.address"
                        :class="{ 'input-danger': errors.address }" />
                    <div class="w-100"></div>
                    <small v-if="errors.address" class="text-danger">{{ errors.address[0] }}</small>
                </div>
            </div>
            <!--  -->


            <!-- Checkbox change password -->
            <div class="row mb-3">
                <div class="col-12">
                    <a-checkbox v-model:checked="formUpdate.change_password">Đổi mật khẩu (click nếu bạn muốn
                        đổi)</a-checkbox>
                </div>
            </div>
            <!-- Mật khẩu hiện tại -->
            <div class="row mb-3" v-if="formUpdate.change_password">
                <div class=" col-12 col-lg-3 text-start text-lg-end">
                    <label for="">
                        <span class="text-danger me-1">*</span>
                        <span :class="{ 'text-danger': errors.current_password }">Mật khẩu hiện tại</span>
                    </label>
                </div>
                <div class="col-12 col-lg-7">
                    <a-input-password placeholder="Mật khẩu hiện tại" allow-clear
                        v-model:value="formUpdate.current_password"
                        :class="{ 'input-danger': errors.current_password }" />
                    <div class="w-100"></div>
                    <small v-if="errors.current_password" class="text-danger">{{ errors.current_password[0]
                    }}</small>
                </div>
            </div>
            <!-- Mật khẩu -->
            <div class="row mb-3" v-if="formUpdate.change_password">
                <div class=" col-12 col-lg-3 text-start text-lg-end">
                    <label for="">
                        <span class="text-danger me-1">*</span>
                        <span :class="{ 'text-danger': errors.password }">Mật khẩu mới</span>
                    </label>
                </div>
                <div class="col-12 col-lg-7">
                    <a-input-password placeholder="Mật khẩu" allow-clear v-model:value="formUpdate.password"
                        :class="{ 'input-danger': errors.password }" />
                    <div class="w-100"></div>
                    <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
                </div>
            </div>
            <!-- Xác nhận mật khẩu -->
            <div class="row mb-3" v-if="formUpdate.change_password">
                <div class="col-12 col-lg-3 text-start text-lg-end">
                    <label for="">
                        <span class="text-danger me-1">*</span>
                        <span :class="{ 'text-danger': errors.password }">Xác nhận mật khẩu mới</span>
                    </label>
                </div>
                <div class="col-12 col-lg-7">
                    <a-input-password placeholder="Xác nhận mật khẩu" allow-clear
                        v-model:value="formUpdate.password_confirmation" :class="{ 'input-danger': errors.password }" />
                    <div class="w-100"></div>
                    <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
                </div>
            </div>
            <!-- Lần đăng nhập gần đây -->
            <!-- <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                    <label for="">
                        <span>Lần đăng nhập gần đây</span>
                    </label>
                </div>
                <div class="col-12 col-sm-5">
                    <span>{{ formEdit.login_at }}</span>
                </div>
            </div> -->
            <!-- Lần thay đổi mật khẩu gần đây -->
            <!-- <div class="row mb-3">
                <div class="col-12 col-sm-3 text-start text-sm-end">
                    <label for="">
                        <span>Lần đổi mật khẩu gần đây</span>
                    </label>
                </div>
                <div class="col-12 col-sm-5">
                    <span>{{ formEdit.change_password_at }}</span>
                </div>
            </div> -->
            <!-- bottom -->
            <div class="row">
                <div class="col-12 d-grid mx-auto d-flex justify-content-end">
                    <!-- <router-link :to="{ name: 'account-profile' }">
                        <a-button class="me-2 mb-3" type="default">
                            <span>Huỷ</span>
                        </a-button>
                    </router-link> -->
                    <a-button type="primary" html-type="submit">
                        <span>Lưu</span>
                    </a-button>
                </div>
            </div>
        </a-form>
    </a-card>
</template>

<style scoped>
.input-danger {
    border-color: red;
}
</style>