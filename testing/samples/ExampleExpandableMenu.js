window.ExampleExpandableMenu = React.createClass
({
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
					<ExpandableMenu toggler={MenuToggler}>
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
})