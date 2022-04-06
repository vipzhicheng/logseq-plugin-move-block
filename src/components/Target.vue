<script setup lang="ts">
import { useTargetStore } from "@/stores/target";
const targetStore = useTargetStore();
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
    :on-mask-click="targetStore.hide"
    transform-origin="center"
    preset="dialog"
  >
    <template #header> Select target </template>
    <n-radio-group v-model:value="targetStore.destination.to" name="radiogroup">
      <div><n-radio key="1" value="today"> Today's journal </n-radio></div>
      <div><n-radio key="2" value="contents"> Contents </n-radio></div>
      <div>
        <n-radio key="3" value="journal">
          Select journal:
          <n-date-picker
            v-model:formatted-value="targetStore.destination.journal"
            value-format="yyyy.MM.dd"
            type="date"
            clearable
        /></n-radio>
      </div>
      <div><n-radio key="4" value="page"> Search page: </n-radio></div>
    </n-radio-group>
    <template #action>
      <n-button strong secondary type="primary" @click="targetStore.submit()">
        OK
      </n-button>
    </template>
  </n-modal>
</template>

<style></style>
