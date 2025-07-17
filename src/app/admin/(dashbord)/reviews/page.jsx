// pages/admin/reviews.js

import TableReviews from "@/components/admin/reviews/TableReviews";

export default function Reviews() {
  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews Management</h1>
        </div>

        <TableReviews />
      </div>
  );
}