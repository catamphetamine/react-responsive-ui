export default function MenuButtonIconLines()
{
	return (
		<svg viewBox={ SVG_CANVAS_DIMENSIONS }>
			<path
				style={ SVG_PATH_STYLE }
				d={ SVG_PATH }/>
		</svg>
	)
}

// "Hamburger" icon (24x24)
const SVG_CANVAS_DIMENSIONS = "0 0 24 24"
const SVG_PATH = "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"

const SVG_PATH_STYLE = { fill: 'currentColor' }