import '@logseq/libs';
import { BlockEntity } from '@logseq/libs/dist/LSPlugin';

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
        }
      );
    }
  }
};
