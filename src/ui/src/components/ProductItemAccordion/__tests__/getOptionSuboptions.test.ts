import { getOptionSuboptions, getProductOptionSummaryLabels } from '../getOptionSuboptions'

const size = {
  name: 'Size',
  rank: 1,
  suboptions: [
    { name: 'Large', rank: 2 },
    { name: 'Regular', rank: 1 }
  ]
}

describe('getOptionSuboptions', () => {
  it('returns suboptions sorted by rank', () => {
    expect(getOptionSuboptions(size).map((item: { name: string }) => item.name)).toEqual(['Regular', 'Large'])
  })

  it('returns an empty list when suboptions are missing or not an array', () => {
    expect(getOptionSuboptions({ name: 'Size' })).toEqual([])
    expect(getOptionSuboptions({ name: 'Size', suboptions: null })).toEqual([])
    expect(getOptionSuboptions({ name: 'Size', suboptions: { 1: { name: 'Regular' } } })).toEqual([])
    expect(getOptionSuboptions(undefined)).toEqual([])
  })
})

describe('getProductOptionSummaryLabels', () => {
  it('builds labels from option and suboption names', () => {
    expect(getProductOptionSummaryLabels([size])).toEqual(['Size: Regular', 'Size: Large'])
  })

  it('skips options with missing suboptions instead of throwing', () => {
    expect(getProductOptionSummaryLabels([
      { name: 'Size', rank: 1 },
      { name: 'Toppings', rank: 2, suboptions: [{ name: 'Cheese', rank: 1 }] }
    ])).toEqual(['Toppings: Cheese'])
  })

  it('returns an empty list for missing options', () => {
    expect(getProductOptionSummaryLabels(undefined)).toEqual([])
    expect(getProductOptionSummaryLabels(null)).toEqual([])
  })
})
