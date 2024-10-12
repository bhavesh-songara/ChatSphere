import axios, { AxiosRequestConfig } from "axios";

export const fetcher = async (payload: AxiosRequestConfig) => {
  try {
    const response = await axios(payload);

    return {
      data: response?.data,
    };
  } catch (error: any) {
    return {
      error,
      errorMessage: error?.response?.data?.message,
    };
  }
};
