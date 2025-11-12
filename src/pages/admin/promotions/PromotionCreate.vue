<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuAdmin } from '@/stores/use-menu-admin.js';
import { message } from 'ant-design-vue';
import axios from 'axios';
import dayjs from 'dayjs';

const API_URL = import.meta.env.VITE_API_URL;

const store = useMenuAdmin();
store.onSelectedKeys(['admin-promotions']);

const router = useRouter()

const promotions = reactive({
    name: '',
    url_image: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_value: 0,
    usage_limit: null,
    status: 1,
})
const dateRange = ref([]);


const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        promotions.url_image = event.target.files[0];
    } else {
        promotions.url_image = null;
    }
};

const createPromotion = () => {
    const formData = new FormData();

    // Thêm các trường dữ liệu
    formData.append('url_image', promotions.url_image);
    formData.append('name', promotions.name);
    formData.append('description', promotions.description || '');
    formData.append('discount_type', promotions.discount_type);
    formData.append('discount_value', promotions.discount_value);
    formData.append('min_order_value', promotions.min_order_value);
    formData.append('usage_limit', promotions.usage_limit || '');
    formData.append('status', promotions.status);
    formData.append('start_date', dateRange.value[0] ? dayjs(dateRange.value[0]).format('YYYY-MM-DD HH:mm:ss') : '');
    formData.append('end_date', dateRange.value[1] ? dayjs(dateRange.value[1]).format('YYYY-MM-DD HH:mm:ss') : '');

    axios.post(`${API_URL}/admin/promotions`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
        .then((response) => {
            console.log(response);
            message.success("Thêm thành công")
            router.push({ name: 'admin-promotions' })
        })
        .catch((error) => {
            errors.value = error.response.data.errors
            console.log(error.response);
        });
}

const errors = ref({})
</script>
<template>
    <form @submit.prevent="createPromotion" enctype="multipart/form-data">
        <a-card title="Tạo mới khuyến mãi" style="width: 100%;">
            <div class="row mb-3">
                <div class="col-12">
                    <!-- Tên khuyến mãi -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.name }">Tên khuyến mãi</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input placeholder="Tên khuyến mãi" allow-clear v-model:value="promotions.name"
                                :class="{ 'input-danger': errors.name }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.name" class="text-danger">{{ errors.name[0] }}</small>
                        </div>
                    </div>

                    <!-- Hình ảnh -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.url_image }">Hình ảnh</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <input :class="{ 'input-danger': errors.url_image }" type="file" name="url_image"
                                @change="handleFileChange" accept="image/*" />
                            <div class="w-100"></div>
                            <small v-if="errors.url_image" class="text-danger">{{ errors.url_image[0] }}</small>
                        </div>
                    </div>

                    <!-- Mô tả -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span :class="{ 'text-danger': errors.description }">Mô tả</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-textarea placeholder="Mô tả khuyến mãi" :rows="4" allow-clear
                                v-model:value="promotions.description"
                                :class="{ 'input-danger': errors.description }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.description" class="text-danger">{{ errors.description[0] }}</small>
                        </div>
                    </div>

                    <!-- Loại giảm giá -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.discount_type }">Loại giảm giá</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-select v-model:value="promotions.discount_type" placeholder="Chọn loại giảm giá"
                                style="width: 100%;" :class="{ 'select-danger': errors.discount_type }">
                                <a-select-option value="percentage">Phần trăm (%)</a-select-option>
                                <a-select-option value="fixed_amount">Số tiền cố định (VNĐ)</a-select-option>
                                <a-select-option value="free_shipping">Miễn phí vận chuyển</a-select-option>
                            </a-select>
                            <div class=" w-100"></div>
                            <small v-if="errors.discount_type" class="text-danger">{{ errors.discount_type[0] }}</small>
                        </div>
                    </div>

                    <!-- Giá trị giảm -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.discount_value }">Giá trị giảm</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input-number placeholder="Giá trị giảm" style="width: 100%;" :min="0"
                                v-model:value="promotions.discount_value"
                                :class="{ 'input-danger': errors.discount_value }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.discount_value" class="text-danger">{{ errors.discount_value[0]
                            }}</small>
                        </div>
                    </div>

                    <!-- Giá trị đơn hàng tối thiểu -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span :class="{ 'text-danger': errors.min_order_value }">Đơn hàng tối thiểu</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input-number placeholder="Giá trị đơn hàng tối thiểu" style="width: 100%;" :min="0"
                                v-model:value="promotions.min_order_value"
                                :class="{ 'input-danger': errors.min_order_value }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.min_order_value" class="text-danger">{{ errors.min_order_value[0]
                            }}</small>
                        </div>
                    </div>

                    <!-- Giới hạn số lượng sử dụng -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span :class="{ 'text-danger': errors.usage_limit }">Giới hạn sử dụng</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-input-number placeholder="Số lượng sử dụng tối đa" style="width: 100%;"
                                v-model:value="promotions.usage_limit"
                                :class="{ 'input-danger': errors.usage_limit }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.usage_limit" class="text-danger">{{ errors.usage_limit[0] }}</small>
                            <small class="text-muted d-block">Để trống nếu không giới hạn</small>
                        </div>
                    </div>

                    <!-- Thời gian hiệu lực -->
                    <div class="row mb-3">
                        <div class="col-12 col-sm-3 text-start text-sm-end">
                            <label for="">
                                <span class="text-danger me-1">*</span>
                                <span :class="{ 'text-danger': errors.start_date || errors.end_date }">Thời gian hiệu
                                    lực</span>
                            </label>
                        </div>
                        <div class="col-12 col-sm-5">
                            <a-range-picker v-model:value="dateRange" format="DD/MM/YYYY"
                                :placeholder="['Ngày bắt đầu', 'Ngày kết thúc']" style="width: 100%;"
                                :class="{ 'input-danger': errors.start_date || errors.end_date }" />
                            <div class=" w-100"></div>
                            <small v-if="errors.start_date" class="text-danger d-block">{{ errors.start_date[0]
                                }}</small>
                            <small v-if="errors.end_date" class="text-danger d-block">{{ errors.end_date[0] }}</small>
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
                            <a-select v-model:value="promotions.status" placeholder="Chọn tình trạng"
                                style="width: 100%;" :class="{ 'select-danger': errors.status }">
                                <a-select-option :value="1">Hoạt động</a-select-option>
                                <a-select-option :value="0">Ngừng hoạt động</a-select-option>
                            </a-select>
                            <div class=" w-100"></div>
                            <small v-if="errors.status" class="text-danger">{{ errors.status[0] }}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-grid mx-auto d-sm-flex justify-content-sm-end">
                    <router-link :to="{ name: 'admin-promotions' }">
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