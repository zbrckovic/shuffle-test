export const encodePermutation = (permutation: ReadonlyArray<number>): number => {
    const n = permutation.length
    if (n <= 1) return 0
    const [first, ...rest] = permutation
    return first * factorial(n - 1) + encodePermutation(rest.map(x => x < first ? x : x - 1))
}

const factorial = (n: number): number => {
    let result = 1
    for (let i = 2; i <= n; i++) {
        result *= i
    }
    return result
}
