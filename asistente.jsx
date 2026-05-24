import { useState, useRef, useEffect } from "react"
import "./App.css"

const webhookUrl = "https://automations.nxerio.com/webhook/chat-web"

function App() {

    const [messages, setMessages] = useState([
        {
            text: "¡Hola! Soy tu asistente de ventas. ¿Qué producto buscas hoy?",
            sender: "bot"
        }
    ])

    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const chatRef = useRef(null)

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMessage = { text: input, sender: "user" }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setLoading(true)

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            })

            const data = await response.json()

            const botMessage = {
                text: data.output || "Lo siento, no pude procesar tu solicitud.",
                sender: "bot"
            }

            setMessages(prev => [...prev, botMessage])

        } catch (error) {
            setMessages(prev => [
                ...prev,
                { text: "Error de conexión con el servidor.", sender: "bot" }
            ])
        }

        setLoading(false)
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div id="chat-container">
            <div id="chat-header">Asistente Amazon RAG</div>

            <div id="chat-messages" ref={chatRef}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === "user"
                            ? "user-message"
                            : "bot-message"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}

                {loading && (
                    <div className="message bot-message typing">
                        Buscando en catálogo...
                    </div>
                )}
            </div>

            <div id="chat-input-container">
                <input
                    type="text"
                    placeholder="Ej: Busco una laptop gamer..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    )
}

export default App