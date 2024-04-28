import React, { FC, useCallback, useEffect, useState } from 'react'

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 768

export const Page: FC = () => {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

    const clearCanvas = useCallback(() => {
        if (ctx === undefined) return
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }, [ctx])

    const drawPixelDot = useCallback((x: number, y: number) => {
        if (ctx === undefined) return
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        ctx.fillRect(x, y, 1, 1)
    }, [ctx])

    useEffect(() => {
        if (ctx === undefined) return

        clearCanvas()

        const intervalId = setInterval(() => {
            const x = Math.floor(Math.random() * CANVAS_WIDTH)
            const y = Math.floor(Math.random() * CANVAS_HEIGHT)
            drawPixelDot(x, y)
        }, 0)

        return () => clearInterval(intervalId)
    }, [ctx])

    return <div className="grow p-1">
        <canvas
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            ref={canvas => {
                if (canvas === null) return
                const ctx = canvas.getContext('2d')
                if (ctx === null) return
                setCtx(ctx)
            }}
            className="border-solid border border-black"/>
    </div>
}
