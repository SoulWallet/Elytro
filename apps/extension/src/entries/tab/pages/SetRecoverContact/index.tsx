import TabLayout from '../../components/TabLayout';
import { useState } from 'react';
import AddReoverContactModal, {
  ContactEnum,
  SubmitDataType,
} from './AddRecoverContactModal';
import AddRecoverResultPage from './AddRecoverResultPage';
import AddRecoverHomePage from './AddRecoverHomePage';

export default function SetRecoverContact() {
  const [addType, setAddType] = useState<string>();
  const [openModal, setOpenModal] = useState(false);
  const [contacts, setContacts] = useState<SubmitDataType[]>([]);
  const openAddModal = (type: string) => {
    setAddType(type);
    setOpenModal(true);
  };
  const onSubmit = (data: SubmitDataType) => {
    setContacts((contacts) => {
      if (data.type === ContactEnum.Wallet && !data.data.guardian) {
        const existedWalletContacts = contacts.filter(
          (c) => c.type === ContactEnum.Wallet
        );
        return contacts.concat([
          {
            type: data.type,
            data: {
              ...data.data,
              guardian: `Recovery contact-${existedWalletContacts.length + 1}`,
            },
          },
        ]);
      }
      return contacts.concat([data]);
    });
  };

  return (
    <TabLayout>
      {contacts.length ? (
        <AddRecoverResultPage
          contacts={contacts}
          openAddModal={openAddModal}
          onBack={() => {
            setContacts([]);
          }}
        />
      ) : (
        <AddRecoverHomePage openAddModal={openAddModal} />
      )}
      {openModal ? (
        <AddReoverContactModal
          contacts={contacts}
          type={addType}
          open={openModal}
          onSubmit={onSubmit}
          handleOnOpenChange={() => setOpenModal(false)}
        />
      ) : null}
    </TabLayout>
  );
}
