import TableCategories from "@/components/admin/categories/TableCategories";


export default function Categories() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories Management</h1>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Category
            </button>
          </div>
        </div>

        <TableCategories />
      </div>
  );
}