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
				busy={this.state.busy}
				submit={() => {
					console.log('Submitting form...')
					this.setState({ busy: true })
					setTimeout(() => {
						console.log('Form submitted.')
						this.setState({ busy: false })
					},
					3500)
				}}>
				<div className="submit-form">
					<Button
						submit
						busy={this.state.busy}
						className="rrui__button--border">
						Submit Form
					</Button>
				</div>

				<div className="submit-form">
					<Button
						submit
						busy={this.state.busy}>
						SUBMIT
					</Button>
				</div>

				<div className="submit-form">
					Submitting: {this.state.busy ? 'true' : 'false'}
				</div>
			</Form>

<Highlight lang="jsx">{`
const submit = () => {
  console.log('Submitting form...')
  this.setState({ busy: true })
  setTimeout(() => {
    console.log('Form submitted.')
    this.setState({ busy: false })
  }, 3500)
}

<Form
  busy={this.state.busy}
  submit={submit}>
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
    busy={this.state.busy}
    className="rrui__button--border">
    Submit Form
  </Button>
</Form>
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
