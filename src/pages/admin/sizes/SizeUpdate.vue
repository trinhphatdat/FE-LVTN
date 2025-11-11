<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import axios from 'axios';
import { message } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-sizes']);

const router = useRouter()
const route = useRoute()

const status = ref([
    { label: 'Hoạt động', value: 1 },
    { label: 'Ngừng hoạt động', value: 0 },
])
const formData = reactive({
    name: '',
    length: '',
    width: '',
    sleeve: '',
    status: ''
})
const getSize = () => {
    axios.get(`${API_URL}/admin/sizes/${route.params.id}`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            // console.log(response);
            formData.name = response.data.name
            formData.length = response.data.length
            formData.width = response.data.width
            formData.sleeve = response.data.sleeve
            formData.status = response.data.status
        })
        .catch((error) => {
            console.log(error);
        });
}
getSize()

const errors = ref({})
const handleSubmit = () => {
    axios.put(`${API_URL}/admin/sizes/${route.params.id}`, formData, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            console.log(response);
            message.success("Cập nhật thành công")
            router.push({ name: 'admin-sizes' })
        })
        .catch((error) => {
            errors.value = error.response.data.errors
            // console.log(error);
        });
}
</script>
<template>
    <a-form @submit.prevent="handleSubmit">
        <a-card title="Cập nhật vai trò" style="width: 100%;">
            <div class="row mb-3">
                <div class="col-12">
                    <!-- Tên kích cỡ -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.name }">Tên kích cỡ</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-4">
                            <a-input placeholder="Tên kích cỡ" allow-clear v-model:value="formData.name"
                                :class="{ 'input-danger': errors.name }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.name" class="text-danger">{{ errors.name[0] }}</small>
                        </div>
                    </div>
                    <!-- Dài áo -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.length }">Dài áo (cm)</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-4">
                            <a-input-number min="0" style="width: 100%" placeholder="Nhập dài áo" allow-clear
                                v-model:value="formData.length" :class="{ 'input-danger': errors.length }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.length" class="text-danger">{{ errors.length[0] }}</small>
                        </div>
                    </div>
                    <!-- Rộng áo  -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.width }">Rộng áo (cm)</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-4">
                            <a-input-number min="0" style="width: 100%" placeholder="Nhập rộng áo" allow-clear
                                v-model:value="formData.width" :class="{ 'input-danger': errors.width }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.width" class="text-danger">{{ errors.width[0] }}</small>
                        </div>
                    </div>
                    <!-- Dài tay -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.sleeve }">Dài tay (cm)</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-4">
                            <a-input-number min="0" style="width: 100%" placeholder="Nhập dài tay" allow-clear
                                v-model:value="formData.sleeve" :class="{ 'input-danger': errors.sleeve }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.sleeve" class="text-danger">{{ errors.sleeve[0] }}</small>
                        </div>
                    </div>
                    <!-- Tình trạng -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.status }">Tình trạng</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-4">
                            <a-select v-model:value="formData.status" placeholder="Chọn tình trạng" style="width: 100%;"
                                :options="status" :class="{ 'select-danger': errors.status }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.status" class="text-danger">{{ errors.status[0] }}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-grid mx-auto d-sm-flex justify-content-sm-end">
                    <router-link :to="{ name: 'admin-sizes' }">
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
    </a-form>
</template>