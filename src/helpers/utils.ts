import axios from "axios";
export const errorMessage = (error: any) => {
  const isExios = axios.isAxiosError(error);
  console.log(isExios);
  if (isExios) {
    return error.response?.data.error;
  } else {
    return error.message
      ? error?.message
      : "Something went wrong, Please try again.";
  }
};
