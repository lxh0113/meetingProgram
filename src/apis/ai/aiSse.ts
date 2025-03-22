// api-urls.ts
// const API_BASE_URL = "https://www.das-ai.com";
const API_BASE_URL = "";

export const API_ENDPOINTS = {
  /** 智能体执行 */
  EXECUTE: `${API_BASE_URL}/open/api/v2/agent/execute`,

  /** 智能体停止 */
  STOP_EXECUTION: `${API_BASE_URL}/open/api/v2/agent/execute/stop`,

  /** 智能体查询 */
  AGENT_SEARCH: `${API_BASE_URL}/open/api/v2/agent/search`,

  /** 文件上传 */
  FILE_UPLOAD: `${API_BASE_URL}/open/api/v2/agent/file/upload`,

  /** 文件下载 */
  FILE_DOWNLOAD: `${API_BASE_URL}/open/api/v2/agent/file/download`,

  /** 智能体执行统计 */
  EXECUTION_STATS: `${API_BASE_URL}/open/api/v2/agent/statistics`,

  /** 异步任务提交 */
  TASK_SUBMIT: `${API_BASE_URL}/open/api/v2/agent/task/submit`,

  /** 异步任务取消 */
  TASK_STOP: `${API_BASE_URL}/open/api/v2/agent/task/stop`,

  /** 异步任务状态查询 */
  TASK_STATUS: `${API_BASE_URL}/open/api/v2/agent/task/status`,

  /** 异步任务结果查询 */
  TASK_RESULTS: `${API_BASE_URL}/open/api/v2/agent/task/messages`,

  /** 智能体交互回答 */
  AGENT_RESPONSE: `${API_BASE_URL}/open/api/v2/agent/execute/resume`,

  /** 智能体测试集查询 */
  TEST_CASES: `${API_BASE_URL}/open/api/v2/agent/testCases`,
} as const;
