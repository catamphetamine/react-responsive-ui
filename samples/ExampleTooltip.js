window.ExampleTooltip = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()

		this.state =
		{
			content: (
				<div style={tooltipContentStyle}>
					<svg style={twitterLogoStyle} xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><path d="M67.812 16.141a26.246 26.246 0 0 1-7.519 2.06 13.134 13.134 0 0 0 5.756-7.244 26.127 26.127 0 0 1-8.313 3.176A13.075 13.075 0 0 0 48.182 10c-7.229 0-13.092 5.861-13.092 13.093 0 1.026.118 2.021.338 2.981-10.885-.548-20.528-5.757-26.987-13.679a13.048 13.048 0 0 0-1.771 6.581c0 4.542 2.312 8.551 5.824 10.898a13.048 13.048 0 0 1-5.93-1.638c-.002.055-.002.11-.002.162 0 6.345 4.513 11.638 10.504 12.84a13.177 13.177 0 0 1-3.449.457c-.846 0-1.667-.078-2.465-.231 1.667 5.2 6.499 8.986 12.23 9.09a26.276 26.276 0 0 1-16.26 5.606A26.21 26.21 0 0 1 4 55.976a37.036 37.036 0 0 0 20.067 5.882c24.083 0 37.251-19.949 37.251-37.249 0-.566-.014-1.134-.039-1.694a26.597 26.597 0 0 0 6.533-6.774z"></path></svg>
					<div style={tooltipTextStyle}>
						Testing testing
					</div>
				</div>
			)
		}

		// Check dynamic tooltip content re-rendering.
		// setTimeout(() => this.setState({ content: 123 }), 2000)
	}

	render()
	{
		return (
			<Example name="tooltip" title="Tooltip">

				<Tooltip content={this.state.content}>
					Hover this element (or touch down on mobile devices)
				</Tooltip>

				<Highlight lang="jsx">{`
					<Tooltip content={ <div> <img/> Testing testing </div> }>
						Hover this element (or touch down on mobile devices)
					</Tooltip>

					// \u0060container: () => DOMElement\u0060 property is optional
					// and is gonna be the parent DOM Element for the tooltip itself
					// (\u0060document.body\u0060 by default)
					// (in which case make sure that \u0060document.body\u0060 has no \u0060margin\u0060
					//  otherwise tooltip \u0060left\u0060 and \u0060top\u0060 positions will be slightly off).
				`}</Highlight>

				<Highlight lang="css">{`
					.rrui__tooltip {
						background-color : black;
						color : white;
					}
				`}</Highlight>

			</Example>
		)
	}
}

const tooltipContentStyle =
{
	display: 'flex',
	alignChildren: 'center'
}

const twitterLogoStyle =
{
	width: '1.5em',
	height: '1.5em',
	fill: 'white'
}

const tooltipTextStyle =
{
	marginLeft: '0.5em',
	lineHeight: '1.5em'
}