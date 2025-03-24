import { IParams, IMessagesResponse, IResultMessages } from "@/types";
import axios, { AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';
const TOKEN = process.env.NEXT_PUBLIC_TOKEN ?? '';

export async function getMessages(params: IParams): Promise<IResultMessages> {
  try {
    const response = await axios.get<IMessagesResponse>(BASE_URL, {
      params,
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    console.log('====================================');
    console.log(response);
    console.log('====================================');

    return {
      questions:
        response?.data?.data?.questions ?? [],
    };
  } catch (error) {
    console.log(error);

    const err = (error as AxiosError);
    if (err.status === 404) {
      return {
        questions: [],
        errorText: 'path not found! Please consult the https://dev.wildberries.ru/openapi/api-information',
      };
    }

    if (err.status === 401) {
      return {
        questions: [],
        errorText: 'Unauthorized! Please check your token',
      };
    }

    const errText = (err.response?.data as IMessagesResponse).errorText;
    return {
      questions: [],
      errorText: errText,
    };
  }
}

export async function updateQuestionAnswer(id: string, answerText: string, state: 'none' | 'wbRu') {
  try {
    const response = await axios.patch(
      BASE_URL,
      {
        id,
        answer: {
          text: answerText
        },
        state
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Ответ на вопрос успешно обновлён:', response.data);
    return response.data;
  } catch (error) {
    const err = (error as AxiosError).response;
    console.log(err?.data);
    console.log(err?.status);
  }
}


