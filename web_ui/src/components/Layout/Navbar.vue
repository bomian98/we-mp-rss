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
.navbar-header {
  padding: 0 16px;
  height: 48px;
  line-height: 48px;
  background: var(--color-bg-elevated, #fff);
  border-bottom: 1px solid var(--color-border-light, #f5f5f4);
}

:deep(.arco-menu-horizontal) {
  border-bottom: none;
  background: transparent;
}
/* 去掉 Arco 自带的蓝色选中指示条 (div.arco-menu-selected-label)，只保留绿色下划线 */
:deep(.arco-menu-horizontal .arco-menu-selected-label) {
  background: transparent !important;
}
:deep(.arco-menu-horizontal .arco-menu-item) {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--color-text-secondary, #57534e);
  transition: color 0.2s ease, background 0.2s ease;
}
:deep(.arco-menu-horizontal .arco-menu-item:hover) {
  color: var(--primary-color, #0d9488);
  background: var(--primary-lighter, #f0fdfa);
}
:deep(.arco-menu-horizontal .arco-menu-item.arco-menu-selected) {
  color: var(--primary-color, #0d9488);
  font-weight: 600;
  border-bottom: 2px solid var(--primary-color, #0d9488);
}
</style>