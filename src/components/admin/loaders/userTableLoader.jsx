const UsersTableLoader = () => {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-md p-4 bg-muted animate-pulse"
        >
          {/* Left side: Avatar + Name + Email */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="flex flex-col gap-2">
              <div className="w-24 h-3 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="w-40 h-3 rounded bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>

          {/* Center: Phone */}
          <div className="w-28 h-3 rounded bg-gray-300 dark:bg-gray-700" />

          {/* Time */}
          <div className="w-20 h-3 rounded bg-gray-300 dark:bg-gray-700" />

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersTableLoader;
