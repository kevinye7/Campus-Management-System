const router = require('express').Router();
const { Campus, Student } = require('../../database/models');

// GET all students
router.get('/', async (req, res, next) => {
  try {
    const students = await Student.findAll({ include: [Campus] });
    res.json(students);
  } catch (error) {
    next(error);
  }
});

// GET single student
router.get('/:studentId', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId, {
      include: [Campus]
    });
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// POST create student
router.post('/', async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

// PUT update student
router.put('/:studentId', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId);
    await student.update(req.body);
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// DELETE student
router.delete('/:studentId', async (req, res, next) => {
  try {
    await Student.destroy({ where: { id: req.params.studentId } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;