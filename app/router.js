/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.post('/login', controller.home.login);
  router.post('/teacher/get', _jwt, controller.teacher.getTeachers)
  router.post('/teacher/add', controller.teacher.addTeacher)
  router.get('/teacher/delete', _jwt, controller.teacher.deleteTeacher)
  router.get('/teacher/getDetail', _jwt, controller.teacher.getTeacherDetail)
  router.post('/student/get', _jwt, controller.student.getStudents)
  router.get('/student/public', controller.student.getPublicStudent)
  router.post('/student/setPublic', _jwt, controller.student.setPublicStudent)
  router.get('/student/getDetail', _jwt, controller.student.getStudentDetail)
  router.post('/student/add', controller.student.addStudent)
  router.get('/student/delete', _jwt, controller.student.deleteStudent)
  router.post('/student/edit/charge', _jwt, controller.student.editCharge)
  router.post('/student/edit/teacher', _jwt, controller.student.chargeStudent)
};
