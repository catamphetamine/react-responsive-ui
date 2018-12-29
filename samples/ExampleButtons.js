window.ExampleButtons = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="form-and-buttons" title="Form and Buttons">

				<div className="submit-form">
					<Button onClick={() => {}}>
						Borderless
					</Button>
				</div>

				<div className="submit-form">
					<Button onClick={() => {}} style={{ textTransform: 'uppercase' }}>
						Uppercase
					</Button>
				</div>

				<div className="submit-form">
					<Button onClick={() => console.log('test')} className="rrui__button--border">
						Bordered
					</Button>
				</div>

				<div className="submit-form">
					<Button link="https://google.com" target="_blank" className="rrui__button--border">
						Hyperlink
					</Button>
				</div>

				<div className="submit-form">
					<Button onClick={() => new Promise(resolve => setTimeout(resolve, 3500))} className="rrui__button--border">
						Promise
					</Button>
				</div>

			<Form
				wait={this.state.submitting}
				submit={() => {
					console.log('Submitting form...')
					this.setState({ submitting: true })
					setTimeout(() => {
						console.log('Form submitted.')
						this.setState({ submitting: false })
					},
					3500)
				}}>
				<div className="submit-form">
					<Button
						submit
						wait={this.state.submitting}
						className="rrui__button--border">
						Submit Form
					</Button>
				</div>

				<div className="submit-form">
					<Button
						submit
						wait={this.state.submitting}>
						SUBMIT
					</Button>
				</div>

				<div className="submit-form">
					Submitting: {this.state.submitting ? 'true' : 'false'}
				</div>
			</Form>

<Highlight lang="jsx">{`
onSubmit = () => {
  if (this.state.submitting) {
    return
  }
  console.log('Submitting form...')
  this.setState({ submitting: true })
  setTimeout(() => {
    console.log('Form submitted.')
    this.setState({ submitting: false })
  }, 3500)
}

<form onSubmit={onSubmit}>
  ...

  <Button onClick={() => {}}>
    Borderless
  </Button>

  <Button
    link="https://google.com"
    target="_blank"
    className="rrui__button--border">
    Hyperlink
  </Button>

  <Button
    onClick={() => console.log('test')}
    className="rrui__button--border">
    Bordered
  </Button>

  <Button
    onClick={() => new Promise(resolve => setTimeout(resolve, 3500))}
    className="rrui__button--border">
    Promise
  </Button>

  <Button
    submit
    wait={this.state.submitting}
    className="rrui__button--border">
    Submit Form
  </Button>
</form>
`}</Highlight>

<Highlight lang="css">{`
	:root {
		--rrui-button-side-padding : 15px;
		--rrui-button-border-radius : 5px;
		--rrui-button-background-color : transparent;
		--rrui-button-text-color : blue;
		--rrui-button-background-color-active : blue;
		--rrui-button-text-color-active : white;
	}

	.rrui__button--border {
		border : 2px solid blue;
	}

	.rrui__button--border .rrui__button__busy {
		bottom : 8px;
	}
`}</Highlight>

			</Example>
		)
	}
}
