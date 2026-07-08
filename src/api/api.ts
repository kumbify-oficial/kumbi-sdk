import axios from "axios";

export async function fetchRequest({
  ...data
}: {
  url: string;
  method: "post" | "post-form" | "get" | "put" | "delete";
  body?: Record<string, any>;
  params?: Record<string, any>;
  headers?: Record<string, any>;
}) {
  let resp;

  const axiosAPI = axios.create({});

  switch (data.method) {
    case "delete":
      resp = await axiosAPI.delete(data.url, {
        data: data.body,
        headers: data.headers,
        params: data.params,
      });
      break;

    case "get":
      resp = await axiosAPI.get(data.url, {
        headers: data.headers,
        params: data.params,
      });
      break;

    case "post":
      resp = await axiosAPI.post(data.url, data.body, {
        headers: data.headers,
        params: data.params,
      });
      break;

    case "post-form":
      resp = await axiosAPI.postForm(data.url, data.body, {
        headers: data.headers,
        params: data.params,
      });
      break;

    case "put":
      resp = await axiosAPI.put(data.url, data.body, {
        headers: data.headers,
        params: data.params,
      });
      break;

    default:
      resp = await axiosAPI.get(data.url, {
        headers: data.headers,
        params: data.params,
      });
      break;
  }

  return resp.data;
}
