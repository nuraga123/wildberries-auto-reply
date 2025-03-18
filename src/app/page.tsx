// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Функция для получения сообщений с сервера
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/messages?order=desc&dateFrom=0&dateTo=174230668079"
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError("Ошибка при загрузке сообщений");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Сообщения от пользователей</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Сообщение</th>
            <th>Ответ</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{message.id}</td>
              <td>{message.text}</td>
              <td>{message.responseText}</td>
              <td>{new Date(message.createdDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
