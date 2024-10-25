import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormFieldProps } from './AddContactForm';
import { isAddress } from 'viem';
import { useEffect, useState } from 'react';
import { ContactEnum, SubmitDataType } from './AddRecoverContactModal';
const getEmailFormResolver = (contacts: SubmitDataType[]) =>
  z
    .object({
      email: z
        .string()
        .email({ message: 'Please input a correct email.' })
        .refine(
          (email) => {
            const isExisted = contacts.find((contact) => {
              if (contact.type === ContactEnum.Email) {
                return contact.data.email === email;
              }
              return false;
            });
            return !isExisted;
          },
          { message: 'This Email is already existed!' }
        ),
      confirm: z.string(),
    })
    .refine((data) => data.email === data.confirm, {
      message: "Email addresses don't match",
      path: ['confirm'],
    });

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

// wallet config
const getWalletFormResolver = (contacts: SubmitDataType[]) =>
  z.object({
    address: z
      .string()
      .refine((data) => isAddress(data), {
        message: 'Please input a correct address.',
      })
      .refine(
        (address) => {
          const isExisted = contacts.find((contact) => {
            if (contact.type === ContactEnum.Wallet) {
              return contact.data.address === address;
            }
            return false;
          });
          return !isExisted;
        },
        { message: 'This Address is already existed!' }
      ),
  });

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

export const useRecoverContactForm = (
  type: string,
  contacts: SubmitDataType[]
) => {
  const [formConfig, setFormConfig] = useState<unknown>();
  const getResolver = (formType: string) => {
    if (formType === ContactEnum.Wallet) return getWalletFormResolver(contacts);
    return getEmailFormResolver(contacts);
  };
  const genFormConfig = (formType: string) => {
    const resolver = getResolver(formType);
    const formConfig = {
      resolver: zodResolver(resolver),
      mode: 'onChange',
    };
    setFormConfig(formConfig as unknown as typeof resolver);
  };
  useEffect(() => {
    genFormConfig(type);
  }, [type]);
  return {
    formConfig,
    formFields: type === ContactEnum.Email ? emailFormFields : walletFormFields,
  };
};
