const {Router} = require('express')
const bcrypt = require('bcrypt')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = Router()

router.post(
    '/register',
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Minimum 6 symbols' )
            .isLength({ min: 6 })
    ],
    async(req,res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message : 'Data is not correct by registration'
            })
        }
        const {email, password}  = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            return res.status(400).json({ message: 'This user has aready registered' })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword })

        await user.save()

        res.status(201).json({ message: 'the user is created!'})


    } catch (error) {
        res.status(500).json({message:"something wrong happened"})
    }
})
router.post(
    '/login',
    [
        check('email', 'Enter the correct email').normalizeEmail().isEmail(),
        check('password', 'Fill in the password').exists()
    ],
    async(req,res) => {
        try {
            const errors = validationResult(req)
    
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message : 'Data is not correct by entering the system'
                })
            }  
        
        const {email, password} = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User is not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password'})
        }
        
        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h'}
        )

        res.jjson({ token, userId: user.id })
        } catch (error) {
            res.status(500).json({message:"something wrong happened"})
        }
})

module.exports = router