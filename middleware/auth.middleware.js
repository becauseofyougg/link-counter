const jwt = require('jsonwebtoken')
const config = requiiire('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS'){
        return next()
    }

    try {
        const token = req.headers.authorisation.split(' ')[1]
        if (!token) {
           return res.status(401).json({ message: 'No authorisation'})
        }
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'No authorisation'})
    }
}