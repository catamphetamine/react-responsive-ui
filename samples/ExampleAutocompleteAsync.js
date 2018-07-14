window.ExampleAutocompleteAsync = class ExampleAutocompleteAsync extends React.Component
{
	constructor()
	{
		super()
		this.state = { value: 'B' }
	}

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
							return options.filter(({ label }) => label.toLowerCase().indexOf(query.toLowerCase()) >= 0)
						})
					}}
					getOption={(value) => {
						return new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200)).then(() => {
							return options.filter(_ => _.value === value)[0]
						})
					}}
					onChange={ value => this.setState({ value }) }/>

				Value: {this.state.value ? this.state.value : '(empty)'}

				<Highlight lang="jsx">{`
					<Autocomplete
						label="Fruit"
						value={...}
						onChange={...}
						getOptions={async (query) => await httpClient.get(\u0060/search?query=\${query}\u0060)}
						getOption={async (value) => await httpClient.get(\u0060/option?value=\${value}\u0060)}/>
				`}</Highlight>

				<ul className="list">
					<li>
						<code>async </code><code className="colored">getOptions(query)</code> function returns a list of options for a search <code>query</code>.
					</li>
					<li>
						<code>async </code><code className="colored">getOption(value)</code> property is optional and is only used when some non-empty initial <code>value</code> is passed for getting the initially selected option label.
					</li>
				</ul>
			</Example>
		)
	}
}

const options =
[{
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