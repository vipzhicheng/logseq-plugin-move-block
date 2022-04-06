import { defineStore } from 'pinia';

export const useTargetStore = defineStore('target', {
  state: () => ({
    visible: false,
    destination: {
      to: 'today',
      action: 'copy',
      journal: null,
      after: '',
      page: '',
    },
    pages: [],
  }),
  actions: {
    async loadPages() {
      const pages = await logseq.DB.datascriptQuery(`
        [:find ?page-name (pull ?page [*])
          :where
          [?page :block/name ?page-name]
          [?page :block/journal? false]
        ]
      `);
      console.log('pages', pages);
      this.pages = pages.map(page => page[0]);
    },
    open() {
      this.visible = true;
    },
    // close() {
    //   this.v;
    // },
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
    resetCustomInput() {
      this.destination.journal = null;
      this.destination.page = '';
    },
  },
});
