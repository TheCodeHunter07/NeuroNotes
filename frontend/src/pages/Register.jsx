import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function Register() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: "",
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
                "/register",
                formData
            )

            alert(response.data.message)

            setFormData({
                username: "",
                email: "",
                password: ""
            })

            navigate("/login")

        } catch (error) {

            console.log(error)

            alert(
                error.response?.data?.detail ||
                "Registration failed"
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
                        Create your account
                    </p>

                </div>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-zinc-800 text-white outline-none"
                    required
                />

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
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded transition"
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                <p className="text-center text-zinc-400">

                    Already have an account?

                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-500 cursor-pointer ml-2"
                    >
                        Login
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

export default Register