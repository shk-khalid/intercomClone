import { supabase } from './supabase';
import type { CopilotSuggestion } from '../types';

export const copilotService = {
  async getAnalysis(chatId: string): Promise<{
    sentiment: string;
    topics: string[];
    actionItems: string[];
  }> {
    const { data, error } = await supabase
      .from('chat_analysis')
      .select('*')
      .eq('chat_id', chatId)
      .single();

    if (error) throw error;
    return data;
  },

  async getSuggestions(context: string): Promise<CopilotSuggestion[]> {
    const { data, error } = await supabase
      .rpc('get_response_suggestions', { context });

    if (error) throw error;
    return data;
  },

  async saveSuggestion(suggestion: Omit<CopilotSuggestion, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('suggestions')
      .insert([suggestion]);

    if (error) throw error;
  }
};