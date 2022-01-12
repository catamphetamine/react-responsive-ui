window.ExampleExpandableList = class ExampleExpandableList extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="expandable-list" title="Expandable List">
				<button onClick={() => this.list.toggle()}>
					Toggle
				</button>

				<ExpandableList
					ref={ref => this.list = ref}
					className="column-width rrui__shadow"
					scrollMaxItems={3}
					preload={() => new Promise(resolve => setTimeout(resolve, 10))}
					onSelectItem={value => this.setState({ value })}>

					<List.Item value="A"> Apple </List.Item>
					<List.Item value="B"> Banana </List.Item>
					<List.Item value="C"> Cranberry </List.Item>
					<List.Item value="D"> Date </List.Item>
					<List.Item value="E"> Elderberry </List.Item>
				</ExpandableList>

				<br/>
				<br/>

				Value: {this.state.value === undefined ? '(none)' : this.state.value}

				<Highlight lang="jsx">{`
					<button onClick={() => this.list.toggle()}>
						Toggle
					</button>

					<ExpandableList ref={ref => this.list = ref}>
						<List.Item value="A"> Apple </List.Item>
						<List.Item value="B"> Banana </List.Item>
						<List.Item value="C"> Cranberry </List.Item>
						<List.Item value="D"> Date </List.Item>
						<List.Item value="E"> Elderberry </List.Item>
					</ExpandableList>
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