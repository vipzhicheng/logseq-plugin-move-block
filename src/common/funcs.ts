import '@logseq/libs';
import { BlockEntity } from '@logseq/libs/dist/LSPlugin';
import hotkeys from 'hotkeys-js';
import { useTargetStore } from '@/stores/target';

const settingsVersion = 'v1';
export const defaultSettings = {
  keyBindings: {
    moveBlock: 'mod+shift+m',
  },
  settingsVersion,
  disabled: false,
};

export type DefaultSettingsType = typeof defaultSettings;

export const initSettings = () => {
  let settings = logseq.settings;

  const shouldUpdateSettings =
    !settings || settings.settingsVersion != defaultSettings.settingsVersion;

  if (shouldUpdateSettings) {
    settings = defaultSettings;
    logseq.updateSettings(settings);
  }
};

export const getSettings = (
  key: string | undefined,
  defaultValue: any = undefined
) => {
  const settings = logseq.settings;
  const merged = Object.assign(defaultSettings, settings);
  return key ? (merged[key] ? merged[key] : defaultValue) : merged;
};

export const getFirstBlock = async function (
  pageName: string
): Promise<null | BlockEntity> {
  const blocks = await logseq.Editor.getPageBlocksTree(pageName);
  if (blocks.length === 0) {
    return null;
  }
  return blocks[0];
};

export const getLastBlock = async function (
  pageName: string
): Promise<null | BlockEntity> {
  const blocks = await logseq.Editor.getPageBlocksTree(pageName);
  if (blocks.length === 0) {
    return null;
  }
  return blocks[blocks.length - 1];
};

export const createPageIfNotExist = async function (
  pageName: string,
  isJournal: boolean = false
) {
  let page = await logseq.Editor.getPage(pageName);
  if (!page) {
    await logseq.Editor.createPage(
      pageName,
      {},
      {
        createFirstBlock: true,
        redirect: false,
        journal: isJournal,
      }
    );
  } else {
    const lastBlock = await getLastBlock(pageName);
    if (lastBlock === null) {
      await logseq.Editor.deletePage(pageName);
      await logseq.Editor.createPage(
        pageName,
        {},
        {
          createFirstBlock: true,
          redirect: false,
          journal: isJournal,
        }
      );
    }
  }
};

export async function setHotkeys() {
  hotkeys('enter', () => {
    const targetStore = useTargetStore();
    targetStore.submit();
    return false;
  });
}
