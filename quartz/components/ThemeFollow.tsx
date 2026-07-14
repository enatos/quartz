/**
 * ダークモード切替ボタンなしで、OS の prefers-color-scheme に追従する。
 * localStorage の手動テーマは使わない（トグル廃止後に以前の選択が残るのを防ぐ）。
 */
// @ts-ignore
import themeFollowScript from "./scripts/themeFollow.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const ThemeFollow: QuartzComponent = () => <div class="theme-follow" hidden aria-hidden="true" />

ThemeFollow.beforeDOMLoaded = themeFollowScript

export default (() => ThemeFollow) satisfies QuartzComponentConstructor
