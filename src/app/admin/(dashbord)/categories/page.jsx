import AddCategory from "@/components/admin/categories/AddCategory";
import TableCategories from "@/components/admin/categories/TableCategories";


export default function Categories() {
  return (
      <div className="space-y-6">
        <AddCategory />

        <TableCategories />
      </div>
  );
}