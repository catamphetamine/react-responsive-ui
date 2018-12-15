window.ExampleExpandableMenu = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="expansion-panel" title="Expansion Panel">

				<ExpansionPanel title="Title">
					Description, description, description.
				</ExpansionPanel>

				<Highlight lang="jsx">{`
					<ExpansionPanel title="Title">
						Description, description, description.
					</ExpansionPanel>
				`}</Highlight>
			</Example>
		)
	}
}