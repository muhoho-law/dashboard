declare interface DataGridRows {
  id: number;
  name: string;
  description?: string;
}

declare interface IMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

interface TabsItems {
  key: string;
  icon: string;
  label: string;
  description: string;
}

declare interface IApiResponse {
  success: boolean;
  description?: string;
  message?: string;
  data?: any;
}
