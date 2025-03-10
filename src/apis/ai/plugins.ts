import http from '../../utils/http'; 

// 定义 API 基础路径
const API_BASE_URL = "/plugins/open/api/v2";

// 文件预处理
export const documentUpload = () => {
    return http({
        url: `${API_BASE_URL}/document/upload`,
        method: "POST" // 根据实际需求调整请求方法
    });
};

// 文件状态查询
export const documentTaskStatus = () => {
    return http({
        url: `${API_BASE_URL}/document/task/status`,
    });
};

// 文件数据删除
export const documentDelete = () => {
    return http({
        url: `${API_BASE_URL}/document/delete`,
    });
};

// 文件属性更新
export const documentAttributeUpdate = () => {
    return http({
        url: `${API_BASE_URL}/document/attribute_update`,
        
    });
};

// 内置文件下载
export const documentInternalDownload = () => {
    return http({
        url: `${API_BASE_URL}/document/internal_download`,
    });
};

// 文件元数据查询
export const documentMetadataQuery = () => {
    return http({
        url: `${API_BASE_URL}/document/metadata_query`,
    });
};

// 文件列表查询
export const documentMetadataPageQuery = () => {
    return http({
        url: `${API_BASE_URL}/document/metadata_page_query`,
    });
};

// 检索原文
export const documentSearch = () => {
    return http({
        url: `${API_BASE_URL}/document/search`,
    });
};

// 检索问答
export const documentChat = () => {
    return http({
        url: `${API_BASE_URL}/document/chat`,
    });
};

// 文档创作
export const documentCreation = () => {
    return http({
        url: `${API_BASE_URL}/document/creation`,
    });
};

// 文档翻译
export const documentTranslate = () => {
    return http({
        url: `${API_BASE_URL}/document/translate`,
    });
};

// 会话停止
export const documentStop = () => {
    return http({
        url: `${API_BASE_URL}/document/stop`,
    });
};