<template>
  <a-layout class="app-container">
    <!-- 头部 -->
    <a-layout-header class="app-header" v-if="route.path !== '/login'">
      <div class="header-left">
        <div class="logo">
          <img :src="logo" alt="avatar" :width="60" style="margin-right:1rem;">
          <router-link to="/">{{ appTitle }}</router-link>
          <a-tooltip v-if="hasLogined" :content="!haswxLogined ? '未授权，请扫码登录' : '点我扫码授权'" position="bottom">
            <icon-scan @click="showAuthQrcode()" class="header-scan-icon" :class="{ 'header-scan-icon--warn': !haswxLogined }"/>
          </a-tooltip>
        </div>
        <a-space>
            <a-select :defaultValue="currentLanguage" v-model:value="currentLanguage" @change="handleLanguageChange" >
              <a-option value="">禁用</a-option>
              <a-option value="chinese_simplified">简体中文</a-option>
              <a-option value="english">English</a-option>
            </a-select>
        </a-space>
      </div>
      <div class="header-right" v-if="hasLogined">
        <a-link href="/views/home" target="_blank" style="margin-right: 20px;">Views</a-link>
        <a-link href="/api/docs" target="_blank" style="margin-right: 20px;">Docs</a-link>
        <a-link href="https://github.com/bomian98/we-mp-rss" target="_blank" style="margin-right: 20px;">GitHub</a-link>
        <a-dropdown position="br" trigger="click">
          <div class="user-info">
            <a-avatar :size="36">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="avatar">
              <icon-user v-else />
            </a-avatar>
            <span class="username">{{ userInfo.username }}</span>
          </div>
          <template #content>
            <a-doption @click="goToEditUser">
              <template #icon><icon-user /></template>
              个人中心
            </a-doption>
            <a-doption @click="goToChangePassword">
              <template #icon><icon-lock /></template>
              修改密码
            </a-doption>
            <a-doption @click="showAuthQrcode">
              <template #icon><icon-scan /></template>
              扫码授权
            </a-doption>
            <a-doption @click="handleLogout">
              <template #icon><icon-user /></template>
              退出登录
            </a-doption>
          </template>
        </a-dropdown>
        <WechatAuthQrcode ref="qrcodeRef" />
      </div>
    </a-layout-header>

    <a-layout>

      <!-- 主内容区 -->
      <a-layout>
        <a-layout-content class="app-content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, provide } from 'vue'
import {getSysInfo} from '@/api/sysInfo'
const SUPPORTED_LANGUAGES = ['', 'chinese_simplified', 'english'];
const savedLang = localStorage.getItem('language');
const initialLang = savedLang && SUPPORTED_LANGUAGES.includes(savedLang) ? savedLang : 'chinese_simplified';
if (savedLang && !SUPPORTED_LANGUAGES.includes(savedLang)) {
  localStorage.setItem('language', 'chinese_simplified');
}
const currentLanguage = ref(initialLang);


const handleLanguageChange = (language: string) => {
  setCurrentLanguage(language);
  currentLanguage.value = language;
};
import { 
  initBrowserNotification 
} from '@/utils/browserNotification'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { getCurrentUser } from '@/api/auth'
import { logout } from '@/api/auth'
import WechatAuthQrcode from '@/components/WechatAuthQrcode.vue'

const qrcodeRef = ref()
const showAuthQrcode = () => {
  qrcodeRef.value?.startAuth()
}
provide('showAuthQrcode', showAuthQrcode)
const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || '微信公众号订阅助手')
const logo = ref("/static/logo.svg")
const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const userInfo = ref({
  username: '',
  avatar: ''
})
const haswxLogined = ref(true)
const hasLogined = ref(false)
const isAuthenticated = computed(() => {
  hasLogined.value = !!localStorage.getItem('token')
  return hasLogined.value
})

const fetchUserInfo = async () => {
  try {
    const res = await getCurrentUser()
    userInfo.value = res
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

const fetchSysInfo = async () => {
  try {
    const res = await getSysInfo()
    haswxLogined.value = res?.wx?.login||false
  } catch (error) {
    console.error('获取系统信息失败', error)
  }
}

const handleCollapse = (val: boolean) => {
  collapsed.value = val
}

const handleMenuClick = (key: string) => {
  router.push({ name: key })
}

const goToEditUser = () => {
  router.push({ name: 'EditUser' })
}

const goToChangePassword = () => {
  router.push({ name: 'ChangePassword' })
}

const handleLogout = async () => {
  try {
    await logout()
    localStorage.removeItem('token')
    router.push('/login')
  } catch (error) {
    Message.error('退出登录失败')
  }
}

onMounted(() => {
 
  if (isAuthenticated.value) {
    fetchUserInfo()
  }
  initBrowserNotification()
  translatePage();
  fetchSysInfo();
})
import { translatePage, setCurrentLanguage } from '@/utils/translate';

watch(
  () => route.path,
  () => {
    hasLogined.value = !!localStorage.getItem('token')
    if (hasLogined.value) {
      fetchUserInfo()
    }
  }
)
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: var(--color-bg-base);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--space-xl);
  height: 56px;
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
}

.logo a {
  color: var(--color-text-primary, #1c1917);
  text-decoration: none;
  transition: color 0.2s ease;
}
.logo a:hover {
  color: var(--primary-color);
  text-decoration: none;
}

.logo svg {
  margin-right: 10px;
  font-size: 24px;
  color: var(--primary-color, #0d9488);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.2s ease;
}
.user-info:hover {
  background: var(--primary-lighter);
}

.username {
  margin-left: 10px;
  font-weight: 500;
  color: var(--color-text-primary, #1c1917);
}

.app-content {
  background: var(--color-bg-base);
  min-height: calc(100vh - 56px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.header-scan-icon {
  margin-left: 10px;
  cursor: pointer;
  color: var(--primary-color);
  transition: color 0.2s ease, transform 0.2s ease;
}
.header-scan-icon:hover {
  color: var(--primary-hover);
  transform: scale(1.05);
}
.header-scan-icon--warn {
  color: var(--danger-color);
}
.header-scan-icon--warn:hover {
  color: #b91c1c;
}

@media (max-width: 720px) {
  .app-header .header-right {
    display: none !important;
  }
}
</style>