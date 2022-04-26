<template>
  <el-container class="ct-root" v-loading="loadingFlag">
    <el-header class="fit">
      <psr-el-toolbar>
        <router-link
            :to="{name:backRouteName}"
            custom
            v-slot="{navigate}"
        >
          <el-button type="text" @click="navigate">
            <template #icon>
              <el-icon class="pi pi-arrow-left"/>
            </template>
            返回
          </el-button>
        </router-link>
        <el-divider direction="vertical"/>
        <span>分组: {{ groupEntity.code }}</span>
        <el-divider direction="vertical"/>
        <el-button class="button" @click="initTableData">
          <template #icon>
            <el-icon class="pi pi-refresh"/>
          </template>
          刷新
        </el-button>
        <el-button class="button" @click="handleClearFilters">
          <template #icon>
            <el-icon class="pi pi-filter-slash"/>
          </template>
          重置
        </el-button>
        <el-button class="button" @click="handleSave">
          <template #icon>
            <el-icon class="pi pi-save"/>
          </template>
          保存
        </el-button>
      </psr-el-toolbar>
    </el-header>
    <el-main class="ct-main">
      <p-data-table
          ref="tableRef"
          class="table p-datatable-sm"
          responsiveLayout="scroll"
          :scrollable="true"
          scrollHeight="flex"
          scrollDirection="both"
          :resizableColumns="true"
          columnResizeMode="expand"
          :value="tableProps.data"
          dataKey="userId"
          v-model:filters="tableProps.filters"
          filterDisplay="row"
      >
        <template #empty>
          没有数据.
        </template>
        <p-column
            field="assigned"
            header="分配"
            :showFilterMenu="false"
            style="width:5rem;min-width:5rem;max-width:5rem;"
        >
          <template #body="slotProps">
            <p-checkbox binary v-model="slotProps.data.assigned"/>
          </template>
          <template #filter="{filterModel,filterCallback}">
            <p-tri-state-checkbox v-model="filterModel.value" @change="filterCallback()"/>
          </template>
        </p-column>
        <p-column
            field="userId"
            header="用户"
            :style="{width:'360px'}"
            :sortable="true"
        >
          <template #body="slotProps">
            <div style="width:100%;text-overflow:ellipsis;overflow:hidden">{{ slotProps.data[slotProps.field] }}</div>
          </template>
          <template #filter="{filterModel,filterCallback}">
            <el-input v-model="filterModel.value" @change="filterCallback()"/>
          </template>
        </p-column>
      </p-data-table>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, Ref, ref} from "vue";
import {useAppContext} from "@/libs/commons/app-context";
import {GroupEntity, UserGroupEntity} from "@/services/portal/CRUDService";
import {portalService} from "@/services/portal";
import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud";
import {Queue} from "@/libs/commons/promise-queue";
import {UserEntity} from "@/services/authorization/CRUDService";
import PDataTable from "primevue/datatable";
import PColumn from "primevue/column";
import {authorizationService} from "@/services/authorization";
import {FilterMatchMode} from "primevue/api";
import PTriStateCheckbox from "primevue/tristatecheckbox";
import PCheckbox from "primevue/checkbox";
import {ROUTE_PORTAL_GROUP_LIST} from "@/modules/admin-console/route";
import PsrElToolbar from "@/libs/components/psr/element-plus/PsrElToolbar.vue";

interface UserItem {
  userId: string,
  assigned: boolean,
  user: UserEntity,
  userGroup?: UserGroupEntity
}

export default defineComponent({
  name: "admin-console-group-user",
  components: {
    PDataTable,
    PColumn,
    PTriStateCheckbox,
    PCheckbox,
    PsrElToolbar
  },
  props: {
    groupId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const loadingFlag = ref<boolean>(false)
    const tableRef = ref()
    const groupEntity = ref({} as GroupEntity)
    const userItemById: Ref<Record<string, UserItem>> = ref({})
    const tableProps = reactive({
      data: [] as UserItem[],
      filters: {
        'userId': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'assigned': {value: null, matchMode: FilterMatchMode.EQUALS}
      },
    })

    function initTableData() {
      loadingFlag.value = true
      tableProps.data = []
      userItemById.value = {}
      authorizationService.crud.user.findAll().then(data => {
        for (let i = 0; i < data.content.length; i++) {
          const userEntity = data.content[i];
          const userItem: UserItem = {
            userId: userEntity.id!,
            assigned: false,
            user: userEntity
          }
          tableProps.data.push(userItem)
          userItemById.value[userEntity.id!] = userItem
        }
        return portalService.crud.group.findAllById([props.groupId]).then(data => {
          if (data && data.length > 0) {
            groupEntity.value = data[0]
            return portalService.crud.userGroup.findAll(
                new FilterOptionsBuilder().field('groupId').iEqual(data[0].id!).then().get()
            ).then(data => {
              for (let i = 0; i < data.content.length; i++) {
                const userGroupEntity = data.content[i];
                const userItem = userItemById.value[userGroupEntity.userId!]
                userItem.userGroup = userGroupEntity
                userItem.assigned = true
              }
            })
          }
        })
      }).finally(() => {
        loadingFlag.value = false
      })
    }

    const backRouteName = useAppContext().router.computeModuleRouteName(ROUTE_PORTAL_GROUP_LIST.name)

    const saveQueue = new Queue()

    function handleSave() {
      if (saveQueue.flushing) {
        return
      }
      saveQueue.enqueue(resolve => {
        loadingFlag.value = true
        resolve(true)
      })
      for (let i = 0; i < tableProps.data.length; i++) {
        const datum = tableProps.data[i];
        if (datum.assigned && !datum.userGroup) {
          // 创建用户分组关系
          saveQueue.enqueue<UserGroupEntity>((resolve, reject) => {
            portalService.crud.userGroup.create({
              groupId: groupEntity.value.id,
              userId: datum.userId
            }).then(resolve).catch(reject)
          }).then(data => {
            datum.userGroup = data
          })
        }
        if (!datum.assigned && datum.userGroup) {
          // 删除用户分组关系
          const ids = [datum.userGroup.id!]
          saveQueue.enqueue((resolve, reject) => {
            portalService.crud.userGroup.delete(ids)
                .then(resolve).catch(reject)
          }).then(() => datum.userGroup = undefined)
        }
      }
      saveQueue.enqueue(resolve => {
        loadingFlag.value = false
        resolve(true)
      })
    }

    function handleClearFilters() {
      tableProps.filters = {
        'userId': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'assigned': {value: null, matchMode: FilterMatchMode.EQUALS}
      }
    }

    onMounted(() => {
      console.log('onmounted')
      initTableData()
    })
    return {
      testData: [{
        userId: '123'
      }],
      tableRef,
      groupEntity,
      tableProps,
      loadingFlag,
      backRouteName,
      initTableData,
      handleSave,
      handleClearFilters
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-root {
  height: 100%;
}

.ct-header {
  height: unset;
  padding: 12px 10px;
  border-bottom: var(--psr-border);
}

.ct-main {
  padding: 0;
}

.table {
  width: 100%;
  height: 100%;
}
</style>