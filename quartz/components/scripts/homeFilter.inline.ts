function setupHomeFilter() {
  const cats = document.getElementById("hee-home-cats")
  const cardsRoot = document.getElementById("hee-home-cards")
  if (!cats || !cardsRoot) return

  const cards = Array.from(cardsRoot.querySelectorAll<HTMLElement>(".hee-home-card"))

  const onClick = (e: Event) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".hee-home-cat")
    if (!btn || !cats.contains(btn)) return

    const selected = btn.getAttribute("data-cat") ?? "all"
    cats.querySelectorAll(".hee-home-cat").forEach((b) => {
      b.classList.toggle("active", b === btn)
    })

    cards.forEach((card) => {
      const cat = card.getAttribute("data-cat") ?? ""
      const show = selected === "all" || cat === selected
      card.classList.toggle("hide", !show)
    })
  }

  cats.addEventListener("click", onClick)
  window.addCleanup(() => cats.removeEventListener("click", onClick))
}

document.addEventListener("nav", setupHomeFilter)
window.addEventListener("DOMContentLoaded", setupHomeFilter)
