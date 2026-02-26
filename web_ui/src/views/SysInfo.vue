<template>
  <div class="page-view">
    <a-card :bordered="false" class="sys-info-card" title="系统资源">
       <SystemResources :resources="sysInfo.resources" />
    </a-card>
    <a-card :bordered="false" class="sys-info-card" title="文章统计">
      <a-descriptions class="sys-descriptions" bordered :column="{ xs: 1, sm: 1, md: 1, lg: 2 }">
        <a-descriptions-item label="公众号总数">
          <template #label><span class="label-with-icon"><icon-desktop /> 公众号总数</span></template>
          {{ sysInfo.article?.mp_all_count || 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="文章总数">
          <template #label><span class="label-with-icon"><icon-desktop /> 文章总数</span></template>
          {{ sysInfo.article?.all_count || 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="无正文数量">
          <template #label><span class="label-with-icon"><icon-desktop /> 无正文数量</span></template>
          {{ sysInfo.article?.no_content_count || 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="有正文数量">
          <template #label><span class="label-with-icon"><icon-desktop /> 有正文数量</span></template>
          {{ sysInfo.article?.has_content_count || 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="已删除">
          <template #label><span class="label-with-icon"><icon-desktop /> 已删除</span></template>
          {{ sysInfo.article?.wrong_count || 0 }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" class="sys-info-card" title="系统信息">
      <a-descriptions class="sys-descriptions" bordered :column="{ xs: 1, sm: 1, md: 1, lg: 2 }">
        <a-descriptions-item label="操作系统">
          <template #label><span class="label-with-icon"><icon-desktop /> 操作系统</span></template>
          {{ sysInfo.os.name }}
        </a-descriptions-item>
        <a-descriptions-item label="Docker版本">
          <template #label><span class="label-with-icon"><icon-desktop /> Docker版本</span></template>
          {{ sysInfo.os.docker_version }}
        </a-descriptions-item>
        <a-descriptions-item label="系统版本">
          <template #label><span class="label-with-icon"><icon-code /> 系统版本</span></template>
          {{ sysInfo.os.version }} ({{ sysInfo.os.release }})
        </a-descriptions-item>
        <a-descriptions-item label="Python版本">
          <template #label><span class="label-with-icon"><icon-code /> Python版本</span></template>
          {{ sysInfo.python_version }}
        </a-descriptions-item>
        <a-descriptions-item label="运行时间">
          <template #label><span class="label-with-icon"><icon-clock-circle /> 运行时间</span></template>
          {{ formatUptime(sysInfo.uptime) }}
        </a-descriptions-item>
        <a-descriptions-item label="系统架构">
          <template #label><span class="label-with-icon"><icon-branch /> 系统架构</span></template>
          {{ sysInfo.system.node }} / {{ sysInfo.system.machine }} ({{
            sysInfo.system.processor
          }})
        </a-descriptions-item>
        <a-descriptions-item label="TOKEN">
          <template #label><span class="label-with-icon"><icon-safe /> TOKEN</span></template>
          {{ sysInfo.wx.token }}
        </a-descriptions-item>
        <a-descriptions-item label="过期时间">
          <template #label><span class="label-with-icon"><icon-safe /> 过期时间</span></template>
          {{ !sysInfo.wx.login? '未登录': sysInfo.wx.expiry_time }}
        </a-descriptions-item>
        <a-descriptions-item label="API版本">
          <template #label><span class="label-with-icon"><icon-safe /> API版本</span></template>
          {{ sysInfo.api_version }}
        </a-descriptions-item>
        <a-descriptions-item label="队列状态">
          <template #label><span class="label-with-icon"><icon-safe /> 队列状态</span></template>
          {{ sysInfo.queue.is_running || false }}
        </a-descriptions-item>
        <a-descriptions-item label="队列数量">
          <template #label><span class="label-with-icon"><icon-safe /> 挂起队列数量</span></template>
          {{ sysInfo.queue.pending_tasks || 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="核心版本">
          <template #label><span class="label-with-icon"><icon-apps /> 核心版本</span></template>
          {{ sysInfo.core_version }}
        </a-descriptions-item>
        <a-descriptions-item label="最新版本">
          <template #label><span class="label-with-icon"><icon-cloud-download /> 最新版本</span></template>
          {{ sysInfo.latest_version }}
          <!-- 添加点击事件 -->
          <a-button
            v-if="sysInfo.need_update"
            type="text"
            size="small"
            style="margin-left: 8px"
            @click="openUpdateLink"
            >立即更新</a-button
          >
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSysInfo } from "@/api/sysInfo";
import type { SysInfo } from "@/api/sysInfo";
import SystemResources from "@/components/SystemResources.vue";

const sysInfo = ref<SysInfo>({
  os: {
    name: "",
    version: "",
    release: "",
  },
  python_version: "",
  uptime: 0,
  system: {
    node: "",
    machine: "",
    processor: "",
  },
  api_version: "/api/v1/wx",
  core_version: "",
  latest_version: "",
  need_update: true,
  wx: {
    token: "",
    expiry_time: "",
  },
  queue: {
    is_running: false,
    pending_tasks: 0,
  },
});

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}天 ${hours}小时 ${minutes}分钟`;
};

// 定义打开链接的函数
const openUpdateLink = () => {
  window.open("https://github.com/rachelos/we-mp-rss", "_blank");
};

onMounted(async () => {
  sysInfo.value = await getSysInfo()
});
</script>

<style scoped>
.sys-info-container {
  margin-top: 16px;
}

.sys-info-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  background: var(--color-bg-2);
  height: 100%;
}

.sys-info-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
  transform: translateY(-2px);
}

.sys-info-card :deep(.arco-card-header) {
  border-bottom: none;
}

.label-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.sys-info-card :deep(.arco-descriptions-item-value-block),
.sys-info-card :deep(.arco-descriptions-item-value-inline) {
  color: var(--color-text-1);
}

.sys-descriptions :deep(.arco-descriptions-item-label-block) {
  width: 180px;
  min-width: 180px;
  white-space: nowrap;
}

.sys-descriptions :deep(.arco-descriptions-item-value-block) {
  word-break: break-word;
}

.sys-info-card :deep(.arco-icon) {
  font-size: 16px;
}

@media (max-width: 768px) {
  .sys-descriptions :deep(.arco-descriptions-item-label-block) {
    width: 140px;
    min-width: 140px;
  }
}
</style>