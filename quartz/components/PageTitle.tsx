import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const SITE_TAGLINE =
  "「へー」って思うメモ帳。AI・ことば・暮らしについて、考えたことと試したこと。"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "page-title-block")}>
      <h2 class="page-title">
        <a href={baseDir}>{title}</a>
      </h2>
      <p class="page-title-tagline">{SITE_TAGLINE}</p>
    </div>
  )
}

PageTitle.css = `
.page-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin: 0;
}

.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}

.page-title-tagline {
  margin: 0;
  color: var(--darkgray);
  font-family: var(--bodyFont);
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.7;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
