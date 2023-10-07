const DEBUG_AUTOCOMPLETE = true

window.ExampleAutocomplete = class ExampleAutocomplete extends React.Component
{
	constructor()
	{
		super()
		this.state = { value: 'B', anyValue: 'F' }
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

				{DEBUG_AUTOCOMPLETE && (
					<React.Fragment>
						<div>
							Set value externally
						</div>

						<br/>

						<button
							type="button"
							onClick={() => {
								this.setState({ value: 'C' })
							}}>
							Set value to C
						</button>

						<br/>
						<br/>
						<br/>
					</React.Fragment>
				)}

				<div>
					Value: {this.state.value ? this.state.value : '(empty)'}
				</div>

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

				<br/>

				<p>
					Notes on the <code className="colored">options</code> property:
				</p>

				<ul className="list">
					<li>Each <code className="colored">option</code> should have a <code className="colored">value</code> property. The component will use those <code className="colored">value</code>s to identify the corresponding <code className="colored">option</code>s.</li>
					<li>When not passing a custom <code className="colored">optionComponent</code> property, each <code className="colored">option</code> should have a <code className="colored">label</code> property that will be used to render the <code className="colored">option</code>.</li>
					<li>When not passing custom <code className="colored">getOption(value)</code> / <code className="colored">getOptions(query)</code> function properties, each <code className="colored">option</code> should have a <code className="colored">label</code> property that will be used to search in the <code className="colored">options</code>.</li>
				</ul>

				<br/>

				<p>
					Optional properties:
				</p>

				<ul className="list">
					<li><code className="colored">optionComponent</code> — Can be used for customization. Receives all properties of an <code className="colored">option</code> such as <code className="colored">value</code>, <code className="colored">label</code>, etc. Each <code className="colored">option</code> must have a <code className="colored">value</code> and a <code className="colored">label</code> (<code className="colored">value</code> may be <code className="colored">undefined</code>). Also receives properties: <code className="colored">selected</code>, <code className="colored">focused</code>, <code className="colored">disabled</code> (not used).</li>
					<li><code className="colored">highlightFirstOption</code> — Set to <code className="colored">false</code> to stop highlighting the first option in the list. Is <code className="colored">true</code> by default. Automatically highlighting the first option is more convenient for regular users. "Screen reader" users though will find it more convenient to only highlight an option when explicitly navigating the list of options via arrow keys. "Screen reader" users will still be able to operate with the first option being automatically highlighted, they'll just be traversing the options list starting with the second option and they will be able to navigate to the first option by pressing the up arrow key.</li>
					<li><code className="colored">emptyValue</code> — <code className="colored">onChange</code> function will be called with an <code className="colored">emptyValue</code> argument when the user clears the input. Is <code className="colored">undefined</code> by default.</li>
					<li><code className="colored">acceptsAnyValue</code> — Set to <code className="colored">true</code> to accept any user input as the resulting <code className="colored">value</code>. Is <code className="colored">false</code> by default, meaning that when the user focuses out of the input, the <code className="colored">value</code> property won't be updated and the input value will be reset according to the last selected option. P.S.: When passing <code className="colored">acceptsAnyValue={'{true}'}</code> property, the <code className="colored">options</code> can't contain <code className="colored">label</code>s.</li>
					<li><code className="colored">ScrollableContainer</code> — A container element that receives properties: <code className="colored">style</code> (<code className="colored">undefined</code> or <code className="colored">{'{ maxHeight: "12345px" }'}</code>), <code className="colored">maxHeight</code> (<code className="colored">undefined</code> or a number), <code className="colored">children</code>. Can be used to replace a system-default vertical scrollbar with a custom-design one like <code className="colored">react-simplebar</code>.</li>
				</ul>

				{DEBUG_AUTOCOMPLETE && (
					<React.Fragment>
						<br/>

						<div>
							<code className="colored">acceptsAnyValue: true</code> demo:
						</div>

						<br/>

						<Autocomplete
							autoComplete="off"
							style={input_style}
							className="column-width"
							label="Food"
							name="dropdown"
							value={this.state.anyValue}
							acceptsAnyValue
							options={options}
							onChange={ anyValue => this.setState({ anyValue }) }/>

						<div>
							Set value externally
						</div>

						<br/>

						<button
							type="button"
							onClick={() => {
								this.setState({ anyValue: 'C' })
							}}>
							Set value to C
						</button>

						<br/>
						<br/>
						<br/>

						<div>
							Value: {this.state.anyValue ? this.state.anyValue : '(empty)'}
						</div>
					</React.Fragment>
				)}
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