import '@logseq/libs';

import { createApp } from 'vue';
import App from './App.vue';
import copyRefToContents from './operations/copyRefToContents';
import copyRefToJournal from './operations/copyRefToJournal';

import './style.css';
async function main() {
  copyRefToJournal();
  copyRefToContents();
  createApp(App).mount('#app');
}

logseq.ready(main).catch(console.error);
