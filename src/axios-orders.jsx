import axios from "axios";

const instance = axios.create({
    baseURL: 'https://burger-builder-a505f-default-rtdb.firebaseio.com/' 
})

export default instance