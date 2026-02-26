<template>
  <div class="login-container">
    <div class="login-bg">
      <div class="login-bg-shape login-bg-shape-1" />
      <div class="login-bg-shape login-bg-shape-2" />
      <div class="login-bg-shape login-bg-shape-3" />
    </div>
    <div class="login-layout">
      <!-- 左侧介绍区域 -->
      <div class="login-left">
        <div class="login-intro">
          <h1 class="intro-title">{{ appTitle }}</h1>
          <p class="intro-text">
            一个用于订阅和管理微信公众号内容的工具，提供 RSS 订阅功能
          </p>
          <div class="login-features">
            <div class="feature-item">
              <span class="feature-icon"><icon-check-circle /></span>
              <span>公众号内容抓取和解析</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon"><icon-check-circle /></span>
              <span>RSS 订阅生成</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon"><icon-check-circle /></span>
              <span>定时自动更新内容</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon"><icon-check-circle /></span>
              <span>公众号监测、消息通知、WebHook 调用</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录区域 -->
      <div class="login-right">
        <div class="login-card-wrap">
          <a-card class="login-card" :bordered="false">
            <a-form :model="form" @submit="handleSubmit">
              <a-form-item field="username" label="帐号">
                <a-input v-model="form.username" placeholder="请输入帐号">
                  <template #prefix><icon-user /></template>
                </a-input>
              </a-form-item>

              <a-form-item field="password" label="密码">
                <a-input-password v-model="form.password" placeholder="请输入密码">
                  <template #prefix><icon-lock /></template>
                </a-input-password>
              </a-form-item>

              <a-form-item>
                <a-button type="primary" html-type="submit" :loading="loading" long>
                  登录
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { login } from '@/api/auth'

const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || '微信公众号订阅助手')

const router = useRouter()
const loading = ref(false)
const form = ref({
  username: '',
  password: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const formData = new URLSearchParams()
    formData.append('username', form.value.username)
    formData.append('password', form.value.password)

    const res = await login({
      username: form.value.username,
      password: form.value.password
    })

    if (res.access_token) {
      localStorage.setItem('token', res.access_token)
      localStorage.setItem('token_expire', String(Date.now() + res.expires_in * 1000))
      const redirect = router.currentRoute.value.query.redirect
      await router.push(redirect ? redirect.toString() : '/')
      Message.success('登录成功')
    } else {
      throw new Error('无效的响应格式')
    }
  } catch (error) {
    console.error('登录错误:', error)
    const errorMsg = error.response?.data?.detail ||
                    error.response?.data?.message ||
                    error.message ||
                    '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: var(--color-bg-base, #fafaf9);
}

/* 背景：柔和几何与层次，非紫蓝渐变 */
.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.login-bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}
.login-bg-shape-1 {
  width: 60vmax;
  height: 60vmax;
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 50%);
  top: -20%;
  left: -15%;
  animation: float 18s ease-in-out infinite;
}
.login-bg-shape-2 {
  width: 45vmax;
  height: 45vmax;
  background: linear-gradient(180deg, #99f6e4 0%, #5eead4 100%);
  bottom: -15%;
  right: -10%;
  animation: float 14s ease-in-out infinite reverse;
}
.login-bg-shape-3 {
  width: 30vmax;
  height: 30vmax;
  background: #ccfbf1;
  top: 50%;
  left: 40%;
  animation: float 12s ease-in-out infinite 2s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(3%, -4%) scale(1.02); }
  66% { transform: translate(-2%, 2%) scale(0.98); }
}

.login-layout {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 100vh;
  transition: all 0.3s ease;
}

.login-left {
  flex: 0 0 52%;
  padding: 80px 64px;
  color: #1c1917;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-intro {
  max-width: 520px;
}

.intro-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 20px;
  color: #1c1917;
  animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.65;
  margin-bottom: 32px;
  color: var(--color-text-secondary, #57534e);
  animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

.login-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #44403c;
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.feature-item:nth-child(1) { animation-delay: 0.25s; }
.feature-item:nth-child(2) { animation-delay: 0.35s; }
.feature-item:nth-child(3) { animation-delay: 0.45s; }
.feature-item:nth-child(4) { animation-delay: 0.55s; }

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color, #0d9488);
  font-size: 1.1rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-right {
  flex: 0 0 48%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-left: 1px solid rgba(231, 229, 228, 0.8);
}

.login-card-wrap {
  width: 100%;
  max-width: 380px;
  animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
}

.login-card {
  width: 100%;
  padding: 40px 36px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(28, 25, 23, 0.08), 0 1px 3px rgba(28, 25, 23, 0.06);
  border: 1px solid var(--color-border-light, #f5f5f4);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.login-card:hover {
  box-shadow: 0 12px 40px rgba(28, 25, 23, 0.1), 0 2px 8px rgba(28, 25, 23, 0.06);
  transform: translateY(-4px);
}

:deep(.arco-form-item-label) {
  color: #1c1917 !important;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 8px;
}
:deep(.arco-input-wrapper) {
  height: 48px;
  background: #fafaf9;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  color: #1c1917;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
:deep(.arco-input-wrapper:hover) {
  border-color: #d6d3d1;
  background: #fff;
}
:deep(.arco-input-wrapper:focus-within) {
  border-color: var(--primary-color, #0d9488);
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
  background: #fff;
}
:deep(.arco-input::placeholder) {
  color: #a8a29e;
}
:deep(.arco-btn-primary) {
  height: 48px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  background: var(--primary-color, #0d9488) !important;
  border-color: var(--primary-color, #0d9488) !important;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
:deep(.arco-btn-primary:hover) {
  background: var(--primary-hover, #0f766e) !important;
  border-color: var(--primary-hover, #0f766e) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
}
:deep(.arco-form-item-error .arco-input-wrapper) {
  border-color: var(--danger-color, #dc2626);
  background-color: #fef2f2;
}
:deep(.arco-form-message) {
  color: var(--danger-color, #dc2626);
  font-size: 0.85rem;
  margin-top: 6px;
}

@media (max-width: 992px) {
  .login-layout {
    flex-direction: column;
  }
  .login-left,
  .login-right {
    flex: 1;
    padding: 40px 32px;
  }
  .login-right {
    border-left: none;
    border-top: 1px solid rgba(231, 229, 228, 0.8);
  }
  .login-card-wrap {
    max-width: 400px;
  }
  .intro-title {
    font-size: 1.9rem;
  }
}

@media (max-width: 720px) {
  .login-left {
    padding: 32px 24px;
  }
  .login-intro .intro-title {
    font-size: 1.6rem !important;
    margin-bottom: 12px !important;
  }
  .login-intro .intro-text,
  .login-intro .login-features {
    display: none !important;
  }
  .login-right {
    width: 100%;
    flex: none;
    padding: 32px 24px;
  }
  .login-card {
    width: 100%;
    padding: 28px 24px;
  }
  .login-container .login-right :deep(.arco-btn-long) {
    width: 100%;
  }
}
</style>
