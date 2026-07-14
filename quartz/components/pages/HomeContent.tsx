import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { FullSlug, resolveRelative } from "../../util/path"
import { HEE_CATEGORIES } from "../../heeCategories"
import style from "../styles/home.scss"

const HomeContent: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  return (
    <article class="heechoo-home homepage">
      <h1 class="heechoo-sr-only">へーちょー — あとから見て「へー」って思うメモ帳</h1>

      <section class="heechoo-cat-map" aria-label="カテゴリ">
        <ul class="heechoo-cat-grid">
          {HEE_CATEGORIES.map((cat, i) => {
            const num = String(i + 1).padStart(2, "0")
            const href = resolveRelative(fileData.slug!, `${cat.slug}/` as FullSlug)
            return (
              <li class="heechoo-cat-card">
                <a class="heechoo-cat-card-link" href={href}>
                  <span class="heechoo-cat-line" aria-hidden="true" />
                  <span class="heechoo-cat-num">{num}</span>
                  <span class="heechoo-cat-name">{cat.name}</span>
                  <span class="heechoo-cat-sub">{cat.sub}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </section>
    </article>
  )
}

HomeContent.css = style

export default (() => HomeContent) satisfies QuartzComponentConstructor
