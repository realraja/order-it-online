import AddProduct from '@/components/admin/products/AddProduct';
import TableProducts from '@/components/admin/products/TableProducts';

export default function Products() {


  return (
      <div className="space-y-6">

        <AddProduct />

        <TableProducts />

      </div>
  );
}