window.ExampleSelectNativeExpanded = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="select-native-expanded" title="Select (native expanded)">

									<Select
										style={input_style}
										className="column-width"
										name="dropdown"
										label="Fruit"
										value={this.state.value}
										nativeExpanded
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
										onChange={ value => this.setState({ value }) }/>

									Value: {this.state.value ? this.state.value : '(empty)'}

<Highlight lang="jsx">{`
<Select
  nativeExpanded
  label="Fruit"
  value={...}
  onChange={...}
  options={[{ value: 'A', label: 'Apple' }, ...]} />
`}</Highlight>

			</Example>
		)
	}
})