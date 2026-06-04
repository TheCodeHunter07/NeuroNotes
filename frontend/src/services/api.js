import axios from "axios"

const API = axios.create({
    baseURL: "https://neuronotes-mcrg.onrender.com"
})

export default API