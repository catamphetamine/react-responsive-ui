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


				Optional properties:

				<ul className="list">
					<li><code className="colored">optionComponent</code> — Can be used for customization. Receives all properties of an <code className="colored">option</code> such as <code className="colored">value</code>, <code className="colored">label</code>, etc. Each <code className="colored">option</code> must have a <code className="colored">value</code> and a <code className="colored">label</code> (<code className="colored">value</code> may be <code className="colored">undefined</code>). Also receives properties: <code className="colored">selected</code>, <code className="colored">focused</code>, <code className="colored">disabled</code> (not used).</li>
					<li><code className="colored">selectedOptionComponent</code> — Can be used for customization. Receives all properties of the selected <code className="colored">option</code> such as <code className="colored">value</code>, <code className="colored">label</code>, etc. Each <code className="colored">option</code> must have a <code className="colored">value</code> and a <code className="colored">label</code> (<code className="colored">value</code> may be <code className="colored">undefined</code>). {/* Also receives properties: <code className="colored">wait</code> (is a passthrough <code className="colored">wait</code> property of the <code className="colored">&lt;Select/&gt;</code>, is passed inside <code className="colored">&lt;Autocomplete/&gt;</code>).*/}</li>
					<li><code className="colored">placement</code> — Set to <code className="colored">"left"</code> to render the toggle to the left of <code className="colored">children</code>. Is historically <code className="colored">"right"</code> by default.</li>
					<li><code className="colored">ScrollableContainer</code> — A container element that receives properties: <code className="colored">style</code> (<code className="colored">undefined</code> or <code className="colored">{'{ maxHeight: "12345px" }'}</code>), <code className="colored">maxHeight</code> (<code className="colored">undefined</code> or a number), <code className="colored">children</code>. Can be used to replace a system-default vertical scrollbar with a custom-design one like <code className="colored">react-simplebar</code>.</li>
					<li><code className="colored">getScrollableContainerHeight</code> — When passing a custom <code className="colored">ScrollableContainer</code>, it might also be required to pass a custom <code className="colored">getScrollableContainerHeight(scrollableContainer)</code> property function in cases when navigating through the list of options via keyboard doesn't automatically scroll the list.</li>
					<li><code className="colored">getScrollableContainerScrollY</code> — When passing a custom <code className="colored">ScrollableContainer</code>, it might also be required to pass a custom <code className="colored">getScrollableContainerScrollY(scrollableContainer)</code> property function in cases when navigating through the list of options via keyboard doesn't automatically scroll the list.</li>
					<li><code className="colored">setScrollableContainerScrollY</code> — When passing a custom <code className="colored">ScrollableContainer</code>, it might also be required to pass a custom <code className="colored">setScrollableContainerScrollY(scrollableContainer, scrollY)</code> property function in cases when navigating through the list of options via keyboard doesn't automatically scroll the list.</li>
				</ul>
			</Example>
		)
	}
}