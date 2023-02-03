const NewMessageNotification = ({ from, hide }) => (
	<div className="new-message-notification">
		<img src={from.picture} className="new-message-notification__user-picture"/>
		<div className="new-message-notification__text"> New message from {from.name} </div>
		<button type="button" onClick={hide} className="new-message-notification__close"> OK </button>
	</div>
)

window.ExampleSnackbar = class ExampleComponent extends React.Component
{
	constructor()
	{
		super()
		this.state = {}
	}

	render()
	{
		return (
			<Example name="snackbar" title="Snackbar">

				<Button action={() => {
					const hours   = new Date().getHours()
					const minutes = new Date().getMinutes()
					const seconds = new Date().getSeconds()

					const pad = number => number < 10 ? '0' + number : number

					this.setState({
						snack: {
							// duration: -1,
							// close: true,
							content: `Current time — ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
							// content: `fasd fa dksfadsfkajsdfhlasdkjfhasdjkfhasdkljfhalsd jafdhlkjafhsdlkjfhasdljkf alsdjkfh alskdjfh aljskdfh laksdjhf alsdkj fhlaskdjhflakjsdhflkjasdhflajksdf afds fajlsdh flakjsdhf akjshdfalkjsdh flakjshd flakjsdhf laksjdhf alskdjfhlasdkjfhlaksdjfh lakjh`,
							action: {
								title: 'Action',
								onClick: () => console.log('Clicked')
							}
						}
					})
				}}>
					Show a snack
				</Button>

				<Snackbar value={this.state.snack}/>

<Highlight lang="jsx">{`
<Button action={() => this.setState({
	snack: {
		content: "...",
		action: {
			title: "Action",
			onClick: () => {}
		}
	}
})}>
  Show a snack
</Button>

<Snackbar value={this.state.snack} />
`}</Highlight>

<Highlight lang="css">{`
	/* See \`--rrui-snackbar-\` CSS variables in \`variables.css\` */
`}</Highlight>

			<div>
			<code className="colored">value</code> can also be not just a string but an object of shape:
			</div>

			<ul className="list">
				<li><code className="colored">content</code> — A string or a React element.</li>
				<li><code className="colored">component</code> — (optional) Instead of <code className="colored">content</code> property one may supply <code className="colored">component</code> property which must be a React component which receives all <code className="colored">value.props</code> properties and also <code className="colored">hide</code> property (a function that hides the notification).</li>
				<li><code className="colored">length</code> — (optional) Content length. Is used when calculating <code className="colored">duration</code> automatically. Is calculated automatically for string content.</li>
				<li><code className="colored">type</code> — (optional) Is appended as a BEM modifier to <code className="colored">.rrui__snackbar</code> CSS class. E.g. <code className="colored">.rrui__snackbar--error</code> for <code className="colored">{'{ type: "error" }'}</code>.</li>
				<li><code className="colored">duration</code> — (optional) How long will the notification stay. <code className="colored">-1</code> means "until manually closed". If not specified will be calculated automatically based on <code className="colored">length</code>.</li>
				<li><code className="colored">action</code> — (optional) An optional action button on the right side. An object of shape <code className="colored">{'{ title: string, onClick: function }'}</code>.</li>
				<li><code className="colored">close</code> — (optional) Set to <code className="colored">true</code> to show an "X" (close) button on the right side. The close button is shown automatically if <code className="colored">content</code> is a <code className="colored">string</code> and <code className="colored">duration</code> is <code className="colored">-1</code>.</li>
			</ul>

			<br/>

			<Button action={() => this.setState({
				snack: {
					type: 'new-message-notification',
					component : NewMessageNotification,
					props : {
						from : {
							picture : 'https://pbs.twimg.com/profile_images/658376777258151936/-Jz8l4Rr_200x200.jpg',
							name : 'Pavel Durov'
						}
					},
					duration: -1
				}
			})}>
				Show new message notification
			</Button>

<Highlight lang="jsx">{`
<Snackbar value={this.state.snack} />

const NewMessageNotification = ({ from, hide }) => (
  <div>
    <img src={from.picture}/>
    <div> New message from {from.name} </div>
    <button type="button" onClick={hide}> OK </button>
  </div>
)

const newMessageReceived = (message) => {
  this.setState({
    snack: {
      type: 'new-message-notification',
      component: NewMessageNotification,
      props: { from: message.from },
      duration: -1
    }
  })
}

newMessageReceived({
  from: {
    picture: 'https://...',
    name: 'Pavel Durov'
  }
})
`}</Highlight>

<Highlight lang="css">{`
.rrui__snackbar--new-message-notification {
  padding: 0;
}
`}</Highlight>

				<code className="colored">{'<Snackbar/>'}</code> also receives optional properties:

				<ul className="list">
					<li><code className="colored">placement</code> — One of: <code className="colored">top-start</code>, <code className="colored">top</code>, <code className="colored">top-end</code>, <code className="colored">bottom-end</code>, <code className="colored">bottom</code>, <code className="colored">bottom-start</code>. Is <code className="colored">bottom-start</code> by default.</li>
				</ul>
			</Example>
		)
	}
}