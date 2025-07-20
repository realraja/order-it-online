import DialogContext from '@/components/ui/DailogContext';
import { Edit, Plus, Trash2, MapPin, Check } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddUpdateDeleteAddressDialog from './AddUpdateDeleteAddressDialog';

function SelectAddressDialog({ isOpen, onClose, onSubmit }) {
  const { addresses } = useSelector(state => state.auth);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [actionType, setActionType] = useState('add');

  const handleSubmit = () => {
    if (selectedAddress) {
      onSubmit(selectedAddress);
      onClose();
    }
  };

  const handleAddressAction = (address = null, type = 'add') => {
    setAddressToEdit(address);
    setActionType(type);
    setShowAddressForm(true);
  };

  const handleAddressFormSubmit = () => {
    setShowAddressForm(false);
    setAddressToEdit(null);
  };

  return (
    <>
      <DialogContext
        onClose={onClose}
        showDialog={isOpen}
        onSubmit={handleSubmit}
        title="Select Address"
        Icon={MapPin}
        submitText="Select"
        submitDisabled={!selectedAddress}
        closeOnOutsideClick={false}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
          {addresses?.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No addresses saved yet
            </div>
          )}

          {addresses?.map(address => (
            <div
              key={address._id}
              onClick={() => setSelectedAddress(address)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAddress?._id === address._id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {address.name}
                    {address.isDefault && (
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {address.landmark}, {address.city}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {address.state}, {address.country} - {address.zipCode}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Phone: {address.phone}
                  </div>
                </div>

                {selectedAddress?._id === address._id && (
                  <Check className="text-green-500 h-5 w-5" />
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleAddressAction(address, 'update');
                  }}
                  className="text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleAddressAction(address, 'delete');
                  }}
                  className="text-sm flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleAddressAction(null, 'add')}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </button>
      </DialogContext>

      {/* Address Form Dialog */}
      <AddUpdateDeleteAddressDialog
        type={actionType}
        data={addressToEdit}
        isOpen={showAddressForm}
        onClose={handleAddressFormSubmit}
      />
    </>
  );
}

export default SelectAddressDialog;