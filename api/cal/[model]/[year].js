module.exports = (req, res) => {
  const month = String(new Date().getUTCMonth() + 1).padStart(2, '0')
  res.redirect(`./${req.query.year}/${month}`)
}
