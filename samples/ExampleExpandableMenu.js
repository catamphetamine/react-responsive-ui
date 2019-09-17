window.ExampleExpandableMenu = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="expandable-menu" title="Expandable Menu">

				<ExpandableMenu
					aria-label="Menu"
					className="column-width"
					togglerElement="Menu"
					style={{ ...input_style, marginBottom: 0, width: 'auto' }}>
					<List.Item onClick={() => alert('Google')}>Google</List.Item>
					<List.Item onClick={() => alert('Yandex')}>Yandex</List.Item>
					<List.Item><Divider/></List.Item>
					<List.Item onClick={() => console.log('Other')}>Other</List.Item>
				</ExpandableMenu>

				<Highlight lang="jsx">{`
					<ExpandableMenu togglerElement="Menu">
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
					<li><code className="colored">togglerElement</code> — a <code className="colored">React.Element</code> that will be wrapped in a <code className="colored">&lt;button/&gt;</code>.</li>
					<li><code className="colored">togglerButtonProps</code> — (optional) Additional toggler <code className="colored">&lt;button/&gt;</code> properties. Example: <code className="colored">{'{ "title": "Menu" }'}</code>.</li>
					{/*
					<li><code className="colored">togglerAriaLabel</code> — (optional) <code className="colored">aria-label</code> for the toggler-wrapping <code className="colored">&lt;button/&gt;</code>.</li>
					<li><code className="colored">togglerAriaHasPopup</code> — (optional) <code className="colored">aria-haspopup</code> for the toggler-wrapping <code className="colored">&lt;button/&gt;</code>.</li>
					<li><code className="colored">togglerClassName</code> — (optional) <code className="colored">className</code> for the toggler-wrapping <code className="colored">&lt;button/&gt;</code>.</li>
					*/}
				</ul>
			</Example>
		)
	}
}