export const attachFindQuery = (model) => {
	return (req, res, next) => {
		req.dbQuery = model.find({})
		next()
	}
}

export const attachAddQuery = (model) => {
	return (req, res, next) => {
		req.body.created_by = req.user._id
		req.dbQuery = model.create(req.body)
		next()
	}
}

export const attachUpdateQuery = (model) => {
	return (req, res, next) => {
		req.dbQuery = model.updateMany({}, req.body)
		next()
	}
}

export const attachDeleteQuery = (model) => {
	return (req, res, next) => {
		req.dbQuery = model.deleteMany({})
		next()
	}
}
