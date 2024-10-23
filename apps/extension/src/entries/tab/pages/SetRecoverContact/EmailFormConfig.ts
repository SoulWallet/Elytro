import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormFieldProps } from './AddContactForm';
import { isAddress } from 'viem';
const emailFormResolver = z
  .object({
    email: z.string().email({ message: 'Please input a correct email.' }),
    confirm: z.string(),
  })
  .refine((data) => data.email === data.confirm, {
    message: "Email addresses don't match",
    path: ['confirm'],
  });

const emailForm = {
  resolver: zodResolver(emailFormResolver),
  mode: 'onChange',
};

const emailFormFields: FormFieldProps[] = [
  {
    name: 'email',
    placeholder: 'Enter your email',
    description:
      'Please make sure the email format doesn’t contain captial letters, symbols, and space. Refer to your email portal for the universal format',
  },
  {
    name: 'confirm',
    placeholder: 'Re-enter your email',
  },
];

const onEmailSubmit = async (data: z.infer<typeof emailFormResolver>) => {
  console.log(data);
};

// wallet config
const walletFormResolver = z.object({
  address: z
    .string()
    .refine((data) => isAddress(data), {
      message: 'Please input a correct address.',
    }),
  guardian: z.string(),
});

const walletForm = {
  resolver: zodResolver(walletFormResolver),
  mode: 'onChange',
};

const walletFormFields: FormFieldProps[] = [
  {
    name: 'address',
    placeholder: 'Enter your ENS or wallet address',
    label: 'ENS or wallet address',
  },
  {
    name: 'guardian',
    placeholder: 'Guardian name',
    label: 'Recovery contact name (optional)',
  },
];

const onWalletSubmit = async (data: z.infer<typeof walletFormResolver>) => {
  console.log(data);
};

export default {
  Email: {
    form: emailForm,
    fields: emailFormFields,
    handleSubmit: onEmailSubmit,
  },
  Wallet: {
    form: walletForm,
    fields: walletFormFields,
    handleSubmit: onWalletSubmit,
  },
};
