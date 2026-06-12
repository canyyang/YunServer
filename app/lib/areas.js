'use strict';

/** 学员/教员区域选项（学员单选，教员多选） */
const AREAS = [
  '榕城', '东山', '蓝城', '渔湖', '梅云', '仙桥', '曲溪', '埔田',
  '云路', '锡场', '炮台', '玉滘', '揭西', '惠来', '其他',
];

function isValidArea(area) {
  return typeof area === 'string' && AREAS.includes(area);
}

module.exports = {
  AREAS,
  isValidArea,
};
