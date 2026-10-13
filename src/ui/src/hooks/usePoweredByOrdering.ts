import { useConfig } from '@components'

/**
 * Hook to know whether the Ordering branding must be displayed.
 * white_label_module overrides powered_by_ordering_module: a project that
 * bought white label never shows the branding, even if the powered-by module
 * is active on its plan.
 */
export const usePoweredByOrdering = () => {
  const [{ configs }] = useConfig()

  return !!configs?.powered_by_ordering_module?.value && !configs?.white_label_module?.value
}
