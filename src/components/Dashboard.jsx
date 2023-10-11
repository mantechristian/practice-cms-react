import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useContext, useLayoutEffect, useState } from "react";
import { API_URL } from "../config";
import ContactsContext from '../contexts/ContactsContext';
import '../scss/main.scss';
import { debounce } from '../utils';
import ContactsTable from "./ContactsTable";

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const {
        contact,
        setContact,
        contacts,
        setContacts,
        isEdit,
        setIsEdit
    } = useContext(ContactsContext);

    const getContacts = async () => {
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')?.toString()
            }
        });

        console.log('accessToken: ', localStorage.getItem('accessToken'));

        const json = await response.json();
        console.log('contacts response', json);

        setContacts(json);
    }

    useLayoutEffect(() => {
        getContacts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetContact = () => {
        setContact({ _id: null, name: '', email: '', phone: '' });
    }

    const handleOpen = () => {
        resetContact();
        setOpen(true);
        setIsEdit(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        const { name, email, phone } = contact;
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')?.toString()
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone
            })
        });

        const json = await response.json();
        console.log('create contact response', json);

        if (json?._id) {
            setContacts([...contacts, json]);
        }

        resetContact();
        setOpen(false);
    };

    const handleUpdate = async () => {
        const { _id, name, email, phone } = contact;
        const response = await fetch(`${API_URL}/contacts/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')?.toString()
            },
            body: JSON.stringify({
                _id,
                name,
                email,
                phone
            })
        });

        const json = await response.json();
        console.log('update contact response', json);

        const updatedContacts = contacts.map((contact) => {
            if (contact._id === _id) {
                return json;
            }
            return contact;
        });

        setContacts([...updatedContacts]);
        setOpen(false);
    };

    const handleDeleteConfirm = async () => {
        const { _id } = contact;
        const response = await fetch(`${API_URL}/contacts/${_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')?.toString()
            },
        });

        const json = await response.json();
        console.log('delete contact response', json);

        const updatedContacts = contacts.filter((contact) => contact._id !== _id);
        setContacts([...updatedContacts]);
        setOpenDeleteDialog(false);
    }

    const handleDeleteCancel = () => {
        resetContact();
        setOpenDeleteDialog(false);
    }

    const handleSearch = async (searchTerm) => {
        // Perform some async search operation
        const response = await fetch(`${API_URL}/contacts/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')?.toString()
            },
            body: JSON.stringify({
                searchText: searchTerm
            })
        });

        const filteredContacts = await response.json();
        console.log('filteredContacts: ', filteredContacts);
        setContacts([...filteredContacts]);
    };

    const debouncedSearch = debounce(handleSearch, 300);

    const handleInputChange = async (e) => {
        const searchTerm = e.target.value;

        if (searchTerm === '') {
            getContacts();
            return;
        }

        debouncedSearch(searchTerm);
    }

    return (
        <>
            <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
                <DialogTitle>Are you sure you want to delete the contact?</DialogTitle>
                <DialogContent>
                    This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm}>Delete</Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h4" component="h1" gutterBottom>
                Contacts List
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                    autoFocus
                    style={{ width: '40%' }}
                    size='small'
                    margin="dense"
                    label="Search"
                    type="text"
                    fullWidth
                    onChange={handleInputChange}
                />
                <Button className='no-outline' variant="contained" style={{ height: '40px', alignSelf: 'center' }} onClick={handleOpen}>Create Contact</Button>
            </div>
            <ContactsTable
                setOpen={setOpen}
                setOpenDeleteDialog={setOpenDeleteDialog}
                handleDeleteConfirm={handleDeleteConfirm}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEdit ? 'Edit' : 'Create'}&nbsp;Contact</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Phone"
                        type="tel"
                        fullWidth
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={isEdit ? handleUpdate : handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Dashboard;