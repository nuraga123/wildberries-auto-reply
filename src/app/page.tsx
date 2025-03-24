"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getMessages } from "@/api";
import { Message, IForm } from "@/types";

const autoResponse = (message: string) => {
  if (message.includes("Где мой заказ?")) {
    return "Ваш заказ в пути, следите за статусом в личном кабинете Wildberries.";
  } else if (message.includes("Какой размер выбрать?")) {
    return "Ориентируйтесь на размерную сетку в карточке товара.";
  } else {
    return "Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время.";
  }
};

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filterMessages, setFilterMessages] = useState<Message[]>(messages);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<IForm>({
    isAnswered: false,
    order: "dateDesc",
    dateFrom: new Date(2024, 0, 1).getTime(),
    dateTo: Date.now(),
  });

  const formatServerDate = (num: number) => +(num / 1000).toFixed();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const result: Message[] = [];

        const data = await getMessages({
          isAnswered: false,
          order: "dateDesc",
          dateFrom: formatServerDate(new Date(2024, 0, 1).getTime()),
          dateTo: formatServerDate(Date.now()),
          take: 10000,
          skip: 0,
        });

        if (data.errorText) {
          setError(data.errorText);
          return;
        }

        data.questions?.forEach((element) => {
          const { id, text, createdDate } = element;
          const responseText = autoResponse(text);

          result.push({
            id,
            text,
            createdDate,
            responseText,
          });
        });

        setMessages(result);
        setFilterMessages(result);
      } catch (err) {
        console.log(err);
        setError("Ошибка при загрузке сообщений");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result: Message[] = [];
      const { isAnswered, order, dateFrom, dateTo } = form;
      const data = await getMessages({
        isAnswered,
        order,
        dateFrom: formatServerDate(dateFrom),
        dateTo: formatServerDate(dateTo),
        take: 10000,
        skip: 0,
      });

      if (data.errorText) {
        setError(data.errorText);
        return;
      }

      data.questions?.forEach((element) => {
        const { id, text, createdDate } = element;
        const responseText = autoResponse(text);

        result.push({
          id,
          text,
          createdDate,
          responseText,
        });
      });

      setFilterMessages(result);
    } catch (err) {
      console.log(err);
      setError("Ошибка при загрузке сообщений");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      isAnswered: false,
      order: "dateAsc",
      dateFrom: new Date(2024, 0, 1).getTime(),
      dateTo: Date.now(),
    });
  };

  if (loading)
    return (
      <div className={styles.content}>
        <div className={styles.loading}>Загрузка...</div>;
      </div>
    );
  if (error)
    return (
      <div className={styles.content}>
        <h1>Ошибка при загрузке сообщений</h1>
        <div className={styles.error}>{error}</div>;
      </div>
    );

  return (
    <div className={styles.content}>
      <form className={styles.filters} onSubmit={handleSubmit}>
        <h1>Фильтрация сообщений</h1>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={form.isAnswered}
              onChange={(e) =>
                setForm({ ...form, isAnswered: e.target.checked })
              }
            />
            Отвеченные
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Сортировать по дате:
            <select
              className={styles.select}
              value={form.order}
              onChange={(e) => {
                const order =
                  e.target.value === "dateAsc" ? "dateAsc" : "dateDesc";

                setForm({ ...form, order });
              }}>
              <option value="dateDesc">По убыванию</option>
              <option value="dateAsc">По возрастанию</option>
            </select>
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            На дату:
            <input
              type="date"
              className={styles.dateInput}
              value={new Date(form.dateFrom).toISOString().split("T")[0]}
              onChange={(e) =>
                setForm({
                  ...form,
                  dateFrom: new Date(e.target.value).getTime(),
                })
              }
            />
            -
            <input
              type="date"
              className={styles.dateInput}
              value={new Date(form.dateTo).toISOString().split("T")[0]}
              onChange={(e) =>
                setForm({
                  ...form,
                  dateTo: new Date(e.target.value).getTime(),
                })
              }
            />
          </label>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}>
            Сбросить фильтры
          </button>
          <button type="submit" className={styles.submitButton}>
            Обновить
          </button>
        </div>
      </form>

      <h1 className={styles.header}>Сообщения от пользователей</h1>
      {filterMessages.length === 0 ? (
        <div className={styles.error}>Нет сообщений для отображения!</div>
      ) : (
        filterMessages.map((message, index) => (
          <div key={message.id} className={styles.card}>
            <div className={styles["message-id"]}>{`№: ${index + 1})`}</div>
            <div className={styles["message-id"]}>ID: {message.id}</div>
            <div className={styles["message-text"]}>
              <strong>Сообщение: </strong> {message.text}
            </div>
            <div className={styles["response-text"]}>
              <strong>Ответ: </strong>
              {message.responseText || "Нет ответа"}
            </div>
            <div className={styles["created-date"]}>
              Дата: {new Date(message.createdDate).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
