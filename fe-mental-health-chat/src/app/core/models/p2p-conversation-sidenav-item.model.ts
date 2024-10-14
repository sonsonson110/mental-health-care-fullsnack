export interface P2pConversationSidenavItem {
    id: string;
    receiverId: string;
    receiverFullName: string;
    isReveiverOnline: boolean;
    lastMessage: LastMessage;
  }
  
  export interface LastMessage {
    id: string;
    senderId: string;
    senderFullName: string;
    content: string;
    createdAt: string;
    isRead: boolean;
  }
  