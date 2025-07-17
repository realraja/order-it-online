import React from 'react'

function ResetPasswordSuspenseLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl border shadow-lg overflow-hidden backdrop-blur-sm 
          bg-gray-100 border-gray-200 dark:bg-gray-800/70 dark:border-gray-700">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                    <h1 className="text-2xl font-bold text-white text-center animate-pulse">
                        Reset Your Password
                    </h1>
                </div>

                {/* Form skeleton */}
                <div className="p-6 space-y-6">
                    {/* Password Input */}
                    <div>
                        <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Password Requirements */}
                    <div className="p-4 rounded-lg border bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600">
                        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-3"></div>
                        <ul className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <li key={i} className="flex items-center">
                                    <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse mr-2"></div>
                                    <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <div className="h-12 w-full bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordSuspenseLoader
