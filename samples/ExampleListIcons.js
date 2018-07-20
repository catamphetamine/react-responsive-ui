const ListIcon = ({ value, label, className }) => (
	<img
		className={`${className} country-icon`}
		title={label}
		src={`https://lipis.github.io/flag-icon-css/flags/4x3/${value.toLowerCase()}.svg`}/>
)

window.ExampleListIcons = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="list-icons" title="List (icons)">

				<List
					style={input_style}
					className="column-width rrui__shadow"
					onSelectItem={value => this.setState({ value })}>

					<List.Item value="AF" icon={ListIcon}>Afghanistan</List.Item>
					<List.Item value="BB" icon={ListIcon}>Barbados</List.Item>
					<List.Item value="CA" icon={ListIcon}>Canada</List.Item>
				</List>

				Value: {this.state.value === undefined ? '(none)' : this.state.value}

				<Highlight lang="jsx">{`
					<List
						className="rrui__shadow"
						onSelectItem={ value => this.setState({ value }) }>

						<List.Item value="AF" icon={Flag}>
							Afghanistan
						</List.Item>

						<List.Item value="BB" icon={Flag}>
							Barbados
						</List.Item>

						<List.Item value="CA" icon={Flag}>
							Canada
						</List.Item>
					</List>

					const Flag = ({ value, label, className }) => (
						<img
							className={\`\${className} country-icon\`}
							title={label}
							src={\`https://lipis.github.io/flag-icon-css/flags/4x3/\${value.toLowerCase()}.svg\`}/>
					)
				`}</Highlight>

			</Example>
		)
	}
}