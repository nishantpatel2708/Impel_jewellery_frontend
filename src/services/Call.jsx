import Axios from "axios";

const API_URL = `https://harmistechnology.com/admin.indianjewelley/api/`;

export default function call({ path, method, data }) {
  const token = localStorage.getItem("accessToken");

  return new Promise((resolve, reject) => {
    const config = {
      url: API_URL + path,
      method,
      data,
    };

    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    Axios(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        let status = error?.response?.data?.status;
        let errorMessage =
          error?.response?.data?.message || "An error occurred.";

        if ([401, 403, 404].includes(status)) {
          reject(errorMessage);
        } else {
          reject(errorMessage);
        }
      });
  });
}
