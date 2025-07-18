'use client';
import React, { useState } from 'react'
import AddUpdateDeleteDialog from './ImageDialog';

function AddImage() {
    const [showDialog, setShowDialog] = useState(false)
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Image Management</h1>
                <div className="flex items-center space-x-2">
                    <button
                    onClick={() => setShowDialog(true)}
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Add Image
                    </button>
                </div>
            </div>

            {showDialog && <AddUpdateDeleteDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />}
        </div>
    )
}

export default AddImage
