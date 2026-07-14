import { QuartzTransformerPlugin } from "../types"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/**
 * frontmatter の date が存在する場合、YYYY-MM-DD 以外ならビルドを停止する。
 * 公開原稿の手動追加で日付が壊れる事故を防ぐ。
 */
export const ValidateFrontmatterDate: QuartzTransformerPlugin = () => ({
  name: "ValidateFrontmatterDate",
  markdownPlugins() {
    return [
      () => {
        return (_tree, file) => {
          const date = file.data.frontmatter?.date
          if (date == null || date === "") return

          const raw = typeof date === "string" ? date : String(date)
          if (DATE_RE.test(raw)) return

          const name = file.data.relativePath ?? file.basename ?? file.path ?? "(unknown)"
          throw new Error(
            `frontmatter date must be YYYY-MM-DD (got ${JSON.stringify(raw)}): ${name}`,
          )
        }
      },
    ]
  },
})
