window.ExampleAutocomplete = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="autocomplete" title="Autocomplete">

									<Autocomplete
										style={input_style}
										className="column-width"
										label="Food"
										name="dropdown"
										value={this.state.value}
										options={[{
											value: 'A',
											label: 'Apple'
										},
										{
											value: 'B',
											label: 'Banana'
										},
										{
											value: 'C',
											label: 'Cranberry'
										},
										{
											value: 'D',
											label: 'Date'
										},
										{
											value: 'E',
											label: 'Elderberry'
										},
										{
											value: 'F',
											label: 'Fig'
										},
										{
											value: 'G',
											label: 'Garlic'
										}]}
										notFound="Not found"
										onChange={ value => this.setState({ value }) }/>

									Value: {this.state.value ? this.state.value : '(empty)'}

<Highlight lang="jsx">{`
<Autocomplete
  label="Fruit"
  notFound="Not found"
  value={...}
  onChange={...}
  options={[{ value: 'A', label: 'Apple' }, ...]} />
`}</Highlight>

			</Example>
		)
	}
})