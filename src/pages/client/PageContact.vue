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
                <div class="col-lg-6 col-12 mb-4">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9544104258835!2d106.67525717480439!3d10.73799718940847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f62a90e5dbd%3A0x674d5126513db295!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgU8OgaSBHw7Ju!5e0!3m2!1svi!2s!4v1761827557525!5m2!1svi!2s"
                        width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div class="col-lg-6 col-12">
                    <div class="page-wrapper">
                        <div class="heading-page">
                            <h1>Liên hệ</h1>
                        </div>
                        <div class="wrapbox-content-page">
                            <div class="content-page">
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