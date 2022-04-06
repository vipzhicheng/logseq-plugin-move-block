import '@logseq/libs';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import copyRefToContents from './operations/copyRefToContents';
import copyRefToJournal from './operations/copyRefToJournal';
import moveTo from './operations/moveTo';
import { useTargetStore } from '@/stores/target';

import './style.css';
async function main() {
  copyRefToJournal();
  copyRefToContents();

  const app = createApp(App);
  app.use(createPinia());
  app.mount('#app');

  moveTo();

  logseq.on('ui:visible:changed', visible => {
    if (!visible) return;
    const targetStore = useTargetStore();
    targetStore.loadPages();
    targetStore.resetCustomInput();
  });
}

logseq.ready(main).catch(console.error);
