import axios from 'axios'

const baseURL = 'http://35.240.224.152:8081/api/'
const request = {
  get: (url) => axios.get(baseURL + url, {
    method: 'GET',
    headers: {
      "Authorization": localStorage.getItem('token')
    }
  }),
  post: (url, body) => axios.post(baseURL + url, { ...body }, {
    method: 'POST',
    headers: {
      "Authorization": localStorage.getItem('token')
    },
  }),
  delete: (url) => axios.delete(baseURL + url, {
    method: 'DELETE',
    headers: {
      "Authorization": localStorage.getItem('token')
    }
  }),
  patch: (url, body) => axios.patch(baseURL + url, { ...body }, {
    method: 'PATCH',
    headers: {
      "Authorization": localStorage.getItem('token')
    },
  }),
}

const api = {
  getSession: () => new Promise(resolve => request.get("user/me").then((res: any) => resolve(res.data))),
  getBooking: (id: any) => new Promise(resolve => request.get("booking/" + id).then((res: any) => resolve(res.data))),
  signIn: (body: any) => new Promise(resolve => request.post("auth/sign-in", { ...body }).then((res: any) => resolve(res.data))),
  book: (body: any) => new Promise(resolve => request.post("booking/new", { ...body }).then((res: any) => resolve(res.data))),
  updateUser: (body: any) => new Promise(resolve => request.post("", { ...body }).then((res: any) => resolve(res.data))),
  changePassword: (body: any) => new Promise(resolve => request.patch("user/me/password", { ...body }).then((res: any) => resolve(res.data))),
  searchBooking: (query: any) => new Promise(resolve => request.get("booking/phone/" + query).then((res: any) => resolve(res.data))),
  getUser: (query: any) => new Promise(resolve => request.get("user/" + query).then((res: any) => resolve(res.data))),
  getDoctors: (query: any) => new Promise(resolve => request.get("user/group/" + query).then((res: any) => resolve(res.data))),
  getGroups: () => new Promise(resolve => request.get("groups").then((res: any) => resolve(res.data))),
  createGroup: (body: any) => new Promise(resolve => request.post("group/new", { ...body }).then((res: any) => resolve(res.data))),
  deleteGroup: (query: any) => new Promise(resolve => request.delete("group/delete/" + query).then((res: any) => resolve(res.data))),
  createUser: (body: any) => new Promise(resolve => request.post("user/new", { ...body }).then((res: any) => resolve(res.data))),
  deleteUser: (query: any) => new Promise(resolve => request.delete("user/delete/" + query).then((res: any) => resolve(res.data))),
  getAllUsers: () => new Promise(resolve => request.get("users").then((res: any) => resolve(res.data))),
  getMyBookings: () => new Promise(resolve => request.get("booking/me").then((res: any) => resolve(res.data))),
  updateTimeBlock: (body: any) => new Promise(resolve => request.patch("user/me/available-time", { ...body }).then((res: any) => resolve(res.data))),
  generateSignedUrl: (body: any) => new Promise(resolve => request.post("aws/generate-signed-url", { ...body }).then((res: any) => resolve(res.data))),
  uploadImage: (config: any) => new Promise(resolve => axios(config). then((res: any) => resolve(res))),
  imageLabel: (body: any) => new Promise(resolve => request.post("attachment", { ...body }).then((res: any) => resolve(res.data))),
  // getGroups: () => new Promise(resolve => resolve({
  //   success: true,
  //   data: [
  //     { key: '1', value: 1, text: 'Khoa Nhi' },
  //     { key: '2', value: 2, text: 'Khoa Ngoại tổng hợp' },
  //     { key: '3', value: 3, text: 'Khoa Tim mạch' },
  //     { key: '4', value: 4, text: 'Khoa Tai mũi họng' },
  //     { key: '5', value: 5, text: 'Khoa gì đó' },
  //   ]
  // })),
  // getDoctors: (query: any) => new Promise(resolve => resolve({
  //   success: true,
  //   data: [
  //     { key: '1', value: 1, text: 'Hải đẹp trai' },
  //     { key: '2', value: 2, text: 'Lê Đình Hải' },
  //     { key: '3', value: 3, text: 'Hải' },
  //     { key: '4', value: 4, text: 'Minh Thư :<' },
  //     { key: '5', value: 5, text: 'Ai đó' },
  //   ]
  // })),
  // searchBooking: (query: any) => new Promise(resolve => {
  //   setTimeout(() => resolve(
  //     {
  //       success: true,
  //       data: [
  //         {  
  //           _id: "5ea2ec9710a79c6ec8a0e4ef",
  //           name: "Nguyễn Minh Huy",
  //           description: "Em bị đau bụng bác sĩ ạ",
  //           symptom: ["đau bụng", "tiêu chảy", "ho"],
  //           gender: "male",
  //           dob: "12/12/2001",
  //           address: "186/5 Hùng Vương, Nha Trang",
  //           phoneNumber: "0397612666",
  //           passportNumber: "225923301",
  //           healthCareId: "ABCABC00011",
  //           doctorId: "5ea2ec9710a79c6ec8a0e4ef",
  //           bookingDateTimestamp: 1587772800000,
  //           startBlockTimeIndex: 7,
  //           endBlockTimeIndex: 8
  //         }
  //       ]
  //     }
  //   ), 1000);
  // }),
}

export default api;