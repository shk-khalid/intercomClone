import { supabase } from './supabase';
import type { Message, ChatHead } from '../types';

export const chatService = {
  async getChats(): Promise<ChatHead[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getChatMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data;
  },

  async sendMessage(chatId: string, message: Omit<Message, 'id'>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ ...message, chat_id: chatId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateChatLastMessage(chatId: string, lastMessage: string): Promise<void> {
    const { error } = await supabase
      .from('chats')
      .update({ last_message: lastMessage, timestamp: new Date() })
      .eq('id', chatId);

    if (error) throw error;
  }
};