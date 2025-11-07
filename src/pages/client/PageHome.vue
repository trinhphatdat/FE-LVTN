<script setup>
import TheHeader from '@/components/client/TheHeader.vue';
import TheFooter from '@/components/client/TheFooter.vue';
import TheContact from '@/components/client/TheContact.vue';
import { ref } from 'vue';

// Import banner images
import banner1 from '@/assets/img/img-slideshow/banner1.png';
import banner2 from '@/assets/img/img-slideshow/banner2.png';
import banner3 from '@/assets/img/img-slideshow/banner3.png';

// Banner data
const banners = ref([
    {
        id: 1,
        image: banner1,
    },
    {
        id: 2,
        image: banner2,
    },
    {
        id: 3,
        image: banner3,
    }
]);

// Sample data cho áo thun nam
const bestSellerProducts = ref([
    {
        id: 1,
        title: 'Sản phẩm mẫu',
        price: 249000,
        thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
    },
    {
        id: 2,
        title: 'Sản phẩm mẫu',
        price: 699000,
        thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
    },
    {
        id: 3,
        title: 'Sản phẩm mẫu',
        price: 679000,
        thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
    },
    {
        id: 4,
        title: 'Sản phẩm mẫu',
        price: 529000,
        oldPrice: 649000,
        discount: '-18%',
        thumbnail: 'https://cdn.hstatic.net/products/1000184601/men_trang__2__0ebd195a57ca4f2b9f172b96e42064fc_master.jpg',
    }
]);

</script>
<template>
    <TheHeader />
    <div style="padding-top: 72px;"></div>
    <!-- Begin: Banner Carousel -->
    <a-carousel autoplay :dots="true" effect="fade">
        <div v-for="banner in banners" :key="banner.id" class="carousel-slide">
            <router-link :to="{ name: 'collections-all-teeshirt' }">
                <img :src="banner.image" :alt="`Banner ${banner.id}`" class="banner-image" />
            </router-link>
        </div>
    </a-carousel>
    <!-- End: Banner Carousel -->

    <div class="pt-5"></div>
    <!-- Begin: Best Seller Section -->
    <div class="section-best-seller py-5">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="section-title mb-0">ÁO THUN NAM</h3>
                <router-link :to="{ name: 'collections-male-teeshirt' }" class="view-all-link">
                    XEM TẤT CẢ <i class="fa-solid fa-arrow-right"></i>
                </router-link>
            </div>

            <div class="row g-4">
                <div v-for="product in bestSellerProducts" :key="product.id" class="col-lg-3 col-md-6 col-12">
                    <div class="product-card">
                        <div class="product-image-wrapper position-relative">
                            <span v-if="product.discount" class="badge-discount">{{ product.discount }}</span>
                            <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
                                <img v-if="product.thumbnail" :src="product.thumbnail" :alt="product.title"
                                    class="product-image">
                            </router-link>
                            <span v-if="!product.thumbnail" class="placeholder-image">No Image</span>
                        </div>

                        <h6 class="product-name">{{ product.title }}</h6>

                        <div class="product-price">
                            <span class="current-price">{{ product.price.toLocaleString('vi-VN') }} VNĐ</span>
                            <span v-if="product.oldPrice" class="old-price">{{ product.oldPrice.toLocaleString('vi-VN')
                                }} VNĐ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- End: Best Seller Section -->

    <!-- Begin: Section support -->
    <div class="section-support">
        <div class="container">
            <h2 class="section-title">Tại sao chọn <span>Shop của chúng tôi?</span></h2>
            <div class="row g-3">
                <div class="col-lg-4 col-md-4 col-12">
                    <div class="support-container text-center">
                        <div class="support-icon mb-2">
                            <router-link :to="{ name: '' }">
                                <img src="@/assets/img/img-support/item_support_1.png" alt="">
                            </router-link>
                        </div>
                        <h6>Giao hàng nhanh chóng</h6>
                        <p>Giao hàng từ 1-2 ngày kể từ lúc đặt hàng</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-12">
                    <div class="support-container text-center">
                        <div class="support-icon mb-2">
                            <router-link :to="{ name: '' }">
                                <img src="@/assets/img/img-support/item_support_2.png" alt="">
                            </router-link>
                        </div>
                        <h6>Sản phẩm chất lượng</h6>
                        <p>Sản phẩm uy tín, chất lượng</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-12">
                    <div class="support-container text-center">
                        <div class="support-icon mb-2">
                            <router-link :to="{ name: '' }">
                                <img src="@/assets/img/img-support/item_support_3.png" alt="">
                            </router-link>
                        </div>
                        <h6>Hỗ trợ nhiệt tình</h6>
                        <p>Hỗ trợ và lắng nghe ý kiến khách hàng</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- End: Section support -->

    <div class="mt-3"></div>
    <TheContact />
    <TheFooter />
</template>

<style scoped>
/* Banner Carousel Styles */
.carousel-slide {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
}

.banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Tùy chỉnh dots của carousel */
:deep(.slick-dots) {
    bottom: 20px;
}

:deep(.slick-dots li button) {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
}

:deep(.slick-dots li.slick-active button) {
    background: white;
    width: 14px;
    height: 14px;
}

/* Tùy chỉnh mũi tên điều hướng */
:deep(.slick-prev),
:deep(.slick-next) {
    width: 50px;
    height: 50px;
    z-index: 2;
}

:deep(.slick-prev:before),
:deep(.slick-next:before) {
    font-size: 50px;
    opacity: 0.8;
}

:deep(.slick-prev:hover:before),
:deep(.slick-next:hover:before) {
    opacity: 1;
}

@media (max-width: 768px) {
    .carousel-slide {
        height: 300px;
    }

    :deep(.slick-prev),
    :deep(.slick-next) {
        width: 35px;
        height: 35px;
    }

    :deep(.slick-prev:before),
    :deep(.slick-next:before) {
        font-size: 35px;
    }
}

.section-best-seller {
    background-color: #f8f9fa;
}

.section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #333;
}

.view-all-link {
    color: #333;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    transition: color 0.3s;
}

.view-all-link:hover {
    color: #007bff;
}

/* Thêm CSS cho router-link xem tất cả */
a[href] {
    color: #333;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

a[href]:hover {
    color: #007bff;
}

a[href] i {
    margin-left: 5px;
    transition: transform 0.3s ease;
}

.product-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    padding: 15px;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.product-image-wrapper {
    width: 100%;
    height: 350px;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 15px;
    background: #e9ecef;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.placeholder-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
}

.badge-discount {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #dc3545;
    color: white;
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.product-name {
    font-size: 0.95rem;
    color: #333;
    margin-bottom: 10px;
    min-height: 45px;
    line-height: 1.4;
}

.product-price {
    display: flex;
    align-items: center;
    gap: 10px;
}

.current-price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
}

.old-price {
    font-size: 0.9rem;
    color: #999;
    text-decoration: line-through;
}
</style>