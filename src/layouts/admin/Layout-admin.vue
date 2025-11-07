<script setup>
import TheHeader from "@/components/admin/TheHeader.vue"
import TheMenu from "@/components/admin/TheMenu.vue"
// import TheBreadcumbs from "@/components/TheBreadcumbs.vue";
import { useUserStore } from "@/stores/use-user-store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();
const { isLoggedIn, user } = storeToRefs(userStore);

onMounted(() => {
    // if (!isLoggedIn.value || user.value.role !== 'admin') {
    //     router.push({ name: 'home' })
    // }
})
</script>
<template>
    <TheHeader />
    <div class="container-fluid mt-3 mb-3">
        <div class="row">
            <div class="col-lg-2 col-md-3 d-none d-sm-flex">
                <a-list bordered style="width: 100%; height: fit-content; position: sticky; top: 20px;">
                    <template #header>
                        <div>Bảng Điều Khiển</div>
                    </template>
                    <TheMenu />
                    <div class="mb-1"></div>
                </a-list>
            </div>
            <div class="col-lg-10 col-md-9 col-12 ">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style scoped></style>