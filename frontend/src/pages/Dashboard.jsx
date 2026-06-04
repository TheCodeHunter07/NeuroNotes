import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import toast from "react-hot-toast"
import jsPDF from "jspdf"

function Dashboard() {

    const navigate = useNavigate()

    const [notes, setNotes] = useState([])

    const [summaries, setSummaries] = useState({})

    const [openSummaries, setOpenSummaries] = useState({})

    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        pinned: false,
        tag: ""
    })

    const [editingId, setEditingId] = useState(null)

    const [searchTerm, setSearchTerm] = useState("")

    const [selectedTag, setSelectedTag] = useState("All")

    const fetchNotes = async () => {

    try {

        const token = localStorage.getItem("token")

        const response = await API.get(
            "/notes",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        setNotes(response.data)

        return response.data

    } catch (error) {

        console.log(error)

        toast.error("Failed to fetch notes")

        return []
    }
}

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const createNote = async (e) => {

        e.preventDefault()

        try {

            const token = localStorage.getItem("token")

            await API.post(
                "/notes",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setFormData({
                title: "",
                content: "",
                pinned: false,
                tag: ""
            })

            await fetchNotes()

            toast.success("Note created")

            setShowForm(false)

        } catch (error) {

            console.log(error)

            toast.error("Failed to create note")
        }
    }

    const editNote = (note) => {

        setEditingId(note.id)

        setFormData({
            title: note.title,
            content: note.content,
            pinned: note.pinned,
            tag: note.tag || ""
        })

        setShowForm(true)

window.scrollTo({
    top: 0,
    behavior: "smooth"
})
    }

    const updateNote = async (e) => {

        e.preventDefault()

        try {

            const token = localStorage.getItem("token")

            await API.put(
                `/notes/${editingId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setEditingId(null)

            setFormData({
                title: "",
                content: "",
                pinned: false,
                tag: ""
            })

           await fetchNotes()

           toast.success("Note updated")

        } catch (error) {

            console.log(error)

           toast.error("Failed to update note")
        }
    }

    const deleteNote = async (noteId) => {

        if (
    !window.confirm(
        "Are you sure you want to delete this note?"
    )
) {
    return
}

        try {

            const token = localStorage.getItem("token")

            await API.delete(
                `/notes/${noteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            toast.success("Note deleted")

            setNotes(
                notes.filter(
                    note => note.id !== noteId
                )
            )

        } catch (error) {

            console.log(error)

            toast.error("Failed to delete note")
        }
    }

   const summarizeNote = async (note) => {

    toast.loading(
        "Generating summary...",
        {
            id: note.id
        }
    )

    try {

        const response = await API.post(
            "/summarize",
            {
                content: note.content
            }
        )

        setSummaries(prev => ({
            ...prev,
            [note.id]: response.data.summary
        }))

        setOpenSummaries(prev => ({
    ...prev,
    [note.id]: true
}))

        toast.success(
            "Summary generated",
            {
                id: note.id
            }
        )

    }

 catch (error) {

        console.log(error)

        toast.error(
            "Failed to summarize note",
            {
                id: note.id
            }
        )
    }
}

const exportPDF = (note) => {

    const doc = new jsPDF()

    let y = 20

    doc.setFontSize(20)

    doc.text(
        note.title,
        10,
        y
    )

    y += 15

    doc.setFontSize(12)

    doc.text(
        `Tag: ${note.tag || "None"}`,
        10,
        y
    )

    y += 10

    doc.text(
        `Pinned: ${
            note.pinned
                ? "Yes"
                : "No"
        }`,
        10,
        y
    )

    y += 15

    doc.text(
        "Content:",
        10,
        y
    )

    y += 10

    const contentLines =
        doc.splitTextToSize(
            note.content,
            180
        )

    doc.text(
        contentLines,
        10,
        y
    )

    y += contentLines.length * 7

    if (summaries[note.id]) {

        y += 10

        doc.setFontSize(14)

        doc.text(
            "AI Summary",
            10,
            y
        )

        y += 10

        doc.setFontSize(12)

        const summaryLines =
            doc.splitTextToSize(
                summaries[note.id],
                180
            )

        doc.text(
            summaryLines,
            10,
            y
        )
    }

    doc.save(
        `${note.title}.pdf`
    )

    toast.success(
        "PDF downloaded"
    )
}

  const logout = () => {

    localStorage.removeItem("token")

    toast.success("Logged out")

    navigate("/")
}
    useEffect(() => {

        fetchNotes()

    }, [])

   const filteredNotes = notes.filter((note) => {

    const matchesSearch =

        note.title.toLowerCase().includes(
            searchTerm.toLowerCase()
        ) ||

        (note.content || "")
    .toLowerCase()
    .includes(
        searchTerm.toLowerCase()
    )

    const matchesTag =

        selectedTag === "All" ||

        note.tag === selectedTag

    return matchesSearch && matchesTag
})

    const sortedNotes = [...filteredNotes].sort(
        (a, b) => Number(b.pinned) - Number(a.pinned)
    )

    const tags = [
    "All",
    ...new Set(
        notes
            .map(note => note.tag)
            .filter(Boolean)
    )
]

    const totalNotes = notes.length

    const pinnedNotes = notes.filter(
    note => note.pinned
).length

const totalTags =
    tags.length - 1

    return (

        <div className="min-h-screen bg-black text-white p-4 md:p-10">

            <div className="
flex
flex-col
md:flex-row
justify-between
items-start
md:items-center
gap-4
mb-10
">

               <div>

    <h1 className="text-3xl md:text-4xl font-bold">
        🧠 NeuroNotes
    </h1>

    <p className="text-zinc-400 mt-2">
        Organize, search, summarize and export your notes with AI.
    </p>

    <p className="text-blue-400 mt-2 font-medium">
        {totalNotes} Notes Available
    </p>

</div>

                <button
                    onClick={logout}
                    className="
bg-red-600
hover:bg-red-700
px-4 md:px-5
py-2
rounded
"
                >
                   🚪 Logout
                </button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

    <div className="
bg-zinc-900
p-4
rounded-xl
border
border-zinc-800
hover:border-blue-500
hover:scale-105
hover:shadow-blue-500/20
transition-all
duration-200
shadow-lg
">

        <p className="text-zinc-400">
            Total Notes
        </p>

        <h2 className="text-3xl md:text-4xl font-bold mt-2">
            📝 {totalNotes}
        </h2>

    </div>

    <div className="
bg-zinc-900
p-4
rounded-xl
border
border-zinc-800
hover:border-blue-500
hover:scale-105
hover:shadow-blue-500/20
transition-all
duration-200
shadow-lg
">

        <p className="text-zinc-400">
            Pinned Notes
        </p>

        <h2 className="text-3xl md:text-4xl font-bold mt-2">
            📌 {pinnedNotes}
        </h2>

    </div>

    <div className="
bg-zinc-900
p-4
rounded-xl
border
border-zinc-800
hover:border-blue-500
hover:scale-105
hover:shadow-blue-500/20
transition-all
duration-200
shadow-lg
">

        <p className="text-zinc-400">
            Tags Used
        </p>

        <h2 className="text-3xl md:text-4xl font-bold mt-2">
            🏷 {totalTags}
        </h2>

    </div>
    </div>


            <div className="mb-6">

    <button
        type="button"
        onClick={() =>
            setShowForm(!showForm)
        }
        className="
bg-blue-600
hover:bg-blue-700
px-6
py-3
rounded-xl
font-semibold
shadow-lg
hover:scale-105
transition-all
duration-200
mb-4
"
    >
        {
            showForm
                ? "▲ Hide Note Form"
                : "➕ Create New Note"
        }
    </button>

    {
        showForm && (

            <form
                onSubmit={
                    editingId
                        ? updateNote
                        : createNote
                }
                className="
bg-zinc-900
p-4 md:p-6
rounded-xl
mb-10
space-y-4
"
            >

                <input
                    type="text"
                    name="title"
                    placeholder="Note Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-zinc-800"
                    required
                />

                <textarea
                    name="content"
                    placeholder="Write your note..."
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-zinc-800"
                    rows="4"
                    required
                />

                <input
                    type="text"
                    name="tag"
                    placeholder="Tag (AI, Programming, College)"
                    value={formData.tag}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-zinc-800"
                />

                <label className="flex items-center gap-2 text-white">

                    <input
                        type="checkbox"
                        checked={formData.pinned}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                pinned: e.target.checked
                            })
                        }
                    />

                    Pin this note

                </label>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded"
                >
                    {
                        editingId
                            ? "Update Note"
                            : "Create Note"
                    }
                </button>

                {
                    editingId && (

                        <button
                            type="button"
                            onClick={() => {

                                setEditingId(null)

                                setFormData({
                                    title: "",
                                    content: "",
                                    pinned: false,
                                    tag: ""
                                })
                            }}
                            className="ml-3 bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded"
                        >
                            Cancel
                        </button>

                    )
                }

            </form>
                    )
    }

</div>

            <div className="mb-6">

                <input
                    type="text"
                    placeholder="🔍 Search notes..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="
w-full
p-4
rounded-xl
bg-zinc-900
border
border-zinc-800
focus:border-blue-500
focus:ring-2
focus:ring-blue-500
outline-none
transition-all
duration-200
shadow-lg
"
                />

               <div className="flex gap-2 flex-wrap mt-5 mb-6">

    {
        tags.map((tag) => (

           <button
    type="button"
    key={tag}
    onClick={() =>
        setSelectedTag(tag)
    }
    className={
        selectedTag === tag
        ? "bg-blue-600 px-4 py-2 rounded"
        : "bg-zinc-800 px-4 py-2 rounded"
    }
>
                {tag}
            </button>

        ))
    }

</div>

            </div>

            <div className="space-y-5">

                {
    sortedNotes.length === 0 && (

        <div className="text-center text-zinc-400 py-10">

            {
                notes.length === 0
                    ? "📝 No notes yet. Create your first note."
                    : "🔍 No notes match your search."
            }

        </div>

    )
}

                {sortedNotes.map((note) => (

                    <div
                        key={note.id}
                        className="
bg-zinc-900
p-4 md:p-5
rounded-xl
border
border-zinc-800
hover:border-blue-500
hover:scale-[1.01]
transition-all
duration-200
shadow-lg
"
                    >

                        <h2 className="text-2xl font-bold">

                            {note.pinned && "📌 "}

                            {note.title}

                        </h2>

                        {
                            note.tag && (

                                <span
                                    className="
                                        inline-block
                                        bg-blue-600
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        mt-2
                                        mb-2
                                    "
                                >
                                    {note.tag}
                                </span>

                            )
                        }

                        {
                            note.created_at && (

                                <p className="text-xs text-zinc-500 mb-2">

                                    Created:
                                    {" "}
                                    {new Date(
                                        note.created_at
                                    ).toLocaleString()}

                                </p>

                            )
                        }

                        <p className="text-zinc-400 mt-2">
                            {
    note.content.length > 250
        ? note.content.slice(0, 250) + "..."
        : note.content
}
                        </p>

                       <div className="flex gap-3 mt-4 flex-wrap">

    <button
        onClick={() => summarizeNote(note)}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
    >
        🧠 Summarize
    </button>

    <button
        onClick={() => exportPDF(note)}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
    >
        📄 Export PDF
    </button>

    <button
        onClick={() => editNote(note)}
        className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
    >
        ✏️ Edit
    </button>

    <button
        onClick={() => deleteNote(note.id)}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
    >
        🗑 Delete
    </button>

</div>

{
    summaries[note.id] && (

        <>

            <button
                onClick={() =>
                    setOpenSummaries(prev => ({
                        ...prev,
                        [note.id]:
                            !prev[note.id]
                    }))
                }
                className="
                mt-3
                text-purple-400
                hover:text-purple-300
                font-medium
                "
            >
                {
                    openSummaries[note.id]
                        ? "▲ Hide Summary"
                        : "▼ Show Summary"
                }
            </button>

            {
                openSummaries[note.id] && (

                    <div
                        className="
                        mt-4
                        bg-zinc-800
                        border-l-4
                        border-purple-500
                        p-4
                        rounded-lg
                        shadow-md
                        "
                    >

                        <h3 className="font-bold text-purple-400 mb-3 text-lg">
                            🧠 AI Summary
                        </h3>

                        <p className="
text-zinc-300
whitespace-pre-wrap
break-words
">
                            {summaries[note.id]}
                        </p>

                    </div>

                )
            }

        </>

    )
}




                       
            

                    </div>

                ))}

            </div>

        </div>
    )
}

export default Dashboard