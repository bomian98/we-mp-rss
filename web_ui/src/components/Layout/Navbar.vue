<template>
  <a-layout-header class="navbar-header">
    <a-menu
      mode="horizontal"
      :selected-keys="selectedKeys"
      @menu-item-click="handleMenuClick"
    >
      <a-menu-item key="/">
        <template #icon>
          <icon-home />
        </template>
        订阅管理
      </a-menu-item>
      <a-menu-item key="/export/records">
        <template #icon>
          <icon-export />
        </template>
        导出记录
      </a-menu-item>
      <a-menu-item key="/tags">
        <template #icon>
          <icon-tag />
        </template>
        标签管理
      </a-menu-item>
      <a-menu-item key="/message-tasks">
        <template #icon>
          <icon-notification />
        </template>
        消息任务
      </a-menu-item>
      <a-menu-item key="/configs">
        <template #icon>
          <icon-settings />
        </template>
        配置信息
      </a-menu-item>
      <a-menu-item key="/sys-info">
        <template #icon>
          <icon-info-circle />
        </template>
        系统信息
      </a-menu-item>
      <a-menu-item key="/access-keys">
        <template #icon>
          <icon-key />
        </template>
        Access Key
      </a-menu-item>
       <!-- <a-menu-item key="/reader">
        <template #icon>
          <icon-read />
            阅读器
        </template>
      </a-menu-item> -->
    </a-menu>
  </a-layout-header>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TextIcon from '@/components/TextIcon.vue'
import { translatePage, setCurrentLanguage } from '@/utils/translate';

const router = useRouter()
const route = useRoute()
const selectedKeys = ref<string[]>(['/'])

watchEffect(() => {
  selectedKeys.value = [route.path]
  // translatePage()
})

const handleMenuClick = (key: string) => {
  router.push(key)
}
</script>

<style scoped>
/* 与顶部 header 统一：白底、同内边距，作为「第二行导航」 */
.navbar-header {
  padding: 0 var(--space-xl);
  height: 56px;
  line-height: 56px;
  background: linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-layer) 100%);
  border-bottom: 1px solid var(--color-border-light);
  box-sizing: border-box;
}

:deep(.arco-menu-horizontal) {
  border: none;
  background: transparent;
  height: 100%;
  display: flex;
  align-items: center;
}
/* 仅允许横向滚动，禁用纵向滚动，避免顶部出现异常竖向滚动条 */
:deep(.arco-menu-horizontal .arco-menu-inner) {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  gap: 6px;
  /* 隐藏滚动条（视觉干净） */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
:deep(.arco-menu-horizontal .arco-menu-inner::-webkit-scrollbar) {
  display: none;
}
:deep(.arco-menu-horizontal .arco-menu-selected-label) {
  display: none;
}
:deep(.arco-menu-horizontal .arco-menu-item) {
  position: relative;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
  padding: 0 14px;
  height: 36px;
  line-height: 36px;
  border-radius: 999px;
  transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
:deep(.arco-menu-horizontal .arco-menu-item:hover) {
  color: var(--primary-hover);
  background: var(--primary-lighter);
}
/* 选中态：轻背景 + 轻阴影，提升产品感 */
:deep(.arco-menu-horizontal .arco-menu-item.arco-menu-selected) {
  color: var(--primary-color);
  font-weight: 600;
  background: var(--color-bg-brand-soft);
}
:deep(.arco-menu-horizontal .arco-menu-item.arco-menu-selected::after) {
  display: none;
}

/* ========== 移动端响应式 ========== */

/* 平板及以下（≤ 768px）：减少水平内边距 */
@media screen and (max-width: 768px) {
  .navbar-header {
    padding: 0 var(--space-sm);
    height: 48px;
    line-height: 48px;
  }

  :deep(.arco-menu-horizontal .arco-menu-inner) {
    gap: 2px;
  }

  :deep(.arco-menu-horizontal .arco-menu-item) {
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    font-size: 0.813rem;
  }
}

/* 手机（≤ 480px）：隐藏图标，只保留文字，横向滚动 */
@media screen and (max-width: 480px) {
  .navbar-header {
    padding: 0 var(--space-xs);
    height: 44px;
    line-height: 44px;
  }

  :deep(.arco-menu-horizontal .arco-menu-inner) {
    gap: 2px;
    flex-wrap: nowrap;
  }

  :deep(.arco-menu-horizontal .arco-menu-item) {
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    font-size: 0.8rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* 隐藏图标，只保留文字 */
  :deep(.arco-menu-horizontal .arco-menu-item .arco-menu-item-icon) {
    display: none;
  }
}
</style>