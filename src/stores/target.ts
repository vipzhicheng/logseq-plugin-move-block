import { defineStore } from 'pinia';

export const useTargetStore = defineStore('target', {
  state: () => ({
    visible: false,
    destination: {
      to: 'today',
      journal: '',
    },
  }),
  actions: {
    open() {
      this.visible = true;
    },
    close() {
      this.v;
    },
    hide() {
      logseq.hideMainUI({
        restoreEditingCursor: true,
      });
    },
    submit() {
      logseq.hideMainUI({
        restoreEditingCursor: true,
      });
    },
  },
});
