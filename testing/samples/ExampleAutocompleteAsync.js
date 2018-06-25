window.ExampleAutocompleteAsync = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="asynchronous-autocomplete" title="Autocomplete (asynchronous)">

									<Autocomplete
										label="Food"
										style={input_style}
										className="column-width"
										name="dropdown"
										value={this.state.value}
										getOptions={(query) => {
											return new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200)).then(() => {
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
												.filter(({ label }) => label.toLowerCase().indexOf(query.toLowerCase()) >= 0)
											})
										}}
										onChange={ value => this.setState({ value }) }/>

									Value: {this.state.value ? this.state.value : '(empty)'}

<Highlight lang="jsx">{`
<Autocomplete
  label="Fruit"
  notFound="Not found"
  value={...}
  onChange={...}
  getOptions={async (query) => await httpClient.get(\u0060/search?query=\${query}\u0060)}/>
`}</Highlight>

			</Example>
		)
	}
})