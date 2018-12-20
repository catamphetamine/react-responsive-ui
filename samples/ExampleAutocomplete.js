window.ExampleAutocomplete = class ExampleAutocomplete extends React.Component
{
	constructor()
	{
		super()
		this.state = { value: 'B' }
	}

	render()
	{
		return (
			<Example name="autocomplete" title="Autocomplete">
				<Autocomplete
					highlightFirstOption={false}
					style={input_style}
					className="column-width"
					label="Food"
					name="dropdown"
					value={this.state.value}
					options={options}
					onChange={ value => this.setState({ value }) }/>

				Value: {this.state.value ? this.state.value : '(empty)'}

				<Highlight lang="jsx">{`
					<Autocomplete
						label="Fruit"
						value={...}
						onChange={...}
						options={[{ value: 'A', label: 'Apple' }, ...]} />
				`}</Highlight>

				<code className="colored">{'<Autocomplete/>'}</code> also takes optional properties:

				<ul className="list">
					<li><code className="colored">highlightFirstOption</code> — set to <code className="colored">false</code> to stop highlighting the first option in the list. Is <code className="colored">true</code> by default. Automatically highlighting the first option is more convenient for regular users. "Screen reader" users though will find it more convenient to only highlight an option when explicitly navigating the list of options via arrow keys. "Screen reader" users will still be able to operate with the first option being automatically highlighted, they'll just be traversing the options list starting with the second option and they will be able to navigate to the first option by pressing the up arrow key.</li>
				</ul>
			</Example>
		)
	}
}

const options =
[{
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
}]