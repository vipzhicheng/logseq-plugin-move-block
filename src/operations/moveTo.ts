import '@logseq/libs';
import { useTargetStore } from '@/stores/target';
import { getSettings } from '@/common/funcs';

export default () => {
  const keyBindings = getSettings('keyBindings');
  const handler = async ({ uuid }) => {
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
    handler
  );
  logseq.Editor.registerSlashCommand(`Move Block`, handler);
  logseq.Editor.registerBlockContextMenuItem(`Move Block`, handler);
};
