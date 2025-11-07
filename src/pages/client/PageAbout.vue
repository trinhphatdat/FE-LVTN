<script setup>
import TheHeader from '@/components/client/TheHeader.vue'
import TheFooter from '@/components/client/TheFooter.vue';
import TheBreadcrumb from '@/components/TheBreadcumbs.vue';
import TheContact from '@/components/client/TheContact.vue';
</script>
<template>
    <TheHeader />
    <TheBreadcrumb />
    <!-- Begin: Content -->
    <div id="content">
        <div class="container">
            <div class="row">
                <!-- left -->
                <div class="col-lg-2 d-lg-block d-none mb-4">
                    <!-- <div class="sidebar">
                        <div class="group-menu">
                            <div class="sidebar-title">
                                <h2>DANH MỤC TRANG</h2>
                            </div>
                            <ul class="tree-menu">
                                <li>
                                    <router-link :to="{ name: '' }">Món chính</router-link>
                                </li>
                                <li>
                                    <router-link :to="{ name: '' }">Món phụ</router-link>

                                </li>
                                <li>
                                    <router-link :to="{ name: '' }">Nước uống</router-link>

                                </li>
                                <li>
                                    <router-link :to="{ name: '' }">Tất cả sản phẩm</router-link>

                                </li>
                            </ul>
                        </div>
                    </div> -->
                </div>
                <!-- right -->
                <div class="col-lg-9 col-12">
                    <div class="page-wrapper">
                        <div class="heading-page">
                            <h1>Giới thiệu</h1>
                        </div>
                        <div class="wrapbox-content-page">
                            <div class="content-page">
                                <p>Chào mừng bạn đến với <strong>shop của chúng tôi</strong>, điểm đến lý tưởng cho
                                    những ai yêu
                                    thích sự đơn giản, thoải mái và cá tính của những chiếc áo thun.</p>
                                <p>Chúng tôi tin rằng áo thun không chỉ là một trang phục thường ngày, mà còn là một
                                    cách để bạn thể hiện phong cách và con người mình. Vì vậy, chúng tôi ra đời với sứ
                                    mệnh mang đến những sản phẩm áo thun chất lượng cao, thiết kế đa dạng và phù hợp với
                                    mọi người.</p>

                                <h2>Câu chuyện của chúng tôi</h2>
                                <p><strong>shop của chúng tôi</strong> được thành lập từ niềm đam mê với thời trang tối
                                    giản và
                                    mong muốn tạo ra một không gian mua sắm nơi mọi khách hàng đều có thể tìm thấy chiếc
                                    áo thun hoàn hảo cho mình. Dù bạn là nam, nữ, hay yêu thích phong cách unisex, chúng
                                    tôi đều có những lựa chọn tuyệt vời dành cho bạn.</p>

                                <h2>Sản phẩm của chúng tôi</h2>
                                <p>Chất lượng là ưu tiên hàng đầu tại <strong>shop của chúng tôi</strong>. Mỗi chiếc áo
                                    thun đều
                                    được chúng tôi chăm chút từ khâu chọn vải, cắt may cho đến in ấn:</p>
                                <ul>
                                    <li><strong>Chất liệu:</strong> Chúng tôi sử dụng vải cotton 100% cao cấp, đảm bảo
                                        sự mềm mại, thoáng mát và thấm hút mồ hôi tốt, mang lại cảm giác thoải mái suốt
                                        cả ngày dài.</li>
                                    <li><strong>Thiết kế:</strong> Các mẫu thiết kế của chúng tôi đa dạng từ phong cách
                                        tối giản, hiện đại đến những họa tiết độc đáo, sáng tạo, giúp bạn tự tin thể
                                        hiện cá tính riêng.</li>
                                    <li><strong>Form dáng:</strong> Áo được thiết kế với form dáng chuẩn, phù hợp với
                                        vóc dáng người Việt Nam, có đủ các dòng sản phẩm cho nam, nữ và unisex.</li>
                                </ul>

                                <h2>Cam kết của chúng tôi</h2>
                                <p>Sự hài lòng của khách hàng là động lực lớn nhất của chúng tôi. Chúng tôi cam kết mang
                                    đến trải nghiệm mua sắm trực tuyến tuyệt vời với dịch vụ chăm sóc khách hàng tận tâm
                                    và chính sách đổi trả linh hoạt.</p>
                                <p>Cảm ơn bạn đã ghé thăm và lựa chọn <strong>shop của chúng tôi</strong>. Hãy cùng
                                    chúng tôi
                                    khám phá bộ sưu tập và tìm cho mình những chiếc áo thun ưng ý nhất nhé!</p>

                                <ul>
                                    <li>
                                        <p>Địa chỉ chúng tôi</p>
                                        <p><strong>Địa chỉ cũ: 180 Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí
                                                Minh</strong></p>
                                        <p><strong>Địa chỉ mới: 180 Cao Lỗ, Phường Chánh Hưng, Thành phố Hồ Chí
                                                Minh</strong></p>
                                    </li>
                                    <li>
                                        <p>Email chúng tôi</p>
                                        <p><strong>dattrinh1922@gmail.com</strong></p>
                                    </li>
                                    <li>
                                        <p>Điện thoại</p>
                                        <p><strong>0987.070.241</strong></p>
                                    </li>
                                    <li>
                                        <p>Thời gian làm việc</p>
                                        <p><strong>Từ 6:00 đến 21:30 hằng ngày</strong></p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- End: Content -->
    <TheContact />
    <TheFooter />
</template>

<style scoped>
#content {
    padding: 80px 0 0;
}

.heading-page h1 {
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 30px;
}

#content p {
    margin-bottom: 10px;
    line-height: 24px;
}

#content h2 {
    font-size: 20px;
    line-height: 1.2;
    font-family: "Quicksand", sans-serif;
}

.page-wrapper ul {
    list-style-type: initial;
    padding-left: 40px;
}

.tree-menu>li>a {
    color: #333333;
    font-weight: 500;
    font-size: 14px;
    line-height: 28px;
    letter-spacing: 1px;
}

.sidebar .group-menu {
    margin: 0 0 30px;
    position: relative;
    padding: 20px;
    border: 1px solid #e3e5ec;
}

.sidebar .sidebar-title h2 {
    font-size: 18px;
    text-transform: uppercase;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #000;
    text-align: center;
}
</style>