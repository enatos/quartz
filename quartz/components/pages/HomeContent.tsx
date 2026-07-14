import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { getDate } from "../Date"
import { HEE_CATEGORIES, HEE_HOME_FOLDERS, type HeeCategory } from "../../heeCategories"
import style from "../styles/home.scss"
// @ts-ignore
import homeFilterScript from "../scripts/homeFilter.inline"

function isHeychoPost(file: QuartzPluginData): boolean {
  const slug = file.slug ?? ""
  const folder = slug.split("/")[0]
  if (!HEE_HOME_FOLDERS.includes(folder)) return false
  if (slug.endsWith("/index")) return false
  return true
}

function parseCategory(frontmatter: QuartzPluginData["frontmatter"]): HeeCategory | null {
  const raw = String(frontmatter?.category ?? "")
  for (const { id } of HEE_CATEGORIES) {
    if (raw.startsWith(id)) return id
  }
  return null
}

function formatDateJa(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatMoon(frontmatter: QuartzPluginData["frontmatter"]): string | null {
  if (frontmatter?.moon != null && frontmatter.moon !== "") {
    return `月齢 ${frontmatter.moon}`
  }
  if (frontmatter?.moonAge != null) {
    const raw = String(frontmatter.moonAge)
    const match = raw.match(/月齢\s*([\d.]+)/)
    if (match) return `月齢 ${match[1]}`
    return raw
  }
  return null
}

function thumbSvg(_category: HeeCategory | null) {
  return (
    <svg viewBox="0 0 50 50" aria-hidden="true">
      <path
        d="M9 30 Q20 16 31 26 T46 22"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
      />
      <path
        d="M9 36 Q21 24 32 32"
        fill="none"
        stroke="currentColor"
        opacity="0.25"
        stroke-width="1"
      />
    </svg>
  )
}

const HomeContent: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
  const posts = allFiles.filter(isHeychoPost).sort((a, b) => {
    const da = getDate(cfg, a)
    const db = getDate(cfg, b)
    if (da && db) return db.getTime() - da.getTime()
    return (a.frontmatter?.title ?? "").localeCompare(b.frontmatter?.title ?? "")
  })

  const visualSrc = resolveRelative(fileData.slug!, "media/main-visual.png" as FullSlug)

  return (
    <article class="heechoo-home homepage">
      <h1 class="heechoo-sr-only">へーちょー — あとから見て「へー」って思うメモ帳</h1>
      <div class="heechoo-home-layout">
        <aside class="heechoo-home-sidebar">
          <div class="heechoo-home-brand">
            <div class="heechoo-home-brand-title">へーちょー</div>
            <div class="heechoo-home-brand-sub">あとから見て「へー」って思うメモ帳</div>
          </div>

          <nav class="heechoo-home-cats" id="heechoo-home-cats" aria-label="カテゴリ">
            <button type="button" class="heechoo-home-cat heechoo-home-cat--active" data-cat="all">
              すべて
            </button>
            {HEE_CATEGORIES.map(({ id, sub }) => (
              <button type="button" class="heechoo-home-cat" data-cat={id}>
                {id} <span class="heechoo-home-en">{sub}</span>
              </button>
            ))}
          </nav>

          <div class="heechoo-home-cards" id="heechoo-home-cards" aria-label="コンテンツ一覧">
            {posts.map((post) => {
              const category = parseCategory(post.frontmatter)
              const date = getDate(cfg, post)
              const moon = formatMoon(post.frontmatter)
              const metaParts = [
                date ? formatDateJa(date) : null,
                moon,
              ].filter(Boolean)

              const thumbnail = post.frontmatter?.thumbnail as string | undefined
              const thumbSrc = thumbnail
                ? resolveRelative(fileData.slug!, thumbnail as FullSlug)
                : null

              return (
                <a
                  class="heechoo-home-card"
                  href={resolveRelative(fileData.slug!, post.slug!)}
                  data-cat={category ?? ""}
                >
                  <span class="heechoo-home-card-thumb" aria-hidden="true">
                    {thumbSrc ? (
                      <img src={thumbSrc} alt="" loading="lazy" />
                    ) : (
                      thumbSvg(category)
                    )}
                  </span>
                  <span class="heechoo-home-card-body">
                    <span class="heechoo-home-card-title">{post.frontmatter!.title}</span>
                    {metaParts.length > 0 && (
                      <span class="heechoo-home-card-meta">{metaParts.join(" ・ ")}</span>
                    )}
                  </span>
                </a>
              )
            })}
          </div>
        </aside>

        <main class="heechoo-home-main">
          <figure>
            <img
              src={visualSrc}
              alt="白い宇宙に手描きの星々が散らばり、いくつかが線で結ばれて星座になりかけている図"
              width="1448"
              height="1086"
            />
          </figure>
        </main>
      </div>
    </article>
  )
}

HomeContent.css = style
HomeContent.afterDOMLoaded = homeFilterScript

export default (() => HomeContent) satisfies QuartzComponentConstructor
