import ContentConstructor from "./Content"
import HomeContentConstructor from "./HomeContent"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { concatenateResources } from "../../util/resources"

const Content = ContentConstructor()
const HomeContent = HomeContentConstructor()

const HeychoPageBody: QuartzComponent = (props: QuartzComponentProps) => {
  if (props.fileData.slug === "index") {
    return <HomeContent {...props} />
  }
  return <Content {...props} />
}

HeychoPageBody.css = concatenateResources(Content.css, HomeContent.css)

export default (() => HeychoPageBody) satisfies QuartzComponentConstructor
