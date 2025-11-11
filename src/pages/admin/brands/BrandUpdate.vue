<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import axios from 'axios';
import { message } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-brands']);

const route = useRoute();
const router = useRouter();

const status = ref([
    { label: 'Tạm khóa', value: 0 },
    { label: 'Hoạt động', value: 1 },
])

const formData = reactive({
    name: '',
    description: '',
    logo_url: '',
    status: null,
})
const getBrand = () => {
    axios.get(`${API_URL}/admin/brands/${route.params.id}`, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            formData.name = response.data.name
            formData.description = response.data.description
            formData.logo_url = response.data.logo_url
            formData.status = response.data.status
        })
        .catch((error) => {
            console.log(error);
        });
}
getBrand();

const errors = ref({})
const handleSubmit = () => {
    axios.put(`${API_URL}/admin/brands/${route.params.id}`, formData, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            console.log(response);
            message.success("Sửa thành công")
            router.push({ name: 'admin-brands' })
        })
        .catch((error) => {
            errors.value = error.response.data.errors
            // console.log(error);
        });
}
const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        formData.logo_url = event.target.files[0];
    } else {
        formData.logo_url = null;
    }
};
</script>
<template>
    <a-form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <a-card title="Cập nhật vai trò" style="width: 100%;">
            <div class="row mb-3">
                <div class="col-12">
                    <!-- Tên thương hiệu -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.name }">Tên thương hiệu</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-4">
                            <a-input placeholder="Nhập tên thương hiệu" allow-clear v-model:value="formData.name"
                                :class="{ 'input-danger': errors.name }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.name" class="text-danger">{{ errors.name[0] }}</small>
                        </div>
                    </div>
                    <!-- Mô tả -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span>Mô tả</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-4">
                            <a-textarea placeholder="Nhập mô tả" allow-clear v-model:value="formData.description" />
                        </div>
                    </div>
                    <!-- Logo URL -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.logo_url }">Logo</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-4">
                            <input :class="{ 'input-danger': errors.logo_url }" type="file" name="thumbnail"
                                @change="handleFileChange" accept="image/*" />
                            <div class=" w-100"></div>
                            <small v-if="errors.logo_url" class="text-danger">{{ errors.logo_url[0] }}</small>
                        </div>
                    </div>
                    <!-- Hình ảnh hiện tại -->
                    <div class="row mb-3" v-if="formData.logo_url">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span>Hình ảnh hiện tại</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-4">
                            <a-image v-if="formData.logo_url" :src="`${STORAGE_URL}/${formData.logo_url}`"
                                alt="Thumbnail sản phẩm" style="max-width: 100px;" />
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
                    <router-link :to="{ name: 'admin-brands' }">
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