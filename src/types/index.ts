export interface IParams {
  isAnswered: boolean;
  order: "dateAsc" | "dateDesc";
  dateFrom: number;
  dateTo: number;
  take: 10000;
  skip: 0;
}

export interface IProductDetails {
  imtId: number;
  nmId: number;
  productName: string;
  supplierArticle: string;
  supplierName: string;
  brandName: string;
  size: string;
}

export interface IQuestion {
  id: string;
  text: string;
  createdDate: string;
  state: string;
  answer: string | null;
  productDetails: IProductDetails;
  wasViewed: boolean;
  isWarned: boolean;
}

export interface IMessagesData {
  countUnanswered: number;
  countArchive: number;
  questions: IQuestion[];
}

export interface IResultMessages {
  errorText?: string;
  questions?: IQuestion[];
}

export interface IMessagesResponse {
  data: IMessagesData;
  error: boolean;
  errorText: string;
  additionalErrors: null;
}

export interface Message {
  id: string;
  text: string;
  createdDate: string;
  responseText: string;
}

export interface IForm {
  isAnswered: boolean;
  order: "dateAsc" | "dateDesc";
  dateFrom: number;
  dateTo: number;
}
