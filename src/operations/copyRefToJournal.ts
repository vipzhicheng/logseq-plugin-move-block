import { createPageIfNotExist, getLastBlock } from '@/common/funcs';
import '@logseq/libs';
import { format } from 'date-fns';

const handler = async (e: any) => {
  const block = await logseq.Editor.getBlock(e.uuid);
  const config = await logseq.App.getUserConfigs();
  if (!block?.properties?.id) {
    await logseq.Editor.upsertBlockProperty(e.uuid, 'id', e.uuid);
  }

  if (block && block.content) {
    const todayTitle = format(new Date(), config.preferredDateFormat);
    await createPageIfNotExist(todayTitle, true);

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
