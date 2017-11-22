const fps = 30
const width = 128
const height = 128
const screenWidth = 384
const screenHeight = 384
const xScale = screenWidth / width
const yScale = screenHeight / height
const borderSize = 48
const spriteSize = 64
const spriteSheetSize = 128 * spriteSize
const spriteBanks = 8

const canvas = <HTMLCanvasElement> document.getElementById('myCanvas')
// canvas.style.cursor = 'none' // TODO: Implement software cursor

const ctx = canvas.getContext('2d')
const image = ctx.createImageData(screenWidth, screenHeight)
const texture = image.data.fill(255)
const videomem = Array(width * height).fill(0)
const spriteSheet = Array(spriteSheetSize * spriteBanks).fill(0)

const btnstate = Array(6).fill(0)

const mouse = { x: 0, y: 0, click: false }

let palette = []

const drawState = {
    borderColor: 0,
    penColor: 7,
    spriteBank: 1,
    borderChanged: true,
    clipArea: { x0: 0, y0: 0, x1: width - 1, y1: height - 1 }
}

let frame = 0

function eventLoop() {
    frame += 1
    if (window.update !== undefined) update()
    if (window.draw !== undefined) draw()
    if (drawState.borderChanged) refreshBorder()
    refresh()
}

function refreshBorder() {
    const borderRGB = palette[drawState.borderColor]
    ctx.fillStyle = `rgb(${borderRGB[0]}, ${borderRGB[1]}, ${borderRGB[2]})`
    ctx.fillRect(0, 0, screenWidth + borderSize * 2, screenHeight + borderSize * 2)
    drawState.borderChanged = false
}

function refresh() {
    for (let y = 0; y < screenWidth; y += 1) {
        for (let x = 0; x < screenHeight; x += 1) {
            const i1 = (Math.floor(y / yScale) * width + Math.floor(x / xScale))
            const i2 = (y * screenWidth + x) * 4
            const color = palette[videomem[i1]]

            texture[i2 + 0] = color[0]
            texture[i2 + 1] = color[1]
            texture[i2 + 2] = color[2]
        }
    }

    ctx.putImageData(image, borderSize, borderSize)
}

// Text

const font = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30, 0x30, 0x00, 0x30, 0x00, 0x00, 0x00, 0x50, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x50, 0xf8, 0x50, 0xf8, 0x50, 0x00, 0x00, 0x00, 0x78, 0xa0, 0x70, 0x28, 0xf0, 0x00, 0x00, 0x00, 0x88, 0x10, 0x20, 0x40, 0x88, 0x00, 0x00, 0x00, 0x40, 0xa0, 0x68, 0x90, 0x68, 0x00, 0x00, 0x00, 0x20, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x40, 0x40, 0x40, 0x20, 0x00, 0x00, 0x00, 0x40, 0x20, 0x20, 0x20, 0x40, 0x00, 0x00, 0x00, 0x20, 0xa8, 0x70, 0xa8, 0x20, 0x00, 0x00, 0x00, 0x00, 0x20, 0x70, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x60, 0x20, 0x40, 0x00, 0x00, 0x00, 0x00, 0x70, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x60, 0x60, 0x00, 0x00, 0x00, 0x08, 0x10, 0x20, 0x40, 0x80, 0x00, 0x00, 0x00, 0x70, 0xc8, 0xc8, 0xc8, 0x70, 0x00, 0x00, 0x00, 0x30, 0x70, 0x30, 0x30, 0x78, 0x00, 0x00, 0x00, 0xf0, 0x18, 0x70, 0xc0, 0xf8, 0x00, 0x00, 0x00, 0xf8, 0x18, 0x30, 0x98, 0x70, 0x00, 0x00, 0x00, 0x30, 0x70, 0xd0, 0xf8, 0x10, 0x00, 0x00, 0x00, 0xf8, 0xc0, 0xf0, 0x18, 0xf0, 0x00, 0x00, 0x00, 0x70, 0xc0, 0xf0, 0xc8, 0x70, 0x00, 0x00, 0x00, 0xf8, 0x18, 0x30, 0x60, 0xc0, 0x00, 0x00, 0x00, 0x70, 0xc8, 0x70, 0xc8, 0x70, 0x00, 0x00, 0x00, 0x70, 0xc8, 0x78, 0x08, 0x70, 0x00, 0x00, 0x00, 0x60, 0x60, 0x00, 0x60, 0x60, 0x00, 0x00, 0x00, 0x60, 0x60, 0x00, 0x60, 0x20, 0x40, 0x00, 0x00, 0x10, 0x20, 0x40, 0x20, 0x10, 0x00, 0x00, 0x00, 0x00, 0x70, 0x00, 0x70, 0x00, 0x00, 0x00, 0x00, 0x40, 0x20, 0x10, 0x20, 0x40, 0x00, 0x00, 0x00, 0x78, 0x18, 0x30, 0x00, 0x30, 0x00, 0x00, 0x00, 0x70, 0xa8, 0xb8, 0x80, 0x70, 0x00, 0x00, 0x00, 0x70, 0xc8, 0xc8, 0xf8, 0xc8, 0x00, 0x00, 0x00, 0xf0, 0xc8, 0xf0, 0xc8, 0xf0, 0x00, 0x00, 0x00, 0x70, 0xc8, 0xc0, 0xc8, 0x70, 0x00, 0x00, 0x00, 0xf0, 0xc8, 0xc8, 0xc8, 0xf0, 0x00, 0x00, 0x00, 0xf8, 0xc0, 0xf0, 0xc0, 0xf8, 0x00, 0x00, 0x00, 0xf8, 0xc0, 0xf0, 0xc0, 0xc0, 0x00, 0x00, 0x00, 0x78, 0xc0, 0xd8, 0xc8, 0x78, 0x00, 0x00, 0x00, 0xc8, 0xc8, 0xf8, 0xc8, 0xc8, 0x00, 0x00, 0x00, 0x78, 0x30, 0x30, 0x30, 0x78, 0x00, 0x00, 0x00, 0xf8, 0x18, 0x18, 0xd8, 0x70, 0x00, 0x00, 0x00, 0xc8, 0xd0, 0xe0, 0xd0, 0xc8, 0x00, 0x00, 0x00, 0xc0, 0xc0, 0xc0, 0xc0, 0xf8, 0x00, 0x00, 0x00, 0xd8, 0xf8, 0xf8, 0xa8, 0x88, 0x00, 0x00, 0x00, 0xc8, 0xe8, 0xf8, 0xd8, 0xc8, 0x00, 0x00, 0x00, 0x70, 0xc8, 0xc8, 0xc8, 0x70, 0x00, 0x00, 0x00, 0xf0, 0xc8, 0xc8, 0xf0, 0xc0, 0x00, 0x00, 0x00, 0x70, 0xc8, 0xc8, 0xc8, 0x70, 0x08, 0x00, 0x00, 0xf0, 0xc8, 0xc8, 0xf0, 0xc8, 0x00, 0x00, 0x00, 0x78, 0xe0, 0x70, 0x38, 0xf0, 0x00, 0x00, 0x00, 0x78, 0x30, 0x30, 0x30, 0x30, 0x00, 0x00, 0x00, 0xc8, 0xc8, 0xc8, 0xc8, 0x70, 0x00, 0x00, 0x00, 0xc8, 0xc8, 0xc8, 0x70, 0x20, 0x00, 0x00, 0x00, 0x88, 0xa8, 0xf8, 0xf8, 0xd8, 0x00, 0x00, 0x00, 0xc8, 0xc8, 0x70, 0xc8, 0xc8, 0x00, 0x00, 0x00, 0x68, 0x68, 0x78, 0x30, 0x30, 0x00, 0x00, 0x00, 0xf8, 0x30, 0x60, 0xc0, 0xf8, 0x00, 0x00, 0x00, 0x60, 0x40, 0x40, 0x40, 0x60, 0x00, 0x00, 0x00, 0x80, 0x40, 0x20, 0x10, 0x08, 0x00, 0x00, 0x00, 0x60, 0x20, 0x20, 0x20, 0x60, 0x00, 0x00, 0x00, 0x20, 0x50, 0x88, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x78, 0x00, 0x00, 0x00, 0x40, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x78, 0x98, 0x98, 0x78, 0x00, 0x00, 0x00, 0xc0, 0xf0, 0xc8, 0xc8, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x78, 0xe0, 0xe0, 0x78, 0x00, 0x00, 0x00, 0x18, 0x78, 0x98, 0x98, 0x78, 0x00, 0x00, 0x00, 0x00, 0x70, 0xd8, 0xe0, 0x70, 0x00, 0x00, 0x00, 0x38, 0x60, 0xf8, 0x60, 0x60, 0x00, 0x00, 0x00, 0x00, 0x70, 0x98, 0xf8, 0x18, 0x70, 0x00, 0x00, 0xc0, 0xf0, 0xc8, 0xc8, 0xc8, 0x00, 0x00, 0x00, 0x30, 0x00, 0x70, 0x30, 0x78, 0x00, 0x00, 0x00, 0x18, 0x00, 0x18, 0x18, 0x98, 0x70, 0x00, 0x00, 0xc0, 0xc8, 0xf0, 0xc8, 0xc8, 0x00, 0x00, 0x00, 0x60, 0x60, 0x60, 0x60, 0x38, 0x00, 0x00, 0x00, 0x00, 0xd0, 0xf8, 0xa8, 0xa8, 0x00, 0x00, 0x00, 0x00, 0xf0, 0xc8, 0xc8, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x70, 0xc8, 0xc8, 0x70, 0x00, 0x00, 0x00, 0x00, 0xf0, 0xc8, 0xc8, 0xf0, 0xc0, 0x00, 0x00, 0x00, 0x78, 0x98, 0x98, 0x78, 0x18, 0x00, 0x00, 0x00, 0xf0, 0xc8, 0xc0, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x78, 0xe0, 0x38, 0xf0, 0x00, 0x00, 0x00, 0x60, 0xf8, 0x60, 0x60, 0x38, 0x00, 0x00, 0x00, 0x00, 0x98, 0x98, 0x98, 0x78, 0x00, 0x00, 0x00, 0x00, 0xc8, 0xc8, 0xd0, 0xe0, 0x00, 0x00, 0x00, 0x00, 0x88, 0xa8, 0xf8, 0xd8, 0x00, 0x00, 0x00, 0x00, 0xd8, 0x70, 0x70, 0xd8, 0x00, 0x00, 0x00, 0x00, 0x98, 0x98, 0x78, 0x18, 0x70, 0x00, 0x00, 0x00, 0xf8, 0x30, 0x60, 0xf8, 0x00, 0x00, 0x00, 0x30, 0x20, 0x60, 0x20, 0x30, 0x00, 0x00, 0x00, 0x20, 0x20, 0x20, 0x20, 0x20, 0x00, 0x00, 0x00, 0x60, 0x20, 0x30, 0x20, 0x60, 0x00, 0x00, 0x00, 0x00, 0x28, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
const fontWidth = 6
const fontHeight = 6
const encodedBits = 8

function drawChar(x0: number, y0: number, symbol: number, pen?: number, paper?: number) {
    const ptr = symbol * 8

    for (let y = 0; y < fontWidth; y += 1)
        for (let x = 0; x < fontHeight; x += 1) {
            const bit = font[ptr + y] & (1 << (encodedBits - 1 - x))
            if (bit !== 0) pset(x + x0, y + y0, pen)
            else if (paper !== undefined) pset(x + x0, y + y0, paper)
        }
}

// Sprites

function encodeSprite(s: number, bank: number = drawState.spriteBank) {
    const result = []
    for (let y = 0; y < 8; y += 1) {
        let value = 0x00000000
        for (let x = 7; x >= 0; x -= 1)
            value |= sget(s, x, y, bank) << (28 - x * 4)
        result.push(value)
    }
    return result
}

function decodeSprite(code: number[], s: number, bank: number = drawState.spriteBank) {
    for (let y = 0; y < 8; y += 1)
        for (let x = 7; x >= 0; x -= 1)
            sset(s, x, y, (code[y] >> (28 - x * 4)) & 0xF, bank)
}

// API
function clamp(value: number, max = 255, min = 0) {
    return (value > max) ? max : ((value < min) ? min : value)
}

function peek(addr: number) {
    return videomem[addr]
}

function poke(addr: number, value: number) {
    videomem[addr] = value
}

function rnd(n: number) {
    return Math.floor(Math.random() * (Math.floor(n) + 1))
}

function pset(x: number, y: number, color: number = drawState.penColor) {
    const c = drawState.clipArea
    if (inrect(x, y, c.x0, c.y0, c.x1, c.y1)) videomem[y * width + x] = color
}

function pget(x: number, y: number) {
    return videomem[y * width + x]
}

// TODO: DDA Algorithm; update to Bresenham’s ?
function line(x0: number, y0: number, x1: number, y1: number, color?: number) {
    const dx = x1 - x0
    const dy = y1 - y0
    const steps = (Math.abs(dx) > Math.abs(dy)) ? Math.abs(dx) : Math.abs(dy)
    const xinc = dx / steps
    const yinc = dy / steps

    for (let v = 0, x = x0, y = y0; v < steps; v += 1, x += xinc, y += yinc)
        pset(Math.round(x), Math.round(y), color)
}

function rect(x0: number, y0: number, x1: number, y1: number, color?: number) {
    line(x0, y0, x1, y0, color)
    line(x1, y0, x1, y1, color)
    line(x1, y1, x0, y1, color)
    line(x0, y1, x0, y0, color)
}

function rectfill(x0: number, y0: number, x1: number, y1: number, color?: number) {
    for (let y = y0; y <= y1; y += 1)
        for (let x = x0; x <= x1; x += 1)
            pset(x, y, color)
}

function inrect(x: number, y: number, x0: number, y0: number, x1: number, y1: number) {
    return (x >= x0 && x <= x1 && y >= y0 && y <= y1)
}

function clip(x0 = 0, y0 = 0, x1 = width - 1, y1 = height - 1) {
    drawState.clipArea = { x0, y0, x1, y1 }
}

function posgrid(x: number, y: number, x0: number, y0: number, width: number, height: number, hslices: number, vslices: number) {
    return inrect(x, y, x0, y0, x0 + width, y0 + width) ? {
        x: clamp(Math.floor((mouse.x - x0) / (width / hslices)), hslices - 1, 0),
        y: clamp(Math.floor((mouse.y - y0) / (height / vslices)), vslices - 1, 0)
    } : undefined
}

function cls(color: number = 0) {
    videomem.fill(color)
}

function btn(n: number) {
    return btnstate[n]
}

function print() { } // deactivate the print() function from browser
function print(str: string, x: number, y: number, pen?: number, paper?: number, wrap = true) {
    for (let i = 0, x0 = x, y0 = y; i < str.length; i += 1, x0 += fontWidth) {
        if (wrap && (width - x0) < fontWidth) { y0 += fontHeight; x0 = 0}
        drawChar(x0, y0, str.charCodeAt(i), pen, paper)
    }
}

function pen(color: number) {
    drawState.penColor = color
}

function border(color: number) {
    drawState.borderColor = color
    drawState.borderChanged = true
}

function bank(value: number) {
    drawState.spriteBank = value
}

function spr(s: number, x0: number, y0: number, scale = 1, transparentColor = 0, bank: number = drawState.spriteBank) {
    const offset = spriteSheetSize * bank + s * spriteSize
    for (let p = 0; p < spriteSize; p += 1) {
        const color = spriteSheet[offset + p]
        if (color !== transparentColor) {
            const x = (p % 8) * scale + x0
            const y = (Math.floor(p / 8)) * scale + y0
            rectfill(x, y, x + (scale - 1), y + (scale - 1), color)
        }
    }
}

function sset(s: number, x: number, y: number, color: number = drawState.penColor, bank: number = drawState.spriteBank) {
    const offset = spriteSheetSize * bank + s * spriteSize
    spriteSheet[offset + y * 8 + x] = color
}

function sget(s: number, x: number, y: number, bank: number = drawState.spriteBank) {
    const offset = spriteSheetSize * bank + s * spriteSize
    return spriteSheet[offset + y * 8 + x]
}

function clkgrid(x0: number, y0: number, width: number, height: number, hslices: number, vslices: number, callback: (r, c) => void) {
    if (mouse.click) {
        const clickSpot = posgrid(mouse.x, mouse.y, x0, y0, width, height, hslices, vslices)
        if (clickSpot !== undefined) callback(clickSpot.y, clickSpot.x)
    }
}

function setpal(values: number[]) {
    palette = values.map(v => [(v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF])
}

// Initialize

window.onload = () => {
    canvas.addEventListener('mousemove', (evt) => {
        const rect = canvas.getBoundingClientRect()
        mouse.x = clamp(Math.floor((evt.clientX - rect.left - borderSize) / xScale), width - 1, 0)
        mouse.y = clamp(Math.floor((evt.clientY - rect.top - borderSize) / yScale), height - 1, 0)
    }, false)

    canvas.addEventListener('mousedown', () => { mouse.click = true }, false)
    canvas.addEventListener('mouseup', () => { mouse.click = false }, false)

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') btnstate[0] = true
        else if (e.key === 'ArrowRight') btnstate[1] = true
        else if (e.key === 'ArrowUp') btnstate[2] = true
        else if (e.key === 'ArrowDown') btnstate[3] = true
    }, true)

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') btnstate[0] = false
        else if (e.key === 'ArrowRight') btnstate[1] = false
        else if (e.key === 'ArrowUp') btnstate[2] = false
        else if (e.key === 'ArrowDown') btnstate[3] = false
    }, true)

    setpal([0x000000, 0x143563, 0x386C9C, 0x118840,
            0x60305F, 0x505050, 0x60E0FF, 0x14E01F,
            0x9D4040, 0xFF8ABF, 0xACACAC, 0xFFF210,
            0xED1D25, 0xFF903C, 0xFFCCBC, 0xFFFFFF])

    if (init !== undefined) init()
    window.setInterval(() => eventLoop(), 1000 / fps)
}
