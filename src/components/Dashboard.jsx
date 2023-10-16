import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField, Typography } from '@mui/material';
import { useContext, useLayoutEffect, useState } from "react";
import ContactsContext from '../contexts/ContactsContext';
import '../scss/main.scss';
import { debounce, fetchApi, getAuthHeader, validateEmail } from '../utils';
import ContactsTable from "./ContactsTable";

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const {
        contact,
        setContact,
        contacts,
        setContacts,
        isEdit,
        setIsEdit
    } = useContext(ContactsContext);

    const getContacts = async () => {
        const response = await fetchApi(
            '/contacts',
            'GET',
            getAuthHeader(),
            null,
        );
        console.log('accessToken: ', localStorage.getItem('accessToken'));
        console.log('contacts response', response);
        setContacts(response);
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

    const showSnackbar = (severity, message) => {
        setOpenSnackbar(true);
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);
    };

    const handleSave = async () => {
        const { name, email, phone } = contact;

        if (!validateEmail(email)) {
            showSnackbar('error', 'Please enter a valid email address.');
            return;
        }

        const response = await fetchApi(
            '/contacts',
            'POST',
            getAuthHeader(),
            {
                name: name,
                email: email,
                phone: phone
            },
        );

        console.log('create contact response', response);

        if (response?._id) {
            setContacts([...contacts, response]);
            showSnackbar('success', 'Successfully added contact.');
        }

        resetContact();
        setOpen(false);
    };

    const handleUpdate = async () => {
        const { _id, name, email, phone } = contact;

        if (!validateEmail(email)) {
            showSnackbar('error', 'Please enter a valid email address.');
            return;
        }

        const response = await fetchApi(
            `/contacts/${_id}`,
            'PUT',
            getAuthHeader(),
            {
                _id,
                name,
                email,
                phone
            },
        );

        console.log('update contact response', response);

        const updatedContacts = contacts.map((contact) => {
            if (contact._id === _id) {
                return response;
            }
            return contact;
        });

        setContacts([...updatedContacts]);
        showSnackbar('success', 'Successfully updated contact.');
        setOpen(false);
    };

    const handleDeleteConfirm = async () => {
        const { _id } = contact;
        const response = await fetchApi(
            `/contacts/${_id}`,
            'DELETE',
            getAuthHeader(),
            null,
        );

        console.log('delete contact response', response);

        const updatedContacts = contacts.filter((contact) => contact._id !== _id);
        setContacts([...updatedContacts]);
        showSnackbar('success', 'Successfully deleted contact.');
        setOpenDeleteDialog(false);
    }

    const handleDeleteCancel = () => {
        resetContact();
        setOpenDeleteDialog(false);
    }

    const handleSearch = async (searchTerm) => {
        // Perform some async search operation
        const response = await fetchApi(
            `/contacts/search`,
            'POST',
            getAuthHeader(),
            { searchText: searchTerm },
        );

        console.log('filteredContacts: ', response);
        const data = response.map((contact) => contact.item);
        setContacts([...data]);
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
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
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
            <Typography variant="h4" component="h1" gutterBottom style={{ marginTop: '20px', marginBottom: '20px' }}>
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
                <Button
                    className='no-outline'
                    variant="contained"
                    style={{ height: '40px', alignSelf: 'center' }}
                    onClick={handleOpen}
                    startIcon={<AddIcon />}
                >
                    Create Contact
                </Button>
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