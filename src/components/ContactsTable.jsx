import { Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useContext } from 'react';
import ContactsContext from '../contexts/ContactsContext';
import '../scss/main.scss';

// eslint-disable-next-line react/prop-types
const ContactsTable = ({ setOpen, setOpenDeleteDialog }) => {
  const { setContact, contacts, setIsEdit } = useContext(ContactsContext);

  const handleEdit = (data) => {
    setContact({ ...data });
    setOpen(true);
    setIsEdit(true);
  }

  const handleDelete = (data) => {
    setContact({ ...data });
    setOpenDeleteDialog(true);
  }

  const formatDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  }

  return (
    <div className='container'>
      <TableContainer component={Paper} className='table-container'>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" style={{ width: '150px' }}>Name</TableCell>
              <TableCell align="right" style={{ width: '200px' }}>Email</TableCell>
              <TableCell align="right" style={{ width: '150px' }}>Phone</TableCell>
              <TableCell align="right" style={{ width: '150px' }}>Date Created</TableCell>
              <TableCell align="right" style={{ width: '150px' }}>Date Updated</TableCell>
              <TableCell align="right" style={{ width: '150px' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              contacts?.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="right" style={{ width: '150px' }}>{row.name}</TableCell>
                  <TableCell align="right" style={{ width: '200px' }}>{row.email}</TableCell>
                  <TableCell align="right" style={{ width: '150px' }}>{row.phone}</TableCell>
                  <TableCell align="right" style={{ width: '150px' }}>{formatDateTime(row.createdAt)}</TableCell>
                  <TableCell align="right" style={{ width: '150px' }}>{formatDateTime(row.updatedAt)}</TableCell>
                  <TableCell align="right" style={{ width: '150px' }}>
                    <>
                      <IconButton className='row-button' onClick={() => handleEdit(row)}>
                        <Edit />
                      </IconButton>
                      <IconButton className='row-button' onClick={() => handleDelete(row)}>
                        <Delete />
                      </IconButton>
                    </>
                  </TableCell>
                </TableRow>
              ))
            }
            {
              contacts && contacts.length === 0 &&
              <TableRow>
                <TableCell colSpan={6} align="center">No contacts found.</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ContactsTable;