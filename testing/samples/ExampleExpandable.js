window.ExampleExpandable = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="expandable" title="Expandable">

				<button onClick={() => this.expandable.toggle()}>
					Toggle
				</button>

				<Expandable ref={ref => this.expandable = ref}>
					<List
						className="column-width rrui__shadow"
						onSelectItem={value => this.setState({ value })}>
						<List.Item value="A"> Apple </List.Item>
						<List.Item value="B"> Banana </List.Item>
						<List.Item value="C"> Cranberry </List.Item>
						<List.Item value="D"> Date </List.Item>
						<Divider/>
						<List.Item value="E"> Elderberry </List.Item>
					</List>
				</Expandable>

				<Highlight lang="jsx">{`
					<button onClick={() => this.expandable.toggle()}>
						Toggle
					</button>

					<Expandable ref={ref => this.expandable = ref}>
						<List
						  className="rrui__shadow"
						  onSelectItem={ value => this.setState({ value }) }>
						  <List.Item value="A"> Apple </List.Item>
						  <List.Item value="B"> Banana </List.Item>
						  <List.Item value="C"> Cranberry </List.Item>
						  <List.Item value="D"> Date </List.Item>
						  <Divider/>
						  <List.Item value="E"> Elderberry </List.Item>
						</List>
					</Expandable>
				`}</Highlight>

			</Example>
		)
	}
})