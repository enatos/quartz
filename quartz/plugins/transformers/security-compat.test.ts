import test from "node:test"
import assert from "node:assert/strict"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { toHtml } from "hast-util-to-html"
import { VFile } from "vfile"
import { FrontMatter } from "./frontmatter"
import { Latex } from "./latex"
import { BuildCtx } from "../../util/ctx"
import type { Root } from "hast"

function context(): BuildCtx {
  return { cfg: { configuration: { locale: "en-US" } }, allSlugs: [] } as unknown as BuildCtx
}

test("patched YAML and TOML engines preserve frontmatter metadata", async () => {
  for (const [language, delimiters, input] of [
    ["yaml", "---", 'title: YAML fixture\ntags: [one, two]'],
    ["toml", "+++", 'title = "TOML fixture"\ntags = ["one", "two"]'],
  ] as const) {
    const ctx = context()
    const plugin = FrontMatter({ language, delimiters })
    const processor = unified().use(remarkParse).use(plugin.markdownPlugins!(ctx))
    const file = new VFile({ path: "fixture.md", value: `${delimiters}\n${input}\n${delimiters}\n# Test` })
    await processor.run(processor.parse(file), file)
    assert.equal(file.data.frontmatter?.title, language === "yaml" ? "YAML fixture" : "TOML fixture")
    assert.deepEqual(file.data.frontmatter?.tags, ["one", "two"])
  }
})

test("patched KaTeX renders math and uses matching browser resources", async () => {
  const ctx = context()
  const plugin = Latex({ renderEngine: "katex" })
  const processor = unified().use(remarkParse).use(plugin.markdownPlugins!(ctx)).use(remarkRehype).use(plugin.htmlPlugins!(ctx))
  const file = new VFile({ value: "$x^2 + y^2 = z^2$" })
  const tree = await processor.run(processor.parse(file), file)
  assert.match(toHtml(tree as Root), /class="katex"/)
  assert.match(JSON.stringify(plugin.externalResources!(ctx)), /katex@0\.18\.2/)
})

test("patched MathJax XML dependency retains SVG rendering", async () => {
  const ctx = context()
  const plugin = Latex({ renderEngine: "mathjax" })
  const processor = unified().use(remarkParse).use(plugin.markdownPlugins!(ctx)).use(remarkRehype).use(plugin.htmlPlugins!(ctx))
  const file = new VFile({ value: "$x + 1$" })
  const tree = await processor.run(processor.parse(file), file)
  assert.match(toHtml(tree as Root), /<svg/)
})

test("frontmatter rejects executable or unregistered language selectors", async () => {
  for (const language of ["javascript", "js", "coffee", "custom"]) {
    const plugin = FrontMatter()
    const processor = unified().use(remarkParse).use(plugin.markdownPlugins!(context()))
    const file = new VFile({ path: "fixture.md", value: `---${language}\n{}\n---\n# Test` })
    await assert.rejects(processor.run(processor.parse(file), file), /Unsupported frontmatter language/)
  }
})
