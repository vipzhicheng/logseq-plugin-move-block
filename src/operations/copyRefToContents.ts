import { createPageIfNotExist, getLastBlock } from '@/common/funcs';
import '@logseq/libs';

const handler = async (e: any) => {
  const block = await logseq.Editor.getBlock(e.uuid);
  if (!block?.properties?.id) {
    await logseq.Editor.upsertBlockProperty(e.uuid, 'id', e.uuid);
  }

  if (block && block.content) {
    const contentsPageName = 'contents';
    await createPageIfNotExist(contentsPageName);

    const srcBlock = await getLastBlock(contentsPageName);
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
  logseq.Editor.registerSlashCommand(`Copy block ref to contents`, handler);
  logseq.Editor.registerBlockContextMenuItem(
    `Copy block ref to contents`,
    handler
  );
};
