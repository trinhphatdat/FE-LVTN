<script setup></script>
<template>
    <div id="footer">
        <div class="main-footer">
            <div class="container">
                <div class="main-footer-container">
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-12 mb-4 mb-md-0">
                            <h4 class="footer-title">Giới thiệu</h4>
                            <div class="footer-content">
                                <p>
                                    Hộ kinh doanh áo thun <br>
                                    GPKD số 41W8073666 cấp ngày 10/07/2024 tại Sở Kế hoạch và Đầu tư Thành phố HCM <br>
                                    Shop phục vụ xuyên suốt từ 6:00 - 21:30 mỗi ngày.
                                </p>
                                <div class="logo-footer">
                                    <img src="../../assets/img/img-footer/logo_bct.png" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-2 col-12 mb-4 mb-md-0">
                            <h4 class="footer-title">Liên kết</h4>
                            <div class="footer-content">
                                <ul class="list-unstyled">
                                    <li>
                                        <router-link :to="{ name: 'search' }">
                                            Tìm kiếm sản phẩm
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link :to="{ name: 'about' }">
                                            Giới thiệu về shop
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link :to="{ name: 'contact' }">
                                            Liên hệ
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12 mb-4 mb-md-0">
                            <h4 class="footer-title">Thông tin liên hệ</h4>
                            <div class="footer-contact">
                                <ul class="list-unstyled">
                                    <li>
                                        <i class="fa-solid fa-location-dot"></i>
                                        <span>Địa chỉ cũ: 180 Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí
                                            Minh</span>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-location-dot"></i>
                                        <span>Địa chỉ mới: 180 Cao Lỗ, Phường Chánh Hưng, Thành phố Hồ Chí Minh</span>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-phone-volume"></i>
                                        <span>Điện thoại: 0987070241</span>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-paper-plane"></i>
                                        <span>dattrinh1922@gmail.com</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-3 col-12">
                            <h4 class="footer-title">Fanpage</h4>
                            <div class="footer-content">
                                <iframe
                                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FCoupleTX%2F&tabs=timeline&width=340&height=70&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                                    width="340" height="150" style="border:none;overflow:hidden" scrolling="no"
                                    frameborder="0" allowfullscreen="true"
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-footer text-center py-3">
            <p class="mb-0">
                Copyright © 2025
                <a href="#">Website bán áo thun</a>
                .
                <a href="#">Powered by Haravan</a>
            </p>
        </div>
    </div>
</template>
<style scoped></style>