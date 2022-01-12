window.ExampleEllipsis = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="ellipsis" title="Ellipsis">

				<Ellipsis />

<Highlight lang="jsx">{`
<Ellipsis className="..." />
`}</Highlight>

<Highlight lang="css">{`
.rrui__ellipsis {
  width   : 20px;
  color   : black;
  opacity : 0.7;
}
`}</Highlight>
			</Example>
		)
	}
}