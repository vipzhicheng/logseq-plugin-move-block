# Changelog

## v1.0.0

- feat: journal action date-picker respect edn config `start-of-week`
- feat: add move to block uuid, support uuid with embed or ref format.
- feat: convert it to paid plugin for better maintainance.
- fix: move multi blocks will not fail fast, but ignore empty blocks.
- fix: cut hierarchial blocks tree.
- chore: upgrade deps

## v0.1.0

- feat: add move block page icon
- feat: add favorites list
- feat: add scenario to favorites directly
- feat: make page auto complete clearable
- feat: make scenario history and favorites clearable and deletable
- feat: change history and favorites order from new to old
- feat: make history and favorites permanent in assets
- feat: favorites support drag and drop
- fix: sometime enter key can not trigger submit
- infra: upgrade deps.

## v0.0.13

- fix: remove version indicator in the title bar.
- feat: add tomorrow, yesterday option.
- feat: add history panel for quick selection.
- feat: add "Cut content and keep embed to target"

## v0.0.12

- fix: try to fix context menu command not work

## v0.0.11

- fix: try to fix console error.
- feat: add a version indicator.
- infra: upgrade deps.

## v0.0.10

- fix: try to fix console error

## v0.0.9

- fix: timezone issue

## v0.0.8

- feat: add block embed action

## v0.0.7

- fix: timezone issue

## v0.0.6

- fix: remove copy ref to contents context command, not that useful.
- fix: add copy to current page and choose at top or bottom.

## v0.0.5

- fix: optimize cut content action using moveBlock

## v0.0.4

- fix: adjust UI style.

## v0.0.3

- infra: change build tool from Webpack to Vite
- infra: add Github Actions for release
- refactor: rename this plugin from `copy ref to journal` to `move block`, add a UI to control
