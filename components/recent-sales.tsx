import useApi from '@/actions/useApi'; // Assuming you have a hook for API calls
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from './ui/spinner';

export function RecentSales() {
  const { isLoading, data: apiData, error } = useApi('user/statistics/all');

  if (isLoading) {
    return <Spinner />;
  }
  if (error) return <div>Error loading recent users</div>;

  // Get the most recent users (assuming most recent is the default order)
  const recentUsers = apiData?.mostActiveUsers.slice(0, 5); // Adjust the number if needed

  return (
    <div className="space-y-8">
      {recentUsers.map((user: any) => (
        <div key={user.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/default.png" alt={user.name} />
            <AvatarFallback>
              {user.name ? user.name[0] : user.phoneNumber.slice(-2)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || 'Unknown User'}
            </p>
            <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
          </div>
          <div className="ml-auto font-medium">
            {user.conversation?._count?.messages} messages
          </div>
        </div>
      ))}
    </div>
  );
}
