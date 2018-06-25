window.ExampleListCustomContent = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="list-custom-content" title="List (custom content)">

				<List
					style={input_style}
					className="column-width rrui__shadow">

					<List.Item target="_blank" link="https://twitter.com/durov" value="PD" className="new-message-notification" style={{ height: 'auto', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
						<img className="new-message-notification__user-picture" src="https://pbs.twimg.com/profile_images/658376777258151936/-Jz8l4Rr_200x200.jpg"/>
						<span className="new-message-notification__text"> Pavel Durov </span>
					</List.Item>

					<List.Item target="_blank" link="https://twitter.com/realdonaldtrump" value="DT" className="new-message-notification" style={{ height: 'auto', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
						<img className="new-message-notification__user-picture" src="https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_200x200.jpg"/>
						<span className="new-message-notification__text"> Donald Trump </span>
					</List.Item>

					<List.Item target="_blank" link="https://twitter.com/monicalent" className="new-message-notification" style={{ height: 'auto', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}>
						<img className="new-message-notification__user-picture" src="https://pbs.twimg.com/profile_images/871032082805510144/7GvHJc-c_200x200.jpg"/>
						<span className="new-message-notification__text"> Monica Lent </span>
					</List.Item>
				</List>

<Highlight lang="jsx">{`
<List className="rrui__shadow">
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
