const ListIcon = ({ value, label, className }) => (
	<img
		className={`${className} country-icon`}
		title={label}
		src={`https://lipis.github.io/flag-icon-css/flags/4x3/${value.toLowerCase()}.svg`}/>
)

window.ExampleListIcons = React.createClass
({
	getInitialState() { return {} },

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
  <List.Item value="AF" icon={Icon} label="Afghanistan" />
  <List.Item value="BB" icon={Icon} label="Barbados" />
  <List.Item value="CA" icon={Icon} label="Canada" />
</List>

const Icon = ({ value, label, className }) => (
  <img
    className={\`\${className} country-icon\`}
    title={label}
    src={\`https://lipis.github.io/flag-icon-css/flags/4x3/\${value.toLowerCase()}.svg\`}/>
)
`}</Highlight>

<Highlight lang="css">{`
.country-icon {
	width  : 20px;
	height : 14px;
	border : 1px solid black;
}
`}</Highlight>

			</Example>
		)
	}
})