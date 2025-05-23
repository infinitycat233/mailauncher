/**
 * API服务模块
 * 统一处理所有API请求，确保路径一致
 */
import axios from "axios";
import apiService from "./apiService";

// API基础路径
const API_BASE = "/api";

/**
 * 创建API URL
 * @param {string} path - API路径
 * @returns {string} 完整的API URL
 */
const createUrl = (path) => {
  // 确保路径格式正确
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  return `${API_BASE}${path}`;
};

/**
 * 部署模块API
 */
export const deployApi = {
  // 获取版本列表
  getVersions: () => apiService.get(createUrl("/versions")),

  // 部署版本 - 修复这里，确保提供deploy方法
  deploy: (version, instanceName) =>
    apiService.post("/api/deploy", {
      version,
      instance_name: instanceName,
    }),

  // 配置Bot
  configureBotSettings: (config) =>
    apiService.post(createUrl("/install/configure"), config),

  // 检查安装状态
  checkStatus: () => apiService.get(createUrl("/install-status")),

  // 添加兼容现有代码的checkInstallStatus方法
  checkInstallStatus: () => apiService.get(createUrl("/install-status")),
};

/**
 * 实例管理API
 */
export const instancesApi = {
  // 获取实例列表
  getInstances: async (source = "all") => {
    try {
      // 可以根据source参数调用不同的API端点
      const url =
        source === "all" ? "/api/instances" : `/api/instances/${source}`;
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error("获取实例列表失败:", error);
      throw error;
    }
  },

  // 获取实例统计
  getStats: () => apiService.get(createUrl("/instances/stats")),

  // 启动实例
  startInstance: async (instanceName) => {
    try {
      const response = await axios.post(`/api/instance/${instanceName}/start`);
      return response;
    } catch (error) {
      console.error(`启动实例${instanceName}失败:`, error);
      throw error;
    }
  },

  // 停止实例
  stopInstance: async (instanceName) => {
    try {
      const response = await axios.post(`/api/instance/${instanceName}/stop`);
      return response;
    } catch (error) {
      console.error(`停止实例${instanceName}失败:`, error);
      throw error;
    }
  },

  // 启动NapCat服务
  startNapcat: (instanceName) =>
    apiService.post(createUrl(`/start/${instanceName}/napcat`)),

  // 获取日志
  getLogs: (instanceName) =>
    apiService.get(createUrl(`/logs/instance/${instanceName}`)),

  // 删除实例
  deleteInstance: async (instanceName) => {
    try {
      const response = await axios.delete(`/api/instance/${instanceName}`);
      return response;
    } catch (error) {
      console.error(`删除实例${instanceName}失败:`, error);
      throw error;
    }
  },

  // 打开文件夹
  openFolder: (path) => apiService.post(createUrl("/open-folder"), { path }),

  // 获取所有可用版本
  getVersions: () => apiService.get(createUrl("/versions")),

  // 部署新实例
  deployInstance: (version, instanceName) =>
    apiService.post(createUrl("/deploy"), {
      version,
      instance_name: instanceName,
    }),
};

/**
 * 生成模拟实例数据
 * @param {number} count 要生成的实例数量
 * @returns {Array} 模拟实例数组
 */
function generateMockInstances(count = 3) {
  const statuses = ["running", "stopped"];
  const versions = ["latest", "stable", "beta", "v0.6.3", "v0.6.2"];
  const instances = [];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const version = versions[Math.floor(Math.random() * versions.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    instances.push({
      name: `maibot-${version}-${i + 1}`,
      status: status,
      installedAt: date.toISOString().split("T")[0],
      path: `D:\\MaiBot\\${version}-${i + 1}`,
      services: {
        napcat: status,
        nonebot: Math.random() > 0.5 ? status : "stopped",
      },
      version: version,
    });
  }

  return instances;
}

/**
 * 系统API
 */
export const systemApi = {
  // 健康检查
  healthCheck: () => apiService.get(createUrl("/health")),

  // 获取系统状态
  getStatus: () => apiService.get(createUrl("/status")),

  // 获取系统日志
  getLogs: () => apiService.get(createUrl("/logs/system")),
};

// 实例统计 - 修改为使用apiService
export const getInstanceStats = async () => {
  try {
    // 使用旧的API路径
    return await apiService.get("/api/instance-stats");
  } catch (error) {
    console.error("获取实例统计失败:", error);
    // 返回模拟数据
    return {
      total: 3,
      running: 1,
      stopped: 2,
      isMock: true,
    };
  }
};

export default {
  deployApi,
  instancesApi,
  systemApi,
  getInstanceStats,
};
