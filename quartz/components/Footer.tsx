import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
  creditName?: string
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    const credit = opts?.creditName ? (
      opts.creditName
    ) : (
      <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a>
    )
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          {opts?.creditName ? (
            <>
              {credit} © {year}
            </>
          ) : (
            <>
              {i18n(cfg.locale).components.footer.createdWith} {credit} © {year}
            </>
          )}
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
