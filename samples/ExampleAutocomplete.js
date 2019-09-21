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
					autoComplete="off"
					highlightFirstOption={true}
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

				<Highlight lang="css">{`
					/* See \`variables.css\` for customization. */
					/* All \`<List/>\` customizations apply here. */
				`}</Highlight>


				Properties:

				<ul className="list">
					<li><code className="colored">optionComponent</code> — (optional) Can be used for customization. Receives all properties of an <code className="colored">option</code> such as <code className="colored">value</code>, <code className="colored">label</code>, etc. Each <code className="colored">option</code> must have a <code className="colored">value</code> and a <code className="colored">label</code> (<code className="colored">value</code> may be <code className="colored">undefined</code>). Also receives properties: <code className="colored">selected</code>, <code className="colored">focused</code>, <code className="colored">disabled</code> (not used).</li>
					<li><code className="colored">highlightFirstOption</code> — (optional) Set to <code className="colored">false</code> to stop highlighting the first option in the list. Is <code className="colored">true</code> by default. Automatically highlighting the first option is more convenient for regular users. "Screen reader" users though will find it more convenient to only highlight an option when explicitly navigating the list of options via arrow keys. "Screen reader" users will still be able to operate with the first option being automatically highlighted, they'll just be traversing the options list starting with the second option and they will be able to navigate to the first option by pressing the up arrow key.</li>
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