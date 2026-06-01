import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponentProps } from "./quartz/components/types"

const notIndex = (page: QuartzComponentProps) => page.fileData.slug !== "index"

function hideOnIndex(component: Parameters<typeof Component.ConditionalRender>[0]["component"]) {
  return Component.ConditionalRender({ component, condition: notIndex })
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: hideOnIndex(
    Component.Footer({
      links: {
        "タグ一覧 / Tags": "/tags/",
        "認知 · 2026-05-26 · 韻を踏む気恥ずかしさは露出感": "/posts/2026-05-26-rhyme-exposure",
        HOME: "/",
        posts: "/posts/",
        About: "/about",
        Contact: "/contact",
        "Privacy Policy": "/privacy",
      },
    }),
  ),
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
  Component.Explorer(),
]

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
  left: sidebarLeft.map((c) => hideOnIndex(c)),
  right: [
    hideOnIndex(Component.DesktopOnly(Component.TableOfContents())),
    hideOnIndex(Component.Backlinks()),
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
    Component.Explorer(),
  ],
  right: [],
}
