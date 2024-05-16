import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Logseq Move Block",
  description: "Move blocks to anywhere in Logseq",
  base: "/logseq-plugin-move-block/",
  assetsDir: "assets",
  cleanUrls: true,
  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        outline: {
          level: "deep",
        },
        nav: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Changelog", link: "https://github.com/vipzhicheng/logseq-plugin-move-block/blob/main/changelog.md" },
        ],
        sidebar: {
          "/guide/": [
            {
              text: "Getting Started",
              link: "/guide/getting-started",
            },

          ],
        },
      },
    },
    cn: {
      label: "中文",
      lang: "cn", // 可选，将作为 `lang` 属性添加到 `html` 标签中
      link: "/cn/", // 默认 /fr/ -- 显示在导航栏翻译菜单上，可以是外部的

      themeConfig: {
        outline: {
          level: "deep",
          label: "页面导航",
        },
        docFooter: {
          prev: "上一页",
          next: "下一页",
        },

        nav: [
          { text: "快速开始", link: "/cn/guide/getting-started" },
          { text: "变更日志", link: "https://github.com/vipzhicheng/logseq-plugin-move-block/blob/main/changelog.md" },
        ],
        sidebar: {
          "/cn/guide/": [
            {
              text: "快速开始",
              link: "/cn/guide/getting-started",
            },
          ],
        },
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/assets/logo.png",
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/vipzhicheng/logseq-plugin-move-block",
      },
    ],
    search: {
      provider: "local",
    },
    footer: {
      message: "Logseq Move Block",
    },
    externalLinkIcon: true,
  },
});
