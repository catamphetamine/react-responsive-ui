window.ExampleList = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="list" title="List">

				<List
					style={input_style}
					className="column-width rrui__shadow"
					value={ this.state.value }
					onSelectItem={ value => this.setState({ value }) }>
					<List.Item value="A">Apple</List.Item>
					<List.Item value="B">Banana</List.Item>
					<List.Item value="C">Cranberry</List.Item>
					<List.Item value="D">Date</List.Item>
					<List.Item><Divider/></List.Item>
					<List.Item value="E">Elderberry</List.Item>
				</List>

				Value: {this.state.value === undefined ? '(none)' : this.state.value}

				<Highlight lang="jsx">{`
					<List
						className="rrui__shadow"
						value={ this.state.value }
						onChange={ value => this.setState({ value }) }>

						<List.Item value="A">
							Apple
						</List.Item>

						<List.Item value="B">
							Banana
						</List.Item>

						<List.Item value="C">
							Cranberry
						</List.Item>

						<List.Item value="D">
							Date
						</List.Item>

						<List.Item>
							<Divider/>
						</List.Item>

						<List.Item value="E">
							Elderberry
						</List.Item>
					</List>
				`}</Highlight>

				<Highlight lang="css">{`
					:root {
						--rrui-list-vertical-padding: 15px;
						--rrui-list-item-height: 60px;
						--rrui-list-item-side-padding: 20px;
						--rrui-list-item-icon-margin: 15px
						--rrui-list-item-background-color: white;
						--rrui-list-item-text-color: black;
						--rrui-list-item-background-color-focus: gray;
						--rrui-list-item-text-color-focus: black;
						--rrui-list-item-background-color-active: blue;
						--rrui-list-item-text-color-active: white;
					}
				`}</Highlight>

				<p>
					If a <code className="colored">{'<List/>'}</code> has <code className="colored">onChange</code> handler, or if a <code className="colored">{'<List.Item/>'}</code> has <code className="colored">onClick</code> handler, then the contents of such <code className="colored">{'<List.Item/>'}</code> are wrapped in a <code className="colored">{'<button/>'}</code>.
				</p>
			</Example>
		)
	}
}