<script setup lang="ts">
import { useTargetStore } from "@/stores/target";
import fuzzy from "fuzzy";
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
    >
      <n-form-item label="To" path="to">
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
            <n-radio key="journal" value="journal"> A journal </n-radio>
          </div>
          <div><n-radio key="page" value="page"> A page </n-radio></div>
        </n-radio-group>
      </n-form-item>
      <n-form-item
        v-if="targetStore.destination.to === 'journal'"
        label="Select journal"
        path="journal"
      >
        <n-date-picker
          v-model:formatted-value="targetStore.destination.journal"
          value-format="yyyy-MM-dd"
          type="date"
          clearable
        />
      </n-form-item>

      <n-form-item
        v-if="targetStore.destination.to === 'page'"
        label="Search page"
        path="page"
      >
        <n-auto-complete
          v-model:value="targetStore.destination.page"
          :input-props="{
            autocomplete: 'disabled',
          }"
          :options="pageFilter"
        />
      </n-form-item>

      <n-form-item label="Action" path="action">
        <n-radio-group
          v-model:value="targetStore.destination.action"
          name="radiogroup"
        >
          <div>
            <n-radio key="copy_ref" value="copy_ref"> Copy ref </n-radio>
          </div>
          <div>
            <n-radio key="copy_content" value="copy_content">
              Copy content
            </n-radio>
          </div>
          <div>
            <n-radio key="cut_content" value="cut_content">
              Cut content
            </n-radio>
          </div>
          <div>
            <n-radio
              key="cut_content_and_keep_ref"
              value="cut_content_and_keep_ref"
            >
              Cut content and keep ref
            </n-radio>
          </div>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="After" path="after">
        <n-radio-group
          v-model:value="targetStore.destination.after"
          name="radiogroup"
        >
          <div>
            <n-radio key="stay" value="stay"> Stay current page </n-radio>
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

<style></style>
