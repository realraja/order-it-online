
import TableUsers from "@/components/admin/users/TableUsers";
 
export default function Users() {



  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
        </div>

        <TableUsers />

      </div>
  );
}