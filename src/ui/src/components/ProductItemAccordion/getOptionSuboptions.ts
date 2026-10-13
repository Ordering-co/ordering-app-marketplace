function asList (value: unknown) {
  return Array.isArray(value) ? value : []
}

export function getOptionSuboptions (option: unknown) {
  const raw = option && typeof option === 'object'
    ? (option as { suboptions?: unknown }).suboptions
    : undefined
  return [...asList(raw)].sort((a: any, b: any) => (a?.rank ?? 0) - (b?.rank ?? 0))
}

export function getProductOptionSummaryLabels (options: unknown) {
  return [...asList(options)]
    .sort((a: any, b: any) => (a?.rank ?? 0) - (b?.rank ?? 0))
    .flatMap((option: any) =>
      getOptionSuboptions(option).map((suboption: any) => `${option.name}: ${suboption.name}`)
    )
}
