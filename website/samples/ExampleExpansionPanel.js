window.ExampleExpansionPanel = class ExampleComponent extends React.Component
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
					<p style={{ marginTop: 0, marginBottom: '1em' }}>
						The accordion is a graphical control element comprising a vertically stacked list of items, such as labels or thumbnails. Each item can be "expanded" or "stretched" to reveal the content associated with that item. There can be zero expanded items, exactly one, or more than one item expanded at a time, depending on the configuration.
					</p>
					<p style={{ marginTop: 0, marginBottom: '1em' }}>
						The term stems from the musical accordion in which sections of the bellows can be expanded by pulling outward.
					</p>
					<p style={{ marginTop: 0, marginBottom: '1em' }}>
						A common example of an accordion is the Show/Hide operation of a box region, but extended to have multiple sections in a list.
					</p>
					<p style={{ marginTop: 0, marginBottom: 0 }}>
						An accordion is similar in purpose to a tabbed interface, a list of items where exactly one item is expanded into a panel (i.e. list items are shortcuts to access separate panels).
					</p>
				</ExpansionPanel>

				<br/>

				<Highlight lang="jsx">{`
					<ExpansionPanel title="Title">
						Content
					</ExpansionPanel>
				`}</Highlight>

				<br/>

				<ExpansionPanel className="ExpansionPanel--button" title='Accordion' toggleIconPlacement="end">
					<p style={{ marginTop: 0, marginBottom: '1em' }}>
						The accordion is a graphical control element comprising a vertically stacked list of items, such as labels or thumbnails. Each item can be "expanded" or "stretched" to reveal the content associated with that item. There can be zero expanded items, exactly one, or more than one item expanded at a time, depending on the configuration.
					</p>
					<p style={{ marginTop: 0, marginBottom: '1em' }}>
						The term stems from the musical accordion in which sections of the bellows can be expanded by pulling outward.
					</p>
					<p style={{ marginTop: 0, marginBottom: '1em' }}>
						A common example of an accordion is the Show/Hide operation of a box region, but extended to have multiple sections in a list.
					</p>
					<p style={{ marginTop: 0, marginBottom: 0 }}>
						An accordion is similar in purpose to a tabbed interface, a list of items where exactly one item is expanded into a panel (i.e. list items are shortcuts to access separate panels).
					</p>
				</ExpansionPanel>

				<Highlight lang="jsx">{`
					<ExpansionPanel title="Title" toggleIconPlacement="end">
						Content
					</ExpansionPanel>
				`}</Highlight>

				<Highlight lang="css">{`
					:root {
						--rrui-expansion-panel-background-color: #fafafa;
						--rrui-expansion-panel-padding-left: calc(var(--rrui-unit) * 2);
						--rrui-expansion-panel-padding-right: calc(var(--rrui-unit) * 2);
						--rrui-expansion-panel-header-height: calc(var(--rrui-unit) * 4);
						--rrui-expansion-panel-header-height-expanded: calc(var(--rrui-unit) * 5);
						--rrui-expansion-panel-toggle-icon-rotate: 0deg;
						--rrui-expansion-panel-toggle-icon-rotate-expanded: 180deg;
					}

					.rrui__expansion-panel__header {
						width: 100%;
						border: 1px solid #d7d7d7;
						background-color: #efefef;
					}

					.rrui__expansion-panel__header:active {
						background-color: #eaeaea;
					}
				`}</Highlight>

				<code className="colored">{'<ExpansionPanel/>'}</code> receives properties:

				<ul className="list">
					<li><code className="colored">isExpandedInitially</code> — (optional) if <code className="colored">true</code> then the panel will be expanded initially.</li>
					<li><code className="colored">isExpanded</code> — (optional) can be used to control the "expanded" state of an expansion panel externally. For example, when there're several adjacent expansion panels, and a developer wants all others expansion panels to collapse when one of them is expanded.</li>
					<li><code className="colored">toggleIconPlacement</code> — (optional) one of: <code className="colored">"start"</code>, <code className="colored">"end"</code>. Is <code className="colored">"start"</code> by default. Set to <code className="colored">"end"</code> to render the arrow icon to the right of the title.</li>
				</ul>
			</Example>
		)
	}
}