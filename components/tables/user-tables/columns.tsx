'use client';
import { User } from '@/constants/data';
import { formatPhoneNumber } from '@/utils/format-phone-numebr';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'location',
    header: 'Location'
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    cell: ({ getValue }) => {
      const phoneNumber = getValue() as string;
      return formatPhoneNumber(phoneNumber);
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined At',
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return dayjs(date).format('DD MMM YYYY, h:mm A');
    }
  }
];
