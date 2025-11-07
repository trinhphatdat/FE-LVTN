<script setup>
import TheHeader from '@/components/client/TheHeader.vue';
import TheFooter from '@/components/client/TheFooter.vue';
import TheMenu from '@/components/client/TheMenu.vue';
import TheContact from '@/components/client/TheContact.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const title = computed(() => {
    if (route.name === 'collections-all-teeshirt') return 'Tất cả sản phẩm'
    if (route.name === 'collections-male-teeshirt') return 'Áo thun nam'
    if (route.name === 'collections-female-teeshirt') return 'Áo thun nữ'
    return ''
})
</script>
<template>
    <TheHeader />
    <div id="template-collection">
        <h1 class="text-center">
            {{ title }}
        </h1>
        <div class="container-fluid">
            <div class="row">
                <!-- left -->
                <div class="col-lg-3 col-md-4 col-12 mb-4 d-sm-flex">
                    <a-list bordered style="width: 100%; height: fit-content; position: sticky; top: 20px;">
                        <template #header>
                            <div>Danh mục</div>
                        </template>
                        <TheMenu />
                        <div class="mb-1"></div>
                    </a-list>
                </div>
                <!-- right -->
                <div class="col-lg-9 col-md-8 col-12">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
    <TheContact />
    <TheFooter />
</template>
<style scoped></style>