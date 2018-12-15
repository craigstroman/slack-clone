export function indexPage(req, res) {
  res.render('index', {
    title: req.app.locals.title,
    content: req.app.locals.content,
    path: req.path,
  });
}