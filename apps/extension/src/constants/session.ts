import logo from '@/assets/logo.svg';

export type TSessionData = {
  name: string;
  url: string;
  icon: string;
};

export const ELYTRO_SESSION_DATA: TSessionData = {
  name: 'Elytro',
  url: 'https://elytro.com',
  icon: logo,
};
