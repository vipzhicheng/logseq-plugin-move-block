import '@logseq/libs';
async function main() {
  logseq.App.showMsg('hello');
}
logseq.ready(main).catch(console.error);
