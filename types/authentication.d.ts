declare interface ILoginResponse {
  success: boolean;
  message: string;
  user: IUserFormState;
  token: string;
}

declare interface IUserFormState {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  account_id: string;
  role: string;
  image_url: string;
  family_id: null;
}
