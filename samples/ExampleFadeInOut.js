window.ExampleFadeInOut = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {
			show: false
		}
	}

	render()
	{
		return (
			<Example name="fade-in-out" title="Fade In/Out">
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<button onClick={() => this.setState({ show: !this.state.show })}>
						Fade {this.state.show ? 'Out' : 'In'}
					</button>

					<FadeInOut show={this.state.show} fadeInDuration={300} fadeOutDuration={300}>
						<div style={{ marginLeft: '1rem' }}>Fades</div>
					</FadeInOut>
				</div>

				<br/>

				Show: {this.state.show === true ? 'true' : 'false'}
				{/*  ? '✓' : <span>−<span style={{ visibility: 'hidden' }}>✓</span></span> */}

				<Highlight lang="jsx">{`
					<button onClick={() => this.setState({ show: !this.state.show })}>
						Toggle
					</button>

					<FadeInOut
						show={this.state.show}
						fadeInDuration={300}
						fadeOutDuration={300}>
						<div>Fades</div>
					</FadeInOut>
				`}</Highlight>

			</Example>
		)
	}
}