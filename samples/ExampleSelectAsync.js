window.ExampleSelectAsync = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="select-async" title="Select (async)">

				<Select
					style={input_style}
					className="column-width"
					name="dropdown"
					label="Fruit"
					value={this.state.value}
					getOptions={() => {
						return new Promise(resolve => setTimeout(resolve, 500)).then(() => {
							return [{
								value: 'A',
								label: 'Apple'
							}, {
								value: 'B',
								label: 'Banana'
							}, {
								value: 'C',
								label: 'Cranberry'
							}, {
								value: 'D',
								label: 'Date'
							}, {
								value: 'E',
								label: 'Elderberry'
							}, {
								value: 'F',
								label: 'Fig'
							}, {
								value: 'G',
								label: 'Garlic'
							}]
						})
					}}
					onChange={ value => this.setState({ value }) }/>

				Value: {this.state.value ? this.state.value : '(empty)'}

				<Highlight lang="jsx">{`
					<Select
						label="Fruit"
						value={...}
						onChange={...}
						getOptions={async () => await httpClient.get('/items')}/>
				`}</Highlight>

			</Example>
		)
	}
})
