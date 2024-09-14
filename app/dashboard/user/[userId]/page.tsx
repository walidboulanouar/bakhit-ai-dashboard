'use client';
import useApi from '@/actions/useApi';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { UserPreferences } from '@/components/layout/preferences';
import { formatPhoneNumber } from '@/utils/format-phone-numebr';
import { AvatarIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import cn from 'classnames';
import dayjs from 'dayjs';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Spinner } from '../../../../components/ui/spinner';

export default function Page({ params }: { params: { userId: string } }) {
  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Users', link: '/dashboard/user' },
    { title: 'Messages', link: `/dashboard/user/${params.userId}` }
  ];

  const { data, isLoading, error } = useApi(
    `user/conversation/${params.userId}`
  );
  const [showPreferences, setShowPreferences] = useState(false);
  // Reference to the last message container
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to top whenever the component mounts or messages change
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.messages]);

  if (isLoading) {
    return <Spinner />;
  }
  if (error) return <div>Error: {error.message}</div>;

  const currentMessages = data?.messages || [];
  const preferences = data?.user?.preferences || {};
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />

        {showPreferences && <UserPreferences preferences={preferences} />}

        <div className="flex h-[80vh] w-full flex-col space-y-4 overflow-hidden rounded-lg bg-slate-700 shadow-md">
          {/* Header Section with User Info */}
          <div className="flex items-center bg-gray-800 p-4">
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
              {data?.user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {data?.user?.name}
              </h2>
              <p className="text-sm text-gray-400">{data?.user?.location}</p>
            </div>
            <div className="ml-auto flex items-center text-white">
              <ChatBubbleIcon className="mr-2 h-5 w-5" />
              <span>Total Messages: {currentMessages?.length}</span>
            </div>
            <div className="ml-auto flex items-center text-white">
              <AvatarIcon className="mr-2 h-4 w-4" />{' '}
              {formatPhoneNumber(data?.user?.phoneNumber)}
            </div>
            <div className="ml-auto flex items-center">
              <Button onClick={() => setShowPreferences(!showPreferences)}>
                {showPreferences ? 'Hide' : 'Show'} Preferences
              </Button>
            </div>

            {/* Optional: Add icons for call or video */}
          </div>

          {/* Chat Messages Container */}
          <div className="flex flex-1 border-separate flex-col overflow-y-auto p-4">
            <div className="flex w-full flex-col space-y-4">
              <div className="flex h-full flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0">
                <div className="chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden">
                  {/* Chat messages container */}
                  <div className="chat-flex flex h-4/5 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4">
                    <div ref={topRef}></div>
                    {currentMessages.map((msg: any, index: number) => {
                      const isUserMessage = msg.senderType === 'AI';
                      const isSameDay =
                        index === 0 ||
                        dayjs(msg.createdAt).isSame(
                          currentMessages[index - 1]?.createdAt,
                          'day'
                        );
                      return (
                        <Fragment key={index}>
                          {/* Date separator */}
                          {!isSameDay && (
                            <div className="text-center text-xs text-gray-500">
                              {dayjs(msg.createdAt).format('D MMM, YYYY')}
                            </div>
                          )}
                          {/* Message bubble */}
                          <div
                            className={cn(
                              'chat-box max-w-72 break-words px-3 py-2 shadow-lg',
                              isUserMessage
                                ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                                : 'self-start rounded-[16px_16px_16px_0] bg-secondary'
                            )}
                          >
                            {msg.content}
                            <span
                              className={cn(
                                'mt-1 block text-xs font-light italic text-muted-foreground',
                                isUserMessage && 'text-right'
                              )}
                            >
                              {dayjs(msg.createdAt).format('D MMM, h:mm a')}
                            </span>
                          </div>
                        </Fragment>
                      );
                    })}
                    {/* This div is used to scroll to the bottom */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
