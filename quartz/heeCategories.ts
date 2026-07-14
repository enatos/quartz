export const HEE_CATEGORIES = [
  {
    id: "1_頼みかた",
    slug: "ask",
    sub: "AIに何を、どう頼むか。うまくいかなかったところのメモ",
  },
  {
    id: "2_まかせる仕組み",
    slug: "delegate",
    sub: "ハーネス、ループ、トークン。AIに任せるための仕組みを考える",
  },
  {
    id: "3_モデルと機能",
    slug: "models",
    sub: "新しいモデルやツールで、何ができるようになったのかを見にいく",
  },
  {
    id: "4_AIと人間",
    slug: "human",
    sub: "意識、優しさ、静かな怖さ。答えの出ない話",
  },
  {
    id: "5_ためる",
    slug: "store",
    sub: "情報の集め方と、あとで引き出せる形での置き方",
  },
  {
    id: "6_書く",
    slug: "write",
    sub: "AI要約の時代に、何をどう書くか。発信のスタンス",
  },
  {
    id: "7_からだと言葉",
    slug: "body",
    sub: "生き物としての人間、ことば、思い、からだの感覚",
  },
  {
    id: "8_ねこたこ工房",
    slug: "studio",
    sub: "AIチームの布陣といま動いてる取り組み",
  },
] as const

export const HEE_CATEGORY_FOLDERS = HEE_CATEGORIES.map((c) => c.slug)

/** トップ・Explorer に載せる暫定バンドル（カテゴリ再編前の置き場） */
export const HEE_RITUAL_FOLDER = "リチュアル" as const

export const HEE_HOME_FOLDERS = [...HEE_CATEGORY_FOLDERS, HEE_RITUAL_FOLDER] as const

export type HeeCategory = (typeof HEE_CATEGORIES)[number]["id"]

export function categorySlugFromId(category: string): string | null {
  for (const { id, slug } of HEE_CATEGORIES) {
    if (category === id || category.startsWith(id)) return slug
  }
  return null
}
