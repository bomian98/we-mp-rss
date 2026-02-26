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
  height: 48px;
  line-height: 48px;
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
  box-sizing: border-box;
}

:deep(.arco-menu-horizontal) {
  border: none;
  background: transparent;
  height: 100%;
}
/* 仅允许横向滚动，禁用纵向滚动，避免顶部出现异常竖向滚动条 */
:deep(.arco-menu-horizontal .arco-menu-inner) {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
:deep(.arco-menu-horizontal .arco-menu-selected-label) {
  display: none;
}
:deep(.arco-menu-horizontal .arco-menu-item) {
  position: relative;
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin: 0 0 0 2px;
  padding: 0 var(--space-md);
  height: 48px;
  line-height: 48px;
  border-radius: 0;
  transition: color 0.2s ease, background 0.2s ease;
}
:deep(.arco-menu-horizontal .arco-menu-item:hover) {
  color: var(--primary-color);
  background: var(--primary-lighter);
}
/* 选中态：主色 + 底部 2px 下划线，无背景块，避免与底部分隔线重叠 */
:deep(.arco-menu-horizontal .arco-menu-item.arco-menu-selected) {
  color: var(--primary-color);
  font-weight: 600;
  background: transparent;
  border-left: none;
}
:deep(.arco-menu-horizontal .arco-menu-item.arco-menu-selected::after) {
  content: '';
  position: absolute;
  left: var(--space-md);
  right: var(--space-md);
  bottom: 0;
  height: 2px;
  background: var(--primary-color);
  border-radius: 2px 2px 0 0;
}
</style>