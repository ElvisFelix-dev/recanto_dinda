import { cloneElement, isValidElement } from 'react'

/** Tooltip acessível e consistente para controles administrativos. */
export default function Tooltip({ content, children }) {
  if (!content || !isValidElement(children)) return children
  return cloneElement(children, {
    title: content,
    'aria-label': children.props['aria-label'] || content,
  })
}
