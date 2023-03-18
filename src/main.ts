import '@logseq/libs';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import copyRefToJournal from './operations/copyRefToJournal';
import moveTo from './operations/moveTo';
import { useTargetStore } from '@/stores/target';

import './style.css';
import { initSettings, setHotkeys } from './common/funcs';

async function main() {
  initSettings();
  copyRefToJournal();
  // copyRefToContents();

  const app = createApp(App);
  app.use(createPinia());
  app.mount('#app');

  moveTo();

  setHotkeys();

  const targetStore = useTargetStore();
  await targetStore.init();

  logseq.on('ui:visible:changed', visible => {
    if (!visible) return;
    const targetStore = useTargetStore();
    targetStore.loadPages();
  });
}

logseq.ready(main).catch(console.error);
