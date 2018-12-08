window.ExampleExpandableMenu = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		const Toggler = () => 'Menu'

		return (
			<Example name="expandable-menu" title="Expandable Menu">

				<ExpandableMenu
					className="column-width"
					toggler={Toggler}
					style={{ ...input_style, marginBottom: 0, width: 'auto' }}>
					<List.Item onClick={() => alert('Google')}>Google</List.Item>
					<List.Item onClick={() => alert('Yandex')}>Yandex</List.Item>
					<List.Item><Divider/></List.Item>
					<List.Item onClick={() => console.log('Other')}>Other</List.Item>
				</ExpandableMenu>

				<Highlight lang="jsx">{`
					const Toggler = () => 'Menu'

					<ExpandableMenu toggler={Toggler}>
						<List.Item onClick={() => alert('Google')}>
							Google
						</List.Item>

						<List.Item onClick={() => alert('Yandex')}>
							Yandex
						</List.Item>

						<List.Item>
							<Divider/>
						</List.Item>

						<List.Item onClick={() => console.log('Other')}>
							Other
						</List.Item>
					</ExpandableMenu>
				`}</Highlight>

				<code className="colored">{'<ExpandableMenu/>'}</code> takes properties:

				<ul className="list">
					<li><code className="colored">toggler</code> — a React component which will be wrapped in a <code className="colored">&lt;button/&gt;</code>.</li>
					<li><code className="colored">togglerAriaLabel</code> — (optional) <code className="colored">aria-label</code> for the toggler-wrapping <code className="colored">&lt;button/&gt;</code>.</li>
					<li><code className="colored">togglerClassName</code> — (optional) <code className="colored">className</code> for the toggler-wrapping <code className="colored">&lt;button/&gt;</code>.</li>
				</ul>
			</Example>
		)
	}
}