import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./ChatRoom.css";
const api = axios.create({ baseURL: "https://freelancer-finder.onrender.com" });

export default function ChatRoom() {
  const q = new URLSearchParams(useLocation().search);
  const peerEmail = new URLSearchParams(useLocation().search).get("with");
const peerLabel  = q.get("name") || peerEmail;
  const jobId = q.get("jobId");
  const me = JSON.parse(localStorage.getItem("user") || "{}");

  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  useEffect(() => {
  if (!me.email || !peerEmail || !jobId) return;
  const fetchAll = async () => {
    try {
      const { data } = await api.get("/api/messages", {
        params: { user1: me.email, user2: peerEmail, jobId },
      });
      console.log("Fetched msgs for", me.email, "↔", peerEmail, "job:", jobId, data); 
      setMsgs(data);
    } catch (err) {
      console.error("messages fetch", err);
    }
  };
  fetchAll();
  const id = setInterval(fetchAll, 2500);
  return () => clearInterval(id);
}, [me.email, peerEmail, jobId]);

  const fileURL = (f) => `https://freelancer-finder.onrender.com/uploads/${f}`;
  const isImage = (f) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(f);

  async function handleSend(e) {
    e.preventDefault();
    if (sending) return;
    if (!text.trim() && !file) return;

    const fd = new FormData();
    fd.append("senderEmail", me.email);
    fd.append("receiverEmail", peerEmail);
    fd.append("jobId", jobId);
    fd.append("message", text);
    if (file) fd.append("file", file, file.name);

    try {
      setSending(true);
      const { data } = await api.post("/api/messages", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsgs((prev) => [...prev, data]);
      setText("");
      setFile(null);
    } catch (err) {
      alert("Failed to send. Check server logs.");
      console.error("send", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-wrap">
      <header className="chat-bar">
        <h3>{peerLabel}</h3>
      </header>

      <main className="chat-pane">
        {msgs.map((m) => (
          <div key={m._id || m.timestamp} className={`bubble ${m.senderEmail === me.email ? "me" : "peer"}`}>
            {m.message && <p>{m.message}</p>}
            {m.file && (
              isImage(m.file) ? (
                <img src={fileURL(m.file)} alt="attachment" className="msg-img" />
              ) : (
                <a href={fileURL(m.file)} target="_blank" rel="noreferrer" className="file-link">
                  📎 {m.file.split("/").pop()}
                </a>
              )
            )}
            <span className="time-inline">
              {new Date(m.timestamp || m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </main>

      <form className="input-bar" onSubmit={handleSend}>
        <label className="file-btn" title="Attach file">
          📎
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <input
          type="text"
          placeholder="Message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="send-btn" title="Send" disabled={sending || (!text.trim() && !file)}>
          {sending ? "…" : "➤"}
        </button>
      </form>
    </div>
  );
}