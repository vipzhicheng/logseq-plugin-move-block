import '@logseq/libs';
import { useTargetStore } from '@/stores/target';

export default () => {
  const handler = async () => {
    const targetStore = useTargetStore();
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
        binding: 'mod+shift+m',
      },
    },
    handler
  );
  logseq.Editor.registerSlashCommand(`Move Block`, handler);
  logseq.Editor.registerBlockContextMenuItem(`Move Block`, handler);
};
