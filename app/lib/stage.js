'use strict';

const STAGE_START = new Date('2013-06-01');

/** 2013-06-01 为第 1 期，每年 6 月 1 日换期 */
function getCurrentStage(date = new Date()) {
  let years = date.getFullYear() - STAGE_START.getFullYear();
  if (date.getMonth() < STAGE_START.getMonth()) {
    years--;
  }
  return years + 1;
}

/** 编号前两位表示期数（如 14047 → 14） */
function getStageFromId(id) {
  const str = String(id ?? '');
  if (str.length < 2) return null;
  return parseInt(str.slice(0, 2), 10);
}

function isCurrentStageId(id, stage = getCurrentStage()) {
  return getStageFromId(id) === stage;
}

function getCurrentStageQuery(stage = getCurrentStage()) {
  return {
    stage,
    id: { $gte: stage * 1000 + 1, $lt: (stage + 1) * 1000 },
  };
}

function rejectUnlessCurrentStage(ctx, id) {
  if (!isCurrentStageId(id)) {
    ctx.body = {
      code: 403,
      message: '只能操作当期数据',
      data: null,
    };
    return false;
  }
  return true;
}

function respondIfForbidden(ctx, result) {
  if (result?.forbidden) {
    ctx.body = {
      code: 403,
      message: '只能操作当期数据',
      data: null,
    };
    return true;
  }
  return false;
}

function stripMongoDoc(doc) {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return rest;
}

module.exports = {
  STAGE_START,
  getCurrentStage,
  getStageFromId,
  isCurrentStageId,
  getCurrentStageQuery,
  rejectUnlessCurrentStage,
  respondIfForbidden,
  stripMongoDoc,
};
