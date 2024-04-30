import { factorial } from '../utils'

/**
 * Assigns a unique number to every permutation of the same size. The number assigned is actually a
 * zero-based ordinal number of the permutation when permutations are ordered lexicographically.
 */
export const encodePermutation = (permutation: number[]): number => {
    const n = permutation.length
    if (n <= 1) return 0
    const [first, ...rest] = permutation
    return first * factorial(n - 1) + encodePermutation(rest.map(x => x < first ? x : x - 1))
}
