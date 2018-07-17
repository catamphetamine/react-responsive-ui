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
			<Example name="expandable-menu" title="Expandable Menu">

				<ExpandableMenu
					className="column-width"
					style={{ ...input_style, marginBottom: 0, width: 'auto' }}>

					<button type="button"> Menu </button>
					<List.Item onSelect={() => alert('Google')}> Google </List.Item>
					<List.Item onSelect={() => alert('Yandex')}> Yandex </List.Item>
					<Divider/>
					<List.Item onSelect={() => console.log('Other')}> Other </List.Item>
				</ExpandableMenu>

				<Highlight lang="jsx">{`
					<ExpandableMenu>
						<button type="button"> Menu </button>
						<List.Item onSelect={() => alert('Google')}> Google </List.Item>
						<List.Item onSelect={() => alert('Yandex')}> Yandex </List.Item>
						<Divider/>
						<List.Item onSelect={() => console.log('Other')}> Other </List.Item>
					</ExpandableMenu>
				`}</Highlight>

			</Example>
		)
	}
}