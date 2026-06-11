module.exports = app => {
  app.beforeStart(async () => {
    const modelNames = [ 'Student', 'Teacher', 'Counter' ];
    for (const name of modelNames) {
      if (app.model[name]) {
        await app.model[name].createIndexes();
      }
    }
  });
};
