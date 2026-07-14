const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
document.documentElement.setAttribute("saved-theme", userPref)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const themeChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("saved-theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  // 初期表示も現在の OS 設定に合わせる（SPA 遷移後も再同期）
  const initial = colorSchemeMediaQuery.matches ? "dark" : "light"
  document.documentElement.setAttribute("saved-theme", initial)
  emitThemeChangeEvent(initial)

  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
})
