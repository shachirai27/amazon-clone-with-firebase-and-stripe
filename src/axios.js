//axios is a way of creating requests (POST, GET, fetching library, allows API interaction
import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5000/clone-a9821/us-central/api' //API URL (cloud function)
});

export default instance;