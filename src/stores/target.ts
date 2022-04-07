import { BlockEntity } from '@logseq/libs/dist/LSPlugin';
import { defineStore } from 'pinia';
import { format } from 'date-fns';
import { createPageIfNotExist, getLastBlock } from '@/common/funcs';

type Destination = {
  to: string;
  action: string;
  journal: string | null;
  after: string;
  page: string;
};
const processBlock = async (block: BlockEntity, destination: Destination) => {
  const config = await logseq.App.getUserConfigs();
  const { to, action, journal, after, page } = destination;
  let targetPage;
  let isJournal = false;
  switch (to) {
    case 'today':
      targetPage = format(new Date(), config.preferredDateFormat);
      isJournal = true;
      break;
    case 'contents':
      targetPage = 'contents';
      break;

    case 'page':
      targetPage = page;
      break;
    case 'journal':
      targetPage = format(new Date(journal), config.preferredDateFormat);
      break;
  }

  if (!block?.properties?.id) {
    await logseq.Editor.upsertBlockProperty(block.uuid, 'id', block.uuid);
  }

  await createPageIfNotExist(targetPage, isJournal);
  const srcBlock = await getLastBlock(targetPage);
  let targetBlock;

  let newBlockContent;
  switch (action) {
    case 'copy_ref':
      newBlockContent = `((${block.uuid}))`;
      break;
    case 'copy_content':
    case 'cut_content':
    case 'cut_content_and_keep_ref':
      newBlockContent = block.content;
      break;
  }

  if (srcBlock) {
    if (srcBlock.content) {
      targetBlock = await logseq.Editor.insertBlock(
        srcBlock.uuid,
        newBlockContent,
        {
          sibling: true,
        }
      );
    } else {
      await logseq.Editor.updateBlock(srcBlock.uuid, newBlockContent);
      targetBlock = srcBlock;
    }
  }

  if (action === 'cut_content') {
    await logseq.Editor.removeBlock(block.uuid);
  } else if (action === 'cut_content_and_keep_ref') {
    await logseq.Editor.updateBlock(block.uuid, `((${targetBlock.uuid}))`);
  }

  return { targetPage, targetBlock };
};

export const useTargetStore = defineStore('target', {
  state: () => ({
    visible: false,
    destination: {
      to: 'today',
      action: 'copy_ref',
      journal: null,
      after: 'stay',
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
    async submit() {
      console.log(this.destination);
      const { to, action, journal, after, page } = this.destination;
      const selected = await logseq.Editor.getSelectedBlocks();
      let processed;
      if (selected && selected.length > 1) {
        for (let block of selected) {
          processed = await processBlock(block, this.destination);
        }
      } else {
        const block = await logseq.Editor.getCurrentBlock();
        if (block) {
          processed = await processBlock(block, this.destination);
        }
      }

      const { targetPage, targetBlock } = processed;
      if (after === 'jump') {
        await logseq.Editor.scrollToBlockInPage(targetPage, targetBlock.uuid);
      }

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
