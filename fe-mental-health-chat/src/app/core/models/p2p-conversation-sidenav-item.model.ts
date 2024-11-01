export interface P2pConversationSidenavItem {
    id: string;
    receiverId: string;
    receiverFullName: string;
    isReceiverOnline: boolean;
    lastMessage: LastMessage;
  }

  export interface LastMessage {
    id: string;
    senderId: string;
    senderFullName: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
  }
