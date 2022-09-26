const userService = require('../services/users')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const path = require('path')
const Jimp = require('jimp');
const uuid = require('uuid')
const sendVerificationMail = require("./email")


async function saltifyPassword(password, saltRounds = 10) {
	try{
		const hash = await bcrypt.hash(password, saltRounds)
		return hash
	}
	catch(err){
		console.log(err)
	}
}

async function checkPassword(password, hash){
	try{
		const result = await bcrypt.compare(password, hash) 
		return result
	}
	catch(err){
		console.log(err)
	}
}

const registerUser = async (req, res, next) => {

    const user = await userService.checkEmail(req.body.email);
	
    if (user) {
        return res.status(409).json({
          	message: 'Email in use',
        });
    }

    try{
		const {email, password, subscription} = req.body
		const saltyPass = await saltifyPassword(password)
		const avatarURL = await gravatar.url(email);
		const verificationToken = uuid.v4()
		const result = await userService.register(
			{
				email, 
				password: saltyPass, 
				subscription,
				avatarURL,
				verificationToken
			} 
		)
		if (result) {
			// const token = createToken(result)
			sendVerificationMail(email, verificationToken, req.headers.host)
			res.status(201).json({user: result});

		}
    } catch (e) {
		res.status(400).json({ message: e.message })
		console.error(e);
		next(e);
    }
}

const loginUser = async (req, res, next) => {

    const { email, password } = req.body;

	try {
		const result = await userService.login({ email });
		if (result && await checkPassword(password, result.password)) {
			if(!result.verify){
				res.status(401).json({
					message: `You must verify your email`,
				});
				return
			}
			const { _id } = result
			const token = createToken(result)
			await userService.updateToken({ _id, token })
			const {email, subscription} = result
			res.json({user: {email, subscription}, token});
		} else {
			res.status(401).json({
				message: `Email or password is wrong`,
			});
		}
	} catch (e) {
		res.status(400).json({ message: e.message })
		console.error(e);
		next(e);
	}
};

const logoutUser = async (req, res, next) => {
	try {
		const {_id} = req.user
		await userService.removeToken(_id)
		res.status(204).json({})
	} catch (e) {
		res.status(400).json({ message: e.message })
		console.error(e);
		next(e);
	}
}

const getUserByToken = async (req, res, token) => {
	try {
		return await userService.getByToken(token)
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: e.message })
	}
}

const getCurrentUser = async (req, res, next) => {
	try {
		const {_id} = req.user
		const currentUser = await userService.getById(_id)
		const { email, subscription } = currentUser
		res.status(200).json({ email, subscription })
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: e.message })
	}
}

const changeUserSubscription = async (req, res, next) => {
	try {
		const {_id} = req.user
		const currentUser = await userService.changeSubscription({_id, subscription: req.body.subscription})
		const { email, subscription } = currentUser
		res.status(200).json({ email, subscription })
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: e.message })
	}
}

const changeUserAvatar = async (req, res, next) => {
	const avatarURL = path.join(process.cwd(), 'public', 'avatars', req.file.filename)
	const {_id} = req.user
	Jimp.read(req.file.path, (err, avatar) => {
		if(err){
			res.status(400).json(err)
			return
		}
		avatar
		.resize(250, 250)
		.write(avatarURL)
	})

	await userService.changeAvatarURL({ _id, avatarURL})

	res.json({
		avatarURL
	})
}

const verifyEmail = async (req, res, next) => {
	const {verificationToken} = req.params

	const user = await userService.findByVerificationToken({verificationToken})

	if(!user){
		res.status(400).json({ message: 'User not found' })
		return
	}

	await userService.verifyUser(user)
	res.json({message: 'Verification successful'})
}

function createToken({ _id, email}){
    const token = jwt.sign({ _id, email}, process.env.SECRET);
    return token
}

const resendVerificationEmail = async (req, res, next) => {
	const { email } = req.body

	if(!email){
		res.status(400).json({"message":"missing required field email"})
		return
	}
	const user = await userService.checkEmail(email)

	if(!user) {
		res.status(400).json({"message":"email isn't registered"})
	}else if(user.verify){
		res.status(400).json({"message":"Verification has already been passed"})
	}else{
		const sendResult = await sendVerificationMail(email, user.verificationToken, req.headers.host)
		res.json({"message":"Verification email sent"})
	}
}



module.exports = {
    registerUser,
    loginUser,
	logoutUser,
	getUserByToken,
	getCurrentUser, 
	changeUserSubscription,
	changeUserAvatar,
	verifyEmail,
	resendVerificationEmail
}