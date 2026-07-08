import { JSX } from "preact"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import tocStyle from "./styles/toc.scss"
import michisujiStyle from "./styles/michisuji.scss"
import { classNames } from "../util/lang"

// @ts-ignore
import script from "./scripts/toc.inline"
import OverflowListFactory from "./OverflowList"
import { concatenateResources } from "../util/resources"

interface Options {
  layout: "modern" | "legacy"
}

const defaultOptions: Options = {
  layout: "modern",
}

let numTocs = 0

function buildMichisujiItems(
  toc: NonNullable<QuartzComponentProps["fileData"]["toc"]>,
  fm: Record<string, unknown>,
) {
  const moves = (fm.michisuji as string[] | undefined) ?? []
  const lead = fm.michisujiLead as string | undefined
  const tail = fm.michisujiTail as string | undefined
  const items: JSX.Element[] = []

  if (lead) {
    items.push(
      <li key="michisuji-lead" class="michisuji-lead" aria-hidden="true">
        {lead}
      </li>,
    )
  }

  toc.forEach((tocEntry, i) => {
    items.push(
      <li key={tocEntry.slug} class={`depth-${tocEntry.depth}`}>
        <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
          {tocEntry.text}
        </a>
      </li>,
    )
    if (i < toc.length - 1 && moves[i]) {
      items.push(
        <li key={`michisuji-move-${i}`} class="michisuji-move" aria-hidden="true">
          {moves[i]}
        </li>,
      )
    }
  })

  if (tail) {
    items.push(
      <li key="michisuji-tail" class="michisuji-tail" aria-hidden="true">
        {tail}
      </li>,
    )
  }

  return items
}

export default ((opts?: Partial<Options>) => {
  const layout = opts?.layout ?? defaultOptions.layout
  const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory()

  const Michisuji: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    if (!fileData.toc) {
      return null
    }

    const fm = fileData.frontmatter ?? {}
    const id = `toc-${numTocs++}`
    const items = buildMichisujiItems(fileData.toc, fm)

    return (
      <div class={classNames(displayClass, "toc", "michisuji")}>
        <button
          type="button"
          class={fileData.collapseToc ? "collapsed toc-header" : "toc-header"}
          aria-controls={id}
          aria-expanded={!fileData.collapseToc}
        >
          <h3>目次</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="fold"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <OverflowList
          id={id}
          class={fileData.collapseToc ? "collapsed toc-content" : "toc-content"}
        >
          {items}
        </OverflowList>
      </div>
    )
  }

  Michisuji.css = [tocStyle, michisujiStyle]
  Michisuji.afterDOMLoaded = concatenateResources(script, overflowListAfterDOMLoaded)

  const LegacyMichisuji: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    if (!fileData.toc) {
      return null
    }

    const fm = fileData.frontmatter ?? {}
    const items = buildMichisujiItems(fileData.toc, fm)

    return (
      <details class="toc michisuji" open={!fileData.collapseToc}>
        <summary>
          <h3>目次</h3>
        </summary>
        <ul>{items}</ul>
      </details>
    )
  }
  LegacyMichisuji.css = [tocStyle, michisujiStyle]

  return layout === "modern" ? Michisuji : LegacyMichisuji
}) satisfies QuartzComponentConstructor
