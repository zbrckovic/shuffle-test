import { type FieldMetaProps } from 'formik'
import { useRef } from 'react'

export const factorial = (n: number): number => {
    let result = 1
    for (let i = 2; i <= n; i++) {
        result *= i
    }
    return result
}

export const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T | undefined>(undefined)
    const prev = ref.current
    ref.current = value
    return prev
}

// region Form utils
export const formLabelWithChange = (
    label: string,
    meta: FieldMetaProps<unknown>
): string => {
    const didChange = meta.initialValue !== meta.value
    return didChange ? `${label} *` : label
}

export const errorFromValidation = (meta: FieldMetaProps<unknown>): string | undefined =>
    shouldShowError(meta) ? meta.error : undefined

export const shouldShowError = (
    {
        touched, error
    }: FieldMetaProps<unknown>
): boolean => touched && error !== undefined
// endregion
