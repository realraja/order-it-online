'use client'
import { useEffect, useState } from 'react';
import {
  Trash2, ChevronUp, ChevronDown, Search, Eye, Copy, Phone, ShoppingCart, CalendarPlus, CalendarDays,
  Mail, UserRound, MessageSquareText, X
} from 'lucide-react';
import { useDeleteUserMutation, useGetUserDataQuery } from '@/redux/api/admin';
import moment from 'moment';
import { useAsyncMutation } from '@/hook/mutationHook';
import DialogContext from '@/components/ui/DailogContext';
import { FiUser } from 'react-icons/fi';
import UsersTableLoader from '../loaders/userTableLoader';
import DialogContextSimple from '@/components/ui/SimpleDialogContext';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function TableUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [deleteUserDialog, setDeleteUserDialog] = useState({ show: false, id: null });
  const [showUserInfo, setShowUserInfo] = useState({ show: false, data: {} })
  const [usersPerPage, setUsersPerPage] = useState(10)

  const { data, isLoading } = useGetUserDataQuery();
  const [deleteUser] = useAsyncMutation(useDeleteUserMutation);


  useEffect(() => {
    setUsers(data?.data?.users || []);
  }, [data]);

  // Filter and Sort Logic
  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


  const handleDeleteUser = async (id) => {
    setDeleteUserDialog((pre) => ({ show: false, id: pre.id }))
    await deleteUser(deleteUserDialog.id, 'Deleting User!');
    setDeleteUserDialog({ show: false, id: null })
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        </div>
      </div>

      {isLoading ? <UsersTableLoader /> : <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortConfig.key === 'name' &&
                    (sortConfig.direction === 'ascending' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                Phone
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer"
                onClick={() => requestSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Joined Date</span>
                  {sortConfig.key === 'createdAt' &&
                    (sortConfig.direction === 'ascending' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <Image
                      height={50}
                      width={50}
                      className="h-10 w-10 rounded-full"
                      src={user.imgUrl}
                      alt={user.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {user.phone || 'N/A'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {moment(user.createdAt).fromNow()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => setShowUserInfo({ show: true, data: user })}
                    className="mr-3 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button onClick={() => setDeleteUserDialog({ show: true, id: user._id })} className="text-red-600 cursor-pointer hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {/* Pagination */}
      <div className="bg-gray-50 px-6 py-3 dark:bg-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Showing {indexOfFirstUser + 1} to{' '}
          {Math.min(indexOfLastUser, filteredUsers.length)} of{' '}
          {filteredUsers.length} users
        </div>
        <div>
          <input type="number" value={usersPerPage} onChange={(e) => setUsersPerPage(e.target.value)} />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>


      {/* confirm delete user dialog */}
      {
        deleteUserDialog && <DialogContext showDialog={deleteUserDialog.show} onClose={() => setDeleteUserDialog({ show: false, id: null })} title="Delete User" submitText="Delete" onSubmit={handleDeleteUser} Icon={FiUser}  >

          <p className="">Are you sure you want to Delete User?</p>

        </DialogContext>
      }
      {/*  user info dialog */}
      {
        deleteUserDialog && <DialogContextSimple
          showDialog={showUserInfo.show}
          onClose={() => setShowUserInfo({ show: false, data: {} })}
          overlayClassName="backdrop-blur-sm"
        >
          {showUserInfo?.data && (
            <div className="p-0 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out">
              {/* Profile Header with Gradient Background */}
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 pt-12 pb-8">
                <div className="absolute -bottom-6 left-6">
                  <div className="relative group">
                    <Image
                      height={50}
                      width={50}
                      src={showUserInfo.data.imgUrl}
                      alt={showUserInfo.data.name}
                      className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-white/30 transition-all duration-300" />
                  </div>
                </div>
                <div className="ml-28 mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-blue-100" />
                    <h2 className="text-xl font-bold text-white capitalize">{showUserInfo.data.name}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-100" />
                    <p onClick={() => { navigator.clipboard.writeText(showUserInfo.data.email); toast('Copied!'); }} className="text-blue-100 text-sm cursor-pointer hover:text-blue-400">{showUserInfo.data.email}  </p>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="mt-8 space-y-5 p-6">
                {/* User ID Section */}
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User ID</p>
                    <button
                      onClick={() => { navigator.clipboard.writeText(showUserInfo.data._id); toast('Copied!'); }}
                      className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="text-xs">Copy</span>
                    </button>
                  </div>
                  <p className="mt-1 text-sm font-mono break-all dark:text-gray-200">{showUserInfo.data._id}</p>
                </div>

                {/* Grid Info Section */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard
                    label="Phone"
                    value={showUserInfo.data.phone ?? "N/A"}
                    icon={<Phone className="h-4 w-4" />}
                  />
                  <InfoCard
                    label="Cart Items"
                    value={showUserInfo.data.cartItems?.length || 0}
                    icon={<ShoppingCart className="h-4 w-4" />}
                  />
                  <InfoCard
                    label="Created"
                    value={moment(showUserInfo.data.createdAt).fromNow()}
                    icon={<CalendarPlus className="h-4 w-4" />}
                  />
                  <InfoCard
                    label="Updated"
                    value={moment(showUserInfo.data.updatedAt).fromNow()}
                    icon={<CalendarDays className="h-4 w-4" />}
                  />
                </div>

                {/* Additional Actions */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setShowUserInfo({ show: false, data: {} })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContextSimple>

      }
    </div>
  );
}






const InfoCard = ({ label, value, icon }) => (
  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
      {icon}
      <p className="text-xs font-medium uppercase tracking-wider">{label}</p>
    </div>
    <p className="mt-1 text-sm font-medium dark:text-white">{value}</p>
  </div>
);