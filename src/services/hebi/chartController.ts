// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addChart POST /api/chart/add */
export async function addChartUsingPost(
  body: API.ChartAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/chart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** countCharts GET /api/chart/count */
export async function countChartsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/chart/count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** deleteChart POST /api/chart/delete */
export async function deleteChartUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/chart/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** editChart POST /api/chart/edit */
export async function editChartUsingPost(
  body: API.ChartEditRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/chart/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** genChartByAi POST /api/chart/gen */
export async function genChartByAiUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.genChartByAiUsingPOSTParams,
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.BaseResponseBiResponse_>('/api/chart/gen', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** genChartByAiAsync POST /api/chart/gen/async */
export async function genChartByAiAsyncUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.genChartByAiAsyncUsingPOSTParams,
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.BaseResponseBiResponse_>('/api/chart/gen/async', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** getChartGenerationStats GET /api/chart/gen/stats */
export async function getChartGenerationStatsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseMapStringObject_>('/api/chart/gen/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getChartGenerationSuccessRate GET /api/chart/gen/success-rate */
export async function getChartGenerationSuccessRateUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseDouble_>('/api/chart/gen/success-rate', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getChartById GET /api/chart/get */
export async function getChartByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChartByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseChart_>('/api/chart/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listChartByPage POST /api/chart/list/page */
export async function listChartByPageUsingPost(
  body: API.ChartQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageChart_>('/api/chart/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** countMyCharts GET /api/chart/my/count */
export async function countMyChartsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/chart/my/count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getMyChartGenerationSuccessRate GET /api/chart/my/gen/success-rate */
export async function getMyChartGenerationSuccessRateUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseDouble_>('/api/chart/my/gen/success-rate', {
    method: 'GET',
    ...(options || {}),
  });
}

/** listMyChartByPage POST /api/chart/my/list/page */
export async function listMyChartByPageUsingPost(
  body: API.ChartQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageChart_>('/api/chart/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getMyTodayChartCount GET /api/chart/my/today/count */
export async function getMyTodayChartCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/chart/my/today/count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getMyWeekChartSuccessCount GET /api/chart/my/week/success/count */
export async function getMyWeekChartSuccessCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListInt_>('/api/chart/my/week/success/count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getTodayChartCount GET /api/chart/today/count */
export async function getTodayChartCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/chart/today/count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** updateChart POST /api/chart/update */
export async function updateChartUsingPost(
  body: API.ChartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/chart/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getWeekChartSuccessCount GET /api/chart/week/success/count */
export async function getWeekChartSuccessCountUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListInt_>('/api/chart/week/success/count', {
    method: 'GET',
    ...(options || {}),
  });
}
