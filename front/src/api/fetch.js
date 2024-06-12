import axios from "axios";

export async function getData(options) {
  return await axios
    .request({
      url: `http://localhost:8000/${options}`,
    })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch(function (error) {
      console.error(error);
    });
}
