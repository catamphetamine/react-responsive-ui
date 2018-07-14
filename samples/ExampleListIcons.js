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

					<List.Item value="AF" label="Afghanistan" icon={ListIcon} />
					<List.Item value="BB" label="Barbados" icon={ListIcon} />
					<List.Item value="CA" label="Canada" icon={ListIcon} />
				</List>

				Value: {this.state.value === undefined ? '(none)' : this.state.value}

				<Highlight lang="jsx">{`
					<List
						className="rrui__shadow"
						onSelectItem={ value => this.setState({ value }) }>

						<List.Item value="AF" icon={Flag} label="Afghanistan" />
						<List.Item value="BB" icon={Flag} label="Barbados" />
						<List.Item value="CA" icon={Flag} label="Canada" />
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