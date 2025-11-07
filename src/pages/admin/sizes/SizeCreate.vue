<template>
    <a-form @submit.prevent="createSize">
        <a-card title="Tạo mới kích cỡ" style="width: 100%;">
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
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="Tên kích cỡ" allow-clear v-model:value="sizes.name"
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
                                <span :class="{ 'text-danger': errors.length }">Dài áo</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="Nhập dài áo" allow-clear v-model:value="sizes.length"
                                :class="{ 'input-danger': errors.length }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.length" class="text-danger">{{ errors.length[0] }}</small>
                        </div>
                    </div>
                    <!-- Rộng áo  -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.width }">Rộng áo</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="Nhập rộng áo" allow-clear v-model:value="sizes.width"
                                :class="{ 'input-danger': errors.width }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.width" class="text-danger">{{ errors.width[0] }}</small>
                        </div>
                    </div>
                    <!-- Dài tay -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.sleeve }">Dài tay</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="Nhập dài tay" allow-clear v-model:value="sizes.sleeve"
                                :class="{ 'input-danger': errors.sleeve }" />
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
                        <div class="col-12 col-sm-5">
                            <a-select v-model:value="sizes.status" placeholder="Chọn tình trạng" style="width: 100%;"
                                :class="{ 'select-danger': errors.status }" />
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

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import { message } from 'ant-design-vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-sizes']);

const router = useRouter()

const sizes = reactive({
    name: '',
    length: '',
    width: '',
    sleeve: '',
    status: ''
})
const createSize = () => {
    axios.post(`${API_URL}/sizes`, sizes)
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                message.success("Thêm thành công")
                router.push({ name: 'admin-sizes' })
            }
        })
        .catch((error) => {
            errors.value = error.response.data.errors
            // console.log(error);
        });
}
const errors = ref({})
// const filterOption = (input, option) => {
//     return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
// };

</script>

<style scoped>
.select-danger {
    border: 1px solid red;
    border-radius: 7px;
}

.input-danger {
    border-color: red;
}
</style>