<script setup lang="ts">
import cc from "change-case-all";
import { Trash, CirclePlus, Plus, Minus } from "@vicons/tabler";
import { useTargetStore } from "@/stores/target";
import fuzzy from "fuzzy";
import QuestionCircleRegular from "@/icons/QuestionCircleRegular.svg";
const targetStore = useTargetStore();
const pageFilter = computed(() => {
  return fuzzy
    .filter(targetStore.destination.page, targetStore.pages, {})
    .map((el) => {
      return {
        label: el.original,
        value: el.original,
      };
    });
});

const selectHistory = (o) => {
  targetStore.destination.to = o.to;
  targetStore.destination.at = o.at;
  targetStore.destination.page = o.page;
  targetStore.destination.journal = o.journal;
  targetStore.destination.after = o.after;
  targetStore.destination.action = o.action;
};

const clearHistory = () => {
  targetStore.clearHistory();
};
const deleteHistory = (k) => {
  targetStore.deleteHistory(k);
};

// const addCurrentToHistory = () => {
//   targetStore.addCurrentToHistory();
// };

const clearFavorites = () => {
  targetStore.clearFavorites();
};

const addCurrentToFavorites = () => {
  targetStore.addCurrentToFavorites();
};

const deleteFavorite = (k) => {
  targetStore.deleteFavorite(k);
};
const selectFavorite = selectHistory;
</script>

<template>
  <n-modal
    v-model:show="targetStore.visible"
    :close-on-esc="true"
    :closable="true"
    :mask-closable="true"
    :auto-focus="true"
    :show-icon="false"
    :on-close="targetStore.hide"
    :on-esc="targetStore.hide"
    :on-mask-click="targetStore.hide"
    transform-origin="center"
    preset="dialog"
  >
    <template #header>
      Move block
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button class="button ml-2" text @click="addCurrentToFavorites">
            <n-icon size="16"><Plus /></n-icon>
          </n-button>
        </template>
        Add scenario to favorites
      </n-tooltip>
    </template>

    <div class="flex flex-row">
      <div>
        <n-form
          ref="formRef"
          :label-width="120"
          label-placement="left"
          :model="targetStore.destination"
          size="small"
          @keyup.enter="targetStore.submit"
          @submit="targetStore.submit"
        >
          <n-form-item label="To:" path="to">
            <n-radio-group
              v-model:value="targetStore.destination.to"
              name="radiogroup"
            >
              <div>
                <n-radio key="today" value="today"> Today's journal </n-radio>
              </div>
              <div>
                <n-radio key="yesterday" value="yesterday">
                  Yesterday's journal
                </n-radio>
              </div>
              <div>
                <n-radio key="tomorrow" value="tomorrow">
                  Tomorrow's journal
                </n-radio>
              </div>
              <div>
                <n-radio key="contents" value="contents"> Contents </n-radio>
              </div>
              <div>
                <n-radio key="current_page" value="current_page">
                  Current page
                </n-radio>
              </div>
              <div>
                <n-radio key="journal" value="journal"> A journal </n-radio>
              </div>
              <div>
                <n-radio key="page" value="page"> A page </n-radio>
              </div>
            </n-radio-group>
          </n-form-item>
          <n-form-item
            v-if="targetStore.destination.to === 'journal'"
            label=" "
            path="journal"
          >
            <n-date-picker
              v-model:formatted-value="targetStore.destination.journal"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
              placeholder="Select journal"
            />
          </n-form-item>

          <n-form-item
            v-if="targetStore.destination.to === 'page'"
            label=" "
            path="page"
          >
            <n-auto-complete
              clearable
              v-model:value="targetStore.destination.page"
              :input-props="{
                autocomplete: 'disabled',
              }"
              :options="pageFilter"
              placeholder="Input page name"
            />
          </n-form-item>

          <n-form-item label="At:" path="at">
            <n-radio-group
              v-model:value="targetStore.destination.at"
              name="radiogroup"
            >
              <div>
                <n-radio key="bottom" value="bottom"> Bottom </n-radio>
              </div>
              <div>
                <n-radio key="top" value="top"> Top </n-radio>
              </div>
            </n-radio-group>
          </n-form-item>

          <n-form-item label="Action:" path="action">
            <n-radio-group
              v-model:value="targetStore.destination.action"
              name="radiogroup"
            >
              <div>
                <n-radio key="copy_ref" value="copy_ref">
                  Copy block ref
                </n-radio>
              </div>
              <div>
                <n-radio key="copy_embed" value="copy_embed">
                  Copy block embed
                </n-radio>
              </div>
              <div>
                <n-radio key="copy_content" value="copy_content">
                  Copy content
                </n-radio>
              </div>
              <div>
                <n-radio key="cut_content" value="cut_content" class="">
                  <span class="">Cut content</span>
                </n-radio>
              </div>
              <div>
                <n-radio
                  key="cut_content_and_keep_ref"
                  value="cut_content_and_keep_ref"
                >
                  Cut content and keep ref to target
                </n-radio>
              </div>
              <div>
                <n-radio
                  key="cut_content_and_keep_embed"
                  value="cut_content_and_keep_embed"
                >
                  Cut content and keep embed to target
                </n-radio>
              </div>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="After:" path="after">
            <n-radio-group
              v-model:value="targetStore.destination.after"
              name="radiogroup"
            >
              <div>
                <n-radio key="stay" value="stay">
                  Stay on current page
                </n-radio>
              </div>
              <div>
                <n-radio key="jump" value="jump"> Jump to target page </n-radio>
              </div>
            </n-radio-group>
          </n-form-item>
        </n-form>
      </div>

      <div class="border-l border-dashed pl-4 w-1/2">
        <div class="favorites-card border-b border-dashed pb-2">
          <div class="font-bold mb-2 flex flex-row justify-start items-center">
            FAVORITES
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button class="button ml-2" text @click="clearFavorites">
                  <n-icon size="16"><Trash /></n-icon>
                </n-button>
              </template>
              Clear history
            </n-tooltip>
          </div>
          <ul class="overflow-y-auto">
            <li v-for="(o, k) in targetStore.favorites" :key="k" class="">
              <span @click="selectFavorite(o)" class="cursor-pointer">
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-button
                      class="button mr-2"
                      text
                      @click="deleteFavorite(k)"
                    >
                      <n-icon size="12"><Minus /></n-icon>
                    </n-button>
                  </template>
                  Delete
                </n-tooltip>
                <b>{{ cc.sentenceCase(o.action) }}</b> to
                <b
                  >{{ o.to }}
                  {{ o.to === "page" ? o.page : "" }}
                  {{ o.to === "journal" ? o.journal : "" }}</b
                >
                at <b>{{ o.at }}</b> then <b>{{ o.after }}</b
                >.
              </span>
            </li>
          </ul>
        </div>
        <div class="history-card pt-2">
          <div class="font-bold mb-2 flex flex-row justify-start items-center">
            RECENT
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button class="button ml-2" text @click="clearHistory">
                  <n-icon size="16"><Trash /></n-icon>
                </n-button>
              </template>
              Clear history
            </n-tooltip>
          </div>
          <ul class="list-disc list-inside overflow-y-auto">
            <li
              v-for="(o, k) in targetStore.history"
              :key="k"
              class="flex flex-row gap-2 items-center"
            >
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button class="button" text @click="deleteHistory(k)">
                    <n-icon size="16"><Minus /></n-icon>
                  </n-button>
                </template>
                Delete
              </n-tooltip>
              <span @click="selectHistory(o)" class="cursor-pointer">
                <b>{{ cc.sentenceCase(o.action) }}</b> to
                <b
                  >{{ o.to }}
                  {{ o.to === "page" ? o.page : "" }}
                  {{ o.to === "journal" ? o.journal : "" }}</b
                >
                at <b>{{ o.at }}</b> then <b>{{ o.after }}</b
                >.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <template #action>
      <n-button strong secondary type="primary" @click="targetStore.submit()">
        OK
      </n-button>
    </template>
  </n-modal>
</template>

<style scopped>
.n-form-item .n-form-item-label {
  margin-top: -3px;
  font-weight: bold;
}

.n-dialog.n-modal {
  width: 800px;
}
</style>
