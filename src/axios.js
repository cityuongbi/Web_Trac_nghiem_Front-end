import axios from "axios";

axios.defaults.baseURL = "https://demo_project-1-d5070894.deta.app/";
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');