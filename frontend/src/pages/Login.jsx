import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function Login() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        setLoading(true)

        try {

            const response = await API.post(
                "/login",
                formData
            )

            if (!response.data.access_token) {

                alert(
                    response.data.message ||
                    "Login failed"
                )

                return
            }

            localStorage.setItem(
                "token",
                response.data.access_token
            )

            alert("Login successful")

            navigate("/dashboard")

        } catch (error) {

            console.error(error)

            alert(
                error.response?.data?.detail ||
                "Invalid email or password"
            )

        } finally {

            setLoading(false)
        }
    }

    return (

        <div className="min-h-screen bg-black flex items-center justify-center">

            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-10 rounded-xl w-[400px] space-y-5 shadow-lg"
            >

                <div className="text-center">

                    <h1 className="text-white text-3xl font-bold">
                        NeuroNotes
                    </h1>

                    <p className="text-zinc-400 mt-2">
                        Login to your account
                    </p>

                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-zinc-400">

                    Don't have an account?

                    <span
                        onClick={() => navigate("/register")}
                        className="text-blue-500 cursor-pointer ml-2"
                    >
                        Register
                    </span>

                </p>

                <p
                    onClick={() => navigate("/")}
                    className="text-center text-zinc-500 cursor-pointer hover:text-white"
                >
                    Back to Home
                </p>

            </form>

        </div>
    )
}

export default Login