import classNames from 'classnames'
import { Field, type FieldProps } from 'formik'
import React, { type FC } from 'react'
import { errorFromValidation, shouldShowError } from 'utils'

interface Props {
    name: string
    className?: string
    labelText: string
    disabled?: boolean
}

export const NumberField: FC<Props> = ({ className, name, labelText, disabled = false }) =>
    <Field name={name}>
        {
            ({ field, meta }: FieldProps<string>) =>
                <label className={classNames('form-control', className)}>
                    <div className='label'>
                        <span className='label-text'>{labelText}</span>
                    </div>
                    <input
                        type='text'
                        className={classNames(
                            'input input-bordered w-full',
                            { 'input-error': shouldShowError(meta) }
                        )}
                        {...field}
                        disabled={disabled}
                    />
                    <div className='label'>
                        <span className='text-error label-text-alt h-4'>
                            {errorFromValidation(meta)}
                        </span>
                    </div>
                </label>
        }
    </Field>
