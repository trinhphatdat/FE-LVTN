<script setup>
import TheHeader from '@/components/client/TheHeader.vue';
import TheFooter from '@/components/client/TheFooter.vue';
import TheBreadcumbs from '@/components/TheBreadcumbs.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/use-user-store';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import TheLoadingSpinner from '@/components/TheLoadingSpinner.vue';
import { Modal } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const router = useRouter();
const userStore = useUserStore();
const { isLoggedIn, cart_items, isUserLoading } = storeToRefs(userStore);

// if (!isLoggedIn.value) {
//     message.error('Bạn cần đăng nhập để xem giỏ hàng');
//     router.push({ name: 'account-login' });
// }

//Begin: Tăng giảm số lượng sản phẩm
const increaseQuantity = (id) => {
    axios.patch(`${API_URL}/cartItems/increment/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            message.error('Tăng số lượng sản phẩm thất bại');
            console.log(error);
        });
}

const decreaseQuantity = (item) => {
    if (item.tempQuantity <= 1) {
        handleDeleteItem(item.id);
    }
    else {
        axios.patch(`${API_URL}/cartItems/decrement/${item.id}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then((response) => {
                message.success(response.data.message || 'Giảm số lượng sản phẩm thành công');
                window.location.reload();
            })
            .catch(error => {
                message.error('Giảm số lượng sản phẩm thất bại');
                console.log(error);
            });
    }
}
// End: Tăng giảm số lượng sản phẩm

// Begin: Xoá sản phẩm khỏi giỏ hàng
const handleDeleteItem = (id) => {
    Modal.confirm({
        title: 'Xác nhận xóa sản phẩm',
        content: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
        okText: 'Xoá',
        cancelText: 'Huỷ',
        onOk: () => {
            axios.delete(`${API_URL}/cartItems/${id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then((response) => {
                    message.success(response.data.message || 'Giảm số lượng sản phẩm thành công');
                    window.location.reload();
                })
                .catch(error => {
                    message.error('Giảm số lượng sản phẩm thất bại');
                    console.log(error);
                });
        },
        onCancel: () => { }
    });
}
// End: Xoá sản phẩm khỏi giỏ hàng

//Begin: Nhập số lượng sản phẩm theo ý muốn
// const handleUpdateQuantity = (id, quantity) => {
//     axios.put(`${API_URL}/cartItems/${id}`, { quantity }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     })
//         .then((response) => {
//             // message.success(response.data.message || 'Giảm số lượng sản phẩm thành công');
//             window.location.reload();
//             console.log(response);
//         })
//         .catch(error => {
//             // message.error('Giảm số lượng sản phẩm thất bại');
//             console.log(error);
//         });
// }
// End: Nhập số lượng sản phẩm theo ý muốn

const thanhtoan = () => {
    message.success('Chức năng thanh toán chưa được triển khai');
}

onMounted(() => {

});

</script>
<template>
    <TheLoadingSpinner v-if="isUserLoading" />
    <TheHeader />
    <TheBreadcumbs />
    <div class="layoutPage-cart">
        <div class="wrapper-cart-detail">
            <div class="container">
                <div class="heading-page">
                    <h1>Giỏ hàng của bạn</h1>
                    <p class="count-cart">Có <span>{{ cart_items.count || 0 }} sản phẩm</span> trong giỏ hàng</p>
                </div>
                <div class="row">
                    <!-- left -->
                    <div class="col-lg-8 col-12">
                        <div v-if="cart_items.data && cart_items.data.length > 0" class="cart-container">
                            <!-- <form action="" method="post"> -->
                            <table class="table table-bordered align-middle">
                                <tr v-for="item in cart_items.data" :key="item.id">
                                    <td class="image">
                                        <div class="product_image">
                                            <a-image v-if="item.product?.thumbnail"
                                                :src="item.product.thumbnail.startsWith('http') ? item.product.thumbnail : `${STORAGE_URL}` + item.product.thumbnail"
                                                alt="Ảnh sản phẩm" style="max-width: 100px;" />
                                        </div>
                                    </td>
                                    <td class="item">
                                        <h5>
                                            <router-link
                                                :to="{ name: 'product-detail', params: { id: item.product?.id } }">
                                                <a class="title" href="">
                                                    {{ item.product?.title || 'Sản phẩm' }}
                                                </a>
                                            </router-link>
                                        </h5>
                                        <span class="size">
                                            Kích cỡ: {{ item.size?.name || 'N/A' }}
                                        </span>

                                        <div>
                                            <span class="pri">
                                                Giá: {{ Number(item.price || 0).toLocaleString('vi-VN') }}₫
                                            </span>
                                        </div>
                                        <div class="cart-quantity-area float-start mb-2">
                                            <input type="button" value="-" class="qty-btn"
                                                @click="decreaseQuantity(item)">
                                            <input type="text" id="quantity" name="quantity" class="quantity"
                                                v-model="item.tempQuantity" min="1"
                                                @change="handleUpdateQuantity(item.id, item.tempQuantity)"
                                                @keyup.enter="handleUpdateQuantity(item.id, item.tempQuantity)">
                                            <input type="button" value="+" class="qty-btn"
                                                @click="increaseQuantity(item.id, item.tempQuantity)">
                                            <span class="quantity-text ms-2" style="line-height: 32px;">Số lượng: {{
                                                item.tempQuantity }}</span>
                                        </div>
                                        <div class="price float-start float-sm-end">
                                            <span style="font-weight: 500;">
                                                Thành tiền: {{ ((item.price || 0) * (item.quantity ||
                                                    0)).toLocaleString('vi-VN')
                                                }}₫
                                            </span>
                                        </div>
                                    </td>
                                    <td class="remove">

                                        <button type="button" class="btn" @click="handleDeleteItem(item.id)">
                                            <img src="@/assets/iconX.png" alt="Xóa">
                                        </button>
                                    </td>
                                </tr>
                            </table>
                            <!-- </form> -->
                        </div>
                        <div v-else>
                            <h4>Giỏ hàng của bạn đang trống</h4>
                        </div>
                    </div>
                    <!-- right -->
                    <div class="col-lg-4 col-12">
                        <div class="sideBox-order">
                            <div class="sideBox-order_title">
                                <h3>Thông tin đơn hàng</h3>
                            </div>
                            <div class="sideBox-order_total">
                                <p>Tổng tiền <span class="total-price">{{ (cart_items.total_money ||
                                    0).toLocaleString('vi-VN')
                                        }}₫</span></p>
                            </div>
                            <div class="sideBox-order_text">
                                <p>
                                    Phí vận chuyển sẽ được tính ở trang thanh toán. <br>
                                    Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.
                                </p>
                            </div>
                            <div class="sideBox-order_action">
                                <form @submit.prevent="thanhtoan">
                                    <input type="submit" class="btn btn-warning" value="THANH TOÁN">
                                </form>
                                <p class="link-continue">
                                    <router-link :to="{ name: 'collections-all-teeshirt' }">
                                        <a href="">
                                            <i class="fa-solid fa-reply"></i>
                                            Tiếp tục mua hàng
                                        </a>
                                    </router-link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <TheFooter />
</template>
<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}
</style>