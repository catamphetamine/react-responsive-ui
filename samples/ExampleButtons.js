window.ExampleButtons = React.createClass
({
	getInitialState() { return {} },

	render()
	{
		return (
			<Example name="form-and-buttons" title="Form and Buttons">

				<div className="submit-form">
					<Button action={() => {}}>
						Borderless
					</Button>
				</div>

				<div className="submit-form">
					<Button action={() => {}} style={{ textTransform: 'uppercase' }}>
						Uppercase
					</Button>
				</div>

				<div className="submit-form">
					<Button action={() => console.log('test')} className="rrui__button--border">
						Bordered
					</Button>
				</div>

				<div className="submit-form">
					<Button link="https://google.com" target="_blank" className="rrui__button--border">
						Hyperlink
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

  <Button action={() => {}}>
    Borderless
  </Button>

  <Button
    link="https://google.com"
    target="_blank"
    className="rrui__button--border">
    Hyperlink
  </Button>

  <Button
    action={() => console.log('test')}
    className="rrui__button--border">
    Bordered
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
.rrui__button--border {
  padding-left  : 20px;
  padding-right : 20px;
  border        : 2px solid blue;
  border-radius : 5px;
}
.rrui__button--border .rrui__button__busy {
  left   : 20px;
  width  : calc(100% - 2 * 20px);
  bottom : 8px;
}
`}</Highlight>

			</Example>
		)
	}
})
