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

				<code className="colored">{'<ExpandableMenu/>'}</code> receives optional properties:

				<ul className="list">
					<li><code className="colored">button</code> — Menu button component that will receive props: <code className="colored">onClick</code>, <code className="colored">onKeyDown</code>, <code className="colored">onBlur</code>, <code className="colored">aria-expanded</code>, etc. Must use <code className="colored">React.forwardRef()</code> to forward the <code className="colored">ref</code> to the <code className="colored">&lt;button/&gt;</code> DOM Element.</li>
					<li><code className="colored">buttonProps</code> — Additional properties for the <code className="colored">button</code> component. Example: <code className="colored">{'{ "title": "Menu" }'}</code>.</li>
					<li><code className="colored">buttonClassName</code> — Menu button element <code className="colored">className</code>.</li>
					<li><code className="colored">toggleElement</code> — Instead of specifying <code className="colored">button</code> and <code className="colored">buttonProps</code> one could specify <code className="colored">toggleElement</code> instead (a simpler approach): <code className="colored">toggleElement</code> would be the <code className="colored">children</code> of the default button element (a regular <code className="colored">&lt;button type="button" className="rrui__button-reset rrui__outline {'${buttonClassName}'}"/&gt;</code>).</li>
					<li><code className="colored">ScrollableContainer</code> — A container element that receives properties: <code className="colored">style</code> (<code className="colored">undefined</code> or <code className="colored">{'{ maxHeight: "12345px" }'}</code>), <code className="colored">maxHeight</code> (<code className="colored">undefined</code> or a number), <code className="colored">children</code>. Can be used to replace a system-default vertical scrollbar with a custom-design one like <code className="colored">react-simplebar</code>.</li>

					{/*
					<li><code className="colored">togglerAriaLabel</code> — <code className="colored">aria-label</code> for the toggler-wrapping <code className="colored">&lt;button/&gt;</code>.</li>
					<li><code className="colored">togglerAriaHasPopup</code> — <code className="colored">aria-haspopup</code> for the toggler-wrapping <code className="colored">&lt;button/&gt;</code>.</li>
					<li><code className="colored">togglerClassName</code> — <code className="colored">className</code> for the toggler-wrapping <code className="colored">&lt;button/&gt;</code>.</li>
					*/}
				</ul>
			</Example>
		)
	}
}