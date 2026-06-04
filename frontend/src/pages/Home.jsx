import { useNavigate } from "react-router-dom"

function Home() {

    const navigate = useNavigate()

    return (

        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

            <h1 className="text-5xl font-bold mb-4">
                NeuroNotes
            </h1>

            <p className="text-zinc-400 mb-8">
                AI Powered Smart Notes
            </p>

            <div className="flex gap-4">

                <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"
                >
                    Login
                </button>

                <button
                    onClick={() => navigate("/register")}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded"
                >
                    Register
                </button>

            </div>

        </div>
    )
}

export default Home