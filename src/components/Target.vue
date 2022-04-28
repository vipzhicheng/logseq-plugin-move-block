<script setup lang="ts">
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
    <template #header> Move block </template>

    <n-form
      ref="formRef"
      :label-width="120"
      label-placement="left"
      :model="targetStore.destination"
      size="small"
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
          <div><n-radio key="page" value="page"> A page </n-radio></div>
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
              <n-tooltip trigger="hover" class="">
                <template #trigger>
                  <n-icon class="inline-block ml-1 -mb-[2px]">
                    <QuestionCircleRegular />
                  </n-icon>
                </template>
                A block ref is an unique ID to reference the block
              </n-tooltip>
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
        </n-radio-group>
      </n-form-item>
      <n-form-item label="After:" path="after">
        <n-radio-group
          v-model:value="targetStore.destination.after"
          name="radiogroup"
        >
          <div>
            <n-radio key="stay" value="stay"> Stay on current page </n-radio>
          </div>
          <div>
            <n-radio key="jump" value="jump"> Jump to target page </n-radio>
          </div>
        </n-radio-group>
      </n-form-item>
    </n-form>
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
</style>
