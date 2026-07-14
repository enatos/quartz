import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponentProps } from "./quartz/components/types"
import { QuartzPluginData } from "./quartz/plugins/vfile"

const notIndex = (page: QuartzComponentProps) => page.fileData.slug !== "index"

function hideOnIndex(component: Parameters<typeof Component.ConditionalRender>[0]["component"]) {
  return Component.ConditionalRender({ component, condition: notIndex })
}

/** フォルダ index / トップ / タグを除き、記事本体だけを RecentNotes に載せる */
function isArticleBody(f: QuartzPluginData): boolean {
  const slug = f.slug ?? ""
  if (!slug || slug === "index") return false
  if (slug.endsWith("/index")) return false
  if (slug.startsWith("tags/")) return false
  return true
}

function isArticlePage(page: QuartzComponentProps): boolean {
  return isArticleBody(page.fileData)
}

const recentNotes = Component.RecentNotes({
  title: "最近の記事",
  limit: 3,
  showTags: false,
  filter: isArticleBody,
})

const sidebarLeft = [
  Component.PageTitle(),
  Component.MobileOnly(Component.Spacer()),
  Component.Search(),
  recentNotes,
]

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    // ダークモード切替UIなし。OS prefers-color-scheme に追従するだけ
    Component.ThemeFollow(),
    Component.ConditionalRender({
      component: Component.Graph(),
      condition: isArticlePage,
    }),
  ],
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

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: notIndex,
    }),
    hideOnIndex(Component.ArticleTitle()),
    hideOnIndex(Component.ContentMeta()),
    hideOnIndex(Component.TagList()),
  ],
  left: sidebarLeft,
  right: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: sidebarLeft,
  right: [],
}
