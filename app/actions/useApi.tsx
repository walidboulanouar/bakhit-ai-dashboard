'use client';

import useSWR from 'swr';
import { fetcher } from './server';

export default function useApi(path: string, options?: any) {
  const url = process.env.NEXT_PUBLIC_API_URL + path;

  const { data, error, isLoading } = useSWR(url, fetcher, options);

  return {
    data,
    isLoading,
    error
  };
}
