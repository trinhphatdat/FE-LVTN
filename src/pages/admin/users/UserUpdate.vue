<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-users']);

const router = useRouter()
const route = useRoute()

const formData = reactive({
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    role_id: null,
    status: null,
    password: '',
    password_confirmation: '',

    change_password: false,
    login_at: '',
    change_password_at: '',
})

const errors = ref({})

//Điền value tương ứng khi click vào nút sửa
const getUserEdit = () => {
    axios.get(`${API_URL}/admin/users/${route.params.id}`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            // console.log(response);
            formData.fullname = response.data.fullname
            formData.phone_number = response.data.phone_number
            formData.email = response.data.email
            formData.role_id = response.data.role_id
            formData.status_id = response.data.status_id
            response.data.login_at
                ? formData.login_at = dayjs(response.data.login_at).format('DD/MM/YYYY - HH:mm:ss')
                : formData.login_at = 'Chưa đăng nhập'
            response.data.change_password_at
                ? formData.change_password_at = dayjs(response.data.change_password_at).format('DD/MM/YYYY - HH:mm')
                : formData.change_password_at = 'Chưa có lượt thay đổi mật khẩu'
        })
        .catch((error) => {
            console.log(error);
        });
}
getUserEdit()

const status = ref([
    { label: 'Tạm khóa', value: 0 },
    { label: 'Hoạt động', value: 1 },
])

const roles = ref([]);
const getRoles = () => {
    axios.get(`${API_URL}/admin/roles`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            if (response.status === 200) {
                roles.value = response.data.map(
                    (role) => ({
                        label: role.name,
                        value: role.id
                    })
                );
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
getRoles();

const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleUpdateUser = () => {
    axios.put(`${API_URL}/admin/users/${route.params.id}`, formData, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            // console.log(response);
            if (response.status === 200) {
                message.success('Cập nhật tài khoản thành công')
                router.push({ name: 'admin-users' })
            }
        })
        .catch((error) => {
            errors.value = error.response.data.errors
            console.log(error);
        });
}

</script>
<template>
    <form @submit.prevent="handleUpdateUser">
        <a-card title="Cập nhật tài khoản" style="width: 100%;">
            <div class="row mb-3">
                <div class="col-12">
                    <!-- Vai trò -->
                    <div class="row mb-3">
                        <div class="col-12 col-lg-3 col-md-5 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.role_id }">Vai trò</span>
                            </label>
                        </div>
                        <div class="col-12 col-lg-5 col-md-7">
                            <a-select show-search placeholder="Vai trò" style="width: 100%" :options="roles"
                                :filter-option="filterOption" allow-clear v-model:value="formData.role_id"
                                :class="{ 'select-danger': errors.role_id }"></a-select>
                            <div class=" w-100"></div>
                            <small v-if="errors.role_id" class="text-danger">{{ errors.role_id[0] }}</small>
                        </div>
                    </div>
                    <!-- Tình trạng -->
                    <div class="row mb-3">
                        <div class="col-12 col-lg-3 col-md-5 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.status_id }">Tình trạng</span>
                            </label>
                        </div>
                        <div class="col-12 col-lg-5 col-md-7">
                            <a-select show-search placeholder="Tình trạng" style="width: 100%" :options="status"
                                :filter-option="filterOption" allow-clear v-model:value="formData.status_id"
                                :class="{ 'select-danger': errors.status_id }">
                            </a-select>
                            <div class=" w-100"></div>
                            <small v-if="errors.status_id" class="text-danger">{{ errors.status_id[0] }}</small>
                        </div>
                    </div>
                    <!-- Họ và tên -->
                    <div class="row mb-3">
                        <div class="col-12 col-lg-3 col-md-5 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.fullname }">Họ và tên</span>
                            </label>
                        </div>
                        <div class="col-12 col-lg-5 col-md-7">
                            <a-input placeholder="Họ và tên" allow-clear v-model:value="formData.fullname"
                                :class="{ 'input-danger': errors.fullname }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.fullname" class="text-danger">{{ errors.fullname[0] }}</small>
                        </div>
                    </div>
                    <!-- Email -->
                    <div class="row mb-3">
                        <div class="col-12 col-lg-3 col-md-5 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.email }">Email</span>
                            </label>
                        </div>
                        <div class="col-12 col-lg-5 col-md-7">
                            <a-input placeholder="Email" allow-clear v-model:value="formData.email"
                                :class="{ 'input-danger': errors.email }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.email" class="text-danger">{{ errors.email[0] }}</small>
                        </div>
                    </div>
                    <!-- Số điện thoại -->
                    <div class="row mb-3">
                        <div class="col-12 col-lg-3 col-md-5 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.phone_number }">Số điện thoại</span>
                            </label>
                        </div>
                        <div class="col-12 col-lg-5 col-md-7">
                            <a-input placeholder="Số điện thoại" allow-clear v-model:value="formData.phone_number"
                                :class="{ 'input-danger': errors.phone_number }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.phone_number" class="text-danger">{{ errors.phone_number[0] }}</small>
                        </div>
                    </div>
                    <!-- Địa chỉ -->
                    <div class="row mb-3">
                        <div class="col-12 col-lg-3 col-md-5 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.address }">Địa chỉ</span>
                            </label>
                        </div>
                        <div class="col-12 col-lg-5 col-md-7">
                            <a-textarea placeholder="Địa chỉ" allow-clear v-model:value="formData.address"
                                :class="{ 'input-danger': errors.address }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.address" class="text-danger">{{ errors.address[0] }}</small>
                        </div>
                    </div>
                    <!-- Checkbox -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-checkbox v-model:checked="formData.change_password">Đổi mật khẩu</a-checkbox>
                        </div>
                    </div>
                    <!-- Mật khẩu -->
                    <div class="row mb-3" v-if="formData.change_password">
                        <div class=" col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.password }">Mật khẩu</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input-password placeholder="Mật khẩu" allow-clear v-model:value="formData.password"
                                :class="{ 'input-danger': errors.password }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
                        </div>
                    </div>
                    <!-- Xác nhận mật khẩu -->
                    <div class="row mb-3" v-if="formData.change_password">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.password }">Xác nhận mật khẩu</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input-password placeholder="Xác nhận mật khẩu" allow-clear
                                v-model:value="formData.password_confirmation"
                                :class="{ 'input-danger': errors.password }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.password" class="text-danger">{{ errors.password[0] }}</small>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span>Lần đăng nhập gần đây</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <span>{{ formData.login_at }}</span>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span>Lần đổi mật khẩu gần đây</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <span>{{ formData.change_password_at }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-grid mx-auto d-sm-flex justify-content-sm-end">
                    <router-link :to="{ name: 'admin-users' }">
                        <a-button class="me-sm-2 mb-3 mb-sm-0">
                            <span>Huỷ</span>
                        </a-button>
                    </router-link>
                    <a-button type="primary" html-type="submit">
                        <span>Lưu</span>
                    </a-button>
                </div>
            </div>
        </a-card>
    </form>
</template>

<style scoped>
.select-danger {
    border: 1px solid red;
    border-radius: 7px;
}

.input-danger {
    border-color: red;
}
</style>