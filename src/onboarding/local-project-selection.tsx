import { createContext, useContext } from 'react'

export const LocalProjectSelectionContext = createContext<{ project: string; franchiseSlug: string | null } | null>(null)
export const useLocalProjectSelection = () => useContext(LocalProjectSelectionContext)
