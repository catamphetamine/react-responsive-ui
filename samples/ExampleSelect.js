window.ExampleSelect = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="select" title="Select">

				<Select
					style={input_style}
					className="column-width"
					name="dropdown"
					label="Fruit"
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
						divider: true
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
						label="Fruit"
						value={...}
						onChange={...}
						options={[{ value: 'A', label: 'Apple' }, ..., { divider: true }, ...]} />
				`}</Highlight>

				<Highlight lang="css">{`
					/* See \`--rrui-select-...\` variables in \`variables.css\` for customization. */
					/* All \`<List/>\` customizations also apply here. */
				`}</Highlight>


				Properties:

				<ul className="list">
					<li><code className="colored">optionComponent</code> — (optional) Can be used for customization. Receives all properties of an <code className="colored">option</code> such as <code className="colored">value</code>, <code className="colored">label</code>, etc. Each <code className="colored">option</code> must have a <code className="colored">value</code> and a <code className="colored">label</code> (<code className="colored">value</code> may be <code className="colored">undefined</code>). Also receives properties: <code className="colored">selected</code>, <code className="colored">focused</code>, <code className="colored">disabled</code>.</li>
					<li><code className="colored">selectedOptionComponent</code> — (optional) Can be used for customization. Receives all properties of the selected <code className="colored">option</code> such as <code className="colored">value</code>, <code className="colored">label</code>, etc. Each <code className="colored">option</code> must have a <code className="colored">value</code> and a <code className="colored">label</code> (<code className="colored">value</code> may be <code className="colored">undefined</code>). {/* Also receives properties: <code className="colored">wait</code> (is a passthrough <code className="colored">wait</code> property of the <code className="colored">&lt;Select/&gt;</code>, is passed inside <code className="colored">&lt;Autocomplete/&gt;</code>).*/}</li>
					<li><code className="colored">placement</code> — (optional) Set to <code className="colored">"left"</code> to render the toggle to the left of <code className="colored">children</code>. Is historically <code className="colored">"right"</code> by default.</li>
				</ul>
			</Example>
		)
	}
}