'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutationHook();

  const executeMutation = async (data,toastMessage) => {
    setIsLoading(true);
    
    const toastId = toast.loading(toastMessage || 'Updating data...',{position:'bottom-right'});

    try {
      const res = await mutate(data);
      if (res?.data) {
        toast.update(toastId, {
          render: res.data.message || 'Updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          position:'bottom-right'
        });
        setData(res.data);
      } else {
        console.log(res)
        toast.update(toastId, {
          render: res?.error?.data?.error ?res?.error?.data?.error: res?.error?.data?.message  ? res?.error?.data?.message : 'Update failed!',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
          position:'bottom-right'
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: 'Something went wrong!',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        position:'bottom-right'
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};
