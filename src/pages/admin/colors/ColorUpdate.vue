<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import axios from 'axios';

const store = useMenuAdmin();
store.onSelectedKeys(['admin-colors']);

const router = useRouter()

const colors = reactive({
    name: '',
    hex_code: '',
    status: ''
})
const errors = ref({})
const handleSubmit = () => { }
</script>
<template>
    <a-form @submit.prevent="handleSubmit">
        <a-card title="Cập nhật vai trò" style="width: 100%;">
            <div class="row mb-3">
                <div class="col-12">
                    <!-- Tên màu sắc -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.name }">Tên màu sắc</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="Tên màu sắc" allow-clear v-model:value="colors.name"
                                :class="{ 'input-danger': errors.name }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.name" class="text-danger">{{ errors.name[0] }}</small>
                        </div>
                    </div>
                    <!-- Mã màu -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.hex_code }">Tên mã màu</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="Tên mã màu" allow-clear v-model:value="colors.hex_code"
                                :class="{ 'input-danger': errors.hex_code }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.hex_code" class="text-danger">{{ errors.hex_code[0] }}</small>
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
                            <a-select v-model:value="colors.status" placeholder="Chọn tình trạng" style="width: 100%;"
                                :class="{ 'select-danger': errors.status }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.status" class="text-danger">{{ errors.status[0] }}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-grid mx-auto d-sm-flex justify-content-sm-end">
                    <router-link :to="{ name: 'admin-colors' }">
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