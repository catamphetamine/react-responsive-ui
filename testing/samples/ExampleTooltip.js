window.ExampleTooltip = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="tooltip" title="Tooltip">

									<Tooltip text="Testing testing">
										Hover this element (or touch down on mobile devices)
									</Tooltip>

<Highlight lang="jsx">{`
<Tooltip text="Testing testing">
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
})