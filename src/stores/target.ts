import { BlockEntity } from '@logseq/libs/dist/LSPlugin';
import { defineStore } from 'pinia';
import { formatInTimeZone } from 'date-fns-tz';
import {
  createPageIfNotExist,
  getFirstBlock,
  getLastBlock,
} from '@/common/funcs';

type Destination = {
  to: string;
  at: string;
  action: string;
  journal: string | null;
  after: string;
  page: string;
};
const processBlock = async (block: BlockEntity, destination: Destination) => {
  if (!block || !block.content || /^\s+$/gm.test(block.content)) {
    logseq.App.showMsg('Cannot move empty block');
    return false;
  }
  const config = await logseq.App.getUserConfigs();
  const { to, action, journal, after, page, at } = destination;
  let targetPage;
  let isJournal = false;
  switch (to) {
    case 'today':
      targetPage = formatInTimeZone(
        new Date(),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        config.preferredDateFormat
      );
      isJournal = true;
      break;
    case 'contents':
      targetPage = 'contents';
      break;
    case 'current_page':
      let currentPage = await logseq.Editor.getCurrentPage();
      if (!currentPage) {
        const currentBlock = await logseq.Editor.getCurrentBlock();
        if (currentBlock) {
          currentPage = await logseq.Editor.getPage(currentBlock.page.id);
        }
      }
      targetPage = currentPage.name;
      break;

    case 'page':
      targetPage = page;
      break;
    case 'journal':
      if (!journal) {
        logseq.App.showMsg('Journal should not be empty');
      }
      // TODO validate the journal
      targetPage = formatInTimeZone(
        journal,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        config.preferredDateFormat
      );
      break;
  }

  if (!block?.properties?.id) {
    await logseq.Editor.upsertBlockProperty(block.uuid, 'id', block.uuid);
  }

  await createPageIfNotExist(targetPage, isJournal);
  let atBlock;

  if (at === 'bottom') {
    atBlock = await getLastBlock(targetPage);
  } else {
    atBlock = await getFirstBlock(targetPage);
  }

  await getLastBlock(targetPage);
  let targetBlock;

  let newBlockContent;
  switch (action) {
    case 'copy_ref':
      newBlockContent = `((${block.uuid}))`;
      break;

    case 'copy_embed':
      newBlockContent = `{{embed ((${block.uuid}))}}`;
      break;

    case 'copy_content':
      newBlockContent = block.content;
      break;
  }

  if (atBlock) {
    if (['copy_ref', 'copy_embed', 'copy_content'].includes(action)) {
      if (atBlock.content) {
        targetBlock = await logseq.Editor.insertBlock(
          atBlock.uuid,
          newBlockContent,
          {
            before: at !== 'bottom',
            sibling: true,
          }
        );
      } else {
        await logseq.Editor.updateBlock(atBlock.uuid, newBlockContent);
        targetBlock = atBlock;
      }
    } else if (['cut_content', 'cut_content_and_keep_ref'].includes(action)) {
      if (action === 'cut_content_and_keep_ref') {
        await logseq.Editor.insertBlock(block.uuid, `((${block.uuid}))`, {
          before: false,
          sibling: true,
        });
      }
      await logseq.Editor.moveBlock(block.uuid, atBlock.uuid, {
        before: at !== 'bottom',
        children: false,
      });
      targetBlock = await logseq.Editor.getBlock(block.uuid);
    }
  } else {
    logseq.App.showMsg('Target page empty, block movement failed!');
    return false;
  }

  return { targetPage, targetBlock };
};

export const useTargetStore = defineStore('target', {
  state: () => ({
    fallbackUUID: '',
    visible: false,
    destination: {
      to: 'today',
      at: 'bottom',
      action: 'copy_ref',
      journal: null,
      after: 'stay',
      page: '',
    },
    pages: [],
  }),
  actions: {
    setFallbackUUID(uuid: string) {
      this.fallbackUUID = uuid;
    },
    clearFallbackUUID(uuid: string) {
      this.fallbackUUID = '';
    },
    async loadPages() {
      const pages = await logseq.DB.datascriptQuery(`
        [:find ?page-name (pull ?page [*])
          :where
          [?page :block/name ?page-name]
          [?page :block/journal? false]
        ]
      `);
      this.pages = pages.map(page => page[0]);
    },
    open() {
      this.visible = true;
    },
    hide() {
      logseq.hideMainUI({
        restoreEditingCursor: true,
      });
    },
    async submit() {
      const { to, action, journal, after, page } = this.destination;
      const selected = await logseq.Editor.getSelectedBlocks();
      let processed;
      if (selected && selected.length > 1) {
        for (let block of selected) {
          processed = await processBlock(block, this.destination);
          if (!processed) {
            return;
          }
        }
      } else {
        let block = await logseq.Editor.getCurrentBlock();
        if (!block) {
          block = await logseq.Editor.getBlock(this.fallbackUUID);
        }
        if (block) {
          processed = await processBlock(block, this.destination);
          if (!processed) {
            return;
          }
        }
      }

      if (after === 'jump' && processed) {
        const { targetPage, targetBlock } = processed;
        if (targetPage && targetBlock) {
          await logseq.Editor.scrollToBlockInPage(targetPage, targetBlock.uuid);
        }
      }

      this.clearFallbackUUID();
      logseq.hideMainUI({
        restoreEditingCursor: true,
      });
    },
  },
});
