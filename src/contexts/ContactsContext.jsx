import { createContext, useState } from 'react';

const ContactsContext = createContext();

// eslint-disable-next-line react/prop-types
export const ContactsProvider = ({ children }) => {
    const [contact, setContact] = useState('');
    const [contacts, setContacts] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    const contextValue = {
        contact,
        setContact,
        contacts,
        setContacts,
        isEdit,
        setIsEdit,
    };

    return (
        <ContactsContext.Provider value={contextValue}>
            {children}
        </ContactsContext.Provider>
    );
};

export default ContactsContext;