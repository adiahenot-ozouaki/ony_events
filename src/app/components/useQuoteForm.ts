import { useState, type FormEvent } from 'react';
import type { QuoteFormItem } from './QuoteForm';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseQuoteFormOptions {
  items: QuoteFormItem[];
  total: number;
}

export function useQuoteForm({ items, total }: UseQuoteFormOptions) {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [typeEvenement, setTypeEvenement] = useState('');
  const [message, setMessage] = useState('');
  const [societeWeb, setSocieteWeb] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (societeWeb.trim() !== '') {
      setStatus('success');
      return;
    }

    setStatus('loading');

    try {
      const { supabase } = await import('../../lib/supabaseClient');

      const { error } = await supabase.functions.invoke('submit-devis', {
        body: {
          nom,
          telephone,
          email,
          type_evenement: typeEvenement || null,
          message: message || null,
          items,
          total,
          societe_web: societeWeb,
        },
      });

      if (error) {
        setStatus('error');
        return;
      }

      setStatus('success');
      setNom('');
      setTelephone('');
      setEmail('');
      setTypeEvenement('');
      setMessage('');
      setSocieteWeb('');
    } catch {
      setStatus('error');
    }
  }

  function reset() {
    setStatus('idle');
  }

  return {
    nom,
    setNom,
    telephone,
    setTelephone,
    email,
    setEmail,
    typeEvenement,
    setTypeEvenement,
    message,
    setMessage,
    societeWeb,
    setSocieteWeb,
    status,
    handleSubmit,
    reset,
  };
}
