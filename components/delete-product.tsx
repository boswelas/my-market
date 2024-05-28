"use client"

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import deleteProduct from '@/app/products/[id]/actions';

export default function DeleteProductAlert({ productId }: { productId: number }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const confirmDelete = () => {
        deleteProduct(productId);

    }

    return (
        <React.Fragment>
            <Button onClick={handleClickOpen}
                className="bg-red-500 text-white border-none h-12px-5 py-2.5 rounded-md font-semibold hover:bg-red-500">
                Delete Product
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Product"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure that you want to delete this product? It cannot be retrieved once deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDelete} autoFocus>
                        Yes
                    </Button>
                    <Button onClick={handleClose}>No</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
