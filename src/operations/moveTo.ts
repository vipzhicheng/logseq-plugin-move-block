import '@logseq/libs';
import { useTargetStore } from '@/stores/target';
import { getSettings } from '@/common/funcs';

export default () => {
  const keyBindings = getSettings('keyBindings');
  const openMoveBlockWindow = async ({ uuid }) => {
    const targetStore = useTargetStore();

    if (uuid) {
      targetStore.setFallbackUUID(uuid);
    }
    targetStore.open();
    logseq.showMainUI({
      autoFocus: true,
    });
  };

  logseq.App.registerCommandPalette(
    {
      key: 'move-block',
      label: 'Move block',
      keybinding: {
        mode: 'global',
        binding: keyBindings.moveBlock,
      },
    },
    openMoveBlockWindow
  );
  logseq.Editor.registerSlashCommand(`Move Block`, openMoveBlockWindow);
  logseq.Editor.registerBlockContextMenuItem(`Move Block`, openMoveBlockWindow);
  // Register icon ui
  logseq.provideModel({
    async openMoveBlock() {
      const block = await logseq.Editor.getCurrentBlock();
      if (!block || !block.uuid) {
        logseq.UI.showMsg('Need to select one block at least!', 'warning');
        return;
      }
      await openMoveBlockWindow({ uuid: block.uuid });
    },
  });
  logseq.App.registerUIItem('pagebar', {
    key: 'logseq-move-block',
    template: `
     <a class="button" data-on-click="openMoveBlock" title="Open move block window">
      <i class="ti ti-corner-up-right" style=""></i>
     </a>
    `,
  });
};
