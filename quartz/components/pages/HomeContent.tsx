import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import style from "../styles/home.scss"

function countPostsInFolder(allFiles: QuartzPluginData[], folderSlug: string): number {
  const prefix = `${folderSlug}/`
  return allFiles.filter((f) => {
    const slug = f.slug ?? ""
    if (!slug.startsWith(prefix)) return false
    if (slug.endsWith("/index")) return false
    return true
  }).length
}

const HomeContent: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const askCount = countPostsInFolder(allFiles, "ask")
  const delegateCount = countPostsInFolder(allFiles, "delegate")
  const modelsCount = countPostsInFolder(allFiles, "models")
  const humanCount = countPostsInFolder(allFiles, "human")
  const storeCount = countPostsInFolder(allFiles, "store")
  const writeCount = countPostsInFolder(allFiles, "write")
  const bodyCount = countPostsInFolder(allFiles, "body")
  const studioCount = countPostsInFolder(allFiles, "studio")

  const rel = (slug: FullSlug) => resolveRelative(fileData.slug!, slug)

  return (
    <article class="heechoo-home homepage">
      <h1 class="heechoo-sr-only">へーちょー — あとから見て「へー」って思うメモ帳</h1>
      <p class="heechoo-home-lead">あとから見て「へー」って思うメモ帳</p>

      <section class="heechoo-theme-map" aria-label="テーマ">
        <ul class="heechoo-theme-grid">
          <li class="heechoo-theme-card">
            <a class="heechoo-theme-card-link" href={rel("ask/" as FullSlug)}>
              <span class="heechoo-theme-card-title">1_頼みかた</span>
              <span class="heechoo-theme-card-blurb">（プレースホルダ）</span>
              <span class="heechoo-theme-card-count">{askCount}本</span>
            </a>
          </li>
          <li class="heechoo-theme-card">
            <a class="heechoo-theme-card-link" href={rel("delegate/" as FullSlug)}>
              <span class="heechoo-theme-card-title">2_まかせる仕組み</span>
              <span class="heechoo-theme-card-blurb">（プレースホルダ）</span>
              <span class="heechoo-theme-card-count">{delegateCount}本</span>
            </a>
          </li>
          <li class="heechoo-theme-card">
            <a class="heechoo-theme-card-link" href={rel("models/" as FullSlug)}>
              <span class="heechoo-theme-card-title">3_モデルと機能</span>
              <span class="heechoo-theme-card-blurb">（プレースホルダ）</span>
              <span class="heechoo-theme-card-count">{modelsCount}本</span>
            </a>
          </li>
          <li class="heechoo-theme-card">
            <a class="heechoo-theme-card-link" href={rel("human/" as FullSlug)}>
              <span class="heechoo-theme-card-title">4_AIと人間</span>
              <span class="heechoo-theme-card-blurb">（プレースホルダ）</span>
              <span class="heechoo-theme-card-count">{humanCount}本</span>
            </a>
          </li>
          <li class="heechoo-theme-card">
            <a class="heechoo-theme-card-link" href={rel("store/" as FullSlug)}>
              <span class="heechoo-theme-card-title">5_ためる</span>
              <span class="heechoo-theme-card-blurb">（プレースホルダ）</span>
              <span class="heechoo-theme-card-count">{storeCount}本</span>
            </a>
          </li>
          <li class="heechoo-theme-card">
            <a class="heechoo-theme-card-link" href={rel("write/" as FullSlug)}>
              <span class="heechoo-theme-card-title">6_書く</span>
              <span class="heechoo-theme-card-blurb">（プレースホルダ）</span>
              <span class="heechoo-theme-card-count">{writeCount}本</span>
            </a>
          </li>
          <li class="heechoo-theme-card">
            <a class="heechoo-theme-card-link" href={rel("body/" as FullSlug)}>
              <span class="heechoo-theme-card-title">7_からだと言葉</span>
              <span class="heechoo-theme-card-blurb">（プレースホルダ）</span>
              <span class="heechoo-theme-card-count">{bodyCount}本</span>
            </a>
          </li>
          <li class="heechoo-theme-card">
            <a class="heechoo-theme-card-link" href={rel("studio/" as FullSlug)}>
              <span class="heechoo-theme-card-title">8_ねこたこ工房</span>
              <span class="heechoo-theme-card-blurb">（プレースホルダ）</span>
              <span class="heechoo-theme-card-count">{studioCount}本</span>
            </a>
          </li>
        </ul>
      </section>
    </article>
  )
}

HomeContent.css = style

export default (() => HomeContent) satisfies QuartzComponentConstructor
