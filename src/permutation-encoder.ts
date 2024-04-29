import { factorial } from './utils'

export const encodePermutation = (permutation: number[]): number => {
    const n = permutation.length
    if (n <= 1) return 0
    const [first, ...rest] = permutation
    return first * factorial(n - 1) + encodePermutation(rest.map(x => x < first ? x : x - 1))
}
