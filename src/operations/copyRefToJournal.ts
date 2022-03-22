import '@logseq/libs';
import { BlockEntity } from '@logseq/libs/dist/LSPlugin';
import { format } from 'date-fns';

async function getLastBlock(pageName: string): Promise<null | BlockEntity> {
  const blocks = await logseq.Editor.getPageBlocksTree(pageName);
  if (blocks.length === 0) {
    return null;
  }
  return blocks[blocks.length - 1];
}

async function createPageIfNotExist(pageName: string) {
  let page = await logseq.Editor.getPage(pageName);
  if (!page) {
    await logseq.Editor.createPage(
      pageName,
      {},
      {
        createFirstBlock: true,
        redirect: false,
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
        }
      );
    }
  }
}

const handler = async (e: any) => {
  const block = await logseq.Editor.getBlock(e.uuid);
  const config = await logseq.App.getUserConfigs();
  if (!block?.properties?.id) {
    await logseq.Editor.upsertBlockProperty(e.uuid, 'id', e.uuid);
  }

  if (block && block.content) {
    const todayTitle = format(new Date(), config.preferredDateFormat);
    await createPageIfNotExist(todayTitle);

    const srcBlock = await getLastBlock(todayTitle);
    if (srcBlock) {
      if (srcBlock.content) {
        await logseq.Editor.insertBlock(srcBlock.uuid, `((${block.uuid}))`, {
          sibling: true,
        });
      } else {
        await logseq.Editor.updateBlock(srcBlock.uuid, `((${block.uuid}))`);
      }
    }
  }
};

export default () => {
  logseq.Editor.registerSlashCommand(
    `Copy block ref to today's journal`,
    handler
  );
  logseq.Editor.registerBlockContextMenuItem(
    `Copy block ref to today's journal`,
    handler
  );
};
