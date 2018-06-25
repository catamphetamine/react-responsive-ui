window.ExampleList = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="list" title="List">

				<List
					style={input_style}
					className="column-width rrui__shadow"
					onSelectItem={value => this.setState({ value })}>
					<List.Item value="A"> Apple </List.Item>
					<List.Item value="B"> Banana </List.Item>
					<List.Item value="C"> Cranberry </List.Item>
					<List.Item value="D"> Date </List.Item>
					<Divider/>
					<List.Item value="E"> Elderberry </List.Item>
				</List>

				Value: {this.state.value === undefined ? '(none)' : this.state.value}

				<Highlight lang="jsx">{`
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
				`}</Highlight>

				<Highlight lang="css">{`
					.rrui__list__item:hover {
						background-color : gray;
					}
					.rrui__list__item:active {
						background-color : blue;
						color : white;
					}
				`}</Highlight>

			</Example>
		)
	}
})