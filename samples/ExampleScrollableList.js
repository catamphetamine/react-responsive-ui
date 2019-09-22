window.ExampleScrollableList = class ExampleScrollableList extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="scrollable-list" title="Scrollable List">
				<ScrollableList
					className="column-width rrui__shadow"
					scrollItemCount={3}
					onSelectItem={value => this.setState({ value })}>

					<List.Item value="A"> Apple </List.Item>
					<List.Item value="B"> Banana </List.Item>
					<List.Item value="C"> Cranberry </List.Item>
					<List.Item value="D"> Date </List.Item>
					<List.Item value="E"> Elderberry </List.Item>
				</ScrollableList>

				<br/>

				Value: {this.state.value === undefined ? '(none)' : this.state.value}

				<Highlight lang="jsx">{`
					<ScrollableList onSelectItem={value => this.setState({ value })}>
						<List.Item value="A"> Apple </List.Item>
						<List.Item value="B"> Banana </List.Item>
						<List.Item value="C"> Cranberry </List.Item>
						<List.Item value="D"> Date </List.Item>
						<List.Item value="E"> Elderberry </List.Item>
					</ScrollableList>

					Value: {this.state.value}
				`}</Highlight>

			</Example>
		)
	}
}

// items={[{
// 	value: 'A',
// 	label: 'Apple'
// }, {
// 	value: 'B',
// 	label: 'Banana'
// }, {
// 	value: 'C',
// 	label: 'Cranberry'
// }, {
// 	value: 'D',
// 	label: 'Date'
// }, {
// 	value: 'E',
// 	label: 'Elderberry'
// }]}