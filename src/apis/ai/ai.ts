import http from "../../utils/http";

import { appKey, getSign } from "./base";

http.defaults.headers["post"].appKey = appKey;
http.defaults.headers["post"].sign = await getSign();

// 定义 API 基础路径
const API_BASE_URL = "/open/api/v2";

// 智能体执行
export const agentExecuteAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/execute`,
        method:"POST"
    });
};

// 智能体停止
export const agentStopAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/execute/stop`
    });
};

// 智能体查询
export const agentSearchAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/search`
    });
};

// 文件上传
export const fileUploadAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/file/upload`
    });
};

// 文件下载
export const fileDownloadAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/file/download`
    });
};

// 智能体执行统计接口
export const agentStatisticsAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/statistics`
    });
};

// 异步任务提交
export const taskSubmitAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/task/submit`
    });
};

// 异步任务取消
export const taskStopAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/task/stop`
    });
};

// 异步任务状态查询
export const taskStatusAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/task/status`
    });
};

// 异步任务执行结果查询
export const taskMessagesAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/task/messages`
    });
};

// 智能体交互回答
export const agentResumeAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/execute/resume`
    });
};

// 智能体测试集查询
export const agentTestCasesAPI = () => {
    return http({
        url: `${API_BASE_URL}/agent/testCases`
    });
};