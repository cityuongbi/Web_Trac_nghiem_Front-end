<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/users';
import AuthModal from './AuthModal.vue';
import { message } from 'ant-design-vue';
import { UnorderedListOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia';

const router = useRouter();
const userStore = useUserStore();

const search = ref('');
const { user } = storeToRefs(userStore);

const onSearch = () =>
{
    if (search.value)
    {
        router.push(`/detail/${search.value}`);
        search.value = '';
    }
};

const isMobile = ref(false);
const isMenuOpen = ref(false);

const checkResponsive = () =>
{
    isMobile.value = window.innerWidth < 700;
};

onMounted(() =>
{
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
});

const toggleMenu = () =>
{
    isMenuOpen.value = !isMenuOpen.value;
};

const logout = async () =>
{
    await userStore.handleLogout();
    message.success('Đăng xuất thành công!', 3);
    router.push(`/`);
}
</script>


<template>
    <div>
        <a-layout-header style="width: 100%;">
            <div class="nav-container">
                <div class="left-content">
                    <RouterLink to="/">Tôi Yêu PTIT</RouterLink>
                    <a-input-search v-model:value="search" placeholder="Search..." style="width: 200px"
                        @search="onSearch" />
                </div>

                <div class="right-content">
                    <template v-if="!isMobile">
                        <div class="menu-buttons" v-if="!user || !user.role">
                            <AuthModal :isLogin="false" />
                            <AuthModal :isLogin="true" />
                        </div>

                        <div class="menu-buttons" v-else>
                            <a-button type="primary" @click.prevent="logout">
                                <LogoutOutlined />
                                Đăng xuất
                            </a-button>
                        </div>
                    </template>
                    <template v-else>
                        <a-dropdown :trigger="['click']">
                            <template #overlay>
                                <a-menu v-if="isMenuOpen">
                                    <div v-if="!user">
                                        <a-menu-item key="1">
                                            <AuthModal :isLogin="false" />
                                        </a-menu-item>
                                        <a-menu-item key="2">
                                            <AuthModal :isLogin="true" />
                                        </a-menu-item>
                                    </div>

                                    <div v-else>
                                        <a-menu-item key="1">
                                            <a-button type="primary" @click.prevent="logout">
                                                <LogoutOutlined />
                                                Đăng xuất
                                            </a-button>
                                        </a-menu-item>
                                    </div>
                                </a-menu>
                            </template>
                            <a-button type="primary" @click="toggleMenu">
                                <UnorderedListOutlined />
                            </a-button>
                        </a-dropdown>
                    </template>
                </div>
            </div>
        </a-layout-header>
    </div>
</template>

<style scoped>
.nav-container
{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
}

.left-content
{
    display: flex;
    align-items: center;
}

.left-content a
{
    margin-right: 10px;
}

.right-content
{
    display: flex;
    align-items: center;
}

.menu-buttons
{
    display: flex;
    align-items: center;
}
</style>