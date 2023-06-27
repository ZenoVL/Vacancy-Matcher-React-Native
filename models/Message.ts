export interface Message {
    id: string;
    isRead: boolean;
    content: string;
    createdAt: string;
    chatId: string;
    senderId: string;
}