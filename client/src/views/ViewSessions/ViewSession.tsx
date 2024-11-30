import { BasePage } from '@/components/BasePage';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';

export const ViewSession: FC = () => {
  const { id } = useParams();

  return <BasePage>Session details {id}</BasePage>;
};
