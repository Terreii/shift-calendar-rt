module.exports = (req, res) => {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  res.redirect(`./${req.query.model}/${year}/${month}`)
}
