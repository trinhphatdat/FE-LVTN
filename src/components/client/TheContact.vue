<script setup>
import { PhoneOutlined, } from '@ant-design/icons-vue';

</script>

<template>
    <a-float-button-group shape="circle" :style="{ right: '24px' }">
        <a-float-button tooltip="Nhắn tin cho chúng tôi!" type="primary"
            href="https://www.facebook.com/messages/t/122592471100099" target="_blank">
            <template #icon>
                <i class="fa-brands fa-facebook-messenger"></i>
            </template>
        </a-float-button>
        <a-float-button tooltip="Gọi ngay!" type="primary" href="tel:+84987070241">
            <template #icon>
                <PhoneOutlined />
            </template>
        </a-float-button>
        <a-back-top :visibility-height="1" :duration="100" />
    </a-float-button-group>
</template>

<style scoped></style>