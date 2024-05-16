# Getting Started

Welcome to the installation and usage for Logseq Move Block. This is a simple guide to help you quickly understand and start using it.

## What is it

Logseq Move Block is a Logseq plugin that allows you to freely move blocks within Logseq. As Logseq is an outlining note-taking software, you will have more and more blocks over time, far more than your pages. Therefore, you often have the need to organize these blocks by moving them back and forth, copying them, referencing them, or embedding them. With the Move Block plugin, you can easily perform these operations.

Use cases:

1. Use Namespace to convert a long page into nested pages.
2. Move content from a journal page to a project page while retaining references on the journal page, or vice versa.
3. Move content from the middle of a page to the top or bottom of the current page.
4. ...

## Features

- Supports Slash Command
- Supports Context Command
- Supports keyboard shortcuts
- Supports icon button at the top right corner of the page
- Supports moving to any journal and page
- Supports moving to the top or bottom
- Supports copying and moving, and retaining references or embedding
- Supports staying on the original page or navigating to the target page
- Supports preserving operation history and adding frequently used operations to favorites

## Installation

### Plugin Marketplace

Search for it in the plugin marketplace and install it from there.

### Manual Installation

1. Download the latest zip file from the release page.
2. Unzip the zip file into the folder where you want to store the plugin.
3. Enable developer mode in Logseq.
4. Load the unzipped folder by clicking the "Load unpacked plugin" button on the plugin modal.
5. You should now see that the plugin has been installed.

## Quick Start

1. Place the cursor on the block you want to operate on.
2. Open the configuration window using keyboard shortcuts, Context Command, Slash Command, or the icon button at the top right corner of the page.
3. Select the appropriate options according to your needs.
4. Click OK to execute.
5. For similar operation requirements in the future, quickly select from the favorite list or operation history.

## Notes on Multiple Lines and Nesting

1. Due to the limitations of Logseq itself, if you are moving multiple lines, after selecting multiple lines, you can only continue with the multi-line movement by triggering the operation window using keyboard shortcuts. Other methods will degrade to selecting the first block that was selected during the selection.
2. The order of selection when selecting multiple lines is important, as it determines the order of operations, not the order as they appear on the page.
3. Cut operations support nested blocks, but copy operations do not support nesting. This means that if you cut, as long as you select the root block, the entire block tree will be cut and maintain the original structure. However, if you copy, the original structure will not be preserved and they will be flattened, requiring manual reorganization of the structure on the new target page. Visually, in addition to paying attention to the highlighted area in Logseq, you also need to pay attention to whether the small circle in front of the block changes color.
4. Cut operations support cutting multiple nested block trees at the same time. They also support cutting multiple block subtrees from a large block tree. The judgment is based on the relationship between the highlighted blocks. Only continuous parent-child relationships will be recognized as a tree. If there is a break in between or if they are siblings, they will be recognized as a new subtree. Blocks with unhighlighted small circles may also be included in the cut tree if their parent nodes are selected.

### Example

![](/assets/example.png)

Here, the highlighted area is `1,2,3,4,5,7,8,0`. Among them, only `1,3,7,0` have highlighted small circles. In this case:

If it is copying, the target page will have the following result:

![](/assets/result1.png)

If it is cutting, the target page will have the following result:

![](/assets/result2.png)

As can be seen, here, because the 8 between 7 and 0 was not selected, 0 is treated as a new subtree after the cut, while 2, 4, and 5 were not selected, but because their parent node was selected, they were also cut together.

This example is extreme and is intended to demonstrate the plugin's handling logic. In daily use, it is rare to have discontinuous selections that need to be moved together.