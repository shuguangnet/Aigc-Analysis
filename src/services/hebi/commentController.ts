// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getCommentListByPostId GET /api/comment/comments */
export async function getCommentListByPostIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommentListByPostIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListCommentVO_>('/api/comment/comments', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** addComment POST /api/comment/sendcomment */
export async function addCommentUsingPost(
  body: API.CommentAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/comment/sendcomment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
