<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import { message } from 'ant-design-vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-roles']);

const router = useRouter()

const status = ref([
    { label: 'Tạm khóa', value: 0 },
    { label: 'Hoạt động', value: 1 },
])
const formData = reactive({
    name: '',
    status: '',
})
const createRole = () => {
    axios.post(`${API_URL}/admin/roles`, formData, {
        headers:
        {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then((response) => {
            console.log(response);
            message.success("Thêm thành công")
            router.push({ name: 'admin-roles' })
        })
        .catch((error) => {
            errors.value = error.response.data.errors
            // console.log(error);
        });
}
const errors = ref({})
const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

</script>

<template>
    <form @submit.prevent="createRole">
        <a-card title="Tạo mới vai trò" style="width: 100%;">
            <div class="row mb-3">
                <div class="col-12">
                    <!--  -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.name }">Tên vai trò</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="Tên vai trò" allow-clear v-model:value="formData.name"
                                :class="{ 'input-danger': errors.name }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.name" class="text-danger">{{ errors.name[0] }}</small>
                        </div>
                    </div>
                    <!-- Tình trạng -->
                    <div class="row mb-3">
                        <div class="col-12 col-lg-3 col-md-5 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.status }">Tình trạng</span>
                            </label>
                        </div>
                        <div class="col-12 col-lg-5 col-md-7">
                            <a-select show-search placeholder="Tình trạng" style="width: 100%" :options="status"
                                :filter-option="filterOption" allow-clear v-model:value="formData.status"
                                :class="{ 'select-danger': errors.status }">
                            </a-select>
                            <div class=" w-100"></div>
                            <small v-if="errors.status" class="text-danger">{{ errors.status[0] }}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-grid mx-auto d-sm-flex justify-content-sm-end">
                    <router-link :to="{ name: 'admin-roles' }">
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

<style scoped></style>