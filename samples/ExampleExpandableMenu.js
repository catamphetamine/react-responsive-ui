window.ExampleExpandableMenu = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		const MenuButton = React.forwardRef((props, ref) => (
			<Button
				{...props}
				ref={ref}
				className="rrui__button--border">
				MENU
			</Button>
		))
		return (
			<Example name="expandable-menu" title="Expandable Menu">

				<ExpandableMenu
					aria-label="Menu"
					className="column-width"
					button={MenuButton}
					style={{ ...input_style, marginBottom: 0, width: 'auto' }}>
					<List.Item onClick={() => alert('Google')}>Google</List.Item>
					<List.Item onClick={() => alert('Yandex')}>Yandex</List.Item>
					<List.Item><Divider/></List.Item>
					<List.Item onClick={() => console.log('Other')}>Other</List.Item>
				</ExpandableMenu>

				<Highlight lang="jsx">{`
					const MenuButton = React.forwardRef((props, ref) => (
						<Button {...props} ref={ref}>
							MENU
						</Button>
					))

					<ExpandableMenu button={MenuButton}>
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
					<li><code className="colored">button</code> — Menu button component that will receive props: <code className="colored">onClick</code>, <code className="colored">onKeyDown</code>, <code className="colored">onBlur</code>, <code className="colored">aria-expanded</code>, etc. Must use <code className="colored">React.forwardRef()</code> to forward the <code className="colored">ref</code> to the <code className="colored">&lt;button/&gt;</code> DOM Element.</li>
					<li><code className="colored">buttonProps</code> — (optional) Additional properties for the <code className="colored">button</code> component. Example: <code className="colored">{'{ "title": "Menu" }'}</code>.</li>
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