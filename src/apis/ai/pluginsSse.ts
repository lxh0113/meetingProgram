// document-urls.ts
const API_BASE_URL = "";

export const DOCUMENT_ENDPOINTS = {
  /** 文件预处理 */
  DOCUMENT_UPLOAD: `${API_BASE_URL}/open/api/v2/document/upload`,

  /** 文件状态查询 */
  DOCUMENT_TASK_STATUS: `${API_BASE_URL}/open/api/v2/document/task/status`,

  /** 文件数据删除 */
  DOCUMENT_DELETE: `${API_BASE_URL}/open/api/v2/document/delete`,

  /** 文件属性更新 */
  DOCUMENT_ATTRIBUTE_UPDATE: `${API_BASE_URL}/open/api/v2/document/attribute_update`,

  /** 内置文件下载 */
  DOCUMENT_INTERNAL_DOWNLOAD: `${API_BASE_URL}/open/api/v2/document/internal_download`,

  /** 文件元数据查询 */
  DOCUMENT_METADATA_QUERY: `${API_BASE_URL}/open/api/v2/document/metadata_query`,

  /** 文件列表查询 */
  DOCUMENT_METADATA_PAGE_QUERY: `${API_BASE_URL}/open/api/v2/document/metadata_page_query`,

  /** 检索原文 */
  DOCUMENT_SEARCH: `${API_BASE_URL}/open/api/v2/document/search`,

  /** 检索问答 */
  DOCUMENT_CHAT: `${API_BASE_URL}/open/api/v2/document/chat`,

  /** 文档创作 */
  DOCUMENT_CREATION: `${API_BASE_URL}/open/api/v2/document/creation`,

  /** 文档翻译 */
  DOCUMENT_TRANSLATE: `${API_BASE_URL}/open/api/v2/document/translate`,

  /** 会话停止 */
  DOCUMENT_STOP: `${API_BASE_URL}/open/api/v2/document/stop`,
} as const;
