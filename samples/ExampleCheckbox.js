window.ExampleCheckbox = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="checkbox" title="Checkbox">

				<Checkbox
					style={input_style}
					className="column-width"
					name="checkbox"
					value={this.state.value}
					onChange={ value => this.setState({ value }) }>
					Accept the <a target="_blank" href="https://google.ru">User Agreement</a>
				</Checkbox>

				<Checkbox
					style={input_style}
					className="column-width"
					name="checkbox"
					multiline
					value={this.state.value}
					onChange={ value => this.setState({ value }) }>
					(<code>multiline</code>) <a target="_blank" href="https://en.wikipedia.org/wiki/Postmodernism">Postmodernism</a> describes a broad movement that developed in the mid to late 20th century across philosophy, the arts, architecture and criticism which marked a departure from modernism. While encompassing a broad range of ideas, postmodernism is typically defined by an attitude of skepticism, irony or distrust toward grand narratives, ideologies and various tenets of Enlightenment rationality, including notions of human nature, social progress, objective reality and morality, absolute truth, and reason.
				</Checkbox>

				Value: {this.state.value ? 'true' : 'false'}
				{/*  ? '✓' : <span>−<span style={{ visibility: 'hidden' }}>✓</span></span> */}

				<Highlight lang="jsx">{`
					<Checkbox
						value={...}
						onChange={...}>
						Accept the <a href="...">User Agreement</a>
					</Checkbox>

					<Checkbox
						multiline
						value={...}
						onChange={...}>
						Postmodernism describes a broad movement that developed ...
					</Checkbox>
				`}</Highlight>

				<Highlight lang="css">{`
					:root {
						--rrui-control-label-margin : 15px;
						--rrui-checkbox-size : 0.9em;
						--rrui-checkbox-stroke-color : black;
						--rrui-checkbox-fill-color : white;
						--rrui-checkbox-color-focus : cyan;
						--rrui-checkbox-color-checked : blue;
						--rrui-checkbox-color-active : blue;
					}
				`}</Highlight>

			</Example>
		)
	}
}