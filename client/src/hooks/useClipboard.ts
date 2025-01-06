import { useNotifications } from '@/contexts/notifications';
import { useClipboard as _useClipBoard } from '@reactuses/core';

export const useClipboard: typeof _useClipBoard = () => {
  const { notify } = useNotifications();
  const [text, _copy] = _useClipBoard();

  return [text, (text) => _copy(text).then(() => notify.info({ title: 'Скопировано!', description: text }))];
};
