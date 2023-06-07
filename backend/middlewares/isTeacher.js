const Enrollees = require('../models/enrollee')

const isTeacher = async (req, res, next) => {
    try {
        const enrollee = await Enrollees.findOne({_id: req.enrollee.id})
        if(!enrollee.Teacher) 
            return res.status(500).json({msg: "Teacher resources access denied."})

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = isTeacher