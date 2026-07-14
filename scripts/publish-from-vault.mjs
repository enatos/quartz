#!/usr/bin/env node
/**
 * Vault（3_推敲中）→ quartz/content へ記事をコピーする。
 * frontmatter は title / date / category / tags のみ残し、本文は改変しない。
 * Vault 側の原稿は一切書き換えない。
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import yaml from "js-yaml"

const ALLOWED_KEYS = ["title", "date", "category", "tags"]

const HEE_CATEGORIES = [
  { id: "1_頼みかた", name: "頼みかた", slug: "ask", sub: "AIに何をどう頼むか" },
  { id: "2_まかせる仕組み", name: "まかせる仕組み", slug: "delegate", sub: "ハーネス・ループ・トークン" },
  { id: "3_モデルと機能", name: "モデルと機能", slug: "models", sub: "新モデル・新ツールで何ができるか" },
  { id: "4_AIと人間", name: "AIと人間", slug: "human", sub: "意識・優しさ・静かな怖さ、答えの出ない話" },
  { id: "5_ためる", name: "ためる", slug: "store", sub: "情報の集め方と引き出せる置き方" },
  { id: "6_書く", name: "書く", slug: "write", sub: "AI要約時代の発信スタンス" },
  { id: "7_からだと言葉", name: "からだと言葉", slug: "body", sub: "生き物としての人間・ことば・からだの感覚" },
  { id: "8_ねこたこ工房", name: "ねこたこ工房", slug: "studio", sub: "AIチームの布陣といま動いてる取り組み" },
]

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "..")

const DEFAULT_VAULT =
  "/Users/eriram/Documents/Obsidian Vault/2_へーちょー/個別記事/3_推敲中"
const DEFAULT_CONTENT = path.join(REPO_ROOT, "content")

function categorySlugFromId(category) {
  const raw = String(category ?? "")
  for (const { id, slug } of HEE_CATEGORIES) {
    if (raw === id || raw.startsWith(id)) return slug
  }
  return null
}

function stripFrontmatter(data) {
  const out = {}
  for (const key of ALLOWED_KEYS) {
    if (data[key] !== undefined) out[key] = data[key]
  }
  return out
}

function formatDate(value) {
  if (value == null || value === "") return value
  if (typeof value === "string") return value
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getUTCFullYear()
    const m = String(value.getUTCMonth() + 1).padStart(2, "0")
    const d = String(value.getUTCDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }
  return String(value)
}

function dumpMarkdown(data, content) {
  const cleaned = stripFrontmatter(data)
  if (cleaned.date !== undefined) cleaned.date = formatDate(cleaned.date)

  const fm = yaml.dump(cleaned, {
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  })
  // gray-matter 相当: --- / yaml / --- / body（本文の前後改行はソースに合わせる）
  const body = content.startsWith("\n") ? content : `\n${content}`
  return `---\n${fm}---${body.endsWith("\n") ? body : `${body}\n`}`
}

function ensureCategoryIndexes(contentDir) {
  for (const { id, slug } of HEE_CATEGORIES) {
    const dir = path.join(contentDir, slug)
    fs.mkdirSync(dir, { recursive: true })
    const indexPath = path.join(dir, "index.md")
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(indexPath, `---\ntitle: ${id}\n---\n`, "utf8")
    }
  }
}

function publish({ vaultDir, contentDir, dryRun = false }) {
  ensureCategoryIndexes(contentDir)

  const entries = fs
    .readdirSync(vaultDir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".md"))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, "ja"))

  if (entries.length === 0) {
    console.error(`No markdown files found in: ${vaultDir}`)
    process.exit(1)
  }

  const published = []
  for (const name of entries) {
    const src = path.join(vaultDir, name)
    const raw = fs.readFileSync(src, "utf8")
    const parsed = matter(raw)
    const category = parsed.data.category
    const slug = categorySlugFromId(category)
    if (!slug) {
      console.error(`Unknown category ${JSON.stringify(category)} in ${name}`)
      process.exit(1)
    }

    const outPath = path.join(contentDir, slug, name)
    const outText = dumpMarkdown(parsed.data, parsed.content)

    // 安全確認: 落とすべきキーが出力に残っていないこと
    const banned = ["model", "moon", "問いID", "rag", "元クリップ", "関連リンク"]
    const head = outText.split("---")[1] ?? ""
    for (const key of banned) {
      if (new RegExp(`^${key}\\s*:`, "m").test(head)) {
        console.error(`Banned frontmatter key leaked (${key}) in ${name}`)
        process.exit(1)
      }
    }

    if (!dryRun) {
      fs.mkdirSync(path.dirname(outPath), { recursive: true })
      fs.writeFileSync(outPath, outText, "utf8")
    }
    published.push({ name, slug, outPath })
    console.log(`${dryRun ? "[dry-run] " : ""}${name} → ${slug}/`)
  }

  console.log(`\nPublished ${published.length} article(s).`)
  return published
}

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const vaultArg = args.find((a) => a.startsWith("--vault="))?.slice("--vault=".length)
const contentArg = args.find((a) => a.startsWith("--content="))?.slice("--content=".length)

publish({
  vaultDir: vaultArg ?? DEFAULT_VAULT,
  contentDir: contentArg ?? DEFAULT_CONTENT,
  dryRun,
})
