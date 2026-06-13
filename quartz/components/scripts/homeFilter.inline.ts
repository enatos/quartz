function setupHomeFilter() {
  const cats = document.getElementById("heechoo-home-cats")
  const cardsRoot = document.getElementById("heechoo-home-cards")
  if (!cats || !cardsRoot) return

  const cards = Array.from(cardsRoot.querySelectorAll<HTMLElement>(".heechoo-home-card"))

  const onClick = (e: Event) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".heechoo-home-cat")
    if (!btn || !cats.contains(btn)) return

    const selected = btn.getAttribute("data-cat") ?? "all"
    cats.querySelectorAll(".heechoo-home-cat").forEach((b) => {
      b.classList.toggle("heechoo-home-cat--active", b === btn)
    })

    cards.forEach((card) => {
      const cat = card.getAttribute("data-cat") ?? ""
      const show = selected === "all" || cat === selected
      card.classList.toggle("heechoo-home-card--hidden", !show)
    })
  }

  cats.addEventListener("click", onClick)
  window.addCleanup(() => cats.removeEventListener("click", onClick))
}

document.addEventListener("nav", setupHomeFilter)
window.addEventListener("DOMContentLoaded", setupHomeFilter)
