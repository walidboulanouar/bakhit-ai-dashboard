import {
  CheckCircleIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XCircleIcon
} from 'lucide-react';

export function UserPreferences({ preferences }: { preferences: any }) {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        User Preferences
      </h2>

      {/* Single Card containing all categories */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Dynamically render each category */}
          {Object.entries(preferences).map(
            ([category, data]: [string, any], index: number) => (
              <div
                key={category}
                className="space-y-4 border-r border-gray-300"
              >
                <h3 className="text-lg font-medium capitalize text-gray-800">
                  {category}
                </h3>
                <div className="flex justify-between space-x-6">
                  {/* Likes Section */}
                  <div className="w-full">
                    <h4 className="text-md flex items-center font-semibold text-green-600">
                      <ThumbsUpIcon className="mr-2 h-5 w-5" /> Likes
                    </h4>
                    <ul className="mt-2 list-none space-y-2 text-gray-600">
                      {data.likes && data.likes.length > 0 ? (
                        data.likes.map((like: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <CheckCircleIcon className="mr-2 h-4 w-4 text-green-600" />
                            {like}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No likes</li>
                      )}
                    </ul>
                  </div>

                  {/* Dislikes Section */}
                  <div className="w-full">
                    <h4 className="text-md flex items-center font-semibold text-red-600">
                      <ThumbsDownIcon className="mr-2 h-5 w-5" /> Dislikes
                    </h4>
                    <ul className="mt-2 list-none space-y-2 text-gray-600">
                      {data.dislikes && data.dislikes.length > 0 ? (
                        data.dislikes.map((dislike: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <XCircleIcon className="mr-2 h-4 w-4 text-red-600" />
                            {dislike}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No dislikes</li>
                      )}
                    </ul>
                  </div>
                </div>{' '}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
