import { cloneElement, Children } from "react"
import { useProfile } from "../../utils/dataHooks"

export default function ProtectedText({ children }) {
  const { profile } = useProfile()
  const limited = profile?.org.limited

  const replaceText = (child) => {
    if (child && typeof child.props.children === "string") {
      return cloneElement(child, {
        children: child.props.children.replace(/\S/g, "XX"),
      })
    }
    if (child && Array.isArray(child.props.children)) {
      return cloneElement(child, {
        children: Children.map(child.props.children, replaceText),
      })
    }
    return child
  }

  if (typeof children !== "string") {
    if (limited) {
      return Children.map(children, replaceText)
    }
    return children
  }

  // create a string of fake characters same length and keep new lines
  const fakeChars = children.replace(/\S/g, "XX")

  return limited ? <span className="protected">{fakeChars}</span> : children
}
