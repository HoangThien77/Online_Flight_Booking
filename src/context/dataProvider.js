import axios from "axios";

const apiUrl = "/api";
const httpClient = async (url, options = {}) => {
  try {
    const response = await axios({
      url,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    return {
      data: response.data,
    };
  } catch (error) {
    console.error("HTTP Client Error:", error);
    throw new Error(
      error.response?.data?.error || error.message || "Network error occurred",
    );
  }
};

const dataProvider = {
  getList: async (resource, params) => {
    const url = `${apiUrl}/${resource}`;

    // Điều chỉnh cách tính range
    const { page, perPage } = params.pagination;
    const start = (page - 1) * perPage;
    const end = page * perPage - 1;

    const { data, total } = await httpClient(url, {
      method: "GET",
      params: {
        range: JSON.stringify([start, end]),
        sort: JSON.stringify(params.sort || ["id", "DESC"]),
        filter: JSON.stringify(params.filter || {}),
      },
    });

    return {
      data: data.data, // Lấy data từ response mới
      total: data.total, // Lấy total từ response mới
    };
  },

  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { data } = await httpClient(url);

    return { data: { ...data, id: data.id } };
  },

  getMany: async (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    const { data } = await httpClient(url, {
      method: "GET",
      params: {
        ids: JSON.stringify(params.ids), // Gửi ids dưới dạng query params thay vì body
      },
    });

    // Đảm bảo data là một mảng
    const records = Array.isArray(data.data) ? data.data : [data.data];

    return {
      data: records.map((record) => ({
        ...record,
        id: record.id,
      })),
    };
  },

  // CREATE method
  create: async (resource, params) => {
    console.log(params.data);
    const url = `${apiUrl}/${resource}`;
    const { data } = await httpClient(url, {
      method: "POST",
      data: params.data,
    });

    return {
      data: { ...data, id: data.id },
    };
  },

  update: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { data } = await httpClient(url, {
      method: "PUT",
      data: params.data,
    });

    return {
      data: { ...data, id: data.id },
    };
  },

  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;

    await httpClient(url, {
      method: "DELETE",
    });

    return { data: { id: params.id } };
  },
};

export default dataProvider;
