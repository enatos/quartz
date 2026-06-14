export const HEE_CATEGORIES = [
  { id: "いろいろつくってみる", slug: "make", sub: "AIチームと、サイトやアプリをこしらえる" },
  { id: "化け物を召喚する", slug: "summon", sub: "すごい思想家の視点を借りて、世界を見てみる" },
  { id: "言葉をほどいてみる", slug: "words", sub: "道端でひっかかった、ことばのこと" },
  { id: "日常をチューニングする", slug: "tune", sub: "暮らしと自分を、ちょっと整える" },
] as const

export const HEE_CATEGORY_FOLDERS = HEE_CATEGORIES.map((c) => c.slug)

export type HeeCategory = (typeof HEE_CATEGORIES)[number]["id"]
