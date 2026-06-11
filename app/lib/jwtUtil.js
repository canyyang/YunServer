'use strict';

/**
 * 从 Authorization 请求头提取 JWT 字符串
 * 支持 "Bearer <token>" 与直接传 token 两种格式
 */
function extractToken(authorization) {
  if (!authorization || authorization === 'null') {
    return null;
  }

  const parts = authorization.trim().split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    return parts[1];
  }

  return authorization.trim();
}

module.exports = {
  extractToken,
};
