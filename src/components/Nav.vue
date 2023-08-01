<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/users';
import AuthModal from './AuthModal.vue';
import { message } from 'ant-design-vue';
import { UnorderedListOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia';

const router = useRouter();
const userStore = useUserStore();

const { user } = storeToRefs(userStore);

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

const manageQuestionView = () =>
{
    router.push(`/manage_question`);
}

const manageTestView = () =>
{
    router.push(`/manage_test`);
}

const manageTopicView = () =>
{
    router.push(`/manage_topic`);
}
</script>


<template>
    <div>
        <a-layout-header style="width: 100%;">
            <div class="nav-container">
                <div class="left-content">
                    <RouterLink to="/">Tôi Yêu PTIT</RouterLink>
                </div>

                <div class="right-content">
                    <template v-if="!isMobile">
                        <div class="menu-buttons" v-if="!user || !user.role">
                            <AuthModal :isLogin="false" />
                            <AuthModal :isLogin="true" />
                        </div>

                        <div class="menu-buttons" v-else>
                            <a-dropdown :trigger="['click']" placement="bottom" v-if="user.role == 'Admin'">
                                <template #overlay class="center-content">
                                    <a-menu>
                                        <a-menu-item key="1">
                                            <a-button @click="manageTopicView" type="primary" style="width: 150px;">Quản lý topic</a-button>
                                        </a-menu-item>

                                        <a-menu-item key="2">
                                            <a-button @click="manageTestView" type="primary" style="width: 150px;">Quản lý bài test</a-button>
                                        </a-menu-item>

                                        <a-menu-item key="3">
                                            <a-button @click="manageQuestionView" type="primary" style="width: 150px;">Quản lý câu hỏi</a-button>
                                        </a-menu-item>

                                        <a-menu-item key="4">
                                            <a-button @click="" type="primary" style="width: 150px;">Quản lý người dùng</a-button>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                                <a-button style="margin-right: 10px;" type="primary" @click="toggleMenu">
                                    Chức năng
                                    <DownOutlined />
                                </a-button>
                            </a-dropdown>

                            <a-button type="primary" @click.prevent="logout">
                                <LogoutOutlined />
                                Đăng xuất
                            </a-button>
                        </div>
                    </template>
                    <template v-else>
                        <a-dropdown :trigger="['click']">
                            <template #overlay style="width: 100%;">
                                <div v-if="!user">
                                    <a-menu class="center-content">
                                        <a-menu-item key="1">
                                            <AuthModal :isLogin="false" />
                                        </a-menu-item>
                                        <a-menu-item key="2">
                                            <AuthModal :isLogin="true" />
                                        </a-menu-item>
                                    </a-menu>
                                </div>

                                <div v-else>
                                    <a-menu class="center-content">
                                        <a-menu-item key="1" style="width: 100%;" v-if="user.role == 'Admin'">
                                            <a-dropdown :trigger="['click']" placement="bottom">
                                                <template #overlay>
                                                    <a-menu class="center-content">
                                                        <a-menu-item key="1">
                                                            <a-button @click="manageTopicView" type="primary" style="width: 150px;">Quản lý
                                                                topic</a-button>
                                                        </a-menu-item>

                                                        <a-menu-item key="2">
                                                            <a-button @click="manageTestView" type="primary" style="width: 150px;">Quản lý bài
                                                                test</a-button>
                                                        </a-menu-item>

                                                        <a-menu-item key="3">
                                                            <a-button @click="manageQuestionView" type="primary" style="width: 150px;">Quản lý câu hỏi
                                                            </a-button>
                                                        </a-menu-item>
                                                    </a-menu>
                                                </template>

                                                <a-button style="margin-right: 10px; width: 120px;" type="primary"
                                                    @click="toggleMenu">
                                                    Chức năng
                                                    <DownOutlined />
                                                </a-button>
                                            </a-dropdown>
                                        </a-menu-item>

                                        <a-menu-item key="2" style="width: 100%;">
                                            <a-button style="width: 120px;" type="primary" @click.prevent="logout">
                                                <LogoutOutlined />
                                                Đăng xuất
                                            </a-button>
                                        </a-menu-item>
                                    </a-menu>
                                </div>
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

.center-content
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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