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
			<Example name="expansion-panel" title="Expansion Panel">

				<ExpansionPanel title="Accordion">
					<p style={{ marginBottom: '1em' }}>
						The accordion is a graphical control element comprising a vertically stacked list of items, such as labels or thumbnails. Each item can be "expanded" or "stretched" to reveal the content associated with that item. There can be zero expanded items, exactly one, or more than one item expanded at a time, depending on the configuration.
					</p>
					<p style={{ marginBottom: '1em' }}>
						The term stems from the musical accordion in which sections of the bellows can be expanded by pulling outward.
					</p>
					<p style={{ marginBottom: '1em' }}>
						A common example of an accordion is the Show/Hide operation of a box region, but extended to have multiple sections in a list.
					</p>
					<p style={{ marginBottom: '1em' }}>
						An accordion is similar in purpose to a tabbed interface, a list of items where exactly one item is expanded into a panel (i.e. list items are shortcuts to access separate panels).
					</p>
				</ExpansionPanel>

				<br/>

				<ExpansionPanel title='Accordion (with toggle icon on the left side)' toggleIconPlacement="start">
					<p style={{ marginBottom: '1em' }}>
						The accordion is a graphical control element comprising a vertically stacked list of items, such as labels or thumbnails. Each item can be "expanded" or "stretched" to reveal the content associated with that item. There can be zero expanded items, exactly one, or more than one item expanded at a time, depending on the configuration.
					</p>
					<p style={{ marginBottom: '1em' }}>
						The term stems from the musical accordion in which sections of the bellows can be expanded by pulling outward.
					</p>
					<p style={{ marginBottom: '1em' }}>
						A common example of an accordion is the Show/Hide operation of a box region, but extended to have multiple sections in a list.
					</p>
					<p style={{ marginBottom: '1em' }}>
						An accordion is similar in purpose to a tabbed interface, a list of items where exactly one item is expanded into a panel (i.e. list items are shortcuts to access separate panels).
					</p>
				</ExpansionPanel>

				<Highlight lang="jsx">{`
					<ExpansionPanel title="Title">
						Content
					</ExpansionPanel>
				`}</Highlight>

				<code className="colored">{'<ExpansionPanel/>'}</code> takes properties:

				<ul className="list">
					<li><code className="colored">isExpanded</code> — (optional) if <code className="colored">true</code> then the panel will be expanded initially.</li>
					<li><code className="colored">toggleIconPlacement</code> — (optional) if set to <code className="colored">"start"</code> then the arrow icon will be placed to the left of the title.</li>
				</ul>
			</Example>
		)
	}
}