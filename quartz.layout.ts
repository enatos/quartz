import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponentProps } from "./quartz/components/types"
import { HEE_CATEGORY_FOLDERS, HEE_RITUAL_FOLDER } from "./quartz/heeCategories"

const notIndex = (page: QuartzComponentProps) => page.fileData.slug !== "index"

function hideOnIndex(component: Parameters<typeof Component.ConditionalRender>[0]["component"]) {
  return Component.ConditionalRender({ component, condition: notIndex })
}

// 左ナビの Explorer 設定（くろさん追記）
// - title: ""            … 「エクスプローラー」という見出しラベルを消す
// - folderDefaultState   … カテゴリを開いた状態で表示（記事リンクが最初から見える）
// - filterFn             … About / Contact / Privacy / タグを左ナビから除外（フッターには残す）
// - sortFn               … カテゴリを make→summon→words→tune の固定順に、記事同士は名前順
const explorer = Component.Explorer({
  title: "",
  folderDefaultState: "open",
  filterFn: (node) => {
    const omit = new Set(["about", "contact", "privacy", "tags"])
    return !omit.has((node.slugSegment ?? node.displayName).toLowerCase())
  },
  sortFn: (a, b) => {
    const order = [...HEE_CATEGORY_FOLDERS, HEE_RITUAL_FOLDER]
    const ai = order.indexOf(a.slugSegment ?? "")
    const bi = order.indexOf(b.slugSegment ?? "")
    if (ai !== -1 && bi !== -1) return ai - bi // カテゴリ同士は固定順
    if (ai !== -1) return -1 // カテゴリを上に
    if (bi !== -1) return 1
    return (a.displayName ?? "").localeCompare(b.displayName ?? "", "ja") // 記事同士は名前順
  },
})

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    creditName: "ねこたこ",
    links: {
      HOME: "/",
      About: "/about",
      Contact: "/contact",
      "Privacy Policy": "/privacy",
    },
  }),
}

const sidebarLeft = [
  Component.PageTitle(),
  Component.MobileOnly(Component.Spacer()),
  Component.Flex({
    components: [
      {
        Component: Component.Search(),
        grow: true,
      },
      { Component: Component.Darkmode() },
      { Component: Component.ReaderMode() },
    ],
  }),
  explorer,
]

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes(),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: notIndex,
    }),
    hideOnIndex(Component.ArticleTitle()),
    hideOnIndex(Component.ContentMeta()),
    hideOnIndex(Component.TagList()),
  ],
  left: sidebarLeft,
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.Michisuji()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    explorer,
  ],
  right: [],
}
