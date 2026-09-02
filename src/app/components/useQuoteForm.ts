import { useRef, useState, type FormEvent } from 'react';
import type { QuoteFormItem } from './QuoteForm';

type Status = 'idle' | 'loading' | 'success' | 'error';

const MIN_SUBMIT_DELAY_MS = 2500;

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
  const mountedAtRef = useRef(Date.now());

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const submittedTooFast = Date.now() - mountedAtRef.current < MIN_SUBMIT_DELAY_MS;
    if (societeWeb.trim() !== '' || submittedTooFast) {
      setStatus('success');
      return;
    }

    setStatus('loading');

    try {
      const { supabase } = await import('../../lib/supabaseClient');

      const { error } = await supabase.from('devis_requests').insert({
        nom,
        telephone,
        email,
        type_evenement: typeEvenement || null,
        message: message || null,
        items,
        total,
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
    } catch {
      setStatus('error');
    }
  }

  function reset() {
    mountedAtRef.current = Date.now();
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
