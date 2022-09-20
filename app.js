const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const jwt = require('jsonwebtoken');

const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/api/users');
const authUsersRouter = require('./routes/api/authorisedUser');
const { getUserByToken } = require('./controllers/users');

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

const authorize = (req, res, next) => {

	let token = req.headers.authorization
	if(token.split(" ").length > 1) {
		token = token.split(" ")[1]
	}

	const authorizationFailed = () => {
		res.status(401).json({
			message: "Not authorized" 
		})
	}

	if(!jwt.verify(token, process.env.SECRET)){
		authorizationFailed()
	}

	getUserByToken(req, res, token)
	.then(user => {
		if(user){
			req.user = user
			next()
		}else{
			authorizationFailed()
		}
	})
}

app.use('/users', usersRouter)

app.use(authorize)

app.use('/users', authUsersRouter)

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  	res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  	res.status(500).json({ message: err.message })
})

module.exports = app
