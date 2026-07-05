export const HEE_CATEGORIES = [
  { id: "いろいろつくってみる", slug: "make", sub: "AIチームと、サイトやアプリをこしらえる" },
  { id: "化け物を召喚する", slug: "summon", sub: "すごい思想家の視点を借りて、世界を見てみる" },
  { id: "言葉をほどいてみる", slug: "words", sub: "道端でひっかかった、ことばのこと" },
  { id: "日常をチューニングする", slug: "tune", sub: "暮らしと自分を、ちょっと整える" },
] as const

export const HEE_CATEGORY_FOLDERS = HEE_CATEGORIES.map((c) => c.slug)

/** トップ・Explorer に載せる暫定バンドル（カテゴリ再編前の置き場） */
export const HEE_RITUAL_FOLDER = "リチュアル" as const

export const HEE_HOME_FOLDERS = [...HEE_CATEGORY_FOLDERS, HEE_RITUAL_FOLDER] as const

export type HeeCategory = (typeof HEE_CATEGORIES)[number]["id"]
