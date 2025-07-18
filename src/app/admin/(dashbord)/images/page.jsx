import AddImage from "@/components/admin/image/AddImage";
import TableImages from "@/components/admin/image/ImageTable";


export default function Categories() {
  return (
      <div className="space-y-6">
        <AddImage />

        <TableImages />
      </div>
  );
}