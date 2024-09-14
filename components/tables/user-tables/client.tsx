'use client';

import useApi from '@/actions/useApi';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { Spinner } from '../../ui/spinner';

export const UserClient = () => {
  const router = useRouter();

  const { isLoading, data: apiDAta, error } = useApi('user');


  if (isLoading) {
    return <Spinner />
  }
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Users (${apiDAta.count})`}
          description="Manage users (Client side table functionalities.)"
        />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={apiDAta.data} />
    </>
  );
};
