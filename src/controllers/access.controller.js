class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log('[P]::signUp::', req.body)
      return res.status(201).json({
        code : 'xxx',
        metadata: {userId : 1}
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AccessController()
