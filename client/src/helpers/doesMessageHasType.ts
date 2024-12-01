import type { Message, MessageType, MessageTypeToMessage } from '@/api/messages';

export const doesMessageHasType = <Type extends MessageType>(
  message: Message,
  type: Type,
): message is MessageTypeToMessage[Type] => message.type === type;
