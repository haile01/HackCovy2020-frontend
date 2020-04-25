import axios from 'axios'

const api = {
  getSession: () => new Promise(resolve => axios.get("").then((res: any) => resolve(res))),
  signIn: (body: any) => new Promise(resolve => axios.post("", { body: body }).then((res: any) => resolve(res))),
  book: (body: any) => new Promise(resolve => axios.post("", { body: body }).then((res: any) => resolve(res))),
  // searchBooking: (query: any) => new Promise(resolve => axios.get("api/booking/" + query).then((res: any) => resolve(res))),
  // getUser: (query: any) => new Promise(resolve => axios.get("api/user/" + query).then((res: any) => resolve(res))),
  // getDoctors: (query: any) => new Promise(resolve => axios.get("api/group/" + query).then((res: any) => resolve(res))),
  // getGroups: () => new Promise(resolve => axios.get("api/group").then((res: any) => resolve(res))),
  getGroups: () => new Promise(resolve => resolve({
    success: true,
    data: [
      { key: '1', value: 1, text: 'Khoa Nhi' },
      { key: '2', value: 2, text: 'Khoa Ngoại tổng hợp' },
      { key: '3', value: 3, text: 'Khoa Tim mạch' },
      { key: '4', value: 4, text: 'Khoa Tai mũi họng' },
      { key: '5', value: 5, text: 'Khoa gì đó' },
    ]
  })),
  getDoctors: (query: any) => new Promise(resolve => resolve({
    success: true,
    data: [
      { key: '1', value: 1, text: 'Hải đẹp trai' },
      { key: '2', value: 2, text: 'Lê Đình Hải' },
      { key: '3', value: 3, text: 'Hải' },
      { key: '4', value: 4, text: 'Minh Thư :<' },
      { key: '5', value: 5, text: 'Ai đó' },
    ]
  })),
  searchBooking: (query: any) => new Promise(resolve => {
    setTimeout(() => resolve(
      {
        success: true,
        data: [
          {  
            name: "Nguyễn Minh Huy",
            description: "Em bị đau bụng bác sĩ ạ",
            symptom: ["đau bụng", "tiêu chảy", "ho"],
            gender: "male",
            dob: "12/12/2001",
            address: "186/5 Hùng Vương, Nha Trang",
            phoneNumber: "0397612666",
            passportNumber: "225923301",
            healthCareId: "ABCABC00011",
            doctorId: "5ea2ec9710a79c6ec8a0e4ef",
            bookingDateTimestamp: 1587772800000,
            startBlockTimeIndex: 7,
            endBlockTimeIndex: 8
          }
        ]
      }
    ), 1000);
  }),
  getUser: (query: any) => new Promise(resolve => setTimeout(() => resolve({
    success: true,
    data: {
      name: "Hải đẹp trai",
      role: "doctor",
      availableTimeBlock: [
        [1,2,3,4,5,10,12,30,31],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6,7,8]
      ]
    }
  }), 1000)),
}

export default api;