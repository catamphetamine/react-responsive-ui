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

				Optional properties:

				<ul className="list">
					<li><code className="colored">ScrollableContainer</code> — A container element that receives properties: <code className="colored">style</code> (<code className="colored">undefined</code> or <code className="colored">{'{ maxHeight: "12345px" }'}</code>), <code className="colored">maxHeight</code> (<code className="colored">undefined</code> or a number), <code className="colored">children</code>. Can be used to replace a system-default vertical scrollbar with a custom-design one like <code className="colored">react-simplebar</code>.</li>
					<li><code className="colored">getScrollableContainerHeight</code> — When passing a custom <code className="colored">ScrollableContainer</code>, it might also be required to pass a custom <code className="colored">getScrollableContainerHeight(scrollableContainer)</code> property function in cases when navigating through the list of options via keyboard doesn't automatically scroll the list.</li>
					<li><code className="colored">getScrollableContainerScrollY</code> — When passing a custom <code className="colored">ScrollableContainer</code>, it might also be required to pass a custom <code className="colored">getScrollableContainerScrollY(scrollableContainer)</code> property function in cases when navigating through the list of options via keyboard doesn't automatically scroll the list.</li>
					<li><code className="colored">setScrollableContainerScrollY</code> — When passing a custom <code className="colored">ScrollableContainer</code>, it might also be required to pass a custom <code className="colored">setScrollableContainerScrollY(scrollableContainer, scrollY)</code> property function in cases when navigating through the list of options via keyboard doesn't automatically scroll the list.</li>
				</ul>
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