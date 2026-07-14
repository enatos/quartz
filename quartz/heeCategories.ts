export const HEE_CATEGORIES = [
  {
    id: "1_頼みかた",
    name: "頼みかた",
    slug: "ask",
    sub: "AIに何をどう頼むか",
  },
  {
    id: "2_まかせる仕組み",
    name: "まかせる仕組み",
    slug: "delegate",
    sub: "ハーネス・ループ・トークン",
  },
  {
    id: "3_モデルと機能",
    name: "モデルと機能",
    slug: "models",
    sub: "新モデル・新ツールで何ができるか",
  },
  {
    id: "4_AIと人間",
    name: "AIと人間",
    slug: "human",
    sub: "意識・優しさ・静かな怖さ、答えの出ない話",
  },
  {
    id: "5_ためる",
    name: "ためる",
    slug: "store",
    sub: "情報の集め方と引き出せる置き方",
  },
  {
    id: "6_書く",
    name: "書く",
    slug: "write",
    sub: "AI要約時代の発信スタンス",
  },
  {
    id: "7_からだと言葉",
    name: "からだと言葉",
    slug: "body",
    sub: "生き物としての人間・ことば・からだの感覚",
  },
  {
    id: "8_ねこたこ工房",
    name: "ねこたこ工房",
    slug: "studio",
    sub: "AIチームの布陣といま動いてる取り組み",
  },
] as const

export const HEE_CATEGORY_FOLDERS = HEE_CATEGORIES.map((c) => c.slug)

export type HeeCategory = (typeof HEE_CATEGORIES)[number]["id"]

export function categorySlugFromId(category: string): string | null {
  for (const { id, slug } of HEE_CATEGORIES) {
    if (category === id || category.startsWith(id)) return slug
  }
  return null
}
