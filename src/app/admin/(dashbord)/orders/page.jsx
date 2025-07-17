import TableOrders from "@/components/admin/orders/TableOrders";


export default function Orders() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
        </div>

        <TableOrders />
      </div>
  );
}