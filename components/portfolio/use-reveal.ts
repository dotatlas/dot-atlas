'use client'

import { useEffect } from 'react'

/**
 * Arms every [data-reveal] / [data-wipe] element on the page: each gets
 * `.is-in` once it crosses into view. Content is visible without script
 * (the `.js` class gates the hidden state), so nothing can get stuck.
 */
export function useReveal() {
  useEffect(() => {
    // A fully clipped element never reports as intersecting, so a wipe is
    // watched through its parent and switched on with it.
    const targets = new Map<Element, HTMLElement[]>()
    const watch = (key: Element, el: HTMLElement) => {
      const list = targets.get(key)
      if (list) list.push(el)
      else targets.set(key, [el])
    }
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => watch(el, el))
    document
      .querySelectorAll<HTMLElement>('[data-wipe]')
      .forEach((el) => watch(el.parentElement ?? el, el))

    const show = (key: Element) => targets.get(key)?.forEach((el) => el.classList.add('is-in'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          show(e.target)
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px', threshold: 0 },
    )
    targets.forEach((_, key) => {
      // whatever is already on screen when the page arms comes in at once
      const r = key.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) show(key)
      else io.observe(key)
    })
    return () => io.disconnect()
  }, [])
}

/**
 * Reports which [data-part] element is crossing the middle band of the
 * viewport. Drives the lit component on the board.
 */
export function useActivePart(onChange: (id: string | null) => void) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-part]'))
    const visible = new Map<Element, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target, e.isIntersecting)
        const hit = els.find((el) => visible.get(el))
        onChange(hit ? hit.dataset.part! : null)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [onChange])
}
