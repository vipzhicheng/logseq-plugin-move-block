import { BlockEntity } from '@logseq/libs/dist/LSPlugin';
import { defineStore } from 'pinia';
import { formatInTimeZone } from 'date-fns-tz';
import { addDays, subDays } from 'date-fns';
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
    case 'yesterday':
      targetPage = formatInTimeZone(
        subDays(new Date(), 1),
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        config.preferredDateFormat
      );
      isJournal = true;
      break;
    case 'tomorrow':
      targetPage = formatInTimeZone(
        addDays(new Date(), 1),
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
      newBlockContent = block.content
        .split('\n')
        .filter((line: string) => line.indexOf('id:: ') === -1)
        .join('\n');
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
    } else if (
      [
        'cut_content',
        'cut_content_and_keep_ref',
        'cut_content_and_keep_embed',
      ].includes(action)
    ) {
      if (action === 'cut_content_and_keep_ref') {
        await logseq.Editor.insertBlock(block.uuid, `((${block.uuid}))`, {
          before: false,
          sibling: true,
        });
      } else if (action === 'cut_content_and_keep_embed') {
        await logseq.Editor.insertBlock(
          block.uuid,
          `{{embed ((${block.uuid}))}}`,
          {
            before: false,
            sibling: true,
          }
        );
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

const assetStorage = logseq.Assets.makeSandboxStorage();

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
    history: [],
    favorites: [],
    defaultFavorites: [
      {
        to: 'today',
        journal: null,
        page: '',
        at: 'bottom',
        action: 'copy_ref',
        after: 'stay',
      },
      {
        to: 'contents',
        journal: null,
        page: '',
        at: 'bottom',
        action: 'copy_ref',
        after: 'stay',
      },
      {
        to: 'current_page',
        journal: null,
        page: '',
        at: 'top',
        action: 'copy_ref',
        after: 'stay',
      },
    ],
  }),
  actions: {
    async init() {
      let favoritesStorageExists = await assetStorage.hasItem('favorites.json');

      if (!favoritesStorageExists) {
        this.favorites = this.defaultFavorites;
      } else {
        let favoritesStorage = await assetStorage.getItem('favorites.json');
        favoritesStorage = favoritesStorage ? JSON.parse(favoritesStorage) : [];
        if (favoritesStorage.length === 0) {
          // default fav
          this.favorites = this.defaultFavorites;
        } else {
          this.favorites = favoritesStorage;
        }
      }

      let historyStorageExists = await assetStorage.hasItem('history.json');

      if (!historyStorageExists) {
        this.history = [];
      } else {
        let historyStorage = await assetStorage.getItem('history.json');
        historyStorage = historyStorage ? JSON.parse(historyStorage) : [];
        if (historyStorage.length === 0) {
          // default fav
          this.history = [];
        } else {
          this.history = historyStorage;
        }
      }
    },
    async saveFavorites() {
      await assetStorage.setItem(
        'favorites.json',
        JSON.stringify(this.favorites)
      );
    },
    async deleteFavorite(index) {
      this.favorites.splice(index, 1);
      await this.saveFavorites();
    },
    async addCurrentToFavorites() {
      await this.addFavorite(this.destination);
    },
    async clearFavorites() {
      this.favorites = [];
      await this.saveFavorites();
    },
    async addFavorite(data) {
      const findedIndex = this.favorites.findIndex(item => {
        if (
          item.to === data.to &&
          item.journal === data.journal &&
          item.page === data.page &&
          item.at === data.at &&
          item.action === data.action &&
          item.after === data.after
        ) {
          return true;
        }
      });

      if (findedIndex !== -1) {
        this.favorites.splice(findedIndex, 1);
      }

      this.favorites.unshift({
        to: data.to,
        journal: data.journal,
        page: data.page,
        at: data.at,
        action: data.action,
        after: data.after,
      });

      if (this.favorites.length > 15) {
        this.favorites.pop();
      }

      await this.saveFavorites();
    },

    async saveHistory() {
      await assetStorage.setItem('history.json', JSON.stringify(this.history));
    },
    async deleteHistory(index) {
      this.history.splice(index, 1);
      await this.saveHistory();
    },
    async clearHistory() {
      this.history = [];
      await this.saveHistory();
    },
    async addHistory(data) {
      const findedIndex = this.history.findIndex(item => {
        if (
          item.to === data.to &&
          item.journal === data.journal &&
          item.page === data.page &&
          item.at === data.at &&
          item.action === data.action &&
          item.after === data.after
        ) {
          return true;
        }
      });

      if (findedIndex !== -1) {
        this.history.splice(findedIndex, 1);
      }

      this.history.unshift({
        to: data.to,
        journal: data.journal,
        page: data.page,
        at: data.at,
        action: data.action,
        after: data.after,
      });

      if (this.history.length > 15) {
        this.history.pop();
      }

      await this.saveHistory();
    },

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
      const { to, action, journal, after, page, at } = this.destination;
      await this.addHistory(this.destination);
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
