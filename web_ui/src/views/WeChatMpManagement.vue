<template>
  <div class="wechat-mp-management">
    <a-card class="mp-card" title="公众号管理" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showAddModal" class="btn-add">
          添加公众号
        </a-button>
      </template>

      <a-progress
        v-if="isLoadingAll"
        :percent="loadProgress"
        :show-text="true"
        class="load-progress"
      />

      <a-table
        class="mp-table"
        :columns="columns"
        :data="mpList"
        :pagination="false"
        :loading="isLoadingAll"
        :scroll="{ y: 520 }"
      >
        <template #status="{ record }">
          <a-tag :color="record.status ? 'green' : 'red'" class="status-tag">
            {{ record.status ? '已启用' : '已禁用' }}
          </a-tag>
        </template>

        <template #action="{ record }">
          <a-space>
            <a-button size="mini" @click="editMp(record)" class="btn-edit">编辑</a-button>
            <a-button
              size="mini"
              status="danger"
              @click="deleteMp(record.mp_id)"
              class="btn-delete"
            >
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:visible="visible"
      :title="modalTitle"
      @ok="handleOk"
      @cancel="handleCancel"
      class="mp-modal"
    >
      <a-form :model="form">
        <a-form-item label="公众号ID" field="mp_id">
          <a-input v-model="form.mp_id" />
        </a-form-item>
        <a-form-item label="公众号名称" field="mp_name">
          <a-input v-model="form.mp_name" />
        </a-form-item>
        <a-form-item label="封面图" field="mp_cover">
          <a-upload
            action="/wx/mps/upload"
            :headers="headers"
            @success="handleUploadSuccess"
          />
        </a-form-item>
        <a-form-item label="简介" field="mp_intro">
          <a-textarea v-model="form.mp_intro" />
        </a-form-item>
        <a-form-item label="状态" field="status">
          <a-switch v-model="form.status" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { getSubscriptions, addSubscription, updateSubscription, deleteSubscription } from '@/api/subscription'
import { getToken } from '@/utils/auth'

const headers = { Authorization: `Bearer ${getToken()}` }

const columns = [
  { title: '公众号ID', dataIndex: 'mp_id' },
  { title: '名称', dataIndex: 'mp_name' },
  { title: '状态', slotName: 'status' },
  { title: '最后同步', dataIndex: 'sync_time' },
  { title: '操作', slotName: 'action' }
]

const mpList = ref<any[]>([])
const isLoadingAll = ref(false)
const loadProgress = ref(0)
const query = reactive({
  pageSize: 100
})

const visible = ref(false)
const modalTitle = ref('添加公众号')
const form = reactive({
  mp_id: '',
  mp_name: '',
  mp_cover: '',
  mp_intro: '',
  status: true
})

const sortByAlphabet = (list: any[]) => {
  return [...list].sort((a, b) => {
    const aName = (a?.mp_name || a?.name || '').toString().trim().toLowerCase()
    const bName = (b?.mp_name || b?.name || '').toString().trim().toLowerCase()
    if (aName !== bName) {
      return aName.localeCompare(bName, 'en', { sensitivity: 'base' })
    }
    const aId = (a?.mp_id || '').toString().trim().toLowerCase()
    const bId = (b?.mp_id || '').toString().trim().toLowerCase()
    return aId.localeCompare(bId, 'en', { sensitivity: 'base' })
  })
}

const loadData = async () => {
  if (isLoadingAll.value) return
  try {
    isLoadingAll.value = true
    loadProgress.value = 0

    const firstRes = await getSubscriptions({
      page: 0,
      pageSize: query.pageSize
    })

    if (firstRes.code !== 0) {
      throw new Error(firstRes.message || '获取公众号列表失败')
    }

    const firstPageList = firstRes?.data?.list || []
    const total = firstRes?.data?.total || 0
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize))
    const allList = [...firstPageList]

    loadProgress.value = Math.round((1 / totalPages) * 100)

    for (let page = 1; page < totalPages; page += 1) {
      const res = await getSubscriptions({
        page,
        pageSize: query.pageSize
      })

      if (res.code !== 0) {
        throw new Error(res.message || `第 ${page + 1} 页加载失败`)
      }

      allList.push(...(res?.data?.list || []))
      loadProgress.value = Math.round(((page + 1) / totalPages) * 100)
    }

    mpList.value = sortByAlphabet(allList)
    loadProgress.value = 100
  } catch (error) {
    console.error('获取公众号列表错误:', error)
    Message.error(error?.message || '获取公众号列表失败')
  } finally {
    isLoadingAll.value = false
  }
}

const showAddModal = () => {
  modalTitle.value = '添加公众号'
  Object.keys(form).forEach(key => {
    if (key === 'status') {
      form[key] = true
    } else {
      form[key] = ''
    }
  })
  visible.value = true
}

const editMp = (record) => {
  modalTitle.value = '编辑公众号'
  Object.assign(form, record)
  visible.value = true
}

const handleOk = async () => {
  if (modalTitle.value === '添加公众号') {
    await addSubscription(form)
  } else {
    await updateSubscription(form.mp_id, form)
  }
  visible.value = false
  loadData()
}

const deleteMp = async (id) => {
  await deleteSubscription(id)
  loadData()
}

const handleUploadSuccess = (file) => {
  form.mp_cover = file.response.url
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.wechat-mp-management {
  padding: var(--space-lg, 24px);
  max-width: 1400px;
  margin: 0 auto;
}

.mp-card {
  border-radius: var(--radius-lg, 14px);
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(28, 25, 23, 0.06));
  border: 1px solid var(--color-border-light, #f5f5f4);
  overflow: hidden;
}

.mp-card :deep(.arco-card-header) {
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border-light, #f5f5f4);
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text-primary, #1c1917);
}

.mp-card :deep(.arco-card-body) {
  padding: 24px;
}

.btn-add {
  font-weight: 500;
  border-radius: var(--radius-md, 10px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
}

.load-progress {
  margin-bottom: 16px;
}

.mp-table :deep(.arco-table-th) {
  font-weight: 600;
  color: var(--color-text-secondary, #57534e);
  background: var(--color-bg-base, #fafaf9);
}

.mp-table :deep(.arco-table-td) {
  color: var(--color-text-primary, #1c1917);
}

.mp-table :deep(.arco-table-tr:hover .arco-table-td) {
  background: var(--primary-lighter, #f0fdfa) !important;
}

.status-tag {
  font-weight: 500;
}

.btn-edit,
.btn-delete {
  border-radius: 6px;
  font-weight: 500;
  transition: transform 0.15s ease;
}
.btn-edit:hover,
.btn-delete:hover {
  transform: scale(1.02);
}
</style>
