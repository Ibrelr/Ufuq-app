import { Fragment } from 'react'

const LATIN = /([A-Za-z][A-Za-z0-9’'/+\-…]*(?:[ ][A-Za-z0-9][A-Za-z0-9’'/+\-…]*)*[?!.]?)/g

/**
 * Arabic text with English examples inside it. Each English run is isolated with <bdi>,
 * so its punctuation and word order stay correct inside right-to-left text.
 */
export function MixedText({ text }: { text: string }) {
  const parts = text.split(LATIN)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <bdi key={i} dir="ltr" lang="en" className="font-bold text-primary-dark">
            {p}
          </bdi>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}
