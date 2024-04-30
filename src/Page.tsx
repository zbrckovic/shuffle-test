import React, { type FC, useCallback, useRef, useState } from 'react'
import { ArrowDownTrayIcon, PauseIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid'
import {
    createOverhandShuffle, createRiffleShuffle, type OverhandShuffleOptions,
    type RiffleShuffleOptions
} from './shuffle'
import { type Shuffle } from './shuffle/common'
import { Field, type FieldProps, Form, Formik, type FormikErrors } from 'formik'
import { isInt } from 'validator'
import { NumberField } from './components/NumberField'
import { Visualizer, VisualizerHandle } from './Visualizer'

type ShuffleName = 'Riffle' | 'Overhand'
const shuffleNames: ShuffleName[] = ['Riffle', 'Overhand']

const initialValue: FormModel = {
    deckSize: '30',
    selectedShuffleName: 'Riffle',
    shuffleCountLimit: '50000',
    riffleShuffleOptions: {
        repetitionCount: '7',
        riffleUncertainty: '2',
        splitUncertaintyOffset: '2'
    },
    overhandShuffleOptions: {
        repetitionCount: '7',
        pickUncertainty: '3'
    }
}

interface State {
    deckSize: number
    shuffle: Shuffle
    playing: boolean
    shuffleCountLimit: number
    shuffleCount: number
}

export const Page: FC = () => {
    const [state, setState] = useState<State | undefined>()
    const visualizerRef = useRef<VisualizerHandle>(null)

    const handleShuffle = useCallback(() => {
        setState(prev => {
            if (prev === undefined) return undefined
            const newShuffleCount = prev.shuffleCount + 1
            return {
                ...prev,
                shuffleCount: newShuffleCount,
                playing: newShuffleCount < prev.shuffleCountLimit
            }
        })
    }, [])

    return <div className='grow flex flex-col p-4 gap-4'>
        <Formik<FormModel>
            initialValues={initialValue}
            validate={validateFormValues}
            onSubmit={() => {}} // nothing to do here
            validateOnMount
            validateOnChange
        >

            {({ values, isValid, handleReset, handleSubmit }) => (
                <div className='flex flex-col'>
                    <Form
                        className='grid grid-cols-2 gap-4'
                        onReset={handleReset}
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <h2 className='text-lg font-bold'>General options</h2>
                            <NumberField
                                name='deckSize'
                                labelText='Deck size'
                                disabled={state !== undefined}
                            />
                            <Field name='selectedShuffleName'>
                                {
                                    ({ field }: FieldProps<string>) => (
                                        <label className='form-control'>
                                            <div className='label'>
                                                <span className='label-text'>
                                                    Shuffle algorithm
                                                </span>
                                            </div>
                                            <select
                                                className='select select-bordered'
                                                disabled={state !== undefined}
                                                {...field}
                                            >
                                                {
                                                    shuffleNames.map(name =>
                                                        <option key={name} value={name}>
                                                            {name}
                                                        </option>
                                                    )
                                                }
                                            </select>
                                            <div className='label'>
                                                <span className='h-4' />
                                            </div>
                                        </label>
                                    )}
                            </Field>
                            <NumberField
                                name='shuffleCountLimit'
                                labelText='Max shuffle count'
                                disabled={state !== undefined}
                            />
                        </div>
                        {
                            values.selectedShuffleName === 'Riffle' &&
                            <div>
                                <h2 className='text-lg font-bold'>Riffle shuffle options</h2>
                                <NumberField
                                    name='riffleShuffleOptions.repetitionCount'
                                    labelText='Repetition count'
                                    disabled={state !== undefined}
                                />
                                <NumberField
                                    name='riffleShuffleOptions.riffleUncertainty'
                                    labelText='Riffle uncertainty'
                                    disabled={state !== undefined}
                                />
                                <NumberField
                                    name='riffleShuffleOptions.splitUncertaintyOffset'
                                    labelText='Split uncertainty'
                                    disabled={state !== undefined}
                                />
                            </div>
                        }
                        {
                            values.selectedShuffleName === 'Overhand' &&
                            <div>
                                <h2 className='text-lg font-bold'>Overhand shuffle options</h2>
                                <NumberField
                                    name='overhandShuffleOptions.repetitionCount'
                                    labelText='Repetition count'
                                    disabled={state !== undefined}
                                />
                                <NumberField
                                    name='overhandShuffleOptions.pickUncertainty'
                                    labelText='Pick uncertainty'
                                    disabled={state !== undefined}
                                />
                            </div>
                        }
                    </Form>
                    <div className='flex items-center gap-4'>
                        <div className='join'>
                            <button
                                className='btn join-item'
                                disabled={!isValid}
                                onClick={() => {
                                    if (state === undefined) {
                                        const shuffle = createShuffleFunctionFromFormModel(values)
                                        setState({
                                            deckSize: parseInt(values.deckSize),
                                            shuffle,
                                            playing: true,
                                            shuffleCountLimit: parseInt(values.shuffleCountLimit),
                                            shuffleCount: 0
                                        })
                                    } else {
                                        const didReachLimit = state.shuffleCount >= state.shuffleCountLimit
                                        setState({
                                            ...state, playing: !didReachLimit && !state.playing
                                        })
                                    }
                                }}
                            >
                                {
                                    (state === undefined || !state.playing)
                                        ? <PlayIcon className='w-6' />
                                        : <PauseIcon className='w-6' />
                                }
                            </button>
                            <button
                                className='btn join-item'
                                disabled={state === undefined}
                                onClick={() => { setState(undefined) }}
                            >
                                <StopIcon className='w-6' />
                            </button>
                            <button className='btn join-item' onClick={() => {
                                visualizerRef.current?.download()
                            }}>
                                <ArrowDownTrayIcon className='w-6' />
                            </button>
                        </div>
                        {
                            state !== undefined &&
                            <div className='flex'>
                                <div className='min-w-10 text-end'>{state.shuffleCount}</div>
                                / {state.shuffleCountLimit}
                            </div>
                        }
                    </div>
                </div>
            )}
        </Formik>
        {
            state !== undefined &&
            <Visualizer ref={visualizerRef} {...state} onShuffle={handleShuffle} />
        }
    </div>
}

interface FormModel {
    deckSize: string
    selectedShuffleName: ShuffleName
    shuffleCountLimit: string
    riffleShuffleOptions: { [K in keyof RiffleShuffleOptions]: string }
    overhandShuffleOptions: { [K in keyof OverhandShuffleOptions]: string }
}

const validateFormValues = (
    {
        deckSize,
        shuffleCountLimit,
        riffleShuffleOptions,
        overhandShuffleOptions
    }: FormModel
): FormikErrors<FormModel> => {
    const errors: FormikErrors<FormModel> = {}

    if (!isInt(deckSize, { min: 1 })) {
        errors.deckSize = 'Must be a natural number'
    }

    if (!isInt(shuffleCountLimit, { min: 1 })) {
        errors.shuffleCountLimit = 'Must be a natural number'
    }

    if (!isInt(riffleShuffleOptions.repetitionCount, { min: 1 })) {
        if (errors.riffleShuffleOptions === undefined) errors.riffleShuffleOptions = {}
        errors.riffleShuffleOptions.repetitionCount = 'Must be a natural number'
    }

    if (!isInt(riffleShuffleOptions.riffleUncertainty, { min: 1 })) {
        if (errors.riffleShuffleOptions === undefined) errors.riffleShuffleOptions = {}
        errors.riffleShuffleOptions.riffleUncertainty = 'Must be a natural number'
    }

    if (!isInt(riffleShuffleOptions.splitUncertaintyOffset, { min: 1 })) {
        if (errors.riffleShuffleOptions === undefined) errors.riffleShuffleOptions = {}
        errors.riffleShuffleOptions.splitUncertaintyOffset = 'Must be a natural number'
    }

    if (!isInt(overhandShuffleOptions.repetitionCount, { min: 1 })) {
        if (errors.overhandShuffleOptions === undefined) errors.overhandShuffleOptions = {}
        errors.overhandShuffleOptions.repetitionCount = 'Must be a natural number'
    }

    if (!isInt(overhandShuffleOptions.pickUncertainty, { min: 1 })) {
        if (errors.overhandShuffleOptions === undefined) errors.overhandShuffleOptions = {}
        errors.overhandShuffleOptions.pickUncertainty = 'Must be a natural number'
    }

    return errors
}

const createShuffleFunctionFromFormModel = (
    {
        selectedShuffleName,
        riffleShuffleOptions,
        overhandShuffleOptions
    }: FormModel
): Shuffle => {
    switch (selectedShuffleName) {
        case 'Riffle': {
            const options: RiffleShuffleOptions = {
                repetitionCount: parseInt(riffleShuffleOptions.repetitionCount),
                riffleUncertainty: parseInt(riffleShuffleOptions.riffleUncertainty),
                splitUncertaintyOffset: parseInt(riffleShuffleOptions.splitUncertaintyOffset)
            }
            return createRiffleShuffle(options)
        }
        case 'Overhand': {
            const options: OverhandShuffleOptions = {
                repetitionCount: parseInt(overhandShuffleOptions.repetitionCount),
                pickUncertainty: parseInt(overhandShuffleOptions.pickUncertainty)
            }
            return createOverhandShuffle(options)
        }
    }
}
