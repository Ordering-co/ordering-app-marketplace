import { useEffect, useState } from 'react'
import { useApi } from '@components'

const cache = new Map<string, string | null>()

const pickCached = (ids: string[]): Record<string, string | null> => Object.fromEntries(ids.filter((id) => cache.has(id)).map((id) => [id, cache.get(id) ?? null]))

export const useBusinessVerticals = (businessIds: any[]) => {
  const [ordering]: any = useApi()
  const key = (businessIds || []).filter((id) => id !== null && id !== undefined && id !== '').map(String).sort().join(',')
  const [verticals, setVerticals] = useState<Record<string, string | null>>(() => pickCached(key ? key.split(',') : []))

  useEffect(() => {
    let active = true
    const ids = key ? key.split(',') : []
    const missing = ids.filter((id) => !cache.has(id))
    if (!missing.length) {
      setVerticals(pickCached(ids))
      return
    }
    Promise.all(missing.map(async (id) => {
      try {
        const { content } = await ordering.businesses(Number(id)).select(['id', 'vertical']).get()
        if (!content?.error) cache.set(id, content?.result?.vertical ?? null)
      } catch (err) {}
    })).then(() => {
      if (active) setVerticals(pickCached(ids))
    })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return verticals
}
