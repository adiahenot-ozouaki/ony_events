import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useQuoteForm } from './useQuoteForm';
import { agencyInfo } from '../../constants/agency_info';

export interface QuoteFormItem {
  id: string;
  nom: string;
  categorie: string;
  quantite: number;
  prixUnitaire: number;
}

interface QuoteFormProps {
  title?: string;
  subtitle?: string;
  items?: QuoteFormItem[];
  total?: number;
}

export function QuoteForm({
  title = 'Demander un devis',
  subtitle = 'Partagez-nous les détails de votre événement et nous vous contacterons rapidement',
  items = [],
  total = 0,
}: QuoteFormProps) {
  const {
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
  } = useQuoteForm({ items, total });

  if (status === 'success') {
    return (
      <section id="devis" className="py-24 bg-[var(--beige)]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
          <div className="max-w-3xl mx-auto bg-white rounded-lg p-12 shadow-lg text-center">
            <CheckCircle2 size={48} className="text-[var(--gold)] mx-auto mb-4" />
            <h2 className="font-[var(--font-serif)] text-3xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Demande envoyée
            </h2>
            <p className="text-muted-foreground">
              Merci ! Nous avons bien reçu votre demande et nous vous recontactons rapidement.
            </p>
            <button
              onClick={reset}
              className="mt-6 text-sm text-[var(--gold)] hover:underline"
            >
              Envoyer une nouvelle demande
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="devis" className="py-24 bg-[var(--beige)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[var(--font-serif)] text-3xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              {title}
            </h2>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-lg">
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
            >
              <label htmlFor="societe_web">Site web</label>
              <input
                type="text"
                id="societe_web"
                name="societe_web"
                tabIndex={-1}
                autoComplete="off"
                value={societeWeb}
                onChange={(e) => setSocieteWeb(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="nom" className="block mb-2 text-sm">Nom complet</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  autoComplete="name"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label htmlFor="telephone" className="block mb-2 text-sm">Téléphone</label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  autoComplete="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  placeholder="+241 01 23 45 67"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                placeholder="jean.dupont@example.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="type_evenement" className="block mb-2 text-sm">Type d'événement</label>
              <select
                id="type_evenement"
                name="type_evenement"
                value={typeEvenement}
                onChange={(e) => setTypeEvenement(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              >
                <option value="">Sélectionnez un type</option>
                <option value="Mariage">Mariage</option>
                <option value="Conférence">Conférence</option>
                <option value="Cérémonie">Cérémonie</option>
                <option value="Événement corporatif">Événement corporatif</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 text-sm">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"
                placeholder="Décrivez votre événement, le nombre d'invités, la date souhaitée..."
              />
            </div>

            {status === 'error' && (
              <div className="mb-6 flex items-start gap-2 text-sm text-destructive">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>
                  L'envoi a échoué. Réessayez, ou contactez-nous directement à {agencyInfo.email}.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[var(--gold)] text-white py-4 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}</span>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
